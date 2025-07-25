---
layout: default
title: Query insights
nav_order: 40
has_children: true
has_toc: false
canonical_url: https://docs.opensearch.org/latest/observing-your-data/query-insights/index/
---

# Query insights
**Introduced 2.12**
{: .label .label-purple }

To monitor and analyze the search queries within your OpenSearch cluster, you can obtain query insights. With minimal performance impact, query insights features aim to provide comprehensive insights into search query execution, enabling you to better understand search query characteristics, patterns, and system behavior during query execution stages. Query insights facilitate enhanced detection, diagnosis, and prevention of query performance issues, ultimately improving query processing performance, user experience, and overall system resilience.

Typical use cases for query insights features include the following:

- Identifying top queries by latency within specific time frames
- Debugging slow search queries and latency spikes

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

## Query Insights settings

You can obtain the following information using Query Insights:

- [Top n queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/)
- [Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/)
- [Query metrics]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-metrics/)
