---
layout: default
title: Connectors
has_children: true
has_toc: false
nav_order: 61
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
redirect_from: 
  - /ml-commons-plugin/extensibility/connectors/
---

# Connectors for third-party ML platforms
**Introduced 2.9**
{: .label .label-purple }

Connectors facilitate access to models hosted on third-party machine learning (ML) platforms. 

OpenSearch provides connectors for several platforms, for example:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage the lifecycle of text embedding models, powering semantic search queries in OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferences. This benefits Amazon SageMaker users who value its functionality, such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [OpenAI ChatGPT](https://platform.openai.com/docs/introduction) enables you to invoke an OpenAI chat model from inside an OpenSearch cluster.
- [Cohere](https://cohere.com/) allows you to use data from OpenSearch to power the Cohere large language models.
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) supports models like [Bedrock Titan Embeddings](https://aws.amazon.com/bedrock/titan/), which can drive semantic search and retrieval-augmented generation in OpenSearch.
- [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai) enables you to invoke Vertex AI models, such as Gemini and text embedding models, from inside an OpenSearch cluster.

## Connector blueprints

Creating a connector requires two pieces of information: the request and response format for your model and the authentication method for your platform:

- The request and response format is specified in a _connector blueprint_, which defines the set of fields (the request body) to provide when creating a connector for a specific platform and model. To find a pre-built blueprint for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/). For descriptions of all connector fields or to create a blueprint for a platform or model that OpenSearch does not provide, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).

- The authentication method is specified in the connector's `protocol` field and is determined by the platform. For more information, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).

## Providing input to an externally hosted model

A connector defines the request that OpenSearch sends to the model endpoint. The following excerpt from a connector shows the fields that determine the request body. Each object in the `actions` array defines one operation that the connector supports. The `request_body` field is a template for the request body. The template contains placeholders in the format `${parameters.<parameter_name>}`. In this example, the template contains the `model` and `messages` placeholders:

```json
{
  "parameters": {
    "model": "gpt-4o-mini"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/chat/completions",
      "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
    }
  ]
}
```

When you send a [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) request, OpenSearch replaces each placeholder with the corresponding parameter value and sends the result to the model. OpenSearch obtains parameter values from the Predict API request or, if the request doesn't provide the value, from the connector `parameters` object. In this example, `model` defaults to `gpt-4o-mini`, so a Predict API request must provide only `messages`.

OpenSearch accepts input in one of the following formats. When you call a model directly, provide input as parameters. Some OpenSearch features always send their input in a different format, which the connector preprocessing function converts into parameters. To test a connector used by one of these features, send a Predict API request in the same format.

