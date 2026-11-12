---
layout: default
title: Creating a custom blueprint
has_children: false
nav_order: 20
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
redirect_from:
  - /ml-commons-plugin/extensibility/blueprints/
---

# Creating a custom blueprint
**Introduced 2.9**
{: .label .label-purple }

If OpenSearch doesn't provide a [connector blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/) for your model, create your own. A blueprint is a connector definition for a specific model that contains the model endpoint, the credentials, and a template for the request body that OpenSearch sends to the model.

To create a custom blueprint, follow these steps:

1. [Identify the model API format](#step-1-identify-the-model-api-format).
1. [Define the connector action](#step-2-define-the-connector-action).
1. [Choose pre- and post-processing functions](#step-3-choose-pre--and-post-processing-functions).
1. [Create and test the connector](#step-4-create-and-test-the-connector).

The examples on this page connect to a hypothetical embedding service at `https://embeddings.example.com` for which OpenSearch doesn't provide a blueprint.

## Step 1: Identify the model API format

From the model provider documentation, determine the following information:

- The endpoint URL and HTTP method
- How the API authenticates requests, for example, using an API key in a header
- The request body format
- The response body format

For example, the embedding service accepts `POST` requests at `https://embeddings.example.com/v1/embed`, authenticates them using an `Authorization: Bearer <api_key>` header, and accepts the following request body:

```json
{
  "texts": ["red shoes", "blue hat"],
  "model": "my-embedding-model"
}
```

The service returns one embedding for each string in the following response body:

```json
{
  "vectors": [[0.1, 0.2, 0.3], [0.2, 0.2, 0.3]],
  "model": "my-embedding-model"
}
```

OpenSearch sends connector requests only to trusted endpoints. Add a pattern for the endpoint, such as `^https://embeddings\.example\.com/.*$`, to the `plugins.ml_commons.trusted_connector_endpoints_regex` setting. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#adding-trusted-endpoints).

## Step 2: Define the connector action

In the connector `actions` array, define a `predict` action that describes the request to the model API:

- In `url` and `method`, specify the endpoint and the HTTP method.
- In `headers`, specify the authentication header. Refer to credentials using `${credential.<credential_name>}` placeholders, and provide the credential values in the connector `credential` object.
- In `request_body`, specify a template for the request body. Use `${parameters.<parameter_name>}` placeholders for values that change with each request, and provide default values in the connector `parameters` object.

For the embedding service, the action and the related connector fields are the following:

```json
{
  "parameters": {
    "model": "my-embedding-model"
  },
  "credential": {
    "api_key": "<api_key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://embeddings.example.com/v1/embed",
      "headers": {
        "Authorization": "Bearer ${credential.api_key}"
      },
      "request_body": "{ \"texts\": ${parameters.texts}, \"model\": \"${parameters.model}\" }"
    }
  ]
}
```

The `texts` placeholder isn't enclosed in quotation marks because its value is an array. For more information about placeholders, see [Request body templates]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#request-body-templates). For descriptions of all connector fields, see [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/#request-body-fields).

## Step 3: Choose pre- and post-processing functions

Embedding and rerank features, such as the `text_embedding` ingest processor, the `neural` query, and the `rerank` search processor, send their input in a fixed format and require a specific output format. To use the model with these features, the connector must define a preprocessing function that converts the input into parameters and a post-processing function that converts the model response into the format that OpenSearch requires. If you call the model only using Predict API requests or the `ml_inference` processor, which provide input as parameters, skip this step.

First, check whether a built-in function supports the model format. For more information, see [Built-in pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#built-in-pre--and-post-processing-functions). The embedding service request body contains a `texts` array, which the built-in `connector.pre_process.cohere.embedding` function produces. No built-in post-processing function reads the `vectors` field, so the connector uses the following custom post-processing function:

```js
def sb = new StringBuilder("[");
for (int i = 0; i < params.vectors.size(); i++) {
  if (i > 0) { sb.append(","); }
  def v = params.vectors[i];
  sb.append("{\"name\":\"sentence_embedding\",\"data_type\":\"FLOAT32\",\"shape\":[" + v.size() + "],\"data\":" + v + "}");
}
sb.append("]");
return sb.toString();
```

The function reads the `vectors` field of the model response from `params` and returns an output object for each embedding. For more information, see [Custom pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#custom-pre--and-post-processing-functions).

## Step 4: Create and test the connector

The following request creates a connector using the complete blueprint. The custom post-processing function is provided as a string:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Embedding service connector",
  "description": "The connector to a custom embedding service",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "model": "my-embedding-model"
  },
  "credential": {
    "api_key": "<api_key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://embeddings.example.com/v1/embed",
      "headers": {
        "Authorization": "Bearer ${credential.api_key}"
      },
      "request_body": "{ \"texts\": ${parameters.texts}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.cohere.embedding",
      "post_process_function": "def sb = new StringBuilder(\"[\");\nfor (int i = 0; i < params.vectors.size(); i++) {\n  if (i > 0) { sb.append(\",\"); }\n  def v = params.vectors[i];\n  sb.append(\"{\\\"name\\\":\\\"sentence_embedding\\\",\\\"data_type\\\":\\\"FLOAT32\\\",\\\"shape\\\":[\" + v.size() + \"],\\\"data\\\":\" + v + \"}\");\n}\nsb.append(\"]\");\nreturn sb.toString();"
    }
  ]
}
```
{% include copy-curl.html %}

If you use Python, you can also create the connector from your blueprint using the custom connector option of the [`opensearch-py-ml`](https://github.com/opensearch-project/opensearch-py-ml) CLI. For more information, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

Register a model using the connector. For more information, see [Step 2: Register an externally hosted model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#step-2-register-an-externally-hosted-model). Then test the model using the input format that embedding features send:

```json
POST /_plugins/_ml/models/{model_id}/_predict?algorithm=text_embedding
{
  "text_docs": ["red shoes", "blue hat"]
}
```
{% include copy-curl.html %}

The preprocessing function converts the strings into the `texts` parameter, and OpenSearch sends the following request body to the model:

```json
{ "texts": ["red shoes","blue hat"], "model": "my-embedding-model" }
```

The post-processing function converts the model response. The Predict API response contains one embedding for each string:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [3],
          "data": [0.1, 0.2, 0.3]
        },
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [3],
          "data": [0.2, 0.2, 0.3]
        }
      ],
      "status_code": 200
    }
  ]
}
```

If the response contains `sentence_embedding` output objects, you can use the model with the `text_embedding` ingest processor and the `neural` query.

## Next steps

- For descriptions of all connector fields, see [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/#request-body-fields).
- To learn how a connector builds the request that it sends to the model and processes the model response, see [Connector input and output]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/).
- To find an OpenSearch-provided blueprint, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
