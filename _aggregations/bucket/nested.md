---
layout: default
title: Nested
parent: Bucket aggregations
nav_order: 140
redirect_from:
  - /query-dsl/aggregations/bucket/nested/
---

# Nested aggregations

The `nested` aggregation lets you aggregate on fields inside a [nested]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/) object. The `nested` type is a specialized version of the `object` data type that indexes each element of an array of objects as a separate hidden document. This preserves the relationship between fields within the same array element so they can be queried and aggregated together.

## Using not `nested` object

With the plain object type, all fields are stored in a single document and array elements are flattened per field. That means searches and aggregations can accidentally cross‑match values that came from different array elements.

See following example of a `logs` index where `pages` is **not** mapped as nested `object`:

```json
PUT logs/_doc/0
{
  "response": "200",
  "pages": [
    { "page": "landing", "load_time": 200 },
    { "page": "blog",    "load_time": 500 }
  ]
}
```
{% include copy-curl.html %}

An object array is indexed as per‑field lists, not as pairs:

```json
{
  "pages.page":      ["landing", "blog"],
  "pages.load_time": [200, 500]
}
```

As the object is not nested a query that filters on `pages.page = "landing"` and `pages.load_time = 500` can match by combining values from different elements. See following example request:

```json
GET logs/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "pages.page": "landing" } },
        { "term": { "pages.load_time": 500 } }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The document returns a hit even though the `"landing"` page’s `load_time` is `200`, not `500`:

```json
"hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": "logs",
        "_id": "0",
        "_score": 0,
        "_source": {
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
      }
    ]
  }
```

## Prevent cross‑matches with `nested`

To keep fields within the same array element together, map the field as `nested`:

```json
PUT logs-nested
{
  "mappings": {
    "properties": {
      "pages": {
        "type": "nested",
        "properties": {
          "page":      { "type": "keyword" },
          "load_time": { "type": "double" }
        }
      },
      "response": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

With `nested`, each object in `pages` is indexed as its own hidden document, so queries must match within the same element. See following example using nested query:

```json
GET logs-nested/_search
{
  "query": {
    "nested": {
      "path": "pages",
      "query": {
        "bool": {
          "filter": [
            { "term": { "pages.page": "landing" } },
            { "term": { "pages.load_time": 200 } }
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This returns a match only when both conditions hold for the same `pages` element, therefore no hits are returned:

```json
"hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
```

## Nested aggregation example

To aggregate over fields inside a nested array, specify the `path` to the nested field and define sub‑aggregations under it:

```json
GET logs-nested/_search
{
  "query": {
    "match": { "response": "200" }
  },
  "aggs": {
    "pages": {
      "nested": { "path": "pages" },
      "aggs": {
        "min_load_time": { "min": { "field": "pages.load_time" } }
      }
    }
  }
}
```
{% include copy-curl.html %}

The hit is now returned with appropriate aggregation:

```json
"hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "logs-nested",
        "_id": "0",
        "_score": 1,
        "_source": {
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
      }
    ]
  },
  "aggregations": {
    "pages": {
      "doc_count": 2,
      "min_load_time": {
        "value": 200
      }
    }
  }
```

