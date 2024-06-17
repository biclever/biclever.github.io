---
title: "Webi Master"
description: The tool automates various modifications of Webi documents.
date: 2024-05-25T10:45:00+10:00
published: true
weight: 5
---

The tool has the following features:

* Connects to BO via a RESTful API, eliminating the need for BO client tools to be installed.
* List of documents: Exports the list of documents.
* List of data providers: Exports the list of documents and their universes. Unlike CMC’s “Check relationships,” this feature opens documents and checks actual universes, providing more accurate results and identifying broken dependencies (e.g., missing universes).
* Variables: Lists variables in the documents and calculates the “Evaluation Order” for variables to identify dependencies.
* Purge documents: Cleans up prompt values e.g. before promotion to prod environments. (Premium feature)
* Force query regeneration: Regenerates all queries in selected documents. Custom queries are not regenerated. (Premium feature)
* Change unv to unx: Remaps documents to unx; see the help section for suggested use. (Premium feature)
* CMS Query: Runs CMS queries without needing server access or client tools, unlike the CMS Query Builder.

![Webi Master 0.1](/images/pages/webimaster-01.png)

**Downloads:**
- [Webi Master (webimaster-v0.2-20240616.zip)](https://drive.google.com/uc?export=download&id=1jKXZ87BrIG3zl4TyK9v4jxUMUw5UpJmv)

**Webi Master Premium - $300 per year:** [**Buy on Stripe**](https://buy.stripe.com/eVacP68wIdFSf84145)

Unlock advanced features and support further development with our Premium plan.

You will receive the license key within 24 hours after purchase. The license is personal and should not be shared. It is not bound to a specific machine, and activation does not require internet access. Please place the file in the folder containing webimaster.exe.

**Support:**
- [support@biclever.com](mailto:support@biclever.com)

## Versions

**v0.2 (2024-06-17)**
- Corrected error with active sessions not being closed.
- Usability improvements.

**v0.1 (2024-05-25)**
- Initial version.
- Update (2024-06-12): This version does not close sessions even after logging off (likely due to an API error, possibly affecting only BO 4.3). This may cause the Webi processing server to crash after the processing of 200 reports and require a restart. Please do not use this version. A corrected version will be released soon.