---
layout: default
title: Neural sparse ANN explain
parent: Neural sparse
grand_parent: Specialized queries
nav_order: 10
---

# Neural sparse ANN query explain
**Introduced 3.5**
{: .label .label-purple }

You can provide the `explain` parameter to understand how scores are calculated in neural sparse ANN queries. When enabled, it provides detailed information about the scoring process for each search result, including query token pruning, quantized dot product calculations, quantization rescaling, and filter application. This comprehensive insight makes it easier to understand and optimize your neural sparse ANN query results. For more information about `explain`, see [Explain API]({{site.url}}{{site.baseurl}}/api-reference/explain/).

`explain` is an expensive operation in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning }

You can provide the `explain` parameter in a URL when running a neural sparse ANN query using the following syntax:

```json
GET <index>/_search?explain=true
POST <index>/_search?explain=true
```

The `explain` parameter works for the following types of neural sparse ANN search:

- Basic neural sparse ANN search
- Neural sparse ANN search with filters

You can provide the `explain` parameter as a query parameter:

```json
GET my-sparse-index/_search?explain=true
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_tokens": {
          "7001": 6.25,
          "3509": 5.57
        },
        "method_parameters": {
          "k": 5,
          "top_n": 6
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, you can provide the `explain` parameter in the request body:

```json
GET my-sparse-index/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_tokens": {
          "7001": 6.25,
          "3509": 5.57
        },
        "method_parameters": {
          "k": 5,
          "top_n": 3
        }
      }
    }
  },
  "explain": true
}
```
{% include copy-curl.html %}

## Explanation structure

The explanation follows a hierarchical structure that mirrors the neural sparse ANN scoring process. The explanation includes the following components:

1. **Query token pruning**: Shows how many tokens were kept after pruning.
2. **Raw dot product score**: Breaks down the quantized dot product calculation with individual token contributions.
3. **Quantization rescaling**: Explains how the raw score is converted back to float scale.
4. **Filter explanation** (when applicable): Provides information about filter application and search mode.

## Example: Basic neural sparse ANN search

The following example shows a basic neural sparse ANN search with explanation:

```json
GET my-sparse-index/_search?explain=true
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_tokens": {
          "13723": 0.75,
          "9266": 0.61,
          "2078": 0.35,
          "2365": 0.41
        },
        "method_parameters": {
          "k": 10,
          "top_n": 6
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 15,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 16.059792,
    "hits": [
      {
        "_shard": "[my-sparse-index][0]",
        "_node": "iId6ipt-SCWA-7vHLh981Q",
        "_index": "my-sparse-index",
        "_id": "1",
        "_score": 16.059792,
        "_source": {
          "sparse_embedding": {
            "13723": 3.16,
            "9266": 2.85,
            "2078": 1.09,
            "2365": 0.22
          }
        },
        "_explanation": {
          "value": 16.059792,
          "description": "sparse_ann score for doc 94830 in field 'sparse_embedding'",
          "details": [
            {
              "value": 6,
              "description": "query token pruning: kept top 6 of 33 tokens",
              "details": []
            },
            {
              "value": 21756,
              "description": "raw dot product score (quantized): 21756",
              "details": [
                {
                  "value": 9494,
                  "description": "token '13723' contribution: query_weight=47 * doc_weight=202",
                  "details": []
                },
                {
                  "value": 7098,
                  "description": "token '9266' contribution: query_weight=39 * doc_weight=182",
                  "details": []
                },
                {
                  "value": 1540,
                  "description": "token '2078' contribution: query_weight=22 * doc_weight=70",
                  "details": []
                },
                {
                  "value": 364,
                  "description": "token '2365' contribution: query_weight=26 * doc_weight=14",
                  "details": []
                }
              ]
            },
            {
              "value": 0.0007381776,
              "description": "quantization rescaling: 1.0000 * 3.00 * 16.00 / 255 / 255 = 0.000738",
              "details": [
                {
                  "value": 1,
                  "description": "original boost: 1.0000",
                  "details": []
                },
                {
                  "value": 3,
                  "description": "ceiling_ingest (quantization parameter): 3.00",
                  "details": []
                },
                {
                  "value": 16,
                  "description": "ceiling_search (quantization parameter): 16.00",
                  "details": []
                },
                {
                  "value": 255,
                  "description": "MAX_UNSIGNED_BYTE_VALUE: 255",
                  "details": []
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```
</details>

## Example: Neural sparse ANN search with filter

The following example shows a neural sparse ANN search with a filter and explanation:

```json
GET hotels-index/_search?explain=true
{
  "query": {
    "neural_sparse": {
      "name_embedding": {
        "query_tokens": {
          "7001": 6.25,
          "3509": 5.57
        },
        "method_parameters": {
          "k": 5,
          "filter": {
            "range": {
              "rating": {
                "gte": 8,
                "lte": 10
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 8,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 70.55404,
    "hits": [
      {
        "_shard": "[hotels-index][0]",
        "_node": "iId6ipt-SCWA-7vHLh981Q",
        "_index": "hotels-index",
        "_id": "8",
        "_score": 70.55404,
        "_source": {
          "parking": true,
          "name": "Crystal Beach Resort",
          "rating": 9,
          "name_embedding": {
            "3509": 5.5722017,
            "6121": 6.5081306,
            "7001": 6.25483
          }
        },
        "_explanation": {
          "value": 70.55404,
          "description": "sparse_ann score for doc 7 in field 'name_embedding'",
          "details": [
            {
              "value": 2,
              "description": "query token pruning: kept all 2 tokens (no pruning occurred)",
              "details": []
            },
            {
              "value": 17921,
              "description": "raw dot product score (quantized): 17921",
              "details": [
                {
                  "value": 10000,
                  "description": "token '7001' contribution: query_weight=100 * doc_weight=100",
                  "details": []
                },
                {
                  "value": 7921,
                  "description": "token '3509' contribution: query_weight=89 * doc_weight=89",
                  "details": []
                }
              ]
            },
            {
              "value": 0.003936948,
              "description": "quantization rescaling: 1.0000 * 16.00 * 16.00 / 255 / 255 = 0.003937",
              "details": [
                {
                  "value": 1,
                  "description": "original boost: 1.0000",
                  "details": []
                },
                {
                  "value": 16,
                  "description": "ceiling_ingest (quantization parameter): 16.00",
                  "details": []
                },
                {
                  "value": 16,
                  "description": "ceiling_search (quantization parameter): 16.00",
                  "details": []
                },
                {
                  "value": 255,
                  "description": "MAX_UNSIGNED_BYTE_VALUE: 255",
                  "details": []
                }
              ]
            },
            {
              "value": 1,
              "description": "document passed filter with exact search mode (filter matched 4 documents <= k=5, all filtered documents scored exactly)",
              "details": [
                {
                  "value": 1,
                  "description": "filter criteria: +ApproximateScoreQuery(originalQuery=IndexOrDocValuesQuery(indexQuery=rating:[8 TO 10], dvQuery=rating:[8 TO 10]), approximationQuery=Approximate(rating:[8 TO 10]))",
                  "details": []
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```
</details>

## Response body fields

The following table describes the fields in the explanation response.

Field | Description
:--- | :---
`explanation` | The `explanation` object contains the following fields: <br> - `value`: Contains the calculation result.<br> - `description`: Explains what type of calculation was performed. <br> - `details`: Shows any subcalculations performed.

### Explanation details

The `details` array in the explanation contains the following components:

Component | Description
:--- | :---
Query token pruning | Shows how many query tokens were retained after pruning. If no pruning occurred, indicates that all tokens were kept.
Raw dot product score | The quantized dot product score before rescaling. Contains nested details showing each token's contribution as `query_weight * doc_weight`.
Quantization rescaling | Explains how the raw quantized score is converted to the final float score using the formula: `boost * ceiling_ingest * ceiling_search / 255 / 255`. Contains details about each parameter used in the calculation.
Filter explanation | (When filters are applied) Shows filter criteria and search mode. Indicates whether exact search mode was used when filtered documents are fewer than or equal to `k`.

### Quantization parameters

The quantization rescaling section includes the following parameters:

Parameter | Description
:--- | :---
`original boost` | The boost value applied to the query (default: 1.0).
`ceiling_ingest` | The quantization ceiling parameter used during document ingestion.
`ceiling_search` | The quantization ceiling parameter used during search.
`MAX_UNSIGNED_BYTE_VALUE` | The maximum value for unsigned byte quantization (255).

Neural sparse ANN search uses unsigned byte quantization to reduce memory usage and improve search performance. During ingestion, float token weights are converted to unsigned bytes (0--255) by dividing each weight by `ceiling_ingest` and scaling to the byte range. Similarly, during search, query token weights are quantized using `ceiling_search`. The raw dot product is computed using these quantized byte values. To recover the approximate original score, the result is rescaled using the formula: `final_score = raw_quantized_score * boost * ceiling_ingest * ceiling_search / 255 / 255`. The ceiling parameters determine the maximum weight value that can be represented without clipping---weights exceeding the ceiling are capped at 255.

## Next steps

- For more information about neural sparse ANN search, see [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/).
- For more information about the Explain API, see [Explain API]({{site.url}}{{site.baseurl}}/api-reference/explain/).
- For information about filtering in neural sparse ANN search, see [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/).
