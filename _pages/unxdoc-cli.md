---
title: "Unx Doc CLI"
date: 2026-05-01T00:00:00+10:00
weight: 3
wide: true
---

`unxdoc-cli` extracts SAP BusinessObjects universe (`.unx`) metadata — objects, tables, joins, parameters, LOVs, contexts, navigation paths, incompatibilities — and writes a documentation workbook. Same functionality as the GUI, scriptable for batch documentation and CI pipelines.

## Setup

Credentials live in `config/systems.json`:

```json
{
    "systems": [
        { "system": "production", "username": "Administrator", "password": "" }
    ]
}
```

The first run caches the universe list to `tmp/universe-list.json`; later runs reuse the cache and only refresh it when you call `list` again.

## Running

```
unxdoc-cli login --system production ^
    select --universe "Reporting/Finance.unx" ^
    extract ^
    export --output finance.xlsx
```

Or via a script file:

```
unxdoc-cli --args script.txt
```

Comments start with `#`.

## Commands

### `login`

Open the BIP session.

| Parameter | Meaning |
|---|---|
| `--system <name>` | Use the entry from `systems.json`. |
| `--server <host:port>` | Connect to an arbitrary server. |
| `--username <user>` | Required with `--server`. |
| `--password <pass>` | Optional. |
| `--auth Enterprise\|LDAP\|WinAD` | Default `Enterprise`. |

### `list`

List universes available on the connected system. Caches the full list to `tmp/universe-list.json` so subsequent `select` calls don't need to re-query the CMS.

| Parameter | Meaning |
|---|---|
| `--search <glob>` | Filter the displayed list (the cache still gets the full set). |

### `select`

Pick one universe to extract.

| Parameter | Meaning |
|---|---|
| `--universe <name-or-pattern>` | Tries exact title first, then substring, then glob. |

### `extract`

Read the metadata for the selected universe into memory. No output yet.

### `export`

Write the extracted metadata to a workbook.

| Parameter | Meaning |
|---|---|
| `--output <file.xlsx>` | Output path. Excel format. |

## Example

```
# scripts/document-finance.txt
login   --system production
select  --universe "Reporting/Finance.unx"
extract
export  --output finance-doc.xlsx
```

```
unxdoc-cli --args scripts/document-finance.txt
```

To document many universes, repeat the `select` / `extract` / `export` triple — each cycle reuses the same session.
