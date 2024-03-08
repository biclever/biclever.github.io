---
title: "Enabling Semantic Layer Java SDK for Unx Documenter"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

To use Unx Documenter, the Semantic Layer Java SDK must be enabled. This ensures that the tool utilizes the libraries specific to your version of SAP Business Objects and is compatible with any service pack or fix pack.

Although SL SDK is installed on the server, it is unchecked by default during the installation of SAP BusinessObjects client tools and, therefore, often not installed. Here are the steps to enable it:

Open "Apps and Features". Locate the client tools and click "Uninstall". This action will not actually uninstall the client tools but will initiate the setup program instead. (Ensure that you have selected the full/base installer and not a patch):

![Windows 10](/images/pages/windows10.png)

In the installer, select the option "Modify":

![Modify](/images/pages/sl-sdk-enable-02.png)

Click "Next" for language selection. Add Semantic Layer Java SDK and complete the installation with "Next":

![Add Semantic Layer Java SDK](/images/pages/sl-sdk-enable-04.png)

You are now ready to use Unx Documenter.