---
layout: default
title: SQL
nav_order: 38
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/sql/
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/index/
---

# SQL

OpenSearch SQL lets you write queries in SQL rather than the [OpenSearch query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text). If you're already familiar with SQL and don't want to learn the query DSL, this feature is a great option.


## Workbench

The easiest way to get familiar with the SQL plugin is to use **Query Workbench** in OpenSearch Dashboards to test various queries. To learn more, see [Workbench]({{site.url}}{{site.baseurl}}/search-plugins/sql/workbench/).

![OpenSearch Dashboards SQL UI plugin]({{site.url}}{{site.baseurl}}/images/sql.png)


## REST API

To use the SQL plugin with your own applications, send requests to `_plugins/_sql`:

```json
POST _plugins/_sql
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```

Here’s how core SQL concepts map to OpenSearch:

SQL | OpenSearch
:--- | :---
Table | Index
Row | Document
Column | Field

You can query multiple indices by listing them or using wildcards:

```json
POST _plugins/_sql
{
  "query": "SELECT * FROM my-index1,myindex2,myindex3 LIMIT 50"
}

POST _plugins/_sql
{
  "query": "SELECT * FROM my-index* LIMIT 50"
}
```

For a sample [curl](https://curl.haxx.se/) command, try:

```bash
curl -XPOST https://localhost:9200/_plugins/_sql -u 'admin:admin' -k -H 'Content-Type: application/json' -d '{"query": "SELECT * FROM opensearch_dashboards_sample_data_flights LIMIT 10"}'
```

By default, queries return data in JDBC format, but you can also return data in standard OpenSearch JSON, CSV, or raw formats:

```json
POST _plugins/_sql?format=json|csv|raw
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```

See the rest of this guide for detailed information on request parameters, settings, supported operations, tools, and more.


## Contributing

To get involved and help us improve the SQL plugin, see the [development guide](https://github.com/opensearch-project/sql/blob/main/DEVELOPER_GUIDE.rst) for instructions on setting up your development environment and building the project.
