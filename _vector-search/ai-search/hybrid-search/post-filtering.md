---
layout: default
title: Hybrid search with post-filtering
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 40
---

# Hybrid search with post-filtering
**Introduced 2.13**
{: .label .label-purple }

You can perform post-filtering on hybrid search results by providing the `post_filter` parameter in your query.

The `post_filter` clause is applied after the search results have been retrieved. Post-filtering is useful for applying additional filters to the search results. Because the normalization processor runs on the filtered results, their scores are normalized again. For more information, see [How post-filtering affects search results and scoring](#how-post-filtering-affects-search-results-and-scoring).

Post-filtering behaves the same way when the hybrid query runs in [fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/), where normalization likewise runs over the post-filtered results.

Post-filtering does not impact aggregation results.
{: .note}

To filter all subqueries during query execution instead of filtering the final results, use a common filter. For more information, see [Hybrid search with pre-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pre-filtering/).

## Example: Faceted search with post-filtering

Post-filtering is commonly used in faceted search, in which the UI displays aggregation counts (such as brand, color, and size filters) alongside search results. Using a `post_filter` keeps the aggregation counts based on the full unfiltered query while filtering only the displayed hits.

First, ingest product documents into an index:

```json
POST /_bulk
{ "index": { "_index": "products", "_id": "1" } }
{ "name": "Nike Air Max", "brand": "Nike", "color": "Red", "size": 10, "price": 120, "category": "Running Shoes", "description": "Cushioned running shoes for daily training" }
{ "index": { "_index": "products", "_id": "2" } }
{ "name": "Nike Pegasus", "brand": "Nike", "color": "Black", "size": 9, "price": 130, "category": "Running Shoes", "description": "Responsive shoes for road running" }
{ "index": { "_index": "products", "_id": "3" } }
{ "name": "Adidas Adizero", "brand": "Adidas", "color": "White", "size": 10, "price": 160, "category": "Running Shoes", "description": "Lightweight racing shoes" }
{ "index": { "_index": "products", "_id": "4" } }
{ "name": "Puma Velocity", "brand": "Puma", "color": "Black", "size": 8, "price": 110, "category": "Running Shoes", "description": "Cushioned shoes for long runs" }
{ "index": { "_index": "products", "_id": "5" } }
{ "name": "Adidas Ultraboost", "brand": "Adidas", "color": "Black", "size": 9, "price": 180, "category": "Running Shoes", "description": "Running shoes with responsive cushioning" }
{ "index": { "_index": "products", "_id": "6" } }
{ "name": "Nike Pegasus Trail", "brand": "Nike", "color": "White", "size": 10, "price": 140, "category": "Trail Running Shoes", "description": "Trail running shoes with a grippy outsole" }
{ "index": { "_index": "products", "_id": "7" } }
{ "name": "Merrell Moab", "brand": "Merrell", "color": "Brown", "size": 10, "price": 130, "category": "Hiking Boots", "description": "Waterproof boots for mountain trails" }
```
{% include copy-curl.html %}

The following searches use a search pipeline named `nlp-search-pipeline` that contains a `normalization-processor` with the `min_max` normalization technique and the `arithmetic_mean` combination technique. For more information, see [Configure a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/#step-3-configure-a-search-pipeline).

A user searches for "running shoes", and the application constructs a hybrid query that matches the text in the `category` and `description` fields. The query contains aggregations for brand, color, and size:

```json
GET /products/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "category": "running shoes"
          }
        },
        {
          "match": {
            "description": "running shoes"
          }
        }
      ]
    }
  },
  "aggs": {
    "brands": {
      "terms": { "field": "brand.keyword" }
    },
    "colors": {
      "terms": { "field": "color.keyword" }
    },
    "sizes": {
      "terms": { "field": "size" }
    }
  }
}
```
{% include copy-curl.html %}

The response returns hits from all brands that match the query. The aggregations include counts for every brand, color, and size in the matching documents:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  ...
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 1.0,
        "_source": {
          "name": "Nike Pegasus",
          "brand": "Nike",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "5",
        "_score": 1.0,
        "_source": {
          "name": "Adidas Ultraboost",
          "brand": "Adidas",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.9290604,
        "_source": {
          "name": "Nike Air Max",
          "brand": "Nike",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "6",
        "_score": 0.56825376,
        "_source": {
          "name": "Nike Pegasus Trail",
          "brand": "Nike",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 0.34844735,
        "_source": {
          "name": "Adidas Adizero",
          "brand": "Adidas",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 0.3007,
        "_source": {
          "name": "Puma Velocity",
          "brand": "Puma",
          ...
        }
      }
    ]
  },
  "aggregations": {
    "brands": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        { "key": "Nike", "doc_count": 3 },
        { "key": "Adidas", "doc_count": 2 },
        { "key": "Puma", "doc_count": 1 }
      ]
    },
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        { "key": "Black", "doc_count": 3 },
        { "key": "White", "doc_count": 2 },
        { "key": "Red", "doc_count": 1 }
      ]
    },
    "sizes": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        { "key": 10, "doc_count": 3 },
        { "key": 9, "doc_count": 2 },
        { "key": 8, "doc_count": 1 }
      ]
    }
  }
}
```
</details>

The aggregations are typically displayed as facet filters in the UI. When a user selects a specific brand (for example, `Nike`) to filter results, using a pre-filter would exclude non-Nike documents before aggregations are computed, causing other brands to disappear from the facet counts.

With `post_filter`, the query and aggregations run on the full result set. The filter is applied only to the displayed hits:

```json
GET /products/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "category": "running shoes"
          }
        },
        {
          "match": {
            "description": "running shoes"
          }
        }
      ]
    }
  },
  "aggs": {
    "brands": {
      "terms": { "field": "brand.keyword" }
    },
    "colors": {
      "terms": { "field": "color.keyword" }
    }
  },
  "post_filter": {
    "term": { "brand.keyword": "Nike" }
  }
}
```
{% include copy-curl.html %}

The hits contain only Nike products, but the aggregations still reflect the full unfiltered query. The hit scores are normalized again over the filtered hits, as described in [How post-filtering affects search results and scoring](#how-post-filtering-affects-search-results-and-scoring):

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 1.0,
        "_source": {
          "name": "Nike Pegasus",
          "brand": "Nike",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.62393653,
        "_source": {
          "name": "Nike Air Max",
          "brand": "Nike",
          ...
        }
      },
      {
        "_index": "products",
        "_id": "6",
        "_score": 0.001,
        "_source": {
          "name": "Nike Pegasus Trail",
          "brand": "Nike",
          ...
        }
      }
    ]
  },
  "aggregations": {
    "brands": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        { "key": "Nike", "doc_count": 3 },
        { "key": "Adidas", "doc_count": 2 },
        { "key": "Puma", "doc_count": 1 }
      ]
    },
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        { "key": "Black", "doc_count": 3 },
        { "key": "White", "doc_count": 2 },
        { "key": "Red", "doc_count": 1 }
      ]
    }
  }
}
```
</details>

