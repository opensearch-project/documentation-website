---
layout: default
title: Connector blueprints
has_children: false
nav_order: 65
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
redirect_from: 
  - /ml-commons-plugin/extensibility/blueprints/
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/remote-models/blueprints/
---

# Connector blueprints
**Introduced 2.9**
{: .label .label-purple }

Every [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) is specified by a _connector blueprint_. The blueprint defines all the parameters you need to provide when creating a connector.

For example, the following blueprint is a specification for an Amazon SageMaker connector:

```json
{
  "name": "<YOUR CONNECTOR NAME>",
  "description": "<YOUR CONNECTOR DESCRIPTION>",
  "version": "<YOUR CONNECTOR VERSION>",
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "<YOUR AWS ACCESS KEY>",
    "secret_key": "<YOUR AWS SECRET KEY>",
    "session_token": "<YOUR AWS SECURITY TOKEN>"
  },
  "parameters": {
    "region": "<YOUR AWS REGION>",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "url": "<YOUR SAGEMAKER MODEL ENDPOINT URL>",
      "request_body": "<YOUR REQUEST BODY. Example: ${parameters.inputs}>"
    }
  ]
}
```
{% include copy-curl.html %} 

## OpenSearch-provided connector blueprints

OpenSearch provides connector blueprints for several machine learning (ML) platforms and models. For a list of all connector blueprints provided by OpenSearch, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

As an ML developer, you can build connector blueprints for other platforms. Using those blueprints, administrators and data scientists can create connectors for models hosted on those platforms. 

## Configuration parameters

