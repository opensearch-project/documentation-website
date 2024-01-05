---
layout: default
title: Exists
parent: Term-level queries
grand_parent: Query DSL
nav_order: 10
---

# Exists query

Use the `exists` query to search for documents that contain a specific field.

An indexed value will not exist for a document field in any of the following cases:

- The field has `"index" : false` specified in the mapping.
- The field in the source JSON is `null` or `[]`.
- The length of the field value exceeds the `ignore_above` setting in the mapping.
- The field value is malformed and `ignore_malformed` is defined in the mapping.

An indexed value will exist for a document field in any of the following cases:

- The value is an array that contains one or more null elements and one or more non-null elements (for example, `["one", null]`).
- The value is an empty string (`""` or `"-"`).
- The value is a custom `null_value`, as defined in the field mapping.


## Example

For example, consider an index that contains the following two documents:

```json
PUT testindex/_doc/1
{
  "title": "The wind rises"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{
  "title": "Gone with the wind",
  "description": "A 1939 American epic historical film"
}
```
{% include copy-curl.html %}

The following query searches for documents that contain the `description` field:

```json
GET testindex/_search
{
  "query": {
    "exists": {
      "field": "description"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 1,
        "_source": {
          "title": "Gone with the wind",
          "description": "A 1939 American epic historical film"
        }
      }
    ]
  }
}
```

## Finding documents with missing indexed values

To find documents with missing indexed values, you can use the `must_not` [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/) with the inner `exists` query. For example, the following request searches for documents in which the `description` field is missing:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "must_not": {
        "exists": {
          "field": "description"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took": 19,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0,
        "_source": {
          "title": "The wind rises"
        }
      }
    ]
  }
}
```

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter. 