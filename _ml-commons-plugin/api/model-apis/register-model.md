---
layout: default
title: Register model
parent: Model APIs
grand_parent: ML Commons API
nav_order: 10
---

# Register a model

All versions of a particular model are held in a model group. You can either [register a model group]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-group-apis/register-model-group/) before registering a model to the group or register a first version of a model, thereby creating the group. Each model group name in the cluster must be globally unique. 

If you are registering the first version of a model without first registering the model group, a new model group is created automatically with the following name and access level:

- Name: The new model group will have the same name as the model. Because the model group name must be unique, ensure that your model name does not have the same name as any model groups in the cluster. 
- Access level: The access level for the new model group is determined using the `access_mode`, `backend_roles`, and `add_all_backend_roles` parameters that you pass in the request. If you provide none of the three parameters, the new model group will be `private` if model access control is enabled on your cluster and `public` if model access control is disabled. The newly registered model is the first model version assigned to that model group. 

Once a model group is created, provide its `model_group_id` to register a new model version to the model group. In this case, the model name does not need to be unique.

If you're using [pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models#supported-pretrained-models) provided by OpenSearch, we recommend that you first register a model group with a unique name for these models. Then register the pretrained models as versions to that model group. This ensures that every model group has a globally unique model group name.
{: .tip}

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

If the model is more than 10 MB in size, ML Commons splits it into smaller chunks and saves those chunks in the model's index.

## Path and HTTP methods

```json
POST /_plugins/_ml/models/_register
```
{% include copy-curl.html %}

## Request fields

All request fields are required. 

Field | Data type | Description
:---  | :--- | :--- 
`name`| String | The model's name. |
`version` | Integer | The model's version number. |
`model_format` | String | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`model_group_id` | String | The model group ID of the model group to register this model to. 
`model_content_hash_value` | String | The model content hash generated using the SHA-256 hashing algorithm.
[`model_config`](#the-model_config-object)  | JSON object | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. `all_config` is an optional JSON string that contains all model configurations. |
`url` | String | The URL that contains the model. |
`connector` | Object | This optional parameter creates an internal connector if a model is hosted on a third-party platform. For more information, see [Internal connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/#internal-connector).

### The `model_config` object

| Field | Data type | Description |
| :--- | :--- | :--- 
| `model_type` | String | The model type, such as `bert`. For a Hugging Face model, the model type is specified in `config.json`. For an example, see the [`all-MiniLM-L6-v2` Hugging Face model `config.json`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/blob/main/config.json#L15).|
| `embedding_dimension` | Integer | The dimension of the model-generated dense vector. For a Hugging Face model, the dimension is specified in the model card. For example, in the [`all-MiniLM-L6-v2` Hugging Face model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2), the statement `384 dimensional dense vector space` specifies 384 as the embedding dimension. |
| `framework_type` | String  | The framework the model is using. Currently, we support `sentence_transformers` and `huggingface_transformers` frameworks. The `sentence_transformers` model outputs text embeddings directly, so ML Commons does not perform any post processing. For `huggingface_transformers`, ML Commons performs post processing by applying mean pooling to get text embeddings. See the example [`all-MiniLM-L6-v2` Hugging Face model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) for more details. |
| `all_config` _(Optional)_ | String | This field is used for reference purposes. You can specify all model configurations in this field. For example, if you are using a Hugging Face model, you can minify the `config.json` file to one line and save its contents in the `all_config` field. Once the model is uploaded, you can use the get model API operation to get all model configurations stored in this field. |

You can further customize a pretrained sentence transformer model's post-processing logic with the following optional fields in the `model_config` object.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `pooling_mode` | String | The post-process model output, either `mean`, `mean_sqrt_len`, `max`, `weightedmean`, or `cls`.|
| `normalize_result` | Boolean | When set to `true`, normalizes the model output in order to scale to a standard range for the model. |

#### Example request

The following example request registers a version `1.0.0` of an NLP sentence transformation model named `all-MiniLM-L6-v2`.

```json
POST /_plugins/_ml/models/_register
{
    "name": "all-MiniLM-L6-v2",
    "version": "1.0.0",
    "description": "test model",
    "model_format": "TORCH_SCRIPT",
    "model_group_id": "FTNlQ4gBYW0Qyy5ZoxfR",
    "model_content_hash_value": "c15f0d2e62d872be5b5bc6c84d2e0f4921541e29fefbef51d59cc10a8ae30e0f",
    "model_config": {
        "model_type": "bert",
        "embedding_dimension": 384,
        "framework_type": "sentence_transformers",
       "all_config": "{\"_name_or_path\":\"nreimers/MiniLM-L6-H384-uncased\",\"architectures\":[\"BertModel\"],\"attention_probs_dropout_prob\":0.1,\"gradient_checkpointing\":false,\"hidden_act\":\"gelu\",\"hidden_dropout_prob\":0.1,\"hidden_size\":384,\"initializer_range\":0.02,\"intermediate_size\":1536,\"layer_norm_eps\":1e-12,\"max_position_embeddings\":512,\"model_type\":\"bert\",\"num_attention_heads\":12,\"num_hidden_layers\":6,\"pad_token_id\":0,\"position_embedding_type\":\"absolute\",\"transformers_version\":\"4.8.2\",\"type_vocab_size\":2,\"use_cache\":true,\"vocab_size\":30522}"
    },
    "url": "https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/torch_script/sentence-transformers_all-MiniLM-L6-v2-1.0.1-torch_script.zip"
}
```
{% include copy-curl.html %}

#### Example response

OpenSearch responds with the `task_id` and task `status`.

```json
{
  "task_id" : "ew8I44MBhyWuIwnfvDIH", 
  "status" : "CREATED"
}
```

## Check the status of model registration

To see the status of your model registration and retrieve the model ID created for the new model version, pass the `task_id` as a path parameter to the Tasks API:

```json
GET /_plugins/_ml/tasks/<task_id>
```
{% include copy-curl.html %}

The response contains the model ID of the model version:

```json
{
  "model_id": "Qr1YbogBYOqeeqR7sI9L",
  "task_type": "DEPLOY_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "N77RInqjTSq_UaLh1k0BUg"
  ],
  "create_time": 1685478486057,
  "last_update_time": 1685478491090,
  "is_async": true
}
```

## Registering a model containing an internal connector

When registering a model hosted on a third-party platform, you can create an internal connector that is specific to the model. The internal connector facilitates connection to the externally hosted model. For more information, see [Internal connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/#internal-connector).