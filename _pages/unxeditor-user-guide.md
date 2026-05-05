---
title: "Unx Editor User Guide"
date: 2026-05-01T00:00:00+10:00
weight: 13
---

# Unx Editor — User Guide

Unx Editor is a desktop tool for editing SAP BusinessObjects universe (`.unx`) metadata. It follows a snapshot → edit → apply workflow: the live universe is never touched until you explicitly execute a plan.

---

## Workflow

### 1. Connect

Enter your BIP server address, username, password, and authentication type, then click **Logon**.

### 2. Select universes

Browse the universe tree and move the universes you want to edit into the selected list.

### 3. Extract

Click **Extract**. For each selected universe the tool:

- Downloads the universe from the BIP server to a local temp folder.
- Extracts metadata into a JSON snapshot file saved to the project folder.
- File name pattern: `<universe_name>_unx.json` (e.g. `job_invoicing_unx.json`).

The snapshot is the baseline. Do not edit it while the session is open — re-extract if you need a fresh baseline.

### 4. Edit the JSON file

Open the `_unx.json` file in any text editor and make your changes. Only the fields listed in the **Editable fields** section below are applied during Execute; everything else is read-only metadata captured for reference.

After saving, you can re-open the app and proceed without re-extracting (as long as you do not restart the session).

### 5. Build Plan

Click **Build Plan**. The tool compares the original snapshot (captured at Extract time) with your edited JSON file and produces a `_plan.json` file in the project folder listing exactly what will change. The plan file opens automatically in your default JSON editor — review it before proceeding.

If there are no differences the plan will be empty and Execute will be a no-op.

### 6. Execute

Click **Execute**. The plan is applied to the local universe file. Changes are saved locally only — nothing is published to the BIP server yet.

### 7. Export (manual)

Open the modified universe in **Information Design Tool** and save it back to the repository from there.

---

## Project folder

The project folder holds all working files:

| File | Description |
|------|-------------|
| `<name>_unx.json` | Universe snapshot — edit this file |
| `_plan.json` | Generated change plan — review before executing |

Set the project folder in the **Settings** panel before extracting.

---

## `_unx.json` — Snapshot file

The snapshot represents the current state of one universe. It is the file you edit to express the desired state.

```jsonc
{
  "cuid": "AXk...",          // CMS unique id — do not change
  "name": "Job Invoicing.unx",
  "path": "/Business Performance Management/Reporting",
  "rootFolder": { ... },     // Business layer tree
  "joins": [ ... ],          // Data foundation joins
  "derivedTables": [ ... ],  // Derived tables
  "tables": [ ... ],         // Database and alias tables
  "contexts": [ ... ],       // Data foundation contexts
  "lovs": [ ... ],           // Business layer lists of values
  "parameters": [ ... ]      // Business layer parameters (prompts)
}
```

### Business layer tree (`rootFolder`)

The business layer is a tree of folders, dimensions, and measures. Each node carries a `"type"` discriminator field.

#### Folder

```jsonc
{
  "type": "folder",
  "id": "...",          // SDK identifier — do not change
  "name": "Project",
  "children": [ ... ]   // Nested folders, dimensions, measures
}
```

#### Dimension

```jsonc
{
  "type": "dimension",
  "id": "...",
  "name": "Project Name",
  "description": "",
  "dataType": "STRING",       // STRING | NUMERIC | DATE | DATETIME | BOOLEAN
  "state": "ACTIVE",          // ACTIVE | HIDDEN | DEPRECATED
  "accessLevel": "PUBLIC",    // PUBLIC | PROTECTED | PRIVATE | CONFIDENTIAL | RESTRICTED
  "select": "PROJECT.PROJECTNAME",
  "where": "",
  "extraTables": [],          // Additional tables used in SELECT beyond the primary table
  "usableInConditions": true,
  "usableInResults": true,
  "usableInSort": true,
  "lovId": null,              // id of a LOV from the "lovs" array, or null
  "lovEnabled": false         // whether the LOV association is active
}
```

#### Measure

