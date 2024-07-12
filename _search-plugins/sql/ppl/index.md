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

The SQL plugin is required to run PPL queries in OpenSearch. If you're running a minimal distribution of OpenSearch, you might have to [install the SQL plugin]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) before using PPL.
{: .note}

You can run PPL queries interactively in OpenSearch Dashboards or programmatically using the ``_ppl`` endpoint. 

In OpenSearch Dashboards, the [Query Workbench tool](https://playground.opensearch.org/app/opensearch-query-workbench#/) provides an interactive testing environment, documented in [Query Workbench documentation]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/).

To run a PPL query using the API, see [SQL and PPL API]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql-ppl-api/).


## Developer documentation

Developers can find information in the following resources:

- [Piped Processing Language](https://github.com/opensearch-project/piped-processing-language) specification
- [OpenSearch PPL Reference Manual](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/index.rst)
- [Observability](https://github.com/opensearch-project/dashboards-observability/) using [PPL-based visualizations](https://github.com/opensearch-project/dashboards-observability#event-analytics)
- PPL [Data Types](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/general/datatypes.rst)
- [Cross-cluster search](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/cross_cluster_search.rst#using-cross-cluster-search-in-ppl) in PPL
