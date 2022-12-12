---
layout: default
title: cat thread pool
parent: CAT API
grand_parent: REST API reference
nav_order: 75
has_children: false
---

# cat thread pool
Introduced 1.0
{: .label .label-purple }

The cat thread pool operation lists the active, queued, and rejected threads of different thread pools on each node.

## Example

```
GET _cat/thread_pool?v
```

If you want to get information for more than one thread pool, separate the thread pool names with commas:

```
GET _cat/v/thread_pool_name_1,thread_pool_name_2,thread_pool_name_3
```

## Path and HTTP methods

```
GET _cat/thread_pool
```

## URL parameters

All cat thread pool URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index), you can specify the following parameter:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster_manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster_manager node. Default is 30 seconds.


## Response

```json
node_name  name                      active queue rejected
odfe-node2 ad-batch-task-threadpool    0     0        0
odfe-node2 ad-threadpool               0     0        0
odfe-node2 analyze                     0     0        0s
```
