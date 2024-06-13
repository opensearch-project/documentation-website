---
layout: default
title: Neural spare query two-phase processor
nav_order: 13
parent: Search processors
grand_parent: Search pipelines
---

# Neural sparse query two-phase processor
Introduced 2.15
{: .label .label-purple }

The `neural_sparse_two_phase_processor` search processer is designed to set a speed-up search pipelines for [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/). It accelerates the neural sparse query by breaking down the original method of scoring all documents with all tokens into two steps: 

1. High-weight tokens score the documents and filter out the top documents.
2. Low-weight tokens rescore the scores of the top documents.

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`enabled` | Boolean | Controls whether two-phase is enabled. Default is `true`.
`two_phase_parameter` | Object | A map of key-value pairs representing the two-phase parameters and their associated values. You can specify the value of `prune_ratio`, `expansion_rate`, `max_window_size`, or any combination of these three parameters. Optional.
`two_phase_parameter.prune_ratio` | Float | A ratio that represents how to split the high-weight tokens and low-weight tokens. The threshold is the token's max score * prune_ratio. Valid range is [0,1]. Default is `0.4`
`two_phase_parameter.expansion_rate` | Float | A rate that specifies how many documents will be fine-tuned during the second phase. The second phase doc number equals query size (default 10) * expansion rate. Valid range is greater than 1.0. Default is `5.0`
`two_phase_parameter.max_window_size` | Int | A limit number of the two-phase fine-tune documents. Valid range is greater than 50. Default is `10000`.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.

## Example

The following example creates a search pipeline with a `neural_sparse_two_phase_processor` search request processor. 

### Create search pipeline

The following example request creates a search pipeline with a `neural_sparse_two_phase_processor` search request processor. The processor sets a custom model ID at the index level and provides different default model IDs for two specific fields in the index:

```json
PUT /_search/pipeline/two_phase_search_pipeline
{
  "request_processors": [
    {
      "neural_sparse_two_phase_processor": {
        "tag": "neural-sparse",
        "description": "This processor is making two-phase processor.",
        "enabled": true,
        "two_phase_parameter": {
          "prune_ratio": custom_prune_ratio,
          "expansion_rate": custom_expansion_rate,
          "max_window_size": custom_max_window_size
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Set search pipeline

After the two-phase pipeline is created, set the `index.search.default_pipeline` setting to the pipeline name of the index for which you want to use the pipeline:

```json
PUT /index-name/_settings 
{
  "index.search.default_pipeline" : "two_phase_search_pipeline"
}
```
{% include copy-curl.html %}

## Limitation

The 'neural_sparse_two_phase_processor' contains the following limitations:

### Version support

`neural_sparse_two_phase_processor` can only be used with OpenSearch 2.15 or greater.

### Compound query support

As of OpenSearch 2.15, only the Boolean [compound query]({{site.url}}{{site.baseurl}}/query-dsl/compound/index/) is supported

Neural sparse queries and boolean queries with a boost parameter (not a boosting query) are also supported.

#### Supported example

The following examples show neural sparse queries with the supported query types.

##### Single neural sparse query

```
GET /my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world"
        "model_id": <model-id>
      }
    }
  }
}
```
{% include copy-curl.html %}

##### Neural sparse query nested in boolean query

```
GET /my-nlp-index/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "neural_sparse": {
            "passage_embedding": {
              "query_text": "Hi world",
              "model_id": <model-id>
            },
            "boost": 2.0
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}
  
## P99 Latency Metrics
On an OpenSearch cluster set up on 3 m5.4xlarge Amazon EC2 instances, OpenSearch conducts neural sparse query's P99 latency tests on indexes corresponding to over ten datasets.

### Doc-only mode latency metric

In doc-only mode, the two-phase processor can significantly decrease query latency, as shown by the following latency metrics:

- Average latency without 2-phase: 53.56 ms
- Average latency with 2-phase: 38.61 ms

This results in an overall reduction of approximately 27.92% in latency. Most indexes show a significant decrease in latency with the 2-phase processor, with reductions ranging from 5.14% to 84.6. The specific latency optimization values depend on the data distribution within the indexes.

### Bi-encoder mode latency metric

In bi-encoder mode, the two-phase processor can significantly decrease query latency. Analyzing the data:
- Average latency without 2-phase: 300.79 ms
- Average latency with 2-phase: 121.64 ms

This results in an overall reduction of approximately 59.56% in latency. Most indexes show a significant decrease in latency with the 2-phase processor, with reductions ranging from 1.56% to 82.84%. The specific latency optimization values depend on the data distribution within the indexes.
