---
title: "Unx Editor CLI"
date: 2026-05-01T00:00:00+10:00
weight: 12
---

# Unx Editor CLI

`unxeditor-cli` runs the snapshot / diff / apply workflow for SAP BusinessObjects universe (`.unx`) editing from the command line. Same backend as the GUI: download a universe from the CMS, edit a JSON snapshot in your workspace, build a change plan, apply it locally, and push back to the CMS.

The free tier covers the read-only commands (`list`, `select`, `import`, `status`, `extract`, `plan`); applying changes (`execute`) and publishing (`publish`) require a PRO license.

## Setup

Credentials in `config/systems.json`, workspace path in `config/preferences.json`:

```json
{
    "workspaceFolder": "workspace"
}
```

The CLI keeps per-universe state under `tmp/<cuid>/state.json` so subsequent commands know which local file to operate on.

## Running

A typical end-to-end run:

```
unxeditor-cli login --system production ^
    select --universe "Reporting/Finance.unx" ^
    import extract plan execute publish
```

Or scripted:

```
unxeditor-cli --args script.txt
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

### `list`

List universes from the CMS and cache them to `tmp/universe-list.json`.

| Parameter | Meaning |
|---|---|
| `--search <glob>` | Filter the display; the cache still gets the full set. |

### `select`

Pick the universe the rest of the pipeline will operate on.

| Parameter | Meaning |
|---|---|
| `--universe <name-or-pattern>` | Tries exact title, then substring, then glob. |

### `import`

Download the selected universe from the CMS to a temp folder and record the import state.

### `status`

Show local changes since the last `import` (workspace JSON vs. imported snapshot).

### `extract`

Write the workspace JSON snapshot for the selected universe — your editable copy.

### `plan`

Diff the workspace JSON against the imported snapshot and produce `_plan.json`.

### `execute` *(PRO)*

Apply `_plan.json` to the local universe file via the SAP SL SDK. Refused without a valid PRO license.

### `publish` *(PRO)*

Push the local file back to the CMS. Refused without a valid PRO license.

## Example

```
# scripts/refresh-finance.txt
login   --system production
select  --universe "Reporting/Finance.unx"
import
extract
# (manually edit workspace/Finance.json)
plan
execute
publish
```

```
unxeditor-cli --args scripts/refresh-finance.txt
```

## Licensing

Without a license, `execute` and `publish` fail with:

```
execute requires a PRO license. Place a valid license.txt next to the launcher.
```

Drop a signed `license.txt` next to `unxeditor-cli.bat` to unlock both commands.
