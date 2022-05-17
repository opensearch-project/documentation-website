---
layout: default
title: Nodes info
parent: Nodes APIs
grand_parent: REST API reference
nav_order: 20
---

# Nodes info

Represents mostly static information about cluster nodes.
Such as host system information, JVM, processor type, or specific
node information like node settings, thread pools settings, installed plugins, and more.

## Example

```json
# Get information from all cluster nodes
GET /_nodes

# Get thread pool information from the cluster manager node only
GET /_nodes/master:true/thread_pool?pretty
```

## Path and HTTP methods

```text
GET /_nodes
GET /_nodes/{nodeId}
GET /_nodes/{metrics}
GET /_nodes/{nodeId}/{metrics}
# or full path equivalent
GET /_nodes/{nodeId}/info/{metrics}
```

## URL parameters

You can include the following URL parameters in your request. All parameters are optional.

Parameter | Type   | Description
:--- |:-------| :---
nodeId | String | A comma-separated list of nodeIds to filter results. Supports [node filters](../index/#node-filters).<br>Defaults to `_all`.
metrics | String | A comma-separated list of metric groups that will be included in the response. For example `jvm,thread_pools`.<br>Defaults to all metrics.
timeout | TimeValue | A request [timeout](../index/#timeout).<br>Defaults to `30s`.

The following are listed all available metric groups:

Metric | Description
:--- |:----
`settings` | A node settings. This is combination of the default settings, custom settings from [configuration file](../../../configuration/#configuration-file) and dynamically [updated settings](../../../configuration/#update-cluster-settings-using-the-api).
`os` | Static information about host os, including version, processor architecture and available/allocated processors.
`process` | Contains process id.
`jvm` | Detailed static information about running JVM, including arguments.
`thread_pool` | Configured options for all individual thread pools (type, size ... etc).
`transport` | Mostly static information about transport layer.
`http` | Mostly static information about http layer.
`plugins` | Information about installed plugins and modules.
`ingest` | Information about ingets pipelines and available ingest processors.
`aggregations` | Information about available [aggregations](../../../aggregations).
`indices` | Static index settings configured at the node level.

## Response

The response contains basic node identification and build info for every node
matching the `{nodeId}` request parameter.

Metric | Description
:--- |:----
name | A node name.
transport_address | A node transport address.
host | A node host address.
ip | A node host ip address.
version | A node OpenSearch version.
build_type | A build type, like `rpm`,`docker`, `zip` ... etc.
build_hash | A git commit hash of the build.
roles | A node roles.
attributes | A node attributes.

On top of that it will contain one or more metric groups depending on `{metrics}` request parameter.

```json
GET /_nodes/master:true/process,transport?pretty

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

## Required permissions

If you use the security plugin, make sure you have the appropriate permissions:
`cluster:monitor/nodes/info`
{: .note }