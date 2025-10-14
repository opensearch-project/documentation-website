---
layout: default
title: List shards
parent: List API
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/api-reference/list/list-shards/
---

# List Shards API
**Introduced 2.18**
{: .label .label-purple }

The list shards operation outputs, in a paginated format, the state of all primary and replica shards and how they are distributed.

## Endpoints

```json
GET _list/shards
GET _list/shards/<index>
```

## Query parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`bytes` | Byte size | Specifies the byte size units, for example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`cancel_after_time_interval` | Time | The amount of time after which the shard request is canceled. Default is `-1` (no timeout).
`time` | Time | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`next_token` | String | Fetches the next page of indexes. When `null`, only provides the first page of indexes. Default is `null`.
`size` | Integer | The maximum number of indexes to be displayed on a single page. The number of indexes on a single page of the response is not always equal to the specified `size`. Default and minimum value is `2000`. Maximum value is `20000`.
`sort` | String | The order in which the indexes are displayed. If `desc`, then the most recently created indexes are displayed first. If `asc`, then the oldest indexes are displayed first. Default is `asc`.

When using the `next_token` path parameter, use the token produced by the response to see the next page of indexes. After the API returns `null`, all indexes contained in the API have been returned.
{: .tip }

## Example requests

To get information for all the indexes and shards, use the following query and keep specifying the `next_token` as received from response until its `null`:

```json
GET _list/shards/<index>?v&next_token=token
```

To limit the information to a specific index, add the index name after your query, as shown in the following example and keep specifying the `next_token` as received from response until its `null`:

```json
GET _list/shards/<index>?v&next_token=token
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas, as shown in the following example:

```json
GET _list/shards/index1,index2,index3?v&next_token=token
```
{% include copy-curl.html %}

## Example response

**Plain text format**

```json
index | shard | prirep | state   | docs | store | ip |       | node
plugins | 0   |   p    | STARTED |   0  |  208b | 172.18.0.4 | odfe-node1
plugins | 0   |   r    | STARTED |   0  |  208b | 172.18.0.3 |  odfe-node2
....
....
next_token MTcyOTE5NTQ5NjM5N3wub3BlbnNlYXJjaC1zYXAtbG9nLXR5cGVzLWNvbmZpZw==   
```

**JSON format**

```json
{
  "next_token": "MTcyOTE5NTQ5NjM5N3wub3BlbnNlYXJjaC1zYXAtbG9nLXR5cGVzLWNvbmZpZw==",
  "shards": [
    {
      "index": "plugins",
      "shard": "0",
      "prirep": "p",
      "state": "STARTED",
      "docs": "0",
      "store": "208B",
      "ip": "172.18.0.4",
      "node": "odfe-node1"
    },
    {
      "index": "plugins",
      "shard": "0",
      "prirep": "r",
      "state": "STARTED",
      "docs": "0",
      "store": "208B",
      "ip": "172.18.0.3",
      "node": "odfe-node2"
    }
  ]
}
```
