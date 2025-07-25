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

The cluster stats API operation returns statistics about your cluster.


## Endpoints

```json
GET _cluster/stats
GET _cluster/stats/nodes/<node-filters>
GET _cluster/stats/<metric>/nodes/<node-filters>
GET _cluster/stats/<metric>/<index_metric>/nodes/<node-filters>
```

## Path parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;node-filters&gt; | List | A comma-separated list of [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters) that OpenSearch uses to filter results.
metric | String | A comma-separated list of [metric groups](#metric-groups), for example, `jvm,fs`. Default is all metric groups.
index_metric | String | A comma-separated list of [index metric groups](#index-metric-groups), for example, `docs,store`. Default is all index metrics.


Although the term `master` was deprecated in favor of `cluster_manager` subsequent to OpenSearch 2.0, the `master` field was retained for backward compatibility. If you have a node that has either a `master` role or a `cluster_manager` role, the `count` increases for both fields by 1. For an example node count increase, see the [example response](#example-response).
{: .note }

### Metric groups

The following table lists all available metric groups.

Metric | Description
:--- |:----
`indices` | Statistics about indexes in the cluster.
`os` | Statistics about the host OS, including load and memory.
`process` | Statistics about processes, including open file descriptors and CPU usage.
`jvm` | Statistics about the JVM, including heap usage and threads.
`fs` | Statistics about file system usage.
`plugins` | Statistics about OpenSearch plugins integrated with the nodes.
`network_types` | A list of the transport and HTTP networks connected to the nodes.
`discovery_type` | The method used by the nodes to find other nodes in the cluster.
`packaging_types` | Information about each node's OpenSearch distribution.
`ingest` | Statistics about ingest pipelines.

### Index metric groups

To filter the information returned for the `indices` metric, you can use specific `index_metric` values. These values are only supported when using the following query types:

```json
GET _cluster/stats/_all/<index_metric>/nodes/<node-filters>
GET _cluster/stats/indices/<index_metric>/nodes/<node-filters>
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

For example, the following query requests statistics for `docs` and `search`:

```json
GET _cluster/stats/indices/docs,segments/nodes/_all
```
{% include copy-curl.html %}

## Example request

The following example requests returns information about the cluster manager node:

```json
GET _cluster/stats/nodes/_cluster_manager
```
{% include copy-curl.html %}

## Example response

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
            "evictions": 0
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

## Response body fields

Field | Description
:--- | :---
`nodes` | The number of nodes returned in the response.
`cluster_name` | The cluster's name.
`cluster_uuid` | The cluster's UUID.
`timestamp` | The Unix epoch time indicating when the cluster was last refreshed.
`status` | The cluster's health status.
`indices` | Statistics about the indexes in the cluster.
`indices.count` | The number of indexes in the cluster.
`indices.shards` | Information about the cluster's shards.
`indices.docs` | The number of documents remaining in the cluster and the number of documents that were deleted.
`indices.store` | Information about the cluster's storage.
`indices.fielddata` | Information about the cluster's field data.
`indices.query_cache` | Data about the cluster's query cache.
`indices.completion` | The number of bytes in memory that were used to complete operations.
`indices.segments` | Information about the cluster's segments, which are small Lucene indexes.
`indices.mappings` | Information about mappings in the cluster.
`indices.analysis` | Information about analyzers used in the cluster.
`nodes` | Statistics about the nodes in the cluster.
`nodes.count` | The number of nodes returned by the request.
`nodes.versions` | The OpenSearch version number for each node.
`nodes.os` | Information about the operating systems used by the nodes.
`nodes.process` | A list of processes used by each node.
`nodes.jvm` | Statistics about the JVMs in use.
`nodes.fs` | Information about the node's file storage.
`nodes.plugins` | A list of the OpenSearch plugins integrated with the nodes.
`nodes.network_types` | A list of the transport and HTTP networks connected to the nodes.
`nodes.discovery_type` | A list of methods used by the nodes to find other nodes in the cluster.
`nodes.packaging_types` | Information about each node's OpenSearch distribution.
`nodes.ingest` | Information about the node's ingest pipelines/nodes, if there are any.
`total_time_spent` | The total amount of download and upload time spent across all shards in the cluster when downloading or uploading from the remote store.