Same fields as Dimension plus:

```jsonc
{
  "type": "measure",
  ...
  "projectionFunction": "SUM"  // SUM | COUNT | MIN | MAX | AVERAGE | NONE | ...
}
```

### Joins (`joins`)

```jsonc
{
  "id": "...",
  "expression": "PROJECT.PROJECTID=JOBENTRYJOBINVOICELINEPV.PROJECTID",
  "leftTable": "PROJECT",
  "rightTable": "JOBENTRYJOBINVOICELINEPV",
  "cardinality": "C1_N",      // C1_1 | C1_N | CN_1 | CN_N | CUNKNOWN
  "outerType": "OUTER_NONE",  // OUTER_NONE | OUTER_LEFT | OUTER_RIGHT | OUTER_FULL
  "shortcut": false
}
```

`leftTable` and `rightTable` are informational — the SDK derives table membership from the expression. `id` is stable and used for matching; do not change it.

### Derived tables (`derivedTables`)

```jsonc
{
  "id": "...",
  "name": "MY_DERIVED",
  "expression": "SELECT col1, col2 FROM base_table WHERE ...",
  "x": 320,   // Canvas x position in the data foundation view (-1 = not set)
  "y": 80     // Canvas y position
}
```

### Tables (`tables`)

Each table carries a `"type"` discriminator.

#### Database table

```jsonc
{
  "type": "database",
  "id": "...",
  "name": "PROJECT",
  "qualifier": "DBO",   // Schema/qualifier prefix — empty string if none
  "owner": "",
  "x": 100,   // Canvas position (-1 = not set)
  "y": 40
}
```

#### Alias table

```jsonc
{
  "type": "alias",
  "id": "...",
  "name": "PROJECT_ALIAS",
  "aliasedTable": "PROJECT",  // Informational — follows database table renames automatically
  "x": 100,
  "y": 200
}
```

### Contexts (`contexts`)

A context defines a set of joins that resolve join path ambiguity in the data foundation. Each context lists the joins that are explicitly included or excluded; all other joins are neutral.

```jsonc
{
  "id": "CTX_57",
  "name": "Sales",
  "description": "",
  "includedJoins": [          // join ids that are part of this context
    "_Ia1B2...",
    "_Ic3D4..."
  ],
  "excludedJoins": []         // join ids explicitly excluded from this context
}
```

`includedJoins` and `excludedJoins` contain join `id` values from the `joins` array. Order is not significant.

### Lists of values (`lovs`)

LOVs are used to constrain prompts and dimension/measure values. Two types are supported.

#### SQL LOV

```jsonc
{
  "id": "LOV_1",
  "name": "Customer List",
  "type": "sql",
  "description": "",
  "hidden": false,
  "sqlExpression": "SELECT customer_id, customer_name FROM customer ORDER BY customer_name"
}
```

#### Static LOV

```jsonc
{
  "id": "LOV_2",
  "name": "Status",
  "type": "static",
  "description": "",
  "hidden": false,
  "columns": [
    { "name": "Key",   "dataType": "STRING", "isKey": true,  "isHidden": true },
    { "name": "Label", "dataType": "STRING", "isKey": false, "isHidden": false }
  ],
  "rows": [
    ["A", "Active"],
    ["I", "Inactive"],
    ["D", "Deleted"]
  ]
}
```

Each row is a list of string values corresponding to the columns in order.

### Parameters (`parameters`)

Parameters define user prompts. They can reference a LOV to present a pick list.

```jsonc
{
  "id": "PARAM_1",
  "name": "Enter Customer",
  "description": "",
  "hidden": false,
  "dataType": "STRING",           // STRING | NUMERIC | DATE | DATE_TIME
  "userPrompted": true,
  "promptText": "Select a customer:",
  "promptHint": "",
  "multipleValuesAllowed": false,
  "keepLastValuesEnabled": true,
  "indexAwarePrompt": false,
  "selectedOnlyFromList": false,
  "lovId": "LOV_1"                // id of a LOV from the "lovs" array, or null
}
```