| Input format | Request body fields | When to use |
| :--- | :--- | :--- |
| [Parameters](#providing-input-as-parameters) | `parameters` | To call any externally hosted model directly. The `ml_inference` processor also uses this format. |
| [Text documents](#providing-input-as-text-documents) | `text_docs` | To test an embedding model connector that the `text_embedding` ingest processor or `neural` query uses. These features use this format. |
| [Text similarity input](#providing-input-for-text-similarity) | `query_text` and `text_docs` | To test a rerank model connector that the `rerank` search processor uses. This processor uses this format. |

### Providing input as parameters

In a Predict request, the `parameters` object maps placeholder names to values: each key names a placeholder, and its value replaces that placeholder. Provide a value for every placeholder that doesn't have a default value in the connector `parameters` object.

The following request creates a connector to an OpenAI chat model. The connector `parameters` object provides default values for `endpoint` and `model`. The `request_body` template contains the `model` and `messages` placeholders. Because `messages` has no default value, every Predict request must provide it:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "OpenAI chat connector",
  "description": "The connector to the OpenAI chat completions API",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "api.openai.com",
    "model": "gpt-4o-mini"
  },
  "credential": {
    "openAI_key": "<openai_key>"
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

After you register a model using this connector, provide the `messages` value in a Predict API request:

```json
POST /_plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ]
  }
}
```
{% include copy-curl.html %}

OpenSearch fills the template using the `messages` value from the request and the `model` value from the connector, and sends the following request body to the model:

```json
{ "model": "gpt-4o-mini", "messages": [{"role":"user","content":"Hello"}] }
```

To override the connector default value, provide the parameter in the request. For example, the following request sets the model to `gpt-4o`:

```json
POST /_plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ]
  }
}
```
{% include copy-curl.html %}

The `ml_inference` ingest processor also provides input as parameters. Its `input_map` maps document fields to parameter names. For more information, see [ML inference processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/).

### Providing input as text documents

Embedding features, such as the `text_embedding` ingest processor and the `neural` query, send their input as a `text_docs` array of strings. A connector for an embedding model uses the following functions to translate between this format and the model API:

- The preprocessing function converts the `text_docs` array into the parameters that fill the request body template.
- The post-processing function converts the model response into the embedding format that OpenSearch requires.

For example, the following connector uses the built-in OpenAI pre- and post-processing functions:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "OpenAI embedding connector",
  "description": "The connector to the OpenAI embeddings API",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "model": "text-embedding-3-small"
  },
  "credential": {
    "openAI_key": "<openai_key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/embeddings",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": "{ \"input\": ${parameters.input}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.openai.embedding",
      "post_process_function": "connector.post_process.openai.embedding"
    }
  ]
}
```
{% include copy-curl.html %}

To test the connector using the input that these features send, provide a `text_docs` array in a Predict API request. Set the `algorithm` query parameter to `text_embedding` so that OpenSearch reads the `text_docs` field:

```json
POST /_plugins/_ml/models/{model_id}/_predict?algorithm=text_embedding
{
  "text_docs": ["red shoes", "blue hat"]
}
```
{% include copy-curl.html %}

If you don't specify the algorithm, OpenSearch reads only the `parameters` object, so the template placeholders have no values and the request fails. You can also specify the algorithm as a path parameter. For more information, see [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/).

The preprocessing function converts the strings into the `input` parameter, and OpenSearch sends the following request body to the model:

```json
{ "input": ["red shoes","blue hat"], "model": "text-embedding-3-small" }
```

If the connector doesn't define a preprocessing function, OpenSearch uses `connector.pre_process.default.embedding`, which also converts the strings into the `input` parameter. 

The post-processing function extracts the embeddings from the model response. The Predict API response contains one embedding for each string:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [1536],
          "data": [-0.0147, 0.0362, ...]
        },
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [1536],
          "data": [0.0081, -0.0215, ...]
        }
      ],
      "status_code": 200
    }
  ]
}
```

If the connector doesn't define a post-processing function, the Predict API response contains the unchanged model response. For the input that each built-in function accepts and the output that it produces, see [Built-in pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#built-in-pre--and-post-processing-functions). To write your own functions, see [Custom pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#custom-pre--and-post-processing-functions).

If the connector uses a built-in preprocessing function, you can also provide the input in a `parameters` object. For example, sending `{"parameters": {"input": ["red shoes", "blue hat"]}}` produces the same model request body as the preceding `text_docs` request.
{: .note}

### Providing input for text similarity

The `rerank` search processor sends its input as a `query_text` string and a `text_docs` array containing the text of each search result. A connector for a rerank model must define a preprocessing function that converts this input into parameters because OpenSearch provides no default preprocessing function for text similarity input.

For example, the following connector uses the built-in Cohere Rerank functions:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Cohere rerank connector",
  "description": "The connector to the Cohere Rerank API",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "model": "rerank-english-v3.0"
  },
  "credential": {
    "cohere_key": "<cohere_key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.cohere.ai/v1/rerank",
      "headers": {
        "Authorization": "Bearer ${credential.cohere_key}"
      },
      "request_body": "{ \"documents\": ${parameters.documents}, \"query\": \"${parameters.query}\", \"top_n\": ${parameters.top_n}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.cohere.rerank",
      "post_process_function": "connector.post_process.cohere.rerank"
    }
  ]
}
```
{% include copy-curl.html %}

To test the connector using the input that the `rerank` processor sends, provide `query_text` and `text_docs` in a Predict API request. Set the `algorithm` query parameter to `text_similarity` so that OpenSearch reads these fields:

```json
POST /_plugins/_ml/models/{model_id}/_predict?algorithm=text_similarity
{
  "query_text": "Which shoes are waterproof?",
  "text_docs": ["Waterproof hiking boots", "Canvas sneakers"]
}
```
{% include copy-curl.html %}

The preprocessing function converts the input into the `query`, `documents`, and `top_n` parameters, and OpenSearch sends the following request body to the model:

```json
{ "documents": ["Waterproof hiking boots","Canvas sneakers"], "query": "Which shoes are waterproof?", "top_n": 2, "model": "rerank-english-v3.0" }
```

The post-processing function extracts the relevance scores from the model response. The Predict API response contains one score for each string in `text_docs`, in the same order:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [0.9]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [0.6]
        }
      ],
      "status_code": 200
    }
  ]
}
```

