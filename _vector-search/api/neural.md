---
layout: default
title: Neural search API
parent: Vector search API
nav_order: 20
has_children: false
---

# Neural Stats API
In addition to new query and processor types, the neural-search plugin provides several APIs for monitoring semantic and hybrid search related features.

## Stats

The Neural stats  API provides information about the current status of the neural search plugin. This includes both cluster-level and node-level statistics. Cluster-level statistics have a single value for the entire cluster. Node-level statistics have a single value for each node in the cluster. 

By default, the stats API for neural search is disabled via cluster setting. When disabled, all stat values are reset and new stats are not collected. It can be enabled with the following command:

```json
PUT /_cluster/settings
{
    "persistent": {
	    "plugins.neural_search.stats_enabled": "true"
    }
}
```

### Endpoints
```json
GET /_plugins/_neural/stats
GET /_plugins/_neural/stats/<stats>
GET /_plugins/_neural/<nodes>/stats
GET /_plugins/_neural/<nodes>/stats/<stats>
```

### Path Parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `nodes` | String, comma-separated node IDs | Filter stats by specific nodes. Default is all nodes. |
| `stats` | String, comma-separated stat names | Filter specific statistics to return. Default is all stats. |

### Query Parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `include_metadata` | Boolean | When true, includes additional metadata fields for each stat (see below). Default is `false`. |
| `flat_stat_paths` | Boolean | When true, flattens the JSON response structure for easier parsing. Default is `false`. | 

#### Example Request
```json
GET /_plugins/_neural/node1,node2/stats/stat1,stat2?include_metadata=true,flat_stat_paths=true
```

### Response Body fields

#### Response Body Categories

| Category | Description |
| :--- | :--- |
| `info` | Contains cluster-wide information and statistics that are not specific to individual nodes. |
| `all_nodes` | Provides aggregated statistics across all nodes in the cluster. |
| `nodes` | Contains node-specific statistics, with each node identified by its unique node ID. |

#### Stat Names

The following table lists the available response body fields. For stats with paths prefixed with `nodes.<node_id>`, aggregate cluster-level stats are also availabe at the same path prefixed with `all_nodes`.

| Stat Name | Category | Stat Path within Category | Description |
| :--- | :--- | :--- | :--- |
| `cluster_version` | `info` | `cluster_version` | Version of the cluster. |
| `text_embedding_processors_in_pipelines` | `info` |  `processors.ingest.text_embedding_processors_in_pipelines` | Number of text embedding processors configured in ingest pipelines. |
| `text_embedding_executions` | `nodes` and `all_nodes` | `processors.ingest.text_embedding_executions` | Number of text embedding processor executions per node. |

#### Example Response

```json
GET /_plugins/_neural/stats
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

### Stat Types and Metadata

The following tables describe the available stat types and their associated metadata formats when `include_metadata=true`.

#### Stat Types and Metadata

If the `include_metadata` parameter is `true`, the field values in the response will be replaced by the respective stat metadata object, which includes additional information about the stat type. The stat types are as follows:

| Stat Type | Description |
| :--- | :--- |
| `info_string` | A basic string value that provides informational content, such as versions or names. |
| `info_counter` | A numerical counter that represents static or slowly changing values. |
| `timestamped_event_counter` | A counter that tracks events over time, including information about recent activity. |

##### Info String

| Metadata Field | Data Type | Description |
| :--- | :--- | :--- |
| `value` | String | The actual string value of the statistic. |
| `stat_type` | String | `info_string` |

##### Info Counter

| Metadata Field | Data Type | Description |
| :--- | :--- | :--- |
| `value` | Integer | The current count value. |
| `stat_type` | String | Always set to `info_counter` |

##### Timestamped Event Counter

| Metadata Field | Data Type | Description |
| :--- | :--- | :--- |
| `value` | Integer | The total count of events since the node started. |
| `stat_type` | String | `timestamped_event_counter` |
| `trailing_interval_value` | Integer | The number of events that occurred in past 5 minutes. |
| `minutes_since_last_event` | Integer | Number of minutes since the last recorded event. |

#### Example Response with Metadata
```json
GET /_plugins/_neural/stats?include_metadata=true
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