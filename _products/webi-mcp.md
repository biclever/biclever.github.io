---
title: "Webi MCP"
description: An MCP server that lets AI assistants explore SAP BO universes and run ad-hoc Webi queries through Claude Desktop, Claude Code, and other MCP clients.
date: 2026-05-13T22:00:00+10:00
published: true
weight: 8
tier: pro
---

**Let your AI assistant see the data inside your BO universes.** Webi MCP connects Claude (and any other MCP-compatible AI assistant) to your SAP BusinessObjects environment so you can ask questions in plain language and get answers built from real Web Intelligence query results — not from the assistant's guesses about what your data might look like.

## What you can do with it

- **Validate data quickly.** "Did EMEA revenue dip in March or is that just my dashboard?" The assistant pulls the numbers from the universe and tells you.
- **Run analyses you'd otherwise build by hand.** Describe the slice you want — top 10 customers by margin, year-over-year by product line, anomalies vs. last quarter — and let the assistant assemble the query, run it, and explain the result.
- **Cross-check a report.** Paste a number from a Webi document into chat and ask the assistant to verify it with a fresh query against the source universe.
- **Compare across universes.** "Is the Customer Count measure consistent between Sales and CRM?" — the assistant runs both queries and highlights the gap.

![Webi MCP](/images/pages/webi-mcp-01.png)
{:.full}

![Webi MCP](/images/pages/webi-mcp-02.png)
{:.full}

## What it does, technically

- **Discover universes**: `list_universes` returns every universe in your CMS by name and folder.
- **Inspect schemas**: `describe_universe` returns a compact, LLM-friendly catalog of dimensions, measures, and predefined filters with their full paths and data types — no internal IDs.
- **Run ad-hoc queries**: `run_query` creates a transient Web Intelligence document, runs your query against the universe, and streams the result back as CSV. Supports comparison filters (`Equal`, `Between`, `Like`, `InList`, …), predefined filters, and AND/OR combinators.
- **Persistent notes**: a built-in scratchpad lets the assistant record findings between sessions — what columns to use, what conventions apply, what prompts a universe requires — so it doesn't relearn your environment on every conversation. Notes are stored locally with the MCP server.

Everything is read-only against your CMS. Query documents are transient and dissolve with the session — nothing is written back.

## Built on the BIP REST API

No SAP SDK or server-side install required. Webi MCP talks to your BO platform over HTTPS, so it runs on any workstation with a network route to your BIP server.

## Free vs PRO

The free preview of first 10 rows is enough to validate a query, see the column shape, and decide whether full data is worth pulling. PRO removes the row cap. 

[Buy Biclever PRO €300/year/user](https://biclever.com/pro)

## Prerequisite

- A reachable SAP BusinessObjects BIP REST endpoint (BO 4.x or 2025).
- A BIP account with permission to create documents in Web Intelligence.
- Java 17 or later. 
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, etc.).

No client-side BO install needed — the server runs as a standalone Java process and Claude Desktop launches it on demand.

## Information

- [Webi MCP — install & configuration](/pages/webi-mcp-installation/)

## Downloads

- [Webi MCP for BO 4.3 SP3+/BI 2025 (webimcp-20260525.zip)](https://drive.google.com/uc?export=download&id=1kOIvmDEhdXGAUmHeuB4qhG11J8D2p12z)


