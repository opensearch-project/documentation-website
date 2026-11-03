---
layout: default
title: Fusion mode
parent: Hybrid search
grand_parent: AI search
nav_order: 3
---

# Fusion mode
Introduced 3.10
{: .label .label-purple }

In fusion mode, also called in-query fusion, a [hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) normalizes and combines its subquery scores on the coordinating node. You configure the normalization and combination techniques in a `fusion` object inside the query itself, so a hybrid query that runs in fusion mode does not require a search pipeline.

Fusion mode is another way to run the same hybrid query. The subqueries, the normalization techniques, and the combination techniques are the same ones the [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) and [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) support, and the response has the same format.

Consider using fusion mode in the following cases:

- You want to run hybrid search without creating and maintaining a search pipeline. The normalization and combination configuration is part of each request, so different requests to the same index can use different techniques or weights.
- You want candidate selection that does not depend on the number of shards. With a search pipeline, each subquery contributes its top results from each shard, so the set of candidates increases with the number of shards. In fusion mode, each subquery contributes its top `window_size` results across all shards, so the set of candidates is the same regardless of how the documents are distributed. For more information, see [Candidate window size](#candidate-window-size).
- You need to nest the hybrid query inside another query, such as a `bool` or `dis_max` query, or apply a `rescore` to the combined results. For more information, see [Nesting a hybrid query](#nesting-a-hybrid-query) and [Rescoring](#rescoring).

Use a search pipeline if you need the `lower_bounds` and `upper_bounds` normalization parameters or paging deeper than the [window size limits](#window-size-limits) allow. For a complete list, see [Limitations](#limitations).

To use fusion mode, all nodes in the cluster must run OpenSearch 3.10 or later.
{: .important}

## Example

The examples on this page use the index and model created in the [Hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/) steps.

The following example runs a hybrid query in fusion mode. The `fusion` object is empty, so OpenSearch applies the default techniques, and the request specifies no search pipeline. The `neural` clause sets `k` to `100` (the default window size) so that the clause can contribute a full window of results:

```json
GET /my-nlp-index/_search
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "fusion": {},
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
              "k": 100
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The following request sets each option explicitly. It uses `min_max` normalization and `arithmetic_mean` combination, assigns a weight of `0.3` to the keyword clause and `0.7` to the semantic clause, and considers up to the top 100 results from each subquery:

```json
GET /my-nlp-index/_search
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "fusion": {
        "window_size": 100,
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [
              0.3,
              0.7
            ]
          }
        }
      },
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
              "k": 100
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response has the same format as the [response to a hybrid query that uses a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#step-5-search-the-index-using-hybrid-search).

## Fusion parameters

The `fusion` object accepts the following parameters. All parameters are optional. An empty `fusion` object uses the default values.

Parameter | Data type | Description
:--- | :--- | :---
`normalization` | Object | The score normalization configuration. For the fields this object contains, see [Normalization fields](#normalization-fields).
`combination` | Object | The score combination configuration. For the fields this object contains, see [Combination fields](#combination-fields).
`window_size` | Integer | The number of results that each subquery contributes to fusion. Must be greater than `0` and within the [window size limits](#window-size-limits). Default is `100`. For more information, see [Candidate window size](#candidate-window-size).
`source` | String | Set to `pipeline` to read the normalization and combination configuration from a search pipeline. Cannot be combined with `normalization` or `combination`. For more information, see [Reading the configuration from a search pipeline](#reading-the-configuration-from-a-search-pipeline).

### Normalization fields

The `normalization` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`technique` | String | The technique for normalizing scores. Valid values are `min_max`, `l2`, `z_score`, and `rrf`. Default is `min_max`.
`parameters` | Object | When `technique` is `rrf`, can contain `rank_constant`, an integer in the range from `1` to `10000` (default `60`). The `lower_bounds` and `upper_bounds` parameters are not supported in fusion mode.

### Combination fields

The `combination` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`technique` | String | The technique for combining scores. Valid values are `arithmetic_mean`, `geometric_mean`, `harmonic_mean`, and `rrf`. Default is `arithmetic_mean`. If the normalization technique is `z_score`, the combination technique must be `arithmetic_mean`. To use reciprocal rank fusion (RRF), set both the normalization and combination techniques to `rrf`.
`parameters` | Object | Can contain `weights`, an array with one weight for each subquery, in the same order as the `queries` array. Each weight must be in the range from `0.0` to `1.0`, and the weights must sum to `1.0`, within a tolerance of `0.01`. If not specified, all subqueries are weighted equally. For more information, see [Weighting subqueries](#weighting-subqueries).
`rank_constant` | Integer | The RRF rank constant, specified in the `combination` object as in the [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/). An alternative to `normalization.parameters.rank_constant`; specify it in only one of these locations. Valid values are in the range from `1` to `10000`. Default is `60`.

For an explanation of each technique and guidance on choosing one, see [Normalization techniques]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/#normalization-techniques) and [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/).

### Using reciprocal rank fusion

To combine results using RRF, set both techniques to `rrf`. Optionally, set the rank constant:

```json
"fusion": {
  "normalization": {
    "technique": "rrf",
    "parameters": {
      "rank_constant": 60
    }
  },
  "combination": {
    "technique": "rrf"
  }
}
```
{% include copy.html %}

### Reading the configuration from a search pipeline

If you already have a search pipeline that contains a normalization processor or a score ranker processor, you can run the query in fusion mode and reuse that pipeline's configuration, including its weights, by setting `source` to `pipeline`:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "fusion": {
        "source": "pipeline"
      },
      "queries": [
        {
          "match": {
            "passage_text": {
              "query": "Hi world"
            }
          }
        },
        {
          "term": {
            "passage_text": {
              "value": "planet"
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch uses the pipeline specified in the `search_pipeline` query parameter or, if the request does not specify one, the index's [default search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/#default-search-pipeline). The pipeline must contain a normalization processor or a score ranker processor, and its normalization processor cannot use `lower_bounds` or `upper_bounds`. You can also write `"fusion": "pipeline"` as a shorthand for `"fusion": {"source": "pipeline"}`.

## Weighting subqueries

By default, every subquery contributes equally to the combined score. To weight subqueries differently, specify one weight for each subquery in `combination.parameters.weights`. The following example weights the first subquery at `0.3` and the second at `0.7`:

```json
"fusion": {
  "combination": {
    "technique": "arithmetic_mean",
    "parameters": {
      "weights": [
        0.3,
        0.7
      ]
    }
  }
}
```
{% include copy.html %}

For valid values, see [Combination fields](#combination-fields).

## Candidate window size

The `window_size` parameter controls how many results each subquery contributes to fusion. OpenSearch collects up to `window_size` results for each subquery across all shards, normalizes and combines them, and returns the requested page from the combined ranking. The default is `100`.

A larger window can improve the combined ranking but increases the work required for each request.

A `knn` or `neural` subquery returns at most `k` results from each shard or segment, regardless of `window_size`. A `neural` subquery that does not specify `k` uses the default of `10`. To let a vector subquery fill the window, set `k` to at least `window_size`. For more information, see [The number of returned results]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/#the-number-of-returned-results).

For a top-level hybrid query, when results are sorted by `_score` (the default), the query returns at most as many documents as the window contains. A page that starts past the end of the window is empty. To page deeper, increase `window_size`.

### Paginating results

In fusion mode, you can page through results using `from` and `size` without specifying `pagination_depth`. If you specify `pagination_depth` but not `window_size`, the window is set to `pagination_depth` or `100`, whichever is larger. If you specify `window_size`, it determines the window and `pagination_depth` has no effect. For more information, see [Paginating hybrid query results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pagination/).

### Window size limits

The window cannot exceed either of the following limits:

- The [`index.max_result_window`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/) setting (default `10000`). When a request targets multiple indexes, the lowest value among them applies.
- One less than the `indices.query.bool.max_clause_count` setting. With the default value of `1024`, the maximum window is `1023`.

These limits apply to `window_size` and, when `window_size` is not set, to `pagination_depth`.

If you do not set `window_size` and a limit is lower than the default window of `100`, OpenSearch uses the lower value and returns a `Warning` header naming the setting. For example, if a request targets `logs-*` and one of the matching indexes sets `index.max_result_window` to `10`, the window is `10` for the entire request.
{: .note}

## Nesting a hybrid query

A hybrid query that uses a search pipeline must be the top-level query. A hybrid query in fusion mode can be nested inside a `bool` query, a `dis_max` query, or another hybrid query that specifies `fusion`.

When a hybrid query in fusion mode is nested in a `bool` query, OpenSearch selects the candidate window before applying the enclosing `bool` query's other clauses, and a `must` or `filter` clause in the enclosing query can remove documents from the window. If OpenSearch runs the subqueries a second time, as it does by default to count total hits, the results can include documents from outside the window, to which the hybrid query assigns a score of `0`. Otherwise, the results include only the documents in the window that match the enclosing query, so they can contain fewer documents than requested. To restrict the documents that the subqueries retrieve, use the hybrid query's own `filter` parameter.

## Limitations

A hybrid query in fusion mode does not support the following features:

- The `lower_bounds` and `upper_bounds` normalization parameters. To use score bounds, configure normalization in a search pipeline and omit the `fusion` object.
- A `scroll` request. To page through a large result set, use [Point in Time]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/point-in-time/).
- The `terminate_after` parameter.
- The `indices_boost` parameter. To weight subqueries, see [Weighting subqueries](#weighting-subqueries).
- The `stored_fields` parameter set to `_none_`. To omit stored fields, specify an empty array (`"stored_fields": []`).
- [Derived fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/) defined in the search request.
- Cross-cluster search.

The hybrid query must be in the request's `query`. To filter or highlight by the same clauses elsewhere in the request, use a `bool` query with the subqueries as `should` clauses.

## Rescoring

You can use the [`rescore`]({{site.url}}{{site.baseurl}}/query-dsl/rescore/) parameter with a hybrid query in fusion mode. The rescore query is applied to the top documents of the combined ranking, after normalization and combination, as it is for a standard query.

The following example runs a hybrid query in fusion mode and uses a `match_phrase` rescore query to boost documents containing the exact phrase "search engine":

```json
GET /my-index/_search
{
  "query": {
    "hybrid": {
      "fusion": {},
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

When using rescoring in fusion mode, note the following considerations:

- A rescore can reorder documents in the candidate window but cannot add documents outside it. To make more documents eligible, increase `fusion.window_size`.
- The `rescore.window_size` parameter (default `10`) is the number of documents that each shard rescores, counted from the top of the combined ranking. To rescore every document in the candidate window, set it to at least `fusion.window_size`.
- Combined scores are on a normalized scale (for example, 0--1 for `min_max`), but rescore query scores are not normalized and can be much larger. Use `query_weight` and `rescore_query_weight` to control how much the rescore changes the ranking.
- The hybrid query must be the top-level `query` and cannot be nested inside another query.

## Performance considerations

The following features are supported in fusion mode but require OpenSearch to run the subqueries a second time on every shard, which increases latency:

- Counting total hits beyond the window. By default, OpenSearch counts matching documents up to the `track_total_hits` threshold (`10000` by default), which can require the second run. Setting `track_total_hits` to `true` always requires it.
- Sorting by any field other than `_score`, including a tiebreaker after `_score`. For more information, see [Using sorting with a hybrid query]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/sorting/).
- [Collapsing results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/collapse/) with `inner_hits`. Collapsing without `inner_hits` requires the second run only to count total hits, so setting `track_total_hits` to `false` avoids it.
- [Aggregations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/aggregations/), which are computed over all matching documents, not only the candidate window.
- Highlighting.

The added latency is usually small for keyword subqueries. For a `knn` or `neural` subquery, it can include an additional vector search on every shard. When a hybrid query in fusion mode is nested inside another hybrid query in fusion mode, the added latency can also include a second model inference for each `neural` subquery of the nested query.

To reduce latency, use the following options:

- If you do not need the total number of hits, set `track_total_hits` to `false`.
- If you only need to know whether more results exist than the page shows, set `track_total_hits` to a value no greater than `window_size`.
- Request sorting, collapsing with `inner_hits`, aggregations, and highlighting only when you need them.

To determine whether a request ran the subqueries a second time, run it with `"profile": true`. In the `profile` section of the response, the coordinating node entry contains a `FusedHybridQuery` node. In its `debug` section, `tail_built` is `true` if the subqueries ran a second time, and `legs` lists the time each subquery took.

## Disabling fusion mode

Fusion mode is enabled by default. To disable it, set the `plugins.neural_search.hybrid.fusion.enabled` cluster setting to `false`. The setting is dynamic, so you can change it without restarting nodes.

When fusion mode is disabled, hybrid queries must use a search pipeline. To run a fusion mode query, remove the `fusion` object and specify a search pipeline that contains a normalization processor or a score ranker processor.

## Related settings

The `plugins.neural_search.hybrid.fusion.max_leg_searches` setting limits the total number of subqueries across all hybrid queries in fusion mode within one request. It applies only to requests that contain nested or multiple hybrid queries in fusion mode. For this setting and the `plugins.neural_search.hybrid.fusion.fast_path_fetch_budget` setting, see [Neural Search plugin settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#neural-search-plugin-settings).
