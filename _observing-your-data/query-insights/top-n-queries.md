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
- `search.insights.top_queries.latency.window_size`: [Configure the window size the top N queries by latency](#configuring-window-size). 
- `search.insights.top_queries.latency.top_n_size`: [Specify the value of N for the top N queries by latency](#configuring-the-value-of-n).
- `search.insights.top_queries.cpu.enabled`: Set to `true` to [enable monitoring of the top N queries by CPU usage](#enabling-the-top-n-queries-feature).
- `search.insights.top_queries.cpu.window_size`: [Configure the window size for the top N queries by CPU usage](#configuring-window-size). 
- `search.insights.top_queries.cpu.top_n_size`: [Specify the value of N for the top N queries by CPU usage](#configuring-the-value-of-n).
- `search.insights.top_queries.memory.enabled`: Set to `true` to [enable monitoring of the top N queries by memory usage](#enabling-the-top-n-queries-feature).
- `search.insights.top_queries.memory.window_size`: [Configure the window size for the top N queries by memory usage](#configuring-window-size). 
- `search.insights.top_queries.memory.top_n_size`: [Specify the value of N for the top N queries by memory usage](#configuring-the-value-of-n).

It's important to exercise caution when enabling this feature because it can consume system resources.
{: .important}


For detailed information about enabling and configuring this feature, see the following sections.

## Enabling top N query monitoring 

When you install the `query-insights` plugin, top N query monitoring is disabled by default. To enable top N query monitoring, update the dynamic settings for the desired monitoring types. These settings enable the corresponding collectors and aggregators in the running cluster. For example, to enable monitoring top N queries by latency, update the `search.insights.top_queries.latency.enabled` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.enabled" : true
  }
}
```
{% include copy-curl.html %}

## Configuring the window size

To configure the monitoring window size, update the `window_size` setting for the desired monitoring type. For example, to collect the top N queries by latency in a 60-minute window, update the `search.insights.top_queries.latency.window_size` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.window_size" : "60m"
  }
}
```
{% include copy-curl.html %}

## Configuring the value of N 

To configure the value of N, update the `top_n_size` setting for the desired monitoring type. For example, to collect the top 10 queries by latency, update the `insights.top_queries.latency.top_n_size` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.top_n_size" : 10
  }
}
```
{% include copy-curl.html %}

## Monitoring the top N queries 

You can use the Insights API endpoint to obtain top N queries for all monitoring types:

```json
GET /_insights/top_queries
```
{% include copy-curl.html %}

Specify a monitoring type to filter the response by metric type:

```json
GET /_insights/top_queries?type=latency
GET /_insights/top_queries?type=cpu
GET /_insights/top_queries?type=memory
```
{% include copy-curl.html %}

## Export top N query data

You can configure your desired exporter to export top N query data to different sinks, allowing for better monitoring and analysis of your OpenSearch queries. Currently, the supported exporters are:
- [Debug exporter](#configuring-a-debug-exporter)
- [Local index exporter](#configuring-a-local-index-exporter)

### Configuring a debug exporter

To configure a debug exporter, update the exporter setting for the desired monitoring type. For example, to export the top N queries by latency using the debug exporter, send the following request:

```json
PUT _cluster/settings
{
  "persistent" : {
     "search.insights.top_queries.latency.exporter.type" : "debug"
  }
}
```
{% include copy-curl.html %}

To configure a debug exporter for other monitoring types, use the `search.insights.top_queries.cpu.exporter.type`  or `search.insights.top_queries.memory.exporter.type` settings.

### Configuring a local index exporter

A local index exporter allows you to export the top N queries to local OpenSearch indexes. To configure the local index exporter for the top N queiries by latency, send the following request:

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

The default index pattern for top N queries is `top_queries-YYYY.MM.dd`. This means that all top queries for the same day will be saved to the same index, and a new index will be created for the following day. For more information on date formats, refer to the [DateTimeFormat](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html).

To configure a local index exporter for other monitoring types, use the `search.insights.top_queries.cpu.exporter.type`  or `search.insights.top_queries.memory.exporter.type` settings.

