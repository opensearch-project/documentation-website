---
layout: default
title: Connecting to other ML platforms
has_children: false
nav_order: 60
---

# Connecting to third-party ML platforms

Machine Learning (ML) Connectors provides the ability to integrate OpenSearch ML capabilities with third-party ML tools and platforms. Through connectors, OpenSearch can invoke these third-party endpoints to enrich query results and data pipelines.

You can provision connectors in two ways:

1. An [external connector](#external-connector), saved in a connector index, can be reused and shared with multiple remote models but requires access to both the model and the third party being accessed by the connector, such as OpenAI.

2. An [local connector](#local-connector), saved in the model index, can only be used with one remote model. Unlike a standalone connector, users only need access to the model itself to access an internal connector because the connection is established inside the model.


## Supported connectors

As of OpenSearch 2.9, connectors have been tested for the following ML tools, though it is possible to create connectors for other tools not listed here:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage the lifecycle of text-embedding models, powering semantic search queries in OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferences. This benefits Amazon SageMaker users who value its functionality, such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [OpenAI ChatGPT](https://openai.com/blog/chatgpt) enables you to invoke an OpenAI chat model from inside an OpenSearch cluster.
- [Cohere](https://cohere.com/) allows you to use data from OpenSearch to power Cohere's large language models.


All connectors consist a JSON blueprint created by ML developers to allow administrators and data scientists to make connections between OpenSearch and an AI service or model serving technology. Additional connectors will be added to this page as they are tested and verified. 

You can find approved blueprints for each connector in the [ML Commons repo](https://github.com/opensearch-project/ml-commons/tree/2.x/docs/remote_inference_blueprints). 

If you want build your own blueprint, see [Building blueprints](#building-blueprints).




## Prerequisites

If you are an admin deploying an ML connector, make sure that the target model of the connector has already been deployed on your chosen platform. Furthermore, make sure that you have permissions to send and receive data to the third-party API for your connector. 

When access control is enabled on your third-party platform, you can enter your security settings using the `authorization` or `credential` settings inside the connector API.

### Adding trusted endpoints

To configure connectors in OpenSearch, add the trusted endpoints to your cluster settings using the `plugins.ml_commons.trusted_connector_endpoints_regex` setting, which supports Java regex expressions, as shown in the following example:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.trusted_connector_endpoints_regex": [
          "^https://runtime\\.sagemaker\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://api\\.openai\\.com/.*$",
          "^https://api\\.cohere\\.ai/.*$"
        ]
    }
}
```
{% include copy-curl.html %}



### Setting up connector access control

If you plan on using a remote connector, making sure to use an OpenSearch cluster with the Security plugin enabled. 
{: .warning}

If you require granular access control on your connectors, use the following cluster setting:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.connector_access_control_enabled": true
    }
}
```
{% include copy-curl.html %}

When enabled, you can install the [Security plugin]({{site.url}}{{site.baseurl}}/security/index/) the `backend_roles`, `add_all_backend_roles`, or `access_model` options are required in order to use the connector API. If successful, OpenSearch returns the following response:

```json
{
  "acknowledged": true,
  "persistent": {
    "plugins": {
      "ml_commons": {
        "connector_access_control_enabled": "true"
      }
    }
  },
  "transient": {}
}
```

### Node settings

Standalone connectors consume less resources. Therefore, you can deploy any model from a standalone connector using data nodes. To make sure that your standalone connection uses data nodes, set `plugins.ml_commons.only_run_on_ml_node` to `false`, as shown in the following example:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.only_run_on_ml_node": false
    }
}

```
{% include copy-curl.html %}

If you want to use an internal connector, use a dedicated ML node and set `plugins.ml_commons.only_run_on_ml_node` to `true`. Remember, using dedicated ML nodes consumes more resources, which could lead to increased costs when deploying models from an internal connector.



## External connector

Admins need to only enter in their `credential` settings, such as `"openAI_key"`, for the service they are connecting to. All other parameters are defined within the [blueprint](#building-blueprints).
{: .note}

The connector creation API, `/_plugins/_ml/connectors/_create`, creates connections that allow users to deploy and register external models through OpenSearch. Using the `endpoint` parameter, you can connect ML Commons to any supported ML tool using its specific API endpoint. For example, to connect to a ChatGPT model, you can connect using the `api.openai.com`, as shown in the following example:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for GPT 3.5",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-3.5-turbo"
    },
    "credential": {
        "openAI_key": "..."
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://${parameters.endpoint}/v1/chat/completions",
            "headers": {
                "Authorization": "Bearer ${credential.openAI_key}"
            },
            "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
        }
    ]
}
```
{% include copy-curl.html %}

If successful, the connector API responds with the `connector_id` for the connection:

```json
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-3.5-turbo",
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

## Local connector

Admins need to only enter in their `credential` settings, such as `"openAI_key"`, for the service they are connecting to. All other parameters are defined within the [blueprint](#building-blueprints).
{: .note}

To create an internal connector, add the `connector` parameter to the Register model API, as shown in the following example:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-GPT-3.5: internal connector",
    "function_name": "remote",
    "model_group_id": "lEFGL4kB4ubqQRzegPo2",
    "description": "test model",
    "connector": {
    "name": "openAI-gpt-3.5-turbo",
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
}
```

## Registering and deploying a connected model

After a connection has been created, use the `connector_id` from the response to register and deploy a connected model.

To register a model, you have the following options:

- You can use `model_group_id` to register a model version to an existing model group.
- If you do not use `model_group_id`, ML Commons creates a model with a new model group.

If you want to create a new `model_group`, use the following example:

```json
POST /_plugins/_ml/model_groups/_register
{
  "name": "remote_model_group",
  "description": "This is an example description"
}
```

ML Commons returns the following response:

```json
{
  "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
  "status": "CREATED"
}
```

The following example registers a model named `openAI-gpt-3.5-turbo`:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-3.5-turbo",
    "function_name": "remote",
    "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
    "description": "test model",
    "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

ML Commons returns the `task_id` and registration status of the model:

```json
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED"
}
```


You can use the `task_id` to find the `model_id`, as shown the following example:


**GET task request**

```json
GET /_plugins/_ml/tasks/cVeMb4kBJ1eYAeTMFFgj
```

**GET task response**

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

Lastly, use the `model_id` to deploy the model:

**Deploy model request**

```json
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_deploy
```

**Deploy model response**

```json
{
  "task_id": "vVePb4kBJ1eYAeTM7ljG",
  "status": "CREATED"
}
```

Use the `task_id` from the deploy model response to make sure the model deployment completes:

**Verify deploy completion request**

```json
GET /_plugins/_ml/tasks/vVePb4kBJ1eYAeTM7ljG
```

**Verify deploy completion response**

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

After a successful deployment, you can test the model using the Predict API set in the connector's `action` settings, as shown in the following example:

```json
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_predict
{
  "parameters": {
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }
}
```

The Predict API returns inference results for the connected model, as shown in the following example response:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "chatcmpl-7e6s5DYEutmM677UZokF9eH40dIY7",
            "object": "chat.completion",
            "created": 1689793889,
            "model": "gpt-3.5-turbo-0613",
            "choices": [
              {
                "index": 0,
                "message": {
                  "role": "assistant",
                  "content": "Hello! How can I assist you today?"
                },
                "finish_reason": "stop"
              }
            ],
            "usage": {
              "prompt_tokens": 19,
              "completion_tokens": 9,
              "total_tokens": 28
            }
          }
        }
      ]
    }
  ]
}
```


## Examples 

The following example connector requests show how to create a connector with supported third-party tools.


### OpenAI chat connector

The following example creates a standalone OpenAI chat connector. The same options can be used for an internal connector under the `connector` parameter:


```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for GPT 3.5",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-3.5-turbo"
    },
    "credential": {
        "openAI_key": "..."
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://${parameters.endpoint}/v1/chat/completions",
            "headers": {
                "Authorization": "Bearer ${credential.openAI_key}"
            },
            "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
        }
    ]
}
```

After creating the connector, you can retrieve the `task_id` and `connector_id` to register and deploy the model, then use the Predict API, similar to a standalone connector.


### Amazon SageMaker

The following example creates a standalone Amazon SageMaker connector. The same options can be used for an internal connector under the `connector` parameter:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "sagemaker: embedding",
    "description": "Test connector for Sagemaker embedding model",
    "version": 1,
    "protocol": "aws_sigv4",
    "credential": {
        "access_key": "...",
        "secret_key": "...",
        "session_token": "..."
    },
    "parameters": {
        "region": "us-west-2",
        "service_name": "sagemaker"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "url": "https://runtime.sagemaker.${parameters.region}.amazonaws.com/endpoints/lmi-model-2023-06-24-01-35-32-275/invocations",
            "request_body": "[\"${parameters.inputs}\"]"
        }
    ]
}
```

