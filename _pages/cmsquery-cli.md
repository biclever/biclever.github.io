---
title: "CMS Query CLI"
date: 2026-05-05T12:00:00+00:00
weight: 10
---

# CMS Query CLI

`cmsquery-cli` runs SQL queries against the SAP BusinessObjects CMS InfoStore from the command line and writes the result to Excel or CSV. Useful for scripted reporting, scheduled exports, and integration with other tooling.

## Setup

Credentials live in `config/systems.json`:

```json
{
    "systems": [
        { "system": "production", "username": "Administrator", "password": "" }
    ]
}
```

`--password` may be omitted from the file and supplied at run time, or stored once via the GUI's "Save password" option.

## Running

The CLI runs a sequence of commands in one invocation, sharing a single BIP session:

```
cmsquery-cli login --system production ^
    query --sql "select top 10 si_id, si_name from ci_infoobjects where si_kind = 'Webi'" --includePath ^
    export --output webi.xlsx
```

For multi-line readability, put the same line in a script file and run:

```
cmsquery-cli --args script.txt
```

Lines starting with `#` are comments; `#` also ends a line inline. A literal `#` inside a double-quoted SQL string is preserved.

## Commands

Commands run in order in the order they appear; later commands consume state set by earlier ones.

### `login`

Open the BIP session.

| Parameter | Meaning |
|---|---|
| `--system <name>` | Use the entry named `<name>` from `systems.json`. |
| `--server <host:port>` | Connect to an arbitrary server with explicit credentials. |
| `--username <user>` | Required with `--server`. |
| `--password <pass>` | Optional; prompts or uses `systems.json` if omitted. |
| `--auth Enterprise\|LDAP\|WinAD` | Authentication kind. Default: `Enterprise`. |

### `query`

Run a SQL query against the CMS InfoStore. Result is held in memory until the next `query` or `export`.

| Parameter | Meaning |
|---|---|
| `--sql "<text>"` | Inline SQL. Quote with double quotes. |
| `--file <path>` | Read SQL from a file. |
| `--includePath` | Add a `Path` column showing the folder location of each result row. |
| `--includeContainers` | Expand container properties as additional columns. |
| `--transpose` | Pivot the result so each row's fields become columns. |

Exactly one of `--sql` / `--file` is required.

### `export`

Write the last query result to disk.

| Parameter | Meaning |
|---|---|
| `--output <file>` | Output path. The extension chooses the format: `.xlsx` for Excel, `.csv` for CSV. |

You can run multiple `query` / `export` pairs in one invocation — each `export` writes the result of the immediately preceding `query`.

## Example

```
# scripts/recent-webi.txt
login   --system production
query   --sql "select top 50 si_id, si_name, si_creation_time from ci_infoobjects where si_kind = 'Webi' order by si_creation_time desc" --includePath
export  --output recent-webi.xlsx

query   --sql "select si_id, si_name from ci_systemobjects where si_kind = 'User'"
export  --output users.csv
```

```
cmsquery-cli --args scripts/recent-webi.txt
```
