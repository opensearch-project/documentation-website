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
| **Raw vectors**     | `knn`            | Vector array     | No                  | Raw vector search          |
| **Auto-generated embeddings** | `neural`       | Text or image data            | Yes                 | [AI search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/)            |

## Searching raw vectors

To search raw vectors, use the `knn` query type and provide the vector array as input:

```json
GET /my-raw-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector": {
        "vector": [0.1, 0.2, 0.3],
        "k": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

## Searching auto-generated embeddings

For machine learning (ML)-powered searches using auto-generated embeddings, use the `neural` query type and provide query text input:

```json
GET /my-semantic-search-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "What is machine learning?",
        "model_id": "your-model-id",
        "k": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

## Working with sparse vectors

OpenSearch also supports sparse vectors. For more information, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/).

## AI search

OpenSearch supports AI-powered search methods like semantic, hybrid, multimodal, and conversational search with retrieval-augmented generation. For more information, see [AI search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/).

## Next steps

- [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/vector-search/tutorials/neural-search-tutorial/)
- [Filtering data]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
- [Neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/)
