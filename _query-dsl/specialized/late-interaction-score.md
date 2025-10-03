---
layout: default
title: Late interaction score
parent: Specialized queries
nav_order: 70
---

# Late interaction score

The `lateInteractionScore` function is a Painless script scoring function that calculates document relevance using token-level vector matching. It compares each query vector against all document vectors, finds the maximum similarity for each query vector, and sums these maximum scores to produce the final document score.

This approach enables fine-grained semantic matching between queries and documents, making it particularly effective for reranking search results.

## Syntax

```json
GET index_name/_search
{
  "query": {
    "script_score": {
      "query": { "match_all": {} },
      "script": {
        "source": "lateInteractionScore(params.query_vectors, 'vector_field', params._source)",
        "params": {
          "query_vectors": [[[0.1, 0.2]], [[0.3, 0.4]]]
        }
      }
    }
  }
}
```

## Parameters

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `query_vectors` | Array of arrays | Yes | Query vectors for similarity matching |
| `vector_field` | String | Yes | Name of the document field containing vectors |
| `doc` | Map | Yes | Document source (use `params._source`) |
| `space_type` | String | No | Similarity metric. Default: `"l2"` |

## How it works

The function performs the following steps:

1. **Compare each query vector** against all document vectors
2. **Find the maximum similarity** for each query vector
3. **Sum all maximum similarities** to get the final score

**Example calculation:**
- Query vectors: `[[0.8, 0.1], [0.2, 0.9]]`
- Document vectors: `[[0.7, 0.2], [0.1, 0.8], [0.3, 0.4]]`
- Query vector 1 → finds best match among document vectors → score A
- Query vector 2 → finds best match among document vectors → score B
- Final score = A + B

### Similarity metrics

The `space_type` parameter determines how similarity is calculated:

| Space type | Description | Higher score means |
| :--- | :--- | :--- |
| `innerproduct` | Dot product | More similar vectors |
| `cosinesimil` | Cosine similarity | More similar direction |
| `l2` (default) | Euclidean distance | Closer vectors (inverted) |

## Examples

### Basic usage

```json
GET my_index/_search
{
  "query": {
    "script_score": {
      "query": { "match_all": {} },
      "script": {
        "source": "lateInteractionScore(params.query_vectors, 'my_vector', params._source)",
        "params": {
          "query_vectors": [[[1.0, 0.0]], [[0.0, 1.0]]]
        }
      }
    }
  }
}
```

### Using cosine similarity

```json
GET my_index/_search
{
  "query": {
    "script_score": {
      "query": { "match_all": {} },
      "script": {
        "source": "lateInteractionScore(params.query_vectors, 'my_vector', params._source, params.space_type)",
        "params": {
          "query_vectors": [[[1.0, 0.0]], [[0.0, 1.0]]],
          "space_type": "cosinesimil"
        }
      }
    }
  }
}
```

## Index mapping requirements

The vector field must be mapped as either `object` or `float` type:

### Object field (recommended)
```json
{
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "object",
        "enabled": false
      }
    }
  }
}
```

### Float field
```json
{
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "float"
      }
    }
  }
}
```

**Note:** Object type with `"enabled": false` is recommended as it stores raw vectors without parsing, improving performance.
