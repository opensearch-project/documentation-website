---
layout: default
title: cat nodeattrs
parent: CAT
grand_parent: REST API reference
nav_order: 35
has_children: false
canonical_url: https://opensearch.org/docs/latest/api-reference/cat/cat-nodeattrs/
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

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.


## Response

```json
node | host | ip | attr | value
odfe-node2 | 172.18.0.3 | 172.18.0.3 | testattr | test
```
