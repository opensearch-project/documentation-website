---
layout: default
title: Google Cloud authentication
has_children: false
nav_order: 60
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Google Cloud authentication
**Introduced 3.9**
{: .label .label-purple }

The `google_cloud` connector protocol enables OpenSearch to call Google Cloud Vertex AI models. OpenSearch generates and refreshes the Google Cloud OAuth 2.0 access token and adds an `Authorization` header to each request, so you don't need to supply or rotate a token manually. This protocol is the Google Cloud equivalent of the [`aws_sigv4` protocol]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/aws-sigv4/) for AWS services.

Google has renamed Vertex AI to Gemini Enterprise Agent Platform. The API endpoints called by the connector, such as `aiplatform.googleapis.com`, are unchanged, so existing connectors do not require modification.
{: .note}

## Prerequisites

Before creating a `google_cloud` connector, enable Vertex AI in your Google Cloud project and prepare either a service account key or, for nodes hosted on Google Cloud, Workload Identity. Then configure the cluster settings by following these steps:

1. Enable the `google_cloud` protocol, which is disabled by default. To enable it, set the `plugins.ml_commons.connector.vertexai_enabled` cluster setting to `true`:

   ```json
   PUT /_cluster/settings
   {
     "persistent": {
       "plugins.ml_commons.connector.vertexai_enabled": true
     }
   }
   ```
   {% include copy-curl.html %}

1. If you have changed the `plugins.ml_commons.trusted_connector_endpoints_regex` setting or are using a version of OpenSearch earlier than 3.10, add the Vertex AI host to the trusted connector endpoints. Starting with OpenSearch 3.10, the default value of this setting includes the Vertex AI host. 

   First, retrieve the current list:

   ```json
   GET /_cluster/settings?include_defaults=true&filter_path=**.trusted_connector_endpoints_regex
   ```
   {% include copy-curl.html %}

   Then update the list by appending the Vertex AI pattern:

   ```json
   PUT /_cluster/settings
   {
     "persistent": {
       "plugins.ml_commons.trusted_connector_endpoints_regex": [
         "<every pattern from the preceding response>",
         "^https://([a-z0-9][a-z0-9-]*-)?aiplatform\\.googleapis\\.com/.*$"
       ]
     }
   }
   ```
   {% include copy-curl.html %}

   The new list overwrites the existing one. If it contains only the Vertex AI pattern, then OpenSearch blocks connections to other providers, such as Amazon Bedrock or OpenAI. For the default list, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#adding-trusted-endpoints).
   {: .warning}

## Authentication modes

The `google_cloud` protocol supports two authentication modes.

### Service account key mode

Supply the service account's `private_key` and `client_email` in the `credential` object:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Vertex AI Connector: Gemini",
    "description": "Vertex AI Gemini generateContent connector",
    "version": 1,
    "protocol": "google_cloud",
    "parameters": {
        "project_id": "<project_id>",
        "location": "us-central1",
        "model": "gemini-2.5-flash",
        "scopes": "https://www.googleapis.com/auth/cloud-platform"
    },
    "credential": {
        "private_key": "<private_key>",
        "client_email": "<client_email>",
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

On nodes hosted on Google Cloud, use Application Default Credentials (ADC) or Workload Identity instead of a service account key. Set `auth_mode` to `adc` in `parameters` and omit the `credential` object:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Vertex AI Connector: Gemini (ADC)",
    "description": "Vertex AI Gemini generateContent connector using ADC",
    "version": 1,
    "protocol": "google_cloud",
    "parameters": {
        "project_id": "<project_id>",
        "location": "us-central1",
        "model": "gemini-2.5-flash",
        "auth_mode": "adc",
        "scopes": "https://www.googleapis.com/auth/cloud-platform"
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

Use ADC mode only on nodes hosted on Google Cloud. ADC resolves credentials from the node environment, which requires contacting the Google Cloud metadata server. The service account key and ADC modes are mutually exclusive: if you include a `credential` object in ADC mode, it must not contain `private_key` or `client_email`. OpenSearch rejects the connector otherwise.

## Request body fields

When `protocol` is set to `google_cloud`, the `credential` object supports the following fields.

| Field | Data type | Required/Optional | Description |
|:---|:---|:---|:---|
| `private_key` | String | Required in service account key mode | The service account's private key. Omit in ADC mode. |
| `client_email` | String | Required in service account key mode | The service account's client email. Omit in ADC mode. |
| `token_uri` | String | Optional | The Google OAuth 2.0 token endpoint. Default is `https://oauth2.googleapis.com/token`. The URL must use HTTPS, the host must be `oauth2.googleapis.com`, and the port must be `443` or omitted. |

When `protocol` is set to `google_cloud`, the `parameters` object supports the following fields.

| Field | Data type | Required/Optional | Description |
|:---|:---|:---|:---|
| `project_id` | String | Required | Your Google Cloud project ID. |
| `location` | String | Required | The Vertex AI region, for example, `us-central1`. |
| `model` | String | Required | The Vertex AI model ID, for example, `gemini-2.5-flash`. |
| `auth_mode` | String | Optional | Set to `adc` to use Application Default Credentials or Workload Identity. Omit in service account key mode. |
| `scopes` | String | Optional | The OAuth 2.0 scope to request. Specify a single scope. Default is `https://www.googleapis.com/auth/cloud-platform`. |

## Next steps

- To find the blueprint for your model, including Gemini, embeddings, streaming, and batch inference, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To register and deploy a model that uses this connector, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
