---
layout: default
title: Hybrid score explanation
nav_order: 15
has_children: false
parent: User-defined search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/explanation-processor/
---

# Hybrid score explanation processor
Introduced 2.19
{: .label .label-purple }

The `hybrid_score_explanation` response processor adds the normalization and combination results to the returned search response. You can use it as a debugging tool to understand the score normalization process. For more information, see [Hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/).

To use the `explain` parameter, you must configure the `hybrid_score_explanation` response processor in your search pipeline.
{: .important}

## Request body fields

The following table lists all request fields.

Field | Data type | Description
:--- | :--- | :---
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example

The following example demonstrates using a search pipeline with a `hybrid_score_explanation` processor.

For a comprehensive example, follow the [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search#tutorial).

### Creating a search pipeline 

The following request creates a search pipeline containing a `normalization-processor` and a `hybrid_score_explanation` processor:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean"
        }
      }
    }
  ],
  "response_processors": [
    {
        "hybrid_score_explanation": {}
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

To see explanation information, specify `explain=true` in your search request:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline&explain=true
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "text": {
              "query": "horse"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "wild west",
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

#### Example response

```json
{
    "took": 54,
    "timed_out": false,
    "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 5,
            "relation": "eq"
        },
        "max_score": 0.9251075,
        "hits": [
            {
                "_shard": "[my-nlp-index][0]",
                "_node": "IsuzeVYdSqKUfy0qfqil2w",
                "_index": "my-nlp-index",
                "_id": "5",
                "_score": 0.9251075,
                "_source": {
                    "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
                    "id": "2691147709.jpg"
                },
                "_explanation": {
                    "value": 0.9251075,
                    "description": "arithmetic_mean combination of:",
                    "details": [
                        {
                            "value": 1.0,
                            "description": "min_max normalization of:",
                            "details": [
                                {
                                    "value": 1.2336599,
                                    "description": "weight(text:horse in 0) [PerFieldSimilarity], result of:",
                                    "details": [
                                        {
                                            "value": 1.2336599,
                                            "description": "score(freq=1.0), computed as boost * idf * tf from:",
                                            "details": [
                                                {
                                                    "value": 2.2,
                                                    "description": "boost",
                                                    "details": []
                                                },
                                                {
                                                    "value": 1.2039728,
                                                    "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                                                    "details": [
                                                        {
                                                            "value": 1,
                                                            "description": "n, number of documents containing term",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 4,
                                                            "description": "N, total number of documents with field",
                                                            "details": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "value": 0.46575344,
                                                    "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                                                    "details": [
                                                        {
                                                            "value": 1.0,
                                                            "description": "freq, occurrences of term within document",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 1.2,
                                                            "description": "k1, term saturation parameter",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 0.75,
                                                            "description": "b, length normalization parameter",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 16.0,
                                                            "description": "dl, length of field",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 17.0,
                                                            "description": "avgdl, average length of field",
                                                            "details": []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "value": 0.8503647,
                            "description": "min_max normalization of:",
                            "details": [
                                {
                                    "value": 0.015177966,
                                    "description": "within top 5",
                                    "details": []
                                }
                            ]
                        }
                    ]
...
```

For more information about setting up hybrid search, see [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).