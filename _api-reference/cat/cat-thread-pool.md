---
layout: default
title: CAT thread pool
parent: CAT API
nav_order: 75
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-thread-pool/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-thread-pool/
---

# CAT thread pool
**Introduced 1.0**
{: .label .label-purple }

The CAT thread pool operation lists the active, queued, and rejected threads of different thread pools on each node.


## Path and HTTP methods

```json
GET _cat/thread_pool
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.

## Example requests

The following example request gives information about thread pools on all nodes:

```json
GET _cat/thread_pool?v
```
{% include copy-curl.html %}

If you want to get information for more than one thread pool, separate the thread pool names with commas:

```json
GET _cat/thread_pool/thread_pool_name_1,thread_pool_name_2,thread_pool_name_3
```
{% include copy-curl.html %}

If you want to limit the information to a specific thread pool, add the thread pool name after your query:

```json
GET _cat/thread_pool/<thread_pool_name>?v
```
{% include copy-curl.html %}


## Example response

```json
node_name  name                      active queue rejected
odfe-node2 ad-batch-task-threadpool    0     0        0
odfe-node2 ad-threadpool               0     0        0
odfe-node2 analyze                     0     0        0s
```
