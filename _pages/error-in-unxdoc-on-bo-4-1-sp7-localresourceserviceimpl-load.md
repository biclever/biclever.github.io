---
title: "Error when running UnxDoc on BO 4.1 SP7 (LocalResourceServiceImpl.load)"
date: 2019-03-07T12:00:00+00:00
weight: 3
---
Early versions of BusinessObjects Semantic Layer SDK have an error that may cause the failure of UnxDoc when importing a universe. A typical error looks as follows:

**Importing [.unx]**
**Error**
org.eclipse.emf.common.util.BasicEList$BasicIndexOutOfBoundsException: index=0, size=0
at org.eclipse.emf.common.util.BasicEList.get
at java.util.Collections$UnmodifiableList.get
at com.sap.sl.sdk.authoring.businesslayer.internal.services.MdsSdkLovPromptConverter.convertLovColumn
at com.sap.sl.sdk.authoring.businesslayer.internal.services.MdsSdkLovPromptConverter.convertLovColumn
at com.sap.sl.sdk.authoring.businesslayer.internal.services.MdsSdkLovPromptConverter.convertAssociatedLovs
at com.sap.sl.sdk.authoring.businesslayer.internal.services.MdsSdkLovPromptConverter.convertAssociatedLovs
at com.sap.sl.sdk.authoring.businesslayer.internal.services.MdsSdkLovPromptConverter.convertAssociatedLovs
at com.sap.sl.sdk.authoring.businesslayer.internal.services.MdsToSdkBusinessLayerConverter.createSdkModel
at com.sap.sl.sdk.authoring.businesslayer.internal.services.BusinessLayerModelToModel.createSdkModel
at com.sap.sl.sdk.authoring.local.internal.services.LocalResourceServiceImpl.createSdkBusinessLayer
at com.sap.sl.sdk.authoring.local.internal.services.LocalResourceServiceImpl.loadInternal
**at com.sap.sl.sdk.authoring.local.internal.services.LocalResourceServiceImpl.load**
at com.biclever.gui.unxdoc.UnxMetadataExtractor.extract
at com.biclever.gui.unxdoc.UnxTool.run
at com.biclever.gui.GuiProcessProcessingTask.doInBackground
at com.biclever.gui.GuiProcessProcessingTask.doInBackground
at javax.swing.SwingWorker$1.call
at java.util.concurrent.FutureTask$Sync.innerRun
at java.util.concurrent.FutureTask.run
at javax.swing.SwingWorker.run
at java.util.concurrent.ThreadPoolExecutor.runWorker
at java.util.concurrent.ThreadPoolExecutor$Worker.run
at java.lang.Thread.run

The exact error trace may be different, but the common line is the following: **at com.sap.sl.sdk.authoring.local.internal.services.LocalResourceServiceImpl.load**

The error occurs while loading the universe using the BO SDK before the universe is imported into the tool. Therefore, there is nothing that can be done in UnxDoc to avoid the issue.

The issue is fixed by SAP in higher versions of BusinessObjects (e.g., BO 4.2 SP6).

The issue is most likely caused by some internal universe issue. Usually, it is not possible to find it using Information Design Tool. The log above corresponds to an issue with the list of values based on a business layer query with a missing query. Unfortunately, the only way to find such objects is to review all list of values manually from IDT.