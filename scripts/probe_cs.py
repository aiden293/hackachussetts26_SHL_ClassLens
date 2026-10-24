"""Targeted probe: find CS subject codes, instructor fields, and term coverage."""

import os
import psycopg
from dotenv import load_dotenv

HERE = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(HERE, "catalog.env"))


def conn():
    return psycopg.connect(
        host=os.environ["CATALOG_DB_HOST"],
        port=int(os.environ.get("CATALOG_DB_PORT", "5432")),
        dbname=os.environ["CATALOG_DB_NAME"],
        user=os.environ["CATALOG_DB_USER"],
        password=os.environ["CATALOG_DB_PASSWORD"],
        sslmode=os.environ.get("CATALOG_DB_SSLMODE", "require"),
        connect_timeout=30,
    )


def run(c, label, sql):
    print(f"\n=== {label} ===")
    try:
        cur = c.execute(sql)
        cols = [d.name for d in cur.description] if cur.description else []
        if cols:
            print("cols:", cols)
        for row in cur.fetchall():
            print(" ", row)
    except Exception as exc:  # noqa: BLE001
        print("  ERROR:", exc)


def main():
    with conn() as c:
        # 1. Which subject codes contain "CS"?
        run(
            c,
            "distinct subjects containing CS",
            "SELECT DISTINCT subject FROM courses WHERE subject ILIKE '%CS%' ORDER BY subject",
        )
        # 2. All columns actually present in sections (full list)
        run(
            c,
            "sections columns (full)",
            """SELECT column_name FROM information_schema.columns
               WHERE table_name='sections' ORDER BY ordinal_position""",
        )
        # 3. Any column anywhere that looks like an instructor?
        run(
            c,
            "columns mentioning instructor/professor/faculty/teacher",
            """SELECT table_name, column_name FROM information_schema.columns
               WHERE column_name ILIKE '%instructor%' OR column_name ILIKE '%professor%'
                  OR column_name ILIKE '%faculty%' OR column_name ILIKE '%teacher%'
                  OR column_name ILIKE '%name%'
               ORDER BY table_name, column_name""",
        )
        # 4. Sample CS courses (CASCS)
        run(
            c,
            "sample CASCS courses",
            """SELECT subject, catalog_number, title, term_code
               FROM courses WHERE subject = 'CASCS'
               ORDER BY catalog_number LIMIT 10""",
        )
        # 5. How many CASCS rows, and which terms
        run(
            c,
            "CASCS count by term",
            """SELECT term_code, COUNT(*) FROM courses
               WHERE subject='CASCS' GROUP BY term_code ORDER BY term_code""",
        )


if __name__ == "__main__":
    main()
