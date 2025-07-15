---
layout: default
title: Register model
parent: Model APIs
grand_parent: ML Commons APIs
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

## Endpoints

```json
POST /_plugins/_ml/models/_register
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `deploy` | Boolean | Whether to deploy the model after registering it. The deploy operation is performed by calling the [Deploy Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/). Default is `false`. |

## Register an OpenSearch-provided pretrained model

OpenSearch provides several pretrained models. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

### Register a pretrained text embedding model

To register a pretrained text embedding model, the only required parameters are `name`, `version`, and `model_format`.

#### Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`version` | String | Required | The model version. |
`model_format` | String | Required | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The ID of the model group to which to register the model.

## Example request: OpenSearch-provided text embedding model

```json
POST /_plugins/_ml/models/_register
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.3",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

### Register a pretrained sparse encoding model

To register a pretrained sparse encoding model, you must set the function name to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`.

#### Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`version` | String | Required | The model version. |
`model_format` | String | Required | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`function_name` | String | Required | For text embedding models, set this parameter to `TEXT_EMBEDDING`. For sparse encoding models, set this parameter to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`. For cross-encoder models, set this parameter to `TEXT_SIMILARITY`. For question answering models, set this parameter to `QUESTION_ANSWERING`.
`model_content_hash_value` | String | Required | The model content hash generated using the SHA-256 hashing algorithm.
`url` | String | Required | The URL that contains the model. |
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The ID of the model group to which to register this model.

## Example request: OpenSearch-provided sparse encoding model

