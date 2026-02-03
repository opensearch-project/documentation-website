---
layout: default
title: Query Insights Settings API
parent: Query insights
nav_order: 25
---

# Query Insights Settings API
**Introduced 3.5**
{: .label .label-purple }

The Query Insights Settings API allows you to manage query insight configuration through dedicated endpoints. Use this API to configure top N query monitoring, grouping, and exporter settings with granular, setting-level access control.

This API is functionally equivalent to the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) for query insights configuration. For production environments, you can use the dedicated permission `cluster:admin/opensearch/insights/settings/*` to grant performance engineers or monitoring teams access only to query insights settings, without exposing all cluster settings.
{: .note}

The API provides the following endpoints: 

- [Retrieve settings](#retrieve-query-insights-settings)
- [Update settings](#update-query-insights-settings)

## Retrieve query insights settings

Retrieves all query insights settings including latency, CPU, memory, grouping, and exporter configurations.

### Endpoints

```json
GET /_insights/settings
GET /_insights/settings/{metric_type}
```

### Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `metric_type` | String | The specific metric type to retrieve settings for. Valid values are `latency`, `cpu`, and `memory`. If omitted, settings for all metrics are returned. |

### Example request

```json
GET /_insights/settings/
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

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `persistent` | Object | Contains the persistent cluster settings for query insights. |
| `persistent.latency` | Object | Latency metric configuration settings. |
| `persistent.latency.enabled` | Boolean | Whether top N query monitoring for latency is enabled. |
| `persistent.latency.top_n_size` | Integer | The number of top queries being tracked for latency. |
| `persistent.latency.window_size` | String | The time window for collecting top latency queries. |
| `persistent.cpu` | Object | CPU metric configuration settings. |
| `persistent.cpu.enabled` | Boolean | Whether top N query monitoring for CPU is enabled. |
| `persistent.cpu.top_n_size` | Integer | The number of top queries being tracked for CPU. |
| `persistent.cpu.window_size` | String | The time window for collecting top CPU queries. |
| `persistent.memory` | Object | Memory metric configuration settings. |
| `persistent.memory.enabled` | Boolean | Whether top N query monitoring for memory is enabled. |
| `persistent.memory.top_n_size` | Integer | The number of top queries being tracked for memory. |
| `persistent.memory.window_size` | String | The time window for collecting top memory queries. |
| `persistent.grouping` | Object | Query grouping configuration settings. |
| `persistent.grouping.group_by` | String | The method for grouping similar queries. |
| `persistent.exporter` | Object | Exporter configuration settings. |
| `persistent.exporter.type` | String | The exporter type for top N query data. |
| `persistent.exporter.delete_after_days` | Integer | The number of days to retain local index data when using `local_index` exporter. |

## Update query insights settings

Updates query insights settings. You can update settings for one or more metrics in a single request.

### Endpoint

```json
PUT /_insights/settings
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `latency` | Object | Latency metric configuration. Optional. |
| `latency.enabled` | Boolean | Enable or disable top N query monitoring for latency. Optional. Default is `true`. |
| `latency.top_n_size` | Integer | The number of top queries to track for latency. Valid values are 1–100. Optional. Default is `10`. |
| `latency.window_size` | String | The time window for collecting top latency queries. Valid values: `1m`, `5m`, `10m`, `30m`, `1h`. Optional. Default is `5m`. |
| `cpu` | Object | CPU metric configuration. Optional. |
| `cpu.enabled` | Boolean | Enable or disable top N query monitoring for CPU. Optional. Default is `false`. |
| `cpu.top_n_size` | Integer | The number of top queries to track for CPU. Valid values are 1–100. Optional. Default is `10`. |
| `cpu.window_size` | String | The time window for collecting top CPU queries. Valid values: `1m`, `5m`, `10m`, `30m`, `1h`. Optional. Default is `5m`. |
| `memory` | Object | Memory metric configuration. Optional. |
| `memory.enabled` | Boolean | Enable or disable top N query monitoring for memory. Optional. Default is `false`. |
| `memory.top_n_size` | Integer | The number of top queries to track for memory. Valid values are 1–100. Optional. Default is `10`. |
| `memory.window_size` | String | The time window for collecting top memory queries. Valid values: `1m`, `5m`, `10m`, `30m`, `1h`. Optional. Default is `5m`. |
| `grouping` | Object | Query grouping configuration. Optional. |
| `grouping.group_by` | String | The method for grouping similar queries. Valid values are `similarity` and `none`. Optional. Default is `none`. |
| `exporter` | Object | Exporter configuration. Optional. |
| `exporter.type` | String | The exporter type for top N query data. Valid values are `local_index` and `debug`. Optional. Default is `local_index`. |
| `exporter.delete_after_days` | Integer | The number of days to retain local index data (1–180). Applies only when `type` is `local_index`. Optional. Default is `7`. |

For more information about metric settings, see [Top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-top-n-query-monitoring).

For more information about query grouping, see [Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/).

For more information about exporters, see [Exporting top N query data]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#exporting-top-n-query-data).

### Example request: Updating latency settings

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

### Example request: Updating multiple metric settings

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

### Example request: Updating grouping settings

```json
PUT /_insights/settings
{
  "grouping": {
    "group_by": "similarity"
  }
}
```
{% include copy-curl.html %}

### Example request: Updating exporter settings

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

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions:

- `cluster:admin/opensearch/insights/settings/get` for GET requests
- `cluster:admin/opensearch/insights/settings/update` for PUT requests
- `cluster:admin/opensearch/insights/settings/*` for all query insights settings API operations

You can configure these permissions in your Security plugin or access control system.

For production deployments, consider creating a dedicated role with access only to these endpoints rather than granting full cluster settings permissions.

## Related documentation

- [Top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/)
- [Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/)
- [Query Insights dashboard]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-insights-dashboard/)
- [Cluster settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/)
