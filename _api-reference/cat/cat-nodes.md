---
layout: default
title: CAT nodes operation
parent: CAT API

nav_order: 40
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-nodes/
---

# CAT nodes
**Introduced 1.0**
{: .label .label-purple }

The CAT nodes operation lists node-level information, including node roles and load metrics.

A few important node metrics are `pid`, `name`, `cluster_manager`, `ip`, `port`, `version`, `build`, `jdk`, along with `disk`, `heap`, `ram`, and `file_desc`.

## Example

```
GET _cat/nodes?v
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/nodes
```

## URL parameters

All CAT nodes URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
full_id | Boolean | If true, return the full node ID. If false, return the shortened node ID. Defaults to false.
local | Boolean | Whether to return information from the local node only instead of from the cluster_manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
include_unloaded_segments | Boolean | Whether to include information from segments not loaded into memory. Default is false.


## Response

```json
ip       |   heap.percent | ram.percent | cpu load_1m | load_5m | load_15m | node.role | node.roles |     cluster_manager |  name
10.11.1.225  |         31   |    32  | 0  |  0.00  |  0.00   | di  | data,ingest,ml  | - |  data-e5b89ad7
```
