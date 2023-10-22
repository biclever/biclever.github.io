---
title: "Unx Documenter with Windows AD"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

First, you need to make sure that you can run **Information Design Tool** with Windows AD.

1. Make sure that you have `c:\winnt\bscLogin.conf` and `c:\winnt\krb5.ini` files. They may also be located under `c:\Windows`. If you do not have these files on your PC, they should be available on BO server.

2. Add the following lines to the end of `C:\Program Files (x86)\SAP BusinessObjects\SAP BusinessObjects Enterprise XI 4.0\win32_x86\InformationDesignTool.ini`:

    ```
    -Djava.security.auth.login.config=c:\winnt\bscLogin.conf
    -Djava.security.krb5.conf=c:\winnt\krb5.ini
    ```

3. Try to login with Windows AD credentials. If any issues arise, resolve them before proceeding with UnxDoc.

To set up **UnxDoc**, perform the following steps:

1. Open the batch file `unxdoc.bat`.

2. Find the line:

    ```
    START "" %JAVA%\bin\javaw.exe -Dbusinessobjects.connectivity.directory="%CD%" -cp "%CP%" com.biclever.gui.Program
    ```

3. Add the parameters after `javaw.exe` (in one line, separated by space). There should be no spaces in the path, and no space before or after `=`. For example:

    ```
    START "" %JAVA%\bin\javaw.exe -Djava.security.auth.login.config=c:\winnt\bscLogin.conf -Djava.security.krb5.conf=c:\winnt\krb5.ini -Dbusinessobjects.connectivity.directory="%CD%" -cp "%CP%" com.biclever.gui.Program
    ```

4. Save the file.

5. Start `unxdoc.bat` and try to login with your Windows AD credentials.