### Notes field

Every object supports a `"_note"` string field that is ignored by the executor. Use it to document your intent or communicate context to a reviewer:

```jsonc
{
  "type": "dimension",
  "id": "...",
  "name": "Project Name",
  "_note": "Renamed source table from PROJECT to EXPROJECT in sprint 42",
  "select": "EXPROJECT.PROJECTNAME",
  ...
}
```

---

## Editable fields

The following fields are applied when executing a plan. All other fields in the snapshot are read-only.

### Dimensions and measures

| Field | Notes |
|-------|-------|
| `name` | Display name shown in Web Intelligence |
| `description` | Tooltip text |
| `dataType` | `STRING`, `NUMERIC`, `DATE`, `DATETIME`, `BOOLEAN`, `BLOB` |
| `state` | `ACTIVE`, `HIDDEN`, `DEPRECATED` |
| `accessLevel` | `PUBLIC`, `PROTECTED`, `PRIVATE`, `CONFIDENTIAL`, `RESTRICTED` |
| `select` | SQL SELECT expression |
| `where` | SQL WHERE clause fragment |
| `extraTables` | Additional tables used in `select` beyond the object's primary table |
| `usableInConditions` | `true` / `false` |
| `usableInResults` | `true` / `false` |
| `usableInSort` | `true` / `false` |
| `projectionFunction` | Measures only: `SUM`, `COUNT`, `MIN`, `MAX`, `AVERAGE`, `NONE`, etc. |
| `lovId` | `id` of a LOV from the `lovs` array, or `null` to remove the association |
| `lovEnabled` | `true` / `false` — whether the LOV association is active |

### Joins

| Field | Notes |
|-------|-------|
| `expression` | Full join SQL expression |
| `cardinality` | `C1_1`, `C1_N`, `CN_1`, `CN_N`, `CUNKNOWN` |
| `outerType` | `OUTER_NONE`, `OUTER_LEFT`, `OUTER_RIGHT`, `OUTER_FULL` |
| `shortcut` | `true` / `false` |

### Database tables

| Field | Notes |
|-------|-------|
| `name` | Physical table name. Renaming this automatically updates all alias tables that point to it. Join expressions that reference the old name must be updated manually. |
| `qualifier` | Schema/qualifier prefix |
| `owner` | Owner prefix |
| `x` | Canvas x position in the data foundation view (`-1` = not set / leave unchanged) |
| `y` | Canvas y position |

### Derived tables

| Field | Notes |
|-------|-------|
| `name` | Derived table name |
| `expression` | SQL SELECT statement |
| `x` | Canvas x position in the data foundation view (`-1` = not set / leave unchanged) |
| `y` | Canvas y position |

### Lists of values

| Field | Notes |
|-------|-------|
| `name` | LOV name |
| `description` | Optional description |
| `hidden` | `true` / `false` |
| `sqlExpression` | SQL LOVs only: the SELECT statement |
| `columns` | Static LOVs only: column definitions (name, dataType, isKey, isHidden) |
| `rows` | Static LOVs only: list of value rows; each row is a list of strings matching column order |

Columns on a static LOV cannot be reordered once created. Modify `rows` to change the values; modify `sqlExpression` to change the SQL query.

### Parameters

| Field | Notes |
|-------|-------|
| `name` | Parameter name |
| `description` | Optional description |
| `hidden` | `true` / `false` |
| `dataType` | `STRING`, `NUMERIC`, `DATE`, `DATE_TIME` |
| `userPrompted` | `true` / `false` |
| `promptText` | The question shown to the user |
| `promptHint` | Optional hint text |
| `multipleValuesAllowed` | `true` / `false` |
| `keepLastValuesEnabled` | `true` / `false` |
| `indexAwarePrompt` | `true` / `false` |
| `selectedOnlyFromList` | `true` / `false` |
| `lovId` | `id` of a LOV from the `lovs` array, or `null` to remove the association |

### Contexts

