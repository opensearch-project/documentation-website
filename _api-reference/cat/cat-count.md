---
layout: default
title: CAT count
parent: CAT API
nav_order: 10
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-count/

---

# CAT count
**Introduced 1.0**
{: .label .label-purple }

The CAT count operation lists the number of documents in your cluster.

## Example

```json
GET _cat/count?v
```
{% include copy-curl.html %}

To see the number of documents in a specific index or alias, add the index or alias name after your query:

```json
GET _cat/count/<index_or_alias>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index or alias, separate the index or alias names with commas:

```json
GET _cat/count/index_or_alias_1,index_or_alias_2,index_or_alias_3
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/count?v
GET _cat/count/<index>?v
```

## URL parameters

All CAT count URL parameters are optional. You can specify any of the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index).


## Response

The following response shows the overall document count as 1625:

```json
epoch      | timestamp | count
1624237738 | 01:08:58  | 1625
```
