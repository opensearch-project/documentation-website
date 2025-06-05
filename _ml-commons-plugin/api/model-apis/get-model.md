---
layout: default
title: Get model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Get a model

You can retrieve model information using the `model_id`.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
GET /_plugins/_ml/models/<model_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The model ID of the model to retrieve. |

#### Example request

```json
GET /_plugins/_ml/models/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

#### Example response

```json
{
  "name" : "all-MiniLM-L6-v2_onnx",
  "algorithm" : "TEXT_EMBEDDING",
  "version" : "1",
  "model_format" : "TORCH_SCRIPT",
  "model_state" : "DEPLOYED",
  "model_content_size_in_bytes" : 83408741,
  "model_content_hash_value" : "9376c2ebd7c83f99ec2526323786c348d2382e6d86576f750c89ea544d6bbb14",
  "model_config" : {
      "model_type" : "bert",
      "embedding_dimension" : 384,
      "framework_type" : "SENTENCE_TRANSFORMERS",
      "all_config" : """{"_name_or_path":"nreimers/MiniLM-L6-H384-uncased","architectures":["BertModel"],"attention_probs_dropout_prob":0.1,"gradient_checkpointing":false,"hidden_act":"gelu","hidden_dropout_prob":0.1,"hidden_size":384,"initializer_range":0.02,"intermediate_size":1536,"layer_norm_eps":1e-12,"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6,"pad_token_id":0,"position_embedding_type":"absolute","transformers_version":"4.8.2","type_vocab_size":2,"use_cache":true,"vocab_size":30522}"""
  },
  "created_time" : 1665961344044,
  "last_uploaded_time" : 1665961373000,
  "last_loaded_time" : 1665961815959,
  "total_chunks" : 9
}
```

## Valid model states

When a model is registered, deployed, or undeployed in OpenSearch, it transitions through various model states that reflect its availability. These states help you track the model's readiness for use, loading status, or failure conditions.

The following table lists all valid model states.

| Model state          | Description                                                                                              |
|:---------------------|:---------------------------------------------------------------------------------------------------------|
| `REGISTERING `       | The model is in the process of being registered to the cluster.                                          |
| `REGISTERED`         | The model metadata is registered to the cluster but not yet deployed.                                    |
| `DEPLOYED`           | The model has been successfully deployed/loaded to all eligible worker nodes and is ready for inference. |
| `DEPLOYING`          | The model is in the process of being deployed to memory.                                                 |
| `PARTIALLY_DEPLOYED` | The model has been deployed to some of the eligible worker nodes.                                        |
| `UNDEPLOYED`         | The model has been successfully unloaded/undeployed from memory on all the nodes.                        |
| `DEPLOY_FAILED`      | An error occurred while trying to deploy the model to the cluster nodes.                              |
