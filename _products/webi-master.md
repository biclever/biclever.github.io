---
title: "Webi Master"
description: The tool automates various modifications of Webi documents.
date: 2024-05-25T10:45:00+10:00
published: true
weight: 5
---

**The tool offers the following features:**

- **RESTful API Connection**: Connects to BusinessObjects (BO) via a RESTful API, eliminating the need to install BO client tools.
  
- **Document List Export**: Exports a list of documents with additional details.

- **Data Provider List Export**: Exports a list of documents along with their universes. Unlike the Central Management Console (CMC)’s “Check Relationships” feature, this tool opens documents and checks actual universes, providing more accurate results and identifying broken dependencies (e.g., missing universes).

- **Variable Analysis**: Lists variables within the documents and calculates the “Evaluation Order” to identify dependencies among variables.

- **Document Purging** *(Premium feature 🌟)*: Cleans up prompt values, which is useful before promoting documents to production environments.

- **Force Query Regeneration** *(Premium feature 🌟)*: Regenerates all queries in selected documents (custom queries are not regenerated).

- **Regression Testing** *(Premium feature 🌟)*: Allows you to run regression tests to ensure that changes do not negatively impact existing functionalities.

- **UNV to UNX Conversion** *(Premium feature 🌟)*: Remaps documents from UNV (Universe) format to UNX format.

- **Data Source Remapping** *(Premium feature 🌟)*: Changes data sources in documents using a specified mapping.

- **CMS Query Execution**: Runs Central Management Server (CMS) queries without requiring server client tools, unlike the CMS Query Builder.


![Webi Master 0.7](/images/pages/webimaster-01.png)

**Downloads:**
- [Webi Master (webimaster-v0.7-20240922.zip)](https://drive.google.com/uc?export=download&id=11_Znvo6NKx12eKKMjHZCjM6uwnTm5k9t)
- [Webi Master (webimaster-v1.0-20241016.zip)](https://drive.google.com/uc?export=download&id=1dL0DfSwnK4GESce056L-CQAQfl3OJIW1)

The software is still in development.

Interested in trying the full version? Just send us an email! [dmytro@biclever.com](mailto:dmytro@biclever.com)

**Support:**
- [support@biclever.com](mailto:support@biclever.com)

## Versions

**v1.0 (2024-10-16)** 
- Major internal refactoring 

**v0.7 (2024-09-22)** 
- Bug fixes 

**v0.6 (2024-09-20)** 
- Corrected retrieving universe list

**v0.5 (2024-09-16)**
- Added regression testing allowing to automatically run reports

**v0.4 (2024-09-11)**
- Bug fixes

**v0.3 (2024-07-30)**
- Added remapping of unv to unx

**v0.2 (2024-06-17)**
- Corrected error with active sessions not being closed.
- Usability improvements.

**v0.1 (2024-05-25)**
- Initial version.
- Update (2024-06-12): This version does not close sessions even after logging off (likely due to an API error, possibly affecting only BO 4.3). This may cause the Webi processing server to crash after the processing of 200 reports and require a restart. Please do not use this version. A corrected version will be released soon.