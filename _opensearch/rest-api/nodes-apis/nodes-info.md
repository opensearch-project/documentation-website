---
layout: default
title: Nodes info
parent: Nodes APIs
grand_parent: REST API reference
nav_order: 10
---

# Nodes info

The Nodes info API represents mostly static information about your cluster's nodes, including but not limited to:

- Host system information 
- JVM 
- Processor Type 
- Node settings 
- Thread pools settings 
- Installed plugins

## Example

To get information about all nodes in a cluster, use the following query:

```json
GET /_nodes
```

To get thread pool information about the cluster manager node only, use the following query:

```json
GET /_nodes/master:true/thread_pool
```

## Path and HTTP methods

```bash
GET /_nodes
GET /_nodes/<nodeId>
GET /_nodes/<metrics>
GET /_nodes/<nodeId>/<metrics>
# or full path equivalent
GET /_nodes/<nodeId>/info/<metrics>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Type | Description
:--- |:-------| :---
nodeId | String | A comma-separated list of nodeIds to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/nodes-apis/index/#node-filters). Defaults to `_all`.
metrics | String | A comma-separated list of metric groups that will be included in the response. For example `jvm,thread_pool`. Defaults to all metrics.

The following table lists all available metric groups.

Metric | Description
:--- |:----
settings | A node's settings. This is combination of the default settings, custom settings from [configuration file]({{site.url}}{{site.baseurl}}/opensearch/configuration/#configuration-file) and dynamically [updated settings]({{site.url}}{{site.baseurl}}/opensearch/configuration/#update-cluster-settings-using-the-api).
os | Static information about the host OS, including version, processor architecture and available/allocated processors.
process | Contains process OD.
jvm | Detailed static information about running JVM, including arguments.
thread_pool | Configured options for all individual thread pools.
transport | Mostly static information about the transport layer.
http | Mostly static information about the HTTP layer.
plugins | Information about installed plugins and modules.
ingest | Information about ingest pipelines and available ingest processors.
aggregations | Information about available [aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations).
indices | Static index settings configured at the node level.

## Query parameters

You can include the following query parameters in your request. All query parameters are optional.

Parameter | Type | Description
:--- |:-------| :---
flat_settings| Boolean | Specifies whether to return settings in flat format. Default is `false`.
timeout | Time | Sets the time limit for node response. Default value is `30s`.

#### Sample request with filtering

The following query requests the `process` and `transport` metrics from the cluster manager node: 

```json
GET /_nodes/cluster_manager:true/process,transport
```

#### Sample response with filtering

The response contains the metric groups specified in the `<metrics>` request parameter (in this case, `process` and `transport`):

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "opensearch",
  "nodes": {
    "VC0d4RgbTM6kLDwuud2XZQ": {
      "name": "node-m1-23",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1",
      "version": "1.3.1",
      "build_type": "tar",
      "build_hash": "c4c0672877bf0f787ca857c7c37b775967f93d81",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "attributes": {
        "shard_indexing_pressure_enabled": "true"
      },
      "process" : {
        "refresh_interval_in_millis": 1000,
        "id": 44584,
        "mlockall": false
      },
      "transport": {
        "bound_address": [
          "[::1]:9300",
          "127.0.0.1:9300"
        ],
        "publish_address": "127.0.0.1:9300",
        "profiles": { }
      }
    }
  }
}
```

#### Sample request without filtering

```json
GET /_nodes/
```

