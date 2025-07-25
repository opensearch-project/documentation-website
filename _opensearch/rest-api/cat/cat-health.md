---
layout: default
title: cat health
parent: CAT
grand_parent: REST API reference
nav_order: 20
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-health/
---

# cat health
Introduced 1.0
{: .label .label-purple }

The cat health operation lists the status of the cluster, how long the cluster has been up, the number of nodes, and other useful information that helps you analyze the health of your cluster.

## Example

```json
GET _cat/health?v
```

## Path and HTTP methods

```
GET _cat/health?v
```

## URL parameters

All cat health URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
ts | Boolean | If true, returns HH:MM:SS and Unix epoch timestamps. Default is true.

## Response

```json
GET _cat/health?v&time=5d

epoch | timestamp | cluster | status | node.total | node.data | shards | pri | relo | init | unassign | pending_tasks | max_task_wait_time | active_shards_percent
1624248112 | 04:01:52 | odfe-cluster | green | 2 | 2 | 16 | 8 | 0 | 0 | 0 | 0 | - | 100.0%
```
