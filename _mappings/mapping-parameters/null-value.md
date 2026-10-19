---
layout: default
title: Null value
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/null-value/
nav_order: 210
has_children: false
has_toc: false
---

# Null value mapping parameter

The `null_value` mapping parameter allows you to replace explicit `null` values with a predefined substitute during indexing. By default, if a field is set to `null`, it is not indexed and cannot be searched. With `null_value` defined, the specified replacement value is indexed instead. This allows you to query or aggregate documents in which a field was originally `null` without modifying the document `_source`.

Use `null_value` when a `null` carries meaning that you want to search for, such as an order that has no shipping status yet or a product that has not been assigned a category. Because the substitute is indexed, documents containing `null` also match an [`exists`]({{site.url}}{{site.baseurl}}/query-dsl/term/exists/) query on the field.

OpenSearch replaces only explicit `null` values, including `null` elements in an array. For example, if `null_value` is `"unknown"`, then the array `["camping", null]` is indexed as `camping` and `unknown`. The following values are not replaced:

- An empty array (`[]`)
- A field that is missing from the document

You cannot change the `null_value` of an existing field. To use a different substitute, create an index containing the new mapping and [reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) your documents into it.

## Choosing a substitute value

The `null_value` must be a valid value for the field type. For example, a `long` field requires a number, and a `boolean` field requires `true` or `false`. OpenSearch rejects mappings in which a numeric, `boolean`, or `geo_point` field has an invalid `null_value`.

The `date` and `ip` field types are exceptions. If their `null_value` cannot be parsed, for example, `"never"` for a `date` field, OpenSearch accepts the mapping, writes a warning to the deprecation log, and ignores the `null_value`. Documents containing `null` are then indexed without a value for the field. Test the mapping by indexing a document containing `null` and confirming that the substitute is searchable.
{: .important}

Choose a substitute that cannot occur in real data so that you can distinguish replaced values from actual values. For numeric fields, a value such as `-1` works when the real values are never negative.

The substitute is indexed but does not change the `_source` field, which still contains `null`. If the index uses [derived source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/#derived-source), OpenSearch reconstructs `_source` from indexed values, so the returned document contains the substitute value.

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

## Indexing documents containing null values

Index a document in which the `category` field is set to `null`:

```json
PUT /products/_doc/1
{
  "category": null
}
```
{% include copy-curl.html %}

Index a document in which the `category` field is an empty array:

```json
PUT /products/_doc/2
{
  "category": []
}
```
{% include copy-curl.html %}

Index a document in which the `category` field is an array containing a `null` element:

```json
PUT /products/_doc/3?refresh=true
{
  "category": ["camping", null]
}
```
{% include copy-curl.html %}

## Querying the null substitute

Search for documents in which the `category` field contains `null`:

```json
GET /products/_search
{
  "query": {
    "term": {
      "category": "unknown"
    }
  }
}
```
{% include copy-curl.html %}

The response contains documents 1 and 3. Document 2 is not returned because an empty array is not replaced. The `_source` of each document still contains `null`:

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 1,
        "_source": {
          "category": null
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 1,
        "_source": {
          "category": [
            "camping",
            null
          ]
        }
      }
    ]
  }
}
```

## Aggregating on a null substitute

Because the null replacement is indexed, it also appears in aggregations. Run a `terms` aggregation on the `category` field:

```json
GET /products/_search
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

The `unknown` bucket counts the two documents containing `null`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
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
          "doc_count": 2
        },
        {
          "key": "camping",
          "doc_count": 1
        }
      ]
    }
  }
}
```
