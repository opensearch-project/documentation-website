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

Piped Processing Language (PPL) is a query language that lets you use pipe (`|`) syntax to explore, discover, and query data stored in OpenSearch. The PPL syntax consists of commands delimited by the pipe character (`|`) where data flows from left to right through each pipeline, as shown in the following example:

```sql
search command | command 1 | command 2 ...
```

You can only use read-only commands like `search`, `where`, `fields`, `rename`, `dedup`, `stats`, `sort`, `eval`, `head`, `top`, and `rare`.

## Next steps

Learn how to use PPL within the OpenSearch Dashboards [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/) tool.
