---
layout: default
title: CAT nodeattrs
parent: CAT API
nav_order: 35
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-nodeattrs/
---

# CAT nodeattrs
**Introduced 1.0**
{: .label .label-purple }

The CAT nodeattrs operation lists the attributes of custom nodes.

## Example

```
GET _cat/nodeattrs?v
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/nodeattrs
```

## URL parameters

All CAT nodeattrs URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster_manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.


## Response

```json
node | host | ip | attr | value
odfe-node2 | 172.18.0.3 | 172.18.0.3 | testattr | test
```
