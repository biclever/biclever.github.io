---
title: "Biclever MCP"
description: An MCP server that lets AI assistants explore SAP BO universes and run ad-hoc universe queries through Claude Desktop, Claude Code, and other MCP clients.
date: 2026-05-13T22:00:00+10:00
published: true
weight: 8
tier: pro
---

**Let your AI assistant see the data inside your BO universes.** Biclever MCP connects Claude (and any other MCP-compatible AI assistant) to SAP BusinessObjects. Ask questions in plain language; the answers come from real queries against your universes, not guesses.

## What you can do with it

- **Validate data quickly.** "Did EMEA revenue dip in March or is that just my dashboard?" The assistant pulls the numbers from the universe and tells you.
- **Run analyses you'd otherwise build by hand.** Describe the slice you want — top 10 customers by margin, year-over-year by product line, anomalies vs. last quarter — and let the assistant assemble the query, run it, and explain the result.
- **Cross-check a report.** Paste a number from a Webi document into chat and ask the assistant to verify it with a fresh query against the source universe.
- **Compare across universes.** "Is the Customer Count measure consistent between Sales and CRM?" — the assistant runs both queries and highlights the gap.

![Biclever MCP](/images/pages/webi-mcp-01.png)
{:.full}

![Biclever MCP](/images/pages/webi-mcp-02.png)
{:.full}

## How it works

- **Reads your team's knowledge base first** — short notes on which universe answers what, business definitions and known quirks, so the assistant queries the way your team would.
- **Browses your universes** — lists them and describes their dimensions, measures and predefined filters.
- **Runs queries and returns the rows**, with filters and top/bottom rankings.
- **Shows the SQL** behind a query without running it — or runs your own SELECT instead (PRO).
- **Signs in through your browser** — no credentials stored in any configuration file.

Everything is read-only: queries run in a temporary Web Intelligence document that is never saved to the CMS. Biclever MCP talks to your BO platform over the BIP REST API, so there is nothing to install on the BO server and no SAP client tools on your machine.

## Free vs PRO

The free preview of first 10 rows is enough to validate a query, see the column shape, and decide whether full data is worth pulling. PRO removes the row cap and adds custom SQL.

[Buy Biclever PRO €300/year/user](https://biclever.com/pro)

## Get started

You need SAP BusinessObjects 4.3 SP3 or later (or BI 2025) with REST web services enabled, Java 17 or later, and Claude Desktop or another MCP client.

- [Download Biclever MCP (biclevermcp-20261015.zip)](https://drive.google.com/uc?export=download&id=12W3oSJYqyr_oXjySJUCOwlsh30Ma5Hor)
- [Install & configuration guide](/pages/biclever-mcp-installation/)
