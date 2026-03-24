---
layout: default
title: Neural sparse query two-phase
nav_order: 60
parent: User-defined search processors
grand_parent: Search pipelines
---

# Neural sparse query two-phase processor
Introduced 2.15
{: .label .label-purple }

The `neural_sparse_two_phase_processor` search processor is designed to provide faster search pipelines for [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/). It accelerates the neural sparse query by dividing the original method of scoring all documents with all tokens into two steps: 

1. High-weight tokens score the documents and filter out the top documents.
2. Low-weight tokens rescore the top documents.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`enabled` | Boolean | Controls whether the two-phase processor is enabled. Default is `true`.
`two_phase_parameter` | Object | A map of key-value pairs representing the two-phase parameters and their associated values. You can specify the value of `prune_ratio`, `expansion_rate`, `max_window_size`, or any combination of these three parameters. Optional.
`two_phase_parameter.prune_type` | String | The pruning strategy for separating high-weight and low-weight tokens. Default is `max_ratio`. For valid values, see [Pruning sparse vectors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/sparse-encoding/#pruning-sparse-vectors).
`two_phase_parameter.prune_ratio` | Float | This ratio defines how high-weight and low-weight tokens are separated. The threshold is calculated by multiplying the token's maximum score by its `prune_ratio`. Valid values are in the [0,1] range for `prune_type` set to `max_ratio`. Default is `0.4`.
`two_phase_parameter.expansion_rate` | Float | The rate at which documents will be fine-tuned during the second phase. The second-phase document number equals the query size (default is 10) multiplied by its expansion rate. Valid range is greater than 1.0. Default is `5.0`
`two_phase_parameter.max_window_size` | Int | The maximum number of documents that can be processed using the two-phase processor. Valid range is greater than 50. Default is `10000`.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.

## Example

The following example creates a search pipeline with a `neural_sparse_two_phase_processor` search request processor. 

### Create search pipeline

The following example request creates a search pipeline with a `neural_sparse_two_phase_processor` search request processor. The processor sets a custom model ID at the index level and provides different default model IDs for two specific index fields:

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

After the two-phase pipeline is created, set the `index.search.default_pipeline` setting to the name of the pipeline for the index on which you want to use the two-phase pipeline:

```json
PUT /index-name/_settings 
{
  "index.search.default_pipeline" : "two_phase_search_pipeline"
}
```
{% include copy-curl.html %}

## Limitation

The `neural_sparse_two_phase_processor` has the following limitations.

### Version support

The `neural_sparse_two_phase_processor` can only be used with OpenSearch 2.15 or later.

### Compound query support

As of OpenSearch 2.15, only the Boolean [compound query]({{site.url}}{{site.baseurl}}/query-dsl/compound/index/) is supported.

Neural sparse queries and Boolean queries with a boost parameter (not boosting queries) are also supported.

## Examples

The following examples show neural sparse queries with the supported query types.

### Single neural sparse query

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

### Neural sparse query nested in a Boolean query

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
  
## P99 latency metrics
Using an OpenSearch cluster set up on three m5.4xlarge Amazon Elastic Compute Cloud (Amazon EC2) instances, OpenSearch conducts neural sparse query P99 latency tests on indexes corresponding to more than 10 datasets.

### Doc-only mode latency metric

In doc-only mode, the two-phase processor can significantly decrease query latency, as shown by the following latency metrics:

- Average latency without the two-phase processor: 53.56 ms
- Average latency with the two-phase processor: 38.61 ms

This results in an overall latency reduction of approximately 27.92%. Most indexes show a significant latency reduction when using the two-phase processor, with reductions ranging from 5.14 to 84.6%. The specific latency optimization values depend on the data distribution within the indexes.

### Bi-encoder mode latency metric

In bi-encoder mode, the two-phase processor can significantly decrease query latency, as shown by the following latency metrics:
- Average latency without the two-phase processor: 300.79 ms
- Average latency with the two-phase processor: 121.64 ms

This results in an overall latency reduction of approximately 59.56%. Most indexes show a significant latency reduction when using the two-phase processor, with reductions ranging from 1.56 to 82.84%. The specific latency optimization values depend on the data distribution within the indexes.
