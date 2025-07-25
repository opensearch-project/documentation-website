---
layout: default
title: CAT nodeattrs
parent: CAT API
nav_order: 35
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-nodeattrs/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-nodeattrs/
---

# CAT nodeattrs
**Introduced 1.0**
{: .label .label-purple }

The CAT nodeattrs operation lists the attributes of custom nodes.


## Path and HTTP methods

```json
GET _cat/nodeattrs
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.

## Example request

The following example request returns attributes about custom nodes:

```json
GET _cat/nodeattrs?v
```
{% include copy-curl.html %}


## Example response

```json
node | host | ip | attr | value
odfe-node2 | 172.18.0.3 | 172.18.0.3 | testattr | test
```
