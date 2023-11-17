---
layout: default
title: Custom models
parent: Using ML models within OpenSearch
nav_order: 120
---

# Custom local models
**Generally available 2.9**
{: .label .label-purple }

To use a custom model locally, you can upload it to the OpenSearch cluster.

## Model support

As of OpenSearch 2.6, OpenSearch supports local text embedding models.

As of OpenSearch 2.11, OpenSearch supports local sparse encoding models.

## Preparing a model

For both text embedding and sparse encoding models, you must provide a tokenizer JSON file within the model zip file.

For sparse encoding models, make sure your output format is `{"output":<sparse_vector>}` so that ML Commons can post-process the sparse vector.

If you fine-tune a sparse model on your own dataset, you may also want to use your own sparse tokenizer model. It is preferable to provide your own [IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) JSON file in the tokenizer model zip file because this increases query performance when you use the tokenizer model in the query. Alternatively, you can use an OpenSearch-provided generic [IDF from MSMARCO](https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1/1.0.0/torch_script/opensearch-neural-sparse-tokenizer-v1-1.0.0.zip). If the IDF file is not provided, the default weight of each token is set to 1, which may influence sparse neural search performance.  

### Model format

To use a model in OpenSearch, you'll need to export the model into a portable format. As of Version 2.5, OpenSearch only supports the [TorchScript](https://pytorch.org/docs/stable/jit.html) and [ONNX](https://onnx.ai/) formats.

You must save the model file as zip before uploading it to OpenSearch. To ensure that ML Commons can upload your model, compress your TorchScript file before uploading. For an example, download a TorchScript [model file](https://github.com/opensearch-project/ml-commons/blob/2.x/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/all-MiniLM-L6-v2_torchscript_sentence-transformer.zip).

Additionally, you must calculate a SHA256 checksum for the model zip file that you'll need to provide when registering the model. For example, on UNIX, use the following command to obtain the checksum:

```bash
shasum -a 256 sentence-transformers_paraphrase-mpnet-base-v2-1.0.0-onnx.zip
```

### Model size

Most deep learning models are more than 100 MB, making it difficult to fit them into a single document. OpenSearch splits the model file into smaller chunks to be stored in a model index. When allocating ML or data nodes for your OpenSearch cluster, make sure you correctly size your ML nodes so that you have enough memory when making ML inferences.

## Prerequisites 

To upload a custom model to OpenSearch, you need to prepare it outside of your OpenSearch cluster. You can use a pretrained model, like one from [Hugging Face](https://huggingface.co/), or train a new model in accordance with your needs.

### Cluster settings

This example uses a simple setup with no dedicated ML nodes and allows running a model on a non-ML node. 

On clusters with dedicated ML nodes, specify `"only_run_on_ml_node": "true"` for improved performance. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

To ensure that this basic local setup works, specify the following cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins": {
      "ml_commons": {
        "allow_registering_model_via_url": "true",
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

## Step 2: Register a local model

To register a remote model to the model group created in step 1, provide the model group ID from step 1 in the following request:

```json
POST /_plugins/_ml/models/_register
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.1",
  "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
  "description": "This is a port of the DistilBert TAS-B Model to sentence-transformers model: It maps sentences & paragraphs to a 768 dimensional dense vector space and is optimized for the task of semantic search.",
  "model_task_type": "TEXT_EMBEDDING",
  "model_format": "TORCH_SCRIPT",
  "model_content_size_in_bytes": 266352827,
  "model_content_hash_value": "acdc81b652b83121f914c5912ae27c0fca8fabf270e6f191ace6979a19830413",
  "model_config": {
    "model_type": "distilbert",
    "embedding_dimension": 768,
    "framework_type": "sentence_transformers",
    "all_config": """{"_name_or_path":"old_models/msmarco-distilbert-base-tas-b/0_Transformer","activation":"gelu","architectures":["DistilBertModel"],"attention_dropout":0.1,"dim":768,"dropout":0.1,"hidden_dim":3072,"initializer_range":0.02,"max_position_embeddings":512,"model_type":"distilbert","n_heads":12,"n_layers":6,"pad_token_id":0,"qa_dropout":0.1,"seq_classif_dropout":0.2,"sinusoidal_pos_embds":false,"tie_weights_":true,"transformers_version":"4.7.0","vocab_size":30522}"""
  },
  "created_time": 1676073973126,
  "url": "https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.1/torch_script/sentence-transformers_msmarco-distilbert-base-tas-b-1.0.1-torch_script.zip"
}
```
{% include copy-curl.html %}

For a description of Register API parameters, see [Register a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/).

OpenSearch returns the task ID of the register operation:

```json
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Get task]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

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

## Step 4 (Optional): Test the model

Use the [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) to test the model.

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

## Step 5: Use the model for search

To learn how to set up a vector index and use text embedding models for search, see [Neural text search]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/).

To learn how to set up a vector index and use sparse encoding models for search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

To learn how to set up a vector index and use multimodal embedding models for search, see [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).
