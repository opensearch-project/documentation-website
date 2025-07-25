---
layout: default
title: cat segments
parent: CAT
grand_parent: REST API reference
nav_order: 55
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-segments/
---

# cat segments
Introduced 1.0
{: .label .label-purple }

The cat segments operation lists Lucene segment-level information for each index.

## Example

```
GET _cat/segments?v
```

To see only the information about segments of a specific index, add the index name after your query.

```
GET _cat/segments/<index>?v
```

If you want to get information for more than one index, separate the indices with commas:

```
GET _cat/segments/index1,index2,index3
```

## Path and HTTP methods

```
GET _cat/segments
```

## URL parameters

All cat segments URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameter:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/)..


## Response

```json
index | shard | prirep | ip | segment | generation | docs.count | docs.deleted | size | size.memory | committed | searchable | version | compound
movies | 0 | p | 172.18.0.4 | _0 | 0 | 1 | 0 | 3.5kb | 1364 | true | true | 8.7.0 | true
movies | 0 | r | 172.18.0.3 | _0 | 0 | 1 | 0 | 3.5kb | 1364 | true | true | 8.7.0 | true
```
