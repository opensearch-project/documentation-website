---
layout: default
title: Query Insights Settings API
parent: Query insights
nav_order: 15
---

# Query Insights Settings API
**Introduced 2.19**
{: .label .label-purple }

The Query Insights Settings API allows you to manage Query Insights configuration through dedicated endpoints. Use this API to configure top N query monitoring, grouping, and exporter settings with granular, setting-level access control.

This API is functionally equivalent to using the [cluster settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) for Query Insights configuration. However, in production environments where you need to grant access to performance engineers or monitoring teams without exposing all cluster settings, this API provides dedicated permissions (`cluster:admin/opensearch/insights/settings/*`) that restrict access to only Query Insights settings.
{: .note}

## Endpoints

The Query Insights Settings API provides the following endpoints:

- `GET /_insights/settings` - Retrieve all Query Insights settings
- `GET /_insights/settings/{metric_type}` - Retrieve settings for a specific metric type (latency, cpu, or memory)
- `PUT /_insights/settings` - Update Query Insights settings

## Retrieving settings

To retrieve all Query Insights settings, use the following request:

```json
GET /_insights/settings
```
{% include copy-curl.html %}

### Example response

```json
{
  "persistent": {
    "latency": {
      "enabled": true,
      "top_n_size": 10,
      "window_size": "5m"
    },
    "cpu": {
      "enabled": true,
      "top_n_size": 10,
      "window_size": "5m"
    },
    "memory": {
      "enabled": true,
      "top_n_size": 10,
      "window_size": "5m"
    },
    "grouping": {
      "group_by": "none"
    },
    "exporter": {
      "type": "local_index",
      "delete_after_days": 7
    }
  }
}
```

### Retrieving settings for a specific metric

To retrieve settings for a specific metric type (latency, cpu, or memory), include the metric type in the path:

```json
GET /_insights/settings/latency
```
{% include copy-curl.html %}

#### Example response

```json
{
  "persistent": {
    "latency": {
      "enabled": true,
      "top_n_size": 10,
      "window_size": "5m"
    }
  }
}
```

## Updating settings

To update Query Insights settings, send a PUT request with the settings you want to modify. You can update settings for one or more metrics in a single request.

### Updating latency settings

```json
PUT /_insights/settings
{
  "latency": {
    "enabled": true,
    "top_n_size": 20,
    "window_size": "10m"
  }
}
```
{% include copy-curl.html %}

### Updating multiple metric settings

```json
PUT /_insights/settings
{
  "latency": {
    "enabled": true,
    "top_n_size": 15
  },
  "cpu": {
    "enabled": true,
    "top_n_size": 10,
    "window_size": "10m"
  },
  "memory": {
    "enabled": false
  }
}
```
{% include copy-curl.html %}

### Updating grouping settings

```json
PUT /_insights/settings
{
  "grouping": {
    "group_by": "similarity"
  }
}
```
{% include copy-curl.html %}

### Updating exporter settings

```json
PUT /_insights/settings
{
  "exporter": {
    "type": "local_index",
    "delete_after_days": 7
  }
}
```
{% include copy-curl.html %}

### Example response

All update requests return an acknowledgment response:

```json
{
  "acknowledged": true
}
```

## Available settings

The Settings API supports all Query Insights configuration options. The following table lists the available settings and their corresponding cluster setting paths.

### Metric settings (latency, cpu, memory)

Each metric type (latency, cpu, memory) supports the following settings:

Setting | Cluster setting path | Description | Default
:--- |:--- | :--- | :---
`enabled` | `search.insights.top_queries.<metric>.enabled` | Enable or disable top N query monitoring for the metric. | `true` for latency, `false` for cpu and memory
`top_n_size` | `search.insights.top_queries.<metric>.top_n_size` | The number of top queries to track. Valid values are 1–100. | `10`
`window_size` | `search.insights.top_queries.<metric>.window_size` | The time window for collecting top queries. Valid values: `1m`, `5m`, `10m`, `30m`, `1h`. | `5m`

For more information about metric settings, see [Top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-top-n-query-monitoring).

### Grouping settings

Setting | Cluster setting path | Description | Default
:--- |:--- | :--- | :---
`group_by` | `search.insights.top_queries.grouping.group_by` | The method for grouping similar queries. Valid values are `similarity` and `none`. | `none`

For more information about query grouping, see [Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/).

### Exporter settings

Setting | Cluster setting path | Description | Default
:--- |:--- | :--- | :---
`type` | `search.insights.top_queries.exporter.type` | The exporter type for top N query data. Valid values are `local_index` and `debug`. | `local_index`
`delete_after_days` | `search.insights.top_queries.exporter.delete_after_days` | The number of days to retain local index data (1–180). Applies only when `type` is `local_index`. | `7`

For more information about exporters, see [Exporting top N query data]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#exporting-top-n-query-data).


## Permissions and security

To use the Query Insights Settings API, users need the following permissions:

- `cluster:admin/opensearch/insights/settings/get` - For GET requests
- `cluster:admin/opensearch/insights/settings/update` - For PUT requests

These permissions can be configured through your security plugin or access control system. For production deployments, consider creating a dedicated role with access only to these endpoints rather than granting full cluster settings permissions.

## Related topics

- [Top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/)
- [Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/)
- [Query Insights dashboard]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-insights-dashboard/)
- [Cluster settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/)
