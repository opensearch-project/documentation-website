---
layout: default
title: Query insights
nav_order: 40
has_children: true
has_toc: false
---

# Query insights

Query insights helps you monitor and analyze the search queries within your OpenSearch cluster. With minimal performance impact, query insights features aim to provide comprehensive insights into search query execution, enabling you to better understand search query characteristics, patterns, and system behavior during query execution stages. Query insights facilitate enhanced detection, diagnosis, and prevention of query performance issues, ultimately improving query processing performance, user experience, and overall system resilience.

Typical use cases of query insights include the following:

- Identifying top queries by latency within specific time frames.
- Debugging slow search queries and latency spikes.

Query insights features are backed up by the Query Insights plugin. At a high level, query insights comprises the following components:

* _Collectors_: Gather performance-related data points at various stages of search query execution within OpenSearch.
* _Processors_: Perform lightweight aggregation and processing on data collected by the collectors.
* _Exporters_: Export the insights data into different sinks.

![Query Insights Framework]({{site.url}}{{site.baseurl}}/images/query-insights/query-insights-framework.png)

## Installing the OpenSearch Query Insights plugin

You need to install the `query-insights` plugin to enable query insights. For information about installing plugins, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Query insights settings

Query insights supports the following settings:

- [Top n queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/)
