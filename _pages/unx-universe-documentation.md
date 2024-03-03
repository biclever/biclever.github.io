---
title: "Documenting Unx Universes: PDF vs. Excel"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

You can create documentation for a Unx universe in two ways: as a PDF or in an Excel spreadsheet. Here, we'll describe both methods.

## Creating PDF Documentation from IDT (Information Design Tool)

1. Open IDT and log in.
2. Retrieve the Unx universe in IDT.
3. Right-click on the item you want to document (e.g., business layer) and select "Save as."

  ![Creating PDF documentation of UNX in IDT](/images/pages/unx-documentation.png)

4. You can now select the destination and metadata elements to be exported.

  ![Selection of elements for PDF documentation of UNX in IDT](/images/pages/unx-documentation-2.png)

  ![PDF documentation of UNX created in IDT](/images/pages/unx-documentation-3.png)

This method is suitable for quickly generating printable documentation. However, if you need structured documentation for practical purposes, consider the following method.

## Creating XLSX Documentation using Biclever Unx Documenter

1. Download [Biclever Unx Documenter](/products/unx-universe-documenter/) and unpack it to a preferred folder. Ensure you have Semantic Layer SDK enabled.
2. Start the tool using `unxdoc.bat` and log in.

  ![Biclever Unx Documenter](/images/pages/unx-documentation-4.png)

3. Select a universe.

  ![Selecting a universe](/images/pages/unx-documentation-5.png)

4. Click "Process" and then "Export result." Choose a destination XLSX file.

  ![Exporting result to XLSX](/images/pages/unx-documentation-6.png)

  The universe metadata will be exported to an Excel spreadsheet, allowing for easy filtering, searching, and analysis.

  ![Excel spreadsheet with Unx universe metadata](/images/pages/unx-documentation-7.png)
