---
layout: default
title: CAT shards
parent: CAT API

nav_order: 60
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-shards/
---

# CAT shards
**Introduced 1.0**
{: .label .label-purple }

The CAT shards operation lists the state of all primary and replica shards and how they are distributed.

## Example

```
GET _cat/shards?v
```
{% include copy-curl.html %}

To see only the information about shards of a specific index, add the index name after your query.

```
GET _cat/shards/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```
GET _cat/shards/index1,index2,index3
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/shards
```

## URL parameters

All cat shards URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
local | Boolean | Whether to return information from the local node only instead of from the cluster_manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster_manager node. Default is 30 seconds.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).


## Response

```json
index | shard | prirep | state   | docs | store | ip |       | node
plugins | 0   |   p    | STARTED |   0  |  208b | 172.18.0.4 | odfe-node1
plugins | 0   |   r    | STARTED |   0  |  208b | 172.18.0.3 |  odfe-node2          
```
