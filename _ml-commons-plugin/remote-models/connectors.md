---
layout: default
title: Connectors
has_children: false
has_toc: false
nav_order: 61
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
redirect_from: 
  - /ml-commons-plugin/extensibility/connectors/
---

# Creating connectors for third-party ML platforms
**Introduced 2.9**
{: .label .label-purple }

Connectors facilitate access to models hosted on third-party machine learning (ML) platforms. 

OpenSearch provides connectors for several platforms, for example:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage the lifecycle of text embedding models, powering semantic search queries in OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferences. This benefits Amazon SageMaker users who value its functionality, such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [OpenAI ChatGPT](https://platform.openai.com/docs/introduction) enables you to invoke an OpenAI chat model from inside an OpenSearch cluster.
- [Cohere](https://cohere.com/) allows you to use data from OpenSearch to power the Cohere large language models.
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) supports models like [Bedrock Titan Embeddings](https://aws.amazon.com/bedrock/titan/), which can drive semantic search and retrieval-augmented generation in OpenSearch.

## Connector blueprints

A _connector blueprint_ defines the set of parameters (the request body) you need to provide when sending an API request to create a specific connector. Connector blueprints may differ based on the platform and the model that you are accessing.

OpenSearch provides connector blueprints for several ML platforms and models. For a full list of connector blueprints provided by OpenSearch, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/). 

As an ML developer, you can also create connector blueprints for other platforms and models. Data scientists and administrators can then use the blueprint to create connectors. They are only required to enter their `credential` settings, such as `openAI_key`, for the service to which they are connecting. For information about creating connector blueprints, including descriptions of all parameters, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).


## Creating a connector

You can provision connectors in two ways:

1. [Create a standalone connector](#creating-a-standalone-connector): A standalone connector can be reused by multiple model registrations in OpenSearch that share the same external endpoint and configuration. Standalone connectors require access to both the connector and the model in OpenSearch as well as the third-party platform. Standalone connectors are saved in a connector index.

2. [Create a connector for a specific externally hosted model](#creating-a-connector-for-a-specific-model): Alternatively, you can create a connector that can only be used with the model for which it was created. To access such a connector, you only need access to the model itself because the connection is established inside the model. These connectors are saved in the model index.

If you need to connect to a different external model (for example, switching from `gpt-3.5-turbo` to `gpt-4`), we recommend creating a separate standalone connector. Alternatively, advanced users can override connector `parameters` at predict time if the connector blueprint uses placeholders. For more information, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
{: .note}

If using Python, you can create connectors using the [`opensearch-py-ml`](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

## Creating a standalone connector

To create a standalone connector, send a request to the `connectors/_create` endpoint and provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/):

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

## Creating a connector for a specific model

To create a connector for a specific model, provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/) within the `connector` object of a request to the `models/_register` endpoint:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-GPT-3.5 model with a connector",
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

## Connector examples

The following sections contain examples of connectors for popular ML platforms. For a full list of supported connectors, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

### OpenAI chat connector

You can use the following example request to create a standalone OpenAI chat connector:

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

### Amazon SageMaker connector

You can use the following example request to create a standalone Amazon SageMaker connector:

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
{% include copy-curl.html %}

The `credential` parameter contains the following options reserved for `aws_sigv4` authentication:

- `access_key`: Required. Provides the access key for the AWS instance.
- `secret_key`: Required. Provides the secret key for the AWS instance.
- `session_token`: Optional. Provides a temporary set of credentials for the AWS instance.

The `parameters` section requires the following options when using `aws_sigv4` authentication:

- `region`: The AWS Region in which the AWS instance is located.
- `service_name`: The name of the AWS service for the connector.

### Cohere connector

You can use the following example request to create a standalone Cohere connector using the Embed V3 model. For more information, see [Cohere connector blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/cohere_connector_embedding_blueprint.md). 

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Cohere Embed Model",
  "description": "The connector to Cohere's public embed API",
  "version": "1",
  "protocol": "http",
  "credential": {
    "cohere_key": "<ENTER_COHERE_API_KEY_HERE>"
  },
  "parameters": {
    "model": "embed-english-v3.0",
    "input_type":"search_document",
    "truncate": "END"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.cohere.ai/v1/embed",
      "headers": {
        "Authorization": "Bearer ${credential.cohere_key}",
        "Request-Source": "unspecified:opensearch"
      },
      "request_body": "{ \"texts\": ${parameters.texts}, \"truncate\": \"${parameters.truncate}\", \"model\": \"${parameters.model}\", \"input_type\": \"${parameters.input_type}\" }",
      "pre_process_function": "connector.pre_process.cohere.embedding",
      "post_process_function": "connector.post_process.cohere.embedding"
    }
  ]
}
```
{% include copy-curl.html %}

### Amazon Bedrock connector

You can use the following example request to create a standalone Amazon Bedrock connector:

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

## Updating connector credentials

In some cases, you may need to update credentials, such as `access_key`, used to connect to externally hosted models. To do this without undeploying the model, provide the new credentials in an update request.

### Connector for a specific model

To update credentials for a connector linked to a specific model, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/models/{model_id}
{
  "connectors": {
    "credential": {
      "openAI_key": "YOUR NEW OPENAI KEY"
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
    "openAI_key": "YOUR NEW OPENAI KEY"
  }
}
```
{% include copy-curl.html %}

