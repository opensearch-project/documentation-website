---
layout: default
title: cat indices
parent: CAT
grand_parent: REST API reference
nav_order: 25
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-indices/
---

# cat indices
Introduced 1.0
{: .label .label-purple }

The cat indices operation lists information related to indices⁠—how much disk space they are using, how many shards they have, their health status, and so on.

## Example

```
GET _cat/indices?v
```

To limit the information to a specific index, add the index name after your query.

```
GET _cat/indices/<index>?v
```

If you want to get information for more than one index, separate the indices with commas:

```json
GET _cat/aliases/index1,index2,index3
```

## Path and HTTP methods

```
GET _cat/indices/<index>
GET _cat/indices
```

## URL parameters

All cat indices URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
health | String | Limit indices based on their health status. Supported values are `green`, `yellow`, and `red`.
include_unloaded_segments | Boolean | Whether to include information from segments not loaded into memory. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.
pri | Boolean | Whether to return information only from the primary shards. Default is false.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
expand_wildcards | Enum | Expands wildcard expressions to concrete indices. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.


## Response

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green  | open | movies | UZbpfERBQ1-3GSH2bnM3sg | 1 | 1 | 1 | 0 | 7.7kb | 3.8kb
```
