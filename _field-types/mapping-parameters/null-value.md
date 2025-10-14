---
layout: default
title: Null value
parent: Mapping parameters

nav_order: 130
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/null-value/
---

# Null value

The `null_value` mapping parameter allows you to replace explicit `null` values with a predefined substitute during indexing. By default, if a field is set to `null`, it is not indexed and cannot be searched. With `null_value` defined, the specified replacement value is indexed instead. This allows you to query or aggregate documents in which a field was originally `null` without modifying the document `_source`.

The `null_value` must be of the same type as the field it is applied to. For instance, a `date` field cannot use a `boolean` such as `true` as its `null_value`; the `null_value` must be a valid date string.
{: .important}

## Setting a null_value on a field

The following request creates an index named `products`. The `category` field is of type `keyword` and replaces `null` values with `"unknown"` during indexing:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "category": {
        "type": "keyword",
        "null_value": "unknown"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a document with a null value

Use the following command to index a document in which the `category` field is set to `null`:

```json
PUT /products/_doc/1
{
  "category": null
}
```
{% include copy-curl.html %}

## Querying the null substitute

Use the following command to search for documents in which the `category` field was previously `null`:

```json
POST /products/_search
{
  "query": {
    "term": {
      "category": "unknown"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.2876821,
        "_source": {
          "category": null
        }
      }
    ]
  }
}
```

## Aggregating on a null substitute

Because the null replacement is indexed, it also appears in aggregations. Use the following command to perform a `terms` aggregation on the `category` field:

```json
POST /products/_search
{
  "size": 0,
  "aggs": {
    "category_count": {
      "terms": {
        "field": "category"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains aggregated results:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "category_count": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "unknown",
          "doc_count": 1
        }
      ]
    }
  }
}
```