---
layout: default
title: Connecting to other ML platforms
has_children: false
nav_order: 60
---

# Connecting to other ML platforms

Machine Learning (ML) Connectors enables the ability to integrate OpenSearch's ML capabilities with third-party ML tools and platforms. Through connectors, OpenSearch can invoke these third-party endpoints to enrich query results and data pipelines.

## Supported connectors

As of OpenSearch 2.9, connectors have been tested for the following ML tools, though its possible to make connectors for tools not listed:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage the life cycle of text embedding models on Amazon SageMaker, powering semantic search queries on OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferences. This benefits Amazon SageMaker users who value it's functionality such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [Amazon Comprehend](https://aws.amazon.com/comprehend/) allows you to extract metadata automatically from OpenSearch ingest pipeline, enriching data indexed in OpneSearch and improving your search capabilities. 
- [ChatGPT](https://openai.com/blog/chatgpt) enables you to run OpenSearch queries while invoking the ChatGPT API, helping you build on OpenSearch faster and improves the speed in which OpenSearch search functionality can retrieve data.
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) is an alternative to ChatGPT inside a fully managed-service.
- [NVIDIA Triton](https://developer.nvidia.com/triton-inference-server) allows you to host text embedding models on NVIDIA's high performance model serving technology. Power semantic search queries and vector generation ingest pipelines using [GPU-acceleration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/gpu-acceleration/).
- [Cohere](https://cohere.com/) allows you to use data from OpenSearch to power Cohere's large language models.

## Prerequisites

If you are an admin deploying wanting to use an ML connector, make sure that target model of the connector has already been deployed on your chosen platform. Furthermore, make sure that you have access to send and receive data to the third-party API for your connector. 

When access control is enabled on your third-party platform, you can enter your security settings using the `authorization` or `credential` settings inside the connector API.

### Adding trusted endpoints

To make sure that you configure connectors in OpenSearch, add the trusted endpoints into your cluster settings using the `plugins.ml_commons.trusted_connector_endpoints_regex` setting, as shown in the following example:

```
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.trusted_connector_endpoints_regex": [
            "^https://runtime\\.sagemaker\\..*\\.amazonaws\\.com/.*$",
            "^https://api\\.openai\\.com/.*$",
            "^https://api\\.cohere\\.ai/.*$",
            "^https://bedrock\\..*\\.amazonaws.com/.*$"
        ]
    }
}
```
{% include copy-curl.html %}

### Enabling ML nodes

Connectors also require the use of dedicated ML nodes. To make sure you have ML nodes enabled, update the following cluster settings:

```
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.only_run_on_ml_node": true,
        "plugins.ml_commons.native_memory_threshold": 100
    }
}
```
{% include copy-curl.html %}


### Setting up connector access control

To enable access control on the connector API, use the following cluster setting. When enabled, the `authorization` or `credential` options will be required in order to use the connector API.

```
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.connector_access_control_enabled": false
    }
}
```
{% include copy-curl.html %}

If successful, OpenSearch returns the following response:

```
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

## Creating a connector

The connector create API, `/_plugins/_ml/connectors/_create`, creates connections to third-party ML tools. Using the `endpoint` parameter, you can connect to any supported ML tool using their specific API endpoint. For example, to connect to a ChatGPT completion model, you can connect using the `api.openai.com` as shown in the following example:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Connector",
    "description": "The connector to public OpenAI model service for GPT 3.5",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "auth": "API_Key",
        "content_type": "application/json",
        "max_tokens": 7,
        "temperature": 0,
        "model": "text-davinci-003"
    },
    "credential": {
        "openAI_key": "<encrypted-key>"
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
    ],
    "access_mode": "public"
}
```

If successful, the connector API responds with a `connector_id` and `status` for the connection.

```
{
 "connector_id": "M2pBmYgB5cK1H70wk3hd",
 "status": "CREATED"
}
```

## Configuration options

The following configuration options are **required** in order to build a connector:

| Field | Data type | Description |
| :---  | :--- | :--- |
| `name` | String | The name of the connector. |
| `description` | String | The description for the connector. |
| `version` | Integer | The version for the connector. |
| `protocol` | String | The protocol for the connection. For AWS services such as SageMaker and Bedrock, use `aws_sigv4`. For all other services, use `http`. |
| `parameter` | JSON array | The default connector parameters, including `endpoint` and `model`. 
| `credential` | String | Defines any credential variables required connect to your chosen endpoint. ML Commons uses **AES/GCM/NoPadding** symmetric encryption with a key length of 32 bytes. When a connection cluster first starts, the key persists inside of OpenSearch. Therefore, you do not need to manually encrypt the key.
| `action` | JSON array | Tells the connector what actions to run after a connection to ML Commons has been made. For more information about how to configure actions, see [Actions](#action-settings).

### Action settings

The `action` setting when creating a connection tells the connector what ML Commons API operation to run against the connection endpoint. You can configure actions using the following settings:

| Field | Data type | Description |
| :---  | :--- | :--- |
`action_type` | String | Required. Sets the ML Commons API operation to use upon connection. As of OpenSearch 2.9, only `predict` is supported. 
`method` | String | Required. Defines the HTTP method for the API call. Supports `POST` and `GET`.
`url` | String | Required. Sets the connection endpoint the action takes place. This must match the regex expression for the connection using when [adding trusted endpoints](#adding-trusted-endpoints).
`headers` | Sets the headers used inside the request or response body. Default is `application/json`.
`request_body` | Required. Sets the parameters contained inside the request body of the action.

## Registering and deploying a connected model

After a connection has been created, use the `connector_id` from the response to register and deploy a connected models.

For registering model, you have the following options:

- You can use `model_group_id` to create the model with an associated model group.
- If you do not use `model_group_id`, a new model is created.

The following example registers a model named `openAI-GPT-3.5 completions`:

```
POST /_plugins/_ml/models/_register
{
    "name": "openAI-GPT-3.5 completions",
    "function_name": "remote",
    "model_group_id": "lEFGL4kB4ubqQRzegPo2",
    "description": "test model",
    "connector_id": "kUFFL4kB4ubqQRzeQ_r-"
}
```

ML Commons returns the `task_id` and registration status of the model. You can use the `task_id` to find the `model_id`, as showing the following example:

**GET model request**

```
GET /_plugins/_ml/tasks/l0FIL4kB4ubqQRzeKvpV
```

**GET model response**

```
{
  "model_id": "mUFIL4kB4ubqQRzeKvr1",
  "task_type": "REGISTER_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "Zx5D5SeOS_-EAteyzBpTYg"
  ],
  "create_time": 1688715405818,
  "last_update_time": 1688715406198,
  "is_async": false
}
```

Lastly, use the `model_id` to deploy the model, as showing in the following:

**Deploy model request**

```
POST /_plugins/_ml/models/mUFIL4kB4ubqQRzeKvr1/_deploy
```

**Deploy model response**

```
{
  "task_id": "OP5JL4kB28KP1SGMupr3",
  "status": "CREATED"
}
```

Use the `task_id` from the deploy model response to make sure the model deployment completes.

**Verify deploy completion request**

```
GET /_plugins/_ml/tasks/OP5JL4kB28KP1SGMupr3
```

**Verify deploy completion response**

```
{
  "model_id": "mUFIL4kB4ubqQRzeKvr1",
  "task_type": "DEPLOY_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "V2GLKobDTY2yBDy1Uawwvw"
  ],
  "create_time": 1688715508466,
  "last_update_time": 1688715508692,
  "is_async": true
}
```

After a successful deployment, you can test the model using the Predict API set in the connector's `action` settings, as shown in the following example:

```
POST /_plugins/_ml/models/mUFIL4kB4ubqQRzeKvr1/_predict
{
    "parameters": {
        "prompt": "Say this is a test"
    }
}
```

The Predict API returns inference results for the connected model, as shown in the following example response:

```
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "cmpl-7ZaMR9V34zIIaYDyNNMpaS5KolU0X",
            "object": "text_completion",
            "created": 1688715607,
            "model": "text-davinci-003",
            "choices": [
              {
                "text": """

This is indeed a test""",
                "index": 0,
                "finish_reason": "length"
              }
            ],
            "usage": {
              "prompt_tokens": 5,
              "completion_tokens": 7,
              "total_tokens": 12
            }
          }
        }
      ]
    }
  ]
}
```






## Examples 

The following examples connector calls show how to create a connector with supported third-party tools.

### Cohere

The following example request creates a standalone Cohere connection:

```
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

### AWS

The following example creates a SageMaker connector:

```
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

The `credential` parameter contains the following options reserved for `aws-sigv4` authentication.

- `access_key`: Required. Provides the access key for the AWS instance.
- `secret_key`: Required. Provides the secret key for the AWS instance.
- `session_token`: Optional. Provides a temporary set of credentials for the AWS instance.

The `paramaters` section requires the following options when using `aws-sigv4` authentication.

- `region`: The region of the AWS instance.
- `service_name`: The name of the AWS service for the connector.


## Next steps

- To learn more about using models in OpneSearch, see [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).
- To learn more about model access control and groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).



