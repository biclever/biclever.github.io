---
title: "Webi Master"
description: The tool automates various modifications of Webi documents.
date: 2024-05-25T10:45:00+10:00
published: true
weight: 5
---

The tool has the following features:

* Connects to BO via a RESTful API, eliminating the need for server or client tools.
* List of documents: Exports the list of documents.
* List of data providers: Exports the list of documents and their universes. Unlike CMC’s “Check relationships,” this feature opens documents and checks actual universes, providing more accurate results and identifying broken dependencies (e.g., missing universes).
* Variables: Lists variables in the documents and calculates the “Evaluation Order” for variables to identify dependencies.
* Purge documents: Cleans up prompt values e.g. before promotion to prod environments.
* Force query regeneration: Regenerates all queries in selected documents. Custom queries are not regenerated.
* Change unv to unx: Remaps documents to unx; see the help section for suggested use.
* CMS Query: Runs CMS queries without needing server access or client tools, unlike the CMS Query Builder.

![Webi Master 0.1](/images/pages/webimaster-01.png)

Limited Availability. Contact [dmytro@biclever.com](mailto:dmytro@biclever.com) for a trial license.

## Versions

- **v0.2** 

- **v0.1** Inital version. Found issues: this version does not close sessions even after logging off (likely due to an API error, possibly affecting only BO 4.3). This may cause the Webi processing server to crash after processing of 200 reports and require a restart. A corrected version will be released soon. 
  
**Downloads:**
- [Webi Master (webimaster-v0.1-20240525.zip)](https://drive.google.com/uc?export=download&id=1rzsFWpFD4FTqr6RgijDf11E4VqmN_aQI)
  
**Support:**
- [support@biclever.com](mailto:support@biclever.com)

