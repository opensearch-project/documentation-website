---
layout: default
title: Google Cloud Vertex AI connector
has_children: false
has_toc: false
nav_order: 63
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Google Cloud Vertex AI connector
**Introduced 3.9**
{: .label .label-purple }

The `google_cloud` connector protocol lets OpenSearch call Google Cloud Vertex AI models while OpenSearch mints and refreshes the Google Cloud OAuth2 access token for you. You do not supply or rotate an access token by hand, and you do not add an `Authorization` header---the protocol injects one for each request. This is the Google Cloud equivalent of the [`aws_sigv4` protocol]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/aws-connectors/) for Amazon services.

## Prerequisites

Before creating a `google_cloud` connector, make sure the following requirements are met:

- **Enable the connector.** The `google_cloud` protocol is disabled by default. Enable it by setting the `plugins.ml_commons.connector.vertexai_enabled` cluster setting to `true`:

  ```json
  PUT /_cluster/settings
  {
    "persistent": {
      "plugins.ml_commons.connector.vertexai_enabled": true
    }
  }
  ```
  {% include copy-curl.html %}

- **Add the Vertex AI endpoint to the trusted connector endpoints.** Add the Vertex AI host pattern to the `plugins.ml_commons.trusted_connector_endpoints_regex` setting:

  ```json
  PUT /_cluster/settings
  {
    "persistent": {
      "plugins.ml_commons.trusted_connector_endpoints_regex": [
        "^https://.*-aiplatform\\.googleapis\\.com/.*$"
      ]
    }
  }
  ```
  {% include copy-curl.html %}

- **Prepare Google Cloud access.** Enable Vertex AI in your Google Cloud project and prepare credentials: either a service account key or Workload Identity for nodes running on Google Cloud.

## Authentication modes

The `google_cloud` protocol supports two authentication modes.

### Service-account key mode

Supply the service account's `private_key` and `client_email` in the `credential` object:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "GCP Vertex AI Connector: Gemini",
    "description": "Vertex AI Gemini generateContent connector",
    "version": 1,
    "protocol": "google_cloud",
    "parameters": {
        "project_id": "<YOUR_PROJECT_ID>",
        "location": "us-central1",
        "model": "gemini-2.5-flash",
        "scopes": "https://www.googleapis.com/auth/cloud-platform"
    },
    "credential": {
        "private_key": "<YOUR_SERVICE_ACCOUNT_PRIVATE_KEY>",
        "client_email": "<YOUR_SERVICE_ACCOUNT_CLIENT_EMAIL>",
        "token_uri": "https://oauth2.googleapis.com/token"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://${parameters.location}-aiplatform.googleapis.com/v1/projects/${parameters.project_id}/locations/${parameters.location}/publishers/google/models/${parameters.model}:generateContent",
            "headers": {
                "Content-Type": "application/json"
            },
            "request_body": "{\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"${parameters.prompt}\"}]}]}"
        }
    ]
}
```
{% include copy-curl.html %}

### Application Default Credentials mode

On nodes running in Google Cloud, use Application Default Credentials (ADC) or Workload Identity instead of a service account key. Set `auth_mode` to `adc` in `parameters` and leave `credential` empty:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "GCP Vertex AI Connector: Gemini (ADC)",
    "description": "Vertex AI Gemini generateContent connector using ADC",
    "version": 1,
    "protocol": "google_cloud",
    "parameters": {
        "project_id": "<YOUR_PROJECT_ID>",
        "location": "us-central1",
        "model": "gemini-2.5-flash",
        "auth_mode": "adc",
        "scopes": "https://www.googleapis.com/auth/cloud-platform"
    },
    "credential": {},
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://${parameters.location}-aiplatform.googleapis.com/v1/projects/${parameters.project_id}/locations/${parameters.location}/publishers/google/models/${parameters.model}:generateContent",
            "headers": {
                "Content-Type": "application/json"
            },
            "request_body": "{\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"${parameters.prompt}\"}]}]}"
        }
    ]
}
```
{% include copy-curl.html %}

Use ADC mode only on Google Cloud-hosted nodes. It resolves credentials from the node environment, which includes contacting the Google Cloud metadata server. The service account key and ADC modes are mutually exclusive: in ADC mode, do not include `private_key` or `client_email`.

## Credential and parameter options

The `credential` object contains the following options for service-account key authentication:

- `private_key`: Required in service-account key mode. The service account's private key. Omit in ADC mode.
- `client_email`: Required in service-account key mode. The service account's client email. Omit in ADC mode.
- `token_uri`: Optional. The Google OAuth2 token endpoint. Default is `https://oauth2.googleapis.com/token`. If you set this option, the value must use HTTPS and the host must be exactly `oauth2.googleapis.com`. Any other host is rejected when the connector is created.

The `parameters` object contains the following options:

- `project_id`: Required. Your Google Cloud project ID.
- `location`: Required. The Vertex AI region, for example `us-central1`.
- `model`: Required. The Vertex AI model ID, for example `gemini-2.5-flash`.
- `auth_mode`: Optional. Set to `adc` to use Application Default Credentials or Workload Identity. Omit for service-account key mode.
- `scopes`: Optional. The OAuth2 scopes to request. Default is `https://www.googleapis.com/auth/cloud-platform`.

## Next steps

- For complete connector examples, including embeddings, streaming, and batch inference, see the Google Cloud Platform blueprints in [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To register and deploy a model that uses this connector, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
