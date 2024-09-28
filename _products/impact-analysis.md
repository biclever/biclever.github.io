---
title: "Impact Analysis"
description: The tool that identifies what universes can be impacted by a database change, and what reports can be impacted by a universe change.
date: 2024-03-11T13:19:00+10:00
published: true
weight: 4
---

Impact Analysis streamlines the extraction of metadata from universes and documents within SAP BusinessObjects, aiming primarily to assess how alterations in the database and universe could impact reports. It aids in resolving queries such as, "Which reports require testing if an object is modified?" Additionally, it serves a vital role in quality assurance, enabling the verification of variable definition consistency across reports. Furthermore, it facilitates the rapid identification of reports utilizing specific functionalities.

Impact Analysis is a command line tool designed to extract metadata and upload the results to a database, such as SQL Server or SQLite. Subsequent analysis can be conducted using any reporting tool, such as SAP BusinessObjects BI, or through direct queries to the database.

## Case study
The Deltek Maconomy ERP system, utilized by over 200 customers, integrates with SAP BusinessObjects as its principal reporting tool. Recently, a few key fields underwent modification, transitioning from integer to character types, necessitating updates to the reports. Notably, some customers manage up to 1,000 reports.

The field type change can potentially affect reports in several ways, including:

- The fields may be used in calculations, necessitating rewrites of these calculations.
- The fields may be used in filtrations, and the change could lead to erroneous comparisons between integer and string values.
- Previously merged objects based on the field might become unmerged, breaking layouts and calculations.

To address these issues, manual verification of all reports is required to identify those utilizing the affected fields. This process involves scrutinizing every report section to locate where the impacted objects are used. Despite the vast number of reports, only a few were actually affected by this change and needed correction. Consequently, identifying the necessary corrections could demand extensive efforts. However, using the tool significantly streamlined the upgrade process, reducing the time from several weeks to just two days and markedly enhancing the quality of the upgrade.

**[User Guide](/pages/impact-analysis-for-boe/)**

## Versions

- **v0.3** Data model adjustments.

- **v0.2** Corrected the batch file to automatically detect the BO installation folder and use BO standard java.

- **v0.1** Inital version.

**Downloads:**

- [Impact Analysis (impactanalysis-v0.3-20240924.zip)](https://docs.google.com/forms/d/e/1FAIpQLSetJ1U_vsJUYi41Hi3RvRMkboZb97VapLgJTMAZhohJei5-Ig/viewform)

**Support:**
- [support@biclever.com](mailto:support@biclever.com)