#### Sample response without filtering

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
      "name" : "opensearch",
      "transport_address" : "127.0.0.1:9300",
      "host" : "127.0.0.1",
      "ip" : "127.0.0.1",
      "version" : "2.3.0",
      "build_type" : "tar",
      "build_hash" : "6f6e84ebc54af31a976f53af36a5c69d474a5140",
      "total_indexing_buffer" : 53687091,
      "roles" : [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "settings" : {
        "cluster" : {
          "name" : "docker-cluster"
        },
        "node" : {
          "attr" : {
            "shard_indexing_pressure_enabled" : "true"
          },
          "max_local_storage_nodes" : "3",
          "name" : "opensearch"
        },
        "path" : {
          "logs" : "/usr/share/opensearch/logs",
          "home" : "/usr/share/opensearch"
        },
        "discovery" : {
          "type" : "single-node"
        },
        "plugins" : {
          "security" : {
            "restapi" : {
              "roles_enabled" : [
                "all_access",
                "security_rest_api_access"
              ]
            },
            "authcz" : {
              "admin_dn" : [
                "CN=kirk,OU=client,O=client,L=test, C=de"
              ]
            }
          }
        },
        "client" : {
          "type" : "node"
        },
        "http" : {
          "type" : {
            "default" : "netty4"
          }
        },
        "bootstrap" : {
          "memory_lock" : "true"
        },
        "transport" : {
          "type" : {
            "default" : "netty4"
          }
        },
        "network" : {
          "host" : "0.0.0.0"
        }
      },
      "os" : {
        "refresh_interval_in_millis" : 1000,
        "name" : "Linux",
        "pretty_name" : "Amazon Linux 2",
        "arch" : "amd64",
        "version" : "5.10.16.3-microsoft-standard-WSL2",
        "available_processors" : 8,
        "allocated_processors" : 8
      },
      "process" : {
        "refresh_interval_in_millis" : 1000,
        "id" : 33,
        "mlockall" : true
      },
      "jvm" : {
        "pid" : 33,
        "version" : "17.0.4",
        "vm_name" : "OpenJDK 64-Bit Server VM",
        "vm_version" : "17.0.4+8",
        "vm_vendor" : "Eclipse Adoptium",
        "bundled_jdk" : true,
        "using_bundled_jdk" : true,
        "start_time_in_millis" : 1664462962940,
        "mem" : {
          "heap_init_in_bytes" : 536870912,
          "heap_max_in_bytes" : 536870912,
          "non_heap_init_in_bytes" : 7667712,
          "non_heap_max_in_bytes" : 0,
          "direct_max_in_bytes" : 0
        },
        "gc_collectors" : [
          "G1 Young Generation",
          "G1 Old Generation"
        ],
        "memory_pools" : [
          "CodeHeap 'non-nmethods'",
          "Metaspace",
          "CodeHeap 'profiled nmethods'",
          "Compressed Class Space",
          "G1 Eden Space",
          "G1 Old Gen",
          "G1 Survivor Space",
          "CodeHeap 'non-profiled nmethods'"
        ],
        "using_compressed_ordinary_object_pointers" : "true",
        "input_arguments" : [
          "-Xshare:auto",
          "-Dopensearch.networkaddress.cache.ttl=60",
          "-Dopensearch.networkaddress.cache.negative.ttl=10",
          "-XX:+AlwaysPreTouch",
          "-Xss1m",
          "-Djava.awt.headless=true",
          "-Dfile.encoding=UTF-8",
          "-Djna.nosys=true",
          "-XX:-OmitStackTraceInFastThrow",
          "-XX:+ShowCodeDetailsInExceptionMessages",
          "-Dio.netty.noUnsafe=true",
          "-Dio.netty.noKeySetOptimization=true",
          "-Dio.netty.recycler.maxCapacityPerThread=0",
          "-Dio.netty.allocator.numDirectArenas=0",
          "-Dlog4j.shutdownHookEnabled=false",
          "-Dlog4j2.disable.jmx=true",
          "-Djava.locale.providers=SPI,COMPAT",
          "-Xms1g",
          "-Xmx1g",
          "-XX:+UseG1GC",
          "-XX:G1ReservePercent=25",
          "-XX:InitiatingHeapOccupancyPercent=30",
          "-Djava.io.tmpdir=/tmp/opensearch-6552298356751114994",
          "-XX:+HeapDumpOnOutOfMemoryError",
          "-XX:HeapDumpPath=data",
          "-XX:ErrorFile=logs/hs_err_pid%p.log",
          "-Xlog:gc*,gc+age=trace,safepoint:file=logs/gc.log:utctime,pid,tags:filecount=32,filesize=64m",
          "-Dclk.tck=100",
          "-Djdk.attach.allowAttachSelf=true",
          "-Djava.security.policy=/usr/share/opensearch/config/opensearch-performance-analyzer/opensearch_security.policy",
          "--add-opens=jdk.attach/sun.tools.attach=ALL-UNNAMED",
          "-Dopensearch.cgroups.hierarchy.override=/",
          "-Xms512m",
          "-Xmx512m",
          "-XX:MaxDirectMemorySize=268435456",
          "-Dopensearch.path.home=/usr/share/opensearch",
          "-Dopensearch.path.conf=/usr/share/opensearch/config",
          "-Dopensearch.distribution.type=tar",
          "-Dopensearch.bundled_jdk=true"
        ]
      },
      "thread_pool" : {
        "force_merge" : {
          "type" : "fixed",
          "size" : 1,
          "queue_size" : -1
        },
        "fetch_shard_started" : {
          "type" : "scaling",
          "core" : 1,
          "max" : 16,
          "keep_alive" : "5m",
          "queue_size" : -1
        },
        ...
      },
      "transport" : {
        "bound_address" : [
          "0.0.0.0:9300"
        ],
        "publish_address" : "127.0.0.1:9300",
        "profiles" : { }
      },
      "http" : {
        "bound_address" : [
          "0.0.0.0:9200"
        ],
        "publish_address" : "127.0.0.1:9200",
        "max_content_length_in_bytes" : 104857600
      },
      "plugins" : [
        {
          "name" : "opensearch-alerting",
          "version" : "2.3.0.0",
          "opensearch_version" : "2.3.0",
          "java_version" : "11",
          "description" : "Amazon OpenSearch alerting plugin",
          "classname" : "org.opensearch.alerting.AlertingPlugin",
          "custom_foldername" : "",
          "extended_plugins" : [
            "lang-painless"
          ],
          "has_native_controller" : false
        },
        {
          "name" : "opensearch-anomaly-detection",
          "version" : "2.3.0.0",
          "opensearch_version" : "2.3.0",
          "java_version" : "11",
          "description" : "OpenSearch anomaly detector plugin",
          "classname" : "org.opensearch.ad.AnomalyDetectorPlugin",
          "custom_foldername" : "",
          "extended_plugins" : [
            "lang-painless",
            "opensearch-job-scheduler"
          ],
          "has_native_controller" : false
        },
        ...
      ],
      "modules" : [
        {
          "name" : "aggs-matrix-stats",
          "version" : "2.3.0",
          "opensearch_version" : "2.3.0",
          "java_version" : "11",
          "description" : "Adds aggregations whose input are a list of numeric fields and output includes a matrix.",
          "classname" : "org.opensearch.search.aggregations.matrix.MatrixAggregationPlugin",
          "custom_foldername" : "",
          "extended_plugins" : [ ],
          "has_native_controller" : false
        },
        {
          "name" : "analysis-common",
          "version" : "2.3.0",
          "opensearch_version" : "2.3.0",
          "java_version" : "11",
          "description" : """Adds "built in" analyzers to OpenSearch.""",
          "classname" : "org.opensearch.analysis.common.CommonAnalysisPlugin",
          "custom_foldername" : "",
          "extended_plugins" : [
            "lang-painless"
          ],
          "has_native_controller" : false
        },
        ...
      ],
      "ingest" : {
        "processors" : [
          {
            "type" : "append"
          },
          {
            "type" : "bytes"
          },
          ...
        ]
      },
      "aggregations" : {
        "adjacency_matrix" : {
          "types" : [
            "other"
          ]
        },
        "auto_date_histogram" : {
          "types" : [
            "boolean",
            "date",
            "numeric"
          ]
        },
        ...
      }
    }
  }
}
```

## Response fields

The response contains the basic node identification and build info for every node matching the `<nodeId>` request parameter. The following table lists the response fields.

Field | Description
:--- |:----
name | The node's name.
transport_address | The node's transport address.
host | The node's host address.
ip | The node's host ip address.
version | The node's OpenSearch version.
build_type | The node's build type, like `rpm`,`docker`, `zip`, etc.
build_hash | The git commit hash of the build.
total_indexing_buffer | The maximum heap size in bytes to hold newly indexed documents. Once this heap size is exceeded, the documents are written to disk.
roles | The list of the node's roles.
attributes | The node's attributes.
os | Information about the operating system, including name, version, architecture, refresh interval, and the number of available and allocated processors.
process | Information about the current running process, including PID, refresh interval, and `mlockall` that specifies whether the process address space has been successfully locked in memory. 
jvm | Information about the JVM, including PID, version, memory information, garbage collector information, and arguments.
thread_pool | Information about the thread pool.
transport | Information about the transport address, including bound address, publish address, and profiles.
http | Information about the HTTP address, including bound address, publish address, and maximum content length in bytes.
plugins | Information about the installed plugins, including name, version, OpenSearch version, Java version, description, class name, custom folder name, a list of extended plugins, and `has_native_controller` that specifies whether the plugin has a native controller process. 
modules. | Information about the modules, including name, version, OpenSearch version, Java version, description, class name, custom folder name, a list of extended plugins, and `has_native_controller` that specifies whether the plugin has a native controller process. Modules are different from plugins because modules are loaded into OpenSearch automatically , while plugins have to be installed manually.
ingest | Information about ingest pipelines and processors.
aggregations | Information about the available aggregation types.


## Required permissions

If you use the security plugin, make sure you have the appropriate permissions: `cluster:monitor/nodes/info`.
