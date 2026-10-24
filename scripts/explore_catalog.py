"""
Explore the BU Course Catalog Postgres DB to learn its schema.

Run this FIRST (on the BU VPN, with catalog.env filled in). It prints the
columns of each view and a few sample CS rows, so we can build the importer
around the real schema instead of guessing.

Usage:
    1. pip install -r scripts/requirements.txt
    2. Copy scripts/catalog.env.example -> scripts/catalog.env and paste the password
    3. Connect to the BU VPN (2FA)
    4. python scripts/explore_catalog.py

Read-only queries only. Respects the access rules (no writes, small LIMITs).
"""

import os
import sys

import psycopg
from dotenv import load_dotenv

HERE = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(HERE, "catalog.env"))

VIEWS = ["courses", "dataset_info", "meetings", "sections", "terms"]


def connect() -> psycopg.Connection:
    required = [
        "CATALOG_DB_HOST",
        "CATALOG_DB_NAME",
        "CATALOG_DB_USER",
        "CATALOG_DB_PASSWORD",
    ]
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        print(f"Missing env vars: {', '.join(missing)}")
        print("Copy scripts/catalog.env.example to scripts/catalog.env and fill it in.")
        sys.exit(1)

    return psycopg.connect(
        host=os.environ["CATALOG_DB_HOST"],
        port=int(os.environ.get("CATALOG_DB_PORT", "5432")),
        dbname=os.environ["CATALOG_DB_NAME"],
        user=os.environ["CATALOG_DB_USER"],
        password=os.environ["CATALOG_DB_PASSWORD"],
        sslmode=os.environ.get("CATALOG_DB_SSLMODE", "require"),
        connect_timeout=30,
    )


def print_columns(conn: psycopg.Connection, view: str) -> None:
    """Print column names + types for a view, trying common schemas."""
    print(f"\n{'=' * 60}\nVIEW: {view}\n{'=' * 60}")
    rows = conn.execute(
        """
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = %s
        ORDER BY ordinal_position
        """,
        (view,),
    ).fetchall()
    if not rows:
        print("  (no columns found — view name or schema may differ)")
        return
    for name, dtype in rows:
        print(f"  {name:<30} {dtype}")


def print_sample(conn: psycopg.Connection, view: str, limit: int = 3) -> None:
    """Print a few sample rows from a view."""
    try:
        cur = conn.execute(f"SELECT * FROM {view} LIMIT {limit}")
        cols = [d.name for d in cur.description] if cur.description else []
        rows = cur.fetchall()
        print(f"\n  --- sample rows from {view} (cols: {', '.join(cols)}) ---")
        for row in rows:
            print(f"  {row}")
    except Exception as exc:  # noqa: BLE001 - exploratory, show any error
        print(f"  (could not sample {view}: {exc})")


def main() -> None:
    with connect() as conn:
        print("Connected. Listing columns for each view...")
        for view in VIEWS:
            print_columns(conn, view)
            print_sample(conn, view)

        # Try to find how CS courses are identified. Adjust after seeing columns.
        print(f"\n{'=' * 60}\nLOOKING FOR CS COURSES\n{'=' * 60}")
        for guess in [
            "SELECT * FROM courses WHERE department = 'CS' LIMIT 3",
            "SELECT * FROM courses WHERE subject = 'CS' LIMIT 3",
            "SELECT * FROM courses WHERE dept = 'CS' LIMIT 3",
            "SELECT * FROM courses WHERE course_id ILIKE '%CS%' LIMIT 3",
        ]:
            try:
                rows = conn.execute(guess).fetchall()
                print(f"\n  OK: {guess}")
                for row in rows:
                    print(f"    {row}")
                if rows:
                    print("  ^ this filter returns CS rows — note which column worked.")
            except Exception as exc:  # noqa: BLE001
                print(f"\n  FAIL: {guess}\n    {exc}")


if __name__ == "__main__":
    main()
