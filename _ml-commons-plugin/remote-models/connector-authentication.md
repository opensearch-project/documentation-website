---
layout: default
title: Connector authentication
has_children: false
nav_order: 30
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Connector authentication

A connector authenticates to an externally hosted model using the values in its `credential` object. Most endpoints accept a token, such as an API key, that the connector passes in a request header. Endpoints that require mutual TLS (mTLS) instead accept a client certificate, which you also supply in the `credential` object. This page describes how to update credentials on an existing connector and how to configure client certificate authentication.

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

## Client certificate authentication
**Introduced 3.9**
{: .label .label-purple }

Client certificate authentication, also called mutual TLS (mTLS), allows a connector to present a client certificate when connecting to an externally hosted model. Both sides of the connection authenticate each other during the TLS handshake: the endpoint proves its identity with a server certificate, and the connector proves its identity with a client certificate. Use mTLS when the model endpoint requires a client certificate rather than a token passed in a request header.

To enable mTLS, set `mutual_tls_enabled` to `true` in the connector's `client_config` object and provide the certificate material in the connector's `credential` object.

Supply the certificate material as content; file paths are not supported. OpenSearch encrypts the material in the same way as any other credential and makes it available on every node, so you don't need to copy certificate files to individual nodes. For descriptions of all certificate fields, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters).

### Prerequisites

Before you configure mTLS, ensure that the following requirements are met:

- The connector uses the `http` protocol. For more information, see [Restrictions](#restrictions).
- The endpoint URL matches a trusted endpoint. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index#adding-trusted-endpoints).
- Private keys in PEM format are non-encrypted and use PKCS #8 encoding (`-----BEGIN PRIVATE KEY-----`). PKCS #1 keys (`-----BEGIN RSA PRIVATE KEY-----`) are not supported. To convert a PKCS #1 key to PKCS #8, use the following command:

```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in rsa_key.pem -out pkcs8_key.pem
```
{% include copy.html %}

You can provide PEM values either as literal PEM text, with newlines escaped as `\n`, or as Base64-encoded PEM. Base64 values are detected and decoded automatically. Because Base64 encoding avoids escaping newlines by hand, it is the more convenient option for multiline certificates. To Base64-encode a certificate or key, use the following command:

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

To rotate an expiring certificate, send the new certificate material in an update request, as described in [Updating connector credentials](#updating-connector-credentials). You don't need to undeploy the model or restart any nodes.

OpenSearch detects the change and builds a new HTTP client for subsequent predict requests. The replaced client is closed after a grace period, so requests already in flight complete against the previous certificate.

### Restrictions

The following restrictions apply to client certificate authentication:

- mTLS applies only to connectors that use the `http` protocol. Connectors that use the `aws_sigv4`, `mcp_sse`, or `mcp_streamable_http` protocol accept `mutual_tls_enabled` when they are created but ignore it at runtime.
- `skip_ssl_verification` and `mutual_tls_enabled` cannot both be set to `true`. Disabling server certificate validation removes the mutual part of mutual TLS, so provide `ca_cert_pem` to validate the server certificate against a private CA.
- The `credential` object cannot contain `api_key` when mTLS is enabled. OpenSearch enforces certificate-only authentication and rejects mixed authentication methods.
- File paths are not supported in certificate fields. Provide the certificate content itself.
- Certificate material is validated on the first predict request. A connector with an invalid certificate configuration is created successfully and fails when it is first used.

## Next steps

- For descriptions of all connector parameters, including the `credential` and `client_config` objects, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
- For information about passing per-request values in connector headers, see [Dynamic header substitution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/dynamic-header-substitution/).
