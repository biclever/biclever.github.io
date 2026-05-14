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
- An Enterprise BIP account with the editing rights in Web Intelligence.
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, etc.).

## Download file

Download and unpack Webi MCP to a preferred location e.g. `C:\<path>\webimcp\webimcp.jar`.

## Java

We recommend [Eclipse Temurin JRE 17](https://adoptium.net/temurin/releases/?package=jre&version=17).

Download and install.

## BIP REST endpoint

Verify that you have access to the BIP REST endpoint. 

If you access SAP BO LaunchPad via https://bip-server/BOE/BI, the BIP REST endpoint is typically https://bip-server/biprws.

Contact your admins if not sure. The link can be found under CMC > Applications > RESTful Web Service

## Access Configuration

- Universes: View-on-demand
- Web Intelligence: Full Access
- You do not need write access to any public folder. The tool does not persist Webi documents in the system. 

## Install MCP in Claude Desktop

Open Claude Desktop. Under Settings > Developer click `Edit Config`. Edit `claude_desktop_config.json`. 

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

Alternatively the envrironemnt variables such as `BICLEVER_PASSWORD` can be set in Windows System Variables.

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
