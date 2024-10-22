---
layout: default
title: LIST indices operation
parent: LIST API
nav_order: 25
has_children: false
redirect_from:
- /opensearch/rest-api/list/list-indices/
---

# LIST indices
**Introduced 2.18**
{: .label .label-purple }

The LIST indices operation provides information related to indexes, that is, how much disk space they are using, how many shards they have, their health status, and so on, in a paginated fashion. 
Information for indexes to be returned in the current page, will be guided by the current state of cluster not by the state when first page would have been fetched (which might be different).


## Path and HTTP methods

```json
GET _list/indices
GET _list/indices/<index>
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
health | String | Limit indexes based on their health status. Supported values are `green`, `yellow`, and `red`.
include_unloaded_segments | Boolean | Whether to include information from segments not loaded into memory. Default is `false`.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
pri | Boolean | Whether to return information only from the primary shards. Default is `false`.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
expand_wildcards | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.
next_token | String | To be used for fetching the next page of indexes, if `null` provides the first page of indexes. Default is `null`. 
size | Integer | Maximum number of indexes to be displayed a single page. To be noted, number of indexes in a page need not always be equal to specified `size`. Default is `500` while the maximum value can be `5000`.
sort | String | Order of indexes to be displayed. Allowed values `asc` and `desc`. If `desc`, most recently created indexes would be displayed first while if `asc`, oldest indexes would be displayed first. Default is `asc`.

## Example requests

```json
GET _list/indices?v
```
{% include copy-curl.html %}

To limit the information to a specific index, add the index name after your query.

```json
GET _list/indices/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

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
