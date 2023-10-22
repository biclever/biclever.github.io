---
title: "Error when running UnvDoc on BO 4.1 SP12, 4.2 SP6 (The RPC server is unavailable)"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

If you use UnvDoc for BO 4.1 SP12, 4.2 SP6, you may encounter the following errors:

- **"Unable to cast COM object of type 'Designer.ApplicationClass' to interface type 'Designer.IApplication'."**
- **"The RPC server is unavailable."**

![RPC server error](/images/pages//RPC-server.png)

- **"QI for IEnumVARIANT failed on the unmanaged server"**

![IEnumVARIANT error](/images/pages/IEnumVARIANT.png)

The issue is caused by an error in Universe Designer Tool API introduced in some of the Service Packs of SAP Business Objects. We are not able to fix it on our side. Hopefully, it will be resolved in a future Service Pack or Patch.

We do not know yet the exact Service Pack when the issue was introduced. UnvDoc should fully work for BO 4.1 SP7, 4.2 SP3.

### Workaround

As a workaround, you should avoid importing universes using the UnvDoc tool. Instead, follow these steps:

1. Login to Universe Design Tool and import universes that you want to export to Excel. Close UDT.
2. Open UnvDoc and log in. Open the universes using the button "Open..."
3. Export metadata to Excel using "Quick View" or "Save to Excel."