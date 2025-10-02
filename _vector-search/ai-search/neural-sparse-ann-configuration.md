---
layout: default
title: Sparse ANN configuration
parent: Sparse ANN
grand_parent: Neural sparse search
great_grand_parent: AI search
nav_order: 10
has_math: true
---

# Sparse ANN configuration

This page provides comprehensive configuration guidance for sparse ANN in OpenSearch neural sparse search.

## Prerequisites

Before configuring sparse ANN, ensure you have:

- OpenSearch 3.3 or later with the neural-search plugin installed

## Step 1: Create sparse ANN index

To use sparse ANN, you must enable sparse setting at the index level by setting `"sparse": true`

Besides, you should use `sparse_vector` as the field type, because sparse ANN is designed to use sparse vectors.

In addition, there are some special parameters in a mapping field. You can specify what settings you want to use, such as `n_postings`, `cluster_ratio`, `summary_prune_ratio`, and `approximate_threshold`. More details can be seen in [sparse ANN index setting]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/)

### Example
```json
PUT /sparse-ann-documents
{
  "settings": {
    "index": {
      "sparse": true,
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "properties": {
      "sparse_embedding": {
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "parameters": {
            "n_postings": 4000,
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

## Step 2: Ingest data

After a sparse ANN index is successfully created, you can ingest sparse embeddings with tokens in the form of integers into it

```json
POST _bulk
{ "create": { "_index": "sparse-ann-documents", "_id": "0" } }
{ "sparse_embedding": {"10": 0.85, "23": 1.92, "24": 0.67, "78": 2.54, "156": 0.73} }
{ "create": { "_index": "sparse-ann-documents", "_id": "1" } }
{ "sparse_embedding": {"3": 1.22, "19": 0.11, "21": 0.35, "300": 1.74, "985": 0.96} }
```
{% include copy-curl.html %}

You can also use [ingestion pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/) which automatically adjusts the output format of tokens into integer.

## Step 3: Conduct a query

Now, you can prepare a query to retrieve information from the index you just built. Please note that you should not combine sparse ANN with [two-phase]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/) pipeline.

### Natural language query

Query sparse ANN fields using the enhanced `neural_sparse` query:

```json
GET /sparse-ann-documents/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_text": "machine learning algorithms",
        "model_id": "your_sparse_model_id",
        "method_parameters": {"heap_factor": 1.3, "cut": 6, "k": 10}
      }
    }
  }
}
```
{% include copy-curl.html %}

### Raw vector query
In addition, you can also prepare sparse vectors in advance so that you can send a raw vector as a query. Please note that you should use tokens in a form of integer here instead of raw text.
```json
GET /sparse-ann-documents/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_tokens": {
          "1055": 1.7,
          "2931": 2.3
        },
        "method_parameters": {
          "heap_factor": 1.2,
          "top_n": 6,
          "k": 10
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Cluster settings

### Thread pool configuration

When building clustered inverted index structure, it requires intensive computations. Our algorithm uses a threadpool to building clusters in parallel. The default value of the threadpool is 1. You can adjust this `plugins.neural_search.sparse.algo_param.index_thread_qty` setting to tune the threadpool size to use more CPU cores to reduce index building time

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.neural_search.sparse.algo_param.index_thread_qty": 4
  }
}
```
{% include copy-curl.html %}

### Memory and caching settings
Sparse ANN equips a circuit breaker to prevent the algorithm consuming too much memory, so users do not need to worry about affecting other OpenSearch functionalities. The default value of `circuit_breaker.limit` is $$10\%$$, and you can set a different limit value to control the total memory the algorithm will use. Once the memory reaches this limit, a cache eviction would occur and data which are used least recently will be evicted. Here is an example to call the circuit breaker cluster setting API:
```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.neural_search.circuit_breaker.limit": "30%"
  }
}
```
{% include copy-curl.html %}

A higher circuit breaker limit will allow more memory space to use, which prevents frequent cache eviction, but it may impact other OpenSearch's operation. A lower limit will guarantee more safety, but it may trigger more frequent cache eviction. More details can be seen in [Neural Search API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/)

### Monitor sparse ANN

Use stats API to monitor memory usage and query stats. More details can be seen in [Neural Search API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats)

## Performance tuning
Sparse ANN provides users with an opportunity to balance the trade-off between how accurate search results are and how fast search process can be. In short, you can tune balance between recall and latency with following parameter settings. Check guidance in [sparse ANN performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/)

## Next steps

- [Sparse ANN performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/)