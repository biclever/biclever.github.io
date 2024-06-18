---
title: "Security Exporter"
description: The tool allows extracting access rights to an Excel.
date: 2018-11-18T12:33:46+10:00
published: true
weight: 6
---

# Security Exporter

Checking access rights setup can be challenging. You need to click on each item in the CMC to check the configuration. This process can lead to incorrect setups, a lack of security overview, and potential security issues.

Security Exporter simplifies this by allowing you to easily extract the security configuration into an Excel format.

It is a command-line program. You can provide parameters either in the config.ini file or as command-line arguments:

- **-server**=localhost: BO server
- **-username**=Administrator: BO username (Enterprise)
- **-password**=: BO user password
- **-queries**=queries.txt: File with queries (see below).
- **-output**=output.xlsx: Output Excel file
- **-details**=N: By default, some details such as IDs are omitted.

## Queries

Security is usually configured on public folders, which is the main focus. The default query is:

```sql
SELECT TOP 100000 * FROM CI_INFOOBJECTS WHERE SI_ANCESTOR = 23 AND SI_KIND='Folder'
```

This query extracts all CMS objects of type 'Folder' that are subfolders of the root Public Folder with ID 23.

You can change or add more queries. Each query should be on a separate line. Empty lines will be ignored. Comments start with `#`.

**Downloads:**
- TBD
  
**Support:**
- [support@biclever.com](mailto:support@biclever.com)

