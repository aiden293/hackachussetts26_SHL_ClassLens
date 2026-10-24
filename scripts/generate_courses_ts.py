"""
Transform scripts/out/cs_courses.json into the TypeScript `sampleCourses`
array and write it to scripts/out/sampleCourses.generated.ts.

Preserves existing review metadata (rating/reviewsCount/ownerId) for the few
demo courses that already have reviews, keyed by course id. All other courses
get rating 0 / reviewsCount 0 and professor "Staff" (the catalog has no
instructor data).
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "out", "cs_courses.json")
OUT = os.path.join(HERE, "out", "sampleCourses.generated.ts")

# Courses with seeded reviews keep their aggregate rating/count in sync here so
# a regenerate doesn't wipe them. (The catalog itself has no review data.)
# id -> (rating, reviewsCount, ownerId)
REVIEWED: dict[str, tuple[float, int, str | None]] = {
    "cas-cs-111": (3.9, 12, None),
}


def course_id(catalog_number: str) -> str:
    return f"cas-cs-{catalog_number.lower()}"


def semester_label(terms: list[str]) -> str:
    """Condense catalog term labels into a short 'Fall & Spring' style string."""
    has_fall = any("Fall" in t for t in terms)
    has_spring = any("Spring" in t for t in terms)
    if has_fall and has_spring:
        return "Fall & Spring"
    if has_fall:
        return "Fall"
    if has_spring:
        return "Spring"
    return ", ".join(terms) if terms else "Not scheduled"


def ts_string(value: str | None) -> str:
    if value is None:
        return "null"
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r", " ")
        .replace("\n", " ")
        .replace("\t", " ")
    )
    # Collapse runs of whitespace left by newline removal.
    escaped = " ".join(escaped.split())
    return f'"{escaped}"'


def main() -> None:
    data = json.load(open(SRC, encoding="utf-8"))
    courses = data["courses"]

    lines: list[str] = []
    lines.append("// AUTO-GENERATED from the BU Course Catalog (subject=CASCS).")
    lines.append("// Source: scripts/out/cs_courses.json via scripts/generate_courses_ts.py")
    lines.append("// Coverage: Fall 2026 + Spring 2027. No instructor data in source (professor = \"Staff\").")
    lines.append("// Paste this array into src/lib/data/courses.ts as `sampleCourses`.")
    lines.append("")
    lines.append("export const sampleCourses: Course[] = [")

    for c in courses:
        num = c["catalogNumber"]
        cid = course_id(num)
        rating, reviews, owner = REVIEWED.get(cid, (0, 0, None))
        credits = c.get("unitsMax") or c.get("unitsMin") or "4"
        try:
            credits_num = int(float(credits))
        except (TypeError, ValueError):
            credits_num = 4

        lines.append("  {")
        lines.append(f'    id: "{cid}",')
        lines.append('    college: "CAS",')
        lines.append('    department: "CS",')
        lines.append(f'    number: "{num}",')
        lines.append(f'    code: "CAS CS {num}",')
        lines.append(f"    title: {ts_string(c['title'])},")
        lines.append(f"    credits: {credits_num},")
        lines.append('    professor: "Staff",')
        if owner:
            lines.append(f'    ownerId: "{owner}",')
        lines.append(f"    description: {ts_string(c['description'])},")
        lines.append(f"    rating: {rating},")
        lines.append(f"    reviewsCount: {reviews},")
        lines.append('    level: "Undergraduate",')
        lines.append(f"    semester: {ts_string(semester_label(c['terms']))},")

        # Schedule array.
        sched = c.get("schedule", [])
        if sched:
            lines.append("    schedule: [")
            for s in sched:
                parts = [
                    f"term: {ts_string(s['term'])}",
                    f"section: {ts_string(s['section'])}",
                    f"sectionType: {ts_string(s['sectionType'])}",
                    f"instructionType: {ts_string(s['instructionType'])}",
                    f"campus: {ts_string(s['campus'])}",
                    f"day: {ts_string(s['day'])}",
                    f"start: {ts_string(s['start'])}",
                    f"end: {ts_string(s['end'])}",
                    f"building: {ts_string(s['building'])}",
                    f"room: {ts_string(s['room'])}",
                    f"facility: {ts_string(s['facility'])}",
                ]
                lines.append("      { " + ", ".join(parts) + " },")
            lines.append("    ],")
        else:
            lines.append("    schedule: [],")

        lines.append("  },")

    lines.append("];")
    lines.append("")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Wrote {len(courses)} courses -> {OUT}")


if __name__ == "__main__":
    main()
