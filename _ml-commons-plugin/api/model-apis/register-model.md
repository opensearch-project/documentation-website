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

## Register an OpenSearch-provided pretrained model

OpenSearch provides several pretrained models. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

### Register a pretrained text embedding model

To register a pretrained text embedding model, the only required parameters are `name`, `version`, and `model_format`.

#### Request fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`version` | Integer | Required | The model version number. |
`model_format` | String | Required | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The model group ID of the model group to register this model to. 

#### Example request: OpenSearch-provided text embedding model

```json
POST /_plugins/_ml/models/_register
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.1",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

### Register a pretrained sparse encoding model

To register a pretrained sparse encoding model, you must set the function name to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`.

#### Request fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`version` | Integer | Required | The model version number. |
`model_format` | String | Required | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`function_name` | String | Required | Set this parameter to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`.
`model_content_hash_value` | String | Required | The model content hash generated using the SHA-256 hashing algorithm.
`url` | String | Required | The URL that contains the model. |
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The model group ID of the model group to register this model to. 

#### Example request: OpenSearch-provided sparse encoding model

```json
POST /_plugins/_ml/models/_register
{
    "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1",
    "version": "1.0.0",
    "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
    "description": "This is a neural sparse encoding model: It transfers text into sparse vector, and then extract nonzero index and value to entry and weights. It serves only in ingestion and customer should use tokenizer model in query.",
    "model_format": "TORCH_SCRIPT",
    "function_name": "SPARSE_ENCODING",
    "model_content_hash_value": "9a41adb6c13cf49a7e3eff91aef62ed5035487a6eca99c996156d25be2800a9a",
    "url":  "https://artifacts.opensearch.org/models/ml-models/amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1/1.0.0/torch_script/opensearch-neural-sparse-encoding-doc-v1-1.0.0-torch_script.zip"
}
```
{% include copy-curl.html %}

## Register a custom model 

To use a custom model locally within the OpenSearch cluster, you need to provide a URL and a config object for that model. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

### Request fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`version` | Integer | Required | The model version number. |
`model_format` | String | Required | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`function_name` | String | Required | Set this parameter to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`.
`model_content_hash_value` | String | Required | The model content hash generated using the SHA-256 hashing algorithm.
[`model_config`](#the-model_config-object)  | Object | Required | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. `all_config` is an optional JSON string that contains all model configurations. |
`url` | String | Required | The URL that contains the model. |
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The model group ID of the model group to register this model to. 

#### The `model_config` object

| Field | Data type | Description |
| :--- | :--- | :--- 
| `model_type` | String | The model type, such as `bert`. For a Hugging Face model, the model type is specified in `config.json`. For an example, see the [`all-MiniLM-L6-v2` Hugging Face model `config.json`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/blob/main/config.json#L15). Required. |
| `embedding_dimension` | Integer | The dimension of the model-generated dense vector. For a Hugging Face model, the dimension is specified in the model card. For example, in the [`all-MiniLM-L6-v2` Hugging Face model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2), the statement `384 dimensional dense vector space` specifies 384 as the embedding dimension. Required. |
| `framework_type` | String  | The framework the model is using. Currently, OpenSearch supports `sentence_transformers` and `huggingface_transformers` frameworks. The `sentence_transformers` model outputs text embeddings directly, so ML Commons does not perform any post processing. For `huggingface_transformers`, ML Commons performs post processing by applying mean pooling to get text embeddings. See the example [`all-MiniLM-L6-v2` Hugging Face model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) for more details. Required. |
| `all_config` | String | This field is used for reference purposes. You can specify all model configurations in this field. For example, if you are using a Hugging Face model, you can minify the `config.json` file to one line and save its contents in the `all_config` field. Once the model is uploaded, you can use the get model API operation to get all model configurations stored in this field. Optional. |

You can further customize a pretrained sentence transformer model's post-processing logic with the following optional fields in the `model_config` object.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `pooling_mode` | String | The post-process model output, either `mean`, `mean_sqrt_len`, `max`, `weightedmean`, or `cls`.|
| `normalize_result` | Boolean | When set to `true`, normalizes the model output in order to scale to a standard range for the model. |

#### Example request: Custom model

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

## Register a model hosted on a third-party platform

To register a model hosted on a third-party platform, you can either first create a standalone connector and provide the ID of that connector or specify an internal connector for the model. For more information, see [Creating connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).

### Request fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`function_name` | String | Required | Set this parameter to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`.
`connector_id` | Optional | Required | The connector ID of a standalone connector to a model hosted on a third-party platform. For more information, see [Standalone connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/#standalone-connector). You must provide either `connector_id` or `connector`.
`connector` | Object | Required | Contains specifications for an internal connector to a model that is hosted on a third-party platform. For more information, see [Internal connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/#internal-connector). You must provide either `connector_id` or `connector`.
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The model group ID of the model group to register this model to. 

#### Example request: Remote model with a standalone connector

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-3.5-turbo",
    "function_name": "remote",
    "model_group_id": "1jriBYsBq7EKuKzZX131",
    "description": "test model",
    "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```
{% include copy-curl.html %}

#### Example request: Remote model with an internal connector

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-GPT-3.5: internal connector",
    "function_name": "remote",
    "model_group_id": "lEFGL4kB4ubqQRzegPo2",
    "description": "test model",
    "connector": {
        "name": "OpenAI Connector",
        "description": "The connector to public OpenAI model service for GPT 3.5",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "endpoint": "api.openai.com",
            "max_tokens": 7,
            "temperature": 0,
            "model": "text-davinci-003"
        },
        "credential": {
            "openAI_key": "..."
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"prompt\": \"${parameters.prompt}\", \"max_tokens\": ${parameters.max_tokens}, \"temperature\": ${parameters.temperature} }"
            }
        ]
    }
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
