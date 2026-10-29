---
layout: default
title: Index stats
parent: Index operations
grand_parent: Index APIs
nav_order: 120
---

# Index Stats API 
**Introduced 1.0**
{: .label .label-purple }

The Index Stats API provides index statistics. For data streams, the API provides statistics for the stream's backing indexes. By default, the returned statistics are index level. To receive shard-level statistics, set the `level` parameter to `shards`.

When a shard moves to a different node, the shard-level statistics for the shard are cleared. Although the shard is no longer part of the node, the node preserves any node-level statistics to which the shard contributed.
{: .note}

<!-- spec_insert_start
api: indices.stats
component: endpoints
-->
## Endpoints
```json
GET /_stats
GET /{index}/_stats
GET /_stats/{metric}
GET /{index}/_stats/{metric}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | A comma-separated list of indexes, data streams, or index aliases used to filter results. Supports wildcard expressions. To retrieve statistics for all indexes, use `_all` or `*` or omit this parameter. |
| `metric` | String | A comma-separated list of metric groups to include in the response. For valid values, see [Metrics](#metrics). Defaults to all metrics. |

### Metrics

The following table lists all available metric groups.

Metric | Description
:--- |:----
`_all` | Return all statistics. Cannot be combined with other metrics.
`completion` | Completion suggester statistics. 
`docs` | Returns the number of documents and the number of deleted documents that have not yet been merged. Index refresh operations can affect this statistic. 
`fielddata` | Field data statistics. 
`flush` | Flush statistics. 
`get` | Get statistics, including missing stats. 
`indexing` | Indexing statistics. 
`merge` | Merge statistics. 
`query_cache` | Query cache statistics. 
`recovery` | Recovery statistics, including the number of ongoing recoveries in which the shard acts as a source (`current_as_source`) or a target (`current_as_target`) and the recovery throttle time (`throttle_time_in_millis`).
`refresh` | Refresh statistics. 
`request_cache` | Shard request cache statistics. 
`search` | Search statistics, including suggest operation statistics. Search operations can be associated with one or more groups. To include statistics for custom groups, provide a comma-separated list of group names in the `groups` query parameter. To return statistics for all groups, use `_all`. If `groups` is set, the `search` object contains a `groups` object with statistics for each group.
`segments` | Statistics about memory use of all open segments. If the `include_segment_file_sizes` parameter is `true`, this metric includes the aggregated disk usage of each Lucene index file.
`store` | Size of the index in byte units. 
`translog` | Translog statistics. 
`warmer` | Warmer statistics. 

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description 
:--- | :--- | :--- 
`expand_wildcards` | String | Specifies the type of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Expand to all open and closed indexes, including hidden indexes. <br> - `open`: Expand to open indexes. <br> - `closed`: Expand to closed indexes. <br> - `hidden`: Include hidden indexes when expanding. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. <br> Default is `open`.
`fields` | String | A comma-separated list or a wildcard expression specifying fields to include in the statistics. Specifies the default field list if neither `completion_fields` nor `fielddata_fields` is provided.
`completion_fields` | String | A comma-separated list or wildcard expression specifying fields to include in field-level `completion` statistics.
`fielddata_fields` | String | A comma-separated list or wildcard expression specifying fields to include in field-level `fielddata` statistics.
`forbid_closed_indices` | Boolean | If `true`, requests that target a closed index or expand wildcards to closed indexes return an error. Set to `false` to return statistics for closed indexes. Default is `true`.
`groups` | String | A comma-separated list of search groups to include in the `search` statistics. Search groups are custom labels assigned to search requests using the `stats` parameter of the [Search API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#search-stats-groups). Use `_all` to return statistics for all groups.
`level` | String | Specifies the level used to aggregate statistics. Valid values are: <br> - `cluster`: Cluster-level statistics. <br> - `indices`: Index-level statistics. <br> - `shards`: Shard-level statistics. <br> Default is `indices`.
`include_segment_file_sizes` | Boolean | Specifies whether to report the aggregated disk usage of each Lucene index file. Only applies to `segments` statistics. Default is `false`.
`include_unloaded_segments` | Boolean | Specifies whether to include segment statistics for closed indexes, whose segments are not loaded into memory. Applies only if `forbid_closed_indices` is `false`. Default is `false`.
`ignore_unavailable` | Boolean | If `true`, missing or closed indexes are omitted from the response. If `false`, the request returns an error if it targets a missing or closed index. Default is `false`.
`allow_no_indices` | Boolean | If `false`, the request returns an error if any wildcard expression, index alias, or `_all` value doesn't match any indexes. Default is `true`.
`timeout` | Time | The amount of time to wait for a response from each node. Default is `30s`.

## Example requests

The following example requests show how to use the Index Stats API.

### One index

The following example returns index stats for a single index:

<!-- spec_insert_start
component: example_code
rest: GET /testindex/_stats
-->
{% capture step1_rest %}
GET /testindex/_stats
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  index = "testindex"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Comma-separated list of indexes

The following example returns stats for multiple indexes:

<!-- spec_insert_start
component: example_code
rest: GET /testindex1,testindex2/_stats
-->
{% capture step1_rest %}
GET /testindex1,testindex2/_stats
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  index = "testindex1,testindex2"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Wildcard expression

The following example returns statistics for any index whose name starts with `testindex`:

<!-- spec_insert_start
component: example_code
rest: GET /testindex*/_stats
-->
{% capture step1_rest %}
GET /testindex*/_stats
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  index = "testindex*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Specific stats

The following example returns index stats related to refresh and flush operations:

<!-- spec_insert_start
component: example_code
rest: GET /testindex/_stats/refresh,flush
-->
{% capture step1_rest %}
GET /testindex/_stats/refresh,flush
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  metric = "refresh,flush",
  index = "testindex"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Expand wildcards

The following example returns statistics for all open indexes whose names start with `testindex`, including hidden indexes:

<!-- spec_insert_start
component: example_code
rest: GET /testindex*/_stats?expand_wildcards=open,hidden
-->
{% capture step1_rest %}
GET /testindex*/_stats?expand_wildcards=open,hidden
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  index = "testindex*",
  params = { "expand_wildcards": "open,hidden" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Shard-level statistics

The following example returns shard level stats about a test index:

<!-- spec_insert_start
component: example_code
rest: GET /testindex/_stats?level=shards
-->
{% capture step1_rest %}
GET /testindex/_stats?level=shards
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  index = "testindex",
  params = { "level": "shards" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Specific search groups

The following example returns search statistics for the `group1` and `group2` search groups:

<!-- spec_insert_start
component: example_code
rest: GET /_stats/search?groups=group1,group2
-->
{% capture step1_rest %}
GET /_stats/search?groups=group1,group2
{% endcapture %}

{% capture step1_python %}


response = client.indices.stats(
  metric = "search",
  params = { "groups": "group1,group2" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

By default, the returned statistics are split into two groups: `primaries` and `total`. The `primaries` group contains values computed for primary shards only, while the `total` group contains accumulated values across both primary and replica shards. The following is an example Index Stats API response: 

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_all": {
    "primaries": {
      "docs": {
        "count": 4,
        "deleted": 0
      },
      "store": {
        "size_in_bytes": 5172,
        "reserved_in_bytes": 0
      },
      "indexing": {
        "index_total": 4,
        "index_time_in_millis": 1,
        "index_current": 0,
        "index_failed": 0,
        "delete_total": 0,
        "delete_time_in_millis": 0,
        "delete_current": 0,
        "noop_update_total": 0,
        "is_throttled": false,
        "throttle_time_in_millis": 0,
        "max_last_index_request_timestamp": 1792186272652
      },
      "get": {
        "total": 2,
        "getTime": "0s",
        "time_in_millis": 0,
        "exists_total": 1,
        "exists_time_in_millis": 0,
        "missing_total": 1,
        "missing_time_in_millis": 0,
        "current": 0
      },
      "search": {
        "open_contexts": 0,
        "query_total": 3,
        "query_time_in_millis": 2,
        "query_current": 0,
        "query_failed": 0,
        "concurrent_query_total": 0,
        "concurrent_query_time_in_millis": 0,
        "concurrent_query_current": 0,
        "concurrent_avg_slice_count": 0.0,
        "startree_query_total": 0,
        "startree_query_time_in_millis": 0,
        "startree_query_current": 0,
        "startree_query_failed": 0,
        "fetch_total": 3,
        "fetch_time_in_millis": 0,
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
        "search_idle_reactivate_count_total": 0
      },
      "merges": {
        "current": 0,
        "current_docs": 0,
        "current_size_in_bytes": 0,
        "total": 0,
        "total_time_in_millis": 0,
        "total_docs": 0,
        "total_size_in_bytes": 0,
        "total_stopped_time_in_millis": 0,
        "total_throttled_time_in_millis": 0,
        "total_auto_throttle_in_bytes": 20971520,
        "unreferenced_file_cleanups_performed": 0,
        "warmer": {
          "total_invocations_count": 0,
          "total_time_millis": 0,
          "total_failure_count": 0,
          "total_bytes_sent": 0,
          "total_bytes_received": 0,
          "total_send_time_millis": 0,
          "total_receive_time_millis": 0,
          "ongoing_count": 0
        }
      },
      "refresh": {
        "total": 3,
        "total_time_in_millis": 13,
        "external_total": 3,
        "external_total_time_in_millis": 13,
        "listeners": 0
      },
      "flush": {
        "total": 0,
        "periodic": 0,
        "total_time_in_millis": 0
      },
      "warmer": {
        "current": 0,
        "total": 2,
        "total_time_in_millis": 0
      },
      "query_cache": {
        "memory_size_in_bytes": 0,
        "total_count": 0,
        "hit_count": 0,
        "miss_count": 0,
        "cache_size": 0,
        "cache_count": 0,
        "evictions": 0
      },
      "fielddata": {
        "memory_size_in_bytes": 0,
        "evictions": 0
      },
      "completion": {
        "size_in_bytes": 0
      },
      "segments": {
        "count": 1,
        "memory_in_bytes": 0,
        "terms_memory_in_bytes": 0,
        "stored_fields_memory_in_bytes": 0,
        "term_vectors_memory_in_bytes": 0,
        "norms_memory_in_bytes": 0,
        "points_memory_in_bytes": 0,
        "doc_values_memory_in_bytes": 0,
        "index_writer_memory_in_bytes": 0,
        "version_map_memory_in_bytes": 0,
        "fixed_bit_set_memory_in_bytes": 0,
        "max_unsafe_auto_id_timestamp": -1,
        "remote_store": {
          "upload": {
            "total_upload_size": {
              "started_bytes": 0,
              "succeeded_bytes": 0,
              "failed_bytes": 0
            },
            "refresh_size_lag": {
              "total_bytes": 0,
              "max_bytes": 0
            },
            "max_refresh_time_lag_in_millis": 0,
            "total_time_spent_in_millis": 0,
            "pressure": {
              "total_rejections": 0
            }
          },
          "download": {
            "total_download_size": {
              "started_bytes": 0,
              "succeeded_bytes": 0,
              "failed_bytes": 0
            },
            "total_time_spent_in_millis": 0
          }
        },
        "segment_replication": {
          "max_bytes_behind": 0,
          "total_bytes_behind": 0,
          "max_replication_lag": 0
        },
        "file_sizes": {}
      },
      "translog": {
        "operations": 4,
        "size_in_bytes": 363,
        "uncommitted_operations": 4,
        "uncommitted_size_in_bytes": 363,
        "earliest_last_modified_age": 300,
        "remote_store": {
          "upload": {
            "total_uploads": {
              "started": 0,
              "failed": 0,
              "succeeded": 0
            },
            "total_upload_size": {
              "started_bytes": 0,
              "failed_bytes": 0,
              "succeeded_bytes": 0
            }
          }
        }
      },
      "request_cache": {
        "memory_size_in_bytes": 0,
        "evictions": 0,
        "hit_count": 0,
        "miss_count": 0
      },
      "recovery": {
        "current_as_source": 0,
        "current_as_target": 0,
        "throttle_time_in_millis": 0
      }
    },
    "total": {
      "docs": {
        "count": 4,
        "deleted": 0
      },
      "store": {
        "size_in_bytes": 5172,
        "reserved_in_bytes": 0
      },
      "indexing": {
        "index_total": 4,
        "index_time_in_millis": 1,
        "index_current": 0,
        "index_failed": 0,
        "delete_total": 0,
        "delete_time_in_millis": 0,
        "delete_current": 0,
        "noop_update_total": 0,
        "is_throttled": false,
        "throttle_time_in_millis": 0,
        "max_last_index_request_timestamp": 1792186272652
      },
      "get": {
        "total": 2,
        "getTime": "0s",
        "time_in_millis": 0,
        "exists_total": 1,
        "exists_time_in_millis": 0,
        "missing_total": 1,
        "missing_time_in_millis": 0,
        "current": 0
      },
      "search": {
        "open_contexts": 0,
        "query_total": 3,
        "query_time_in_millis": 2,
        "query_current": 0,
        "query_failed": 0,
        "concurrent_query_total": 0,
        "concurrent_query_time_in_millis": 0,
        "concurrent_query_current": 0,
        "concurrent_avg_slice_count": 0.0,
        "startree_query_total": 0,
        "startree_query_time_in_millis": 0,
        "startree_query_current": 0,
        "startree_query_failed": 0,
        "fetch_total": 3,
        "fetch_time_in_millis": 0,
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
        "search_idle_reactivate_count_total": 0
      },
      "merges": {
        "current": 0,
        "current_docs": 0,
        "current_size_in_bytes": 0,
        "total": 0,
        "total_time_in_millis": 0,
        "total_docs": 0,
        "total_size_in_bytes": 0,
        "total_stopped_time_in_millis": 0,
        "total_throttled_time_in_millis": 0,
        "total_auto_throttle_in_bytes": 20971520,
        "unreferenced_file_cleanups_performed": 0,
        "warmer": {
          "total_invocations_count": 0,
          "total_time_millis": 0,
          "total_failure_count": 0,
          "total_bytes_sent": 0,
          "total_bytes_received": 0,
          "total_send_time_millis": 0,
          "total_receive_time_millis": 0,
          "ongoing_count": 0
        }
      },
      "refresh": {
        "total": 3,
        "total_time_in_millis": 13,
        "external_total": 3,
        "external_total_time_in_millis": 13,
        "listeners": 0
      },
      "flush": {
        "total": 0,
        "periodic": 0,
        "total_time_in_millis": 0
      },
      "warmer": {
        "current": 0,
        "total": 2,
        "total_time_in_millis": 0
      },
      "query_cache": {
        "memory_size_in_bytes": 0,
        "total_count": 0,
        "hit_count": 0,
        "miss_count": 0,
        "cache_size": 0,
        "cache_count": 0,
        "evictions": 0
      },
      "fielddata": {
        "memory_size_in_bytes": 0,
        "evictions": 0
      },
      "completion": {
        "size_in_bytes": 0
      },
      "segments": {
        "count": 1,
        "memory_in_bytes": 0,
        "terms_memory_in_bytes": 0,
        "stored_fields_memory_in_bytes": 0,
        "term_vectors_memory_in_bytes": 0,
        "norms_memory_in_bytes": 0,
        "points_memory_in_bytes": 0,
        "doc_values_memory_in_bytes": 0,
        "index_writer_memory_in_bytes": 0,
        "version_map_memory_in_bytes": 0,
        "fixed_bit_set_memory_in_bytes": 0,
        "max_unsafe_auto_id_timestamp": -1,
        "remote_store": {
          "upload": {
            "total_upload_size": {
              "started_bytes": 0,
              "succeeded_bytes": 0,
              "failed_bytes": 0
            },
            "refresh_size_lag": {
              "total_bytes": 0,
              "max_bytes": 0
            },
            "max_refresh_time_lag_in_millis": 0,
            "total_time_spent_in_millis": 0,
            "pressure": {
              "total_rejections": 0
            }
          },
          "download": {
            "total_download_size": {
              "started_bytes": 0,
              "succeeded_bytes": 0,
              "failed_bytes": 0
            },
            "total_time_spent_in_millis": 0
          }
        },
        "segment_replication": {
          "max_bytes_behind": 0,
          "total_bytes_behind": 0,
          "max_replication_lag": 0
        },
        "file_sizes": {}
      },
      "translog": {
        "operations": 4,
        "size_in_bytes": 363,
        "uncommitted_operations": 4,
        "uncommitted_size_in_bytes": 363,
        "earliest_last_modified_age": 300,
        "remote_store": {
          "upload": {
            "total_uploads": {
              "started": 0,
              "failed": 0,
              "succeeded": 0
            },
            "total_upload_size": {
              "started_bytes": 0,
              "failed_bytes": 0,
              "succeeded_bytes": 0
            }
          }
        }
      },
      "request_cache": {
        "memory_size_in_bytes": 0,
        "evictions": 0,
        "hit_count": 0,
        "miss_count": 0
      },
      "recovery": {
        "current_as_source": 0,
        "current_as_target": 0,
        "throttle_time_in_millis": 0
      }
    }
  },
  "indices": {
    "testindex": {
      "uuid": "fnaTkGq4QIqB__mdUzGqiw",
      "primaries": {
        "docs": {
          "count": 4,
          "deleted": 0
        },
        "store": {
          "size_in_bytes": 5172,
          "reserved_in_bytes": 0
        },
        "indexing": {
          "index_total": 4,
          "index_time_in_millis": 1,
          "index_current": 0,
          "index_failed": 0,
          "delete_total": 0,
          "delete_time_in_millis": 0,
          "delete_current": 0,
          "noop_update_total": 0,
          "is_throttled": false,
          "throttle_time_in_millis": 0,
          "max_last_index_request_timestamp": 1792186272652
        },
        "get": {
          "total": 2,
          "getTime": "0s",
          "time_in_millis": 0,
          "exists_total": 1,
          "exists_time_in_millis": 0,
          "missing_total": 1,
          "missing_time_in_millis": 0,
          "current": 0
        },
        "search": {
          "open_contexts": 0,
          "query_total": 3,
          "query_time_in_millis": 2,
          "query_current": 0,
          "query_failed": 0,
          "concurrent_query_total": 0,
          "concurrent_query_time_in_millis": 0,
          "concurrent_query_current": 0,
          "concurrent_avg_slice_count": 0.0,
          "startree_query_total": 0,
          "startree_query_time_in_millis": 0,
          "startree_query_current": 0,
          "startree_query_failed": 0,
          "fetch_total": 3,
          "fetch_time_in_millis": 0,
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
          "search_idle_reactivate_count_total": 0
        },
        "merges": {
          "current": 0,
          "current_docs": 0,
          "current_size_in_bytes": 0,
          "total": 0,
          "total_time_in_millis": 0,
          "total_docs": 0,
          "total_size_in_bytes": 0,
          "total_stopped_time_in_millis": 0,
          "total_throttled_time_in_millis": 0,
          "total_auto_throttle_in_bytes": 20971520,
          "unreferenced_file_cleanups_performed": 0,
          "warmer": {
            "total_invocations_count": 0,
            "total_time_millis": 0,
            "total_failure_count": 0,
            "total_bytes_sent": 0,
            "total_bytes_received": 0,
            "total_send_time_millis": 0,
            "total_receive_time_millis": 0,
            "ongoing_count": 0
          }
        },
        "refresh": {
          "total": 3,
          "total_time_in_millis": 13,
          "external_total": 3,
          "external_total_time_in_millis": 13,
          "listeners": 0
        },
        "flush": {
          "total": 0,
          "periodic": 0,
          "total_time_in_millis": 0
        },
        "warmer": {
          "current": 0,
          "total": 2,
          "total_time_in_millis": 0
        },
        "query_cache": {
          "memory_size_in_bytes": 0,
          "total_count": 0,
          "hit_count": 0,
          "miss_count": 0,
          "cache_size": 0,
          "cache_count": 0,
          "evictions": 0
        },
        "fielddata": {
          "memory_size_in_bytes": 0,
          "evictions": 0
        },
        "completion": {
          "size_in_bytes": 0
        },
        "segments": {
          "count": 1,
          "memory_in_bytes": 0,
          "terms_memory_in_bytes": 0,
          "stored_fields_memory_in_bytes": 0,
          "term_vectors_memory_in_bytes": 0,
          "norms_memory_in_bytes": 0,
          "points_memory_in_bytes": 0,
          "doc_values_memory_in_bytes": 0,
          "index_writer_memory_in_bytes": 0,
          "version_map_memory_in_bytes": 0,
          "fixed_bit_set_memory_in_bytes": 0,
          "max_unsafe_auto_id_timestamp": -1,
          "remote_store": {
            "upload": {
              "total_upload_size": {
                "started_bytes": 0,
                "succeeded_bytes": 0,
                "failed_bytes": 0
              },
              "refresh_size_lag": {
                "total_bytes": 0,
                "max_bytes": 0
              },
              "max_refresh_time_lag_in_millis": 0,
              "total_time_spent_in_millis": 0,
              "pressure": {
                "total_rejections": 0
              }
            },
            "download": {
              "total_download_size": {
                "started_bytes": 0,
                "succeeded_bytes": 0,
                "failed_bytes": 0
              },
              "total_time_spent_in_millis": 0
            }
          },
          "segment_replication": {
            "max_bytes_behind": 0,
            "total_bytes_behind": 0,
            "max_replication_lag": 0
          },
          "file_sizes": {}
        },
        "translog": {
          "operations": 4,
          "size_in_bytes": 363,
          "uncommitted_operations": 4,
          "uncommitted_size_in_bytes": 363,
          "earliest_last_modified_age": 300,
          "remote_store": {
            "upload": {
              "total_uploads": {
                "started": 0,
                "failed": 0,
                "succeeded": 0
              },
              "total_upload_size": {
                "started_bytes": 0,
                "failed_bytes": 0,
                "succeeded_bytes": 0
              }
            }
          }
        },
        "request_cache": {
          "memory_size_in_bytes": 0,
          "evictions": 0,
          "hit_count": 0,
          "miss_count": 0
        },
        "recovery": {
          "current_as_source": 0,
          "current_as_target": 0,
          "throttle_time_in_millis": 0
        }
      },
      "total": {
        "docs": {
          "count": 4,
          "deleted": 0
        },
        "store": {
          "size_in_bytes": 5172,
          "reserved_in_bytes": 0
        },
        "indexing": {
          "index_total": 4,
          "index_time_in_millis": 1,
          "index_current": 0,
          "index_failed": 0,
          "delete_total": 0,
          "delete_time_in_millis": 0,
          "delete_current": 0,
          "noop_update_total": 0,
          "is_throttled": false,
          "throttle_time_in_millis": 0,
          "max_last_index_request_timestamp": 1792186272652
        },
        "get": {
          "total": 2,
          "getTime": "0s",
          "time_in_millis": 0,
          "exists_total": 1,
          "exists_time_in_millis": 0,
          "missing_total": 1,
          "missing_time_in_millis": 0,
          "current": 0
        },
        "search": {
          "open_contexts": 0,
          "query_total": 3,
          "query_time_in_millis": 2,
          "query_current": 0,
          "query_failed": 0,
          "concurrent_query_total": 0,
          "concurrent_query_time_in_millis": 0,
          "concurrent_query_current": 0,
          "concurrent_avg_slice_count": 0.0,
          "startree_query_total": 0,
          "startree_query_time_in_millis": 0,
          "startree_query_current": 0,
          "startree_query_failed": 0,
          "fetch_total": 3,
          "fetch_time_in_millis": 0,
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
          "search_idle_reactivate_count_total": 0
        },
        "merges": {
          "current": 0,
          "current_docs": 0,
          "current_size_in_bytes": 0,
          "total": 0,
          "total_time_in_millis": 0,
          "total_docs": 0,
          "total_size_in_bytes": 0,
          "total_stopped_time_in_millis": 0,
          "total_throttled_time_in_millis": 0,
          "total_auto_throttle_in_bytes": 20971520,
          "unreferenced_file_cleanups_performed": 0,
          "warmer": {
            "total_invocations_count": 0,
            "total_time_millis": 0,
            "total_failure_count": 0,
            "total_bytes_sent": 0,
            "total_bytes_received": 0,
            "total_send_time_millis": 0,
            "total_receive_time_millis": 0,
            "ongoing_count": 0
          }
        },
        "refresh": {
          "total": 3,
          "total_time_in_millis": 13,
          "external_total": 3,
          "external_total_time_in_millis": 13,
          "listeners": 0
        },
        "flush": {
          "total": 0,
          "periodic": 0,
          "total_time_in_millis": 0
        },
        "warmer": {
          "current": 0,
          "total": 2,
          "total_time_in_millis": 0
        },
        "query_cache": {
          "memory_size_in_bytes": 0,
          "total_count": 0,
          "hit_count": 0,
          "miss_count": 0,
          "cache_size": 0,
          "cache_count": 0,
          "evictions": 0
        },
        "fielddata": {
          "memory_size_in_bytes": 0,
          "evictions": 0
        },
        "completion": {
          "size_in_bytes": 0
        },
        "segments": {
          "count": 1,
          "memory_in_bytes": 0,
          "terms_memory_in_bytes": 0,
          "stored_fields_memory_in_bytes": 0,
          "term_vectors_memory_in_bytes": 0,
          "norms_memory_in_bytes": 0,
          "points_memory_in_bytes": 0,
          "doc_values_memory_in_bytes": 0,
          "index_writer_memory_in_bytes": 0,
          "version_map_memory_in_bytes": 0,
          "fixed_bit_set_memory_in_bytes": 0,
          "max_unsafe_auto_id_timestamp": -1,
          "remote_store": {
            "upload": {
              "total_upload_size": {
                "started_bytes": 0,
                "succeeded_bytes": 0,
                "failed_bytes": 0
              },
              "refresh_size_lag": {
                "total_bytes": 0,
                "max_bytes": 0
              },
              "max_refresh_time_lag_in_millis": 0,
              "total_time_spent_in_millis": 0,
              "pressure": {
                "total_rejections": 0
              }
            },
            "download": {
              "total_download_size": {
                "started_bytes": 0,
                "succeeded_bytes": 0,
                "failed_bytes": 0
              },
              "total_time_spent_in_millis": 0
            }
          },
          "segment_replication": {
            "max_bytes_behind": 0,
            "total_bytes_behind": 0,
            "max_replication_lag": 0
          },
          "file_sizes": {}
        },
        "translog": {
          "operations": 4,
          "size_in_bytes": 363,
          "uncommitted_operations": 4,
          "uncommitted_size_in_bytes": 363,
          "earliest_last_modified_age": 300,
          "remote_store": {
            "upload": {
              "total_uploads": {
                "started": 0,
                "failed": 0,
                "succeeded": 0
              },
              "total_upload_size": {
                "started_bytes": 0,
                "failed_bytes": 0,
                "succeeded_bytes": 0
              }
            }
          }
        },
        "request_cache": {
          "memory_size_in_bytes": 0,
          "evictions": 0,
          "hit_count": 0,
          "miss_count": 0
        },
        "recovery": {
          "current_as_source": 0,
          "current_as_target": 0,
          "throttle_time_in_millis": 0
        }
      }
    }
  }
}
```
</details>

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_shards` | Object | Contains the `total`, `successful`, and `failed` shard counts for the request. |
| `_all` | Object | Statistics aggregated across all indexes that match the request. |
| `indices` | Object | Statistics for each index that matches the request, keyed by index name. Not returned if `level` is `cluster`. |

The `_all` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `primaries` | Object | Statistics computed for primary shards only. |
| `total` | Object | Statistics accumulated across primary and replica shards. |

Each object in `indices` contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `uuid` | String | The universally unique identifier (UUID) of the index. |
| `primaries` | Object | Statistics for the index computed for primary shards only. |
| `total` | Object | Statistics for the index accumulated across primary and replica shards. |
| `shards` | Object | Statistics for each shard of the index, keyed by shard number. Each key contains an array of shard copy objects. Returned only if `level` is `shards`. |

Each shard copy object in `shards` contains the statistic groups for that shard copy and the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `routing` | Object | Routing information for the shard copy. |
| `commit` | Object | Information about the last Lucene commit for the shard copy. |
| `seq_no` | Object | Sequence number information for the shard copy. |
| `retention_leases` | Object | The retention leases for the shard copy. |
| `shard_path` | Object | The file system paths for the shard copy. |

The `routing` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `state` | String | The state of the shard copy, such as `STARTED` or `RELOCATING`. |
| `primary` | Boolean | Whether the shard copy is a primary shard. |
| `node` | String | The ID of the node that holds the shard copy. |
| `relocating_node` | String | The ID of the node to which the shard copy is relocating, or `null` if the shard copy is not relocating. |

The `commit` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The ID of the commit. |
| `generation` | Integer | The generation number of the commit. |
| `user_data` | Object | Metadata stored with the commit, such as the translog UUID and the local checkpoint at the time of the commit. |
| `num_docs` | Integer | The number of documents in the commit. |

The `seq_no` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `max_seq_no` | Integer | The highest sequence number issued for the shard copy. |
| `local_checkpoint` | Integer | The highest sequence number for which the shard copy has processed all operations. |
| `global_checkpoint` | Integer | The highest sequence number that all active shard copies have processed. |

The `retention_leases` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `primary_term` | Integer | The primary term of the shard. |
| `version` | Integer | The version of the retention lease collection. |
| `leases` | Array of objects | The retention leases. Each lease contains the `id`, `retaining_seq_no`, `timestamp`, and `source` fields. |

The `shard_path` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `state_path` | String | The path to the node data directory that stores the shard state. |
| `data_path` | String | The path to the node data directory that stores the shard data. |
| `is_custom_data_path` | Boolean | Whether the index uses a custom data path. |

For information about the fields in each statistic group, such as `docs`, `indexing`, and `search`, see [Nodes Stats API response fields]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/#indices).

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:monitor/stats`.
