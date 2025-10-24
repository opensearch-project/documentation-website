---
layout: default
title: Neural sparse
parent: Specialized queries
nav_order: 55
---

# Neural sparse query
**Introduced 2.11**
{: .label .label-purple }

The `neural_sparse` query performs vector field search for neural sparse functionality. You can run this query on two types of vector fields:

- **`rank_features` fields**: For traditional [neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/)
- **`sparse_vector` fields**: For [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/)

## Neural sparse search

Use neural sparse search on `rank_features` fields for traditional sparse vector search with inverted index efficiency.

You can run a neural sparse search either using raw sparse vectors or text. The text can be tokenized by built-in analyzers or tokenizer models.

### Using raw sparse vectors

Provide sparse vector embeddings directly for matching:

```json
"neural_sparse": {
  "<rank_features_field>": {
    "query_tokens": {
      "<token>": <weight>,
      ...
    }
  }
}
```

For more information, see [Neural sparse search using raw vectors]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-raw-vectors/).

### Using text with built-in analyzers

Provide text to tokenize using a built-in DL model analyzer:

```json
"neural_sparse": {
  "<rank_features_field>": {
    "query_text": "<input text>",
    "analyzer": "bert-uncased"
  }
}
```

### Using text with custom models

Provide text to tokenize using a custom tokenizer model:

```json
"neural_sparse": {
  "<rank_features_field>": {
    "query_text": "<input text>",
    "model_id": "<model ID>"
  }
}
```

For more information, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/).

## Neural sparse ANN search
**Introduced 3.3**
{: .label .label-purple }

Use neural sparse ANN search on `sparse_vector` fields for improved query performance with high recall. For more information, see [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/).

You can run a neural sparse search either using raw sparse vectors or text. 

### Using raw sparse vectors

```json
"neural_sparse": {
  "<sparse_vector_field>": {
    "query_tokens": {
      "<token>": <weight>,
      ...
    },
    "method_parameters": {
      "top_n": 10,
      "heap_factor": 1.0,
      "k": 10
    }
  }
}
```

### Using text with models

```json
"neural_sparse": {
  "<sparse_vector_field>": {
    "query_text": "<input text>",
    "model_id": "<model ID>",
    "method_parameters": {
      "top_n": 10,
      "heap_factor": 1.0,
      "k": 10
    }
  }
}
```

## Request body fields

The top-level field name specifies the vector field against which to run a search query. You must specify either `query_text` or `query_tokens` to define the input.

### Common fields

These fields are supported for both `rank_features` and `sparse_vector` field types.

| Field | Data type | Required/Optional | Description |
|:--- |:--- |:--- |:--- |
| `query_text` | String | Optional | The query text to convert into sparse vector embeddings. Either `query_text` or `query_tokens` must be specified. |
| `query_tokens` | Map of token (string) to weight (float) | Optional | A raw sparse vector in the form of tokens and their weights. Used as an alternative to `query_text` for direct vector input. Either `query_text` or `query_tokens` must be specified. |
| `model_id` | String | Optional | Used with `query_text`. The ID of the sparse encoding model (for bi-encoder mode) or tokenizer (for doc-only mode) used to generate vector embeddings from the query text. The model/tokenizer must be deployed in OpenSearch before it can be used in neural sparse search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/) and [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/). For information about setting a default model ID in a neural sparse query, see [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/). Cannot be specified at the same time as `analyzer`. |
| `max_token_score` | Float | Optional | (Deprecated) This parameter has been deprecated since OpenSearch 2.12. It is maintained only for backward compatibility and no longer affects functionality. The parameter can still be provided in requests, but its value has no impact. Previously used as the theoretical upper bound of the score for all tokens in the vocabulary.|

### Fields for rank_features only

| Field | Data type | Required/Optional | Description |
|:--- |:--- |:--- |:--- |
| `analyzer` | String | Optional | Used with `query_text`. Specifies a built-in DL model analyzer for tokenizing query text. Valid values are `bert-uncased` and `mbert-uncased`. Default is `bert-uncased`. If neither `model_id` nor `analyzer` are specified, the default analyzer (`bert-uncased`) is used to tokenize the text. Cannot be specified at the same time as `model_id`. For more information, see [DL model analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/dl-model-analyzers/). |

### Fields for sparse_vector only

| Field | Data type | Required/Optional | Description |
|:--- |:--- |:--- |:--- |
| `method_parameters.top_n` | Integer | Optional | Specifies the number of query tokens with the highest weights to retain for approximate sparse queries. |
| `method_parameters.heap_factor` | Float | Optional | Controls the trade-off between recall and performance. Higher values increase recall but reduce query speed; lower values decrease recall but improve query speed. |
| `method_parameters.k` | Integer | Optional | Specifies the number of top k nearest results that the approximate neural search algorithm returns. |
| `method_parameters.filter` | Object | Optional | Applies filters to the query results. See [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/). |

## Examples

The following examples demonstrate using a `neural_sparse` query.

### Neural sparse search on rank_features fields

You can run a neural sparse search on a `rank_features` field using text tokenized by an analyzer or a model or using raw vectors. 

#### Using text tokenized by an analyzer

To run a search using text tokenized by an analyzer, specify an `analyzer` in the request. The analyzer must be compatible with the model that you used for text analysis at ingestion time:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "analyzer": "bert-uncased"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information, see [DL model analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/dl-model-analyzers/).

If you don't specify an analyzer, the default `bert-uncased` analyzer is used:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Using text tokenized by a model

To search using text tokenized by a tokenizer model, provide the model ID in the request:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "model_id": "aP2Q8ooBpBj3wT4HVS8a"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Using raw vectors

To search using a sparse vector, provide the sparse vector in the `query_tokens` parameter:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_tokens": {
          "hi" : 4.338913,
          "planets" : 2.7755864,
          "planet" : 5.0969057,
          "mars" : 1.7405145,
          "earth" : 2.6087382,
          "hello" : 3.3210192
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Neural sparse ANN search on sparse_vector fields

You can run a neural sparse ANN search on a `sparse_vector` field using text or raw vectors.

#### Using text

To search using natural language, provide the `query_text` and a deployed sparse encoding model ID:

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

#### Using raw vectors with method parameters

To search using a precomputed sparse vector, provide the vector in the `query_tokens` field:

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

## Next steps

- For more information about neural sparse search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/).
- For more information about neural sparse ANN search, see [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/).
- For field type information, see [Rank features]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/rank/) and [Sparse vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/sparse-vector/).
- For information about filtering `neural_sparse` query results, see [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/).