---
layout: default
title: Pretrained models
parent: Using ML models within OpenSearch
grand_parent: Integrating ML models
nav_order: 120
---

# OpenSearch-provided pretrained models
**Generally available 2.9**
{: .label .label-purple }

OpenSearch provides a variety of open-source pretrained models that can assist with a range of machine learning (ML) search and analytics use cases. You can upload any supported model to the OpenSearch cluster and use it locally.

## Supported pretrained models

OpenSearch supports the following models, categorized by type. Text embedding models are sourced from [Hugging Face](https://huggingface.co/). Sparse encoding models are trained by OpenSearch. Although models with the same type will have similar use cases, each model has a different model size and will perform differently depending on your cluster setup. For a performance comparison of some pretrained models, see the [SBERT documentation](https://www.sbert.net/docs/pretrained_models.html#model-overview).

Running local models on the CentOS 7 operating system is not supported. Moreover, not all local models can run on all hardware and operating systems.
{: .important}

### Sentence transformers

Sentence transformer models map sentences and paragraphs across a dimensional dense vector space. The number of vectors depends on the type of model. You can use these models for use cases such as clustering or semantic search.

The following table provides a list of sentence transformer models and artifact links you can use to download them. Note that you must prefix the model name with `huggingface/`, as shown in the **Model name** column. 

| Model name | Version | Vector dimensions | Auto-truncation | TorchScript artifact | ONNX artifact |
|:---|:---|:---|:---|:---|:---|
| `huggingface/sentence-transformers/all-distilroberta-v1` | 1.0.1 | 768-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/torch_script/sentence-transformers_all-distilroberta-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/onnx/sentence-transformers_all-distilroberta-v1-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/all-MiniLM-L6-v2` | 1.0.1 | 384-dimensional dense vector space.  | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/torch_script/sentence-transformers_all-MiniLM-L6-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/onnx/sentence-transformers_all-MiniLM-L6-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/all-MiniLM-L12-v2` | 1.0.1 | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/torch_script/sentence-transformers_all-MiniLM-L12-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/onnx/sentence-transformers_all-MiniLM-L12-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/all-mpnet-base-v2` | 1.0.1 | 768-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/torch_script/sentence-transformers_all-mpnet-base-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/onnx/sentence-transformers_all-mpnet-base-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/msmarco-distilbert-base-tas-b` | 1.0.2 | 768-dimensional dense vector space. Optimized for semantic search. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.2/torch_script/sentence-transformers_msmarco-distilbert-base-tas-b-1.0.2-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.2/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.2/onnx/sentence-transformers_msmarco-distilbert-base-tas-b-1.0.2-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.2/onnx/config.json) |
| `huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1` | 1.0.1 | 384-dimensional dense vector space. Designed for semantic search and trained on 215 million question/answer pairs. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/torch_script/sentence-transformers_multi-qa-MiniLM-L6-cos-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/onnx/sentence-transformers_multi-qa-MiniLM-L6-cos-v1-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1` | 1.0.1 | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/torch_script/sentence-transformers_multi-qa-mpnet-base-dot-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/onnx/sentence-transformers_multi-qa-mpnet-base-dot-v1-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2` | 1.0.1 | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/torch_script/sentence-transformers_paraphrase-MiniLM-L3-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/onnx/sentence-transformers_paraphrase-MiniLM-L3-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` | 1.0.1 | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/torch_script/sentence-transformers_paraphrase-multilingual-MiniLM-L12-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/onnx/sentence-transformers_paraphrase-multilingual-MiniLM-L12-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/paraphrase-mpnet-base-v2` | 1.0.0 | 768-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-mpnet-base-v2/1.0.0/torch_script/sentence-transformers_paraphrase-mpnet-base-v2-1.0.0-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-mpnet-base-v2/1.0.0/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-mpnet-base-v2/1.0.0/onnx/sentence-transformers_paraphrase-mpnet-base-v2-1.0.0-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-mpnet-base-v2/1.0.0/onnx/config.json) |
| `huggingface/sentence-transformers/distiluse-base-multilingual-cased-v1` | 1.0.1 | 512-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/distiluse-base-multilingual-cased-v1/1.0.1/torch_script/sentence-transformers_distiluse-base-multilingual-cased-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/distiluse-base-multilingual-cased-v1/1.0.1/torch_script/config.json) | Not available |


### Sparse encoding models
**Introduced 2.11**
{: .label .label-purple }

Sparse encoding models transfer text into a sparse vector and convert the vector to a list of `<token: weight>` pairs representing the text entry and its corresponding weight in the sparse vector. You can use these models for use cases such as clustering or sparse neural search.

We recommend the following models for optimal performance:

