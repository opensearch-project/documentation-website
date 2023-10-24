---
layout: default
title: CAT recovery
parent: CAT API

nav_order: 50
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-recovery/
---

# CAT recovery
**Introduced 1.0**
{: .label .label-purple }

The CAT recovery operation lists all completed and ongoing index and shard recoveries.

## Example

```
GET _cat/recovery?v
```
{% include copy-curl.html %}

To see only the recoveries of a specific index, add the index name after your query.

```
GET _cat/recovery/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```json
GET _cat/recovery/index1,index2,index3
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/recovery
```

## URL parameters

All CAT recovery URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
active_only | Boolean | Whether to only include ongoing shard recoveries. Default is false.
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
detailed | Boolean | Whether to include detailed information about shard recoveries. Default is false.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Response

```json
index | shard | time | type | stage | source_host | source_node | target_host | target_node | repository | snapshot | files | files_recovered | files_percent | files_total | bytes | bytes_recovered | bytes_percent | bytes_total | translog_ops | translog_ops_recovered | translog_ops_percent
movies | 0 | 117ms | empty_store | done | n/a | n/a | 172.18.0.4 | odfe-node1 | n/a | n/a | 0 | 0 | 0.0% | 0 | 0 | 0 | 0.0% | 0 | 0 | 0 | 100.0%
movies | 0 | 382ms | peer | done | 172.18.0.4 | odfe-node1 | 172.18.0.3 | odfe-node2 | n/a | n/a | 1 | 1 |  100.0% | 1 | 208 | 208 | 100.0% | 208 | 1 | 1 | 100.0%
```
