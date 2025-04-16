---
layout: default
title: ignore_above
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 45
has_children: false
has_toc: false
---

# ignore_above

The `ignore_above` mapping parameter limits the maximum number of characters that are permitted for a string to be indexed. If the length of a string exceeds the specified threshold, the value is stored with the document but is not indexed. This can help prevent the index from bloating with unusually long values and can keep queries efficient.

By default, if you do not specify `ignore_above`, all string values will be fully indexed.

## Example: Without ignore_above

Create an index with a keyword field without the `ignore_above` parameter using the following command:

```json
PUT /test-no-ignore
{
  "mappings": {
    "properties": {
      "sentence": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a long string value using the following command:

```json
PUT /test-no-ignore/_doc/1
{
  "sentence": "text longer than 10 characters"
}
```
{% include copy-curl.html %}

Running a search term query for the full 15-character string using the following command:

```json
POST /test-no-ignore/_search
{
  "query": {
    "term": {
      "sentence": "text longer than 10 characters"
    }
  }
}
```
{% include copy-curl.html %}

The document is returned because the `sentence` field was indexed:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.13353139,
    "hits": [
      {
        "_index": "test-no-ignore",
        "_id": "1",
        "_score": 0.13353139,
        "_source": {
          "sentence": "text longer than 10 characters"
        }
      }
    ]
  }
}
```

## Example: With ignore_above

Create an index with the `ignore_above` parameter set to `10` on the same field using the following command:

```json
PUT /test-ignore
{
  "mappings": {
    "properties": {
      "sentence": {
        "type": "keyword",
        "ignore_above": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the same document with the long string value using the following command:

```json
PUT /test-ignore/_doc/1
{
  "sentence": "text longer than 10 characters"
}
```
{% include copy-curl.html %}

Run the search term query using the following command:

```json
POST /test-ignore/_search
{
  "query": {
    "term": {
      "sentence": "text longer than 10 characters"
    }
  }
}
```
{% include copy-curl.html %}

There are not hits returned because the string in field `sentence` exceeded the `ignore_above` threshold and was not indexed:

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
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

However the document is still present, which can be confirmed using the following command:

```json
GET test-ignore/_search
```
{% include copy-curl.html %}

Returned hits include the document:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "test-ignore",
        "_id": "1",
        "_score": 1,
        "_source": {
          "sentence": "text longer than 10 characters"
        }
      }
    ]
  }
}
```