| Field | Notes |
|-------|-------|
| `name` | Context name |
| `description` | Optional description |
| `includedJoins` | List of join `id` values explicitly included in this context |
| `excludedJoins` | List of join `id` values explicitly excluded from this context |

### Adding and removing items

To **add** a new item, insert a new object into the appropriate array (`children` of a folder, `joins`, `derivedTables`, `tables`, `contexts`, `lovs`, or `parameters`) with no `"id"` field (or `"id": null`). The SDK assigns an identifier on save.

To **delete** an item, remove it from the JSON entirely.

Items are matched by `id` when present; matched by `name` + `type` as fallback when `id` is null. Do not change `id` values.

---

## `_plan.json` — Change plan

The plan is a JSON array, one entry per universe. It is generated by Build Plan and consumed by Execute. You can review or manually edit it before executing.

```jsonc
[
  {
    "cuid": "AXk...",
    "name": "Job Invoicing.unx",
    "path": "/Business Performance Management/Reporting",
    "instructions": [ ... ]
  }
]
```

### Instruction types

All instructions carry an `"operation"` discriminator and an optional `"_note"` field.

#### modify

Changes one field of an existing item.

```jsonc
{
  "operation": "modify",
  "id": "OBJ_580",
  "type": "dimension",    // dimension | measure | folder | join | derivedTable | database | alias | context | lov | parameter
  "field": "select",
  "from": "PROJECT.PROJECTNAME",
  "to": "EXPROJECT.PROJECTNAME"
}
```

`from` records the original value for review; only `to` is applied by the executor.

#### add

Creates a new item. The payload field depends on `type`.

```jsonc
{
  "operation": "add",
  "type": "dimension",
  "parentId": "FOLDER_ID",   // null means root folder; only used for BL items
  "item": {
    "type": "dimension",
    "name": "New Field",
    "select": "TABLE.COLUMN",
    ...
  }
}
```

For joins use `"join": { ... }`, for derived tables use `"derivedTable": { ... }`, for tables use `"table": { ... }`, for contexts use `"context": { ... }`, for LOVs use `"lov": { ... }`, for parameters use `"parameter": { ... }`.

#### delete

Removes an existing item by id.

```jsonc
{
  "operation": "delete",
  "id": "OBJ_999",
  "type": "dimension"
}
```

---

## Tips for AI-assisted editing

- **Scope**: only change fields listed in the Editable fields table above. Do not change `id`, `cuid`, the top-level `name` or `path`, or `leftTable`/`rightTable` on joins. In contexts, `includedJoins` and `excludedJoins` must contain valid join `id` values from the `joins` array.
- **Table renames**: when renaming a database table, update `name` on the `"type": "database"` entry **and** update every `select`, `where`, and join `expression` that references the old table name. The `aliasedTable` field on alias tables does not need updating — it follows the rename automatically.
- **Consistency**: `select` expressions must reference only tables that appear in `tables` or `derivedTables`. List any additional tables used in a `select` that are not the object's primary table in `extraTables`.
- **Cardinality direction**: `C1_N` means leftTable is the "one" side, `CN_1` means rightTable is the "one" side.
- **LOV cross-references**: `lovId` on a dimension/measure or parameter must match the `id` of an existing LOV in the `lovs` array. If you add a new LOV without an `id`, refer to it by its `name` — the plan executor resolves it after the LOV is created.
- **Static LOV rows**: each row is an array of strings with one entry per column, in column order. The key column is identified by `"isKey": true` in the `columns` array.
- **Canvas positions**: `x` / `y` values of `-1` mean "not positioned". Set them only if you know the desired layout; leave them as `-1` otherwise and position the table in IDT.
- **Preserving ids**: never generate or modify `id` values. Leave existing ids exactly as they are; omit `id` entirely (or set `null`) when adding new items.
- **`_note` field**: use `"_note"` to explain non-obvious changes inline. It is safe to add to any object and will not affect execution.

---

## Command-line interface

Unx Editor includes a headless CLI for scripting and CI/CD pipelines — see the [Unx Editor CLI](/pages/unxeditor-cli/) reference.