- Use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1` model during both ingestion and search.
- Use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1` model during ingestion and the
`amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1` model during search.

The following table provides a list of sparse encoding models and artifact links you can use to download them.

| Model name | Version | Auto-truncation | TorchScript artifact | Description |
|:---|:---|:---|:---|:---|
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1` | 1.0.1 | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-encoding-v1/1.0.1/torch_script/neural-sparse_opensearch-neural-sparse-encoding-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-encoding-v1/1.0.1/torch_script/config.json) | A neural sparse encoding model. The model transforms text into a sparse vector, identifies the indexes of non-zero elements in the vector, and then converts the vector into `<entry, weight>` pairs, where each entry corresponds to a non-zero element index. To experiment with this model using transformers and the PyTorch API, see the [HuggingFace documentation](https://huggingface.co/opensearch-project/opensearch-neural-sparse-encoding-v1). |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1` | 1.0.1 | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1/1.0.1/torch_script/neural-sparse_opensearch-neural-sparse-encoding-doc-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1/1.0.1/torch_script/config.json) | A neural sparse encoding model. The model transforms text into a sparse vector, identifies the indexes of non-zero elements in the vector, and then converts the vector into `<entry, weight>` pairs, where each entry corresponds to a non-zero element index. To experiment with this model using transformers and the PyTorch API, see the [HuggingFace documentation](https://huggingface.co/opensearch-project/opensearch-neural-sparse-encoding-doc-v1). |
| `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1` | 1.0.1 | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1/1.0.1/torch_script/neural-sparse_opensearch-neural-sparse-tokenizer-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1/1.0.1/torch_script/config.json) | A neural sparse tokenizer model. The model tokenizes text into tokens and assigns each token a predefined weight, which is the token's inverse document frequency (IDF). If the IDF file is not provided, the weight defaults to 1. For more information, see [Preparing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/#preparing-a-model). |

### Cross-encoder models
**Introduced 2.12**
{: .label .label-purple }

Cross-encoder models support query reranking. 

The following table provides a list of cross-encoder models and artifact links you can use to download them. Note that you must prefix the model name with `huggingface/cross-encoders`, as shown in the **Model name** column. 

| Model name | Version | TorchScript artifact | ONNX artifact |
|:---|:---|:---|:---|
| `huggingface/cross-encoders/ms-marco-MiniLM-L-6-v2` | 1.0.2 | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-6-v2/1.0.2/torch_script/cross-encoders_ms-marco-MiniLM-L-6-v2-1.0.2-torch_script.zip) <br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-6-v2/1.0.2/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-6-v2/1.0.2/onnx/cross-encoders_ms-marco-MiniLM-L-6-v2-1.0.2-onnx.zip) <br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-6-v2/1.0.2/onnx/config.json) |
| `huggingface/cross-encoders/ms-marco-MiniLM-L-12-v2` | 1.0.2 | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-12-v2/1.0.2/torch_script/cross-encoders_ms-marco-MiniLM-L-12-v2-1.0.2-torch_script.zip) <br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-12-v2/1.0.2/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-12-v2/1.0.2/onnx/cross-encoders_ms-marco-MiniLM-L-12-v2-1.0.2-onnx.zip) <br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/cross-encoders/ms-marco-MiniLM-L-12-v2/1.0.2/onnx/config.json) 

## Prerequisites

On clusters with dedicated ML nodes, specify `"only_run_on_ml_node": "true"` for improved performance. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/). 

