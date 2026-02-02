---
layout: default
title: Rescore
nav_order: 99
---

# Rescore

The `rescore` parameter improves search precision by reordering only the highest-ranked documents returned from your initial query. Rather than applying an expensive algorithm to all documents in the index, rescoring focuses computational resources on reranking a smaller window of top results using a secondary scoring method.

When you include a `rescore` parameter in your search request, OpenSearch processes the results in the following sequence:

1. **Initial search**: The primary query and any post-filters execute across all relevant documents.
2. **Shard-level rescoring**: Each shard applies the rescoring algorithm to its top results.
3. **Final coordination**: The coordinating node combines rescored results from all shards.

This approach provides better relevance while maintaining acceptable performance.

When using the `rescore` parameter, note the following important considerations:

- You cannot use explicit sorting (other than `_score` in descending order) with rescoring. OpenSearch returns an error if you attempt to combine custom sorting with a rescore query.

- When implementing pagination, maintain the same `window_size` across all pages. Changing the window size between pages can cause result inconsistencies as users navigate through search results.

## Query rescoring

Query rescoring applies a secondary query to refine the scores of top-ranked documents. You can control how many documents each shard examines using the `window_size` parameter (default is `10`).

### Basic rescoring syntax

```json
POST /_search
{
  "query": {
    "match": {
      "content": {
        "query": "OpenSearch query optimization",
        "operator": "or"
      }
    }
  },
  "rescore": {
    "window_size": 100,
    "query": {
      "rescore_query": {
        "match_phrase": {
          "content": {
            "query": "OpenSearch query optimization",
            "slop": 1
          }
        }
      },
      "query_weight": 0.8,
      "rescore_query_weight": 1.3
    }
  }
}
```
{% include copy-curl.html %}

### Rescore parameters

The `rescore` object supports the following parameters.

Parameter | Type | Description
--- | --- | ---
`window_size` | Integer | Number of top documents to rescore per shard. Default is `10`.
`query_weight` | Float | Weight applied to the original query score. Default is `1.0`.
`rescore_query_weight` | Float | Weight applied to the rescore query score. Default is `1.0`.
`score_mode` | String | Method for combining original and rescore query scores. Default is `total`. See [Score combination modes](#score-combination-modes).

### Score combination modes

The `score_mode` parameter determines how OpenSearch combines the original score with the rescore query score. This parameter accepts the following values.

Mode | Description | Use case
--- | --- | ---
`total` | Adds original score + rescore score | General relevance improvement (default)
`multiply` | Multiplies original score × rescore score | Effective with function queries that return values between 0 and 1
`avg` | Averages the two scores | Balanced approach when both scores are equally important
`max` | Uses the higher of the two scores | Ensures documents with high scores in either query rank well
`min` | Uses the lower of the two scores | Conservative approach that requires both queries to agree

## Multiple rescoring stages

You can chain multiple rescoring operations to apply increasingly sophisticated ranking algorithms:

```json
POST /_search
{
  "query": {
    "match": {
      "title": {
        "query": "search engine technology",
        "operator": "or"
      }
    }
  },
  "rescore": [
    {
      "window_size": 200,
      "query": {
        "rescore_query": {
          "match_phrase": {
            "title": {
              "query": "search engine technology",
              "slop": 2
            }
          }
        },
        "query_weight": 0.6,
        "rescore_query_weight": 1.4
      }
    },
    {
      "window_size": 50,
      "query": {
        "score_mode": "multiply",
        "rescore_query": {
          "function_score": {
            "script_score": {
              "script": {
                "source": "Math.log10(doc['popularity'].value + 2)"
              }
            }
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

In this multi-stage example:
1. The **first rescoring stage** examines 200 documents per shard, applying phrase matching to improve relevance.
2. The **second rescoring stage** takes the top 50 results from the first stage and applies popularity-based scoring using a logarithmic function.

Each stage processes the results from the previous stage, creating a refinement pipeline where computationally expensive operations only operate on the most promising candidates.
