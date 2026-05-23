---
title: "Impact Analysis — user guide"
date: 2026-05-23T00:00:00+10:00
weight: 3
wide: true
---

Impact Analysis is a command-line tool that extracts SAP BusinessObjects universe and Web Intelligence document metadata into a relational database. Once the data is there, you query it with whatever you already have — SQL Server Management Studio, a Webi report, your favourite IDE, or an AI assistant pointed at the same database via [dbquerymcp](/products/dbquerymcp/).

The first run loads everything; subsequent runs are incremental — only changed universes and documents are re-extracted. A water-mark timestamp and a per-cuid status table track what's been seen and what failed.

## Setup

### 1. Configure the database

Edit `config/jdbc.json`. SQLite is the default — nothing to install, the file sits next to the launcher:

```json
{
  "driver": "org.sqlite.JDBC",
  "url": "jdbc:sqlite:impactanalysis.db",
  "username": "",
  "password": ""
}
```

For SQL Server:

```json
{
  "driver": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
  "url": "jdbc:sqlserver://HOST:1433;databaseName=DBNAME;encrypt=true;trustServerCertificate=true",
  "username": "USERNAME",
  "password": "PASSWORD"
}
```

For Oracle:

```json
{
  "driver": "oracle.jdbc.OracleDriver",
  "url": "jdbc:oracle:thin:@HOST:1521:SID",
  "username": "USERNAME",
  "password": "PASSWORD"
}
```

All three drivers are bundled — no separate downloads required.

### 2. Configure BIP and SAP BO connection

Edit `config/systems.json` with the BIP REST endpoint plus BO Client Tools credentials (the tool drives `webimaster` for documents over REST and `unxdoc` for universes through the local Semantic Layer SDK):

```json
{
    "lastSystem": "prod",
    "systems": [
        { "system": "prod", "username": "Administrator", "password": "..." }
    ]
}
```

### 3. Choose what to extract

Edit `config/folders.txt`. One folder path per line; comments start with `#`:

```text
# CMS folders to scan for Webi documents and universes.
/Reporting/Sales
/Reporting/Operations
/Universes
```

Sub-folders are walked recursively. Anything outside the listed folders is ignored.

### 4. Apply the schema

```bash
impactanalysis-cli initdb
```

This applies impactanalysis's own schema, plus the bundled `webimaster` and `unxdoc` schemas — one self-contained database, no sibling tools required.

## Commands

| Command | What it does |
|---|---|
| `initdb` | One-time DB setup. Applies all three schemas (impactanalysis + webimaster + unxdoc) in one transaction. |
| `refresh` | Incremental extraction. Walks `config/folders.txt`, picks up new and changed cuids since the last run's water mark, prunes cuids deleted from BO. |
| `retry-failures` | Re-runs extraction only for cuids that were marked `failed` in a previous run. Use after fixing the underlying cause (broken document, missing universe, etc.). |
| `status` | Prints the water mark, the last run summary, and current failure counts. |

A typical operational loop is `refresh` on a schedule (nightly, hourly), `status` to check health, `retry-failures` after fixing anything broken.

## What's in the database

Three logical layers, one schema:

| Source | Tables |
|---|---|
| **unxdoc** (universes) | `universe`, `universe_object`, `universe_table`, `universe_join`, `universe_context`, `universe_parameter`, `universe_lov`, `universe_navigation_path`, `universe_incompatibility` |
| **webimaster** (Webi documents) | `document`, `document_data_provider`, `document_result_object`, `document_variable`, `document_link`, `document_link_member`, `document_layout_site`, `document_reference` |
| **impactanalysis** (run tracking) | `impactanalysis_run` (water mark), `impactanalysis_cuid` (per-cuid status) |

The two join keys that bridge documents to universes:

| webimaster column | unxdoc column |
|---|---|
| `document_data_provider.data_source_cuid` | `universe.universe_cuid` |
| `document_result_object.data_source_object_id` | `universe_object.object_id` (within the same universe) |

