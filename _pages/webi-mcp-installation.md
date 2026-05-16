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

- `webimcp.jar` — the main server that talks to your BO platform.
- `kbmcp.jar` — a companion knowledge-base server that gives the assistant a `docs/` namespace (read-only reference material) and a `notes/` namespace (read-write scratchpad). Installed as a second MCP server alongside `webimcp`; both jars are configured separately in `claude_desktop_config.json` below.
- `license.txt` if you have a PRO license.
- `notes` folder (optional) — if you want the assistant to keep persistent notes between sessions, pre-create a folder here (or anywhere else writable) and point `BICLEVER_KB_NOTES_DIR` at it.
- `docs` folder (optional) — if you want to give the assistant read-only reference docs, drop `.md` files here and point `BICLEVER_KB_DOCS_DIR` at it.

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

## Install both MCP servers in Claude Desktop

In Claude Desktop, open **Settings → Developer** and click **Edit Config** — this opens `claude_desktop_config.json` in your default editor.

The zip ships two MCP servers that work together. Add both:

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
        "BICLEVER_RWS":          "https://bip-server/biprws",
        "BICLEVER_USERNAME":     "your-username",
        "BICLEVER_PASSWORD":     "your-password",
        "BICLEVER_LICENSE_FILE": "C:\\<path>\\webimcp\\license.txt"
      }
    },
    "kbmcp": {
      "command": "java",
      "args": [
        "-jar",
        "C:\\<path>\\webimcp\\kbmcp.jar"
      ],
      "env": {
        "BICLEVER_KB_NOTES_DIR": "C:\\<path>\\webimcp\\notes",
        "BICLEVER_KB_DOCS_DIR":  "C:\\<path>\\webimcp\\docs"
      }
    }
  }
}
```

`webimcp` is required — it's what gives the assistant access to your BO universes and queries. `kbmcp` is optional but recommended: omit it entirely if you don't want the assistant to keep persistent notes or browse reference docs. Inside `kbmcp.env` either `BICLEVER_KB_NOTES_DIR` or `BICLEVER_KB_DOCS_DIR` is enough — set only what you need.

Alternatively, sensitive environment variables such as `BICLEVER_PASSWORD` can be set in Windows under **System Properties → Environment Variables** so you don't store credentials in the Claude Desktop config file.

Restart Claude Desktop fully (tray-icon Quit, then relaunch). The three universe tools (`list_universes`, `describe_universe`, `run_query`) come from `webimcp`; the five `kb_*` tools come from `kbmcp`.

## Environment variables

### `webimcp`

| Var | Required? | What it does |
|---|---|---|
| `BICLEVER_RWS` | yes | BIP REST root URL, e.g. `https://bip-server/biprws`. |
| `BICLEVER_USERNAME` | yes | BIP login. |
| `BICLEVER_PASSWORD` | yes | BIP password. |
| `BICLEVER_LICENSE_FILE` | yes for PRO | Absolute path to `license.txt`. Without it, `run_query` runs in free mode — first 10 rows only, prefixed with a `# Free mode …` comment. PRO removes the cap. |

### `kbmcp`

| Var | Required? | What it does |
|---|---|---|
| `BICLEVER_KB_NOTES_DIR` | one of these | Absolute path to a writable folder for the assistant's persistent notes. |
| `BICLEVER_KB_DOCS_DIR` | one of these | Absolute path to a folder of `.md` reference docs the assistant can read but not modify. |

At least one of the two `BICLEVER_KB_*_DIR` variables must be set or `kbmcp` has nothing to expose. The legacy `BICLEVER_NOTES_DIR` is still honored as an alias for `BICLEVER_KB_NOTES_DIR` so existing notes folders are reused without changes on disk.

## Tools

### From `webimcp`

| Tool | Free | PRO | Description |
|---|---|---|---|
| `list_universes` | ✓ | ✓ | List CMS universes by name + folder. |
| `describe_universe(name, folder?)` | ✓ | ✓ | Folders, dimensions, measures, predefined filters with their backslash-joined paths. |
| `run_query(universe, …)` | preview (10 rows) | full (caller's `limit`) | Ad-hoc query against a universe with optional filter tree. Returns CSV. |

### From `kbmcp`

| Tool | Description |
|---|---|
| `kb_list(path?)` | List immediate folders and files at a path. Empty path shows the configured namespaces (`docs/`, `notes/`). |
| `kb_read(path)` | Return the full body of a `.md` file under `docs/` or `notes/`. |
| `kb_save(path, body)` | Create or overwrite a note. Only allowed under `notes/`. Read-before-overwrite guard. |
| `kb_delete(path)` | Delete a note. Only allowed under `notes/`. |
| `kb_search(query, scope?)` | AND-match search across the configured namespaces. Optional `scope=docs|notes`. |
