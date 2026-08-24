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

The `post_filter` clause is applied after the search results have been retrieved. Post-filtering is useful for applying additional filters to the search results without impacting the scoring or the order of the results. 

Post-filtering does not impact aggregation results.
{: .note}

To filter all subqueries during query execution instead of filtering the final results, use a common filter. For more information, see [Hybrid search with pre-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pre-filtering/).

## Example: Faceted search with post-filtering

Post-filtering is commonly used in faceted search, in which the UI displays aggregation counts (such as brand, color, and size filters) alongside search results. Using a `post_filter` keeps the aggregation counts based on the full unfiltered query while filtering only the displayed hits.

Consider an index containing product documents:

```json
{
  "name": "Nike Air Max",
  "brand": "Nike",
  "color": "Red",
  "size": 10,
  "price": 120,
  "category": "Running Shoes"
}
```

A user searches for "running shoes", and the application constructs a query containing aggregations for brand, color, and size:

```json
POST /products/_search
{
  "query": {
    "match": {
      "category": "running shoes"
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

The response returns hits from all brands:

```
Nike Air Max
Nike Pegasus
Adidas Adizero
Puma Velocity
...
```

The response also returns aggregations that include counts for every brand, color, and size:

```
Brands:  Nike (120), Adidas (80), Puma (45)
Colors:  Black (90), White (70), Red (55)
Sizes:   8 (40), 9 (60), 10 (85)
```

The aggregations are typically displayed as facet filters in the UI. When a user selects a specific brand (for example, `Nike`) to filter results, using a pre-filter would exclude non-Nike documents before aggregations are computed, causing other brands to disappear from the facet counts.

With `post_filter`, the query and aggregations run on the full result set. The filter is applied only to the displayed hits:

```json
POST /products/_search
{
  "query": {
    "match": {
      "category": "running shoes"
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

The hits contain only Nike products, but the aggregations still reflect the full unfiltered query:

```
Brands:  Nike (120), Adidas (80), Puma (45)
Colors:  Black (90), White (70), Red (55)
```

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
