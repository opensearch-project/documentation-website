---
layout: default
title: List Indices 
parent: List API
nav_order: 25
has_children: false
---

# List Indices
**Introduced 2.18**
{: .label .label-purple }

The List Indices operation provides the following information related to indexes in a paginated format: 

- The amount of disk space the index is using. 
- The number of shards the index contains. 
- The index's health status.

## Path and HTTP methods

```json
GET _list/indices
GET _list/indices/<index>
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
`bytes` | Byte size | Specifies the units for the byte size, for example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`health` | String | Limits indexes based on their health status. Supported values are `green`, `yellow`, and `red`.
`include_unloaded_segments` | Boolean | Whether to include information from segments not loaded into memory. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
`pri` | Boolean | Whether to return information only from the primary shards. Default is `false`.
`time` | Time | Specifies the units for time, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`expand_wildcards` | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.
`next_token` | String | Fetches the next page of indexes. When `null` provides the first page of indexes. Default is `null`. 
`size` | Integer | The maximum number of indexes to be displayed a single page. The number of indexes on a single page in the response is not always equal to specified `size`. Default is `500`. Maximum value is `5000`.
`sort` | String | The order the indexes are displayed. If `desc`, the most recently created indexes are displayed first. Ff `asc`, the oldest indexes are displayed first. Default is `asc`.

## Example requests

To limit the information to a specific index, add the index name after your query, as shown in the following example:

```json
GET _list/indices/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas, as shown in the following example:

```json
GET _list/indices/index1,index2,index3
```
{% include copy-curl.html %}


## Example response

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green  | open | movies | UZbpfERBQ1-3GSH2bnM3sg | 1 | 1 | 1 | 0 | 7.7kb | 3.8kb
next_token MTcyOTE5NTQ5NjM5N3wub3BlbnNlYXJjaC1zYXAtbG9nLXR5cGVzLWNvbmZpZw==
```
