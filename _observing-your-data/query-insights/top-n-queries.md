---
layout: default
title: Top N queries
parent: Query insights
nav_order: 65
---

# Top N queries

Monitoring the top N queries in query insights features can help you gain real-time insights into the top queries with high latency within a certain time frame (for example, the last hour). 

## Getting started

To enable monitoring of the top N queries, configure the following [dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings):

- `search.insights.top_queries.latency.enabled`: Set to `true` to [enable monitoring of the top N queries by latency](#enabling-the-top-n-queries-feature).
- `search.insights.top_queries.latency.window_size`: [Configure the window size for top n queries by latency](#configuring-window-size). 
- `search.insights.top_queries.latency.top_n_size`: [Specify the value of n for top n queries by latency](#configuring-the-value-of-n).
- `search.insights.top_queries.cpu.enabled`: Set to `true` to [enable monitoring of the top N queries by cpu usage](#enabling-the-top-n-queries-feature).
- `search.insights.top_queries.cpu.window_size`: [Configure the window size for top n queries by cpu usage](#configuring-window-size). 
- `search.insights.top_queries.cpu.top_n_size`: [Specify the value of n for top n queries by cpu usage](#configuring-the-value-of-n).
- `search.insights.top_queries.memory.enabled`: Set to `true` to [enable monitoring of the top N queries for top n queries by memory usage](#enabling-the-top-n-queries-feature).
- `search.insights.top_queries.memory.window_size`: [Configure the window size for top n queries by memory usage](#configuring-window-size). 
- `search.insights.top_queries.memory.top_n_size`: [Specify the value of n for top n queries by memory usage](#configuring-the-value-of-n).

It's important to exercise caution when enabling this feature because it can consume system resources.
{: .important}


For detailed information about enabling and configuring this feature, see the following sections.

## Enabling the top N queries feature 

After installing the `query-insights` plugin, you can enable the top N queries feature (which is disabled by default) by using the following dynamic setting. This setting enables the corresponding collectors and aggregators in the running cluster. For example, the following command enables top n queries by latency.

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.enabled" : true
  }
}
```
{% include copy-curl.html %}

Other available metrics are CPU usage and memory usage. You can enable them with
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.cpu.enabled" : true
  }
}

PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.memory.enabled" : true
  }
}
```
{% include copy-curl.html %}

## Configuring window size

You can configure the window size for the top N queries by latency with `search.insights.top_queries.latency.window_size`. For example, a cluster with the following configuration will collect top N queries by latency in a 60-minute window:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.window_size" : "60m"
  }
}
```
{% include copy-curl.html %}

Other available metrics are CPU usage and memory usage. You can configure the window size to 60 minutes for these metrics by:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.cpu.window_size" : "60m"
  }
}

PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.memory.window_size" : "60m"
  }
}
```
{% include copy-curl.html %}

## Configuring the value of N 

You can configure the value of N in the `search.insights.top_queries.latency.top_n_size` parameter. For example, a cluster with the following configuration will collect the top 10 queries in the specified window size:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.top_n_size" : 10
  }
}
```
{% include copy-curl.html %}


Other available metrics are CPU usage and memory usage. You can configure the top n size to 10 for these metrics by:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.cpu.top_n_size" : 10
  }
}

PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.memory.top_n_size" : 10
  }
}
```
{% include copy-curl.html %}

## Monitoring the top N queries 

You can use the Insights API endpoint to obtain top N queries by latency:

```json
GET /_insights/top_queries
```
{% include copy-curl.html %}

Specify a metric type to filter the response by metric type:

```json
GET /_insights/top_queries?type=latency
GET /_insights/top_queries?type=cpu
GET /_insights/top_queries?type=memory
```
{% include copy-curl.html %}

## Export the top N queries data
You can configure your desired exporter to export the top N queries data to different sinks. Currently, supported exporters are the debug exporter and the local index exporter.

### Configuring the debug exporter
To export the top queries by latency using the debug exporter, use the following configuration:
```json
PUT _cluster/settings
{
  "persistent" : {
     "search.insights.top_queries.latency.exporter.type" : "debug"
  }
}
```
{% include copy-curl.html %}

To configure the debug exporter for other metrics such as `CPU`, use:
```json
PUT _cluster/settings
{
  "persistent" : {
     "search.insights.top_queries.cpu.exporter.type" : "debug"
  }
}
```
{% include copy-curl.html %}

### Configuring the local index exporter
The local index exporter allows you to export the top N queries to local OpenSearch indexes. To configure the local index exporter for latency, use:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.exporter.type" : "local_index",
    "search.insights.top_queries.latency.exporter.config.index" : "YYYY.MM.dd"
  }
}
```
{% include copy-curl.html %}

For reference on the date pattern format, see the [DateTimeFormat documentation](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html).

To configure the local index exporter for other metrics such as `CPU`, use:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.cpu.exporter.type" : "local_index",
    "search.insights.top_queries.cpu.exporter.config.index" : "YYYY.MM.dd"
  }
}
```
{% include copy-curl.html %}

By configuring these settings, you can direct the query insights data to the appropriate sink, allowing for better monitoring and analysis of your OpenSearch queries.