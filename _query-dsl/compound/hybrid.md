---
layout: default
title: Hybrid
parent: Compound queries
nav_order: 70
---

# Hybrid query

You can use a hybrid query to combine relevance scores from multiple queries into one score for a given document. A hybrid query contains a list of one or more queries and independently calculates document scores at the shard level for each subquery. The subquery rewriting is performed at the coordinating node level in order to avoid duplicate computations.

## Example

Learn how to use the `hybrid` query by following the steps in [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

For a comprehensive example, follow the [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search#tutorial).

## Parameters

The following table lists all top-level parameters supported by `hybrid` queries.

Parameter | Description
:--- | :---
`queries` | An array of one or more query clauses that are used to match documents. A document must match at least one query clause in order to be returned in the results. The documents' relevance scores from all query clauses are combined into one score by applying a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/). The maximum number of query clauses is 5. Required.
`filter` | A filter to apply to all the subqueries of the hybrid query. 

### Rescoring hybrid queries
Introduced 2.18
{: .label .label-purple }

You can use the [`rescore`]({{site.url}}{{site.baseurl}}/query-dsl/rescore/) parameter with hybrid queries. However, rescoring behaves differently with hybrid queries compared to standard queries.

With standard queries, rescoring is applied on the **coordinating node** after results from all shards are merged. With hybrid queries, rescoring is applied at the **shard level** to each subquery's results **independently**, before the normalization and combination pipeline runs.

The processing order for hybrid queries with rescoring is as follows:

1. Each subquery in the hybrid query executes on the shard, producing separate result sets.
2. The rescore query is applied to each subquery's results independently.
3. The rescored results are sent to the coordinating node.
4. The search pipeline (normalization processor or score ranker processor) normalizes and combines the rescored subquery scores.

When using rescoring with hybrid queries, note the following considerations:

- The `window_size` applies to each sub-query's results individually, not to the combined result.
- You cannot use explicit sorting with rescoring. OpenSearch returns an error if you attempt to combine sorting with a rescore query in a hybrid search.
- Rescoring is compatible with all score-based and rank-based normalization and combination techniques supported by the [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) and [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/).

The following example uses a `match_phrase` rescore query to boost documents containing the exact phrase "search engine" within a hybrid search that combines keyword matches across two fields:

```json
POST /my-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "title": "search engine"
          }
        },
        {
          "match": {
            "description": "search engine"
          }
        }
      ]
    }
  },
  "rescore": {
    "window_size": 50,
    "query": {
      "rescore_query": {
        "match_phrase": {
          "title": {
            "query": "search engine",
            "slop": 2
          }
        }
      },
      "query_weight": 0.7,
      "rescore_query_weight": 1.2
    }
  }
}
```
{% include copy-curl.html %}

The response contains documents whose scores reflect both the initial hybrid query matching and the rescore boost:

```json
{
  "took": 30,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.95,
    "hits": [
      {
        "_index": "my-index",
        "_id": "1",
        "_score": 0.95,
        "_source": {
          "title": "Building a search engine",
          "description": "A guide to modern search engine architecture"
        }
      },
      {
        "_index": "my-index",
        "_id": "2",
        "_score": 0.67,
        "_source": {
          "title": "Introduction to search",
          "description": "Learn about search engine basics"
        }
      },
      {
        "_index": "my-index",
        "_id": "3",
        "_score": 0.42,
        "_source": {
          "title": "Database engine tuning",
          "description": "How to optimize your search queries"
        }
      }
    ]
  }
}
```

In this example, document 1 ranks highest because the rescore `match_phrase` query boosted its score --- its `title` field contains the exact phrase "search engine". Document 2 contains the phrase only in the `description` field, so it received a lower boost from the phrase match on `title`. Document 3 matched the individual terms "search" and "engine" across different fields but not as an exact phrase, so it received the smallest boost. Because the rescore query is applied independently to each sub-query's results at the shard level before normalization, the phrase boost influences the final combined scores.

### min_score support for hybrid queries

Starting with version 3.5, the [`min_score`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#request-body) parameter is applied after score normalization and combination. It can be used only when sorting by `_score` or when no explicit sort order is specified. If `min_score` is used with any other sorting criteria, the request results in an error.
{: .note}

Starting with OpenSearch 3.5, you can use hybrid queries on indexes with more than 512 shards. OpenSearch automatically disables batched reduction to ensure proper score normalization across all shards. No configuration is required. Note that memory usage on the coordinating node may be higher for indexes with a large number of shards. The `_msearch` endpoint does not support automatic handling of batched reduction. For multi-search requests with hybrid queries across many shards, use the `_search` endpoint with index patterns or aliases instead.
{: .note}

## Disabling hybrid queries

By default, hybrid queries are enabled. To disable hybrid queries in your cluster, set the `plugins.neural_search.hybrid_search_disabled` setting to `true` in `opensearch.yml`.
