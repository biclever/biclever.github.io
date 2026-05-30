---
title: "BO Query MCP — install & configuration"
date: 2026-05-14T00:00:00+10:00
weight: 10
wide: true
---

# BO Query MCP — install & configuration

## Requirements

- Java 17 or later.
- Network access to your BIP REST endpoint.
- An Enterprise BIP account with permission to create documents in Web Intelligence (see *Required permissions* below).
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, etc.).

## Download file

Download the BO Query MCP zip file and unpack it to a preferred location, for example:

`C:\Tools\boquerymcp\`

The folder should contain at least:

- `boquerymcp.jar` — the main server that talks to your BO platform.
- `license.txt` if you have a PRO license.

## Java

We recommend [Eclipse Temurin JRE 17](https://adoptium.net/temurin/releases/?package=jre&version=17) — download the installer and run it.

## BIP REST endpoint

BO Query MCP connects to SAP BusinessObjects through the BIP REST API.

If you access SAP BO LaunchPad at:

`https://bip-server/BOE/BI`

then the BIP REST endpoint is usually:

`https://bip-server/biprws`

Contact your SAP BO administrator if you are not sure. The URL can normally be found in the Central Management Console under **Applications → RESTful Web Service**.

## Required permissions

- **Universes**: *View On Demand* access level on every universe you intend to query.
- **Web Intelligence application**: *Full Control* access level.
- You do **not** need write access to any public folder — BO Query MCP never saves documents to the CMS. Queries run inside an in-memory document that is discarded with the session.

## Install in Claude Desktop

In Claude Desktop, open **Settings → Developer** and click **Edit Config** — this opens `claude_desktop_config.json` in your default editor.

```json
{
  "mcpServers": {
    "boquerymcp": {
      "command": "java",
      "args": [
        "-jar",
        "C:\\<path>\\boquerymcp\\boquerymcp.jar"
      ],
      "env": {
        "BICLEVER_RWS":          "https://bip-server/biprws",
        "BICLEVER_USERNAME":     "your-username",
        "BICLEVER_PASSWORD":     "your-password",
        "BICLEVER_LICENSE_FILE": "C:\\<path>\\boquerymcp\\license.txt"
      }
    }
  }
}
```

Alternatively, sensitive environment variables such as `BICLEVER_PASSWORD` can be set in Windows under **System Properties → Environment Variables** so you don't store credentials in the Claude Desktop config file.

Restart Claude Desktop fully (tray-icon Quit, then relaunch). The four universe tools (`list_universes`, `describe_universe`, `run_query`, `inspect_sql`) become available.

## Environment variables

| Var | Required? | What it does |
|---|---|---|
| `BICLEVER_RWS` | yes | BIP REST root URL, e.g. `https://bip-server/biprws`. |
| `BICLEVER_USERNAME` | yes | BIP login. |
| `BICLEVER_PASSWORD` | yes | BIP password. |
| `BICLEVER_LICENSE_FILE` | yes for PRO | Absolute path to `license.txt`. Without it, `run_query` runs in free mode — first 10 rows only, prefixed with a `# Free mode …` comment. PRO removes the cap. |

## Tools

| Tool | Free | PRO | Description |
|---|---|---|---|
| `list_universes` | ✓ | ✓ | List CMS universes by name + folder. |
| `describe_universe(name, folder?)` | ✓ | ✓ | Folders, dimensions, measures, predefined filters with their backslash-joined paths. |
| `run_query(universe, …)` | preview (10 rows) | full (caller's `limit`) | Ad-hoc query against a universe with optional filter tree. Returns CSV. |
| `inspect_sql(universe, …)` | ✓ | ✓ | Returns the SQL the query would send to the database without executing it. No row cap (no rows returned). |
