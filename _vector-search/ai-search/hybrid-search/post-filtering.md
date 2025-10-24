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

Post-filtering does not impact document relevance scores or aggregation results.
{: .note}

## Example

The following example request combines two query clauses---a `term` query and a `match` query---and contains a `post_filter`:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid":{
      "queries":[
        {
          "match":{
            "passage_text": "hello"
          }
        },
        {
          "term":{
            "passage_text":{
              "value":"planet"
            }
          }
        }
      ]
    }

  },
  "post_filter":{
    "match": { "passage_text": "world" }
  }
}
```
{% include copy-curl.html %}

Compare the results to the results in the [example without post-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/#example-combining-a-match-query-and-a-term-query). In the example without post-filtering, the response contains two documents. In this example, the response contains one document because the second document is filtered out:

```json
{
  "took": 18,
  "timed_out": false,
  "_shards": {
    "total": 2,
    "successful": 2,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.3,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.3,
        "_source": {
          "id": "s1",
          "passage_text": "Hello world"
        }
      }
    ]
  }
}
```

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