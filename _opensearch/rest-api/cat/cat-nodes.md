---
layout: default
title: cat nodes
parent: CAT
grand_parent: REST API reference
nav_order: 40
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-nodes/
---

# cat nodes
Introduced 1.0
{: .label .label-purple }

The cat nodes operation lists node-level information, including node roles and load metrics.

A few important node metrics are `pid`, `name`, `master`, `ip`, `port`, `version`, `build`, `jdk`, along with `disk`, `heap`, `ram`, and `file_desc`.

## Example

```
GET _cat/nodes?v
```

## Path and HTTP methods

```
GET _cat/nodes
```

## URL parameters

All cat nodes URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
full_id | Boolean | If true, return the full node ID. If false, return the shortened node ID. Defaults to false.
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
include_unloaded_segments | Boolean | Whether to include information from segments not loaded into memory. Default is false.


## Response

```json
ip         | heap.percent | ram.percent | cpu load_1m | load_5m | load_15m | node.role | master | name
172.18.0.3 |     31       |     97      |       3     |  0.03   |   0.10   |  0.14 dimr |  *    |  odfe-node2
172.18.0.4 |     45       |     97      |       3     |  0.19   |   0.14   |  0.15 dimr |  -    |  odfe-node1
```
