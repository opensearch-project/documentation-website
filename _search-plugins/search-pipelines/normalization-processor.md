---
layout: default
title: Normalization processor
nav_order: 15
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Normalization processor

The `normalization_processor` search phase results processor intercepts the query phase results and normalizes and combines the document scores before passing the documents to the fetch phase. 

## 

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`normalization.technique` | String | The technique for normalizing scores. Valid values are `min_max`, `L2`. Optional. Default is `min_max`. <!--TODO: what is the default-->
`combination.technique` | String | The technique for combining scores. Valid values are `harmonic_mean`, `arithmetic_mean`, `geometric_mean`. Optional. Default is `arithmetic_mean`. <!--TODO: what is the default-->
`combination.parameters.weights` | Array of floating-point values | Specifies the weights to use for each query. Valid values are in the [0.0, 1.0] range and signify decimal percentages. The closer the weight is to 1.0, the more weight is given to a query. The number of values in the `weights` array must equal the number of queries. The sum of the values in the array must equal 1.0. 
`tag` | String | The processor's identifier. 
`description` | String | A description of the processor. 
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores a failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example 

The following example demonstrates using a search pipeline with a `normalization_processor` processor.

### Creating a search pipeline 

The following request creates a search pipeline with a `normalization_processor` that renames the field `message` to `notification`:

```json
PUT /_search/pipeline/my_pipeline
{
  "phase_results_processors" : [
    {
      "normalization-processor" : {
        "normalization": { 
           "technique": "min_max", 
        },
        "combination": { 
           "technique" : "harmonic_mean", 
            "parameters" : { 
                "weights" : [0.4, 0.7] 
            }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Use a `hybrid` query to apply the search pipeline created in the previous section to a search request:

```json
POST flicker-index/_search?search_pipeline=normalizationPipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "neural": {
            "passage_embedding": {
              "query_text": "Girl with Brown Hair",
              "model_id": "ABCBMODELID",
              "k": 20
            }
          }
        },
        {
          "match": {
            "passage_text": "Girl Brown hair"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

Normalization processor does not produce consistent results for a cluster with one node and one shard.
{: .warning}