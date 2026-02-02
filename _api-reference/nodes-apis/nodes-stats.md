---
layout: default
title: Nodes stats
parent: Nodes APIs
nav_order: 20
---

# Nodes Stats API
**Introduced 1.0**
{: .label .label-purple }

The Nodes Stats API returns statistics about your cluster.

## Endpoints

```json
GET /_nodes/stats
GET /_nodes/<node_id>/stats
GET /_nodes/stats/<metric>
GET /_nodes/<node_id>/stats/<metric>
GET /_nodes/stats/<metric>/<index_metric>
GET /_nodes/<node_id>/stats/<metric>/<index_metric>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
nodeId | String | A comma-separated list of nodeIds used to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters). Defaults to `_all`.
metric | String | A comma-separated list of metric groups that are included in the response. For example, `jvm,fs`. See the following list of all index metrics. Defaults to all metrics.
index_metric | String | A comma-separated list of index metric groups that are included in the response. For example, `docs,store`. See the following list of all index metrics. Defaults to all index metrics.

The following table lists all available metric groups.

Metric | Description
:--- |:----
indices | Index statistics, such as size, document count, and search, index, and delete times for documents.
os | Statistics about the host OS, including load, memory, and swapping.
process | Statistics about processes, including their memory consumption, open file descriptors, and CPU usage.
jvm | Statistics about the JVM, including memory pool, buffer pool, and garbage collection, and the number of loaded classes.
thread_pool | Statistics about each thread pool for the node.
fs | File system statistics, such as read/write statistics, data path, and free disk space.
transport | Transport layer statistics about send/receive in cluster communication.
http | Statistics about the HTTP layer.
breaker | Statistics about the field data circuit breakers.
script | Statistics about scripts, such as compilations and cache evictions. 
discovery | Statistics about cluster states.
ingest | Statistics about ingest pipelines.
adaptive_selection | Statistics about adaptive replica selection, which selects an eligible node using shard allocation awareness.
script_cache | Statistics about script cache.
indexing_pressure | Statistics about the node's indexing pressure.
shard_indexing_pressure | Statistics about shard indexing pressure.
search_backpressure | Statistics related to search backpressure.
cluster_manager_throttling | Statistics related to throttled tasks on the cluster manager node.
weighted_routing | Statistics relevant to weighted round robin requests.
resource_usage_stats | Node-level resource usage statistics, such as CPU and JVM memory.
admission_control | Statistics about admission control.
caches | Statistics about caches. 

To filter the information returned for the `indices` metric, you can use specific `index_metric` values. You can use these only when you use the following query types:

```json
GET _nodes/stats/
GET _nodes/stats/_all
GET _nodes/stats/indices
```

The following index metrics are supported:

- docs
- store
- indexing
- get
- search
- merge
- refresh
- flush
- warmer
- query_cache
- fielddata
- completion
- segments
- translog
- request_cache

For example, the following query requests statistics for `docs` and `search`:

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/stats/indices/docs,search
-->
{% capture step1_rest %}
GET /_nodes/stats/indices/docs,search
{% endcapture %}

{% capture step1_python %}


response = client.nodes.stats(
  metric = "indices",
  index_metric = "docs,search"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can also use specific `index_metric` values in the `caches` metric to specify which caches will return statistics. 
The following index metrics are supported: 

- request_cache

For example, the following query requests statistics for the `request_cache`: 

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/stats/caches/request_cache
-->
{% capture step1_rest %}
GET /_nodes/stats/caches/request_cache
{% endcapture %}

{% capture step1_python %}


response = client.nodes.stats(
  metric = "caches",
  index_metric = "request_cache"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
completion_fields | String | The fields to include in completion statistics. Supports comma-separated lists and wildcard expressions. 
fielddata_fields | String | The fields to include in fielddata statistics. Supports comma-separated lists and wildcard expressions. 
fields | String | The fields to include. Supports comma-separated lists and wildcard expressions. 
groups | String | A comma-separated list of search groups to include in the search statistics. 
level | String | Specifies whether statistics for the `indices` metric are aggregated at the cluster, index, or shard level. Valid values are `indices`, `node`, and `shard`. When used for the `caches` metric, `indices`, `shard`, and `tier` are valid. The `tier` value is ignored if the [tiered spillover cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/tiered-cache/) is not in use. 
timeout | Time | Sets the time limit for node response. Default is `30s`.
include_segment_file_sizes | Boolean | If segment statistics are requested, this field specifies to return the aggregated disk usage of every Lucene index file. Default is `false`. 

## Example request

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/stats
-->
{% capture step1_rest %}
GET /_nodes/stats
{% endcapture %}

{% capture step1_python %}


response = client.nodes.info(
  node_id_or_metric = "stats"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

Select the arrow to view the example response.

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "docker-cluster",
  "nodes" : {
    "F-ByTQzVQ3GQeYzQJArJGQ" : {
      "timestamp" : 1664484195257,
      "name" : "opensearch",
      "transport_address" : "127.0.0.1:9300",
      "host" : "127.0.0.1",
      "ip" : "127.0.0.1:9300",
      "roles" : [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "indices" : {
        "docs" : {
          "count" : 13160,
          "deleted" : 12
        },
        "store" : {
          "size_in_bytes" : 6263461,
          "reserved_in_bytes" : 0
        },
        "indexing" : {
          "index_total" : 0,
          "index_time_in_millis" : 0,
          "index_current" : 0,
          "index_failed" : 0,
          "delete_total" : 204,
          "delete_time_in_millis" : 427,
          "delete_current" : 0,
          "noop_update_total" : 0,
          "is_throttled" : false,
          "throttle_time_in_millis" : 0
        },
        "get" : {
          "total" : 4,
          "time_in_millis" : 18,
          "exists_total" : 4,
          "exists_time_in_millis" : 18,
          "missing_total" : 0,
          "missing_time_in_millis" : 0,
          "current" : 0
        },
        "search" : {
          "open_contexts": 4,
          "query_total": 194,
          "query_time_in_millis": 467,
          "query_current": 0,
          "fetch_total": 194,
          "fetch_time_in_millis": 143,
          "fetch_current": 0,
          "scroll_total": 0,
          "scroll_time_in_millis": 0,
          "scroll_current": 0,
          "point_in_time_total": 0,
          "point_in_time_time_in_millis": 0,
          "point_in_time_current": 0,
          "suggest_total": 0,
          "suggest_time_in_millis": 0,
          "suggest_current": 0,
          "search_idle_reactivate_count_total": 0,
          "request" : {
            "dfs_pre_query" : {
              "time_in_millis" : 0,
              "current" : 0,
              "total" : 0
            },
            "query" : {
              "time_in_millis" : 200,
              "current" : 2,
              "total" : 12
            },
            "fetch" : {
              "time_in_millis" : 37,
              "current" : 3,
              "total" : 4
            },
            "dfs_query" : {
              "time_in_millis" : 0,
              "current" : 0,
              "total" : 0
            },
            "expand" : {
              "time_in_millis" : 9,
              "current" : 1,
              "total" : 0
            },
            "can_match" : {
              "time_in_millis" : 0,
              "current" : 0,
              "total" : 0
            }
          }
        },
        "merges" : {
          "current" : 0,
          "current_docs" : 0,
          "current_size_in_bytes" : 0,
          "total" : 1,
          "total_time_in_millis" : 5,
          "total_docs" : 12,
          "total_size_in_bytes" : 3967,
          "total_stopped_time_in_millis" : 0,
          "total_throttled_time_in_millis" : 0,
          "total_auto_throttle_in_bytes" : 251658240
        },
        "refresh" : {
          "total" : 74,
          "total_time_in_millis" : 201,
          "external_total" : 57,
          "external_total_time_in_millis" : 314,
          "listeners" : 0
        },
        "flush" : {
          "total" : 28,
          "periodic" : 28,
          "total_time_in_millis" : 1261
        },
        "warmer" : {
          "current" : 0,
          "total" : 45,
          "total_time_in_millis" : 99
        },
        "query_cache" : {
          "memory_size_in_bytes" : 0,
          "total_count" : 0,
          "hit_count" : 0,
          "miss_count" : 0,
          "cache_size" : 0,
          "cache_count" : 0,
          "evictions" : 0
        },
        "fielddata" : {
          "memory_size_in_bytes" : 356,
          "evictions" : 0,
          "item_count": 1
        },
        "completion" : {
          "size_in_bytes" : 0,
          "fields" : { }
        },
        "segments" : {
          "count" : 17,
          "memory_in_bytes" : 0,
          "terms_memory_in_bytes" : 0,
          "stored_fields_memory_in_bytes" : 0,
          "term_vectors_memory_in_bytes" : 0,
          "norms_memory_in_bytes" : 0,
          "points_memory_in_bytes" : 0,
          "doc_values_memory_in_bytes" : 0,
          "index_writer_memory_in_bytes" : 0,
          "version_map_memory_in_bytes" : 0,
          "fixed_bit_set_memory_in_bytes" : 288,
          "max_unsafe_auto_id_timestamp" : -1,
          "remote_store" : {
            "upload" : {
              "total_upload_size" : {
                "started_bytes" : 152419,
                "succeeded_bytes" : 152419,
                "failed_bytes" : 0
              },
              "refresh_size_lag" : {
                "total_bytes" : 0,
                "max_bytes" : 0
              },
              "max_refresh_time_lag_in_millis" : 0,
              "total_time_spent_in_millis" : 516,
              "pressure" : {
                "total_rejections" : 0
              }
            },
            "download" : {
              "total_download_size" : {
                "started_bytes" : 0,
                "succeeded_bytes" : 0,
                "failed_bytes" : 0
              },
              "total_time_spent_in_millis" : 0
            }
          },
          "file_sizes" : { }
        },
        "translog" : {
          "operations" : 12,
          "size_in_bytes" : 1452,
          "uncommitted_operations" : 12,
          "uncommitted_size_in_bytes" : 1452,
          "earliest_last_modified_age" : 164160,
          "remote_store" : {
            "upload" : {
              "total_uploads" : {
                "started" : 57,
                "failed" : 0,
                "succeeded" : 57
              },
              "total_upload_size" : {
                "started_bytes" : 16830,
                "failed_bytes" : 0,
                "succeeded_bytes" : 16830
              }
            }
          }
        },
        "request_cache" : {
          "memory_size_in_bytes" : 1649,
          "evictions" : 0,
          "hit_count" : 0,
          "miss_count" : 18
        },
        "recovery" : {
          "current_as_source" : 0,
          "current_as_target" : 0,
          "throttle_time_in_millis" : 0
        }
      },
      "os" : {
        "timestamp" : 1664484195263,
        "cpu" : {
          "percent" : 0,
          "load_average" : {
            "1m" : 0.0,
            "5m" : 0.0,
            "15m" : 0.0
          }
        },
        "mem" : {
          "total_in_bytes" : 13137076224,
          "free_in_bytes" : 9265442816,
          "used_in_bytes" : 3871633408,
          "free_percent" : 71,
          "used_percent" : 29
        },
        "swap" : {
          "total_in_bytes" : 4294967296,
          "free_in_bytes" : 4294967296,
          "used_in_bytes" : 0
        },
        "cgroup" : {
          "cpuacct" : {
            "control_group" : "/",
            "usage_nanos" : 338710071600
          },
          "cpu" : {
            "control_group" : "/",
            "cfs_period_micros" : 100000,
            "cfs_quota_micros" : -1,
            "stat" : {
              "number_of_elapsed_periods" : 0,
              "number_of_times_throttled" : 0,
              "time_throttled_nanos" : 0
            }
          },
          "memory" : {
            "control_group" : "/",
            "limit_in_bytes" : "9223372036854771712",
            "usage_in_bytes" : "1432346624"
          }
        }
      },
      "process" : {
        "timestamp" : 1664484195263,
        "open_file_descriptors" : 556,
        "max_file_descriptors" : 65536,
        "cpu" : {
          "percent" : 0,
          "total_in_millis" : 170870
        },
        "mem" : {
          "total_virtual_in_bytes" : 6563344384
        }
      },
      "jvm" : {
        "timestamp" : 1664484195264,
        "uptime_in_millis" : 21232111,
        "mem" : {
          "heap_used_in_bytes" : 308650480,
          "heap_used_percent" : 57,
          "heap_committed_in_bytes" : 536870912,
          "heap_max_in_bytes" : 536870912,
          "non_heap_used_in_bytes" : 147657128,
          "non_heap_committed_in_bytes" : 152502272,
          "pools" : {
            "young" : {
              "used_in_bytes" : 223346688,
              "max_in_bytes" : 0,
              "peak_used_in_bytes" : 318767104,
              "peak_max_in_bytes" : 0,
              "last_gc_stats" : {
                "used_in_bytes" : 0,
                "max_in_bytes" : 0,
                "usage_percent" : -1
              }
            },
            "old" : {
              "used_in_bytes" : 67068928,
              "max_in_bytes" : 536870912,
              "peak_used_in_bytes" : 67068928,
              "peak_max_in_bytes" : 536870912,
              "last_gc_stats" : {
                "used_in_bytes" : 34655744,
                "max_in_bytes" : 536870912,
                "usage_percent" : 6
              }
            },
            "survivor" : {
              "used_in_bytes" : 18234864,
              "max_in_bytes" : 0,
              "peak_used_in_bytes" : 32721280,
              "peak_max_in_bytes" : 0,
              "last_gc_stats" : {
                "used_in_bytes" : 18234864,
                "max_in_bytes" : 0,
                "usage_percent" : -1
              }
            }
          }
        },
        "threads" : {
          "count" : 80,
          "peak_count" : 80
        },
        "gc" : {
          "collectors" : {
            "young" : {
              "collection_count" : 18,
              "collection_time_in_millis" : 199
            },
            "old" : {
              "collection_count" : 0,
              "collection_time_in_millis" : 0
            }
          }
        },
        "buffer_pools" : {
          "mapped" : {
            "count" : 23,
            "used_in_bytes" : 6232113,
            "total_capacity_in_bytes" : 6232113
          },
          "direct" : {
            "count" : 63,
            "used_in_bytes" : 9050069,
            "total_capacity_in_bytes" : 9050068
          },
          "mapped - 'non-volatile memory'" : {
            "count" : 0,
            "used_in_bytes" : 0,
            "total_capacity_in_bytes" : 0
          }
        },
        "classes" : {
          "current_loaded_count" : 20693,
          "total_loaded_count" : 20693,
          "total_unloaded_count" : 0
        }
      },
      "thread_pool" : {
        "OPENSEARCH_ML_TASK_THREAD_POOL" : {
          "threads" : 0,
          "queue" : 0,
          "active" : 0,
          "rejected" : 0,
          "largest" : 0,
          "completed" : 0
        },
        "ad-batch-task-threadpool" : {
          "threads" : 0,
          "queue" : 0,
          "active" : 0,
          "rejected" : 0,
          "largest" : 0,
          "completed" : 0
        },
        ...
      },
      "fs" : {
        "timestamp" : 1664484195264,
        "total" : {
          "total_in_bytes" : 269490393088,
          "free_in_bytes" : 261251477504,
          "available_in_bytes" : 247490805760
        },
        "data" : [
          {
            "path" : "/usr/share/opensearch/data/nodes/0",
            "mount" : "/ (overlay)",
            "type" : "overlay",
            "total_in_bytes" : 269490393088,
            "free_in_bytes" : 261251477504,
            "available_in_bytes" : 247490805760
          }
        ],
        "io_stats" : { }
      },
      "transport" : {
        "server_open" : 0,
        "total_outbound_connections" : 0,
        "rx_count" : 0,
        "rx_size_in_bytes" : 0,
        "tx_count" : 0,
        "tx_size_in_bytes" : 0
      },
      "http" : {
        "current_open" : 5,
        "total_opened" : 1108
      },
      "breakers" : {
        "request" : {
          "limit_size_in_bytes" : 322122547,
          "limit_size" : "307.1mb",
          "estimated_size_in_bytes" : 0,
          "estimated_size" : "0b",
          "overhead" : 1.0,
          "tripped" : 0
        },
        "fielddata" : {
          "limit_size_in_bytes" : 214748364,
          "limit_size" : "204.7mb",
          "estimated_size_in_bytes" : 356,
          "estimated_size" : "356b",
          "overhead" : 1.03,
          "tripped" : 0
        },
        "in_flight_requests" : {
          "limit_size_in_bytes" : 536870912,
          "limit_size" : "512mb",
          "estimated_size_in_bytes" : 0,
          "estimated_size" : "0b",
          "overhead" : 2.0,
          "tripped" : 0
        },
        "parent" : {
          "limit_size_in_bytes" : 510027366,
          "limit_size" : "486.3mb",
          "estimated_size_in_bytes" : 308650480,
          "estimated_size" : "294.3mb",
          "overhead" : 1.0,
          "tripped" : 0
        }
      },
      "script" : {
        "compilations" : 0,
        "cache_evictions" : 0,
        "compilation_limit_triggered" : 0
      },
      "discovery" : {
        "cluster_state_queue" : {
          "total" : 0,
          "pending" : 0,
          "committed" : 0
        },
        "published_cluster_states" : {
          "full_states" : 2,
          "incompatible_diffs" : 0,
          "compatible_diffs" : 10
        },
        "cluster_state_stats" : {
          "overall" : {
            "update_count" : 9,
            "total_time_in_millis" : 807,
            "failed_count" : 0
          },
          "remote_upload" : {
            "success_count" : 9,
            "failed_count" : 0,
            "total_time_in_millis" : 116,
            "cleanup_attempt_failed_count" : 0
          }
        }
      },
      "ingest" : {
        "total" : {
          "count" : 0,
          "time_in_millis" : 0,
          "current" : 0,
          "failed" : 0
        },
        "pipelines" : { }
      },
      "search_pipeline" : {
        "total_request" : {
          "count" : 5,
          "time_in_millis" : 158,
          "current" : 0,
          "failed" : 0
        },
        "total_response" : {
          "count" : 2,
          "time_in_millis" : 1,
          "current" : 0,
          "failed" : 0
        },
        "pipelines" : {
          "public_info" : {
            "request" : {
              "count" : 3,
              "time_in_millis" : 71,
              "current" : 0,
              "failed" : 0
            },
            "response" : {
              "count" : 0,
              "time_in_millis" : 0,
              "current" : 0,
              "failed" : 0
            },
            "request_processors" : [
              {
                "filter_query:abc" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 1,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
            ]
              ...
            "response_processors" : [
              {
                "rename_field" : {
                  "type" : "rename_field",
                  "stats" : {
                    "count" : 2,
                    "time_in_millis" : 1,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              }
            ]
          },
          ...
        }
      },
      "adaptive_selection" : {
        "F-ByTQzVQ3GQeYzQJArJGQ" : {
          "outgoing_searches" : 0,
          "avg_queue_size" : 0,
          "avg_service_time_ns" : 501024,
          "avg_response_time_ns" : 794105,
          "rank" : "0.8"
        }
      },
      "script_cache" : {
        "sum" : {
          "compilations" : 0,
          "cache_evictions" : 0,
          "compilation_limit_triggered" : 0
        },
        "contexts" : [
          {
            "context" : "aggregation_selector",
            "compilations" : 0,
            "cache_evictions" : 0,
            "compilation_limit_triggered" : 0
          },
          {
            "context" : "aggs",
            "compilations" : 0,
            "cache_evictions" : 0,
            "compilation_limit_triggered" : 0
          },
          ...
        ]
      },
      "indexing_pressure" : {
        "memory" : {
          "current" : {
            "combined_coordinating_and_primary_in_bytes" : 0,
            "coordinating_in_bytes" : 0,
            "primary_in_bytes" : 0,
            "replica_in_bytes" : 0,
            "all_in_bytes" : 0
          },
          "total" : {
            "combined_coordinating_and_primary_in_bytes" : 40256,
            "coordinating_in_bytes" : 40256,
            "primary_in_bytes" : 45016,
            "replica_in_bytes" : 0,
            "all_in_bytes" : 40256,
            "coordinating_rejections" : 0,
            "primary_rejections" : 0,
            "replica_rejections" : 0
          },
          "limit_in_bytes" : 53687091
        }
      },
      "shard_indexing_pressure" : {
        "stats" : { },
        "total_rejections_breakup_shadow_mode" : {
          "node_limits" : 0,
          "no_successful_request_limits" : 0,
          "throughput_degradation_limits" : 0
        },
        "enabled" : false,
        "enforced" : false
      },
      "resource_usage_stats": {
        "nxLWtMdXQmWA-ZBVWU8nwA": {
          "timestamp": 1698401391000,
          "cpu_utilization_percent": "0.1",
          "memory_utilization_percent": "3.9",
          "io_usage_stats": {
            "max_io_utilization_percent": "99.6"
          }
        }
      },
      "admission_control": {
        "global_cpu_usage": {
          "transport": {
            "rejection_count": {
              "search": 3,
              "indexing": 1
            }
          }
        },
        "global_io_usage": {
          "transport": {
            "rejection_count": {
              "search": 3,
              "indexing": 1
            }
          }
        }
      },
      "caches" : {
        "request_cache" : {
          "size_in_bytes" : 1649,
          "evictions" : 0,
          "hit_count" : 0,
          "miss_count" : 18,
          "item_count" : 18,
          "store_name" : "opensearch_onheap"
        }
      }
    }
  }
}
```
</details>