This example uses a simple setup with no dedicated ML nodes and allows running a model on a non-ML node. To ensure that this basic local setup works, specify the following cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins": {
      "ml_commons": {
        "only_run_on_ml_node": "false",
        "model_access_control_enabled": "true",
        "native_memory_threshold": "99"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 1: Register a model group

To register a model, you have the following options:

- You can use `model_group_id` to register a model version to an existing model group.
- If you do not use `model_group_id`, ML Commons creates a model with a new model group.

To register a model group, send the following request:

```json
POST /_plugins/_ml/model_groups/_register
{
  "name": "local_model_group",
  "description": "A model group for local models"
}
```
{% include copy-curl.html %}

The response contains the model group ID that you'll use to register a model to this model group:

```json
{
 "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
 "status": "CREATED"
}
```

To learn more about model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Step 2: Register a local OpenSearch-provided model

To register a remote model to the model group created in step 1, provide the model group ID from step 1 in the following request.

Because pretrained models originate from the ML Commons model repository, you only need to provide the `name`, `version`, `model_group_id`, and `model_format` in the register API request:  

```json
POST /_plugins/_ml/models/_register
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.2",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

OpenSearch returns the task ID of the register operation:

```json
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

```bash
GET /_plugins/_ml/tasks/cVeMb4kBJ1eYAeTMFFgj
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```json
{
  "model_id": "cleMb4kBJ1eYAeTMFFg4",
  "task_type": "REGISTER_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "XPcXLV7RQoi5m8NI_jEOVQ"
  ],
  "create_time": 1689793598499,
  "last_update_time": 1689793598530,
  "is_async": false
}
```

Take note of the returned `model_id` because you’ll need it to deploy the model.

## Step 3: Deploy the model

The deploy operation reads the model's chunks from the model index and then creates an instance of the model to load into memory. The bigger the model, the more chunks the model is split into and longer it takes for the model to load into memory.

To deploy the registered model, provide its model ID from step 3 in the following request:

```bash
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_deploy
```
{% include copy-curl.html %}

The response contains the task ID that you can use to check the status of the deploy operation:

```json
{
  "task_id": "vVePb4kBJ1eYAeTM7ljG",
  "status": "CREATED"
}
```

As in the previous step, check the status of the operation by calling the Tasks API:

```bash
GET /_plugins/_ml/tasks/vVePb4kBJ1eYAeTM7ljG
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```json
{
  "model_id": "cleMb4kBJ1eYAeTMFFg4",
  "task_type": "DEPLOY_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "n-72khvBTBi3bnIIR8FTTw"
  ],
  "create_time": 1689793851077,
  "last_update_time": 1689793851101,
  "is_async": true
}
```

If a cluster or node is restarted, then you need to redeploy the model. To learn how to set up automatic redeployment, see [Enable auto redeploy]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#enable-auto-redeploy).
{: .tip} 

## Step 4 (Optional): Test the model

Use the [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) to test the model.

### Text embedding model

For a text embedding model, send the following request:

```json
POST /_plugins/_ml/_predict/text_embedding/cleMb4kBJ1eYAeTMFFg4
{
  "text_docs":[ "today is sunny"],
  "return_number": true,
  "target_response": ["sentence_embedding"]
}
```
{% include copy-curl.html %}

The response contains text embeddings for the provided sentence:

```json
{
  "inference_results" : [
    {
      "output" : [
        {
          "name" : "sentence_embedding",
          "data_type" : "FLOAT32",
          "shape" : [
            768
          ],
          "data" : [
            0.25517133,
            -0.28009856,
            0.48519906,
            ...
          ]
        }
      ]
    }
  ]
}
```

### Sparse encoding model

For a sparse encoding model, send the following request:

```json
POST /_plugins/_ml/_predict/sparse_encoding/cleMb4kBJ1eYAeTMFFg4
{
  "text_docs":[ "today is sunny"]
}
```
{% include copy-curl.html %}

The response contains the tokens and weights:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "output",
          "dataAsMap": {
            "response": [
              {
                "saturday": 0.48336542,
                "week": 0.1034762,
                "mood": 0.09698499,
                "sunshine": 0.5738209,
                "bright": 0.1756877,
                ...
              }
          }
        }
    }
}
```

### Cross-encoder model

For a cross-encoder model, send the following request:

```json
POST _plugins/_ml/models/<model_id>/_predict
{
    "query_text": "today is sunny",
    "text_docs": [
        "how are you",
        "today is sunny",
        "today is july fifth",
        "it is winter"
    ]
}
```
{% include copy-curl.html %}

The model calculates the similarity score of `query_text` and each document in `text_docs` and returns a list of scores for each document in the order they were provided in `text_docs`:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            -6.077798
          ],
          "byte_buffer": {
            "array": "Un3CwA==",
            "order": "LITTLE_ENDIAN"
          }
        }
      ]
    },
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            10.223609
          ],
          "byte_buffer": {
            "array": "55MjQQ==",
            "order": "LITTLE_ENDIAN"
          }
        }
      ]
    },
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            -1.3987057
          ],
          "byte_buffer": {
            "array": "ygizvw==",
            "order": "LITTLE_ENDIAN"
          }
        }
      ]
    },
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            -4.5923924
          ],
          "byte_buffer": {
            "array": "4fSSwA==",
            "order": "LITTLE_ENDIAN"
          }
        }
      ]
    }
  ]
}
```

A higher document score means higher similarity. In the preceding response, documents are scored as follows against the query text `today is sunny`:

Document text | Score
:--- | :---
`how are you` | -6.077798
`today is sunny` | 10.223609
`today is july fifth` | -1.3987057
`it is winter` | -4.5923924

The document that contains the same text as the query is scored the highest, and the remaining documents are scored based on the text similarity.

## Step 5: Use the model for search

To learn how to set up a vector index and use text embedding models for search, see [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/).

To learn how to set up a vector index and use sparse encoding models for search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

To learn how to use cross-encoder models for reranking, see [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/).

