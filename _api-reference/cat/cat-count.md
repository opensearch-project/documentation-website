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


## Path and HTTP methods

```json
GET _cat/count?v
GET _cat/count/<index>?v
```

## Example requests

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

## Example response

The following response shows the overall document count as 1625:

```json
epoch      | timestamp | count
1624237738 | 01:08:58  | 1625
```
