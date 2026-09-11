---
layout: default
title: Sparse vector
nav_order: 92
has_children: false
parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/sparse-vector/
---

# Sparse vector
**Introduced 3.3**
{: .label .label-purple }

The `sparse_vector` field supports [neural sparse approximate nearest neighbor (ANN) search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/), which improves search efficiency while preserving relevance. A `sparse_vector` is stored as a map, in which each key represents the token and each value is a positive [`float`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) value indicating the token's weight.
    
## Parameters

A `sparse_vector` field requires a `method` object that specifies the algorithm, the engine that implements it, and the algorithm parameters.

### Method parameters

The `method` object supports the following parameters.

| Parameter       | Type   | Required | Description                                                                                                                                                                                                      | Default    | Valid values           | 
|-----------------|--------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|------------------------|
| `name`          | String | Yes      | The neural sparse ANN search algorithm.                                                                                                                                                                          | -          | `seismic`              | 
| `engine`        | String | No       | The engine that builds and searches the index. Introduced in OpenSearch 3.9. For a comparison of the two engines, see [Engines]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#engines).  | `lucene`   | `lucene`, `native`     | 
| `parameters`    | Object | No       | The algorithm parameters. See [Algorithm parameters](#algorithm-parameters).                                                                                                                                     | -          | -                      | 

The `method` object cannot be updated after the field is created. To change the engine or any algorithm parameter, create a new index with the intended mapping and reindex your data.
{: .important}

### Algorithm parameters

The `method.parameters` object supports the following parameters. All of them apply to both the Lucene engine and the native engine except for `clustering_batch_size` and `forward_index`, which are supported for the native engine only.

| Parameter               | Type    | Required | Description                                   | Default               | Range       | 
|-------------------------|---------|----------|-----------------------------------------------|-----------------------|-------------|
| `n_postings`            | Integer | No | The maximum number of documents to retain in each posting list.            | `0.0005 * doc_count`¹ | (0, ∞) | 
| `cluster_ratio`         | Float   | No | The fraction of documents in each posting list used to determine the cluster count.             | `0.1`                 | (0, 1)      | 
| `summary_prune_ratio`   | Float   | No | The fraction of total token weight to retain when pruning cluster summary vectors. For example, if `summary_prune_ratio` is set to `0.5`, tokens contributing to the top 50% of the total weight are kept. Thus, for a cluster summary `{"100": 1, "200": 2, "300": 3, "400": 6}`, the pruned summary is `{"400": 6}`. | `0.4`                 | (0, 1]      | 
| `approximate_threshold` | Integer | No | The minimum number of documents in a segment required to activate neural sparse ANN search.     | `1000000`           | [0, ∞) | 
| `quantization_ceiling_search`  | Float   | No | The maximum token weight used for quantization during search. | `16`                  | (0, ∞) | 
| `quantization_ceiling_ingest` | Float | No | The maximum token weight used for quantization during ingestion. | `3`                   | (0, ∞)     | 
| `clustering_batch_size` | Integer | No | The number of batches that each inverted list is split into for clustering. Supported for the native engine only. When this parameter is greater than `1`, clustering runs on each batch instead of on the whole corpus, which significantly reduces memory usage during index building at the cost of longer build times. | `1`                   | [1, 10000]     | 
| `forward_index`         | String  | No | How the forward index is stored. Supported for the native engine only. `shared` stores one contiguous forward index for the field. `per_block` stores each block's vectors inline with the block, which lowers query latency but uses more disk space. Introduced in OpenSearch 3.9. | `shared`              | `shared`, `per_block` | 

The `clustering_batch_size` and `forward_index` parameters are supported only for the native engine. If you set `engine` to `lucene` and specify a `forward_index` value other than `shared`, the request is rejected.
{: .warning}


¹`doc_count` represents the number of documents within the segment. The derived value is never lower than `160`.

For parameter configuration, see [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/).  
{: .note }

To increase search efficiency and reduce memory consumption, the `sparse_vector` field automatically performs quantization of the token weight. You can adjust the `quantization_ceiling_search` and `quantization_ceiling_ingest` parameters according to different token weight distributions. For doc-only queries, we recommend setting `quantization_ceiling_search` to the default value (`16`). For bi-encoder queries, we recommend setting `quantization_ceiling_search` to `3`. For more information about doc-only and bi-encoder query modes, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/).
{: .note}

## Example

The following example demonstrates using a `sparse_vector` field type.

### Step 1: Create an index

Create a sparse index by setting `index.sparse` to `true` and define a `sparse_vector` field in the index mapping:

```json
PUT sparse-vector-index
{
  "settings": {
    "index": {
      "sparse": true
    }
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
```
{% include copy-curl.html %}

Because `engine` defaults to `lucene`, this field uses the Lucene engine. To use the native engine, set `engine` to `native` and, optionally, set `forward_index` in `parameters`:

```json
PUT sparse-vector-native-index
{
  "settings": {
    "index": {
      "sparse": true
    }
  },
  "mappings": {
    "properties": {
      "sparse_embedding": {
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "engine": "native",
          "parameters": {
            "n_postings": 300,
            "cluster_ratio": 0.1,
            "summary_prune_ratio": 0.4,
            "approximate_threshold": 1000000,
            "forward_index": "per_block"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The native engine is disabled by default. Before creating a field that uses it, enable it on every data node. For more information, see [Enabling the native engine]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#enabling-the-native-engine).
{: .note}

### Step 2: Ingest data into the index

Ingest three documents containing `sparse_vector` fields into your index:

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

### Step 3: Search the index

You can query the sparse index by providing either raw vectors or natural language using a [`neural_sparse` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/).

#### Query using a raw vector

To query using a raw vector, provide the `query_tokens` parameter:

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

#### Query using natural language

To query using natural language, provide the `query_text` and `model_id` parameters:

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

## Related documentation

- [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/)
- [Neural sparse query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/)
- [Neural sparse ANN search performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/)
