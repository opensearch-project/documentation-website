---
layout: default
title: cat master
parent: CAT
grand_parent: REST API reference
nav_order: 30
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-cluster_manager/
---

# cat master
Introduced 1.0
{: .label .label-purple }

The cat master operation lists information that helps identify the elected master node.

## Example

```
GET _cat/master?v
```

## Path and HTTP methods

```
GET _cat/master
```

## URL parameters

All cat master URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.


## Response

```json
id                     |   host     |     ip     |   node
ZaIkkUd4TEiAihqJGkp5CA | 172.18.0.3 | 172.18.0.3 | odfe-node2
```