## Dynamic header substitution
**Introduced 3.7**
{: .label .label-purple }

By default, connector headers are resolved once at connector creation time. Dynamic connector headers allow you to use `${parameters.*}` placeholders in header values so that per-request values are substituted at prediction time. This is useful for passing request-scoped metadata such as transaction IDs, correlation IDs, or trace tokens to the eternally hosted model endpoint.

### Configuring dynamic headers

To configure a dynamic header, define the header with a `${parameters.*}` placeholder in the connector's `actions[].headers` field. You can optionally set a default value for the parameter in the top-level `parameters` field:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "My connector",
  "description": "Connector with dynamic headers",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "api.example.com",
    "request_id": "default-request-id"
  },
  "credential": {
    "api_key": "test-api-key"
  },
  "actions": [{
    "action_type": "predict",
    "method": "POST",
    "url": "https://${parameters.endpoint}/predict",
    "headers": {
      "Authorization": "${credential.api_key}",
      "X-Test-Request-Id": "${parameters.request_id}"
    },
    "request_body": "{ \"input\": \"${parameters.input}\" }"
  }]
}
```
{% include copy-curl.html %}

At prediction time, pass the runtime value in the `parameters` field of the `_predict` request:

```json
POST /_plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "request_id": "request-123",
    "input": "hello world"
  }
}
```
{% include copy-curl.html %}

The resulting HTTP request to the remote endpoint includes the substituted header:

```json
POST https://api.example.com/predict
Authorization: test-api-key
X-Test-Request-Id: request-123
```

If no runtime value is provided and no default is set in the connector's `parameters` field, the prediction request is rejected with a 400 error. To avoid this, define a default value for the parameter in the connector's `parameters` field. If no runtime value is provided, the default value is used.

### Security restrictions

The following headers cannot contain `${parameters.*}` placeholders. Using them returns a 400 error at connector creation or update time. Use `${credential.*}` for authentication headers instead:

- Credential headers:
  - `Authorization`
  - `Proxy-Authorization`
  - `Cookie`
  - `X-API-Key`
  - `X-Auth-Token`
  - `X-Auth-Header`

- IP and host spoofing headers:
  - `Host`
  - `X-Forwarded-Host`
  - `X-Forwarded-Server`
  - `X-Forwarded-For`
  - `Forwarded`
  - `X-Real-IP`
  - `X-Client-IP`
  - `CF-Connecting-IP`
  - `True-Client-IP`
  - `X-Originating-IP`

### Runtime validation

At prediction time, substituted header values are validated before the request is sent:

- Header values containing `\r` or `\n` characters are rejected to prevent HTTP response splitting.
- Values containing control characters (`0x00–0x1F`, except tab) are rejected.
- Each individual header value must not exceed 8 KB.
- The combined size of all headers must not exceed 64 KB.

## Client certificate authentication
**Introduced 3.9**
{: .label .label-purple }

Client certificate authentication, also called mutual TLS (mTLS), allows a connector to present a client certificate when connecting to an externally hosted model. Both sides of the connection authenticate each other during the TLS handshake: the endpoint proves its identity with a server certificate, and the connector proves its identity with a client certificate. Use mTLS when the model endpoint requires a client certificate rather than a token passed in a request header.

To enable mTLS, set `mutual_tls_enabled` to `true` in the connector's `client_config` object and provide the certificate material in the connector's `credential` object.

Certificate material is supplied as content, not as a file path. OpenSearch encrypts it in the same way as any other credential and makes it available on every node, so you don't need to copy certificate files to individual nodes. For descriptions of all certificate fields, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters).

### Prerequisites

Before you configure mTLS, ensure that the following requirements are met:

- All nodes in the cluster run OpenSearch 3.9 or later.
- The connector uses the `http` protocol. For more information, see [Restrictions](#restrictions).
- The endpoint URL matches a trusted endpoint. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index#adding-trusted-endpoints).
- Private keys in PEM format are unencrypted and use PKCS \#8 encoding (`-----BEGIN PRIVATE KEY-----`). PKCS \#1 keys (`-----BEGIN RSA PRIVATE KEY-----`) are not supported. To convert a PKCS \#1 key to PKCS \#8, use the following command:

```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in rsa_key.pem -out pkcs8_key.pem
```
{% include copy.html %}

You can provide PEM values either as literal PEM text, with newlines escaped as `\n`, or as base64-encoded PEM. Base64 values are detected and decoded automatically. Because base64 avoids escaping newlines by hand, it is the more convenient option for multiline certificates. To base64-encode a certificate or key, use the following command:

```bash
base64 -i client-cert.pem
```
{% include copy.html %}

### Using PEM certificates

To authenticate with a PEM certificate and private key, set `keystore_type` to `PEM` and provide `client_cert_pem` and `client_key_pem`:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Externally hosted model connector with mutual TLS",
  "description": "A connector that authenticates using a client certificate",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "api.example.com"
  },
  "credential": {
    "client_cert_pem": "<BASE64-ENCODED CLIENT CERTIFICATE>",
    "client_key_pem": "<BASE64-ENCODED PRIVATE KEY>",
    "ca_cert_pem": "<BASE64-ENCODED CA CERTIFICATE>"
  },
  "client_config": {
    "mutual_tls_enabled": true,
    "keystore_type": "PEM"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://${parameters.endpoint}/predict",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"input\": \"${parameters.input}\" }"
    }
  ]
}
```
{% include copy-curl.html %}

