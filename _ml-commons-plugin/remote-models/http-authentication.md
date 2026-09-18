---
layout: default
title: HTTP authentication
has_children: false
nav_order: 40
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# HTTP authentication

Connectors that use the `http` protocol authenticate to an externally hosted model using the values in the connector's `credential` object. Most endpoints accept a token, such as an API key, which the connector passes in a request header. Endpoints that require mutual TLS (mTLS) accept a client certificate instead.

## Token authentication

To authenticate with a token, provide the token in the `credential` object and reference it from a request header using a `${credential.*}` placeholder. The field name is arbitrary---the blueprint for your platform specifies which name to use, such as `openAI_key` or `cohere_key`:

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

For the token field name and header format that your platform expects, see the blueprint for your platform and model in [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

## Client certificate authentication
**Introduced 3.9**
{: .label .label-purple }

Client certificate authentication, also called mutual TLS (mTLS), allows a connector to present a client certificate when connecting to an externally hosted model. Both sides of the connection authenticate each other during the TLS handshake: the endpoint proves its identity with a server certificate, and the connector proves its identity with a client certificate. Use mTLS when the model endpoint requires a client certificate rather than a token passed in a request header.

To enable mTLS, set `mutual_tls_enabled` to `true` in the connector's `client_config` object and provide the certificate material in the connector's `credential` object.

### Request body fields

When `mutual_tls_enabled` is set to `true`, the `credential` object supports the following certificate fields. Provide the certificate content itself, either as PEM text with newlines escaped as `\n` or as Base64-encoded content; file paths are not supported. OpenSearch encrypts these fields in the same way as any other credential and makes them available on every node, so you don't need to copy certificate files to individual nodes.

| Field  | Data type | Required/Optional | Description |
|:---|:---|:---|:---|
| `client_cert_pem` | String | Required when `keystore_type` is `PEM` | The client certificate in PEM format. To present a certificate issued by an intermediate certificate authority (CA), include the full chain, ordered leaf certificate first. |
| `client_key_pem` | String | Required when `keystore_type` is `PEM` | The client private key in PEM format. Must be a non-encrypted PKCS #8 key (`-----BEGIN PRIVATE KEY-----`); PKCS #1 keys are not supported. |
| `client_cert_pkcs12` | String | Required when `keystore_type` is `PKCS12` | The Base64-encoded PKCS12 keystore containing the client certificate and private key. |
| `keystore_password` | String | Optional | The password protecting the PKCS12 keystore. Omit it for a keystore that has no password. |
| `ca_cert_pem` | String | Optional | One or more CA certificates, in PEM format, used to validate the endpoint's server certificate. Accepts a bundle of intermediate and root certificates. If omitted, the Java default truststore is used. Provide this field when the endpoint uses a private CA. |

The `mutual_tls_enabled` and `keystore_type` fields belong to the connector's `client_config` object. For descriptions of both, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).

### Prerequisites

Before you configure mTLS, ensure that the following requirements are met:

- The connector uses the `http` protocol. For more information, see [Restrictions](#restrictions).
- The endpoint URL matches a trusted endpoint. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index#adding-trusted-endpoints).
- Private keys in PEM format are non-encrypted and use PKCS #8 encoding (`-----BEGIN PRIVATE KEY-----`). PKCS #1 keys (`-----BEGIN RSA PRIVATE KEY-----`) are not supported. To convert a PKCS #1 key to PKCS #8, use the following command:

```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in rsa_key.pem -out pkcs8_key.pem
```
{% include copy.html %}

Base64-encoded PEM values are detected and decoded automatically. Because Base64 encoding avoids escaping newlines by hand, it is the more convenient option for multiline certificates. To Base64-encode a certificate or key, use the following command:

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

To authenticate with a PKCS12 keystore, set `keystore_type` to `PKCS12` and provide the Base64-encoded keystore in `client_cert_pkcs12`. A PKCS12 keystore is binary, so it must always be Base64 encoded:

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

To create a PKCS12 keystore from an existing PEM certificate and key and then Base64-encode it, use the following commands:

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

To rotate an expiring certificate, send the new certificate material in an update request, as described in [Updating connector credentials]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#updating-connector-credentials). You don't need to undeploy the model or restart any nodes.

OpenSearch detects the change and builds a new HTTP client for subsequent predict requests. The replaced client is closed after a grace period, so requests already in flight complete against the previous certificate.

### Restrictions

The following restrictions apply to client certificate authentication:

- mTLS applies only to connectors that use the `http` protocol. Connectors that use the `aws_sigv4`, `mcp_sse`, or `mcp_streamable_http` protocol accept `mutual_tls_enabled` when they are created but ignore it at runtime.
- `skip_ssl_verification` and `mutual_tls_enabled` cannot both be set to `true`. Disabling server certificate validation removes the mutual part of mutual TLS, so provide `ca_cert_pem` to validate the server certificate against a private CA.
- The `credential` object cannot contain `api_key` when mTLS is enabled. OpenSearch enforces certificate-only authentication and rejects mixed authentication methods.
- File paths are not supported in certificate fields. Provide the certificate content itself.
- Certificate material is validated on the first predict request. A connector with an invalid certificate configuration is created successfully and fails when it is first used.

## Next steps

- To find the blueprint for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To register and deploy a model that uses this connector, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- For descriptions of all connector fields, including the `client_config` object, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).
