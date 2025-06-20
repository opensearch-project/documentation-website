---
layout: default
title: Neural Search API
parent: Vector search API
nav_order: 20
has_children: false
---

# Neural Search API

The Neural Search plugin provides several APIs for monitoring semantic and hybrid search features.

## Stats

The Neural Search Stats API provides information about the current status of the Neural Search plugin. This includes both cluster-level and node-level statistics. Cluster-level statistics have a single value for the entire cluster. Node-level statistics have a single value for each node in the cluster. 

By default, the Neural Search Stats API is disabled through a cluster setting. To enable statistics collection, use the following command:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.neural_search.stats_enabled": "true"
  }
}
```
{% include copy-curl.html %}

To disable statistics collection, set the cluster setting to `false`. When disabled, all values are reset and new statistics are not collected. 

### Endpoints

```json
GET /_plugins/_neural/stats
GET /_plugins/_neural/stats/<stats>
GET /_plugins/_neural/<nodes>/stats
GET /_plugins/_neural/<nodes>/stats/<stats>
```

### Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `nodes` | String | A node or a list of nodes (comma-separated) to filter statistics by. Default is all nodes. |
| `stats` | String | A statistic name or names (comma-separated) to return. Default is all statistics. |

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `include_metadata` | Boolean | When `true`, includes additional metadata fields for each statistic (see [Available metadata](#available-metadata)). Default is `false`. |
| `flat_stat_paths` | Boolean | When `true`, flattens the JSON response structure for easier parsing. Default is `false`. | 

#### Example request

```json
GET /_plugins/_neural/node1,node2/stats/stat1,stat2?include_metadata=true,flat_stat_paths=true
```
{% include copy-curl.html %}

#### Example response

If `include_metadata` is `false`, the response appears as follows:

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "integTest",
  "info": {
    "cluster_version": "3.0.0",
    "processors": {
      "ingest": {
        "text_embedding_processors_in_pipelines": 0
      }
    }
  },
  "all_nodes": {
    "processors": {
      "ingest": {
        "text_embedding_executions": 0
      }
    }
  },
  "nodes": {
    "896MIkjCSnWBHy-SxB62zQ": {
      "processors": {
        "ingest": {
          "text_embedding_executions": 0
        }
      }
    }
  }
}
```

If `include_metadata` is `true`, the response appears as follows:

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "integTest",
  "info": {
    "cluster_version": {
      "value": "3.0.0",
      "stat_type": "info_string"
    },
    "processors": {
      "ingest": {
        "text_embedding_processors_in_pipelines": {
          "value": 0,
          "stat_type": "info_counter"
        }
      }
    }
  },
  "all_nodes": {
    "processors": {
      "ingest": {
        "text_embedding_executions": {
          "value": 0,
          "stat_type": "timestamped_event_counter",
          "trailing_interval_value": 0,
          "minutes_since_last_event": 29061801
        }
      }
    }
  },
  "nodes": {
    "896MIkjCSnWBHy-SxB62zQ": {
      "processors": {
        "ingest": {
          "text_embedding_executions": {
            "value": 0,
            "stat_type": "timestamped_event_counter",
            "trailing_interval_value": 0,
            "minutes_since_last_event": 29061801
          }
        }
      }
    }
  }
}
```

### Response body fields

The following sections describe response body fields.

#### Categories of statistics

The following table lists all categories of statistics.

| Category | Data type | Description |
| :--- | :--- | :--- |
| `info` | Object | Contains cluster-wide information and statistics that are not specific to individual nodes. |
| `all_nodes` | Object | Provides aggregated statistics across all nodes in the cluster. |
| `nodes` | Object | Contains node-specific statistics, with each node identified by its unique node ID. |

#### Available statistics

The following table lists the available statistics. For statistics with paths prefixed with `nodes.<node_id>`, aggregate cluster-level statistics are also available at the same path prefixed with `all_nodes`.

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `cluster_version` | `info` | `cluster_version` | The version of the cluster. |
| `text_embedding_processors_in_pipelines` | `info` |  `processors.ingest.text_embedding_processors_in_pipelines` | The number of text embedding processors configured in ingest pipelines. |
| `text_embedding_executions` | `nodes`, `all_nodes` | `processors.ingest.text_embedding_executions` | The number of text embedding processor executions per node. |

#### Available metadata

When `include_metadata` is `true`, the field values in the response are replaced by their respective metadata objects, which include additional information about the statistic types, as described in the following table. 

| Statistic type | Description |
| :--- | :--- |
| `info_string` | A basic string value that provides informational content, such as versions or names. See [`info_string`](#info-string).|
| `info_counter` | A numerical counter that represents static or slowly changing values. See [`info_counter`](#info-counter).|
| `timestamped_event_counter` | A counter that tracks events over time, including information about recent activity. See [`timestamped_event_counter`](#timestamped-event-counter).|

<p id="info-string"></p>

The `info_string` object contains the following metadata fields.

| Metadata field | Data type | Description |
| :--- | :--- | :--- |
| `value` | String | The actual string value of the statistic. |
| `stat_type` | String | Always set to `info_string`. |

<p id="info-counter"></p>

The `info_counter` object contains the following metadata fields.

| Metadata field | Data type | Description |
| :--- | :--- | :--- |
| `value` | Integer | The current count value. |
| `stat_type` | String | Always set to `info_counter`. |

<p id="timestamped-event-counter"></p>

The `timestamped_event_counter` object contains the following metadata fields.

| Metadata field | Data type | Description |
| :--- | :--- | :--- |
| `value` | Integer | The total number of events that occurred since the node started. |
| `stat_type` | String | Always set to `timestamped_event_counter`. |
| `trailing_interval_value` | Integer | The number of events that occurred in the past 5 minutes. |
| `minutes_since_last_event` | Integer | The amount of time (in minutes) since the last recorded event. |
