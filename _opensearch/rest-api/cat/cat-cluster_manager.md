---
layout: default
title: CAT cluster manager
parent: CAT
grand_parent: REST API reference
nav_order: 30
has_children: false
---

# CAT cluster_manager
Introduced 1.0
{: .label .label-purple }

The cat cluster manager operation lists information that helps identify the elected cluster_manager node.

## Example

```
GET _cat/cluster_manager?v
```

## Path and HTTP methods

```
GET _cat/cluster_manager
```

## URL parameters

All cat cluster manager URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster_manager node. Default is 30 seconds.


## Response

```json
id                     |   host     |     ip     |   node
ZaIkkUd4TEiAihqJGkp5CA | 172.18.0.3 | 172.18.0.3 | odfe-node2
```
