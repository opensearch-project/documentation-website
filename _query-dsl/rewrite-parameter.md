---
layout: default
title: Rewrite
nav_order: 80
---

# Rewrite

Multi-term queries like `wildcard`, `prefix`, `regexp`, `fuzzy`, and `range` expand internally into sets of terms. The `rewrite` parameter allows you to control how these term expansions are executed and scored.

When a multi-term query expands into many terms (for example `prefix: "error*"` matching hundreds of terms), they are internally converted into term queries. This process can have the following drawbacks:

* Exceed the `indices.query.bool.max_clause_count` limit (default is `1024`).
* Affect how scores are calculated for matching documents.
* Impact memory and latency depending on the rewrite method used.

The `rewrite` parameter gives you control over how multi-term queries behave internally.

| Mode                        | Scores                                 | Performance | Notes                                         |
| --------------------------- | -------------------------------------- | ----------- | --------------------------------------------- |
| `constant_score`            | Same score for all matches             | Best        | Default mode, ideal for filters               |
| `scoring_boolean`           | TF/IDF-based                           | Moderate    | Full relevance scoring                        |
| `constant_score_boolean`    | Same score, but with Boolean structure | Moderate    | Use with `must_not` or `minimum_should_match` |
| `top_terms_N`               | TF/IDF on top N terms                  | Efficient   | Truncates expansion                           |
| `top_terms_boost_N`         | Static boosts                          | Fast        | Less accurate                                 |
| `top_terms_blended_freqs_N` | Blended score                          | Balanced    | Best scoring/efficiency trade-off              |


## Available rewrite methods

The following table summarizes the available rewrite methods.

| Rewrite method | Description |
| [`constant_score`](#constant_score-default) | (Default) All expanded terms are evaluated together as a single unit, assigning the same score to every match. Matching documents are not scored individually, making it very efficient for filtering use cases. |
| [`scoring_boolean`](#scoring_boolean) | Breaks the query into a Boolean `should` clause with one term query per match. Each result is scored individually based on relevance. |
| [`constant_score_boolean`](#constant_score_boolean) | Similar to `scoring_boolean`, but all documents receive a fixed score regardless of term frequency. Maintains Boolean structure without TF/IDF weighting. |
| [`top_terms_N`](#top_terms_N) | Restricts scoring and execution to the N most frequent terms. Reduces resource usage and prevents clause overload. |
| [`top_terms_boost_N`](#top_terms_boost_N) | Like `top_terms_N`, but uses static boosting instead of full scoring. Offers performance improvements with simplified relevance. |
| [`top_terms_blended_freqs_N`](#top_terms_blended_freqs_N) | Chooses the top N matching terms and averages their document frequencies for scoring. Produces balanced scores without full term explosion. |

## Boolean-based rewrite limits

All Boolean-based rewrites, such as `scoring_boolean`, `constant_score_boolean`, and `top_terms_*`, are subject to the following [Dynamic cluster-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-cluster-level-index-settings):

```json
indices.query.bool.max_clause_count
```

This setting controls the maximum number of allowed Boolean `should` clauses (default: `1024`). If your query expands to the number of terms greater than this limit, it is rejected with a `too_many_clauses` error. 

For example, a wildcard, such as "error*", might expand to hundreds or thousands of matching terms, which could include: "error", "errors", "error_log", "error404", and others. Each of these terms turns into a separate term query. If the number of terms exceed the `indices.query.bool.max_clause_count` limit, the query fails:

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "error*",
        "rewrite": "scoring_boolean"
      }
    }
  }
}
```
{% include copy-curl.html %}

The query is expanded internally as follows:

```json
{
  "bool": {
    "should": [
      { "term": { "message": "error" } },
      { "term": { "message": "errors" } },
      { "term": { "message": "error_log" } },
      { "term": { "message": "error404" } },
      ...
    ]
  }
}
```

## Constant score 

The default `constant_score` rewrite method wraps all expanded terms into a single query and skips the scoring phase entirely. This approach offers the following characteristics:

* Executes all term matches as a single [bit array](https://en.wikipedia.org/wiki/Bit_array) query.
* Ignores scoring altogether; every document gets a `_score` of `1.0`.
* Fastest option; ideal for filtering.

The following example runs a `wildcard` query using the default `constant_score` rewrite method to efficiently filter documents matching the pattern `warning*` in the `message` field

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "warning*"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Scoring Boolean

The `scoring_boolean` rewrite method breaks the expanded terms into separate `term` queries combined under a Boolean `should` clause. This approach works as follows:

* Expands the wildcard into individual `term` queries inside a Boolean `should` clause.
* Each document’s score reflects how many terms it matches and the terms' frequency.

The following example uses a `scoring_boolean` rewrite configuration:

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "warning*",
        "rewrite": "scoring_boolean"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Constant score Boolean

The `constant_score_boolean` rewrite method uses the same Boolean structure as `scoring_boolean` but disables scoring, making it useful when clause logic is needed without relevance ranking. This method offers the following characteristics:

* Similar structure to `scoring_boolean`, but documents are not ranked.
* All matching documents receive the same score.
* Retains Boolean clause flexibility, such as using `must_not`, without ranking.

The following example query uses a `must_not` Boolean clause:

```json
POST /logs/_search
{
  "query": {
    "bool": {
      "must_not": {
        "wildcard": {
          "message": {
            "value": "error*",
            "rewrite": "constant_score_boolean"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This query is internally expanded as follows:

```json
{
  "bool": {
    "must_not": {
      "bool": {
        "should": [
          { "term": { "message": "error" } },
          { "term": { "message": "errors" } },
          { "term": { "message": "error_log" } },
          ...
        ]
      }
    }
  }
}
```

## Top terms N

The `top_terms_N` method is one of several rewrite options designed to balance scoring accuracy and performance when expanding multi-term queries. It works as follows:

* Only the N most frequently matching terms are selected and scored.
* Useful when you expect a large term expansion and want to limit the load.
* Other valid terms are ignored to preserve performance.

The following query uses the `top_terms_2` rewrite method to score only the two most frequent terms that match the `warning*` pattern in the `message` field:

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "warning*",
        "rewrite": "top_terms_2"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Top terms boost N

The `top_terms_boost_N` rewrite method selects the top N matching terms and applies static `boost` values instead of computing full relevance scores. It works as follows:

* Limits expansion to the top N terms like `top_terms_N`.
* Rather than computing TF/IDF, it assigns a preset boost to each term.
* Provides faster execution with predictable relevance weights.

The following example uses a `top_terms_boost_2` rewrite parameter:

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "warning*",
        "rewrite": "top_terms_boost_2"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Top terms blended frequencies N

The `top_terms_blended_freqs_N` rewrite method selects the top N matching terms and blends their document frequencies to produce more balanced relevance scores. This approach offers the following characteristics:

* Picks the top N matching terms and applies a blended frequency to all.
* Blending makes scoring smoother across terms that differ in frequency.
* Good trade-off when you want performance with realistic scoring.

The following example uses a `top_terms_blended_freqs_2` rewrite parameter:

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "warning*",
        "rewrite": "top_terms_blended_freqs_2"
      }
    }
  }
}
```
{% include copy-curl.html %}