## Response body fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| _nodes | Object | Statistics about the nodes that are returned. |
| _nodes.total | Integer | The total number of nodes for this request. |
| _nodes.successful | Integer | The number of nodes for which the request was successful. |
| _nodes.failed | Integer | The number of nodes for which the request failed. If there are nodes for which the request failed, the failure message is included. |
| cluster_name | String | The name of the cluster. |
| [nodes](#nodes) | Object | Statistics for the nodes included in this request. |

### `nodes`

The `nodes` object contains all nodes that are returned by the request, along with their IDs. Each node has the following properties.

Field | Data type | Description
:--- | :--- | :---
timestamp | Integer | The time the nodes statistics were collected, in milliseconds since the epoch. 
name | String | The name of the node.
transport_address | IP address | The host and port of the transport layer that is used by nodes in a cluster to communicate internally.
host | IP address | The network host of the node.
ip | IP address | The IP address and port of the node.
roles | Array | The roles of the node (for example, `cluster_manager`, `data`, or `ingest`).
attributes | Object | The attributes of the node (for example, `shard_indexing_pressure_enabled`).
[indices](#indices) | Object | Index statistics for each index that has shards on the node.
[os](#os) | Object | Statistics about the OS for the node.
[process](#process) | Object | Process statistics for the node.
[jvm](#jvm) | Object | Statistics about the JVM for the node.
[thread_pool](#thread_pool)| Object | Statistics about each thread pool for the node. 
[fs](#fs) | Object | Statistics about the file stores for the node.
[transport](#transport) | Object | Transport statistics for the node.
http | Object | HTTP statistics for the node.
http.current_open | Integer | The number of currently open HTTP connections for the node.
http.total_opened | Integer | The total number of HTTP connections the node has opened since it started.
[breakers](#breakers) | Object | Statistics about the circuit breakers for the node. 
[script](#script-and-script_cache)| Object | Script statistics for the node.
[script_cache](#script-and-script_cache)| Object | Script cache statistics for the node.
[discovery](#discovery) | Object | Node discovery statistics for the node.
[ingest](#ingest) | Object | Ingest statistics for the node.
[search_pipeline](#search_pipeline) | Object | Statistics related to [search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/).
[adaptive_selection](#adaptive_selection) | Object | Statistics about adaptive selections for the node. 
[indexing_pressure](#indexing_pressure) | Object | Statistics related to the node's indexing pressure.
[shard_indexing_pressure](#shard_indexing_pressure) | Object | Statistics related to indexing pressure at the shard level.
[search_backpressure]({{site.url}}{{site.baseurl}}/opensearch/search-backpressure#search-backpressure-stats-api) | Object | Statistics related to search backpressure.
[cluster_manager_throttling](#cluster_manager_throttling) | Object | Statistics related to throttled tasks on the cluster manager node.
[weighted_routing](#weighted_routing) | Object | Statistics relevant to weighted round robin requests.
[resource_usage_stats](#resource_usage_stats) | Object | Statistics related to resource usage for the node.
[admission_control](#admission_control) | Object | Statistics related to admission control for the node.
[caches](#caches) | Object | Statistics related to caches on the node.

### `indices`

The `indices` object contains the index statistics for each index with shards on this node. Each index has the following properties.

Field | Field type | Description
:--- | :--- | :---
docs | Object | Document statistics for all primary shards that exist on the node.
docs.count | Integer | The number of documents reported by Lucene. Excludes deleted documents and recently indexed documents that are not yet assigned to a segment. Nested documents are counted separately. 
docs.deleted | Integer | The number of deleted documents reported by Lucene. Excludes recent deletion operations that have not yet affect the segment. 
store | Object | Statistics about the shard sizes of the shards on the node.
store.size_in_bytes | Integer | Total size of all shards on the node.  
store.reserved_in_bytes | Integer | The predicted number of bytes the shard store will grow to be because of activities such as restoring snapshots and peer recoveries.
indexing | Object | Statistics about indexing operations for the node.
indexing.index_total | Integer | The total number of indexing operations on the node.
indexing.index_time_in_millis | Integer | The total time for all indexing operations, in milliseconds.
indexing.index_current | Integer | The number of indexing operations that are currently running.
indexing.index_failed | Integer | The number of indexing operations that have failed.
indexing.delete_total | Integer | The total number of deletions.
indexing.delete_time_in_millis | Integer | The total time for all deletion operations, in milliseconds.
indexing.delete_current | Integer | The number of deletion operations that are currently running.
indexing.noop_update_total | Integer | The total number of noop operations.
indexing.is_throttled | Boolean | Specifies whether any operations were throttled.
indexing.throttle_time_in_millis | Integer | The total time for throttling operations, in milliseconds.
get | Object | Statistics about the get operations for the node.
get.total | Integer | The total number of get operations.
get.time_in_millis | Integer | The total time for all get operations, in milliseconds.
get.exists_total | Integer | The total number of successful get operations.
get.exists_time_in_millis | Integer | The total time for all successful get operations, in milliseconds.
get.missing_total | Integer | The number of failed get operations.
get.missing_time_in_millis | Integer | The total time for all failed get operations, in milliseconds.
get.current | Integer | The number of get operations that are currently running.
search | Object | Statistics about the search operations for the node.
search.concurrent_avg_slice_count	| Integer | The average slice count of all search requests. This is computed as the total slice count divided by the total number of concurrent search requests.	
search.concurrent_query_total	|Integer | The total number of query operations that use concurrent segment search.	
search.concurrent_query_time_in_millis	| Integer | The total amount of time taken by all query operations that use concurrent segment search, in milliseconds.	
search.concurrent_query_current	|Integer | The number of currently running query operations that use concurrent segment search.	
search.startree_query_total | Integer | The total number of query operations that use a star tree for search.	
search.startree_query_time_in_millis | Integer | The total amount of time taken by all query operations that use a star tree for search, in milliseconds.	
search.startree_query_current | Integer | The number of currently running query operations that use a star tree for search.	
search.startree_query_failed | Integer | The number of failed query operations that use a star tree for search.
search.open_contexts | Integer | The number of open search contexts.
search.query_total | Integer | The total number of shard query operations.
search.query_time_in_millis | Integer | The total amount of time for all shard query operations, in milliseconds.
search.query_current | Integer | The number of shard query operations that are currently running.
search.query_failed | Integer | The total number of failed shard query operations.
search.fetch_total | Integer | The total number of shard fetch operations.
search.fetch_time_in_millis | Integer | The total amount of time for all shard fetch operations, in milliseconds.
search.fetch_current | Integer | The number of shard fetch operations that are currently running.
search.scroll_total | Integer | The total number of shard scroll operations.
search.scroll_time_in_millis | Integer | The total amount of time for all shard scroll operations, in milliseconds.
search.scroll_current | Integer | The number of shard scroll operations that are currently running.
search.point_in_time_total | Integer | The total number of shard Point in Time (PIT) contexts that have been created (completed and active) since the node last restarted.
search.point_in_time_time_in_millis | Integer |  The amount of time that shard PIT contexts have been held open since the node last restarted, in milliseconds.
search.point_in_time_current | Integer | The number of shard PIT contexts currently open.
search.suggest_total | Integer | The total number of shard suggest operations.
search.suggest_time_in_millis | Integer | The total amount of time for all shard suggest operations, in milliseconds.
search.suggest_current | Integer | The number of shard suggest operations that are currently running.
search.search_idle_reactivate_count_total | Integer | The total number of times that all shards have been activated from an idle state.
search.request | Object | Statistics about coordinator search operations for the node.
search.request.took.time_in_millis | Integer | The total amount of time taken for all search requests, in milliseconds.
search.request.took.current | Integer | The number of search requests that are currently running.
search.request.took.total | Integer | The total number of search requests completed.
search.request.dfs_pre_query.time_in_millis | Integer | The total amount of time for all coordinator depth-first search (DFS) prequery operations, in milliseconds.
search.request.dfs_pre_query.current | Integer | The number of coordinator DFS prequery operations that are currently running.
search.request.dfs_pre_query.total | Integer | The total number of coordinator DFS prequery operations completed.
search.request.query.time_in_millis | Integer | The total amount of time for all coordinator query operations, in milliseconds.
search.request.query.current | Integer | The number of coordinator query operations that are currently running.
search.request.query.total | Integer | The total number of coordinator query operations completed.
search.request.fetch.time_in_millis | Integer | The total amount of time for all coordinator fetch operations, in milliseconds.
search.request.fetch.current | Integer | The number of coordinator fetch operations that are currently running.
search.request.fetch.total | Integer | The total number of coordinator fetch operations completed.
search.request.dfs_query.time_in_millis | Integer | The total amount of time for all coordinator DFS prequery operations, in milliseconds.
search.request.dfs_query.current | Integer | The number of coordinator DFS prequery operations that are currently running.
search.request.dfs_query.total | Integer | The total number of coordinator DFS prequery operations completed.
search.request.expand.time_in_millis | Integer | The total amount of time for all coordinator expand operations, in milliseconds.
search.request.expand.current | Integer | The number of coordinator expand operations that are currently running.
search.request.expand.total | Integer | The total number of coordinator expand operations completed.
search.request.can_match.time_in_millis | Integer | The total amount of time for all coordinator match operations, in milliseconds.
search.request.can_match.current | Integer | The number of coordinator match operations that are currently running.
search.request.can_match.total | Integer | The total number of coordinator match operations completed.
merges | Object | Statistics about merge operations for the node.
merges.current | Integer | The number of merge operations that are currently running.
merges.current_docs | Integer | The number of document merges that are currently running.
merges.current_size_in_bytes | Integer | The memory size, in bytes, that is used to perform current merge operations.
merges.total | Integer | The total number of merge operations.
merges.total_time_in_millis | Integer | The total time for merges, in milliseconds.
merges.total_docs | Integer | The total number of documents that have been merged.
merges.total_size_in_bytes | Integer | The total size of all merged documents, in bytes.
merges.total_stopped_time_in_millis | Integer | The total time spent on stopping merge operations, in milliseconds.
merges.total_throttled_time_in_millis | Integer | The total time spent on throttling merge operations, in milliseconds. 
merges.total_auto_throttle_in_bytes | Integer | The total size of automatically throttled merge operations, in bytes.
refresh | Object | Statistics about refresh operations for the node.
refresh.total | Integer | The total number of refresh operations.
refresh.total_time_in_millis | Integer | The total time for all refresh operations, in milliseconds.
refresh.external_total | Integer | The total number of external refresh operations.
refresh.external_total_time_in_millis | Integer | The total time for all external refresh operations, in milliseconds.
refresh.listeners | Integer | The number of refresh listeners.
flush | Object | Statistics about flush operations for the node.
flush.total | Integer | The total number of flush operations.
flush.periodic | Integer | The total number of periodic flush operations.
flush.total_time_in_millis | Integer | The total time for all flush operations, in milliseconds.
warmer | Object | Statistics about the index warming operations for the node.
warmer.current | Integer | The number of current index warming operations.
warmer.total  | Integer | The total number of index warming operations.
warmer.total_time_in_millis | Integer | The total time for all index warming operations, in milliseconds.
query_cache | Statistics about query cache operations for the node.
query_cache.memory_size_in_bytes | Integer | The amount of memory used for the query cache for all shards in the node.
query_cache.total_count | Integer | The total number of hits and misses in the query cache.
query_cache.hit_count | Integer | The total number of hits in the query cache.
query_cache.miss_count | Integer | The total number of misses in the query cache. 
query_cache.cache_size | Integer | The number of queries currently in the query cache.
query_cache.cache_count | Integer | The total number of queries that have been added to the query cache, including those that have since been evicted.
query_cache.evictions | Integer | The number of evictions from the query cache.
fielddata | Object | Statistics about the field data cache for all shards in the node.
fielddata.memory_size_in_bytes | Integer | The total amount of memory used for the field data cache for all shards in the node.
fielddata.evictions | Integer | The number of evictions in the field data cache.
fielddata.item_count | Integer | The number of items in the field data cache.
fielddata.fields | Object | Contains all field data fields.
completion | Object | Statistics about completions for all shards in the node.
completion.size_in_bytes | Integer | The total amount of memory used for completion for all shards in the node, in bytes.
completion.fields | Object | Contains completion fields.
segments | Object | Statistics about segments for all shards in the node.
segments.count | Integer | The total number of segments.
segments.memory_in_bytes | Integer | The total amount of memory, in bytes. 
segments.terms_memory_in_bytes | Integer | The total amount of memory used for terms, in bytes. 
segments.stored_fields_memory_in_bytes | Integer | The total amount of memory used for stored fields, in bytes. 
segments.term_vectors_memory_in_bytes | Integer | The total amount of memory used for term vectors, in bytes. 
segments.norms_memory_in_bytes | Integer | The total amount of memory used for normalization factors, in bytes. 
segments.points_memory_in_bytes | Integer | The total amount of memory used for points, in bytes. 
segments.doc_values_memory_in_bytes | Integer | The total amount of memory used for doc values, in bytes. 
segments.index_writer_memory_in_bytes | Integer | The total amount of memory used by all index writers, in bytes. 
segments.version_map_memory_in_bytes | Integer | The total amount of memory used by all version maps, in bytes. 
segments.fixed_bit_set_memory_in_bytes | Integer | The total amount of memory used by fixed bit sets, in bytes. Fixed bit sets are used for nested objects and join fields.
segments.max_unsafe_auto_id_timestamp | Integer | The timestamp for the most recently retired indexing request, in milliseconds since the epoch.
segments.segment_replication | Object | Segment replication statistics for all primary shards when segment replication is enabled on the node. 
segments.segment_replication.max_bytes_behind | long | The maximum number of bytes behind the primary replica.
segments.segment_replication.total_bytes_behind | long | The total number of bytes behind the primary replicas. 
segments.segment_replication.max_replication_lag | long | The maximum amount of time, in milliseconds, taken by a replica to catch up to its primary. 
segments.remote_store | Object | Statistics about remote segment store operations.
segments.remote_store.upload | Object | Statistics related to uploads to the remote segment store.
segments.remote_store.upload.total_upload_size | Object | The amount of data, in bytes, uploaded to the remote segment store.
segments.remote_store.upload.total_upload_size.started_bytes | Integer | The number of bytes to upload to the remote segment store after the upload has started.
segments.remote_store.upload.total_upload_size.succeeded_bytes | Integer | The number of bytes successfully uploaded to the remote segment store.
segments.remote_store.upload.total_upload_size.failed_bytes | Integer | The number of bytes that failed to upload to the remote segment store.
segments.remote_store.upload.refresh_size_lag | Object | The amount of lag during upload between the remote segment store and the local store.
segments.remote_store.upload.refresh_size_lag.total_bytes | Integer | The total number of bytes that lagged during the upload refresh between the remote segment store and the local store.
segments.remote_store.upload.refresh_size_lag.max_bytes | Integer | The maximum amount of lag, in bytes, during the upload refresh between the remote segment store and the local store.
segments.remote_store.upload.max_refresh_time_lag_in_millis | Integer | The maximum duration, in milliseconds, that the remote refresh is behind the local refresh.
segments.remote_store.upload.total_time_spent_in_millis | Integer | The total amount of time, in milliseconds, spent on uploads to the remote segment store.
segments.remote_store.upload.pressure | Object | Statistics related to segment store upload backpressure.
segments.remote_store.upload.pressure.total_rejections | Integer | The total number of requests rejected due to segment store upload backpressure.
segments.remote_store.download | Object | Statistics related to downloads to the remote segment store.
segments.remote_store.download.total_download_size | Object | The total amount of data download from the remote segment store.
segments.remote_store.download.total_download_size.started_bytes | Integer | The number of bytes downloaded from the remote segment store after the download starts.
segments.remote_store.download.total_download_size.succeeded_bytes | Integer | The number of bytes successfully downloaded from the remote segment store.
segments.remote_store.download.total_download_size.failed_bytes | Integer | The number of bytes that failed to download from the remote segment store.
segments.remote_store.download.total_time_spent_in_millis | Integer | The total duration, in milliseconds, spent on downloads from the remote segment store.
segments.file_sizes | Integer | Statistics about the size of the segment files.
translog | Object | Statistics about transaction log operations for the node.
translog.operations | Integer | The number of translog operations.
translog.size_in_bytes | Integer | The size of the translog, in bytes.
translog.uncommitted_operations | Integer | The number of uncommitted translog operations.
translog.uncommitted_size_in_bytes | Integer | The size of uncommitted translog operations, in bytes.
translog.earliest_last_modified_age | Integer | The earliest last modified age for the translog.
translog.remote_store | Object | Statistics related to operations from the remote translog store.
translog.remote_store.upload | Object | Statistics related to uploads to the remote translog store.
translog.remote_store.upload.total_uploads | Object | The number of syncs to the remote translog store.
translog.remote_store.upload.total_uploads.started | Integer | The number of upload syncs to the remote translog store that have started.
translog.remote_store.upload.total_uploads.failed | Integer | The number of failed upload syncs to the remote translog store.
translog.remote_store.upload.total_uploads.succeeded | Integer | The number of successful upload syncs to the remote translog store.
translog.remote_store.upload.total_upload_size | Object | The total amount of data uploaded to the remote translog store.
translog.remote_store.upload.total_upload_size.started_bytes | Integer | The number of bytes actively uploading to the remote translog store after the upload has started.
translog.remote_store.upload.total_upload_size.failed_bytes | Integer | The number of bytes that failed to upload to the remote translog store.
translog.remote_store.upload.total_upload_size.succeeded_bytes | Integer | The number of bytes successfully uploaded to the remote translog store.
request_cache | Object | Statistics about the request cache for the node.
request_cache.memory_size_in_bytes | Integer | The memory size used by the request cache, in bytes.
request_cache.evictions | Integer | The number of request cache evictions.
request_cache.hit_count | Integer | The number of request cache hits.
request_cache.miss_count | Integer | The number of request cache misses.
recovery | Object | Statistics about recovery operations for the node.
recovery.current_as_source | Integer | The number of recovery operations that have used an index shard as a source.
recovery.current_as_target | Integer | The number of recovery operations that have used an index shard as a target.
recovery.throttle_time_in_millis | Integer | The delay of recovery operations due to throttling, in milliseconds.

### `os`

The `os` object has the OS statistics for the node and has the following properties.

Field | Field type | Description
:--- | :--- | :---
timestamp | Integer | The last refresh time for the OS statistics, in milliseconds since the epoch.
cpu | Object | Statistics about the node's CPU usage.
cpu.percent | Integer | Recent CPU usage for the system.
cpu.load_average | Object | Statistics about load averages for the system.
cpu.load_average.1m | Float | The load average for the system for the time period of one minute.
cpu.load_average.5m | Float | The load average for the system for the time period of five minutes.
cpu.load_average.15m | Float | The load average for the system for the time period of 15 minutes.
mem | Object | Statistics about memory usage for the node.
mem.total_in_bytes | Integer | The total amount of physical memory, in bytes.
mem.free_in_bytes | Integer | The total amount of free physical memory, in bytes.
mem.used_in_bytes | Integer | The total amount of used physical memory, in bytes.
mem.free_percent | Integer | The percentage of memory that is free.
mem.used_percent | Integer | The percentage of memory that is used.
swap | Object | Statistics about swap space for the node.
swap.total_in_bytes | Integer | The total amount of swap space, in bytes.
swap.free_in_bytes | Integer | The total amount of free swap space, in bytes.
swap.used_in_bytes | Integer | The total amount of used swap space, in bytes.
cgroup | Object | Contains cgroup statistics for the node. Returned for Linux only.
cgroup.cpuacct | Object | Statistics about the cpuacct control group for the node.
cgroup.cpu | Object | Statistics about the CPU control group for the node.
cgroup.memory | Object | Statistics about the memory control group for the node.

### `process`

The `process` object contains process statistics for the node and has the following properties.

Field | Field type | Description
:--- | :--- | :---
timestamp | Integer | The last refresh time for the process statistics, in milliseconds since the epoch.
open_file_descriptors | Integer |  The number of opened file descriptors associated with the current process.
max_file_descriptors | Integer | The maximum number of file descriptors for the system.
cpu | Object | Statistics about the CPU for the node. 
cpu.percent | Integer | The percentage of CPU usage for the process.
cpu.total_in_millis | Integer | The total CPU time used by the process on which the JVM is running, in milliseconds.
mem  | Object | Statistics about the memory for the node.
mem.total_virtual_in_bytes | Integer | The total amount of virtual memory that is guaranteed to be available to the process that is currently running, in bytes.

### `jvm`

The `jvm` object contains statistics about the JVM for the node and has the following properties.

Field | Field type | Description
:--- | :--- | :---
timestamp | Integer | The last refresh time for the JVM statistics, in milliseconds since the epoch.
uptime_in_millis | Integer | The JVM uptime, in milliseconds.
mem | Object | Statistics for the JVM memory usage on the node.
mem.heap_used_in_bytes | Integer | The amount of memory that is currently being used, in bytes.
mem.heap_used_percent | Integer | The percentage of memory that is currently used by the heap.
mem.heap_committed_in_bytes | Integer | The amount of memory available for use by the heap, in bytes.
mem.heap_max_in_bytes | Integer | The maximum amount of memory available for use by the heap, in bytes.
mem.non_heap_used_in_bytes | Integer | The amount of non-heap memory that is currently used, in bytes.
mem.non_heap_committed_in_bytes | Integer | The maximum amount of non-heap memory available for use, in bytes.
mem.pools | Object | Statistics about heap memory usage for the node.
mem.pools.young | Object | Statistics about the young generation heap memory usage for the node. Contains the amount of memory used, the maximum amount of memory available, and the peak amount of memory used. 
mem.pools.old | Object | Statistics about the old generation heap memory usage for the node. Contains the amount of memory used, the maximum amount of memory available, and the peak amount of memory used. 
mem.pools.survivor | Object | Statistics about the survivor space memory usage for the node. Contains the amount of memory used, the maximum amount of memory available, and the peak amount of memory used. 
threads | Object | Statistics about the JVM thread usage for the node.
threads.count | Integer | The number of threads that are currently active in the JVM.
threads.peak_count | Integer | The maximum number of threads in the JVM.
gc.collectors | Object | Statistics about the JVM garbage collectors for the node.
gc.collectors.young | Integer | Statistics about JVM garbage collectors that collect young generation objects.
gc.collectors.young.collection_count | Integer | The number of garbage collectors that collect young generation objects.
gc.collectors.young.collection_time_in_millis | Integer | The total time spent on garbage collection of young generation objects, in milliseconds.
gc.collectors.old | Integer | Statistics about JVM garbage collectors that collect old generation objects.
gc.collectors.old.collection_count | Integer | The number of garbage collectors that collect old generation objects.
gc.collectors.old.collection_time_in_millis | Integer | The total time spent on garbage collection of old generation objects, in milliseconds.
buffer_pools | Object | Statistics about the JVM buffer pools for the node.
buffer_pools.mapped | Object | Statistics about the mapped JVM buffer pools for the node.
buffer_pools.mapped.count | Integer | The number of mapped buffer pools.
buffer_pools.mapped.used_in_bytes | Integer | The amount of memory used by mapped buffer pools, in bytes.
buffer_pools.mapped.total_capacity_in_bytes | Integer | The total capacity of the mapped buffer pools, in bytes.
buffer_pools.direct | Object | Statistics about the direct JVM buffer pools for the node.
buffer_pools.direct.count | Integer | The number of direct buffer pools.
buffer_pools.direct.used_in_bytes | Integer | The amount of memory used by direct buffer pools, in bytes.
buffer_pools.direct.total_capacity_in_bytes | Integer | The total capacity of the direct buffer pools, in bytes.
classes | Object | Statistics about the classes loaded by the JVM for the node.
classes.current_loaded_count | Integer | The number of classes currently loaded by the JVM.
classes.total_loaded_count | Integer | The total number of classes loaded by the JVM since it started.
classes.total_unloaded_count | Integer | The total number of classes unloaded by the JVM since it started.

### `thread_pool`

The `thread_pool` object contains a list of all thread pools. Each thread pool is a nested object that is specified by its ID and contains the following properties.

Field | Field type | Description
:--- | :--- | :---
threads | Integer | The number of threads in the pool.
queue | Integer | The number of threads in queue.
active | Integer | The number of active threads in the pool.
rejected | Integer | The number of tasks that have been rejected.
largest | Integer | The peak number of threads in the pool.
completed | Integer | The number of tasks completed.
total_wait_time_in_nanos | Integer | The total amount of time that tasks spend waiting in the thread pool queue. Currently, only `search`, `search_throttled`, and `index_searcher` thread pools support this metric.

### `fs`

The `fs` object represents statistics about the file stores for the node. It has the following properties.

Field | Field type | Description
:--- | :--- | :---
timestamp | Integer | The last refresh time for the file store statistics, in milliseconds since the epoch.
total | Object | Statistics for all file stores of the node.
total.total_in_bytes | Integer | The total memory size of all file stores, in bytes. 
total.free_in_bytes | Integer | The total unallocated disk space in all file stores, in bytes.
total.available_in_bytes | Integer | The total disk space available to the JVM on all file stores. Represents the actual amount of memory, in bytes, that OpenSearch can use.
data | Array | The list of all file stores. Each file store has the following properties.
data.path | String | The path to the file store.
data.mount | String | The mount point of the file store.
data.type | String | The type of the file store (for example, overlay).
data.total_in_bytes | Integer | The total size of the file store, in bytes.
data.free_in_bytes | Integer | The total unallocated disk space in the file store, in bytes.
data.available_in_bytes | Integer | The total amount of disk space available to the JVM for the file store, in bytes.
io_stats | Object | I/O statistics for the node (Linux only). Includes devices, read and write operations, and the I/O operation time.

### `transport`

The `transport` object has the following properties.

Field | Field type | Description
:--- | :--- | :---
server_open | Integer | The number of open inbound TCP connections that OpenSearch nodes use for internal communication. 
total_outbound_connections | Integer | The total number of outbound transport connections that the node has opened since it started.
rx_count | Integer | The total number of RX (receive) packets the node received during internal communication.
rx_size_in_bytes | Integer | The total size of RX packets the node received during internal communication, in bytes.
tx_count | Integer | The total number of TX (transmit) packets the node sent during internal communication.
tx_size_in_bytes | Integer | The total size of TX (transmit) packets the node sent during internal communication, in bytes.

### `breakers`

The `breakers` object contains statistics about the circuit breakers for the node. Each circuit breaker is a nested object listed by name and contains the following properties.

Field | Field type | Description
:--- | :--- | :---
limit_size_in_bytes | Integer | The memory limit for the circuit breaker, in bytes.
limit_size | Byte value | The memory limit for the circuit breaker in human-readable format (for example, `307.1mb`).
estimated_size_in_bytes | Integer | The estimated memory used for the operation, in bytes.
estimated_size | Byte value | The estimated memory used for the operation in human-readable format (for example, `356b`).
overhead | Float | A factor that all estimates are multiplied by to calculate the final estimate.
tripped | Integer | The total number of times the circuit breaker has been activated to prevent an out-of-memory error.

### `script` and `script_cache`

The `script` and `script_cache` objects have the following properties.

Field | Field type | Description
:--- | :--- | :---
script | Object | Script statistics for the node.
script.compilations | Integer | The total number of script compilations for the node.
script.cache_evictions| Integer | The total number of times the script cache has purged old data.
script.compilation_limit_triggered | Integer | The total number of times script compilation was limited by a circuit breaker.
script_cache | Object | Script cache statistics for the node.
script_cache.sum.compilations | Integer | The total number of script compilations in the cache for the node.
script_cache.sum.cache_evictions| Integer | The total number of times the script cache has purged old data.
script_cache.sum.compilation_limit_triggered | Integer | The total number of times script compilation in the cache was limited by a circuit breaker.
script_cache.contexts | Array of objects | The list of contexts for the script cache. Each context contains its name, the number of compilations, the number of cache evictions, and the number of times the script was limited by a circuit breaker.

### `discovery`

The `discovery` object contains the node discovery statistics and has the following properties.

Field | Field type | Description
:--- | :--- | :---
cluster_state_queue | Object | Cluster state queue statistics for the node.
cluster_state_queue.total | Integer | The total number of cluster states in the queue.
cluster_state_queue.pending | Integer | The number of pending cluster states in the queue.
cluster_state_queue.committed | Integer | The number of committed cluster states in the queue.
published_cluster_states | Object | Statistics for the published cluster states for the node.
published_cluster_states.full_states | Integer | The number of published cluster states.
published_cluster_states.incompatible_diffs | Integer | The number of incompatible differences between published cluster states.
published_cluster_states.compatible_diffs | Integer | The number of compatible differences between published cluster states.
cluster_state_stats | Object | Cluster state update statistics published by the active leader.
cluster_state_stats.overall | Object | Overall cluster state update statistics.
cluster_state_stats.overall.update_count | Integer | The total number of successful cluster state updates.
cluster_state_stats.overall.total_time_in_millis | Integer | The total amount of time taken for all cluster state updates, in milliseconds.
cluster_state_stats.overall.failed_count | Integer | The total number of failed cluster state updates.
cluster_state_stats.remote_upload | Object | Cluster state update statistics related to remote uploads.
cluster_state_stats.remote_upload.success_count | Integer | The total number of successful cluster state updates uploaded to the remote store.
cluster_state_stats.remote_upload.failed_count | Integer | The total number of cluster state updates that failed to upload to the remote store.
cluster_state_stats.remote_upload.total_time_in_millis | Integer | The total amount of time taken for all cluster state updates uploaded to the remote store, in milliseconds.
cluster_state_stats.remote_upload.cleanup_attempt_failed_count | Integer | The total number of failures encountered while trying to clean up older cluster states from the remote store.

### `ingest`

The `ingest` object contains the ingest statistics and has the following properties.

Field | Field type | Description
:--- | :--- | :---
total | Integer | Ingest statistics for the node's lifetime.
total.count | Integer | The total number of documents ingested by the node.
total.time_in_millis | Integer | The total amount of time for preprocessing ingest documents, in milliseconds.
total.current | Integer | The total number of documents that are currently being ingested by the node.
total.failed | Integer | The total number of failed ingestions for the node.
pipelines | Object | Ingest pipeline statistics for the node. Each pipeline is a nested object that is specified by its ID and has the following properties.
pipelines._id_.count | Integer | The number of documents preprocessed by the ingest pipeline.
pipelines._id_.time_in_millis | Integer | The total amount of time for preprocessing documents in the ingest pipeline, in milliseconds.
pipelines._id_.failed | Integer | The total number of failed ingestions for the ingest pipeline.
pipelines._id_.processors | Array of objects | Statistics for the ingest processors. Includes the number of documents that are currently transformed, the total number of transformed documents, the number of failed transformations, and the time spent transforming documents.

### `search_pipeline`

The `search_pipeline` object contains the statistics related to [search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) and has the following properties.

Field | Field type | Description
:--- | :--- | :---
total_request | Object | Cumulative statistics related to all search request processors. 
total_request.count | Integer | The total number of search request processor executions.
total_request.time_in_millis | Integer | The total amount of time for all search request processor executions, in milliseconds.
total_request.current | Integer | The total number of search request processor executions currently in progress.
total_request.failed | Integer | The total number of failed search request processor executions.
total_response | Object | Cumulative statistics related to all search response processors.
total_response.count | Integer | The total number of search response processor executions.
total_response.time_in_millis | Integer | The total amount of time for all search response processor executions, in milliseconds.
total_response.current | Integer | The total number of search response processor executions currently in progress.
total_response.failed | Integer | The total number of failed search response processor executions.
pipelines | Object | Search pipeline statistics. Each pipeline is a nested object specified by its ID, with the properties listed in the following rows. If a processor has a `tag`, statistics for the processor are provided in the object with the name `<processor_type>:<tag>` (for example, `filter_query:abc`). Statistics for all processors of the same type that do not have a `tag` are aggregated and provided in the object with the name `<processor-type>` (for example, `filter_query`).
pipelines._id_.request.count | Integer | The number of search request processor executions performed by the search pipeline.
pipelines._id_.request.time_in_millis | Integer | The total amount of time for search request processor executions in the search pipeline, in milliseconds.
pipelines._id_.request.current | Integer | The number of search request processor executions currently in progress for the search pipeline.
pipelines._id_.request.failed | Integer | The number of failed search request processor executions for the search pipeline.
pipelines._id_.request_processors | Array of objects | Statistics for the search request processors. Includes the total number of executions, the total amount of time of executions, the total number of executions currently in progress, and the number of failed executions.
pipelines._id_.response.count | Integer | The number of search response processor executions performed by the search pipeline.
pipelines._id_.response.time_in_millis | Integer | The total amount of time for search response processor executions in the search pipeline, in milliseconds.
pipelines._id_.response.current | Integer | The number of search response processor executions currently in progress for the search pipeline.
pipelines._id_.response.failed | Integer | The number of failed search response processor executions for the search pipeline.
pipelines._id_.response_processors | Array of objects | Statistics for the search response processors. Includes the total number of executions, the total amount of time of executions, the total number of executions currently in progress, and the number of failed executions.

### `adaptive_selection`

The `adaptive_selection` object contains the adaptive selection statistics. Each entry is specified by the node ID and has the following properties. 

Field | Field type | Description
:--- | :--- | :---
outgoing_searches | Integer | The number of outgoing search requests for the node.
avg_queue_size | Integer | The rolling average queue size of search requests for the node (exponentially weighted).
avg_service_time_ns | Integer | The rolling average service time for search requests, in nanoseconds (exponentially weighted).
avg_response_time_ns | Integer | The rolling average response time for search requests, in nanoseconds (exponentially weighted).
rank | String | The node's rank that is used to select shards when routing requests.

### `indexing_pressure`

The `indexing_pressure` object contains the indexing pressure statistics and has the following properties.

Field | Field type | Description
:--- | :--- | :---
memory | Object | Statistics related to memory consumption for the indexing load.
memory.current | Object | Statistics related to memory consumption for the current indexing load.
memory.current.combined_coordinating_and_primary_in_bytes | Integer | The total memory used by indexing requests in the coordinating or primary stages, in bytes. A node can reuse the coordinating memory if the primary stage is run locally, so the total memory does not necessarily equal the sum of the coordinating and primary stage memory usage.
memory.current.coordinating_in_bytes | Integer | The total memory consumed by indexing requests in the coordinating stage, in bytes.
memory.current.primary_in_bytes | Integer | The total memory consumed by indexing requests in the primary stage, in bytes.
memory.current.replica_in_bytes | Integer | The total memory consumed by indexing requests in the replica stage, in bytes.
memory.current.all_in_bytes | Integer | The total memory consumed by indexing requests in the coordinating, primary, or replica stages.

### `shard_indexing_pressure`

The `shard_indexing_pressure` object contains the [shard indexing pressure]({{site.url}}{{site.baseurl}}/opensearch/shard-indexing-backpressure) statistics and has the following properties.

Field | Field type | Description
:--- | :--- | :---
[stats]({{site.url}}{{site.baseurl}}/opensearch/stats-api/) | Object | Statistics about shard indexing pressure.
total_rejections_breakup_shadow_mode | Object | If running in shadow mode, the `total_rejections_breakup_shadow_mode` object contains statistics about the request rejection criteria of all shards in the node.
total_rejections_breakup_shadow_mode.node_limits | Integer | The total number of rejections due to the node memory limit. When all shards reach the memory limit assigned to the node (for example, 10% of heap size), the shard is unable to take in more traffic on the node, and the indexing request is rejected.
total_rejections_breakup_shadow_mode.no_successful_request_limits | Integer | The total number of rejections when the node occupancy level is breaching its soft limit and the shard has multiple outstanding requests that are waiting to be executed. In this case, additional indexing requests are rejected until the system recovers.
total_rejections_breakup_shadow_mode.throughput_degradation_limits | Integer | The total number of rejections when the node occupancy level is breaching its soft limit and there is a constant deterioration in the request turnaround at the shard level. In this case, additional indexing requests are rejected until the system recovers.
enabled | Boolean | Specifies whether the shard indexing pressure feature is turned on for the node.
enforced | Boolean | If true, the shard indexing pressure runs in enforced mode (there are rejections). If false, the shard indexing pressure runs in shadow mode (there are no rejections, but statistics are recorded and can be retrieved in the `total_rejections_breakup_shadow_mode` object). Only applicable if shard indexing pressure is enabled. 

### `cluster_manager_throttling`

The `cluster_manager_throttling` object contains statistics about throttled tasks on the cluster manager node. It is populated only for the node that is currently elected as the cluster manager.  

Field | Field type | Description
:--- | :--- | :---
stats | Object | Statistics about throttled tasks on the cluster manager node.
stats.total_throttled_tasks | Long | The total number of throttled tasks.
stats.throttled_tasks_per_task_type | Object | A breakdown of statistics by individual task type, specified as key-value pairs. The keys are individual task types, and their values represent the number of requests that were throttled.

### `weighted_routing`

The `weighted_routing` object contains statistics about weighted round robin requests. Specifically, it contains a counter of times this node has server a request while it was "zoned out".

Field | Field type | Description
:--- |:-----------| :---
stats | Object | Statistics about weighted routing.
fail_open_count | Integer | Number of times a shard on this node has served a request while the routing weight for the node was set to zero.

### `resource_usage_stats`

The `resource_usage_stats` object contains the resource usage statistics. Each entry is specified by the node ID and has the following properties.

Field | Field type | Description
:--- |:-----------| :---
timestamp | Integer    | The last refresh time for the resource usage statistics, in milliseconds since the epoch.
cpu_utilization_percent | Float      | Statistics for the average CPU usage of any OpenSearch processes within the time period configured in the `node.resource.tracker.global_cpu_usage.window_duration` setting.
memory_utilization_percent | Float      | The node JVM memory usage statistics within the time period configured in the `node.resource.tracker.global_jvmmp.window_duration` setting.
max_io_utilization_percent  | Float     |  (Linux only) Statistics for the average IO usage of any OpenSearch processes within the time period configured in the `node.resource.tracker.global_io_usage.window_duration` setting.

### `admission_control`

The `admission_control` object contains the rejection count of search and indexing requests based on resource consumption and has the following properties.

Field | Field type | Description
:--- | :--- | :---
admission_control.global_cpu_usage.transport.rejection_count.search | Integer | The total number of search rejections in the transport layer when the node CPU usage limit was met. In this case, additional search requests are rejected until the system recovers. The CPU usage limit is configured in the `admission_control.search.cpu_usage.limit` setting.
admission_control.global_cpu_usage.transport.rejection_count.indexing | Integer | The total number of indexing rejections in the transport layer when the node CPU usage limit was met. Any additional indexing requests are rejected until the system recovers. The CPU usage limit is configured in the `admission_control.indexing.cpu_usage.limit` setting.
admission_control.global_io_usage.transport.rejection_count.search | Integer | The total number of search rejections in the transport layer when the node IO usage limit was met. Any additional search requests are rejected until the system recovers. The CPU usage limit is configured in the `admission_control.search.io_usage.limit` setting (Linux only).
admission_control.global_io_usage.transport.rejection_count.indexing | Integer | The total number of indexing rejections in the transport layer when the node IO usage limit was met. Any additional indexing requests are rejected until the system recovers. The IO usage limit is configured in the `admission_control.indexing.io_usage.limit` setting (Linux only).

### `caches`

Because this API supports the experimental [tiered caching feature]({{site.url}}{{site.baseurl}}/search-plugins/caching/tiered-cache/), the responses found in this section may change. If the tiered caching feature flag is not enabled, the API will return `0` for all values.
{: .warning}

The `caches` object contains cache statistics, such as the `request_cache` statistics. The total values within each sub-metric are always returned, regardless of the value of the query parameter `level`. 

Field | Field type | Description
:--- | :--- | :---
request_cache | Object | Statistics for the request cache. 
request_cache.size_in_bytes | Integer | The total size, in bytes, of the request cache. 
request_cache.evictions | Integer | The total number of evictions from the request cache. 
request_cache.hit_count | Integer | The total hit count for the request cache.
request_cache.miss_count | Integer | The total miss count for the request cache.
request_cache.item_count | Integer | The total number of items in the request cache.
request_cache.store_name | String | The name of the store type used by the request cache. See [tiered cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/tiered-cache/) for more information. 

If the `level` query parameter is set to one of its valid values, `indices`, `shard`, or `tier`, additional fields will be present in `caches.request_cache` that categorize the values by these levels. 
For example, if `level=indices,tier`, the tiered cache is in use, and the node has indexes named `index0` and `index1`, then the `caches` object will contain the same five metrics for each combination of level values, as shown in the following table.

Field | Field type | Description
:--- | :--- | :---
request_cache.indices.index0.tier.on_heap | Object | Contains the five metrics for `index0` on the heap tier. 
request_cache.indices.index0.tier.disk | Object | Contains the five metrics for `index0` on the disk tier. 
request_cache.indices.index1.tier.on_heap | Object | Contains the five metrics for `index1` on the heap tier. 
request_cache.indices.index1.tier.disk | Object | Contains the five metrics for `index1` on the disk tier. 

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/nodes/stats`.
