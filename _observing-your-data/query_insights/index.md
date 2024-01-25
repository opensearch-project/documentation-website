---
layout: default
title: Query Insights
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /observability-plugin/query-insights/index/
  - /monitoring-plugins/query-insights/index/
---

# Query Insights

Query Insights helps you monitor and analyze the search queries within your OpenSearch cluster. With minimal performance impact, Query Insights features aim to provide comprehensive insights into search query executions, enabling users to better understand search query characteristics, patterns and system behavior during query execution stages. Query Insights will facilitate enhanced detection, diagnosis, and prevention of query performance issues, ultimately improving query processing performance, user experience, and overall system resilience.

Typical use cases of query insights:

- Identification of top queries by latency within specific timeframes
- Debug slow search queries and latency spikes

Query Insights features are backed up by the Query Insights plugin. At a high level, the Query Insights framework comprises the following integral components:

* Collectors: Within OpenSearch, collectors gather performance-related data points at various stages of search query executions.
* Processors: Built in the Query Insights Plugin, processors perform lightweight aggregation and processing on data collected by the collectors.
* Exporters: Built in exporters in Query Insight Plugin to export the insights data into different sinks.



![Query Insights Framework]({{site.url}}{{site.baseurl}}/images/query-insights/query-insights-framework.png)
