---
layout: default
title: Score ranker
has_children: false
parent: User-defined search processors
grand_parent: Search pipelines
nav_order: 117
---

# Score ranker processor
Introduced 2.19
{: .label .label-purple }

The `score-ranker-processor` is a rank-based search phase results processor that runs between the query and fetch phases of search execution. It intercepts the query phase results and then uses the reciprocal rank fusion (RRF) algorithm to combine the query clauses of a [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) into a final ranked list of search results. RRF scores each document based on the reciprocal of its rank in each query clause's results and then adds these scores together, so the relevance scores of the individual query clauses never need to be on comparable scales. For more information, see [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/).

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`combination.technique` | String | The technique used for combining scores. Valid value is `rrf`. Optional. Default is `rrf`.
`combination.rank_constant` | Integer | A constant added to each document's rank before calculating the reciprocal score. Valid values are in the [1, 10000] range. A larger rank constant makes the scores more uniform, reducing the influence of top-ranked results. A smaller rank constant creates a greater score difference between ranks, giving more weight to top-ranked items. Optional. Default is `60`.
`combination.parameters.weights` | Array of floating-point values | Specifies the weights to use for each query clause. Valid values are in the [0.0, 1.0] range and signify decimal percentages. The closer the weight is to 1.0, the more weight is given to a query clause. The number of values in the `weights` array must equal the number of query clauses. The sum of the values in the array must equal 1.0. Optional. If not provided, all query clauses are given equal weight.

## Example

The following request creates a search pipeline containing a `score-ranker-processor` that uses the `rrf` combination technique with the default rank constant of `60`:

```json
PUT /_search/pipeline/rrf-pipeline
{
  "description": "Post processor for hybrid RRF search",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following request sets `rank_constant` to `40` and applies custom weights to each query clause. Query clause 1 has a weight of 0.7, and query clause 2 has a weight of 0.3:

```json
PUT /_search/pipeline/rrf-pipeline
{
  "description": "Post processor for hybrid RRF search",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf",
          "rank_constant": 40,
          "parameters": {
            "weights": [
              0.7,
              0.3
            ]
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

To use the pipeline, specify it in a search request containing a `hybrid` query:

```json
GET /my-nlp-index/_search?search_pipeline=rrf-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "passage_text": "running shoes"
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "running shoes",
              "model_id": "aVeif4oB5Vm0Tdw8zYO2",
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

## Related documentation

- [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/)
- [Hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/)
- [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/)
