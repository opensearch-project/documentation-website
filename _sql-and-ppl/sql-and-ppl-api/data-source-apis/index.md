---
layout: default
title: Data source APIs
nav_order: 1
has_children: true
parent: SQL and PPL API
has_toc: false
redirect_from:
  - /sql-and-ppl/sql-and-ppl-api/data-source-apis/
---

# Data source APIs

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

OpenSearch supports querying external non-OpenSearch data sources such as Prometheus using the SQL plugin. The Direct Query API enables querying these data sources directly using their native query languages (for example, PromQL for Prometheus).

The following data source APIs are supported:

- [Execute direct query]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-and-ppl-api/data-source-apis/execute-direct-query/)
- [Read resources]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-and-ppl-api/data-source-apis/read-resources/)
- [Write resources]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-and-ppl-api/data-source-apis/write-resources/)