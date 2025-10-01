---
layout: default
title: Late interaction score
parent: Specialized queries
nav_order: 70
---

# Late interaction score

The `lateInteractionScore` function is a Painless script scoring function that calculates late interaction scores between query vectors and document vectors. This implements a ColBERT-style late interaction pattern for token-level matching, where for each query vector, the function finds the maximum similarity with any document vector and sums these maxima.

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

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `query_vectors` | List of lists of numbers | List of query vectors for scoring |
| `vector_field` | String | The name of the field in the document containing vectors |
| `doc` | Map | Document source as a map (use `params._source`) |
| `space_type` | String (optional) | Space type for similarity calculation. Default is "l2". Supported: "innerproduct", "cosinesimil", "l2" |

## Examples

### Basic usage with default similarity (L2)

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

### Using specific similarity metric

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
          "space_type": "innerproduct"
        }
      }
    }
  }
}
```

## Supported space types

- `innerproduct`: Inner product similarity
- `cosinesimil`: Cosine similarity  
- `l2`: L2 (Euclidean) distance (default)

## Index mapping

The document field should be stored as an object type with `enabled: false` to preserve the nested vector structure:

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
