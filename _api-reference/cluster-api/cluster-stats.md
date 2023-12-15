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

# Cluster stats
**Introduced 1.0**
{: .label .label-purple }

The cluster stats API operation returns statistics about your cluster.

## Example

```json
GET _cluster/stats/nodes/_cluster_manager
```
{% include copy-curl.html %}

## Path and HTTP methods

```json
GET _cluster/stats
GET _cluster/stats/nodes/<node-filters>
```

## URL parameters

All cluster stats parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;node-filters&gt; | List | A comma-separated list of [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters) that OpenSearch uses to filter results.


  Although the `master` node is now called `cluster_manager` for version 2.0, we retained the `master` field for backwards compatibility. If you have a node that has either a `master` role or a `cluster_manager` role, the `count` increases for both fields by 1. To see an example node count increase, see the Response sample.
   {: .note }

## Response

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
                  "total_time_spent_in_millis" : 516
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
nodes | How many nodes returned in the response.
cluster_name | The cluster's name.
cluster_uuid | The cluster's uuid.
timestamp | The Unix epoch time of when the cluster was last refreshed.
status | The cluster's health status.
indices | Statistics about the indexes in the cluster.
indices.count | How many indexes are in the cluster.
indices.shards | Information about the cluster's shards.
indices.docs | How many documents are still in the cluster and how many documents are deleted.
indices.store | Information about the cluster's storage.
indices.fielddata | Information about the cluster's field data
indices.query_cache | Data about the cluster's query cache.
indices.completion | How many bytes in memory are used to complete operations.
indices.segments | Information about the cluster's segments, which are small Lucene indexes.
indices.mappings | Mappings within the cluster.
indices.analysis | Information about analyzers used in the cluster.
nodes | Statistics about the nodes in the cluster.
nodes.count | How many nodes were returned from the request.
nodes.versions | OpenSearch's version number.
nodes.os | Information about the operating systems used in the nodes.
nodes.process | The processes the returned nodes use.
nodes.jvm | Statistics about the Java Virtual Machines in use.
nodes.fs | The nodes' file storage.
nodes.plugins | The OpenSearch plugins integrated within the nodes.
nodes.network_types | The transport and HTTP networks within the nodes.
nodes.discovery_type | The method the nodes use to find other nodes within the cluster.
nodes.packaging_types | Information about the nodes' OpenSearch distribution.
nodes.ingest | Information about the nodes' ingest pipelines/nodes, if there are any.
total_time_spent | The total amount of download and upload time spent across all shards in the cluster when downloading or uploading from the remote store.
