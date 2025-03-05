---
layout: default
title: Searching data
nav_order: 35
---

# Searching vector data

OpenSearch supports various methods for searching vector data, tailored to how the vectors were created and indexed. This guide explains the query syntax and options for raw vector search and auto-generated embedding search.

## Search type comparison

The following table compares the search syntax and typical use cases for each vector search method.

| Feature                          | Query type  | Input format | Model required | Use case     |
|----------------------------------|------------------|------------------|---------------------|----------------------------|
| **Raw vectors**     | [`knn`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)            | Vector array     | No                  | Raw vector search          |
| **Auto-generated embeddings** | [`neural`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/)       | Text or image data            | Yes                 | [AI search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/)            |

## Searching raw vectors

To search raw vectors, use the `knn` query type, provide the `vector` array as input, and specify the number of returned results `k`:

```json
GET /my-raw-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector": {
        "vector": [0.1, 0.2, 0.3],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

## Searching auto-generated embeddings

OpenSearch supports [AI-powered search methods]({{site.url}}{{site.baseurl}}/vector-search/ai-search/), including semantic, hybrid, multimodal, and conversational search with retrieval-augmented generation (RAG). These methods automatically generate embeddings from query input.

To run an AI-powered search, use the `neural` query type. Specify the `query_text` input, the model ID of the embedding model you [configured in the ingest pipeline]({{site.url}}{{site.baseurl}}/vector-search/creating-vector-index/#converting-data-to-embeddings-during-ingestion), and the number of returned results `k`. To exclude embeddings from being returned in search results, specify the embedding field in the `_source.excludes` parameter:

```json
GET /my-ai-search-index/_search
{
  "_source": {
    "excludes": [
      "output_embedding"
    ]
  },
  "query": {
    "neural": {
      "output_embedding": {
        "query_text": "What is AI search?",
        "model_id": "mBGzipQB2gmRjlv_dOoB",
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

## Working with sparse vectors

OpenSearch also supports sparse vectors. For more information, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/).

## Next steps

- [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/vector-search/tutorials/neural-search-tutorial/)
- [Filtering data]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
- [Neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/)
