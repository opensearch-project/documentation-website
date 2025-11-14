---
layout: default
title: Query insights
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /query-insights/
  - /observing-your-data/query-insights/
---

# Query insights
**Introduced 2.12**
{: .label .label-purple }

To monitor and analyze the search queries within your OpenSearch cluster, you can obtain query insights. With minimal performance impact, query insights features aim to provide comprehensive insights into search query execution, enabling you to better understand search query characteristics, patterns, and system behavior during query execution stages. Query insights facilitate enhanced detection, diagnosis, and prevention of query performance issues, ultimately improving query processing performance, user experience, and overall system resilience.

Typical use cases for query insights features include the following:

- Identify the slowest or most resource-intensive queries impacting your cluster.
- Debug latency spikes and understand query performance patterns.
- Analyze common slow query structures to find optimization opportunities.
- Monitor live, in-flight queries to diagnose immediate search performance issues.

Query insights features are supported by the Query Insights plugin. At a high level, query insights features comprise the following components:

* _Collectors_: Gather performance-related data points at various stages of search query execution.
* _Processors_: Perform lightweight aggregation and processing on data collected by the collectors.
* _Exporters_: Export the data into different sinks.


## Installing the Query Insights plugin

You need to install the `query-insights` plugin to enable query insights features. To install the plugin, run the following command:

```bash
bin/opensearch-plugin install query-insights
```
For information about installing plugins, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Query Insights features and settings

Query Insights provides several ways to monitor and analyze your search queries:

-   **[Top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/)**: Identify the most resource-intensive or slowest queries over specific time frames based on various performance metrics.
-   **[Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/)**: Discover patterns and analyze similar slow queries by grouping them based on query source structure.
-   **[Live queries monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/live-queries/)**: Get real-time visibility into search queries currently executing within your cluster to identify and debug queries that are currently long running or resource heavy.
-   **[Query insights dashboards]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-insights-dashboard/)**: Visualize and configure top query insights interactively in OpenSearch Dashboards.
-   **[Query metrics]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-metrics/)**: Understand the specific performance metrics per query type.

## Query Insights plugin health

For information about monitoring the health of the Query Insights plugin, see [Query Insights plugin health]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/health/).