```json
POST /_plugins/_ml/models/_register
{
    "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill",
    "version": "1.0.0",
    "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
    "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

## Register a custom model 

To use a custom model locally within the OpenSearch cluster, you need to provide a URL and a config object for that model. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

### Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`version` | String | Required | The model version. |
`model_format` | String | Required | The portable format of the model file. Valid values are `TORCH_SCRIPT` and `ONNX`. |
`function_name` | String | Required | Set this parameter to `TEXT_EMBEDDING`, `SPARSE_ENCODING`, `SPARSE_TOKENIZE`, `TEXT_SIMILARITY`, or `QUESTION_ANSWERING`.
`model_content_hash_value` | String | Required | The model content hash generated using the SHA-256 hashing algorithm.
[`model_config`](#the-model_config-object)  | Object | Required | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. The optional `all_config` JSON string contains all model configurations. The `additional_config` object contains the corresponding `space_type` for pretrained models or the specified `space_type` for custom models. See [Space types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-spaces/#distance-calculation). |
`url` | String | Required | The URL that contains the model. |
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The model group ID of the model group to register this model to. 
`is_enabled`| Boolean | Optional | Specifies whether the model is enabled. Disabling the model makes it unavailable for Predict API requests, regardless of the model's deployment status. Default is `true`.
`rate_limiter` | Object | Optional | Limits the number of times that any user can call the Predict API on the model. For more information, see [Rate limiting inference calls]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#rate-limiting-inference-calls).
`interface`| Object | Optional | The interface for the model. For more information, see [Interface](#the-interface-parameter).|

#### The `model_config` object

| Field | Data type | Description |
| :--- | :--- | :--- 
| `model_type` | String | The model type, such as `bert`. For a Hugging Face model, the model type is specified in `config.json`. For an example, see the [`all-MiniLM-L6-v2` Hugging Face model `config.json`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/blob/main/config.json#L15). Required. |
| `embedding_dimension` | Integer | The dimension of the model-generated dense vector. For a Hugging Face model, the dimension is specified in the model card. For example, in the [`all-MiniLM-L6-v2` Hugging Face model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2), the statement `384 dimensional dense vector space` specifies 384 as the embedding dimension. Required. |
| `framework_type` | String  | The framework the model is using. Currently, OpenSearch supports `sentence_transformers` and `huggingface_transformers` frameworks. The `sentence_transformers` model outputs text embeddings directly, so ML Commons does not perform any post processing. For `huggingface_transformers`, ML Commons performs post processing by applying mean pooling to get text embeddings. See the example [`all-MiniLM-L6-v2` Hugging Face model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) for more details. Required. |
| `all_config` | String | This field is used for reference purposes. You can specify all model configurations in this field. For example, if you are using a Hugging Face model, you can minify the `config.json` file to one line and save its contents in the `all_config` field. Once the model is uploaded, you can use the get model API operation to get all model configurations stored in this field. Optional. |
| `additional_config` | Object | Additional model configurations. Contains the `space_type`, which specifies the distance metric for k-NN search. For OpenSearch-provided pretrained models, this value is automatically set to the corresponding metric (for example, `l2` for `huggingface/sentence-transformers/all-distilroberta-v1`). For custom models, specify your preferred space type. Optional. See [Space types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-spaces/#distance-calculation). |

You can further customize a pretrained sentence transformer model's post-processing logic with the following optional fields in the `model_config` object.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `pooling_mode` | String | The post-process model output, either `mean`, `mean_sqrt_len`, `max`, `weightedmean`, or `cls`.|
| `normalize_result` | Boolean | When set to `true`, normalizes the model output in order to scale to a standard range for the model. |

## Example request: Custom model

The following example request registers a version `1.0.0` of an NLP sentence transformation model named `all-MiniLM-L6-v2`.

```json
POST /_plugins/_ml/models/_register
{
    "name": "all-MiniLM-L6-v2",
    "version": "1.0.0",
    "description": "test model",
    "model_format": "TORCH_SCRIPT",
    "function_name": "TEXT_EMBEDDING",
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

To register a model hosted on a third-party platform, you can either first create a standalone connector and provide the ID of that connector or specify an internal connector for the model. For more information, see [Creating connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

### Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The model name. |
`function_name` | String | Required | Set this parameter to `SPARSE_ENCODING` or `SPARSE_TOKENIZE`.
`connector_id` | Optional | Required | The connector ID of a standalone connector for a model hosted on a third-party platform. For more information, see [Standalone connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-standalone-connector). You must provide either `connector_id` or `connector`.
`connector` | Object | Required | Contains specifications for a connector for a model hosted on a third-party platform. For more information, see [Creating a connector for a specific model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-connector-for-a-specific-model). You must provide either `connector_id` or `connector`.
`description` | String | Optional| The model description. |
`model_group_id` | String | Optional | The model group ID of the model group to register this model to. 
`is_enabled`| Boolean | Optional | Specifies whether the model is enabled. Disabling the model makes it unavailable for Predict API requests, regardless of the model's deployment status. Default is `true`.
`rate_limiter` | Object | Optional | Limits the number of times that any user can call the Predict API on the model. For more information, see [Rate limiting inference calls]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#rate-limiting-inference-calls).
`guardrails`| Object | Optional | The guardrails for the model input. For more information, see [Guardrails](#the-guardrails-parameter).|
`interface`| Object | Optional | The interface for the model. For more information, see [Interface](#the-interface-parameter).|

## Example request: Externally hosted with a standalone connector

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

## Example request: Externally hosted with a connector specified as part of the model

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

## Example response

OpenSearch responds with the `task_id`, task `status`, and `model_id`:

```json
{
  "task_id" : "ew8I44MBhyWuIwnfvDIH", 
  "status" : "CREATED",
  "model_id": "t8qvDY4BChVAiNVEuo8q"
}
```

### The `guardrails` parameter

Guardrails are safety measures for large language models (LLMs). They provide a set of rules and boundaries that control how an LLM behaves and what kind of output it generates. 

To register an externally hosted model with guardrails, provide the `guardrails` parameter, which supports the following fields. All fields are optional.

Field | Data type | Description
:---  | :--- | :---
`type` | String | The guardrail type. Valid values are [`local_regex`](#example-request-regex-and-stopword-validation) and [`model`](#example-request-guardrail-model-validation). Using `local_regex`, you can specify a regular expression or stop words. Using `model`, you can specify a guardrail model. For more information, see [Guardrails]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/guardrails/). 
`input_guardrail`| Object |  The guardrail for the model input. 
`output_guardrail`| Object |  The guardrail for the model output. 
`stop_words`| Object | The list of indexes containing stopwords used for model input/output validation. If the model prompt/response contains a stopword contained in any of the indexes, then the predict request on the model is rejected. 
`index_name`| Object | The name of the index storing the stopwords. 
`source_fields`| Object | The name of the field storing the stopwords. 
`regex`| Object |  A regular expression used for input/output validation. If the model prompt/response matches the regular expression, then the predict request on the model is rejected. 
`model_id`| String  | The guardrail model used to validate user input and LLM output. 
`response_filter`| String | The dot path of the field containing the guardrail model response. 
`response_validation_regex`| String | The regular expression used to validate the guardrail model response.     

## Examples

The following examples configure an externally hosted model with guardrails.

## Example request: Regex and stopword validation

The following example uses a regular expression and a set of stopwords to validate the LLM response:

```json
POST /_plugins/_ml/models/_register
{
  "name": "openAI-gpt-3.5-turbo",
  "function_name": "remote",
  "model_group_id": "1jriBYsBq7EKuKzZX131",
  "description": "test model",
  "connector_id": "a1eMb4kBJ1eYAeTMAljY",
  "guardrails": {
    "type": "local_regex",
    "input_guardrail": {
      "stop_words": [
        {
          "index_name": "stop_words_input",
          "source_fields": ["title"]
        }
      ],
      "regex": ["regex1", "regex2"]
    },
    "output_guardrail": {
      "stop_words": [
        {
          "index_name": "stop_words_output",
          "source_fields": ["title"]
        }
      ],
      "regex": ["regex1", "regex2"]
    }
  }
}
```
{% include copy-curl.html %}

For a complete example, see [Validating input/output using stopwords and regex]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/guardrails/#validating-inputoutput-using-stopwords-and-regex).

## Example request: Guardrail model validation

The following example uses a guardrail model to validate the LLM response:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Bedrock Claude V2 model with guardrails model",
    "function_name": "remote",
    "model_group_id": "ppSmpo8Bi-GZ0tf1i7cD",
    "description": "Bedrock Claude V2 model with guardrails model",
    "connector_id": "xnJjDZABNFJeYR3IPvTO",
    "guardrails": {
        "input_guardrail": {
            "model_id": "o3JaDZABNFJeYR3I2fRV",
            "response_validation_regex": "^\\s*\"[Aa]ccept\"\\s*$"
        },
        "output_guardrail": {
            "model_id": "o3JaDZABNFJeYR3I2fRV",
            "response_validation_regex": "^\\s*\"[Aa]ccept\"\\s*$"
        },
        "type": "model"
    }
}
```
{% include copy-curl.html %}

For a complete example, see [Validating input/output using a guardrail model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/guardrails/#validating-inputoutput-using-a-guardrail-model).

## Example response

OpenSearch responds with the `task_id`, task `status`, and `model_id`:

```json
{
    "task_id": "tsqvDY4BChVAiNVEuo8F",
    "status": "CREATED",
    "model_id": "t8qvDY4BChVAiNVEuo8q"
}
```

### The `interface` parameter

The model interface provides a highly flexible way to add arbitrary metadata annotations to all local deep learning models and externally hosted models in a JSON schema syntax. This annotation initiates a validation check on the input and output fields of the model during the model's invocation. The validation check ensures that the input and output fields are in the correct format both before and after the model performs inference.

To register a model with a model interface, provide the `interface` parameter, which supports the following fields.

Field | Data type | Description                         
:---  | :--- |:------------------------------------
`input`| Object | The JSON schema for the model input. |
`output`| Object | The JSON schema for the model output. |

The input and output fields are evaluated against the provided JSON schema. You do not need to provide both fields simultaneously.

#### Connector model interfaces

To simplify your workflow, you can register an externally hosted model using a connector in one of the [connector blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/) formats. If you do so, a predefined model interface for this connector is generated automatically during model registration. The predefined model interface is generated based on the connector blueprint and the model's metadata, so you must strictly follow the blueprint when creating the connector in order to avoid errors.

The following connector blueprints currently support creating predefined model interfaces:

- [Amazon Comprehend](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/amazon_comprehend_connector_blueprint.md)
- [Amazon Textract](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/amazon_textract_connector_blueprint.md) (Note that a predefined model interface is only available for the `DetectDocumentText` API; the `DetectEnities` API is not currently supported).
- [Amazon Bedrock AI21 Labs Jurassic](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_ai21labs_jurassic_blueprint.md)
- [Amazon Bedrock Anthropic Claude 3](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_anthropic_claude3_blueprint.md)
- [Amazon Bedrock Anthropic Claude](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_anthropic_claude_blueprint.md)
- [Amazon Bedrock Cohere Embed English v3](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_cohere_cohere.embed-english-v3_blueprint.md)
- [Amazon Bedrock Cohere Embed Multilingual v3](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_cohere_cohere.embed-multilingual-v3_blueprint.md)
- [Amazon Bedrock Titan Text Embeddings](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_titan_embedding_blueprint.md)
- [Amazon Bedrock Titan Multimodal Embeddings](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_titan_multimodal_embedding_blueprint.md)

To learn more about connector blueprints, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).

## Example request: Externally hosted model with an interface

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-3.5-turbo",
    "function_name": "remote",
    "description": "test model",
    "connector_id": "A-j7K48BZzNMh1sWVdJu",
    "interface": {
        "input": {
            "properties": {
                "parameters": {
                    "properties": {
                        "messages": {
                            "type": "string",
                            "description": "This is a test description field"
                        }
                    }
                }
            }
        },
        "output": {
            "properties": {
                "inference_results": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "output": {
                                "type": "array",
                                "items": {
                                    "properties": {
                                        "name": {
                                            "type": "string",
                                            "description": "This is a test description field"
                                        },
                                        "dataAsMap": {
                                            "type": "object",
                                            "description": "This is a test description field"
                                        }
                                    }
                                },
                                "description": "This is a test description field"
                            },
                            "status_code": {
                                "type": "integer",
                                "description": "This is a test description field"
                            }
                        }
                    },
                    "description": "This is a test description field"
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the `task_id`, task `status`, and `model_id`:

```json
{
    "task_id": "tsqvDY4BChVAiNVEuo8F",
    "status": "CREATED",
    "model_id": "t8qvDY4BChVAiNVEuo8q"
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
