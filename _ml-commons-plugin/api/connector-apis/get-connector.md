---
layout: default
title: Get connector
parent: Connector APIs
grand_parent: ML APIs
nav_order: 20
---

# Get Connector API

This API retrieves a connector by its ID.

## Endpoints

```json
GET /_plugins/_ml/connectors/{connector_id}
```

## Example request

```json
GET /_plugins/_ml/connectors/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

## Example response

```json
{
  "name" : "BedRock Claude Sonnet 4.6",
  "version" : "1",
  "description" : "Bedrock connector for Claude Sonnet 4.6 testing",
  "protocol" : "aws_sigv4",
  "parameters" : {
    "endpoint" : "bedrock.us-east-1.amazonaws.com",
    "content_type" : "application/json",
    "auth" : "Sig_V4",
    "service_name" : "bedrock",
    "region" : "us-east-1",
    "anthropic_version" : "bedrock-2023-05-31"
  },
  "actions" : [
    {
      "action_type" : "PREDICT",
      "method" : "POST",
      "url" : "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-6/invoke",
      "headers" : {
        "x-amz-content-sha256" : "required",
        "content-type" : "application/json"
      },
      "request_body" : "{\"messages\":[{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}], \"max_tokens\":${parameters.max_tokens}, \"temperature\":${parameters.temperature}, \"anthropic_version\":\"${parameters.anthropic_version}\" }"
    }
  ],
  "created_time" : 1792088573796,
  "last_updated_time" : 1792088573796
}
```
