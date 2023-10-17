---
layout: default
title: Nested
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 140
redirect_from:
  - /query-dsl/aggregations/bucket/nested/
---

# Nested aggregations

The `nested` aggregation lets you aggregate on fields inside a nested object. The `nested` type is a specialized version of the object data type that allows arrays of objects to be indexed in a way that they can be queried independently of each other

With the `object` type, all the data is stored in the same document, so matches for a search can go across sub documents. For example, imagine a `logs` index with `pages` mapped as an `object` datatype:

```json
PUT logs/_doc/0
{
  "response": "200",
  "pages": [
    {
      "page": "landing",
      "load_time": 200
    },
    {
      "page": "blog",
      "load_time": 500
    }
  ]
}
```
{% include copy-curl.html %}

OpenSearch merges all sub-properties of the entity relations that looks something like this:

```json
{
  "logs": {
    "pages": ["landing", "blog"],
    "load_time": ["200", "500"]
  }
}
```

So, if you wanted to search this index with `pages=landing` and `load_time=500`, this document matches the criteria even though the `load_time` value for landing is 200.

If you want to make sure such cross-object matches don’t happen, map the field as a `nested` type:

```json
PUT logs
{
  "mappings": {
    "properties": {
      "pages": {
        "type": "nested",
        "properties": {
          "page": { "type": "text" },
          "load_time": { "type": "double" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Nested documents allow you to index the same JSON document but will keep your pages in separate Lucene documents, making only searches like `pages=landing` and `load_time=200` return the expected result. Internally, nested objects index each object in the array as a separate hidden document, meaning that each nested object can be queried independently of the others.

You have to specify a nested path relative to parent that contains the nested documents:


```json
GET logs/_search
{
  "query": {
    "match": { "response": "200" }
  },
  "aggs": {
    "pages": {
      "nested": {
        "path": "pages"
      },
      "aggs": {
        "min_load_time": { "min": { "field": "pages.load_time" } }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
"aggregations" : {
  "pages" : {
    "doc_count" : 2,
    "min_price" : {
      "value" : 200.0
    }
  }
 }
}
```
