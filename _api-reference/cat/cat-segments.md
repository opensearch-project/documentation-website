---
layout: default
title: CAT segments
parent: CAT API

nav_order: 55
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-segments/
---

# CAT segments
**Introduced 1.0**
{: .label .label-purple }

The cat segments operation lists Lucene segment-level information for each index.


## Path and HTTP methods

```json
GET _cat/segments
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/)..
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.

## Example requests

```json
GET _cat/segments?v
```
{% include copy-curl.html %}

To see only the information about segments of a specific index, add the index name after your query.

```json
GET _cat/segments/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```json
GET _cat/segments/index1,index2,index3
```
{% include copy-curl.html %}

## Example response

```json
index | shard | prirep | ip | segment | generation | docs.count | docs.deleted | size | size.memory | committed | searchable | version | compound
movies | 0 | p | 172.18.0.4 | _0 | 0 | 1 | 0 | 3.5kb | 1364 | true | true | 8.7.0 | true
movies | 0 | r | 172.18.0.3 | _0 | 0 | 1 | 0 | 3.5kb | 1364 | true | true | 8.7.0 | true
```
