---
layout: default
title: cat snapshots
parent: CAT
grand_parent: REST API reference
nav_order: 65
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-snapshots/
---

# cat snapshots
Introduced 1.0
{: .label .label-purple }

The cat snapshots operation lists all snapshots for a repository.

## Example

```
GET _cat/snapshots?v
```

## Path and HTTP methods

```
GET _cat/snapshots
```

## URL parameters

All cat snapshots URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameter:

Parameter | Type | Description
:--- | :--- | :---
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).


## Response

```json
index | shard | prirep | state   | docs | store | ip |       | node
plugins | 0   |   p    | STARTED |   0  |  208b | 172.18.0.4 | odfe-node1
plugins | 0   |   r    | STARTED |   0  |  208b | 172.18.0.3 |  odfe-node2          
```
