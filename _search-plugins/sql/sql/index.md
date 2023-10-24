---
layout: default
title: SQL
parent: SQL and PPL
nav_order: 4
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/sql/sql/index/

---

# SQL

## Query Workbench

A simple way to test queries through the SQL plugin is to use the **Query Workbench** tool in OpenSearch Dashboards. You can access **Query Workbench** from the OpenSearch Dashboards main menu under **OpenSearch Plugins** > **Query Workbench**. Learn more about how to use this tool in the [Query Workbench]({{site.url}}{{site.baseurl}}/search-plugins/sql/workbench/) documentation.

The following image shows a view of the **Query Workbench** user interface.

![OpenSearch Dashboards SQL UI plugin]({{site.url}}{{site.baseurl}}/images/query-workbench-UI.png)

## SQL and OpenSearch terminology

Here’s how core SQL concepts map to OpenSearch:

SQL | OpenSearch
:--- | :---
Table | Index
Row | Document
Column | Field

## REST API

For a complete REST API reference for the SQL plugin, see [SQL/PPL API]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql-ppl-api). 

To use the SQL plugin with your own applications, send requests to the `_plugins/_sql` endpoint:

```json
POST _plugins/_sql
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```
{% include copy-curl.html %}

You can query multiple indexes by using a comma-separated list:

```json
POST _plugins/_sql
{
  "query": "SELECT * FROM my-index1,myindex2,myindex3 LIMIT 50"
}
```
{% include copy-curl.html %}

You can specify an index pattern with a wildcard expression:

```json
POST _plugins/_sql
{
  "query": "SELECT * FROM my-index* LIMIT 50"
}
```
{% include copy-curl.html %}

To run the preceding query in the command line, use the [curl](https://curl.haxx.se/) command:

```bash
curl -XPOST https://localhost:9200/_plugins/_sql -u 'admin:admin' -k -H 'Content-Type: application/json' -d '{"query": "SELECT * FROM my-index* LIMIT 50"}'
```
{% include copy.html %}

You can specify the [response format]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/) as JDBC, standard OpenSearch JSON, CSV, or raw. By default, queries return data in JDBC format. The following query sets the format to JSON:

```json
POST _plugins/_sql?format=json
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```
{% include copy-curl.html %}

For more information about request parameters, settings, supported operations, and tools, see the related topics under [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql/index/).
