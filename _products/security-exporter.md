---
title: "Security Exporter"
description: The tool allows extracting access rights to an Excel.
date: 2018-11-18T12:33:46+10:00
published: true
weight: 6
tier: pro
---

Checking access rights setup in SAP BusinessObjects can be challenging. You need to click on each item in the CMC to check the configuration. 
This process can lead to incorrect setups, a lack of security overview, and potential security issues. 
Security Exporter simplifies this by allowing you to easily extract the security configuration into an Excel format.

## Output

[Download Example](https://drive.google.com/uc?export=download&id=1knk5C85e9_-hkUeX-CI5YbqJsgUKNtnc)

The output is an Excel workbook with the following sheets:
- Explicit Principals
- Explicit Access Levels
- Explicit Rights
- Effective Principals 
- Effective Access Levels
- Effective Rights
- Access Levels Setup

If the output format is `txt`, results will be saved in text files with corresponding names.

### Assigned Access Levels
![Assigned Access Levels](/images/pages/security-assigned-access-levels.png)
{:.full}

### Assigned Rights
![Assigned Rights](/images/pages/security-assigned-rights.png)
{:.full}

### Assigned Principals
![Assigned Principals](/images/pages/security-principals.png)
{:.full}

### Access Levels Setup
![Access Levels Setup](/images/pages/security-access-levels.png)
{:.full}

## Queries

You can configure the scope of extraction in the queries file.

Security is usually configured on public folders, and this is typically the main focus of analysis. Therefore the default query is:

```
SELECT TOP 100000 * 
FROM CI_INFOOBJECTS 
WHERE SI_ANCESTOR = 23 AND SI_KIND='Folder'
```

This query extracts all CMS objects of type 'Folder' that are subfolders of the root Public Folder with ID 23. By default, BO CMS queries return a maximum of 1000 objects. Therefore, we need to modify the query with the TOP option in case there are more than 1000 folders.

You can change or add more queries. Each query should be on a separate line. Empty lines will be ignored. Comments start with `#`.

![Security Exporter 2026](/images/pages/security-exporter-2026-01.png)
{:.full}

![Security Exporter 2026](/images/pages/security-exporter-2026-02.png)
{:.full}

![Security Exporter 2026](/images/pages/security-exporter-2026-03.png)
{:.full}

## Prerequisite

You need to have SAP BusinessObjects 4.x or 2025 Client Tools on your machine.

## Information

- [Security Exporter CLI](/pages/security-exporter-cli/)

## Downloads
Without a PRO license the tool runs in a limited test mode — you can retrieve and browse the security. A PRO license is required to export to Excel/CSV and to automate with the CLI.

- [Security Exporter for BO 4.3+ (securityexporter-20260501.zip)](https://drive.google.com/uc?export=download&id=1E9yEBhZsOVmScsp0w_VQkcdV85DLRfNV)
- [Buy Biclever PRO €300/year/user](https://biclever.com/pro)

## Support

- [support@biclever.com](mailto:support@biclever.com)