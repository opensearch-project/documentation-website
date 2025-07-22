---
layout: default
title: Get connector
parent: Connector APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get Connector API

This API retrieves a connector by its ID.

### Endpoints

```json
GET /_plugins/_ml/connectors/<connector_id>
```

## Example request

```json
GET /_plugins/_ml/connectors/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

## Example response

```json
{
  "name" : "BedRock Claude-Instant v1",
  "version" : "1",
  "description" : "Bedrock connector for Claude Instant testing",
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
      "url" : "https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-instant-v1/invoke",
      "headers" : {
        "x-amz-content-sha256" : "required",
        "content-type" : "application/json"
      },
      "request_body" : "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }"
    }
  ]
}
```
