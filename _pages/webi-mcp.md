---
title: "Webi MCP — install & configuration"
date: 2026-05-14T00:00:00+10:00
weight: 10
wide: true
---

# Webi MCP — install & configuration

Single fat jar (`webimcp.jar`). Claude Desktop launches it directly via `java -jar` — no
`lib/` folder, no `.bat` launcher.

## Requirements

- Java 17+ (the SAP-bound tools ship with Java 8; Webi MCP is a standalone process and uses a
  modern JRE). Any Temurin / Eclipse Adoptium / Oracle 17+ works.
- Network access to your BIP REST endpoint.
- A BIP account with the **Edit** right in Web Intelligence on the universes you want to query.
  Queries run inside a transient (in-memory) document — never saved to the CMS — but Webi still
  requires the right to create a document for that to work. Read-only accounts can call
  `list_universes` and `describe_universe`; `run_query` will be refused server-side.
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, etc.).

## Install in Claude Desktop

Edit `claude_desktop_config.json`:

- Windows (Store install): `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\claude_desktop_config.json`
- Windows (installer):     `%APPDATA%\Claude\claude_desktop_config.json`
- macOS:                   `~/Library/Application Support/Claude/claude_desktop_config.json`

Add an `mcpServers.webimcp` entry pointing at the jar:

```json
{
  "mcpServers": {
    "webimcp": {
      "command": "java",
      "args": [
        "-jar",
        "C:\\path\\to\\webimcp.jar"
      ],
      "env": {
        "BICLEVER_RWS":         "https://YOUR-BIP-HOST/biprws",
        "BICLEVER_USERNAME":    "your-username",
        "BICLEVER_PASSWORD":    "your-password",
        "BICLEVER_NOTES_DIR":   "C:\\Users\\<you>\\webimcp-notes",
        "BICLEVER_LICENSE_FILE":"C:\\Users\\<you>\\license.txt"
      }
    }
  }
}
```

Restart Claude Desktop fully (tray-icon Quit, then relaunch). The three universe tools
(`list_universes`, `describe_universe`, `run_query`) appear immediately; the five `note_*`
tools appear only when `BICLEVER_NOTES_DIR` is set.

## Environment variables

| Var | Required? | What it does |
|---|---|---|
| `BICLEVER_RWS` | yes | BIP REST root URL, e.g. `https://host:6405/biprws`. |
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
