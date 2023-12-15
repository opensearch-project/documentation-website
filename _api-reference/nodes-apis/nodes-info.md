---
layout: default
title: Nodes info
parent: Nodes APIs
nav_order: 10
---

# Nodes info
**Introduced 1.0**
{: .label .label-purple }

The nodes info API represents mostly static information about your cluster's nodes, including but not limited to:

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
{% include copy-curl.html %}

To get thread pool information about the cluster manager node only, use the following query:

```json
GET /_nodes/master:true/thread_pool
```
{% include copy-curl.html %}

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
nodeId | String | A comma-separated list of nodeIds used to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters). Defaults to `_all`.
metrics | String | A comma-separated list of metric groups that will be included in the response. For example, `jvm,thread_pool`. Defaults to all metrics.

The following table lists all available metric groups.

Metric | Description
:--- |:----
settings | A node's settings. This is a combination of the default settings, custom settings from the [configuration file]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/#configuration-file), and dynamically [updated settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/#updating-cluster-settings-using-the-api).
os | Static information about the host OS, including version, processor architecture, and available/allocated processors.
process | Contains the process ID.
jvm | Detailed static information about the running JVM, including arguments.
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
flat_settings| Boolean | Specifies whether to return the `settings` object of the response in flat format. Default is `false`.
timeout | Time | Sets the time limit for node response. Default value is `30s`.

#### Example request

The following query requests the `process` and `transport` metrics from the cluster manager node: 

```json
GET /_nodes/cluster_manager:true/process,transport
```
{% include copy-curl.html %}

#### Example response

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

## Response fields

The response contains the basic node identification and build info for every node matching the `<nodeId>` request parameter. The following table lists the response fields.

Field | Description
:--- |:----
name | The node's name.
transport_address | The node's transport address.
host | The node's host address.
ip | The node's host IP address.
version | The node's OpenSearch version.
build_type | The node's build type, like `rpm`, `docker`, `tar`, etc.
build_hash | The git commit hash of the build.
total_indexing_buffer | The maximum heap size in bytes used to hold newly indexed documents. Once this heap size is exceeded, the documents are written to disk.
roles | The list of the node's roles.
attributes | The node's attributes.
os | Information about the OS, including name, version, architecture, refresh interval, and the number of available and allocated processors.
process | Information about the currently running process, including PID, refresh interval, and `mlockall`, which specifies whether the process address space has been successfully locked in memory. 
jvm | Information about the JVM, including PID, version, memory information, garbage collector information, and arguments.
thread_pool | Information about the thread pool.
transport | Information about the transport address, including bound address, publish address, and profiles.
http | Information about the HTTP address, including bound address, publish address, and maximum content length, in bytes.
plugins | Information about the installed plugins, including name, version, OpenSearch version, Java version, description, class name, custom folder name, a list of extended plugins, and `has_native_controller`, which specifies whether the plugin has a native controller process. 
modules | Information about the modules, including name, version, OpenSearch version, Java version, description, class name, custom folder name, a list of extended plugins, and `has_native_controller`, which specifies whether the plugin has a native controller process. Modules are different from plugins because modules are loaded into OpenSearch automatically, while plugins have to be installed manually.
ingest | Information about ingest pipelines and processors.
aggregations | Information about the available aggregation types.


## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/nodes/info`.
