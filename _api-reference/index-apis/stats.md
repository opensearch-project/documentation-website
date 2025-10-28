---
layout: default
title: Stats
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

## Endpoints

```json
GET /_stats
GET /_stats/<metric>
GET /<index_ids>/_stats
GET /<index_ids>/_stats/<metric>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<index_ids>` | String | A comma-separated list of indexes, data streams, or index aliases used to filter results. Supports wildcard expressions. Defaults to `_all` (`*`).
`<metric>` | String | A comma-separated list of metric groups that will be included in the response. For valid values, see [Metrics](#metrics). Defaults to all metrics. |

### Metrics

The following table lists all available metric groups.

Metric | Description
:--- |:----
`_all` | Return all statistics. 
`completion` | Completion suggester statistics. 
`docs` | Returns the number of documents and the number of deleted documents that have not yet been merged. Index refresh operations can affect this statistic. 
`fielddata` | Field data statistics. 
`flush` | Flush statistics. 
`get` | Get statistics, including missing stats. 
`indexing` | Indexing statistics. 
`merge` | Merge statistics. 
`query_cache` | Query cache statistics. 
`refresh` | Refresh statistics. 
`request_cache` | Shard request cache statistics. 
`search` | Search statistics, including suggest operation statistics. Search operations can be associated with one or more groups. You can include statistics for custom groups by providing a `groups` parameter, which accepts a comma-separated list of group names. To return statistics for all groups, use `_all`. 
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
`forbid_closed_indices` | Boolean | Specifies not to collect statistics for closed indexes. Default is `true`.
`groups` | String | A comma-separated list of search groups to include in the `search` statistics.
`level` | String | Specifies the level used to aggregate statistics. Valid values are: <br> - `cluster`: Cluster-level statistics. <br> - `indices`: Index-level statistics. <br> - `shards`: Shard-level statistics. <br> Default is `indices`.
`include_segment_file_sizes` | Boolean | Specifies whether to report the aggregated disk usage of each Lucene index file. Only applies to `segments` statistics. Default is `false`.
`include_unloaded_segments` | Boolean | Specifies whether to include information from segments that are not loaded into memory. Default is `false`.

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

The following example returns starts about any index that starts with `testindex`:

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

The following example returns index stats related to the index and flush operations:

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

The following example expands all wildcards related to index stats:

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

## Example response

By default, the returned statistics are aggregated in the `primaries` and `total` aggregations. The `primaries` aggregation contains statistics for the primary shards. The `total` aggregation contains statistics for both primary and replica shards. The following is an example Index Stats API response: 

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
        "size_in_bytes": 15531,
        "reserved_in_bytes": 0
      },
      "indexing": {
        "index_total": 4,
        "index_time_in_millis": 10,
        "index_current": 0,
        "index_failed": 0,
        "delete_total": 0,
        "delete_time_in_millis": 0,
        "delete_current": 0,
        "noop_update_total": 0,
        "is_throttled": false,
        "throttle_time_in_millis": 0
      },
      "get": {
        "total": 0,
        "time_in_millis": 0,
        "exists_total": 0,
        "exists_time_in_millis": 0,
        "missing_total": 0,
        "missing_time_in_millis": 0,
        "current": 0
      },
      "search": {
        "open_contexts": 0,
        "query_total": 12,
        "query_time_in_millis": 11,
        "query_current": 0,
        "fetch_total": 12,
        "fetch_time_in_millis": 5,
        "fetch_current": 0,
        "scroll_total": 0,
        "scroll_time_in_millis": 0,
        "scroll_current": 0,
        "point_in_time_total": 0,
        "point_in_time_time_in_millis": 0,
        "point_in_time_current": 0,
        "suggest_total": 0,
        "suggest_time_in_millis": 0,
        "suggest_current": 0
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
        "total_auto_throttle_in_bytes": 20971520
      },
      "refresh": {
        "total": 8,
        "total_time_in_millis": 58,
        "external_total": 7,
        "external_total_time_in_millis": 60,
        "listeners": 0
      },
      "flush": {
        "total": 1,
        "periodic": 1,
        "total_time_in_millis": 21
      },
      "warmer": {
        "current": 0,
        "total": 6,
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
        "evictions": 0,
        "item_count": 0
      },
      "completion": {
        "size_in_bytes": 0
      },
      "segments": {
        "count": 4,
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
        "file_sizes": {}
      },
      "translog": {
        "operations": 0,
        "size_in_bytes": 55,
        "uncommitted_operations": 0,
        "uncommitted_size_in_bytes": 55,
        "earliest_last_modified_age": 142622215,
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
        "size_in_bytes": 15531,
        "reserved_in_bytes": 0
      },
      "indexing": {
        "index_total": 4,
        "index_time_in_millis": 10,
        "index_current": 0,
        "index_failed": 0,
        "delete_total": 0,
        "delete_time_in_millis": 0,
        "delete_current": 0,
        "noop_update_total": 0,
        "is_throttled": false,
        "throttle_time_in_millis": 0
      },
      "get": {
        "total": 0,
        "time_in_millis": 0,
        "exists_total": 0,
        "exists_time_in_millis": 0,
        "missing_total": 0,
        "missing_time_in_millis": 0,
        "current": 0
      },
      "search": {
        "open_contexts": 0,
        "query_total": 12,
        "query_time_in_millis": 11,
        "query_current": 0,
        "fetch_total": 12,
        "fetch_time_in_millis": 5,
        "fetch_current": 0,
        "scroll_total": 0,
        "scroll_time_in_millis": 0,
        "scroll_current": 0,
        "point_in_time_total": 0,
        "point_in_time_time_in_millis": 0,
        "point_in_time_current": 0,
        "suggest_total": 0,
        "suggest_time_in_millis": 0,
        "suggest_current": 0
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
        "total_auto_throttle_in_bytes": 20971520
      },
      "refresh": {
        "total": 8,
        "total_time_in_millis": 58,
        "external_total": 7,
        "external_total_time_in_millis": 60,
        "listeners": 0
      },
      "flush": {
        "total": 1,
        "periodic": 1,
        "total_time_in_millis": 21
      },
      "warmer": {
        "current": 0,
        "total": 6,
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
        "evictions": 0,
        "item_count": 0
      },
      "completion": {
        "size_in_bytes": 0
      },
      "segments": {
        "count": 4,
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
        "file_sizes": {}
      },
      "translog": {
        "operations": 0,
        "size_in_bytes": 55,
        "uncommitted_operations": 0,
        "uncommitted_size_in_bytes": 55,
        "earliest_last_modified_age": 142622215,
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
      "uuid": "0SXXSpe9Rp-FpxXXWLOD8Q",
      "primaries": {
        "docs": {
          "count": 4,
          "deleted": 0
        },
        "store": {
          "size_in_bytes": 15531,
          "reserved_in_bytes": 0
        },
        "indexing": {
          "index_total": 4,
          "index_time_in_millis": 10,
          "index_current": 0,
          "index_failed": 0,
          "delete_total": 0,
          "delete_time_in_millis": 0,
          "delete_current": 0,
          "noop_update_total": 0,
          "is_throttled": false,
          "throttle_time_in_millis": 0
        },
        "get": {
          "total": 0,
          "time_in_millis": 0,
          "exists_total": 0,
          "exists_time_in_millis": 0,
          "missing_total": 0,
          "missing_time_in_millis": 0,
          "current": 0
        },
        "search": {
          "open_contexts": 0,
          "query_total": 12,
          "query_time_in_millis": 11,
          "query_current": 0,
          "fetch_total": 12,
          "fetch_time_in_millis": 5,
          "fetch_current": 0,
          "scroll_total": 0,
          "scroll_time_in_millis": 0,
          "scroll_current": 0,
          "point_in_time_total": 0,
          "point_in_time_time_in_millis": 0,
          "point_in_time_current": 0,
          "suggest_total": 0,
          "suggest_time_in_millis": 0,
          "suggest_current": 0
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
          "total_auto_throttle_in_bytes": 20971520
        },
        "refresh": {
          "total": 8,
          "total_time_in_millis": 58,
          "external_total": 7,
          "external_total_time_in_millis": 60,
          "listeners": 0
        },
        "flush": {
          "total": 1,
          "periodic": 1,
          "total_time_in_millis": 21
        },
        "warmer": {
          "current": 0,
          "total": 6,
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
          "evictions": 0,
          "item_count": 0
        },
        "completion": {
          "size_in_bytes": 0
        },
        "segments": {
          "count": 4,
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
          "file_sizes": {}
        },
        "translog": {
          "operations": 0,
          "size_in_bytes": 55,
          "uncommitted_operations": 0,
          "uncommitted_size_in_bytes": 55,
          "earliest_last_modified_age": 142622215,
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
          "size_in_bytes": 15531,
          "reserved_in_bytes": 0
        },
        "indexing": {
          "index_total": 4,
          "index_time_in_millis": 10,
          "index_current": 0,
          "index_failed": 0,
          "delete_total": 0,
          "delete_time_in_millis": 0,
          "delete_current": 0,
          "noop_update_total": 0,
          "is_throttled": false,
          "throttle_time_in_millis": 0
        },
        "get": {
          "total": 0,
          "time_in_millis": 0,
          "exists_total": 0,
          "exists_time_in_millis": 0,
          "missing_total": 0,
          "missing_time_in_millis": 0,
          "current": 0
        },
        "search": {
          "open_contexts": 0,
          "query_total": 12,
          "query_time_in_millis": 11,
          "query_current": 0,
          "fetch_total": 12,
          "fetch_time_in_millis": 5,
          "fetch_current": 0,
          "scroll_total": 0,
          "scroll_time_in_millis": 0,
          "scroll_current": 0,
          "point_in_time_total": 0,
          "point_in_time_time_in_millis": 0,
          "point_in_time_current": 0,
          "suggest_total": 0,
          "suggest_time_in_millis": 0,
          "suggest_current": 0
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
          "total_auto_throttle_in_bytes": 20971520
        },
        "refresh": {
          "total": 8,
          "total_time_in_millis": 58,
          "external_total": 7,
          "external_total_time_in_millis": 60,
          "listeners": 0
        },
        "flush": {
          "total": 1,
          "periodic": 1,
          "total_time_in_millis": 21
        },
        "warmer": {
          "current": 0,
          "total": 6,
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
          "evictions": 0,
          "item_count": 0
        },
        "completion": {
          "size_in_bytes": 0
        },
        "segments": {
          "count": 4,
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
          "file_sizes": {}
        },
        "translog": {
          "operations": 0,
          "size_in_bytes": 55,
          "uncommitted_operations": 0,
          "uncommitted_size_in_bytes": 55,
          "earliest_last_modified_age": 142622215,
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

For information about response fields, see [Nodes Stats API response fields]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/#indices).