All brand options remain visible in the facet, allowing the user to switch brands or compare counts without removing the filter.

## How post-filtering affects search results and scoring

Post-filtering can significantly change the final search results and document scores. Consider the following scenarios.

### Single-query scenario

Consider a query that returns the following results:
- Query results before normalization: `[d2: 5.0, d4: 3.0, d1: 2.0]`
- Normalized scores: `[d2: 1.0, d4: 0.33, d1: 0.0]`

After applying a post-filter to the initial query results, the results are as follows:
- Post-filter matches `[d2, d4]`
- Resulting scores: `[d2: 1.0, d4: 0.0]`

Note how document `d4`'s score changes from `0.33` to `0.0` after applying the post-filter.

### Multiple-query scenario

Consider a query with two subqueries:
- Query 1 results: `[d2: 5.0, d4: 3.0, d1: 2.0]`
- Query 2 results: `[d1: 1.0, d5: 0.5, d4: 0.25]`
- Normalized scores:
  - Query 1: `[d2: 1.0, d4: 0.33, d1: 0.0]`
  - Query 2: `[d1: 1.0, d5: 0.33, d4: 0.0]`
- Combined initial scores: `[d2: 1.0, d1: 0.5, d5: 0.33, d4: 0.165]`

After applying a post-filter to the initial query results, the results are as follows:
- Post-filter matches `[d2, d4]`
- Resulting scores:
  - Query 1: `[d2: 5.0, d4: 3.0]`
  - Query 2: `[d4: 0.25]`
- Normalized scores:
  - Query 1: `[d2: 1.0, d4: 0.0]`
  - Query 2: `[d4: 1.0]`
- Combined final scores: `[d2: 1.0, d4: 0.5]`

Observe that:
- Document `d2`'s score remains unchanged.
- Document `d4`'s score has changed.
