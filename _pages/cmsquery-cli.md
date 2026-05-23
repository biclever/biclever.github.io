---
title: "CMS Query CLI"
date: 2026-05-01T00:00:00+10:00
weight: 10
wide: true
---

`cmsquery-cli` runs SQL queries against the SAP BusinessObjects CMS InfoStore from the command line and writes the result to Excel or CSV. Useful for scripted reporting, scheduled exports, and integration with other tooling.

Writing the result into a database table instead of a file is covered separately on [CMS Query CLI with JDBC](/pages/cmsquery-cli-jdbc/).

## Setup

Credentials live in `config/systems.json`:

```json
{
    "lastSystem": "localhost",
    "systems": [
        {
            "system": "localhost",
            "username": "Administrator",
            "password": ""
        }
    ]
}
```

`--password` may be omitted from the file and supplied at run time, or stored once via the GUI's "Save password" option.

`lastSystem` is the entry the desktop UI last connected to. The CLI reads it as a fallback when `login` is called with no arguments but never updates it — running the CLI doesn't shift the GUI's default.

## Running

The CLI runs a sequence of commands in one invocation, sharing a single BIP session:

```bash
cmsquery-cli login --system localhost ^
    query --sql "select top 10 si_id, si_name from ci_infoobjects where si_kind = 'Webi'" --includePath ^
    export --output webi.xlsx
```

For multi-line readability, put the same commands in a plain-text file with any name (`.txt` is convenient for editors) and pass it via `--args`:

```bash
cmsquery-cli --args script.txt
```

Inside the file, lines starting with `#` are comments, and `#` also ends a line inline — handy for documenting steps:

```text
# Daily Webi snapshot.
login                                                                # uses lastSystem
query --file queries/webi.sql --includePath
export --output webi.xlsx
```

A literal `#` inside a double-quoted SQL string is preserved, so you can still write `where si_name like '%#foo%'` without escaping.

See the [script-file example](#script-file) below for a more complete sample.

## Commands

Commands run in the order they appear; later commands consume state set by earlier ones.

### `login`

Open the BIP session. With no arguments, falls back to `lastSystem` from `config/systems.json`.

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
| `--includePath` | Add a `PATH` column with the folder location of each result row. |
| `--includeFullPath` | Add a `FULLPATH` column — `PATH` joined with `SI_NAME`. More useful when the rows are folders, where `PATH` alone stops at the parent. |
| `--includeContainers` | Expand container properties as additional columns. |
| `--transpose` | Pivot the result so each row's fields become columns. |

Exactly one of `--sql` / `--file` is required.

### `export`

Write the last query result to a file. The extension of `--output` chooses the format: `.xlsx` for Excel, `.csv` for CSV.

| Parameter | Meaning |
|---|---|
| `--output <file>` | Output path (`.xlsx` or `.csv`). |

You can run multiple `query` / `export` pairs in one invocation — each `export` writes the result of the immediately preceding `query`.

For writing into a database table instead of a file, see [CMS Query CLI with JDBC](/pages/cmsquery-cli-jdbc/).

## Examples

### Show help

```bash
cmsquery-cli help
```

### Test connection

```bash
cmsquery-cli login
```

### Excel export

```bash
cmsquery-cli login --system localhost ^
    query --file example/example.cms.sql ^
    export --output result.xlsx
```

### Script file

A copy-paste starter (`recent-webi.txt`). Comment lines and inline `#` notes describe what each step does:

```text
# recent-webi.txt — exports the 50 most recently created Webi documents.
# Run with: cmsquery-cli --args recent-webi.txt

login                                                                                              # uses lastSystem from systems.json
query  --sql "select top 50 si_id, si_name, si_creation_time from ci_infoobjects where si_kind = 'Webi' order by si_creation_time desc" --includePath
export --output recent-webi.xlsx
```

Run it:

```bash
cmsquery-cli --args recent-webi.txt
```

Multiple `query` / `export` pairs in the same file run in order, sharing the BIP session — useful for batch exports.
