---
layout: default
title: Sparse Vector
nav_order: 61
has_children: false
parent: Supported field types
---

# Sparse Vector
**Introduced 3.3**
{: .label .label-purple }

The `sparse_vector` field supports the sparse ANN (Approximate Nearest Neighbor) algorithm. This significantly boosts the search efficiency while maintaining high search relevance. The `sparse_vector` field is represented as a map, where the keys denote the token with positive [float]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) values indicating the token weight.

For more information, see [sparse ANN]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-seismic).
    
## Parameters

The `sparse_vector` field type supports the following parameters.

| Parameter               | Type    | Required | Description                                   | Default               | Range       | Example   |
|-------------------------|---------|----------|-----------------------------------------------|-----------------------|-------------|-----------|
| `name`                  | String  | Yes | Algorithm name                                | -                     | -           | `seismic` |
| `n_postings`            | Integer | No | Maximum documents per posting list            | `0.0005 * doc_count`¹ | (0, +∞) | `4000`    |
| `cluster_ratio`         | Float   | No | Ratio to determine cluster count              | `0.1`                 | (0, 1)      | `0.15`    |
| `summary_prune_ratio`   | Float   | No | Ratio for pruning cluster summary vectors     | `0.4`                 | (0, 1]      | `0.3`     |
| `approximate_threshold` | Integer | No | Document threshold for SEISMIC activation     | `1,000,000`           | [0, +∞) | `500000`  |
| `quantization_ceiling_search`  | Float   | No | Ceiling float value to consider during search | `16`                  | (0, +∞) | `3`       |
| `quantization_ceiling_ingest` | Float | No | Ceiling float value to consider during ingest | `3`                   | (0, +∞)     | `2.5`     |


¹`doc_count` represents the number of documents within the segment.

For parameter configuration, you can refer to [`sparse ANN configuration`]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann-configuration)  
{: .note }

To increase search efficiency and reduce memory consumption, the `sparse_vector` field automatically performs quantization on the token weight. You can adjust the parameter `quantization_ceiling_search` and `quantization_ceiling_ingest` according to different token weight distribution. For doc-only queries, we recommend the default value (`16`). If you're querying with bi-encoder mode alone, we recommend setting `quantization_ceiling_search` to `3`. For doc-only and bi-encoder mode, you can refer to [`generating sparse vector embeddings automatically`]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/) for more details. 
{: .note }

## Example

### Step 1: Index creation

Create a sparse index where the index mapping contains a sparse vector field.

```json
PUT sparse-vector-index
{
  "settings": {
    "index": {
      "sparse": true
    },
    "mappings": {
      "properties": {
        "sparse_embedding": {
          "type": "sparse_vector",
          "method": {
            "name": "seismic",
            "parameters": {
              "n_postings": 300,
              "cluster_ratio": 0.1,
              "summary_prune_ratio": 0.4,
              "approximate_threshold": 1000000
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

To use the `sparse_vector` field, you need to specify the index setting `index.sparse` to be `true`
{: .note }

### Step 2: Data ingestion

Index three documents with a `sparse_vector` field:

```json
PUT sparse-vector-index/_doc/1
{
  "sparse_embedding" : {
    "1000": 0.1
  }
}
```
{% include copy-curl.html %}

```json
PUT sparse-vector-index/_doc/2
{
  "sparse_embedding" : {
    "2000": 0.2
  }
}
```
{% include copy-curl.html %}

```json
PUT sparse-vector-index/_doc/3
{
  "sparse_embedding" : {
    "3000": 0.3
  }
}
```
{% include copy-curl.html %}

### Step 3: Query

Using a `neural_sparse` query, you can query the sparse index with either raw vectors or natural language.

#### Query with raw vector

```json
GET sparse-vector-index/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_tokens": {
          "1055": 5.5
        },
        "method_parameters": {
          "heap_factor": 1.0,
          "top_n": 10,
          "k": 10
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Query with natural language

```json
GET sparse-vector-index/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_text": "<input text>",
        "model_id": "<model ID>",
        "method_parameters": {
          "k": 10,
          "top_n": 10,
          "heap_factor": 1.0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

For more details on query, you can refer to [`sparse ANN query`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/#sparse-ann-query) and [`sparse ANN configuration`]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann-configuration).
{: .note }

