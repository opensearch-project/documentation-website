---
layout: default
title: LIST shards
parent: LIST API

nav_order: 60
has_children: false
redirect_from:
- /opensearch/rest-api/list/list-shards/
---

# LIST shards
**Introduced 2.18**
{: .label .label-purple }

The LIST shards operation outputs the state of all primary and replica shards and how they are distributed, in a paginated fashion.
Information for shards to be returned in the current page, will be guided by the current state of cluster not by the state when first page would have been fetched (which might be different).


## Path and HTTP methods

```json
GET _list/shards
GET _list/shards/<index>
```

## Query parameters

All parameters are optional.

In addition to the [common parameters]({{site.url}}{{site.baseurl}}/api-reference/list/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
cancel_after_time_interval | Time | The amount of time after which the shard request will be canceled. Default is `-1`.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
next_token | String | To be used for fetching the next page of shards, if `null` provides the first page of sahrds. Default is `null`. 
size | Integer | Maximum number of shards to be displayed a single page. To be noted, number of shards in a page need not always be equal to specified `size`. Default and minimum value is `2000` while the maximum value can be `20000`.
sort | String | Order of shards to be displayed. Allowed values `asc` and `desc`. If `desc`, shards corresponding to most recently created indexes would be displayed first while if `asc`, shards of oldest indexes would be displayed first. Default is `asc`.

## Example requests

The following example requests returns information about shards:

```
GET _list/shards?v
```
{% include copy-curl.html %}

To see only the information about shards of a specific index, add the index name after your query.

```
GET _list/shards/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```
GET _list/shards/index1,index2,index3
```
{% include copy-curl.html %}

## Example response

```json
index | shard | prirep | state   | docs | store | ip |       | node
plugins | 0   |   p    | STARTED |   0  |  208b | 172.18.0.4 | odfe-node1
plugins | 0   |   r    | STARTED |   0  |  208b | 172.18.0.3 |  odfe-node2       
next_token MTcyOTE5NTQ5NjM5N3wub3BlbnNlYXJjaC1zYXAtbG9nLXR5cGVzLWNvbmZpZw==   
```
