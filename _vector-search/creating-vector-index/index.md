---
layout: default
title: Creating a vector index
nav_order: 20
has_children: true
redirect_from:
  - /vector-database/creating-a-vector-db/
---

# Creating a vector index

Creating a vector index in OpenSearch involves a common core process with some variations depending on the type of vector search. This guide outlines the key elements shared across all vector indexes and the differences specific to supported use cases.

To create a k-NN index, set the `settings.index.knn` parameter to `true`:

```json
PUT /test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 3,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


Regardless of the type of vector search, the following elements are part of creating a vector index:

1. **Enable k-NN search**:
   Set `index.knn` to `true` in the index settings to enable k-NN search functionality.

2. **Define a vector field**:
   Specify the field that will store the vector data.

3. **Specify dimension**:
   Set the `dimension` property to match the size of the vectors used.

4. **Choose a space type**:
   Select a distance metric for similarity comparisons, such as `l2` (Euclidean distance) or `cosine`.

5. **Select a method**:
   Configure the indexing method, such as HNSW or IVF, to optimize vector search performance.

To create a vector index, choose one of the following options:

- [Pre-generated embeddings or raw vectors](#pre-generated-embeddings-or-raw-vectors): Ingest pre-generated embeddings or raw vectors into your index to perform raw vector search. 
- [Auto-generated embeddings](#auto-generated-embeddings): Ingest text that will be converted into vector embeddings within OpenSearch in order to perform semantic search using ML models. 


The following table summarizes key index configuration differences for the supported use cases.


| Feature                  | Vector field type | Ingest pipeline | Transformation     | Use case   |
|--------------------------|-----------------------|---------------------|-------------------------|-------------------------|
| **Pre-generated embeddings or raw vectors**   | `knn_vector`         | Not required        | Direct ingestion        | Raw  vector search   |
| **Auto-generated embeddings**      | `knn_vector`         | Required            | Auto-generated vectors  | Semantic search     |

## Pre-generated embeddings or raw vectors

To ingest raw vectors into an index, configure a vector field (in this request, `my_vector`) and specify its `dimension`:

```json
PUT /my-raw-vector-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 128,
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "space_type": "l2"
        }
      }
    }
  }
}
```

**Key Characteristics:**
- Uses the `knn_vector` type.
- Directly ingests vector data.
- No additional transformations are required.
- Supports custom configurations for indexing methods (e.g., FAISS).



## Auto-generated embeddings

Auto-generating embeddings require configuring an ingest pipeline. When creating embeddings, specify the pipeline at index creation time:

```json
PUT /my-semantic-search-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-ingest-pipeline"
  },
  "mappings": {
    "properties": {
      "passage_text": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "knn_vector",
        "dimension": 768,  
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "space_type": "l2"
        }
      }
    }
  }
}
```

**Key Characteristics:**
- Uses the `knn_vector` type.
- Includes an ingest pipeline for automatic embedding generation.
- Dimension matches the embedding model output.
- Includes a `text` field for the original content.

