---
title: "Webi Master"
description: The tool automates modifications and metadata extraction from Webi documents.
date: 2024-05-25T10:45:00+10:00
published: true
weight: 4
tier: pro
---

**Built on the BIP REST API — no SAP SDK or server-side install required.** Webi Master talks to your BO platform over HTTPS, so it runs on any workstation with BO Client Tools and a network route to the BIP server.

## Features

- **Data Provider List Export**: Exports a list of documents along with their universes. 
Unlike the CMC’s “Check Relationships” feature, this tool opens documents and checks actual universes, 
providing more accurate results and identifying broken dependencies (e.g., missing universes).

- **UNV to UNX Conversion**: Automatic remapping of documents from UNV universes to UNX universes.
UNV universes are deprecated. The feature allows you quickly migrate your reports to UNX universes. (Check instructions in 
the tool for the suggested use)

- **Data Source Remapping**: Remaps documents using a specified mapping.

- **Regression Testing**: Allows you to run export report prompts, and then run reports with specified values. 
This feature is useful to ensure that changes do not negatively impact existing functionalities.

- **Document Purging**: Cleans up saved prompt values. 

- **Force Query Regeneration**: Regenerates all queries in selected documents (custom queries are not regenerated).

- **CMS Query Execution**: Runs CMS queries without requiring server client tools.

Do you need to automate another workflow? We’d love to hear from you at [support@biclever.com](mailto:support@biclever.com)

![Webi Master 2026](/images/pages/webi-master-2026-01.png)
{:.full}

## Prerequisite

You need to have SAP BusinessObjects 4.x or 2025 Client Tools on your machine.

The BIP RESTful API must be enabled and reachable on the target system. It is normally enabled by default, but it is worth checking with your BO administrator if Webi Master cannot connect.

## Downloads

Without a PRO license the tool runs in a limited test mode so you can evaluate it; full automation and bulk operations require a PRO license.

- [Webi Master for BO 4.3 SP3+ (webimaster-20260501.zip)](https://drive.google.com/uc?export=download&id=1w6IKtsMX92JN30ky1OOxu6SGNyCDWfU3)
- [Buy Biclever PRO €300/year/user](https://biclever.com/pro)

## Support

- [support@biclever.com](mailto:support@biclever.com)

