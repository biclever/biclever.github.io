---
title: "Enabling Semantic Layer Java SDK for Unx Documenter"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

To utilize Unx Documenter, the **Semantic Layer (SL) Java SDK** must be enabled. This ensures that the tool integrates with the appropriate libraries corresponding to your SAP BusinessObjects version, ensuring compatibility with installed service packs and fix packs.

While the SL SDK is included with the server installation, it is not selected by default during the installation of SAP BusinessObjects client tools and is therefore frequently omitted. To enable the SL SDK, perform the following steps:

1. Open **"Apps and Features"** from the system settings.  
2. Locate **SAP BusinessObjects Client Tools** in the application list.  
3. Select **Uninstall**. This action does not remove the client tools but launches the installer in maintenance mode.

![Windows 10](/images/pages/windows10.png)

4. In the installer, choose the **Modify** option and click **Next**:  

![Modify](/images/pages/sl-sdk-enable-02.png)

5. Proceed to the language selection screen, then add the Semantic Layer Java SDK feature. Complete the modification by following the remaining prompts and clicking Next.

![Add Semantic Layer Java SDK](/images/pages/sl-sdk-enable-04.png)

You are now ready to use Unx Documenter.