| Field                                            | Data type | Is required | Description                                                                                                                                                                                                                                                                                                                                                                          |
|:-------------------------------------------------|:---|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`                                           | String | Yes         | The name of the connector.                                                                                                                                                                                                                                                                                                                                                           |
| `description`                                    | String | Yes         | A description of the connector.                                                                                                                                                                                                                                                                                                                                                      |
| `version`                                        | Integer | Yes         | The connector version.                                                                                                                                                                                                                                                                                                                                                        |
| `protocol`                                       | String | Yes         | The protocol for the connection. For AWS services, such as Amazon SageMaker and Amazon Bedrock, use `aws_sigv4`. For all other services, use `http`.                                                                                                                                                                                                                                  |
| `parameters`                                     | JSON object | Yes         | The default connector parameters, including `endpoint`, `model`, and `skip_validating_missing_parameters`. Any parameters indicated in this field can be overridden by parameters specified in a predict request.                                                                                                                                                                     |
| `credential`                                     | JSON object | Yes         | Defines any credential variables required for connecting to your chosen endpoint. ML Commons uses **AES/GCM/NoPadding** symmetric encryption to encrypt your credentials. When the cluster connection is initiated, OpenSearch creates a random 32-byte encryption key that persists in OpenSearch's system index. Therefore, you do not need to manually set the encryption key. |
| `actions`                                        | JSON array  | Yes         | Defines the actions that can run within the connector. If you're an administrator creating a connection, add the [blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/) for your desired connection.                                                                                                                                                      |
| `backend_roles`                                  | JSON array  | Yes         | A list of OpenSearch backend roles. For more information about setting up backend roles, see [Assigning backend roles to users]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#assigning-backend-roles-to-users).                                                                                                                                               |
| `access_mode`                                    | String | Yes         | Sets the access mode for the model, either `public`, `restricted`, or `private`. Default is `private`. For more information about `access_mode`, see [Model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#model-groups).                                                                                                                               |
| `add_all_backend_roles`                          | Boolean  | Yes         | When set to `true`, adds all `backend_roles` to the access list, which only a user with admin permissions can adjust. When set to `false`, non-admins can add `backend_roles`.                                                                                                                                                                                                       |
| `client_config`                                  | JSON object | No          | The client configuration object, which provides settings that control the behavior of the client connections used by the connector. These settings allow you to manage connection limits and timeouts, ensuring efficient and reliable communication.                                                                                                                                |
| `parameters.skip_validating_missing_parameters`  | Boolean | No          | When set to `true`, this option allows you to send a request using a connector without validating any missing parameters. Default is `false`.                                                                                                                                                                                                                                                            |


The `actions` parameter supports the following options.

| Field | Data type | Description |
|:---|:---|:---|
| `action_type` | String | Required. Specifies the ML Commons API operation to use upon connection. As of OpenSearch 2.9, only `predict` is supported. |
| `method`  | String | Required. Defines the HTTP method for the API call. Supports `POST` and `GET`. |
| `url` | String      | Required. Specifies the connection endpoint at which the action occurs. This must match the regex expression for the connection used when [adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index#adding-trusted-endpoints).|
| `request_body` | String | Required. Sets the parameters contained in the request body of the action. The parameters must include `\"inputText\`, which specifies how users of the connector should construct the request payload for the `action_type`.  |
| `pre_process_function`  | String | Optional. A built-in or custom Painless script used to preprocess the input data. OpenSearch provides the following built-in preprocess functions that you can call directly:<br> - `connector.pre_process.cohere.embedding` for [Cohere](https://cohere.com/) embedding models<br> - `connector.pre_process.openai.embedding` for [OpenAI](https://platform.openai.com/docs/guides/embeddings) embedding models <br> - `connector.pre_process.default.embedding`, which you can use to preprocess documents in neural search requests so that they are in the format that ML Commons can process with the default preprocessor (OpenSearch 2.11 or later). For more information, see [Built-in functions](#built-in-pre--and-post-processing-functions). |
| `post_process_function` | String   | Optional. A built-in or custom Painless script used to post-process the model output data. OpenSearch provides the following built-in post-process functions that you can call directly:<br> - `connector.post_process.cohere.embedding` for [Cohere text embedding models](https://docs.cohere.com/reference/embed)<br> - `connector.post_process.openai.embedding` for [OpenAI text embedding models](https://platform.openai.com/docs/api-reference/embeddings) <br> - `connector.post_process.default.embedding`, which you can use to post-process documents in the model response so that they are in the format that neural search expects (OpenSearch 2.11 or later). For more information, see [Built-in functions](#built-in-pre--and-post-processing-functions). |
| `headers` | JSON object | Specifies the headers used in the request or response body. Default is `ContentType: application/json`. If your third-party ML tool requires access control, define the required `credential` parameters in the `headers` parameter. |

The `client_config` parameter supports the following options.

| Field  | Data type | Description |
|:---|:---|:---|
| `max_connection` | Integer   | The maximum number of concurrent connections that the client can establish to the server. Some remote services, like SageMaker, constrain the maximum number of concurrent connections and throw a throttling exception if the number of concurrent connections exceeds the threshold. The maximum number of concurrent OpenSearch connections is `max_connection`*`node_number_for_connector`. To mitigate this issue, try to decrease the value of this parameter and modify the retry settings in `client_config`. Default is `30`. |
| `connection_timeout` | Integer | The maximum amount of time (in milliseconds) that the client will wait while trying to establish a connection to the server. A timeout prevents the client from waiting indefinitely and allows the client to recover when it encounters unreachable network endpoints. |
| `read_timeout` | Integer | The maximum amount of time (in seconds) that the client will wait for a response from the server after sending a request. This is useful when the server is slow to respond or encounters an issue while processing a request. |
| `retry_backoff_policy`  | String   | The backoff policy for retries to the remote connector. This is useful when there is spike in traffic causing throttling exceptions. Supported policies are `constant`, `exponential_equal_jitter`, and `exponential_full_jitter`. Default is `constant`. |
| `max_retry_times`  | Integer   | The maximum number of times that a single remote inference request will be retried. This is useful when there is a spike in traffic causing throttling exceptions. When set to `0`, retrying is disabled. When set to `-1`, OpenSearch does not limit the number of `retry_times`. Setting this to a positive integer specifies the maximum number of retry attempts. Default is `0`.       |
| `retry_backoff_millis` | Integer   | The base backoff time in milliseconds for retry policy. The suspend time during two retries is determined by this parameter and `retry_backoff_policy`.  Default is `200`. |
| `retry_timeout_seconds` | Integer   | The timeout value, in seconds, for the retry. If the retry can not succeed within the specified amount of time, the connector will stop retrying and throw an exception. Default is `30`. |

## Built-in pre- and post-processing functions

Call the built-in pre- and post-processing functions instead of writing a custom Painless script when connecting to the following text embedding models or your own text embedding models deployed on a remote server (for example, Amazon SageMaker):

- [OpenAI models](https://platform.openai.com/docs/api-reference/embeddings)
- [Cohere models](https://docs.cohere.com/reference/embed)

OpenSearch provides the following pre- and post-processing functions:

- OpenAI: `connector.pre_process.openai.embedding` and `connector.post_process.openai.embedding`
- Cohere: `connector.pre_process.cohere.embedding` and `connector.post_process.cohere.embedding`
- [Amazon SageMaker default functions for neural search](#amazon-sagemaker-default-pre--and-post-processing-functions-for-neural-search): `connector.pre_process.default.embedding` and `connector.post_process.default.embedding`

### Amazon SageMaker default pre- and post-processing functions for neural search

When you perform vector search using [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/), the neural search request is routed first to ML Commons and then to the model. If the model is one of the [pretrained models provided by OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/), it can parse the ML Commons request and return the response in the format that ML Commons expects. However, for a model hosted on an external platform, the expected format may be different from the ML Commons format. The default pre- and post-processing functions translate between the format that the model expects and the format that neural search expects. 

For the default functions to be applied, the model input and output must be in the format described in the following sections.

#### Example request

The following example request creates a SageMaker text embedding connector and calls the default post-processing function:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Sagemaker text embedding connector",
  "description": "The connector to Sagemaker",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "<YOUR SAGEMAKER ACCESS KEY>",
    "secret_key": "<YOUR SAGEMAKER SECRET KEY>",
    "session_token": "<YOUR AWS SECURITY TOKEN>"
  },
  "parameters": {
    "region": "ap-northeast-1",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "sagemaker.ap-northeast-1.amazonaws.com/endpoints/",
      "headers": {
        "content-type": "application/json"
      },
      "post_process_function": "connector.post_process.default.embedding",
      "request_body": "${parameters.input}"
    }
  ]
}
```
{% include copy-curl.html %}

The `request_body` template must be `${parameters.input}`. 
{: .important}

### Preprocessing function 

The `connector.pre_process.default.embedding` default preprocessing function parses the neural search request and transforms it into the format that the model expects as input.

The ML Commons [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) provides parameters in the following format:

```json
{
  "parameters": {
    "input": ["hello", "world"]
  }
}
```

The default preprocessing function sends the `input` field contents to the model. Thus, the model input format must be a list of strings, for example:

```json
["hello", "world"]
```

### Post-processing function 

The `connector.post_process.default.embedding` default post-processing function parses the model response and transforms it into the format that neural search expects as input.

The remote text embedding model output must be a two-dimensional float array, each element of which represents an embedding of a string from the input list. For example, the following two-dimensional array corresponds to the embedding of the list `["hello", "world"]`:

```json
[
  [
    -0.048237994,
    -0.07612697,
    ...
  ],
  [
    0.32621247,
    0.02328475,
    ...
  ]
]
```

## Custom pre- and post-processing functions

You can write your own pre- and post-processing functions specifically for your model format. For example, the following Amazon Bedrock connector definition contains custom pre- and post-processing functions for the Amazon Bedrock Titan embedding model:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Connector: embedding",
  "description": "The connector to the Bedrock Titan embedding model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "<YOUR AWS REGION>",
    "service_name": "bedrock"
  },
  "credential": {
    "access_key": "<YOUR AWS ACCESS KEY>",
    "secret_key": "<YOUR AWS SECRET KEY>",
    "session_token": "<YOUR AWS SECURITY TOKEN>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.titan-embed-text-v1/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText}\" }",
      "pre_process_function": "\n    StringBuilder builder = new StringBuilder();\n    builder.append(\"\\\"\");\n    String first = params.text_docs[0];\n    builder.append(first);\n    builder.append(\"\\\"\");\n    def parameters = \"{\" +\"\\\"inputText\\\":\" + builder + \"}\";\n    return  \"{\" +\"\\\"parameters\\\":\" + parameters + \"}\";",
      "post_process_function": "\n      def name = \"sentence_embedding\";\n      def dataType = \"FLOAT32\";\n      if (params.embedding == null || params.embedding.length == 0) {\n        return params.message;\n      }\n      def shape = [params.embedding.length];\n      def json = \"{\" +\n                 \"\\\"name\\\":\\\"\" + name + \"\\\",\" +\n                 \"\\\"data_type\\\":\\\"\" + dataType + \"\\\",\" +\n                 \"\\\"shape\\\":\" + shape + \",\" +\n                 \"\\\"data\\\":\" + params.embedding +\n                 \"}\";\n      return json;\n    "
    }
  ]
}
```
{% include copy-curl.html %}

## Next steps

- To learn more about connecting to external models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- For connector examples, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).
