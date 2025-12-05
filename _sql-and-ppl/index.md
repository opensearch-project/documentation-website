---
layout: default
title: SQL and PPL
nav_order: 230
has_children: true
has_toc: false
nav_exclude: true
permalink: /sql-and-ppl/
redirect_from:
  - /search-plugins/sql/
  - /search-plugins/sql/index/
---

# SQL and PPL

OpenSearch provides two powerful query languages that offer alternatives to the [OpenSearch query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/): **SQL** and **Piped Processing Language (PPL)**. Both languages make it easier to query and analyze your data using familiar syntax.

## SQL

SQL in OpenSearch bridges the gap between traditional relational database concepts and OpenSearch's document-oriented data storage. Use SQL when you want to leverage existing SQL knowledge to query, filter, and aggregate OpenSearch data with familiar `SELECT`, `WHERE`, `GROUP BY`, and other standard SQL operations.

**Best for**: Users with SQL experience who want to query OpenSearch data using familiar relational database syntax.

## PPL

PPL is a query language that processes data in a sequential, step-by-step manner using the pipe (`|`) operator to chain commands together. PPL excels at analyzing observability data like logs, metrics, and traces, and is particularly effective for exploratory data analysis and transformations.

**Best for**: Log analysis, observability workflows, and users who prefer a pipeline-based approach to data processing.

## Getting started

- Learn about the [SQL and PPL API]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-ppl-api/).
- Learn about [using SQL within OpenSearch]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql/).
- Learn about [using PPL within OpenSearch]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/).
- Learn about [using Query Workbench for SQL and PPL queries within OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/). 
- Learn more about OpenSearch SQL in the [Developer Guide](https://github.com/opensearch-project/sql/blob/main/DEVELOPER_GUIDE.rst).