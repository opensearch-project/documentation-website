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

Piped Processing Language (PPL) is a query language that focuses on processing data in a sequential, step-by-step manner. PPL uses the pipe (`|`) operator to combine commands to find and retrieve data. PPL is not exclusive to OpenSearch It is the primary language used with observability in OpenSearch. 

## PPL syntax

The following example shows the basic PPL syntax:

```sql
search source=<index-name> | <command_1> | <command_2> | ... | <command_n>
```
{% include copy.html %}

See [Syntax]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/syntax/) for specific PPL syntax examples.

## PPL commands

PPL filters, transforms, and aggregates data using a series of commands. See [Commands](/search-plugins/sql/ppl/functions/) for a description and an example of each command.  

## Using PPL within OpenSearch 

To use PPL, you must have installed OpenSearch Dashboards. PPL is available within the Query Workbench ({{site.url}}{{site.baseurl}}/dashboards/query-workbench/) tool. See the [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/) documentation for a tutorial on using PPL in OpenSearch.
