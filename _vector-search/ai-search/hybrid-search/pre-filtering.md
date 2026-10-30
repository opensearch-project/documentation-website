---
layout: default
title: Hybrid search with pre-filtering
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 38
---

# Hybrid search with pre-filtering
**Introduced 3.0**
{: .label .label-purple }

You can perform pre-filtering on hybrid search results by providing a top-level `filter` parameter in the `hybrid` query.

The `filter` is applied during query execution to each subquery, so only documents that match the filter are scored. Pre-filtering is useful for applying the same filter to all subqueries without duplicating it in each one.

The `filter` must be a single query object.
{: .note}

To filter the final results after they have been retrieved instead of filtering each subquery during execution, use a post-filter. For more information, see [Hybrid search with post-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/post-filtering/).

## Example

The following example request combines a `match` query and a `knn` query and applies a common `filter` that restricts both subqueries to the `shoes` category:

```json
POST /products/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "filter": {
        "term": { "category": "shoes" }
      },
      "queries": [
        {
          "match": { "description": "running shoes" }
        },
        {
          "knn": {
            "embedding": {
              "vector": [1.23, 0.45, 0.67, ...],
              "k": 10
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch applies the `category: shoes` filter to both the `match` and `knn` subqueries, which is equivalent to the following query that applies the filter to each subquery individually:

```json
POST /products/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "bool": {
            "must": {
              "match": { "description": "running shoes" }
            },
            "filter": {
              "term": { "category": "shoes" }
            }
          }
        },
        {
          "knn": {
            "embedding": {
              "vector": [1.23, 0.45, 0.67, ...],
              "k": 10,
              "filter": {
                "term": { "category": "shoes" }
              }
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

## Filtering on multiple conditions

Because the `filter` must be a single query object, combine multiple conditions using a [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/). The following example filters results to only in-stock shoes:

```json
"filter": {
  "bool": {
    "must": [
      { "term": { "category": "shoes" }},
      { "term": { "in_stock": true }}
    ]
  }
}
```

## Combining a common filter with subquery filters

A subquery can define its own filter in addition to the common filter. In this case, OpenSearch combines the two using a logical `AND`, further narrowing that subquery's results.

In the following example, the common filter restricts all subqueries to the `shoes` category, while the `match` subquery is additionally narrowed to the `nike` brand:

```json
POST /products/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "filter": {
        "term": { "category": "shoes" }
      },
      "queries": [
        {
          "bool": {
            "must": {
              "match": { "description": "running shoes" }
            },
            "filter": {
              "term": { "brand": "nike" }
            }
          }
        },
        {
          "knn": {
            "embedding": {
              "vector": [1.23, 0.45, 0.67, ...],
              "k": 10
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}