These are stable cuids assigned by BO, not surrogate keys generated at extraction time — they survive renames and folder moves.

![impact analysis model](/images/pages/impact-analysis-model.png)
{:.full}

## Example queries

### Which documents are affected if I change a universe object?

Given a universe cuid and an object name, find the result objects that pull from it plus the variables and layout sites that reference those result objects.

```sql
WITH target_obj AS (
  SELECT universe_cuid, object_id
  FROM   universe_object
  WHERE  universe_cuid = :univ
    AND  name = :object_name              -- or filter by select_expr LIKE '%column%'
),
hit_ro AS (
  SELECT dp.document_cuid, ro.result_object_id, ro.name AS result_object_name
  FROM   document_data_provider dp
  JOIN   document_result_object ro ON ro.document_cuid = dp.document_cuid AND ro.dp_id = dp.dp_id
  JOIN   target_obj t              ON t.universe_cuid  = dp.data_source_cuid
                                  AND t.object_id      = ro.data_source_object_id
)
SELECT d.path, d.name AS document, hit_ro.result_object_name,
       ref.source_kind, ref.source_id, ref.target_name AS referenced_as
FROM   hit_ro
JOIN   document d              ON d.document_cuid = hit_ro.document_cuid
LEFT JOIN document_reference ref ON ref.document_cuid    = hit_ro.document_cuid
                                AND ref.target_kind      = 'result_object'
                                AND ref.target_id        = hit_ro.result_object_id
ORDER BY d.path, d.name;
```

`source_kind = 'variable'` rows tell you a variable formula references the object; `source_kind = 'site'` rows mean a report element (block, axis, sort, filter) references it. A NULL `source_kind` row means the object is selected in a query but never referenced downstream — usually safe to remove.

### Which DB column does this universe object resolve to?

```sql
SELECT object_id, name, select_expr, where_expr
FROM   universe_object
WHERE  universe_cuid = :univ
  AND  (select_expr LIKE :pattern OR where_expr LIKE :pattern);
```

`pattern` is something like `'%SCHEMA.TABLE.COLUMN%'`. For derived tables you may need to walk `universe_table.expression` as well.

### Which variables transitively depend on a result object?

`document_reference` is the explicit edge table. Variables → result objects is one hop; variables → variables → result objects is N hops. Use a recursive CTE:

```sql
WITH RECURSIVE chain(document_cuid, var_id, hop) AS (
  SELECT document_cuid, source_id, 1
  FROM   document_reference
  WHERE  source_kind = 'variable' AND target_kind = 'result_object' AND target_id = :ro_id
  UNION ALL
  SELECT r.document_cuid, r.source_id, c.hop + 1
  FROM   document_reference r
  JOIN   chain c
         ON r.document_cuid = c.document_cuid
        AND r.target_kind   = 'variable'
        AND r.target_id     = c.var_id
  WHERE  r.source_kind = 'variable' AND c.hop < 10
)
SELECT DISTINCT v.name, c.hop
FROM   chain c
JOIN   document_variable v ON v.document_cuid = c.document_cuid AND v.variable_id = c.var_id
ORDER BY c.hop, v.name;
```

## Freshness

`impactanalysis_run.water_mark` is the timestamp the most recent refresh extracted up to. To know what to trust:

- Cuids with `impactanalysis_cuid.status = 'ok'` were extracted successfully on the last run that touched them.
- Cuids with `status = 'failed'` were attempted but did not land in the DB — treat them as stale until `retry-failures` succeeds.
- The water mark itself answers "as of when was this DB current?".

Always check `impactanalysis-cli status` (or query `impactanalysis_run`) before relying on the data for a critical decision.

## Limitations

- Universe expressions like `@Select()`, `@DerivedTable()`, `@Variable()` are stored verbatim — not expanded. A query against `select_expr` may need to traverse them.
- BEX queries are not processed.
- Documents that failed to open (corrupt, broken data provider, permissions) are skipped and logged as failures; their previous DB rows (if any) remain stale until the doc is fixed and `retry-failures` is run.
