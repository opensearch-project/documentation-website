---
layout: default
title: Query insights
nav_order: 40
has_children: true
has_toc: false
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

## Monitoring the Query Insights plugin health

You can monitor the Query Insights plugin health using the [Health Stats API]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/api/).

### OpenTelemetry error metrics counters

Query Insights integrates with OpenTelemetry to provide real-time error metrics. These counters help identify specific operational failures in Query Insights and improve reliability. Each metric provides targeted insights into potential error sources within the Query Insights workflow, allowing for more focused debugging and maintenance. For more information, see [Query metrics]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-metrics/).

The following table lists all available metrics.

Field | Description
:--- | :---
`LOCAL_INDEX_READER_PARSING_EXCEPTIONS` | The number of errors when parsing data using LocalIndexReader.
`LOCAL_INDEX_EXPORTER_BULK_FAILURES` | The number of failures when ingesting Query Insights data to local indexes.
`LOCAL_INDEX_EXPORTER_EXCEPTIONS` | The number of exceptions in Query Insights LocalIndexExporter.
`INVALID_EXPORTER_TYPE_FAILURES` | The number of invalid exporter type failures.
`INVALID_INDEX_PATTERN_EXCEPTIONS` | The number of invalid index pattern exceptions.
`DATA_INGEST_EXCEPTIONS` | The number of exceptions during data ingest in Query Insights.
`QUERY_CATEGORIZE_EXCEPTIONS` | The number of exceptions when categorizing the queries.
`EXPORTER_FAIL_TO_CLOSE_EXCEPTION` | The number of failures when closing the exporter.