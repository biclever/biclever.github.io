---
title: "CMS Query CLI with JDBC"
date: 2026-05-01T00:00:00+10:00
weight: 11
wide: true
---

## Why export the CMS to a database

The SAP BO CMS holds a wealth of metadata that's valuable for monitoring and governance: how often reports change, who modified what, which schedules run, how many instances pile up, which users joined or left groups. Surfaced as a regular database snapshot, this data feeds dashboards, anomaly alerts, capacity planning, and audit reports — things the BIP UI doesn't give you out of the box.

For most monitoring use cases you don't need a full ETL stack. `cmsquery-cli` extracts the slices you care about with a CMS query, projects them through a field map, and writes them into a table you control. Schedule it on a cron and you have a refreshable snapshot.

## What this page covers

`cmsquery-cli` can write query results directly into a relational database table over JDBC, instead of saving them as `.xlsx` or `.csv`. This page covers the JDBC-specific extensions: configuring the target, declaring a column mapping, and the one-time schema setup.

For the rest of the CLI surface — `login`, `query`, `export --output <file>`, `--args` script files — see [CMS Query CLI](/pages/cmsquery-cli/).

## How it works

A JDBC export does three things in one transaction per table:

1. Connects to the database configured in `config/jdbc.json`.
2. `DELETE FROM <table>` — the contents are wiped.
3. `INSERT INTO <table> (...)` for each row of the CMS query result, with column names taken from the [field map](#field-map).

A failed insert rolls back the whole transaction, so the previous snapshot survives. Each subsequent run replaces the data — the table is always a fresh mirror of the CMS query.

## Setup

Database connection details live in `config/jdbc.json`:

```json
{
    "driver": "org.sqlite.JDBC",
    "url": "jdbc:sqlite:example.db",
    "username": "",
    "password": ""
}
```

Any JDBC driver works as long as the matching `.jar` is on the classpath. The launcher's `lib/` folder is scanned automatically; drop additional driver jars (e.g. `postgresql-42.x.jar`, `mssql-jdbc-12.x.jar`) into `lib/` and reference them in `driver`.

## Commands

Two CLI commands are JDBC-specific. Everything else (`login`, `query`, `--args`) is unchanged — see the [main CLI page](/pages/cmsquery-cli/).

### `initdb`

Apply a schema SQL file to the JDBC target. Runs in a single transaction.

| Parameter | Meaning |
|---|---|
| `--file <path>` | Schema SQL file. Defaults to `config/schema.sql`. |

Run this once before the first JDBC export, and again whenever the schema changes.

### `export --output jdbc`

Write the last query result into the table named in the field map.

| Parameter | Meaning |
|---|---|
| `--output jdbc` | Write to the JDBC target in `config/jdbc.json` (instead of a file). |
| `--map <path>` | Required. JSON field map declaring the target table and the source-to-target column projection. |

The field map drives both the target table name and the projection: any source column not listed in `fields` is dropped, and listed columns are renamed to the target's column names.

## Field map

```json
{
    "table": "webi_document",
    "fields": {
        "SI_ID":        "id",
        "SI_NAME":      "name",
        "SI_KIND":      "kind",
        "SI_UPDATE_TS": "last_modified"
    }
}
```

- `table` — name of the target table (must already exist; create it with `initdb`).
- `fields` — `"<source column>": "<target column>"`. Order is preserved.

Date/timestamp values (e.g. `SI_UPDATE_TS`) are rendered as ISO-8601 UTC strings on write — same shape regardless of driver, sortable lexicographically.

## End-to-end example

Three artifacts work together: the DDL, the CMS query, and the field map.

### `example.db.sql` — target schema

```sql
CREATE TABLE IF NOT EXISTS webi_document (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    kind          TEXT NOT NULL,
    last_modified TEXT
);
```

### `example.cms.sql` — CMS InfoStore query

```sql
SELECT TOP 100 SI_ID, SI_NAME, SI_KIND, SI_UPDATE_TS
FROM   CI_INFOOBJECTS
WHERE  SI_KIND = 'Webi'
  AND  SI_INSTANCE = 0
```

### `example.map.json` — projection

```json
{
  "table": "webi_document",
  "fields": {
    "SI_ID":        "id",
    "SI_NAME":      "name",
    "SI_KIND":      "kind",
    "SI_UPDATE_TS": "last_modified"
  }
}
```

### Run

One-time, to create the table:

```bash
cmsquery-cli initdb --file example/example.db.sql
```

Then on every run, to refresh the data:

```bash
cmsquery-cli login --system <name> ^
              query  --file example/example.cms.sql ^
              export --output jdbc --map example/example.map.json
```

Each run wipes `webi_document` and reinserts the current 100 most recent Webi documents from the CMS — atomic, so a failure mid-run leaves the previous snapshot intact.
