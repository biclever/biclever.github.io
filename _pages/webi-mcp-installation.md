---
title: "Webi MCP — install & configuration"
date: 2026-05-14T00:00:00+10:00
weight: 10
wide: true
---

# Webi MCP — install & configuration

## Requirements

- Java 17 or later.
- Network access to your BIP REST endpoint.
- An Enterprise BIP account with permission to create documents in Web Intelligence (see *Required permissions* below).
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, etc.).

## Download file

Download the Webi MCP zip file and unpack it to a preferred location, for example:

`C:\Tools\webimcp\`

The folder should contain at least:

- `webimcp.jar`
- `license.txt` if you have a PRO license
- `notes` folder if you want to use persistent notes

## Java

We recommend [Eclipse Temurin JRE 17](https://adoptium.net/temurin/releases/?package=jre&version=17) — download the installer and run it.

## BIP REST endpoint

Webi MCP connects to SAP BusinessObjects through the BIP REST API.

If you access SAP BO LaunchPad at:

`https://bip-server/BOE/BI`

then the BIP REST endpoint is usually:

`https://bip-server/biprws`

Contact your SAP BO administrator if you are not sure. The URL can normally be found in the Central Management Console under **Applications → RESTful Web Service**.

## Required permissions

- **Universes**: *View On Demand* access level on every universe you intend to query.
- **Web Intelligence application**: *Full Control* access level.
- You do **not** need write access to any public folder — Webi MCP never saves documents to the CMS. Queries run inside an in-memory document that is discarded with the session.

## Install MCP in Claude Desktop

In Claude Desktop, open **Settings → Developer** and click **Edit Config** — this opens `claude_desktop_config.json` in your default editor.

Add an `mcpServers.webimcp` entry pointing at the jar:

```json
{
  "mcpServers": {
    "webimcp": {
      "command": "java",
      "args": [
        "-jar",
        "C:\\<path>\\webimcp\\webimcp.jar"
      ],
      "env": {
        "BICLEVER_RWS":         "https://bip-server/biprws",
        "BICLEVER_USERNAME":    "your-username",
        "BICLEVER_PASSWORD":    "your-password",
        "BICLEVER_NOTES_DIR":   "C:\\<path>\\webimcp\\notes",
        "BICLEVER_LICENSE_FILE":"C:\\<path>\\webimcp\\license.txt"
      }
    }
  }
}
```

Alternatively, environment variables such as `BICLEVER_PASSWORD` can be set in Windows under **System Properties → Environment Variables** so you don't store credentials in the Claude Desktop config file.

Restart Claude Desktop fully (tray-icon Quit, then relaunch). The three universe tools
(`list_universes`, `describe_universe`, `run_query`) appear immediately; the five `note_*`
tools appear only when `BICLEVER_NOTES_DIR` is set.

## Environment variables

| Var | Required? | What it does |
|---|---|---|
| `BICLEVER_RWS` | yes | BIP REST root URL, e.g. `https://bip-server/biprws`. |
| `BICLEVER_USERNAME` | yes | BIP login. |
| `BICLEVER_PASSWORD` | yes | BIP password. |
| `BICLEVER_NOTES_DIR` | yes for notes | Absolute path to a writable folder. Without it, the five `note_*` tools are not registered (read-only mode). |
| `BICLEVER_LICENSE_FILE` | yes for PRO | Absolute path to `license.txt`. Without it, `run_query` runs in free mode — first 10 rows only, prefixed with a `# Free mode …` comment. PRO removes the cap. |

## Tools

| Tool | Free | PRO | Description |
|---|---|---|---|
| `list_universes` | ✓ | ✓ | List CMS universes by name + folder. |
| `describe_universe(name, folder?)` | ✓ | ✓ | Folders, dimensions, measures, predefined filters with their backslash-joined paths. |
| `run_query(universe, …)` | preview (10 rows) | full (caller's `limit`) | Ad-hoc query against a universe with optional filter tree. Returns CSV. |
| `note_save / list / read / delete / search` | ✓ | ✓ | Persistent scratchpad keyed by title (slash-separated paths for folders). Available only when `BICLEVER_NOTES_DIR` is set. |
