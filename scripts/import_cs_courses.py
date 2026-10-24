"""
Import CAS CS courses from the BU Course Catalog DB into a JSON file.

Pulls subject = 'CASCS' courses (course name, number, description, credits,
term) plus their meeting schedule, and writes scripts/out/cs_courses.json.

The catalog has NO instructor/professor field, so professor is left as "Staff".
Coverage is Fall 2026 (term 2268) + Spring 2027 (term 2271) only — the dataset
is current offerings, not a historical catalog.

Run on the BU VPN with scripts/catalog.env filled in:
    python scripts/import_cs_courses.py
"""

import json
import os
from collections import defaultdict

import psycopg
from dotenv import load_dotenv

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "out")
load_dotenv(os.path.join(HERE, "catalog.env"))

SUBJECT = "CASCS"


def connect():
    return psycopg.connect(
        host=os.environ["CATALOG_DB_HOST"],
        port=int(os.environ.get("CATALOG_DB_PORT", "5432")),
        dbname=os.environ["CATALOG_DB_NAME"],
        user=os.environ["CATALOG_DB_USER"],
        password=os.environ["CATALOG_DB_PASSWORD"],
        sslmode=os.environ.get("CATALOG_DB_SSLMODE", "require"),
        connect_timeout=30,
    )


def fmt_time(raw: str | None) -> str | None:
    """Catalog stores times like '15.30.00.000000' -> '15:30'."""
    if not raw:
        return None
    parts = raw.split(".")
    if len(parts) >= 2:
        return f"{parts[0]}:{parts[1]}"
    return raw


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)

    with connect() as conn:
        # Term code -> human label.
        terms = {
            code: desc
            for code, desc in conn.execute(
                "SELECT DISTINCT term_code, description FROM terms"
            ).fetchall()
        }

        # All CASCS courses across available terms.
        course_rows = conn.execute(
            """
            SELECT course_key, term_code, subject, catalog_number, title,
                   description, college, units_minimum, units_maximum
            FROM courses
            WHERE subject = %s
            ORDER BY catalog_number, term_code
            """,
            (SUBJECT,),
        ).fetchall()

        # Sections for CASCS, keyed by course_key -> list of section_key.
        section_rows = conn.execute(
            """
            SELECT s.course_key, s.section_key, s.section, s.credits,
                   s.section_type, s.instruction_type, s.campus
            FROM sections s
            JOIN courses c ON c.course_key = s.course_key
            WHERE c.subject = %s
            """,
            (SUBJECT,),
        ).fetchall()

        sections_by_course = defaultdict(list)
        section_keys = []
        for row in section_rows:
            (course_key, section_key, section, credits, stype, itype, campus) = row
            sections_by_course[course_key].append(
                {
                    "sectionKey": section_key,
                    "section": section,
                    "credits": credits,
                    "sectionType": stype,
                    "instructionType": itype,
                    "campus": campus,
                }
            )
            section_keys.append(section_key)

        # Meetings for those sections -> schedule entries.
        meetings_by_section = defaultdict(list)
        if section_keys:
            meeting_rows = conn.execute(
                """
                SELECT m.section_key, m.day, m.start_time, m.end_time,
                       m.building, m.room, m.facility
                FROM meetings m
                JOIN sections s ON s.section_key = m.section_key
                JOIN courses c ON c.course_key = s.course_key
                WHERE c.subject = %s
                """,
                (SUBJECT,),
            ).fetchall()
            for (skey, day, start, end, building, room, facility) in meeting_rows:
                meetings_by_section[skey].append(
                    {
                        "day": day,
                        "start": fmt_time(start),
                        "end": fmt_time(end),
                        "building": building,
                        "room": room,
                        "facility": facility,
                    }
                )

    # Collapse per-term course rows into one entry per catalog number,
    # tracking which terms it's offered and attaching schedule from sections.
    by_number: dict[str, dict] = {}
    for row in course_rows:
        (
            course_key,
            term_code,
            subject,
            catalog_number,
            title,
            description,
            college,
            units_min,
            units_max,
        ) = row

        entry = by_number.get(catalog_number)
        if entry is None:
            entry = {
                "subject": subject,  # CASCS
                "catalogNumber": catalog_number,
                "code": f"CAS CS {catalog_number}",
                "title": title,
                "description": description or "",
                "college": college,
                "unitsMin": units_min,
                "unitsMax": units_max,
                "terms": [],
                "schedule": [],
            }
            by_number[catalog_number] = entry

        term_label = terms.get(term_code, term_code)
        if term_label not in entry["terms"]:
            entry["terms"].append(term_label)

        # Attach schedule from this term's sections.
        for sec in sections_by_course.get(course_key, []):
            for meet in meetings_by_section.get(sec["sectionKey"], []):
                sched = {
                    "term": term_label,
                    "section": sec["section"],
                    "sectionType": sec["sectionType"],
                    "instructionType": sec["instructionType"],
                    "campus": sec["campus"],
                    **meet,
                }
                entry["schedule"].append(sched)

    courses = sorted(by_number.values(), key=lambda c: c["catalogNumber"])

    out_path = os.path.join(OUT_DIR, "cs_courses.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "source": "BU Course Catalog (hackathon DB), subject=CASCS",
                "note": "Current offerings only (Fall 2026 + Spring 2027). No instructor data in source.",
                "count": len(courses),
                "courses": courses,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )

    print(f"Wrote {len(courses)} CAS CS courses -> {out_path}")
    # Quick preview.
    for c in courses[:8]:
        terms_str = ", ".join(c["terms"])
        print(f"  CAS CS {c['catalogNumber']:<5} {c['title'][:50]:<50} [{terms_str}] "
              f"({len(c['schedule'])} schedule entries)")


if __name__ == "__main__":
    main()
