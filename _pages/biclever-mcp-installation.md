---
title: "Biclever MCP — install & configuration"
date: 2026-05-14T00:00:00+10:00
weight: 10
wide: true
---

# Biclever MCP — install & configuration

## Requirements

- Java 17 or later.
- Network access to your BIP REST endpoint.
- An Enterprise BIP account with permission to create documents in Web Intelligence (see *Required permissions* below).
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, etc.).

## 1. Install Java

We recommend [Eclipse Temurin JRE 17](https://adoptium.net/temurin/releases/?package=jre&version=17) — download the installer and run it.

## 2. Download and unpack

Download the Biclever MCP zip file and unpack it to a preferred location, for example:

`C:\Tools\biclevermcp\`

If you have a PRO license, put `license.txt` in the same folder, next to `biclevermcp.jar`. Without it, Biclever MCP runs in free mode.

## 3. Add it to Claude Desktop

In Claude Desktop, open **Settings → Developer** and click **Edit Config** — this opens `claude_desktop_config.json` in your default editor. Add:

```json
{
  "mcpServers": {
    "biclevermcp": {
      "command": "java",
      "args": ["-jar", "C:\\Tools\\biclevermcp\\biclevermcp.jar"]
    }
  }
}
```

Use your own folder in the path, and write every `\` as `\\`. If the file already has an `mcpServers` section, add the `biclevermcp` entry inside it.

Restart Claude Desktop fully (tray-icon Quit, then relaunch).

## 4. Sign in

The first time you ask Claude about your universes, a sign-in page opens in your browser. Enter:

- **REST web service URL** — the BIP REST endpoint (see below).
- **User name** and **password** — your BO Enterprise account.

The page is served only to your own computer. The URL and user name are remembered for next time; the password is not stored and is needed again after Claude Desktop restarts. To switch to another BO system or user, ask Claude to sign out.

### BIP REST endpoint

If you access SAP BO LaunchPad at:

`https://bip-server/BOE/BI`

then the BIP REST endpoint is usually:

`https://bip-server/biprws`

Contact your SAP BO administrator if you are not sure. The URL can normally be found in the Central Management Console under **Applications → RESTful Web Service**.

## Required permissions

- **Universes**: *View On Demand* access level on every universe you intend to query.
- **Web Intelligence application**: *Full Control* access level.
- **Custom SQL** (`run_custom_sql`, PRO): the right to edit query SQL in Web Intelligence.
- You do **not** need write access to any public folder — Biclever MCP never saves documents to the CMS. Queries run inside an in-memory document that is discarded with the session.

## Tools

| Tool | Free | PRO | Description |
|---|---|---|---|
| `list_universes` | ✓ | ✓ | List CMS universes by name + folder. |
| `describe_universe(name, folder?)` | ✓ | ✓ | Folders, dimensions, measures, predefined filters with their backslash-joined paths. |
| `run_query(universe, …)` | preview (10 rows) | full (caller's `limit`) | Ad-hoc query against a universe with optional filter tree. Returns CSV. |
| `inspect_sql(universe, …)` | ✓ | ✓ | Returns the SQL the query would send to the database without executing it. No row cap (no rows returned). |
| `run_custom_sql(universe, result_objects, sql, …)` | — | ✓ | Runs your own SELECT through the universe's connection. Must return one column per result object, in order; must start with `SELECT` (no `WITH`). |
| `sign_out` | ✓ | ✓ | Signs out; the next call opens the sign-in page so you can switch system or user. |
