---
layout: default
title: Configuring AI search types
parent: Building AI search workflows in OpenSearch Dashboards
grand_parent: AI search
nav_order: 10
---

# Configuring AI search types

This page provides example configurations for different AI search workflow types. Each example shows how to tailor the setup to a specific use case, such as semantic search or hybrid retrieval. To build a workflow from start to finish, follow the steps in [Building AI search workflows in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflow-builder/), applying your use case configuration to the appropriate parts of the setup. 

## Prerequisite: Provision ML resources

Before you start, select and provision the necessary machine learning (ML) resources, depending on your use case. For example, to implement semantic search, you must configure a text embedding model in your OpenSearch cluster. For more information about deploying ML models locally or connecting to externally hosted models, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

<p id="implementation-examples"></p>

## Semantic search

This example demonstrates how to configure semantic search.

### ML resources

Create and deploy an [Amazon Titan Text Embedding model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-bedrock-titan-text-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field specified in the mappings, as follows:

```json
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "<embedding_field_name>": {
        "type": "knn_vector",
        "dimension": "<embedding_size>"
      }
    }
  }
}
```

{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your input text to the `inputText` model input field. Optionally, map the output `embedding` to a new document field.

### Search pipeline

Configure a single ML inference search request processor. Map the query field containing the input text to the `inputText` model input field. Optionally, map the output `embedding` to a new field. Override the query to include a `knn` query, for example:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "knn": {
            "<embedding_field>": {
                "vector": ${embedding},
                "k": 10
            }
        }
    }
}
```

{% include copy.html %}

---

## Hybrid search

Hybrid search combines keyword and vector search. This example demonstrates how to configure hybrid search.

### ML resources

Create and deploy an [Amazon Titan Text Embedding model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-bedrock-titan-text-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field specified in the mappings, as follows:

```json
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "<embedding_field_name>": {
        "type": "knn_vector",
        "dimension": "<embedding_size>"
      }
    }
  }
}
```

{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your input text to the `inputText` model input field. Optionally, map the output `embedding` to a new document field.

### Search pipeline

Configure an ML inference search request processor and a normalization processor.

**For the ML inference processor**, map the query field containing the input text to the `inputText` model input field. Optionally, map the output `embedding` to a new field. Override the query so that it contains a `hybrid` query. Make sure to specify the `embedding_field`, `text_field`, and `text_field_input`:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "hybrid": {
            "queries": [
                {
                    "match": {
                        "<text_field>": {
                            "query": "<text_field_input>"
                        }
                    }
                },
                {
                    "knn": {
                        "<embedding_field>": {
                            "vector": ${embedding},
                            "k": 10
                        }
                    }
                }
            ]
        }
    }
}
```

{% include copy.html %}

**For the normalization processor**, configure weights for each subquery. For more information, see the [hybrid search normalization processor example]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/#step-3-configure-a-search-pipeline).

---

## Basic RAG (document summarization)

This example demonstrates how to configure basic retrieval-augmented generation (RAG).

