---
layout: default
title: PPL
parent: SQL and PPL
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/sql/ppl/
  - /search-plugins/ppl/
  - /observability-plugin/ppl/
  - /search-plugins/ppl/index/
  - /search-plugins/ppl/endpoint/
  - /search-plugins/ppl/protocol/
---

# PPL

Piped Processing Language (PPL) is a query language that focuses on processing data in a sequential, step-by-step manner. PPL uses the pipe (`|`) operator to combine commands to find and retrieve data. It is the primary language used with observability in OpenSearch and supports multi-data queries.

## PPL syntax

The following example shows the basic PPL syntax:

```sql
search source=<index-name> | <command_1> | <command_2> | ... | <command_n>
```
{% include copy.html %}

See [Syntax]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/syntax/) for specific PPL syntax examples.

## PPL commands

PPL filters, transforms, and aggregates data using a series of commands. See [Commands]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions/) for a description and an example of each command.

## Using PPL within OpenSearch

To use PPL, you must have installed OpenSearch Dashboards. PPL is available within the [Query Workbench tool](https://playground.opensearch.org/app/opensearch-query-workbench#/). See the [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/) documentation for a tutorial on using PPL within OpenSearch.

## Developer documentation

Developers can find information in the following resources:

- [Piped Processing Language](https://github.com/opensearch-project/piped-processing-language) specification
- [OpenSearch PPL Reference Manual](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/index.rst)
- [Observability](https://github.com/opensearch-project/dashboards-observability/) using [PPL-based visualizations](https://github.com/opensearch-project/dashboards-observability#event-analytics)
- PPL [Data Types](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/general/datatypes.rst)
