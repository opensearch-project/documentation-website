---
layout: default
title: cat nodeattrs
parent: CAT API
grand_parent: REST API reference
nav_order: 35
has_children: false
---

# cat nodeattrs
Introduced 1.0
{: .label .label-purple }

The cat nodeattrs operation lists the attributes of custom nodes.

## Example

```
GET _cat/nodeattrs?v
```

## Path and HTTP methods

```
GET _cat/nodeattrs
```

## URL parameters

All cat nodeattrs URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
<<<<<<< HEAD:_opensearch/rest-api/cat/cat-nodeattrs.md
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.
=======
local | Boolean | Whether to return information from the local node only instead of from the cluster_manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
>>>>>>> aaad91a4 (CAT API inclusive language update (#2136)):_api-reference/cat/cat-nodeattrs.md


## Response

```json
node | host | ip | attr | value
odfe-node2 | 172.18.0.3 | 172.18.0.3 | testattr | test
```
