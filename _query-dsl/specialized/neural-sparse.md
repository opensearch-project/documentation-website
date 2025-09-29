---
layout: default
title: Neural sparse
parent: Specialized queries
nav_order: 55
---

# Neural sparse query
Introduced 2.11
{: .label .label-purple }

Use the `neural_sparse` query for vector field search in [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/). 

You can run the query in the following ways:

- Provide sparse vector embeddings for matching. For more information, see [Neural sparse search using raw vectors]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-raw-vectors/):
  ```json
  "neural_sparse": {
    "<vector_field>": {
      "query_tokens": {
        "<token>": <weight>,
        ...
      }
    }
  }
  ```
- Provide text to tokenize and use for matching. To tokenize the text, you can use the following components:
  - A built-in DL model analyzer:
    ```json
    "neural_sparse": {
      "<vector_field>": {
        "query_text": "<input text>",
        "analyzer": "bert-uncased"
      }
    }
    ```
  - A tokenizer model:
    ```json
    "neural_sparse": {
      "<vector_field>": {
        "query_text": "<input text>",
        "model_id": "<model ID>"
      }
    }
    ```

  For more information, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/).

## Sparse ANN query
Introduced 3.3
{: .label .label-purple }

You can also run a sparse ANN query against a `sparse_vector` field. It supports above mentioned querying with text or querying with tokens.
    ```json
    "neural_sparse": {
      "<vector_field>": {
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

The top-level `vector_field` specifies the vector field against which to run a search query. You must specify either `query_text` or `query_tokens` to define the input. The following fields can be used to configure the query

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`query_text` | String | Optional | The query text to convert into sparse vector embeddings. Either `query_text` or `query_tokens` must be specified.
`analyzer` | String | Optional | Used with `query_text`. Specifies a built-in DL model analyzer for tokenizing query text. Valid values are `bert-uncased` and `mbert-uncased`. Default is `bert-uncased`. If neither `model_id` nor `analyzer` are specified, the default analyzer (`bert-uncased`) is used to tokenize the text. Cannot be specified at the same time as `model_id`. For more information, see [DL model analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/dl-model-analyzers/).
`model_id` | String | Optional | Used with `query_text`. The ID of the sparse encoding model (for bi-encoder mode) or tokenizer (for doc-only mode) used to generate vector embeddings from the query text. The model/tokenizer must be deployed in OpenSearch before it can be used in neural sparse search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/) and [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/). For information about setting a default model ID in a neural sparse query, see [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/). Cannot be specified at the same time as `analyzer`.
`query_tokens` | Map of token (string) to weight (float) | Optional | A raw sparse vector in the form of tokens and their weights. Used as an alternative to `query_text` for direct vector input. Either `query_text` or `query_tokens` must be specified.
`max_token_score` | Float | Optional | (Deprecated) This parameter has been deprecated since OpenSearch 2.12. It is maintained only for backward compatibility and no longer affects functionality. The parameter can still be provided in requests, but its value has no impact. Previously used as the theoretical upper bound of the score for all tokens in the vocabulary.
`method_parameters.top_n` | Integer | Optional | Specifies the number of query tokens with the highest weights to retain for approximate sparse queries.
`method_parameters.heap_factor` | Float | Optional | Controls the trade-off between recall and performance. Higher values increase recall but reduce query speed; lower values decrease recall but improve query speed.
`method_parameters.k` | Integer | Optional | Specifies the number of top k nearest results to return from the approximate algorithm.
`method_parameters.filter` | Object | Optional | Applies filters to the query results.


#### Examples

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

## Next steps

- For more information about neural sparse search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/).
- For more information about sparse ANN search, see [Sparse Approximate Search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-seismic/)