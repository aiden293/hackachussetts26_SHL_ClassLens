# BU Course Catalog import

One-time scripts to pull **CS course data** (course name, professor, schedule)
from the BU Course Catalog Postgres DB during the hackathon access window, and
write it into the app. The DB credentials expire after the window, so we import
once into committed data — the app never connects to this DB at runtime.

## Rules (from the access template — follow these)

- **Never commit credentials.** They go in `scripts/catalog.env`, which is
  gitignored (`.env*`). Only non-secret *output* (course JSON) gets committed.
- **BU VPN + 2FA required** to connect.
- **Read-only**, 5 connections max, 60s query timeout. Use small `LIMIT`s while
  exploring; cache results; don't hammer the DB.
- Event-only use. No scraping, resale, or redistribution.

## Setup

```bash
pip install -r scripts/requirements.txt
# copy the template and paste the real password (populated 10/23):
#   scripts/catalog.env.example  ->  scripts/catalog.env
```

Connect to the **BU VPN** before running anything.

## Step 1 — explore the schema

```bash
python scripts/explore_catalog.py
```

This prints the columns of each view (`courses, sections, meetings, terms, …`)
and sample CS rows. Paste the output back so the importer can target the real
column names (we expect: course name in `courses`, professor + term in
`sections`, meeting times in `meetings`).

## Step 2 — import CS courses

```bash
python scripts/import_cs_courses.py   # created after we know the schema
```

Writes `scripts/out/cs_courses.json`. That JSON is then transformed into the
app's course data (`src/lib/data/courses.ts`).
