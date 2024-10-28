---
layout: default
title: List Shards
parent: List API
nav_order: 20
---

# List Shards
**Introduced 2.18**
{: .label .label-purple }

The List Shards operation outputs, in a paginated format, the state of all primary and replica shards and how they are distributed.

## Path and HTTP methods

```json
GET _list/shards
GET _list/shards/<index>
```

## Query parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`bytes` | Byte size | Specifies the units for the byte size, for example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`local` | Boolean | Whether to return information from the local node only, instead of from the cluster manager node. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
`cancel_after_time_interval` | Time | The amount of time after which the shard request is canceled. Default is `-1` (no timeout).
`time` | Time | Specifies the units for time, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`next_token` | String | Fetches the next page of indexes. When `null` provides the first page of indexes. Default is `null`. 
`size` | Integer | The maximum number of indexes to be displayed a single page. The number of indexes on a single page in the response is not always equal to specified `size`. Default is `500`. Maximum value is `5000`.
`sort` | String | The order the indexes are displayed. If `desc`, the most recently created indexes are displayed first. Ff `asc`, the oldest indexes are displayed first. Default is `asc`.

## Example requests

To see only the information about shards of a specific index, add the index name after your query, as shown the following example:

```json
GET _list/shards/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas, as shown in the following example:

```json
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