For more information about reranking search results, see [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/).

## Creating a connector

You can provision connectors in two ways:

1. [Create a standalone connector](#creating-a-standalone-connector): A standalone connector can be reused by multiple model registrations in OpenSearch that share the same external endpoint and configuration. Standalone connectors require access to both the connector and the model in OpenSearch as well as the third-party platform. Standalone connectors are saved in a connector index.

2. [Create a connector for a specific externally hosted model](#creating-a-connector-for-a-specific-model): Alternatively, you can create a connector that can only be used with the model for which it was created. To access such a connector, you only need access to the model itself because the connection is established inside the model. These connectors are saved in the model index.

If you need to connect to a different external model (for example, switching from `gpt-4o-mini` to `gpt-4o`), we recommend creating a separate standalone connector. Alternatively, if the connector request body template uses a placeholder for the model name, you can override the model name in each Predict request. For more information, see [Providing input as parameters](#providing-input-as-parameters).
{: .note}

If using Python, you can create connectors using the [`opensearch-py-ml`](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

## Creating a standalone connector

To create a standalone connector, send a request to the `connectors/_create` endpoint and provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/):

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for gpt-4o-mini",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-4o-mini"
    },
    "credential": {
        "openAI_key": "<openai_key>"
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

## Creating a connector for a specific model

To create a connector for a specific model, provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/) within the `connector` object of a request to the `models/_register` endpoint:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-4o-mini model with a connector",
    "function_name": "remote",
    "model_group_id": "lEFGL4kB4ubqQRzegPo2",
    "description": "test model",
    "connector": {
        "name": "OpenAI Connector",
        "description": "The connector to public OpenAI model service for gpt-4o-mini",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "endpoint": "api.openai.com",
            "max_tokens": 7,
            "temperature": 0,
            "model": "gpt-4o-mini"
        },
        "credential": {
            "openAI_key": "<openai_key>"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/chat/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\": \"user\", \"content\": \"${parameters.prompt}\"}], \"max_tokens\": ${parameters.max_tokens}, \"temperature\": ${parameters.temperature} }"
            }
        ]
    }
}
```
{% include copy-curl.html %}

## Updating connector credentials

In some cases, you may need to update the credentials used to connect to an externally hosted model, such as an expiring API key. To do this without undeploying the model, provide the new credentials in an update request.

### Connector for a specific model

To update credentials for a connector linked to a specific model, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/models/{model_id}
{
  "connector": {
    "credential": {
      "openAI_key": "<new_openai_key>"
    }
  }
}
```
{% include copy-curl.html %}

### Standalone connector

To update credentials for a standalone connector, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/connectors/{connector_id}
{
  "credential": {
    "openAI_key": "<new_openai_key>"
  }
}
```
{% include copy-curl.html %}

## Next steps

- To find the blueprint and protocol for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To pass per-request values in connector headers, see [Dynamic header substitution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/dynamic-header-substitution/).
- To learn more about connecting to external models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- To learn more about model access control and model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
