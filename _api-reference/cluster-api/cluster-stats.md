---
layout: default
title: Cluster stats
nav_order: 60
parent: Cluster APIs
has_children: false
redirect_from:
  - /api-reference/cluster-stats/
  - /opensearch/rest-api/cluster-stats/
---

# Cluster Stats API
**Introduced 1.0**
{: .label .label-purple }

The Cluster Stats API returns high-level statistics about your cluster, including key index metrics such as shard counts, storage size, and memory usage. Additionally, it provides detailed information about cluster nodes, including node counts, node roles, operating systems, JVM versions, resource utilization (memory and CPU), and installed plugins.

<!-- spec_insert_start
api: cluster.stats
component: endpoints
-->
## Endpoints
```json
GET /_cluster/stats
GET /_cluster/stats/nodes/{node_id}
GET /_cluster/stats/{metric}/nodes/{node_id}
GET /_cluster/stats/{metric}/{index_metric}/nodes/{node_id}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.stats
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index_metric` | List | A comma-separated list of [index metric groups]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-stats/#index-metric-groups), for example, `docs,store`. |
| `metric` | List | Limit the information returned to the specified metrics. |
| `node_id` | List or String | A comma-separated list of node IDs used to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters). |

<!-- spec_insert_end -->

Although the term `master` was deprecated in favor of `cluster_manager` subsequent to OpenSearch 2.0, the `master` field was retained for backward compatibility. If you have a node that has either a `master` role or a `cluster_manager` role, the `count` increases for both fields by 1. For an example node count increase, see the [example response](#example-response).
{: .note }

<!-- spec_insert_start
api: cluster.stats
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `flat_settings` | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of `"cluster": { "max_shards_per_node": 500 }` is `"cluster.max_shards_per_node": "500"`. _(Default: `false`)_ |
| `timeout` | String | The amount of time to wait for each node to respond. If a node does not respond before its timeout expires, the response does not include its stats. However, timed out nodes are included in the response's `_nodes.failed` property. Defaults to no timeout. |

<!-- spec_insert_end -->

### Metric groups

The following table lists all available metric groups.

Metric | Description
:--- |:----
`indices` | Statistics about indexes in the cluster.
`os` | Statistics about the operating system, including load and memory.
`process` | Statistics about processes, including open file descriptors and CPU usage.
`jvm` | Statistics about the JVM, including heap usage and threads.
`fs` | Statistics about file system usage.
`plugins` | Statistics about OpenSearch plugins integrated with the nodes.
`network_types` | Statistics about the transport and HTTP networks connected to the nodes.
`discovery_type` | Statistics about the discovery methods used by the nodes to find other nodes in the cluster.
`packaging_types` | Statistics about each node's OpenSearch distribution.
`ingest` | Statistics about ingest pipelines.

### Index metric groups

To filter the information returned for the `indices` metric, you can use specific `index_metric` values. These values are only supported when using the following query types:

```json
GET _cluster/stats/_all/{index_metric}/nodes/{node_id}
GET _cluster/stats/indices/{index_metric}/nodes/{node_id}
```

The following index metrics are supported:

- `shards`
- `docs`
- `store`
- `fielddata`
- `query_cache`
- `completion`
- `segments`
- `mappings`
- `analysis`

## Example request: Retrieving specific index metrics

The following example request retrieves statistics for `docs` and `segments` index metrics for all nodes:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/stats/indices/docs,segments/nodes/_all
body: 
-->
{% capture step1_rest %}
GET /_cluster/stats/indices/docs,segments/nodes/_all

{% endcapture %}

{% capture step1_python %}


response = client.cluster.stats(
  index_metric = "docs,segments",
  metric = "indices",
  node_id = "_all"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example request: Retrieving stats for specific nodes

The following example request returns information about the cluster manager node:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/stats/nodes/_cluster_manager
body: 
-->
{% capture step1_rest %}
GET /_cluster/stats/nodes/_cluster_manager

{% endcapture %}

{% capture step1_python %}


response = client.cluster.stats(
  node_id = "_cluster_manager"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example request: Using human-readable output

The following example request includes the `human` query parameter to return byte and size values in human-readable format:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/stats?human&pretty
-->
{% capture step1_rest %}
GET /_cluster/stats?human&pretty
{% endcapture %}

{% capture step1_python %}


response = client.cluster.stats(
  params = { "human": "true", "pretty": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The `human` parameter adds human-readable fields to the response while preserving the original numeric values. For example, the `jvm.max_uptime_in_millis` field shows only the numeric value in the default response:

```json
"jvm": {
    "max_uptime_in_millis": 21476787
}
```

When you include the `human` parameter, the response includes both the human-readable `max_uptime` field and the original numeric field:

```json
"jvm": {
    "max_uptime": "5.9h",
    "max_uptime_in_millis": 21480995
}
```

## Example response

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "_nodes": {
        "total": 1,
        "successful": 1,
        "failed": 0
    },
    "cluster_name": "opensearch-cluster",
    "cluster_uuid": "QravFieJS_SlZJyBMcDMqQ",
    "timestamp": 1644607845054,
    "status": "yellow",
    "indices": {
        "count": 114,
        "shards": {
            "total": 121,
            "primaries": 60,
            "replication": 1.0166666666666666,
            "index": {
                "shards": {
                    "min": 1,
                    "max": 2,
                    "avg": 1.0614035087719298
                },
                "primaries": {
                    "min": 0,
                    "max": 2,
                    "avg": 0.5263157894736842
                },
                "replication": {
                    "min": 0.0,
                    "max": 1.0,
                    "avg": 0.008771929824561403
                }
            }
        },
        "docs": {
            "count": 134263,
            "deleted": 115
        },
        "store": {
            "size_in_bytes": 70466547,
            "reserved_in_bytes": 0
        },
        "fielddata": {
            "memory_size_in_bytes": 664,
            "evictions": 0,
            "item_count": 1
        },
        "query_cache": {
            "memory_size_in_bytes": 0,
            "total_count": 1,
            "hit_count": 0,
            "miss_count": 1,
            "cache_size": 0,
            "cache_count": 0,
            "evictions": 0
        },
        "completion": {
            "size_in_bytes": 0
        },
        "segments": {
            "count": 341,
            "memory_in_bytes": 3137244,
            "terms_memory_in_bytes": 2488992,
            "stored_fields_memory_in_bytes": 167672,
            "term_vectors_memory_in_bytes": 0,
            "norms_memory_in_bytes": 346816,
            "points_memory_in_bytes": 0,
            "doc_values_memory_in_bytes": 133764,
            "index_writer_memory_in_bytes": 0,
            "version_map_memory_in_bytes": 0,
            "fixed_bit_set_memory_in_bytes": 1112,
            "max_unsafe_auto_id_timestamp": 1644269449096,
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
        "mappings": {
            "field_types": [
                {
                    "name": "alias",
                    "count": 1,
                    "index_count": 1
                },
                {
                    "name": "binary",
                    "count": 1,
                    "index_count": 1
                },
                {
                    "name": "boolean",
                    "count": 87,
                    "index_count": 22
                },
                {
                    "name": "date",
                    "count": 185,
                    "index_count": 91
                },
                {
                    "name": "double",
                    "count": 5,
                    "index_count": 2
                },
                {
                    "name": "float",
                    "count": 4,
                    "index_count": 1
                },
                {
                    "name": "geo_point",
                    "count": 4,
                    "index_count": 3
                },
                {
                    "name": "half_float",
                    "count": 12,
                    "index_count": 1
                },
                {
                    "name": "integer",
                    "count": 144,
                    "index_count": 29
                },
                {
                    "name": "ip",
                    "count": 2,
                    "index_count": 1
                },
                {
                    "name": "keyword",
                    "count": 1939,
                    "index_count": 109
                },
                {
                    "name": "knn_vector",
                    "count": 1,
                    "index_count": 1
                },
                {
                    "name": "long",
                    "count": 158,
                    "index_count": 92
                },
                {
                    "name": "nested",
                    "count": 25,
                    "index_count": 10
                },
                {
                    "name": "object",
                    "count": 420,
                    "index_count": 91
                },
                {
                    "name": "text",
                    "count": 1768,
                    "index_count": 102
                }
            ]
        },
        "analysis": {
            "char_filter_types": [],
            "tokenizer_types": [],
            "filter_types": [],
            "analyzer_types": [],
            "built_in_char_filters": [],
            "built_in_tokenizers": [],
            "built_in_filters": [],
            "built_in_analyzers": [
                {
                    "name": "english",
                    "count": 1,
                    "index_count": 1
                }
            ]
        }
    },
    "nodes": {
        "count": {
            "total": 1,
            "coordinating_only": 0,
            "data": 1,
            "ingest": 1,
            "master": 1,
            "cluster_manager": 1,
            "remote_cluster_client": 1
        },
        "versions": [
            "1.2.4"
        ],
        "os": {
            "available_processors": 6,
            "allocated_processors": 6,
            "names": [
                {
                    "name": "Linux",
                    "count": 1
                }
            ],
            "pretty_names": [
                {
                    "pretty_name": "Amazon Linux 2",
                    "count": 1
                }
            ],
            "mem": {
                "total_in_bytes": 6232674304,
                "free_in_bytes": 1452658688,
                "used_in_bytes": 4780015616,
                "free_percent": 23,
                "used_percent": 77
            }
        },
        "process": {
            "cpu": {
                "percent": 0
            },
            "open_file_descriptors": {
                "min": 970,
                "max": 970,
                "avg": 970
            }
        },
        "jvm": {
            "max_uptime_in_millis": 108800629,
            "versions": [
                {
                    "version": "15.0.1",
                    "vm_name": "OpenJDK 64-Bit Server VM",
                    "vm_version": "15.0.1+9",
                    "vm_vendor": "AdoptOpenJDK",
                    "bundled_jdk": true,
                    "using_bundled_jdk": true,
                    "count": 1
                }
            ],
            "mem": {
                "heap_used_in_bytes": 178956256,
                "heap_max_in_bytes": 536870912
            },
            "threads": 112
        },
        "fs": {
            "total_in_bytes": 62725623808,
            "free_in_bytes": 28442726400,
            "available_in_bytes": 25226010624
        },
        "plugins": [
            {
                "name": "opensearch-index-management",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch Index Management Plugin",
                "classname": "org.opensearch.indexmanagement.IndexManagementPlugin",
                "custom_foldername": "",
                "extended_plugins": [
                    "opensearch-job-scheduler"
                ],
                "has_native_controller": false
            },
            {
                "name": "opensearch-security",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "Provide access control related features for OpenSearch 1.0.0",
                "classname": "org.opensearch.security.OpenSearchSecurityPlugin",
                "custom_foldername": "opensearch-security",
                "extended_plugins": [],
                "has_native_controller": false
            },
            {
                "name": "opensearch-cross-cluster-replication",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch Cross Cluster Replication Plugin",
                "classname": "org.opensearch.replication.ReplicationPlugin",
                "custom_foldername": "",
                "extended_plugins": [],
                "has_native_controller": false
            },
            {
                "name": "opensearch-job-scheduler",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch Job Scheduler plugin",
                "classname": "org.opensearch.jobscheduler.JobSchedulerPlugin",
                "custom_foldername": "",
                "extended_plugins": [],
                "has_native_controller": false
            },
            {
                "name": "opensearch-anomaly-detection",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch anomaly detector plugin",
                "classname": "org.opensearch.ad.AnomalyDetectorPlugin",
                "custom_foldername": "",
                "extended_plugins": [
                    "lang-painless",
                    "opensearch-job-scheduler"
                ],
                "has_native_controller": false
            },
            {
                "name": "opensearch-performance-analyzer",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch Performance Analyzer Plugin",
                "classname": "org.opensearch.performanceanalyzer.PerformanceAnalyzerPlugin",
                "custom_foldername": "",
                "extended_plugins": [],
                "has_native_controller": false
            },
            {
                "name": "opensearch-reports-scheduler",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "Scheduler for Dashboards Reports Plugin",
                "classname": "org.opensearch.reportsscheduler.ReportsSchedulerPlugin",
                "custom_foldername": "",
                "extended_plugins": [
                    "opensearch-job-scheduler"
                ],
                "has_native_controller": false
            },
            {
                "name": "opensearch-asynchronous-search",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "Provides support for asynchronous search",
                "classname": "org.opensearch.search.asynchronous.plugin.AsynchronousSearchPlugin",
                "custom_foldername": "",
                "extended_plugins": [],
                "has_native_controller": false
            },
            {
                "name": "opensearch-knn",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch k-NN plugin",
                "classname": "org.opensearch.knn.plugin.KNNPlugin",
                "custom_foldername": "",
                "extended_plugins": [
                    "lang-painless"
                ],
                "has_native_controller": false
            },
            {
                "name": "opensearch-alerting",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "Amazon OpenSearch alerting plugin",
                "classname": "org.opensearch.alerting.AlertingPlugin",
                "custom_foldername": "",
                "extended_plugins": [
                    "lang-painless"
                ],
                "has_native_controller": false
            },
            {
                "name": "opensearch-observability",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch Plugin for OpenSearch Dashboards Observability",
                "classname": "org.opensearch.observability.ObservabilityPlugin",
                "custom_foldername": "",
                "extended_plugins": [],
                "has_native_controller": false
            },
            {
                "name": "opensearch-sql",
                "version": "1.2.4.0",
                "opensearch_version": "1.2.4",
                "java_version": "1.8",
                "description": "OpenSearch SQL",
                "classname": "org.opensearch.sql.plugin.SQLPlugin",
                "custom_foldername": "",
                "extended_plugins": [],
                "has_native_controller": false
            }
        ],
        "network_types": {
            "transport_types": {
                "org.opensearch.security.ssl.http.netty.SecuritySSLNettyTransport": 1
            },
            "http_types": {
                "org.opensearch.security.http.SecurityHttpServerTransport": 1
            }
        },
        "discovery_types": {
            "zen": 1
        },
        "packaging_types": [
            {
                "type": "tar",
                "count": 1
            }
        ],
        "ingest": {
            "number_of_pipelines": 0,
            "processor_stats": {}
        }
    }
}
```
</details>

## Response body fields

The following table lists the response fields.

Field | Data type | Description
:--- | :--- | :---
`_nodes` | Object | Provides a summary of node-level request results.
`_nodes.total` | Integer | The total number of nodes included in the request.
`_nodes.successful` | Integer | The number of nodes that successfully processed the request.
`_nodes.failed` | Integer | The number of nodes that failed to respond or rejected the request. If nonzero, failure details are included in the response.
`cluster_name` | String | The name of the cluster.
`cluster_uuid` | String | The unique identifier of the cluster.
`timestamp` | Long | The time when the cluster statistics were last updated, in milliseconds since epoch.
`status` | String | The cluster health status: `green`, `yellow`, or `red`.
`indices` | Object | Aggregated statistics for indices with shards on the specified nodes.
`indices.count` | Integer | The total number of indices with shards on the specified nodes.
`indices.shards` | Object | Aggregated shard statistics for the specified nodes.
`indices.shards.total` | Integer | The total number of shards on the specified nodes.
`indices.shards.primaries` | Integer | The number of primary shards on the specified nodes.
`indices.shards.replication` | Float | The ratio of replica shards to primary shards across the specified nodes.
`indices.shards.index.shards.min` | Integer | The minimum number of shards per index (considering only shards on the specified nodes).
`indices.shards.index.shards.max` | Integer | The maximum number of shards per index (considering only shards on the specified nodes).
`indices.shards.index.shards.avg` | Float | The average number of shards per index (considering only shards on the specified nodes).
`indices.shards.index.primaries.min` | Integer | The minimum number of primary shards per index (considering only shards on the specified nodes).
`indices.shards.index.primaries.max` | Integer | The maximum number of primary shards per index (considering only shards on the specified nodes).
`indices.shards.index.primaries.avg` | Float | The average number of primary shards per index (considering only shards on the specified nodes).
`indices.shards.index.replication.min` | Float | The minimum replication factor per index (considering only shards on the specified nodes).
`indices.shards.index.replication.max` | Float | The maximum replication factor per index (considering only shards on the specified nodes).
`indices.shards.index.replication.avg` | Float | The average replication factor per index (considering only shards on the specified nodes).
`indices.docs` | Object | Document statistics for the specified nodes.
`indices.docs.count` | Integer | The total number of non-deleted documents across all primary shards on the specified nodes. Includes documents in Lucene segments and may count nested documents.
`indices.docs.deleted` | Integer | The total number of deleted documents across all primary shards on the specified nodes. Disk space is reclaimed during segment merges.
`indices.store.size_in_bytes` | Long | The total storage size of all shards on the specified nodes, in bytes.
`indices.store.reserved_in_bytes` | Long | The amount of disk space reserved for ongoing operations such as segment merges, in bytes.
`indices.fielddata.memory_size_in_bytes` | Long | The total amount of memory used by the field data cache across the specified nodes, in bytes.
`indices.fielddata.evictions` | Long | The number of field data cache evictions across the specified nodes.
`indices.query_cache.memory_size_in_bytes` | Long | The total amount of memory used by the query cache across the specified nodes, in bytes.
`indices.query_cache.total_count` | Long | The total number of query cache accesses (hits and misses) across the specified nodes.
`indices.query_cache.hit_count` | Long | The number of query cache hits across the specified nodes.
`indices.query_cache.miss_count` | Long | The number of query cache misses across the specified nodes.
`indices.query_cache.cache_size` | Integer | The current number of entries in the query cache across the specified nodes.
`indices.query_cache.cache_count` | Long | The total number of entries added to the query cache, including evicted entries.
`indices.query_cache.evictions` | Long | The number of query cache evictions across the specified nodes.
`indices.completion.size_in_bytes` | Long | The total amount of memory used for completion suggesters across the specified nodes, in bytes.
`indices.segments` | Object | Segment statistics for the specified nodes.
`indices.segments.count` | Integer | The total number of segments across all shards on the specified nodes.
`indices.segments.memory_in_bytes` | Long | The total amount of memory used by segments across the specified nodes, in bytes.
`indices.segments.terms_memory_in_bytes` | Long | The amount of memory used for term dictionaries across the specified nodes, in bytes.
`indices.segments.stored_fields_memory_in_bytes` | Long | The amount of memory used for stored fields across the specified nodes, in bytes.
`indices.segments.term_vectors_memory_in_bytes` | Long | The amount of memory used for term vectors across the specified nodes, in bytes.
`indices.segments.norms_memory_in_bytes` | Long | The amount of memory used for normalization factors across the specified nodes, in bytes.
`indices.segments.points_memory_in_bytes` | Long | The amount of memory used for point values (numeric, geo, etc.) across the specified nodes, in bytes.
`indices.segments.doc_values_memory_in_bytes` | Long | The amount of memory used for doc values across the specified nodes, in bytes.
`indices.segments.index_writer_memory_in_bytes` | Long | The amount of memory used by index writers across the specified nodes, in bytes.
`indices.segments.version_map_memory_in_bytes` | Long | The amount of memory used by version maps across the specified nodes, in bytes.
`indices.segments.fixed_bit_set_memory_in_bytes` | Long | The amount of memory used by fixed bit sets (for nested and join fields) across the specified nodes, in bytes.
`indices.segments.max_unsafe_auto_id_timestamp` | Long | The most recent timestamp of a retried indexing request, in milliseconds.
`indices.segments.file_sizes` | Object | This object is not populated by the Cluster Stats API. To get information on segment files, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/).
`indices.mappings.field_types` | Array | Statistics about field data types used on the specified nodes.
`indices.mappings.field_types.name` | String | The field data type.
`indices.mappings.field_types.count` | Integer | The number of fields mapped to this data type.
`indices.mappings.field_types.index_count` | Integer | The number of indices that use this data type.
`indices.analysis` | Object | Statistics about analyzers and analysis components used on the specified nodes.
`nodes` | Object | Aggregated statistics for the specified nodes.
`nodes.count.total` | Integer | The total number of nodes.
`nodes.count.coordinating_only` | Integer | The number of nodes with no assigned roles (coordinating-only nodes).
`nodes.count.<role>` | Integer | The number of nodes with a specific role (for example, `data`, `ingest`, `cluster_manager`).
`nodes.versions` | Array | The OpenSearch versions running on the specified nodes.
`nodes.os.available_processors` | Integer | The total number of processors available to the JVM across the specified nodes.
`nodes.os.allocated_processors` | Integer | The number of processors used for thread pool sizing across the specified nodes (capped at 32).
`nodes.os.mem.total_in_bytes` | Long | The total physical memory across the specified nodes, in bytes.
`nodes.os.mem.free_in_bytes` | Long | The amount of free physical memory across the specified nodes, in bytes.
`nodes.os.mem.used_in_bytes` | Long | The amount of used physical memory across the specified nodes, in bytes.
`nodes.os.mem.free_percent` | Integer | The percentage of free physical memory across the specified nodes.
`nodes.os.mem.used_percent` | Integer | The percentage of used physical memory across the specified nodes.
`nodes.process.cpu.percent` | Integer | The CPU usage percentage across the specified nodes. Returns `-1` if not supported.
`nodes.process.open_file_descriptors.min` | Integer | The minimum number of open file descriptors across the specified nodes. Returns `-1` if not supported.
`nodes.process.open_file_descriptors.max` | Integer | The maximum number of open file descriptors across the specified nodes. Returns `-1` if not supported.
`nodes.process.open_file_descriptors.avg` | Integer | The average number of open file descriptors across the specified nodes. Returns `-1` if not supported.
`nodes.jvm.max_uptime_in_millis` | Long | The maximum JVM uptime, in milliseconds, across the specified nodes.
`nodes.jvm.versions` | Array | Statistics about JVM versions running on the specified nodes.
`nodes.jvm.mem.heap_used_in_bytes` | Long | The heap memory currently in use across the specified nodes, in bytes.
`nodes.jvm.mem.heap_max_in_bytes` | Long | The maximum heap memory available across the specified nodes, in bytes.
`nodes.jvm.threads` | Integer | The total number of active JVM threads across the specified nodes.
`nodes.fs.total_in_bytes` | Long | The total filesystem capacity across the specified nodes, in bytes.
`nodes.fs.free_in_bytes` | Long | The total unallocated disk space across the specified nodes, in bytes.
`nodes.fs.available_in_bytes` | Long | The disk space available to the JVM across the specified nodes (may be less than free space due to OS restrictions), in bytes.
`nodes.plugins` | Array | Information about installed plugins and modules on the specified nodes.
`nodes.network_types` | Object | Statistics about transport and HTTP network types used by the specified nodes.
`nodes.discovery_types` | Object | Statistics about discovery mechanisms used by the specified nodes.
`nodes.packaging_types` | Array | Information about the distribution types installed on the specified nodes.
`nodes.ingest.number_of_pipelines` | Integer | The total number of ingest pipelines across the specified nodes.
`nodes.ingest.processor_stats` | Object | Statistics about ingest processors used on the specified nodes.