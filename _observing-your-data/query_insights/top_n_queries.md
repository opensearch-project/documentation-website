---
layout: default
title: Top n queries
parent: Query Insights
nav_order: 65
---

# Top N Queries
The Top N Queries feature in Query Insights can help you gain real-time insights into the top queries with high latency in a certain window (e.g. last one hour). 



## Get started
To begin using the top n queries feature, you need to first enable it using the `search.top_n_queries.latency.enabled` setting and subsequently configure the window size and top n size, using the dynamic setting `search.top_n_queries.latency.window_size` and `search.top_n_queries.latency.top_n_size`. It's important to exercise caution when enabling this feature because it can consume system resources.

OpenSearch is often chosen as the sink for storing the top n queries data. You can enable the exporter by using the following setting `search.top_n_queries.latency.exporter.enabled`, and configure the export interval with `search.top_n_queries.latency.exporter.interval`.

Detailed information on enabling and configuring top n queries, including advanced exporter configure, is described in the following sections.


## Install the OpenSearch Query Insights plugin
The OpenSearch Query Insights plugin `query-insights` need to be installed to enable top n queries feature. 


### Enabling the top n queries feature

After installing the `query-insights` plugin, you can enable the top n queries feature (which is disabled by default) by using the following dynamic setting that enables the corresponding query insights collectors and aggregators in the running cluster:

```bash
search.top_n_queries.latency.enabled=true
```

### Configure window size
You can configure the window size for the top N queries by latency with `search.top_n_queries.latency.window_size`. For example, a cluster with the below configuration will collect top N queries in a 60 minutes window.
```
search.top_n_queries.latency.window_size=60m
```

### Configure top N size
You can configure the Top N size with `search.top_n_queries.latency.top_n_size`. For example, a cluster with the below configuration will collect the top 10 queries in the specified window size.
```
search.top_n_queries.latency.top_n_size=10
```

### Get top n queries results
You can use the below API endpoint to get top n queries results by latency
```
GET /_insights/top_queries
```
You can filter by type in the API endpoint (latency is the only supported type as of 2.12)
```
GET /_insights/top_queries?type=latency
```

### Configure exporters
Currently, the top queries results are generated and kept in memory, and can be optionally sent to an exporter based on configured settings. You can configure exporters to export top N queries data to different sinks (for example, a local index).

#### Local index exporter
The local index exporter can be used to export top n queries results to a local OpenSearch index. Enable the local index exporter with
```
search.top_n_queries.latency.exporter.type=local_index
search.top_n_queries.latency.exporter.enabled=true
```
You can specify the export interval with the setting `search.top_n_queries.latency.exporter.interval`, for example
```
search.top_n_queries.latency.exporter.interval="60m"
```
Additionally, You can specify the local index name to export the top n queries results to. The default index name is `top_queries_{timestamp}`.
```
search.top_n_queries.latency.exporter.identifier="my_customized_index_name"
```