---
layout: default
title: PPL
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /sql-and-ppl/ppl/
  - /search-plugins/sql/ppl/
  - /search-plugins/sql/ppl/index/
  - /search-plugins/ppl/
  - /observability-plugin/ppl/
  - /search-plugins/ppl/index/
  - /search-plugins/ppl/endpoint/
  - /search-plugins/ppl/protocol/
  - /observability-plugin/ppl/index/
---

# PPL

Piped Processing Language (PPL) is a query language that focuses on processing data in a sequential, step-by-step manner. PPL uses the pipe (`|`) operator to combine commands to find and retrieve data. It is particularly well suited for analyzing observability data, such as logs, metrics, and traces, due to its ability to handle semi-structured data efficiently.

## PPL syntax

The following example shows the basic PPL syntax:

```sql
search source=<index-name> | <command_1> | <command_2> | ... | <command_n>
```
{% include copy.html %}

See [Syntax]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/syntax/) for specific PPL syntax examples.

## PPL commands

PPL filters, transforms, and aggregates data using a series of commands. See [Commands]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/) for a description and an example of each command.

## Using PPL within OpenSearch

The SQL plugin is required to run PPL queries in OpenSearch. If you're running a minimal distribution of OpenSearch, you might have to [install the SQL plugin]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) before using PPL.
{: .note}

You can run PPL queries interactively in OpenSearch Dashboards or programmatically using the ``_ppl`` endpoint. 

In OpenSearch Dashboards, the [Query Workbench tool](https://playground.opensearch.org/app/opensearch-query-workbench#/) provides an interactive testing environment, documented in [Query Workbench documentation]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/).

To run a PPL query using the API, see [SQL and PPL API]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-ppl-api/).


## Developer documentation

Developers can find information in the following resources:

- [Piped Processing Language](https://github.com/opensearch-project/piped-processing-language) specification
- [OpenSearch PPL Reference Manual](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/index.rst)
- [Observability](https://github.com/opensearch-project/dashboards-observability/) using [PPL-based visualizations](https://github.com/opensearch-project/dashboards-observability#event-analytics)
- PPL [Data types](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/general/datatypes.rst)
- [Cross-cluster search](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/cross_cluster_search.rst#using-cross-cluster-search-in-ppl) in PPL