Because `PEM` is the default, you can omit `keystore_type` when using PEM certificates.
{: .note}

### Using a PKCS12 keystore

To authenticate with a PKCS12 keystore, set `keystore_type` to `PKCS12` and provide the base64-encoded keystore in `client_cert_pkcs12`. Unlike PEM values, a PKCS12 keystore is binary and must always be base64 encoded:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Externally hosted model connector with a PKCS12 keystore",
  "description": "A connector that authenticates using a client certificate",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "api.example.com"
  },
  "credential": {
    "client_cert_pkcs12": "<BASE64-ENCODED PKCS12 KEYSTORE>",
    "keystore_password": "<KEYSTORE PASSWORD>",
    "ca_cert_pem": "<BASE64-ENCODED CA CERTIFICATE>"
  },
  "client_config": {
    "mutual_tls_enabled": true,
    "keystore_type": "PKCS12"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://${parameters.endpoint}/predict",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"input\": \"${parameters.input}\" }"
    }
  ]
}
```
{% include copy-curl.html %}

To create a PKCS12 keystore from an existing PEM certificate and key and then base64-encode it, use the following commands:

```bash
openssl pkcs12 -export -in client-cert.pem -inkey client-key.pem -out client.p12 -name client
base64 -i client.p12
```
{% include copy.html %}

### Certificate chains and custom CA certificates

If your client certificate is issued by an intermediate certificate authority (CA), include the full chain in `client_cert_pem`. Order the chain leaf first, followed by each issuing intermediate certificate, so that every certificate is issued by the one that follows it. A misordered chain is rejected with an error that identifies the certificates involved.

The `ca_cert_pem` field is optional and controls how the endpoint's server certificate is validated:

- If you provide `ca_cert_pem`, OpenSearch validates the server certificate against only the certificates it contains. The field accepts a bundle, so you can include both intermediate and root certificates. Provide this field when the endpoint uses a private CA.
- If you omit `ca_cert_pem`, OpenSearch validates the server certificate against the Java default truststore.

Because a private CA is usually not present in the default truststore, provide `ca_cert_pem` rather than setting `skip_ssl_verification` to `true`. Skipping verification is rejected when mTLS is enabled.
{: .important}

### Rotating certificates

To rotate an expiring certificate, send the new certificate material in an update request, as described in [Updating connector credentials](#updating-connector-credentials). You don't need to undeploy the model or restart any nodes.

OpenSearch detects the change and builds a new HTTP client for subsequent predict requests. The replaced client is closed after a grace period, so requests already in flight complete against the previous certificate.

### Restrictions

The following restrictions apply to client certificate authentication:

- mTLS applies only to connectors that use the `http` protocol. Connectors that use the `aws_sigv4`, `mcp_sse`, or `mcp_streamable_http` protocol accept `mutual_tls_enabled` when they are created but ignore it at runtime.
- `skip_ssl_verification` and `mutual_tls_enabled` cannot both be set to `true`. Disabling server certificate validation while presenting a client certificate defeats the purpose of mTLS. Provide `ca_cert_pem` instead.
- The `credential` object cannot contain `api_key` when mTLS is enabled. OpenSearch enforces certificate-only authentication and rejects mixed authentication methods.
- File paths are not supported in certificate fields. Provide the certificate content itself.
- Certificate material is validated when the connector is first used, not when it is created. A connector with an invalid certificate configuration is created successfully and fails on the first predict request.

### Troubleshooting

Certificate configuration errors surface on the first predict request. The following table lists common errors and their resolutions.

| Error | Cause | Resolution |
|:---|:---|:---|
| `For PEM keystore, provide both client_cert_pem and client_key_pem` | One of the two required PEM fields is missing. | Provide both fields, or switch `keystore_type` to `PKCS12` and provide `client_cert_pkcs12`. |
| `Invalid PEM private key format. Only PKCS#8 format is supported` | The private key uses PKCS \#1 encoding or is encrypted. | Convert the key to unencrypted PKCS \#8, as described in [Prerequisites](#prerequisites). |
| `File paths are not supported for certificate fields` | A field contains a file path instead of certificate content. | Replace the path with the PEM text or base64-encoded PEM content of the file. |
| `Certificate field '<field>' appears to be base64 encoded but does not contain valid PEM content after decoding` | The value decodes to something other than PEM text. | Verify that you encoded the PEM file itself, without extra wrapping or truncation. |
| `Client certificate chain is not ordered correctly` | The chain in `client_cert_pem` is not leaf first. | Reorder the chain so that each certificate is issued by the one that follows it. |
| `skip_ssl_verification cannot be enabled together with mutual_tls_enabled` | Both settings are set to `true`. | Remove `skip_ssl_verification` and provide `ca_cert_pem`. |
| `Mixed authentication methods are not allowed` | The `credential` object contains `api_key`. | Remove `api_key` from the `credential` object. |
| `Unsupported keystore type` | `keystore_type` is set to a value other than `PEM` or `PKCS12`. | Set `keystore_type` to `PEM` or `PKCS12`. Values are not case sensitive. |

## Next steps

- For a full list of connector blueprints provided by OpenSearch, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To learn more about connecting to external models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- To learn more about model access control and model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
