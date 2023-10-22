---
title: "Enabling Semantic Layer Java SDK for Unx Documenter"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

To use Unx Documenter, you need to have Semantic Layer Java SDK enabled. By default, it is not enabled during the installation of SAP BusinessObjects client tools. Here are the steps to enable it:

1. Open "Programs and Features":

![Programs and Features](/images/pages/sl-sdk-enable-00.png)

2. Find the client tools and double-click on them (or right-click and select "Uninstall/Change"):

![Client Tools](/images/pages/sl-sdk-enable-01.png)

   - Note: The "Uninstall/Change" option is only available on the base installer (not on patches). Running "Uninstall/Change" on the base installer will detect the current patch level and modify it accordingly.

3. On Windows 10, if the "Modify" option is grayed out, click "Uninstall." This will start the setup program. Ensure that you selected the full/base installer and not a patch:

![Windows 10](/images/pages/windows10.png)

4. In the client tools setup, select "Modify":

![Modify](/images/pages/sl-sdk-enable-02.png)

5. Click "Next" for language selection. Add Semantic Layer Java SDK and complete the installation with "Next":

![Add Semantic Layer Java SDK](/images/pages/sl-sdk-enable-04.png)

You are now ready to use Unx Documenter.