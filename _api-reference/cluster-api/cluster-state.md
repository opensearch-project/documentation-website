---
layout: default
title: Cluster state
nav_order: 70
parent: Cluster APIs
has_children: false
---

# Cluster state API

Returns the cluster state for diagnostics and debugging.

## Example

```bash
GET /_cluster/state
```
{% include copy.html %}

## Path parameters

All path parameters are optional.

| Parameter | Description | 
| :--- | :--- |
| _all | Outputs all metrics. |
| blocks | Outputs the `blocks` section of the response. |
| cluster_manager | Outputs the `cluster_manager` section of the response. |
| metadata | Outputs the `metadata` section of the response. |
| nodes | Outputs the `nodes` section of the response. |
| routing_nodes | Outputs the `routing_nodes` section of the response. |
| routing_table | Outputs the `routing_table` section of the response. |
| version | Outputs the cluster state version. |

You can also append a comma-separated list of aliases, data streams, and indices to further filter the request. Wildcards are supported.

### Example

```bash
GET /_cluster/state/metadata/shakespeare
```
{% include copy.html %}

### Response

```json
{
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "YxQAFco6TBeer06h1LSRfA",
  "metadata" : {
    "cluster_uuid" : "YxQAFco6TBeer06h1LSRfA",
    "cluster_uuid_committed" : false,
    "cluster_coordination" : {
      "term" : 9,
      "last_committed_config" : [
        "PJsSB3otT029WtJwVpzXtg"
      ],
      "last_accepted_config" : [
        "PJsSB3otT029WtJwVpzXtg"
      ],
      "voting_config_exclusions" : [ ]
    },
    "templates" : { },
    "indices" : {
      "shakespeare" : {
        "version" : 20,
        "mapping_version" : 2,
        "settings_version" : 1,
        "aliases_version" : 1,
        "routing_num_shards" : 1024,
        "state" : "open",
        "settings" : {
          "index" : {
            "creation_date" : "1672944108913",
            "number_of_shards" : "1",
            "number_of_replicas" : "1",
            "uuid" : "kTiQsojHTPWmO_jTPG1Y-g",
            "version" : {
              "created" : "136257927"
            },
            "provided_name" : "shakespeare"
          }
        },
        "mappings" : {
          "_doc" : {
            "properties" : {
              "play_name" : {
                "type" : "keyword"
              },
              "speech_number" : {
                "type" : "integer"
              },
              "line_number" : {
                "type" : "text",
                "fields" : {
                  "keyword" : {
                    "ignore_above" : 256,
                    "type" : "keyword"
                  }
                }
              },
              "text_entry" : {
                "type" : "text",
                "fields" : {
                  "keyword" : {
                    "ignore_above" : 256,
                    "type" : "keyword"
                  }
                }
              },
              "speaker" : {
                "type" : "keyword"
              },
              "type" : {
                "type" : "text",
                "fields" : {
                  "keyword" : {
                    "ignore_above" : 256,
                    "type" : "keyword"
                  }
                }
              },
              "line_id" : {
                "type" : "integer"
              }
            }
          }
        },
        "aliases" : [ ],
        "primary_terms" : {
          "0" : 9
        },
        "in_sync_allocations" : {
          "0" : [
            "2-fsh-kCQoudKmvkIJuaRw"
          ]
        },
        "rollover_info" : { },
        "system" : false
      }
    },
    "index-graveyard" : {
      "tombstones" : [ ]
    }
  }
}
```

## Query parameters

All query parameters are optional.

| Parameter | Data type | Description | 
| :--- | :--- | :--- |
| allow_no_indices | Boolean | When set to `true` the wildcard expression that resolves into no specific indices will be ignored. Defaults to `true`. |
| expand_wildcards | String | Expands wildcard expressions into concrete indices that are either `open`, `closed` or both. Supported values are `open`, `closed`, `none`, and `all`. |
| flat_settings | Boolean | When set to `true` settings are returned in a flat format. Defaults to `false`. |
| ignore_unavailable | Boolean | When set to `true` any unavailable indices are ignored. This includes `missing` or `closed` indices. |
| local | Boolean | When set to `true` the request response includes information from only the local node and not the cluster manager. Defaults to `false`. |
| cluster_manager_timeout | Time unit | Amount of time to wait for a connection to the cluster manager. The request will fail and return an error if a response is not received before the `cluster_manager_timeout` expires. Defaults to `30s`. |
| wait_for_metadata_version | Integer | Waits for the metadata version to be equal to or greater than the version specified. |
| wait_for_timeout | Time unit | The maximum amount of time to wait for `wait_for_metadata_version` before timing out. |

### Example

```bash
GET /_cluster/state/nodes
```
{% include copy.html %}

### Response

```json
{
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "YxQAFco6TBeer06h1LSRfA",
  "nodes" : {
    "PJsSB3otT029WtJwVpzXtg" : {
      "name" : "opensearch-node1",
      "ephemeral_id" : "Fucj8-lYQj-X8xKjsorP6g",
      "transport_address" : "172.18.0.3:9300",
      "attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      }
    }
  }
}
```
