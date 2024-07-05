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
  - /search-plugins/sql/ppl/index/
  - /observability-plugin/ppl/index/
---

# PPL

Piped Processing Language (PPL) is a query language that is available in OpenSearch, and is particularly well-suited for analyzing observability data, such as logs, metrics, and traces, due to its Unix-like syntax and ability to handle semi-structured data efficiently. PPL provides an alternative to query DSL, which is powerful, yet has a steep learning curve, and SQL, which is best suited for more complex analytical queries. 

With PPL, you can extract insights from OpenSearch with a sequence of commands delimited by pipes (|). PPL supports a comprehensive set of commands including `search`, `where`, `fields`, `rename`, `dedup`, `sort`, `eval`, `head`, `top` and `rare`, as well as functions, operators and expressions. 

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
- [Cross-cluster search](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/cross_cluster_search.rst#using-cross-cluster-search-in-ppl) in PPL
