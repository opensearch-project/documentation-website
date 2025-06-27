---
layout: default
title: Rewrite
nav_order: 80
---

# Rewrite

Multi-term queries like `wildcard`, `prefix`, `regexp`, `fuzzy`, and `range` expand internally into sets of terms. The `rewrite` parameter allows you to control how these term expansions are executed and scored.

When a multi-term query expands into many terms (for example `prefix: "error*"` matching hundreds of terms), they are converted into actual term queries internally. This process can:

* Exceed the `indices.query.bool.max_clause_count` limit (default `1024`)
* Affect how scores are calculated for matching documents
* Impact memory and latency depending on the rewrite method used

## Available rewrite methods

| Rewrite method | Description |
| [`constant_score`](#constant_score-default) | (Default) All expanded terms are evaluated together as a single unit, assigning the same score to every match. Efficient for filtering use cases. |
| [`scoring_boolean`](#scoring_boolean) | Breaks the query into a Boolean `should` clause with one term query per match. Each result is scored individually based on relevance. |
| [`constant_score_boolean`](#constant_score_boolean) | Similar to `scoring_boolean`, but all documents receive a fixed score regardless of term frequency. Maintains Boolean structure without TF/IDF weighting. |
| [`top_terms_N`](#top_terms_N) | Restricts scoring and execution to the N most frequent terms. Reduces resource usage and prevents clause overload. |
| [`top_terms_boost_N`](#top_terms_boost_N) | Like `top_terms_N`, but uses static boosting instead of full scoring. Offers performance improvements with simplified relevance. |
| [`top_terms_blended_freqs_N`](#top_terms_blended_freqs_N) | Chooses the top N matching terms and averages their document frequencies for scoring. Produces balanced scores without full term explosion. |

## Boolean-based rewrite limits

All Boolean-based rewrites, such as `scoring_boolean`, `constant_score_boolean`, and `top_terms_*`, are subject to:

```json
indices.query.bool.max_clause_count
```

This setting controls the maximum number of allowed Boolean `should` clauses (default: 1024). If your query expands beyond this limit, it will be rejected with a `too_many_clauses` error.

## constant_score (default)

* Executes all term matches as a single bitset query.
* Ignores scoring altogether; every document gets `_score = 1.0`.
* Fastest option; ideal when filtering is the goal.

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

## scoring_boolean

* Expands the wildcard into individual `term` queries inside a Boolean `should` clause.
* Each document’s score reflects how many terms it matches and their term frequency.
* Can trigger `too_many_clauses` if many terms match.

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

## constant_score_boolean

* Similar structure to `scoring_boolean`, but documents are not ranked.
* All matching docs receive the same score.
* This retains Boolean clause flexibility (e.g., use with `must_not`) without ranking.

```json
POST /logs/_search
{
  "query": {
    "wildcard": {
      "message": {
        "value": "warning*",
        "rewrite": "constant_score_boolean"
      }
    }
  }
}
```
{% include copy-curl.html %}

## top_terms_N

* Only the N most frequent matching terms are selected and scored.
* Useful when you expect large expansion and want to limit load.
* Other valid terms are ignored to preserve performance.

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

## top_terms_boost_N

* Limits expansion to the top N terms like `top_terms_N`.
* Rather than computing TF/IDF, it assigns a pre-set boost per term.
* Provides faster execution with predictable relevance weights.

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

## top_terms_blended_freqs_N

* Picks the top N matching terms and applies a blended frequency to all.
* Blending makes scoring smoother across terms that differ in frequency.
* Good tradeoff when you want performance with realistic scoring.

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

## Summary

The `rewrite` parameter gives you control over how multi-term queries behave under the hood.

| Mode                        | Scores                                 | Performance | Notes                                         |
| --------------------------- | -------------------------------------- | ----------- | --------------------------------------------- |
| `constant_score`            | Same score for all matches             | Best        | Default mode, ideal for filters               |
| `scoring_boolean`           | TF/IDF-based                           | Moderate    | Full relevance scoring                        |
| `constant_score_boolean`    | Same score, but with Boolean structure | Moderate    | Use with `must_not` or `minimum_should_match` |
| `top_terms_N`               | TF/IDF on top N terms                  | Efficient   | Truncates expansion                           |
| `top_terms_boost_N`         | Static boosts                          | Fast        | Less accurate                                 |
| `top_terms_blended_freqs_N` | Blended score                          | Balanced    | Best scoring/efficiency tradeoff              |