The `credential` parameter contains the following options reserved for `aws_sigv4` authentication:

- `access_key`: Required. Provides the access key for the AWS instance.
- `secret_key`: Required. Provides the secret key for the AWS instance.
- `session_token`: Optional. Provides a temporary set of credentials for the AWS instance.

The `parameters` section requires the following options when using `aws_sigv4` authentication:

- `region`: The AWS Region in which the AWS instance is located.
- `service_name`: The name of the AWS service for the connector.

### Cohere

The following example request creates a standalone Cohere connection:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Cohere Connector: embedding",
    "description": "The connector to cohere embedding model",
    "version": 1,
    "protocol": "http",
    "credential": {
        "cohere_key": "..."
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://api.cohere.ai/v1/embed",
            "headers": {
                "Authorization": "Bearer ${credential.cohere_key}"
            },
            "request_body": "{ \"texts\": ${parameters.prompt}, \"truncate\": \"END\" }"
        }
    ]
}
```
{% include copy-curl.html %}

## Building blueprints

All connectors consist a JSON blueprint created by ML developers to allow administrators and data scientists to make connections between OpenSearch and an AI service or model serving technology. 

The following configuration options are **required** in order to build a connector blueprint. These settings can be used for both external and local connectors.

| Field | Data type | Description |
| :---  | :--- | :--- |
| `name` | String | The name of the connector. |
| `description` | String | A description of the connector. |
| `version` | Integer | The version of the connector. |
| `protocol` | String | The protocol for the connection. For AWS services such as Amazon SageMaker and Amazon Bedrock, use `aws_sigv4`. For all other services, use `http`. |
| `parameters` | JSON array | The default connector parameters, including `endpoint` and `model`.  Any parameters indicated in this field can be overrided by parameters made in a predict request. |
| `credential` | `Map<string, string>` | Defines any credential variables required to connect to your chosen endpoint. ML Commons uses **AES/GCM/NoPadding** symmetric encryption to encrypt your credentials. When the connection to the cluster first starts, OpenSearch creates a random 32 byte encryption key which persists in OpenSearch's system index. Therefore, you do not need to manually set the encryption key. |
| `action` | `Map<string, string>` | Define what actions can run within the connector. If you're an administrator making a connection, add the [blueprint](#building-blueprints) for your desired connection. |
| `backend_roles` | String | A list of OpenSearch backend roles. For more information about setting up backend roles, see [Assigning backend roles to users]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#assigning-backend-roles-to-users). |
| `access_mode` | String | Sets the access mode for the model, either `public`, `restricted`, or `private`. Default is `private`. For more information about `access_mode`, see [Model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#model-groups). |
| `add_all_backend_roles` | Boolean | When set to `true`, adds all `backend_roles` to the access list, which only a user with admin permissions can adjust. When set to `false`, non-admins can add `backend_roles`. |

The `action` parameter supports the following options.

| Field | Data type | Description |
| :---  | :--- | :--- |
| `action_type` | String | Required. Sets the ML Commons API operation to use upon connection. As of OpenSearch 2.9, only `predict` is supported. |
| `method` | String | Required. Defines the HTTP method for the API call. Supports `POST` and `GET`. |
| `url` | String | Required. Sets the connection endpoint at which the action takes place. This must match the regex expression for the connection used when [adding trusted endpoints](#adding-trusted-endpoints). |
| `headers` | String | Sets the headers used inside the request or response body. Default is `ContentType: application/json`. If your third-part ML tool requires access control, define any `credential` parameters need in the `headers` parameter. |
| `request_body` | String | Required. Sets the parameters contained inside the request body of the action. The parameters must include `\"inputText\`, which sets how users of the connector should construct the request payload for the `action_type`. |



## Next steps

- To learn more about using models in OpenSearch, see [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).
- To learn more about model access control and model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).



