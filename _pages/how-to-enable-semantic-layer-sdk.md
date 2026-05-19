---
title: "Enabling Semantic Layer Java SDK for Unx Documenter"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

To use Unx Documenter, the **Semantic Layer (SL) Java SDK** must be installed locally so the tool can load the libraries that match your SAP BusinessObjects version, including any service packs and fix packs.

The SL SDK ships with the server installation, but it is **not** selected by default in the SAP BusinessObjects client tools installer, so it is frequently missing on a client-only machine. To enable it, run the client-tools installer in maintenance mode and add the feature:

* Open **Apps and Features** in Windows settings.
* Locate **SAP BusinessObjects Client Tools** in the list.
* Click **Uninstall** — this does not remove the client tools; it launches the installer in maintenance mode.

![Windows 10](/images/pages/windows10.png)

* In the installer, choose **Modify** and click **Next**.

![Modify](/images/pages/sl-sdk-enable-02.png)

* Proceed to the language-selection screen, then add the **Semantic Layer Java SDK** feature. Complete the modification by following the remaining prompts.

![Add Semantic Layer Java SDK](/images/pages/sl-sdk-enable-04.png)

You are now ready to use Unx Documenter.

## Alternative solution

If you can't run the installer — locked-down workstation, lost install media, server already patched past the client installer you have on hand — copy the `SL SDK` folder from a BusinessObjects server (or another machine that has it) into your local BO installation:

```
\\<bo-server>\…\SAP BusinessObjects Enterprise XI 4.0\SL SDK\
        →
C:\Program Files (x86)\SAP BusinessObjects\SAP BusinessObjects Enterprise XI 4.0\SL SDK\
```

![Copy SL SDK Folder](/images/pages/sl-sdk-enable-05.png)

The **version of the source `SL SDK` folder must match your local BO client tools** (release, service pack, and fix pack — check Help → About in IDT or Universe Designer on both machines). Mismatched binaries surface as obscure class-not-found or method-not-found errors at runtime.

Manual copies don't track upgrades: when the server is patched, the local `SL SDK` folder has to be re-copied to stay in sync.
