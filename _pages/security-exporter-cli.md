---
title: "Security Exporter CLI"
date: 2026-05-01T00:00:00+10:00
weight: 13
wide: true
---

# Security Exporter CLI

`securityexporter-cli` extracts SAP BusinessObjects security data — explicit and effective principals, access levels, rights, and access-level setup — and writes the result to Excel or CSV. Same backend as the GUI, scriptable for periodic security audits.

The free tier runs the full extraction; only the final `export` step requires a PRO license.

## Setup

Credentials in `config/systems.json`:

```json
{
    "systems": [
        { "system": "production", "username": "Administrator", "password": "" }
    ]
}
```

Query scopes in `config/queries.txt`. Each scope is a `# Title` header followed by one or more SQL queries (blank-line separated):

```
# All objects in Public Folder
select si_id from ci_infoobjects where si_ancestor = 23

# Reporting folder only
select si_id from ci_infoobjects where si_ancestor = 580
```

## Running

```
securityexporter-cli login --system production ^
    scope --title "All objects in Public Folder" ^
    options --effectivePrincipals --effectiveRights ^
    process ^
    export --xlsx security.xlsx
```

Or via a script file:

```
securityexporter-cli --args script.txt
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

### `scope`

Pick the scope (set of objects) to extract security for.

| Parameter | Meaning |
|---|---|
| `--title "<title>"` | Match a scope from `queries.txt` (exact or substring). |
| `--file <path>` | Use a different queries file. Default: `config/queries.txt`. |

### `options`

Toggle which output sheets get produced. By default only the **explicit** sheets are on; effective sheets, details, and access-levels setup are off.

| Flag | Default | Meaning |
|---|---|---|
| `--explicitPrincipals` | on | Direct principal assignments. |
| `--explicitAccessLevels` | on | Direct role assignments. |
| `--explicitRights` | on | Direct right grants/denies. |
| `--effectivePrincipals` | off | Effective principal assignments (with inheritance). |
| `--effectiveAccessLevels` | off | Effective role assignments. |
| `--effectiveRights` | off | Effective right grants/denies. |
| `--details` | off | Add internal IDs (object id, CUID, kind, etc.) to every sheet. |
| `--accessLevelsSetup` | off | Add a sheet listing the rights composing each custom role. |
| `--rightFilter <text>` | — | Restrict rights to descriptions containing `<text>`. |

Pass a flag with no value (e.g. `--effectivePrincipals`) to turn it on; pass `false` to turn an on-by-default flag off (e.g. `--explicitPrincipals false`).

### `process`

Run the extraction in memory. Result is held until the next `process` or `export`.

### `export` *(PRO)*

Write the extraction result to disk.

| Parameter | Meaning |
|---|---|
| `--xlsx <file>` | Excel output. |
| `--csv <folder>` | CSV output — one file per sheet under `<folder>`. |

At least one of `--xlsx` / `--csv` is required. Both are PRO-only — without a valid license the command exits with:

```
Export requires a PRO license. Place a valid license.txt next to the launcher.
```

## Example

```
# scripts/audit-public.txt
login   --system production
scope   --title "All objects in Public Folder"
options --effectivePrincipals --effectiveRights --details
process
export  --xlsx audit-public.xlsx --csv audit-public/
```

```
securityexporter-cli --args scripts/audit-public.txt
```

## Licensing

The full pipeline (login through process) runs on the free tier — useful for verifying scope and previewing volume before a full audit. Only the `export` step requires PRO. Drop a signed `license.txt` next to `securityexporter-cli.bat` to enable export.
