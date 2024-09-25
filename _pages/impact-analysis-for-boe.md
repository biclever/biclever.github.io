---
title: "Impact Analysis for SAP BusinessObjects"
date: 2019-03-07T12:00:00+00:00
weight: 3
---

# Impact Analysis for SAP BusinessObjects

Impact Analysis extracts the definitions of universes and Webi documents to a database. After this, you can perform further analysis using your preferred query tool.

Currently, Impact Analysis supports SQLite and SQL Server databases.

## SQLite File Database

A SQLite file database is a database that does not require server installation. The information will be exported into the file "metadata.sqlite". You can query the generated database using, for instance, [DB Browser (SQLite)](https://sqlitebrowser.org/). Alternatively, you can run queries and export the results using Impact Analysis' built-in tools.

SQLite is the default option. To get started, you only need to update the BO server information, username, and password in `config.ini`.

## SQL Server Database

To use SQL Server for metadata, you need to perform several extra steps.

1. Remove `config.ini` and rename `config_sqlexpress.ini` to `config.ini`.
2. Update the BO server information, username, and password in `config.ini`.
3. Create a database for metadata in SQL Server.
4. Update the SQL Server database connection parameters (`SERVER`, `INSTANCE`, `PORT`, `DATABASE`, `USERNAME`, `PASSWORD`):

```
-dburl=jdbc:sqlserver://SERVER\INSTANCE:PORT;databaseName=DATABASE;encrypt=true;→
trustServerCertificate=true
-dbusername=USERNAME
-dbpassword=PASSWORD
```

## Selecting Universes and Documents

By default, Impact Analysis will scan all universes and Webi documents in Public Folders. You can limit processing to specific folders using the parameters `-universes` and `-documents`. If you want to specify multiple folders, they should be separated by a semicolon. For instance:

```
-documents=/Report Samples;/Web Intelligence Samples
```

Note that if selected universes do not include the universes used by the document, your analysis may not be complete.

## Limitations

The tool extracts definitions but does not perform expansion of BO expressions like @Select(), @DerivedTable(), and similar.

The tool does not process BEX queries.

## Running Impact Analysis

To run Impact Analysis, execute the script `run.bat`.

## Example

Find all documents affected by a change in the column TRANSACTIONNUMBER:

```
select 
  * 
from 
  document_query 
inner join 
  document_query_object
on 
  document_query.query_name = document_query_object.query_name
and 
  document_query.document_id = document_query_object.document_id
where 
  exists(
    select * 
	from 
	  universe_object 
	inner join 
	  universe
	on 
	  universe_object.universe_id = universe.universe_id
	where 
	  select_sql like '%TRANSACTIONNUMBER%'
	and 
	  universe.universe_id = document_query.data_source_id
	and 
	  universe_object.object_id = document_query_object.object_id
  )
```

## Database

![impact analysis model](/images/pages/impact-analysis-model.png)

