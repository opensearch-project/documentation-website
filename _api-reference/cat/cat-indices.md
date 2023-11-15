---
layout: default
title: CAT indices operation
parent: CAT API
nav_order: 25
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-indices/
---

# CAT indices
**Introduced 1.0**
{: .label .label-purple }

The CAT indexes operation lists information related to indexes, that is, how much disk space they are using, how many shards they have, their health status, and so on.

## Example

```
GET _cat/indices?v
```
{% include copy-curl.html %}

To limit the information to a specific index, add the index name after your query.

```
GET _cat/indices/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```json
GET _cat/indices/index1,index2,index3
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/indices/<index>
GET _cat/indices
```

## URL parameters

All CAT indexes URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
health | String | Limit indexes based on their health status. Supported values are `green`, `yellow`, and `red`.
include_unloaded_segments | Boolean | Whether to include information from segments not loaded into memory. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
pri | Boolean | Whether to return information only from the primary shards. Default is false.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
expand_wildcards | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.


## Response

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green  | open | movies | UZbpfERBQ1-3GSH2bnM3sg | 1 | 1 | 1 | 0 | 7.7kb | 3.8kb
```