The following example shows a simplified connector blueprint for the [Claude v1 messages API](https://docs.anthropic.com/en/api/messages). While connector blueprints and model interfaces may evolve over time, this example demonstrates how to abstract complex API interactions into a single `prompt` field input.

A sample input might appear as follows, with placeholders representing dynamically fetched results:

```json
{
  "prompt": "Human: You are a professional data analyst. You are given a list of document results. You will analyze the data and generate a human-readable summary of the results. If you don't know the answer, just say I don't know.\n\n Results: ${parameters.results.toString()}\n\n Human: Please summarize the results.\n\n Assistant:"
}
```

### ML resources

Create and deploy an [Anthropic Claude 3 Sonnet model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#claude-3-sonnet-hosted-on-amazon-bedrock).

### Search pipeline

Configure an ML inference search response processor using the following steps:

1. Select **Template** as the transformation type for the `prompt` input field.
2. Open the template configuration by selecting **Configure**.
3. Choose a preset template to simplify setup.
4. Create an input variable that extracts the list of reviews (for example, `review`).
5. Inject the variable into the prompt by copying and pasting it into the template.
6. Select **Run preview** to verify that the transformed prompt correctly incorporates sample dynamic data.
7. Select **Save** to apply the changes and exit.

---

## Multimodal search

Multimodal search searches by text and image. This example demonstrates how to configure multimodal search.

### ML resources

Create and deploy an [Amazon Titan Multimodal Embedding model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-bedrock-titan-multimodal-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field (to persist generated embeddings) and a `binary` field (to persist the image binary) specified in the mappings, as follows:

```json
{
    "settings": {
        "index": {
            "knn": true
        }
    },
    "mappings": {
        "properties": {
            "image_base64": {
                "type": "binary"
            },
            "image_embedding": {
                "type": "knn_vector",
                "dimension": <dimension>
            }
        }
    }
}
```

{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your input text field and input image field to the `inputText` and `inputImage` model input fields, respectively. If both text and image inputs are needed, ensure that both are mapped. Alternatively, you can map only one input (either text or image) if a single input is sufficient for embedding generation.

Optionally, map the output `embedding` to a new document field.

### Search pipeline

Configure a single ML inference search request processor. Map the input text field and input image field in the query to the `inputText` and `inputImage` model input fields, respectively. If both text and image inputs are needed, ensure that both are mapped. Alternatively, you can map only one input (either text or image) if a single input is sufficient for embedding generation.

Override the query so that it contains a `knn` query, including the embedding output:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "knn": {
            "<embedding_field>": {
                "vector": ${embedding},
                "k": 10
            }
        }
    }
}
```

{% include copy.html %}

---

## Named entity recognition

This example demonstrates how to configure named entity recognition (NER).

### ML resources

Create and deploy an [Amazon Comprehend Entity Detection model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-comprehend---entity-detection).

### Ingest pipeline

Configure a single ML inference processor. Map your input text field to the `text` model input field. To persist any identified entities with each document, transform the output (an array of entities) and store them in the `entities_found` field. Use the following `output_map` configuration as a reference:

```json
"output_map": [
    {
        "entities_found": "$.response.Entities[*].Type"
    }
],
```

{% include copy.html %}

This configuration maps the extracted entities to the `entities_found` field, ensuring that they are stored alongside each document.

---

## Language detection and classification

The following example demonstrates how to configure language detection and classification.

### ML resources

Create and deploy an [Amazon Comprehend Language Detection model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-comprehend---language-detection).

### Ingest pipeline

Configure a single ML inference processor. Map your input text field to the `text` model input field. To store the most relevant or most likely language detected for each document, transform the output (an array of languages) and persist it in the `detected_dominant_language` field. Use the following `output_map` configuration as a reference:

```json
"output_map": [
    {
              "detected_dominant_language": "response.Languages[0].LanguageCode"
    }
],
```

{% include copy.html %}

---

## Reranking results

Reranking can be implemented in various ways, depending on the capabilities of the model used. Typically, models require at least two inputs: the original query and the data to be assigned a relevance score. Some models support batching, allowing multiple results to be processed in a single inference call, while others require scoring each result individually.

In OpenSearch, this leads to two common reranking patterns:

1. **Batching enabled**

   1. Collect all search results.
   1. Pass the batched results to a single ML processor for scoring.
   1. Return the top **n** ranked results.

2. **Batching disabled**
   1. Collect all search results.
   1. Pass each result to the ML processor to assign a new relevance score.
   1. Send all results with updated scores to the rerank processor for sorting.
   1. Return the top **n** ranked results.

The following example demonstrates **Pattern 2 (batching disabled)** to highlight the rerank processor. However, note that the **Cohere Rerank** model used in this example **does support batching**, so you could also implement **Pattern 1** with this model.

### ML resources

Create and deploy a [Cohere Rerank model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#cohere-rerank).

### Search pipeline

Configure an ML inference **search response** processor, followed by a rerank **search response** processor. For reranking with batching disabled, use the ML processor to generate new relevance scores for the retrieved results and then apply the reranker to sort them accordingly.

Use the following ML processor configuration:

1. Map the document field containing the data to be used for comparison to the model's `documents` field.
2. Map the original query to the model's `query` field.
3. Use JSONPath to access the query JSON, prefixed with `_request.query`.

Use the following `input_map` configuration as a reference:

```json
"input_map": [
   {
      "documents": "description",
      "query": "$._request.query.term.value"
   }
],
```

{% include copy.html %}

Optionally, you can store the rescored result in the model output in a new field. You can also extract and persist only the relevance score, as follows:

```json
"input_map": [
   {
      "new_score": "results[0].relevance_score"
   }
],
```

{% include copy.html %}

Use the following rerank processor configuration: Under **target_field**, select the model score field (in this example, `new_score`).

---

## Multimodal search (text or image) with a custom CLIP model

The following example uses a custom CLIP model hosted on Amazon SageMaker. The model dynamically ingests a text or image URL as input and returns a vector embedding.

### ML resources

Create and deploy a [Custom CLIP Multimodal model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#custom-clip-multimodal-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field specified in the mappings, as follows:

```json
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "<embedding_field_name>": {
        "type": "knn_vector",
        "dimension": "<embedding_size>"
      }
    }
  }
}
```

{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your image field to the `image_url` model input field or your text field to the `text` model input field, depending on what type of data you are ingesting and persisting in your index. For example, if building an application that returns relevant images based on text or image input, you will need to persist images and should map the image field to the `image_url` field.

### Search pipeline

Configure a single ML inference search request processor. Map the input image field or the input text field in the query to the `image_url` or `text` model input fields, respectively. The CLIP model flexibly handles one or the other, so choose the option that best suits your use case.

Override the query so that it contains a `knn` query, including the embedding output:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "knn": {
            "<embedding_field>": {
                "vector": ${embedding},
                "k": 10
            }
        }
    }
}
```

{% include copy.html %}


---

## Neural sparse search

### ML resources
Create and deploy a [Neural Sparse Encoding model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#neural-sparse-encoding).

### Index

Ensure the index mappings include `rank_features` field, as follows:

```
"<embedding_field_name>": {
    "type": "rank_features"
}
```

{% include copy.html %}

### Ingest pipeline

Single ML inference processor. Map your input text to the `text_doc` model input field. Optionally map the output `response` to a new document field. Transform the response if needed using JSONPath expression. 


### Search pipeline

Single ML inference **search request** processor. Map the query field containing the input text to the `text_doc` model input field. Optionally map the output `response` to a new field. Transform the response if needed using JSONPath expression. Override the query to a neural sparse query. For example:

```
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "neural_sparse": {
            "<embedding_field>": {
                "query_tokens": ${response},
            }
        }
    }
}
```

{% include copy.html %}