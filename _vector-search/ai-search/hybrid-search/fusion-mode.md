---
layout: default
title: Fusion mode
parent: Hybrid search
grand_parent: AI search
nav_order: 3
has_children: false
---

# Fusion mode
Introduced 3.10
{: .label .label-purple }

In fusion mode, also called in-query fusion, a [hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) normalizes and combines its subquery scores on the coordinating node. You configure the normalization and combination techniques in a `fusion` object inside the query itself, so a hybrid query that runs in fusion mode does not require a search pipeline.

Fusion mode is another way to run the same hybrid query. The subqueries, the normalization techniques, and the combination techniques are the same ones the [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) and [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) support, and the response has the same shape. The two approaches select the candidate documents differently: with a search pipeline, each subquery contributes its top results from each shard, whereas in fusion mode each subquery contributes its top `window_size` results across all shards. For more information, see [Candidate window size](#candidate-window-size). Both approaches remain supported, and you can continue to use a search pipeline.

All nodes in the cluster must run OpenSearch 3.10 or later. If any node runs an earlier version, a hybrid query that contains a `fusion` object is rejected.
{: .note}

## Example

The following example runs a hybrid query in fusion mode. The `fusion` object is empty, so OpenSearch applies the default techniques, and the request specifies no search pipeline:

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

The following equivalent example states every option explicitly. It normalizes with `min_max`, combines with `arithmetic_mean`, weights the keyword clause at `0.3` and the semantic clause at `0.7`, and fuses the top 100 results from each subquery:

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

The response has the same shape as the response to a hybrid query that uses a search pipeline.

## Fusion parameters

The `fusion` object accepts the following parameters. Any other parameter is rejected.

Parameter | Data type | Description
:--- | :--- | :---
`normalization` | Object | The score normalization configuration. Must be an object; a string value is rejected. Contains a `technique` and, for `rrf`, a `parameters` object. Optional. Default technique is `min_max`.
`combination` | Object | The score combination configuration. Must be an object; a string value is rejected. Contains a `technique` and an optional `parameters` object that may specify `weights`. Optional. Default technique is `arithmetic_mean`.
`window_size` | Integer | The number of results that each subquery contributes to fusion. Must be greater than `0`. Optional. Default is `100`. For more information, see [Candidate window size](#candidate-window-size).
`source` | String | Set to `pipeline` to read the normalization and combination configuration from the search pipeline that applies to the request instead of from the query. Cannot be combined with `normalization` or `combination`. Optional. For more information, see [Reading the configuration from a search pipeline](#reading-the-configuration-from-a-search-pipeline).

An empty `fusion` object runs the query in fusion mode with the default techniques. Providing only some of the parameters is also valid: for example, `"fusion": {"window_size": 50}` changes the window size and leaves both techniques at their defaults.

### Normalization and combination techniques

Fusion mode supports the same techniques as the normalization processor and the score ranker processor and applies the same formulas. Given the same set of candidate results, both approaches produce the same scores. The candidate set itself is selected differently, as described in [Candidate window size](#candidate-window-size).

Clause | Valid values | Default
:--- | :--- | :---
`normalization.technique` | `min_max`, `l2`, `z_score`, `rrf` | `min_max`
`combination.technique` | `arithmetic_mean`, `geometric_mean`, `harmonic_mean`, `rrf` | `arithmetic_mean`

The combination technique must be compatible with the normalization technique. Fusion mode applies the same compatibility rules as a search pipeline, so `z_score` supports only `arithmetic_mean`. For an explanation of what each technique does and guidance on choosing one, see [Normalization techniques]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/#normalization-techniques).

To combine results using reciprocal rank fusion (RRF), set both techniques to `rrf`. You can set the rank constant in `normalization.parameters.rank_constant`:

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

The `rank_constant` parameter applies only when the normalization technique is `rrf`. As in the [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/), you can instead specify `rank_constant` directly in the `combination` object, as in `"combination": {"technique": "rrf", "rank_constant": 60}`. Specify it in one place only: a request that sets different values in the two places is rejected, and a request that specifies `rank_constant` under `combination.parameters` is rejected. For more information about RRF, see [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/).

### Reading the configuration from a search pipeline

If you already have a search pipeline that contains a normalization processor or a score ranker processor, you can run the query in fusion mode and reuse that configuration by setting `source` to `pipeline`:

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

OpenSearch reads the normalization and combination techniques, and any `weights`, from the processor in the resolved search pipeline and then fuses the results on the coordinating node. The pipeline must be specified by name, either in the `search_pipeline` query parameter or in the `index.search.default_pipeline` index setting. A pipeline defined inline in the request body cannot be used as the source. You can also write `"fusion": "pipeline"` as a shorthand for `"fusion": {"source": "pipeline"}`. A string other than `pipeline` is rejected.

Because the configuration comes from the pipeline, `source` cannot be combined with an inline `normalization` or `combination` object. A request that specifies both is rejected. If the pipeline's normalization processor specifies the `lower_bounds` or `upper_bounds` parameters, the request is also rejected; see [Unsupported normalization parameters](#unsupported-normalization-parameters).
{: .note}

## Weighting subqueries

By default, every subquery contributes equally to the combined score. To weight subqueries differently, specify one weight for each subquery in the `weights` parameter of the combination parameters, inside the `fusion` object. This is the same `combination.parameters.weights` parameter that the [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/#request-body-fields) accepts:

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

The weights are validated by the same rules as in a search pipeline:

- Provide one weight for each subquery, in the same order as the `queries` array. If the number of weights does not match the number of subqueries, the request is rejected.
- Each weight must be in the range from `0.0` to `1.0`, inclusive.
- The weights must sum to `1.0`, within a tolerance of `0.01`.

If you set `source` to `pipeline`, fusion mode uses the weights that the pipeline's processor specifies. For more information, see [Reading the configuration from a search pipeline](#reading-the-configuration-from-a-search-pipeline).

## Candidate window size

The `window_size` parameter controls how many results each subquery contributes to fusion. OpenSearch collects up to `window_size` results for each subquery across all shards, normalizes and combines them on the coordinating node, and returns the requested page from the fused ranking. The default is `100`.

A larger window gives fusion a deeper pool of candidates, which can improve the fused ranking, but it also increases the amount of work the coordinating node performs for each request and the number of results each subquery must return.

When results are ordered by `_score`, which is the default, a hybrid query in fusion mode returns at most as many documents as the window holds. A page that extends past the last ranked document contains fewer than `size` results, and a page that starts past it is empty. Both responses return HTTP status `200`. To page deeper, increase `window_size` or set `pagination_depth`.

### Paginating fused results

In fusion mode, you can page through the results by using `from` and `size` without specifying `pagination_depth`. The requirement to specify `pagination_depth` when `from` is greater than `0` applies only to a hybrid query that uses a search pipeline.

You can still use the `pagination_depth` parameter with a hybrid query in fusion mode. The two parameters interact as follows:

- If you set `window_size`, it always determines the window.
- If you set `pagination_depth` but not `window_size`, OpenSearch raises the window to `pagination_depth`, but never lowers it below the default of `100`.

For more information about paginating hybrid results, see [Paginating hybrid query results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pagination/).

### Window size limits

Two settings limit the window:

- [`index.max_result_window`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/) (`10000` by default). When a request targets multiple indexes, the lowest value among them applies to the whole request.
- `indices.query.bool.max_clause_count` (`1024` by default). In fusion mode, the query that returns the fused page holds one clause for each ranked document and reserves one more clause, so the window must be less than this setting. With the default value, the resulting limit is `1023`.

If you set `window_size` explicitly and the value exceeds either limit, the request is rejected. The same limits apply to `pagination_depth` when it determines the window. For example, with the default settings, a hybrid query that uses a search pipeline accepts `"pagination_depth": 1024`, but a hybrid query in fusion mode rejects it.

If you do not set `window_size` and a limit reduces the default window to less than `100`, OpenSearch returns the results and adds a `Warning` header that names the setting responsible. For example, if a request targets `logs-*` and one of the matching indexes sets `index.max_result_window` to `10`, the window becomes `10` for the entire request. To choose the window yourself rather than accept the lowered one, set `window_size`.
{: .note}

## Rescoring

You can use the [`rescore`]({{site.url}}{{site.baseurl}}/query-dsl/rescore/) parameter with a hybrid query in fusion mode. Rescoring then works the way it does for a standard query: after the subquery scores are normalized and combined, each shard applies the rescore query to the top `rescore.window_size` documents of the fused ranking, and the coordinating node merges the rescored results. The rescore query is not applied to the individual subqueries.

The following example runs a hybrid query in fusion mode and uses a `match_phrase` rescore query to boost documents containing the exact phrase "search engine":

```json
POST /my-index/_search
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

- A rescore can reorder the documents that fusion ranked, but it cannot add a document that fusion did not rank. A document outside the fused window is not returned even if the rescore query matches it. To make more documents eligible, increase `fusion.window_size`.
- `rescore.window_size` is independent of `fusion.window_size`. It is the number of documents that each shard rescores, counted from the top of the fused ranking, and defaults to `10`. To let the rescore reach every document in the fused window, set it to at least `fusion.window_size`.
- The rescore is applied to the normalized, combined scores, and its contribution is not normalized afterward. Because fused scores are on a normalized scale (for example, from `0` to `1` for `min_max`), the rescore query's scores can be much larger. Use `query_weight` and `rescore_query_weight` to control how much the rescore changes the fused ranking.
- The hybrid query must be the request's top-level `query`. A request that contains a `rescore` and a hybrid query in fusion mode nested inside another query is rejected.
- As with any rescore, results can be ordered only by `_score`.
- The same rules apply to a rescore inside a `top_hits` aggregation.

## Limitations

A hybrid query in fusion mode does not support the following search request features. A request that combines any of them with a `fusion` object is rejected:

Feature | Notes
:--- | :---
`scroll` | A scroll request is rejected. To page through a large result set, use [Point in Time]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/point-in-time/) instead.
`terminate_after` | Not supported in fusion mode.
`indices_boost` | Not supported in fusion mode. To weight subqueries, see [Weighting subqueries](#weighting-subqueries).
`stored_fields` set to `_none_` | Not supported in fusion mode because every fused result must carry an `_id`. To omit the stored fields, specify an empty array (`"stored_fields": []`) instead.
[Derived fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/) defined in the search request | A request that defines derived fields in its body by using the `derived` parameter is rejected in fusion mode.
Cross-cluster search | A hybrid query in fusion mode cannot search remote clusters.

The following rules also apply:

- **All nodes must run OpenSearch 3.10 or later.** In a mixed-version cluster that contains an earlier node, a hybrid query that specifies `fusion` is rejected.
- **The hybrid query must be part of the request's `query`.** A hybrid query that specifies `fusion` in another position, such as a `post_filter`, an aggregation filter, a `sort`, a `rescore` query, or a highlight query, is rejected, as is one wrapped in a `wrapper` or `template` query. To filter or highlight by the same clauses, use a `bool` query with the subqueries as `should` clauses in that position. If the request also contains a `rescore`, the hybrid query must be the top-level `query` itself. For more information, see [Rescoring](#rescoring).
- **A hybrid query in fusion mode can be nested.** Unlike a hybrid query that uses a search pipeline, which must be the top-level query, a hybrid query that specifies `fusion` can be nested inside a `bool` query, a `dis_max` query, or another hybrid query that specifies `fusion`. When it is nested in a `bool` query, OpenSearch selects the fused window before applying the enclosing `bool` query's other clauses. To restrict the documents that the subqueries retrieve, use the hybrid query's own `filter` parameter instead.
- **Nested hybrid queries must use the same mode.** A `hybrid` query without a `fusion` object cannot be nested inside a `hybrid` query that has one, or the reverse. Specify `fusion` on both.

### Unsupported normalization parameters

The `min_max` normalization technique supports the `lower_bounds` and `upper_bounds` parameters when you configure it in a [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/#request-body-fields). **Fusion mode does not support these parameters.** A request is rejected, rather than silently ignoring the bounds, if its `fusion` object specifies them or if it sets `source` to `pipeline` and the resolved pipeline's normalization processor specifies them.

To use score bounds, configure the normalization in a search pipeline and run the hybrid query without a `fusion` object.
{: .note}

The only normalization parameter that fusion mode reads is `rank_constant`, and only when the normalization technique is `rrf`.

## Performance considerations

The following features are fully supported in fusion mode. They are listed here because each one can require OpenSearch to evaluate the subqueries over all matching documents on the shards, in addition to fusing the window, which can increase latency:

- Tracking the total number of hits beyond the window. By default, OpenSearch counts the matching documents up to the `track_total_hits` threshold (`10000` by default), and `"track_total_hits": true` counts all of them. If you do not need the total number of hits, set `track_total_hits` to `false`.
- Sorting by any sort key other than `_score`, including a field that acts as a tiebreaker after `_score`. For more information, see [Using sorting with a hybrid query]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/sorting/).
- [Collapsing results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/collapse/) with `inner_hits`, which expands each collapsed group. Collapsing without `inner_hits` applies to the fused results and does not require additional processing.
- [Aggregations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/aggregations/), which are computed over all matching documents rather than only the fused window, and highlighting, which requires the subqueries to be present on the shards.

Requesting an explanation with `explain` or a profile with `profile` is also supported and does not change the results.

## Disabling fusion mode

Fusion mode is enabled by default. To turn it off for a cluster, set `plugins.neural_search.hybrid.fusion.enabled` to `false`. The setting is dynamic, so you can change it without restarting nodes.

When fusion mode is disabled, a hybrid query that contains a `fusion` object is rejected. OpenSearch does not fall back to running the query through a search pipeline. The normalization and combination configuration is part of the query body, so a request written for fusion mode has no pipeline to fall back to, and returning results whose scores were never normalized would silently change the ranking. To run such a query on a cluster where fusion mode is disabled, remove the `fusion` object and attach a search pipeline that contains a normalization processor or a score ranker processor.
{: .note}

The number of subquery searches that a single request may run in fusion mode is limited by `plugins.neural_search.hybrid.fusion.max_leg_searches`. This limit matters only for requests that contain nested or multiple fused hybrid queries, because each subquery runs as a separate search.

For these settings and the related `plugins.neural_search.hybrid.fusion.fast_path_fetch_budget` setting, which affects only latency, see [Neural Search plugin settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#neural-search-plugin-settings).
