---
layout: default
title: Create connector
parent: Connector APIs
grand_parent: ML APIs
nav_order: 10
---

# Create Connector API

Creates a standalone connector. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). For information about how the `request_body` template and the pre- and post-processing functions build the request and process the response, see [Connector input and output]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/). To write a connector definition for a model that has no OpenSearch-provided blueprint, see [Creating a custom blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).

## Endpoints

```json
POST /_plugins/_ml/connectors/_create
```

## Request body fields

The following table lists the fields in a Create Connector API request.

| Field                                            | Data type | Is required | Description                                                                                                                                                                                                                                                                                                                                                                          |
|:-------------------------------------------------|:---|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`                                           | String | Yes         | The name of the connector.                                                                                                                                                                                                                                                                                                                                                           |
| `connector_id`                                   | String | No          | A unique identifier for the connector. If omitted, OpenSearch generates one automatically. |
| `description`                                    | String | No          | A description of the connector.                                                                                                                                                                                                                                                                                                                                                      |
| `version`                                        | String | Yes         | The connector version.                                                                                                                                                                                                                                                                                                                                                        |
| `protocol`                                       | String | Yes         | The protocol for the connection, which determines how OpenSearch authenticates to the platform. For AWS services, such as Amazon SageMaker and Amazon Bedrock, use `aws_sigv4`. For Google Cloud Vertex AI, use `google_cloud`. For all other platforms, use `http`. For more information, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).                                                                                                                                                                                                                                  |
| `parameters` | JSON object | No | Default values for the placeholders in the `url` and `request_body` templates of the connector actions. A value provided in a Predict API request overrides the default. OpenSearch inserts default values without escaping special characters, so they must be valid in the template as written. For more information, see [Connector input and output]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/). |
| `parameters.skip_validating_missing_parameters` | Boolean | No | If `true`, OpenSearch sends the request to the model even if the request body contains placeholders that have no value. If `false`, OpenSearch rejects the request. Default is `false`. |
| `credential`                                     | JSON object | Depends on `protocol` | Defines the credential variables that OpenSearch uses to authenticate to your endpoint. Required for all protocols except `google_cloud` in Application Default Credentials mode (`auth_mode` set to `adc`) and the `mcp_sse` and `mcp_streamable_http` protocols, which resolve credentials outside the connector. For every other protocol, including `http`, omitting this object or leaving it empty returns a `400` error. The fields that this object accepts depend on the `protocol`. For more information, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/). |
| `actions` | JSON array | Yes | The operations that the connector supports. Each object defines the HTTP request that OpenSearch sends for one operation, such as `predict`. For the fields of each object, see [The `actions` object](#the-actions-object). |
| `backend_roles`                                  | JSON array  | No          | A list of OpenSearch backend roles. For more information about configuring backend roles, see [Assigning backend roles to users]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#assigning-backend-roles-to-users).                                                                                                                                               |
| `access_mode`                                    | String | No          | Sets the access mode for the connector, either `public`, `restricted`, or `private`. Default is `private`. For more information about `access_mode`, see [Model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#model-groups).                                                                                                                               |
| `add_all_backend_roles`                          | Boolean  | No          | If `true`, all backend roles of the user creating the connector are added to the connector. If you set this parameter to `true` without specifying `access_mode`, the access mode is set to `restricted`. Can be used only with the `restricted` access mode, and the user must have at least one backend role. Cannot be specified at the same time as `backend_roles`. Admin users cannot set this parameter to `true`. |
| `client_config`                                  | JSON object | No          | The client configuration object, which provides settings for the client connections that the connector uses. These settings allow you to manage connection limits, timeouts, and TLS options, ensuring efficient and reliable communication. For more information, see [The `client_config` object](#the-client_config-object).                                                                                                                               |
| `provisioned_by`                                     | String | No          | An optional attribution tag identifying the plugin or client that provisioned the connector (for example, `flow-framework`). Included in ML statistics metrics. Set at creation time only; ignored by the Update Connector API.                                                                                                                                                            |

### The actions object

The `actions` object supports the following fields.

| Field | Data type | Description |
|:---|:---|:---|
| `action_type` | String | Required. Specifies the ML API operation to use upon connection. Valid values are `predict`, `batch_predict`, `batch_predict_status`, `cancel_batch_predict`, and `execute`. |
| `method`  | String | Required. Defines the HTTP method for the API call. Supports `POST` and `GET`. |
| `url` | String | Required. The endpoint URL to which OpenSearch sends the request for this action. Can contain `${parameters.<parameter_name>}` placeholders. The URL must match one of the trusted endpoint patterns. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#adding-trusted-endpoints). |
| `request_body` | String | Optional. The request body template that OpenSearch sends to the model endpoint for the action. Use `${parameters.<parameter_name>}` placeholders to insert parameter values, for example, `${parameters.inputText}`. For more information, see [Request body templates]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#request-body-templates). |
| `pre_process_function` | String | Optional. The name of a built-in preprocessing function or a custom Painless script that converts `text_docs` input or text similarity input into the parameters that fill the `request_body` template. For more information, see [Built-in pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#built-in-pre--and-post-processing-functions) and [Custom pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#custom-pre--and-post-processing-functions). |
| `post_process_function` | String | Optional. The name of a built-in post-processing function or a custom Painless script that converts the model response into the format that OpenSearch requires. For more information, see [Built-in pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#built-in-pre--and-post-processing-functions) and [Custom pre- and post-processing functions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#custom-pre--and-post-processing-functions). |
| `headers` | JSON object | Optional. The HTTP headers that OpenSearch sends with the request for this action. To authenticate, refer to values in the `credential` object using `${credential.<credential_name>}` placeholders, for example, `"Authorization": "Bearer ${credential.openAI_key}"`. If you don't specify a `Content-Type` header, OpenSearch sends `Content-Type: application/json`. |
| `supports_structured_output` | Boolean | Optional. Applies only to `predict` actions of LLM connectors used for [agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/) fact extraction. If `true`, OpenSearch adds a structured output field to the request body during fact extraction so that the model returns the extracted facts in a fixed JSON schema (constrained decoding). OpenSearch selects the field based on the provider in the action `url`: `toolConfig` for the Amazon Bedrock Converse API, `generationConfig` for Google Gemini, and `response_format` for OpenAI, Azure OpenAI, DeepSeek, the Cohere v2 Chat API, and other endpoints whose path contains `/v1/chat/completions`. The field is added only if the `request_body` is a JSON object. If `false`, or if OpenSearch does not recognize the provider, OpenSearch adds format instructions to the fact extraction prompt. Default is `false`. |

### The client_config object

The `client_config` object supports the following fields.

| Field  | Data type | Description |
|:---|:---|:---|
| `max_connection` | Integer   | The maximum number of concurrent connections that the client can establish to the server. Some remote services, like SageMaker, constrain the maximum number of concurrent connections and throw a throttling exception if the number of concurrent connections exceeds the threshold. The maximum number of concurrent OpenSearch connections is `max_connection`*`node_number_for_connector`. To mitigate this issue, try to decrease the value of this parameter and modify the retry settings in `client_config`. Default is `30`. |
| `connection_timeout` | Integer | The maximum amount of time (in seconds) that the client waits while trying to establish a connection to the server. A timeout prevents the client from waiting indefinitely and allows the client to recover when it encounters unreachable network endpoints. Default is `30`. |
| `read_timeout` | Integer | The maximum amount of time (in seconds) that the client waits for a response from the server after sending a request. This is useful when the server is slow to respond or encounters an issue while processing a request. Default is `30`. |
| `retry_backoff_policy`  | String   | The backoff policy for retries to the remote connector. This is useful when there is spike in traffic causing throttling exceptions. Supported policies are `constant`, `exponential_equal_jitter`, and `exponential_full_jitter`. Default is `constant`. |
| `max_retry_times`  | Integer   | The maximum number of times that a single remote inference request is retried. This is useful when there is a spike in traffic causing throttling exceptions. When set to `0`, retrying is disabled. When set to `-1`, OpenSearch does not limit the number of `retry_times`. Setting this to a positive integer specifies the maximum number of retry attempts. Default is `0`.       |
| `retry_backoff_millis` | Integer   | The base backoff time in milliseconds for retry policy. The suspend time during two retries is determined by this parameter and `retry_backoff_policy`.  Default is `200`. |
| `retry_timeout_seconds` | Integer   | The timeout value, in seconds, for the retry. If the retry can not succeed within the specified amount of time, the connector stops retrying and throws an exception. Default is `30`. |
| `skip_ssl_verification` | Boolean   | If set to `true`, disables SSL certificate verification for the connector, allowing connections to endpoints with self-signed or otherwise invalid certificates. Use only in development or testing environments. If set to `false`, SSL certificate verification remains enabled (recommended for production). Default is `false`. |
| `mutual_tls_enabled` | Boolean | If set to `true`, the connector presents a client certificate to the endpoint using mutual TLS (mTLS). Provide the certificate material in the connector's `credential` object. Supported only for connectors that use the `http` protocol. Cannot be enabled together with `skip_ssl_verification`. Default is `false`. For more information, see [Client certificate authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/http-authentication/#client-certificate-authentication). |
| `keystore_type` | String | The format of the client certificate material supplied in the `credential` object. Valid values are `PEM` and `PKCS12` (not case sensitive). Applies only when `mutual_tls_enabled` is `true`. Default is `PEM`. |

## Example request

The following request creates a standalone connector to the OpenAI `gpt-4o-mini` chat model:

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

## Example response

```json
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```