---
layout: default
title: Searching data
nav_order: 35
---

# Searching vector data

OpenSearch supports various methods for searching vector data, tailored to how the vectors were created and indexed. This guide explains the query syntax and options for raw vector ingestion and auto-generated embeddings.

## Search types comparison

The following table compares the search syntax and typical use cases for each vector search method.

| Feature                          | Query type  | Input format | Model required | Use case     |
|----------------------------------|------------------|------------------|---------------------|----------------------------|
| **Pre-generated embeddings**     | `knn`            | Vector array     | No                  | Raw vector search          |
| **Auto-generated embeddings** | `neural`       | Text            | Yes                 | ML-powered search            |

## Searching pre-generated embeddings or raw vectors

For raw vector searches, use the `knn` query type and provide the vector array as input:

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

For ML-powered searches using embeddings, use the `neural` query type and provide query text input:

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
