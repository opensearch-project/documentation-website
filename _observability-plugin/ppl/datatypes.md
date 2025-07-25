---
layout: default
title: Data Types
parent: Piped processing language
nav_order: 6
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/datatypes/
---


# Data types

The following table shows the data types supported by the PPL plugin and how each one maps to OpenSearch and SQL data types:

PPL Type | OpenSearch Type | SQL Type
:--- | :--- | :---
boolean |	boolean |	BOOLEAN
byte | byte |	TINYINT
byte |	short |	SMALLINT
integer |	integer |	INTEGER
long |	long |	BIGINT
float |	float |	REAL
float |	half_float |	FLOAT
float |	scaled_float |	DOUBLE
double |	double |	DOUBLE
string |	keyword |	VARCHAR
text |	text |	VARCHAR
timestamp |	date |	TIMESTAMP
ip |	ip |	VARCHAR
timestamp |	date |	TIMESTAMP
binary |	binary |	VARBINARY
struct |	object |	STRUCT
array |	nested |	STRUCT

In addition to this list, the PPL plugin also supports the `datetime` type, though it doesn't have a corresponding mapping with OpenSearch.
To use a function without a corresponding mapping, you must explicitly convert the data type to one that does.

The PPL plugin supports all SQL date and time types. To learn more, see [SQL Data Types]({{site.url}}{{site.baseurl}}/search-plugins/sql/datatypes/).
