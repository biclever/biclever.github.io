---
title: "Security Exporter"
description: The tool allows extracting access rights to an Excel.
date: 2018-11-18T12:33:46+10:00
published: true
weight: 6
---

Checking access rights setup in SAP BusinessObjects can be challenging. You need to click on each item in the CMC to check the configuration. This process can lead to incorrect setups, a lack of security overview, and potential security issues. Security Exporter simplifies this by allowing you to easily extract the security configuration into an Excel format.

Security Exporter is a command-line program. The following options are available:

- **-server**=localhost:6400: BO server
- **-username**=Administrator: BO username (Enterprise)
- **-password**=: BO user password
- **-includedetails**=N: By default, ids and other technical details are omitted
- **-output**=output.xlsx: Output Excel file

If the amount of data is too large for an Excel file, you can export the result to tab-separated text files using the following options (instead of -output=)
- **-outputType**=txt: Format of the output (txt or xlsx)
- **-outputFolder**=.: Output folder where text files will be created

You can provide parameters either in the config.ini file or as command-line arguments. For instance, the server and username can be specified in the config file and the password can be provided as an argument. 

```
securityexporter.bat -password=******
```

If a parameter is provided both in the config.ini file and as a command-line argument, the command-line value will take precedence and the config.ini value will be ignored.

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

If the output format is txt, the result will be saved in text files with corresponding names. 

### Assigned Access Levels
![Assigned Access Levels](/images/pages/security-assigned-access-levels.png)

### Assigned Rights
![Assigned Rights](/images/pages/security-assigned-rights.png)

### Assigned Principals
![Assigned Principals](/images/pages/security-principals.png)

### Access Levels Setup
![Access Levels Setup](/images/pages/security-access-levels.png)

## Queries

You can configure the scope of extraction in the queries file.

Security is usually configured on public folders, and this is typically the main focus of analysis. Therefore the default query is:

```sql
SELECT TOP 100000 * FROM CI_INFOOBJECTS WHERE SI_ANCESTOR = 23 AND SI_KIND='Folder'
```

This query extracts all CMS objects of type 'Folder' that are subfolders of the root Public Folder with ID 23. By default, BO CMS queries return a maximum of 1000 objects. Therefore, we need to modify the query with the TOP option in case there are more than 1000 folders.

You can change or add more queries. Each query should be on a separate line. Empty lines will be ignored. Comments start with `#`.

## Downloads

The tool should work with any version of SAP BusinessObjects 4.x, as it uses local BO SDK libraries installed on the machine. It has been tested on BO 4.2 SP8 and BO 4.3 SP3.

- [Security Exporter (securityexporter-v1.2-20241027.zip)](https://drive.google.com/uc?export=download&id=1-DJ56x29gydS0NNmpABgSHOqwrT9cebJ)

## Support

- [support@biclever.com](mailto:support@biclever.com)

