---
layout: default
title: Hybrid
parent: Compound queries
nav_order: 70
---

# Hybrid query

You can use a hybrid query to combine relevance scores from multiple queries into one score for a given document. A hybrid query contains a list of one or more queries and independently calculates document scores at the shard level for each subquery. The subquery rewriting is performed at the coordinating node level in order to avoid duplicate computations.

To normalize and combine the subquery scores, either attach a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) to the request or add a `fusion` parameter to the query. For more information, see [Fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/).

## Example

Learn how to use the `hybrid` query by following the steps in [Hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/).

For a comprehensive example, follow the [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search#tutorial).

## Parameters

The following table lists all top-level parameters supported by `hybrid` queries.

Parameter | Description
:--- | :---
`queries` | An array of one or more query clauses that are used to match documents. A document must match at least one query clause in order to be returned in the results. The documents' relevance scores from all query clauses are combined into one score, either by applying a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) or by specifying the `fusion` parameter. The maximum number of query clauses is 5. Required.
`weights` | An array of numbers that weight the query clauses when their scores are combined, one for each query clause, in the same order as the `queries` array. Each weight must be in the range from `0.0` to `1.0`, and the weights must sum to `1.0`, within a tolerance of `0.01`. Applies both to queries that use a search pipeline and to queries in fusion mode. Optional. If not provided, all query clauses are weighted equally. For more information, see [Weighting subqueries](#weighting-subqueries).
`filter` | A filter to apply to all the subqueries of the hybrid query. The filter must be a single query object. To apply multiple filter conditions, combine them in a [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/). For more information, see [Hybrid search with pre-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pre-filtering/).
`pagination_depth` | The maximum number of search results that each subquery returns from each shard. This bounds the set of documents that the search pipeline normalizes and combines, so it affects both the depth to which you can paginate and the resulting order. Valid values are integers from `1` to the value of [`index.max_result_window`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/) (10000 by default). Required if `from` is greater than `0`; otherwise optional. If not provided, each subquery returns up to `size` results from each shard. For more information, see [Paginating hybrid query results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pagination/). In fusion mode, this parameter is optional regardless of `from`; if specified without `fusion.window_size`, it raises the number of results that each subquery contributes to fusion. For more information, see [Candidate window size]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#candidate-window-size).
`fusion` | Runs the query in fusion mode, in which OpenSearch normalizes and combines the subquery scores on the coordinating node. Contains the `normalization`, `combination`, `window_size`, and `source` parameters. A hybrid query that specifies `fusion` does not require a search pipeline. Optional. For more information, see [Fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/).

### Weighting subqueries
Introduced 3.10
{: .label .label-purple }

By default, all query clauses contribute equally to the combined score. To weight them differently, add a `weights` array to the top-level `hybrid` query, with one weight for each query clause, in the same order as the `queries` array. Each weight must be in the range from `0.0` to `1.0`, and the weights must sum to `1.0`.

You can specify weights in the following locations.

Location | Use it for | Behavior
:--- | :--- | :---
`weights` in the `hybrid` query | Per-request weights, with a search pipeline or in fusion mode. Recommended. | Applies to this request only. If the search pipeline also specifies weights, the request's weights take precedence.
`combination.parameters.weights` in the pipeline's [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) or [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) | A fixed weighting for every request that uses the pipeline. | Applies to every request that uses the pipeline, unless the request specifies `weights`.
`combination.parameters.weights` in the `fusion` object | Fusion mode only. | Has the same effect as `weights` in the `hybrid` query. Specify one or the other, not both.

The following request uses the search pipeline created in [Hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#step-3-configure-a-search-pipeline) and assigns a weight of `0.3` to the `match` query and `0.7` to the `neural` query:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "weights": [
        0.3,
        0.7
      ],
      "queries": [
        {
          "match": {
            "passage_text": {
              "query": "Hi world"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "Hi world",
              "model_id": "bQ1J8ooBpBj3wT4HVUsb",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The weights apply to the `arithmetic_mean`, `geometric_mean`, `harmonic_mean`, and `rrf` combination techniques in the same way as the processor's own `weights` parameter. For fusion mode examples, see [Weighting subqueries]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#weighting-subqueries).

If the `weights` parameter is invalid, OpenSearch rejects the request with a `400` error. The following table lists the error messages and their causes.

Error message contains | Cause
:--- | :---
`must be a collection of numbers` | `weights` is not an array of numbers.
`must not be empty` | `weights` is an empty array. To weight all query clauses equally, omit the parameter.
`number of weights [N] must match number of sub-queries [M]` | The array does not contain exactly one weight for each query clause.
`all weights must be in range [0.0 ... 1.0]` or `sum of weights for combination must be equal to 1.0` | A weight is outside the range from `0.0` to `1.0`, or the weights do not sum to `1.0`.
`cannot combine [weights] with [fusion.combination.parameters.weights]` | The query specifies weights in both locations. Keep one.
`requires a normalization or score-ranker processor` | The query uses a search pipeline that contains neither a normalization processor nor a score ranker processor, so nothing would apply the weights. Add one of these processors to the pipeline, or run the query in fusion mode.
`only apply to the request's top-level [hybrid] query` | With a search pipeline, `weights` is accepted only on the `hybrid` query in the request's `query`, not on a `hybrid` query elsewhere in the request, such as in a `post_filter`. Move the weights to the top-level `hybrid` query.

When `explain` is set to `true`, the combination description in the explanation lists the applied weights, for example, `arithmetic_mean, weights [0.3, 0.7] combination of:`. For more information, see [Hybrid search explain]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/explain/).

### Rescoring hybrid queries
Introduced 2.18
{: .label .label-purple }

You can use the [`rescore`]({{site.url}}{{site.baseurl}}/query-dsl/rescore/) parameter with hybrid queries. How rescoring interacts with a hybrid query depends on whether the query uses a search pipeline or runs in fusion mode.

With standard queries, each shard applies the rescore query to its top results after the query runs, and the coordinating node merges the rescored results. With hybrid queries that use a search pipeline, rescoring is applied at the **shard level** to each subquery's results **independently**, before the normalization and combination pipeline runs. With hybrid queries in [fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#rescoring), rescoring is applied to the combined ranking after normalization and combination, as it is for standard queries.

The processing order for hybrid queries that use a search pipeline with rescoring is as follows:

1. Each subquery in the hybrid query executes on the shard, producing separate result sets.
2. The rescore query is applied to each subquery's results independently.
3. The rescored results are sent to the coordinating node.
4. The search pipeline (normalization processor or score ranker processor) normalizes and combines the rescored subquery scores.

When using rescoring with hybrid queries that use a search pipeline, note the following considerations:

- The `window_size` applies to each subquery's results individually, not to the combined result.
- You cannot use explicit sorting with rescoring. If you attempt to combine sorting with a rescore query in a hybrid search, OpenSearch returns an error.
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

In this example, Document 1 ranks highest because the rescore `match_phrase` query boosts its score (its `title` field contains the exact phrase "search engine"). Document 2 contains the phrase only in the `description` field, so it receives a lower boost from the phrase match on `title`. Document 3 matches the individual terms "search" and "engine" across different fields but not as an exact phrase, so it receives the smallest boost. Because the rescore query is applied independently to each subquery's results at the shard level before normalization, the phrase boost influences the final combined scores.

<!-- vale off -->
### min_score support for hybrid queries
<!-- vale on -->

Starting with OpenSearch 3.5, the [`min_score`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#request-body) parameter is applied after score normalization and combination. It can be used only when sorting by `_score` or when no explicit sort order is specified. If `min_score` is used with any other sorting criteria, the request results in an error.
{: .note}

Starting with OpenSearch 3.5, you can use hybrid queries on indexes with more than 512 shards. OpenSearch automatically disables batched reduction to ensure proper score normalization across all shards. No configuration is required. Note that memory usage on the coordinating node may be higher for indexes with a large number of shards. The `_msearch` endpoint does not support automatic handling of batched reduction. For multi-search requests with hybrid queries across many shards, use the `_search` endpoint with index patterns or aliases instead.
{: .note}

## Limitations

Hybrid query is designed to be a top-level query in a search request. It cannot be nested inside other compound or wrapper queries such as `function_score`, `constant_score`, `script_score`, or `boosting`. This restriction also applies to multilevel nesting, for example, a `bool` query containing a `function_score` query that itself contains a `hybrid` query. Nesting a hybrid query inside these wrapper queries may produce a runtime error or silently bypass the normalization pipeline. In [fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#nesting-a-hybrid-query), a hybrid query can be nested inside a `bool` query, a `dis_max` query, or another hybrid query in fusion mode.

Hybrid query uses a specialized scoring mechanism that is incompatible with wrapper queries. Wrapper queries use a different internal scorer that bypasses the hybrid query's per-subquery score collection, which is required for the normalization and combination pipeline to function correctly.

To apply score-boosting functions to hybrid search results, replace the `hybrid` query with a `bool` query and move your subqueries into `should` clauses. This alternative works in all OpenSearch versions that support hybrid queries.

For example, the following query is unsupported:

```json
GET /my-index/_search?search_pipeline=my-pipeline
{
  "query": {
    "function_score": {
      "query": {
        "hybrid": {
          "queries": [
            {"match": {"title": "search terms"}},
            {"term": {"category": "books"}}
          ]
        }
      },
      "functions": [{"field_value_factor": {"field": "popularity"}}]
    }
  }
}
```

Instead, use the following equivalent query:

```json
GET /my-index/_search
{
  "query": {
    "function_score": {
      "query": {
        "bool": {
          "should": [
            {"match": {"title": "search terms"}},
            {"term": {"category": "books"}}
          ]
        }
      },
      "functions": [{"field_value_factor": {"field": "popularity"}}]
    }
  }
}
```
{% include copy-curl.html %}

When using a `bool` query containing `should` clauses instead of a `hybrid` query, the search pipeline's normalization and combination processors are not applied. Instead, scores from the subqueries are combined using standard Boolean scoring (sum of matching clauses). The `function_score` functions are then applied to the combined score.
{: .note}

## Disabling hybrid queries

By default, hybrid queries are enabled. To disable hybrid queries in your cluster, set the `plugins.neural_search.hybrid_search_disabled` setting to `true` in `opensearch.yml`.
