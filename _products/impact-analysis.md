---
title: "Impact Analysis"
description: The tool that identifies what universes can be impacted by a database change, and what reports can be impacted by a universe change.
date: 2024-03-11T13:19:00+10:00
published: true
weight: 7
tier: pro
---

**Which reports break if you change this universe object — or this database column?** Impact Analysis answers that question in a query, not a week of clicking through documents.

The tool extracts metadata from every universe and Web Intelligence document on your BO platform and lands it in a relational database you control (SQLite out of the box; SQL Server and Oracle supported). From there you can run impact queries with any tool you already have — SQL Server Management Studio, a Webi report, Excel, or an AI assistant pointed at the same database.

## What you can ask

- *Which reports use the `Customer_ID` column?* — for any database change in scope.
- *Which reports use objects in the deprecated "Legacy" folder of the Sales universe?* — for any planned cleanup.
- *Which reports define a variable named "Net Margin", and do they all calculate it the same way?* — for governance.
- *Which reports rely on the universe joins I'm about to retire?* — for restructure planning.
- *Which reports use a specific Webi function (e.g. `RunningSum`)?* — for feature audits.

Because the data lives in a regular SQL database, the questions you can ask aren't limited to the ones we anticipated.

## Features

- **Bulk metadata extraction**: every selected universe and every Webi document on the platform, including objects, joins, contexts, parameters, LOVs, derived tables, plus per-document data providers, variables, and the actual generated SQL.
- **Choose your database**: SQLite for laptop-scale, SQL Server or Oracle for shared analysis. JDBC drivers for all three are bundled — no separate downloads.
- **Stable schema**: documented tables, primary keys, and indexes designed for joins between universes and documents. Build your own dashboards on top.
- **Refreshable**: re-run extraction whenever the source changes; rows are deleted and replaced per universe/document, never duplicated.
- **AI-friendly**: pair with [dbquerymcp](/products/dbquerymcp/) to let an AI assistant query the impact-analysis database in plain English.

## Case study — Deltek Maconomy field type change

The Deltek Maconomy ERP system integrates with SAP BusinessObjects as its reporting platform. A schema change retyped several fields from integer to character. Three failure modes were in play across the report estate:

- Calculations using the field needed rewriting.
- Filters mixing the field with a number caused comparison errors.
- Object merges based on the field broke silently, distorting layouts and totals.

A typical customer manages up to 1,000 reports; only a handful were actually affected. Identifying which ones, by hand, meant opening every report and inspecting every section.

With Impact Analysis the same job became a single SQL query against the extracted database. End-to-end the upgrade dropped from **multiple weeks to two days**, and quality went up because nothing was missed.

## How it works

1. Configure a JDBC connection to the database where you want the metadata to land.
2. Apply the bundled schema (`impactanalysis-cli initdb`).
3. Run the extraction (`impactanalysis-cli refresh`) — it walks the selected folders, pulls universe and document metadata, writes it into the database in one transaction per artifact.
4. Query the database with anything: SSMS, a Webi report, your favourite IDE, an AI assistant via [dbquerymcp](/products/dbquerymcp/).

Re-run the extraction whenever the source state changes. Rows for the refreshed universe / document are replaced cleanly; everything else is left alone.

## Prerequisite

- SAP BusinessObjects 4.x or 2025 Client Tools.
- A target database (SQLite, SQL Server, or Oracle). For SQLite there's nothing to install.
- A PRO license for full automation; without it the tool runs limited to a small sample for evaluation.

## Information

- [Impact Analysis — user guide](/pages/impact-analysis-user-guide/)

## Downloads

- [Impact Analysis (impactanalysis-v0.3-20240924.zip)](https://docs.google.com/forms/d/e/1FAIpQLSetJ1U_vsJUYi41Hi3RvRMkboZb97VapLgJTMAZhohJei5-Ig/viewform)
- [Buy Biclever PRO €300/year/user](https://biclever.com/pro)

## Support

- [support@biclever.com](mailto:support@biclever.com)

