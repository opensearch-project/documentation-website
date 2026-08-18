---
layout: default
title: Create connector
parent: Connector APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Create Connector API

Creates a standalone connector. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

## Endpoints

```json
POST /_plugins/_ml/connectors/_create
```

## Request body fields

For a list of request fields, see [Blueprint configuration parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints#configuration-parameters).

## Example request

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

## Example response

```json
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

## Custom connector IDs
**Introduced 3.9**
{: .label .label-purple }

Optionally specify a `connector_id` in the request body when creating a connector. If provided, OpenSearch uses your ID as the connector identifier in subsequent API calls. If omitted, OpenSearch auto-generates a connector ID as before.

### Example request with a custom connector ID

```json
POST /_plugins/_ml/connectors/_create
{
    "connector_id": "my_gpt_connector",
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for GPT 4.1",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-4.1"
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

The response returns the custom ID you specified:

```json
{
  "connector_id": "my_gpt_connector"
}
```

{% include ml-custom-resource-ids.md %}
