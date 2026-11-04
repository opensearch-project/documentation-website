---
layout: default
title: Fusion mode
parent: Hybrid search
grand_parent: AI search
nav_order: 3
---

# Fusion mode
**Introduced 3.10**
{: .label .label-purple }

In fusion mode, also called in-query fusion, a [hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) normalizes and combines its subquery scores on the coordinating node. You configure the normalization and combination techniques in a `fusion` object inside the query itself, so a hybrid query that runs in fusion mode does not require a search pipeline.

Fusion mode is another way to run the same hybrid query. The subqueries, the normalization techniques, and the combination techniques are the same ones the [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) and [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) support, and the response has the same format.

For guidance on choosing between fusion mode and a search pipeline, see [Choosing between a search pipeline and fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#choosing-between-a-search-pipeline-and-fusion-mode).

To use fusion mode, all nodes in the cluster must run OpenSearch 3.10 or later.
{: .important}

## Using fusion mode

The examples in this section use the index created in [Configuring score-based hybrid search using a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#configuring-score-based-hybrid-search-using-a-search-pipeline). You do not need the search pipeline created in Step 3. Before running the examples, complete the following prerequisite and steps on that page:

- The prerequisite, which describes the text embedding model and what to do if you have already generated embeddings
- [Step 1: Create an ingest pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#step-1-create-an-ingest-pipeline)
- [Step 2: Create an index for ingestion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#step-2-create-an-index-for-ingestion)
- [Step 4: Ingest documents into the index]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#step-4-ingest-documents-into-the-index)

### Using score-based combination

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

Alternatively, you can set each option explicitly. The following request uses `min_max` normalization and `arithmetic_mean` combination, considers up to the top 100 results from each subquery, and uses the `weights` parameter to assign a weight of `0.3` to the keyword clause and `0.7` to the semantic clause:

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
      "weights": [
        0.3,
        0.7
      ],
      "fusion": {
        "window_size": 100,
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean"
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

### Using rank-based combination

To combine results using reciprocal rank fusion (RRF), set both the normalization and combination techniques to `rrf`. Optionally, set the rank constant. The following request sets the rank constant to `60`, the default value:

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
        "normalization": {
          "technique": "rrf",
          "parameters": {
            "rank_constant": 60
          }
        },
        "combination": {
          "technique": "rrf"
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

## Reading the configuration from a search pipeline

If you already have a search pipeline that contains a normalization processor or a score ranker processor, you can run the query in fusion mode and reuse that pipeline's configuration, including its weights, by setting `source` to `pipeline`. The following example uses the `nlp-search-pipeline` created in [Step 3 of Configuring hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#step-3-configure-a-search-pipeline):

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

To use the pipeline's techniques with different weights for a single request, see [Overriding the pipeline's weights](#overriding-the-pipelines-weights).

## Fusion parameters

The `fusion` object accepts the following parameters. All parameters are optional. An empty `fusion` object uses the default values.

Parameter | Data type | Description
:--- | :--- | :---
`normalization` | Object | The score normalization configuration. For the fields this object contains, see [Normalization fields](#normalization-fields).
`combination` | Object | The score combination configuration. For the fields this object contains, see [Combination fields](#combination-fields).
`window_size` | Integer | The number of results that each subquery contributes to fusion. Must be greater than `0` and within the [window size limits](#window-size-limits). Default is `100`. For more information, see [Candidate window size](#candidate-window-size).
`source` | String | Set to `pipeline` to read the normalization and combination configuration from a search pipeline. Cannot be combined with `normalization` or `combination`. For more information, see [Reading the configuration from a search pipeline](#reading-the-configuration-from-a-search-pipeline).

### Normalization fields

The `normalization` object contains the following fields. All fields are optional.

Field | Data type | Description
:--- | :--- | :---
`technique` | String | The technique for normalizing scores. Valid values are `min_max`, `l2`, `z_score`, and `rrf`. Default is `min_max`.
`parameters` | Object | When `technique` is `rrf`, can contain `rank_constant`, an integer in the range from `1` to `10000` (default `60`). The `lower_bounds` and `upper_bounds` parameters are not supported in fusion mode.

### Combination fields

The `combination` object contains the following fields. All fields are optional.

Field | Data type | Description
:--- | :--- | :---
`technique` | String | The technique for combining scores. Valid values are `arithmetic_mean`, `geometric_mean`, `harmonic_mean`, and `rrf`. Default is `arithmetic_mean`. If the normalization technique is `z_score`, the combination technique must be `arithmetic_mean`. To use reciprocal rank fusion (RRF), set both the normalization and combination techniques to `rrf`.
`parameters` | Object | Contains the `weights` array, an alternative to the `hybrid` query's `weights` parameter. For more information, see [Weighting subqueries](#weighting-subqueries).
`rank_constant` | Integer | The RRF rank constant, specified in the `combination` object as in the [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/). An alternative to `normalization.parameters.rank_constant`; specify it in only one of these locations. Valid values are in the range from `1` to `10000`. Default is `60`.

For an explanation of each technique and guidance on choosing one, see [Normalization techniques]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/#normalization-techniques) and [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/).

## Weighting subqueries

By default, every subquery contributes equally to the combined score. To weight subqueries differently, add a `weights` array to the `hybrid` query, containing one weight for each subquery, in the same order as the `queries` array. For an example, see the second request in [Using score-based combination](#using-score-based-combination). For valid values, see [Weighting subqueries]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/#weighting-subqueries) in the hybrid query documentation.

In fusion mode, you can instead specify the weights in `combination.parameters.weights` within the `fusion` object. Both forms have the same effect. We recommend the `hybrid` query's `weights` parameter because the same syntax also applies to queries that use a search pipeline. Specify one form or the other: a query that contains both is rejected, even if the values are the same. The following `fusion` object has the same effect as the second request in [Using score-based combination](#using-score-based-combination):

```json
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
}
```
{% include copy.html %}

OpenSearch rejects a `weights` key placed directly in the `fusion` object. Specify `weights` in the `hybrid` query.

### Overriding the pipeline's weights

To use a search pipeline's techniques with weights that you choose for the request, add the `weights` parameter to the `hybrid` query and set `source` to `pipeline`. The following example uses the `"fusion": "pipeline"` shorthand and weights the subqueries at `0.3` and `0.7`:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "weights": [
        0.3,
        0.7
      ],
      "fusion": "pipeline",
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

The request's weights replace the pipeline's weights for this request only.

## Candidate window size

The `window_size` parameter controls how many results each subquery contributes to fusion. OpenSearch collects up to `window_size` results for each subquery across all shards, normalizes and combines them, and returns the requested page from the combined ranking. The default is `100`.

A larger window can improve the combined ranking but increases the work required for each request.

A `knn` or `neural` subquery returns at most `k` results from each shard or segment, regardless of `window_size`. A `neural` subquery that does not specify `k` uses the default of `10`. To let a vector subquery fill the window, set `k` to at least `window_size`. For more information, see [The number of returned results]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/#the-number-of-returned-results).

For a top-level hybrid query, when results are sorted by `_score` (the default), the query returns at most as many documents as the window contains. A page that starts past the end of the window is empty. To paginate deeper, increase `window_size`.

### Paginating results

In fusion mode, you can paginate results using `from` and `size` without specifying `pagination_depth`. If you specify `pagination_depth` but not `window_size`, the window is set to `pagination_depth` or `100`, whichever is larger. If you specify `window_size`, it determines the window and `pagination_depth` has no effect. For more information, see [Paginating hybrid query results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pagination/).

### Window size limits

The window cannot exceed either of the following limits:

- The [`index.max_result_window`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/) setting (default `10000`). When a request targets multiple indexes, the lowest value among them applies.
- One less than the `indices.query.bool.max_clause_count` setting. With the default value of `1024`, the maximum window is `1023`.

These limits apply to `window_size` and, when `window_size` is not set, to `pagination_depth`.

If you do not set `window_size` and a limit is lower than the default window of `100`, OpenSearch uses the lower value and returns a `Warning` header naming the setting. For example, if a request targets `logs-*` and one of the matching indexes sets `index.max_result_window` to `10`, the window is `10` for the entire request.
{: .note}

## Nesting a hybrid query

A hybrid query that uses a search pipeline must be the top-level query. A hybrid query in fusion mode can be nested inside a `bool` query, a `dis_max` query, or another hybrid query that specifies `fusion`.

A hybrid query in fusion mode must be in the request's `query` object. It cannot be used elsewhere, such as in a `post_filter` or `highlight_query`. To filter or highlight by the same clauses, use a `bool` query with the subqueries as `should` clauses.

When a hybrid query in fusion mode is nested in a `bool` query, OpenSearch selects the candidate window before applying the enclosing `bool` query's other clauses, so a `must` or `filter` clause in the enclosing query can remove documents from the window. The effect on the results depends on whether OpenSearch runs the subqueries a second time, which it does by default to count total hits:

- If OpenSearch runs the subqueries a second time, the results can include documents outside the window. The hybrid query contributes a score of `0` to these documents.
- Otherwise, the results include only the documents in the window that match the enclosing query and can contain fewer documents than requested.

To restrict the documents that the subqueries retrieve, use the hybrid query's own `filter` parameter.

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

## Limitations

A hybrid query in fusion mode does not support the following features:

- The `lower_bounds` and `upper_bounds` normalization parameters. To use score bounds, configure normalization in a search pipeline and omit the `fusion` object.
- A `scroll` request. To paginate a large result set, use [Point in Time]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/point-in-time/).
- The `terminate_after` parameter.
- The `indices_boost` parameter. To weight subqueries, see [Weighting subqueries](#weighting-subqueries).
- The `stored_fields` parameter set to `_none_`. To omit stored fields, specify an empty array (`"stored_fields": []`).
- [Derived fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/) defined in the search request.
- Cross-cluster search.

## Performance considerations

The following features are supported in fusion mode but require OpenSearch to run the subqueries a second time on every shard, which increases latency:

- Counting total hits beyond the window. By default, OpenSearch counts matching documents up to the `track_total_hits` threshold (`10000` by default), which requires the second run. For a top-level hybrid query, OpenSearch can skip the second run if one of the subqueries matches more documents than the threshold. Setting `track_total_hits` to `true` always requires the second run.
- Sorting by any field other than `_score`, including a tiebreaker after `_score`. For more information, see [Using sorting with a hybrid query]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/sorting/).
- [Collapsing results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/collapse/) with `inner_hits`. Collapsing without `inner_hits` requires the second run only to count total hits, so setting `track_total_hits` to `false` avoids it.
- [Aggregations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/aggregations/), which are computed over all matching documents, not only the candidate window.
- Highlighting.

The added latency is usually small for keyword subqueries. For a `knn` or `neural` subquery, it can include an additional vector search on every shard. When a fusion mode hybrid query is nested inside another one, the added latency can also include a second model inference for each `neural` subquery in the nested query.

To reduce latency, use the following options:

- If you do not need the total number of hits, set `track_total_hits` to `false`.
- If you only need to know whether more results exist than the page shows, set `track_total_hits` to a value no greater than `window_size`.
- Request sorting, collapsing with `inner_hits`, aggregations, and highlighting only when you need them.

To determine whether a request ran the subqueries a second time, run it with `"profile": true`. In the `profile` section of the response, the coordinating node entry contains a `FusedHybridQuery` node. In its `debug` section, `tail_built` is `true` if the subqueries ran a second time, and `legs` lists the time each subquery took.

## Disabling fusion mode

Fusion mode is enabled by default. To disable it, set the `plugins.neural_search.hybrid.fusion.enabled` cluster setting to `false`. The setting is dynamic, so you can change it without restarting nodes. For more information, see [Neural Search plugin settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#neural-search-plugin-settings).

When fusion mode is disabled, hybrid queries must use a search pipeline. To convert a fusion mode query to use a search pipeline, remove the `fusion` object and specify a search pipeline that contains a normalization processor or a score ranker processor. For an example, see [Configuring score-based hybrid search using a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/index/#configuring-score-based-hybrid-search-using-a-search-pipeline).

## Related settings

The `plugins.neural_search.hybrid.fusion.max_leg_searches` setting limits the total number of subqueries across all hybrid queries in fusion mode within one request. It applies only to requests that contain nested or multiple hybrid queries in fusion mode. For this setting and the `plugins.neural_search.hybrid.fusion.fast_path_fetch_budget` setting, see [Neural Search plugin settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#neural-search-plugin-settings).
