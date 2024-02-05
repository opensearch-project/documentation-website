---
layout: default
title: Get connector
parent: Connector APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get a connector

Use the `_search` endpoint to search for a connector.

To retrieve information about a connector, you can:

- [Get a connector by ID](#get-a-connector-by-id)
- [Search for a connector](#search-for-a-connector)

## Get a connector by ID

This API retrieves a connector by its ID.

### Path and HTTP methods

```json
GET /_plugins/_ml/connectors/<connector_id>
```

#### Example request

```json
GET /_plugins/_ml/connectors/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

#### Example response

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

## Search for a connector

This API searches for matching connectors using a query.

### Path and HTTP methods

```json
POST /_plugins/_ml/connectors/_search
GET /_plugins/_ml/connectors/_search
```

#### Example request

```json
POST /_plugins/_ml/connectors/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : ".plugins-ml-connector",
        "_id" : "7W-d74sBPD67W0wkEZdE",
        "_version" : 1,
        "_seq_no" : 2,
        "_primary_term" : 1,
        "_score" : 1.0,
        "_source" : {
          "protocol" : "aws_sigv4",
          "name" : "BedRock claude Connector",
          "description" : "The connector to BedRock service for claude model",
          "version" : "1",
          "parameters" : {
            "endpoint" : "bedrock.us-east-1.amazonaws.com",
            "content_type" : "application/json",
            "auth" : "Sig_V4",
            "max_tokens_to_sample" : "8000",
            "service_name" : "bedrock",
            "temperature" : "1.0E-4",
            "response_filter" : "$.completion",
            "region" : "us-east-1",
            "anthropic_version" : "bedrock-2023-05-31"
          },
          "actions" : [
            {
              "headers" : {
                "x-amz-content-sha256" : "required",
                "content-type" : "application/json"
              },
              "method" : "POST",
              "request_body" : "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }",
              "action_type" : "PREDICT",
              "url" : "https://bedrock.us-east-1.amazonaws.com/model/anthropic.claude-v2/invoke"
            }
          ]
        }
      },
      {
        "_index" : ".plugins-ml-connector",
        "_id" : "9W-d74sBPD67W0wk4pf_",
        "_version" : 1,
        "_seq_no" : 3,
        "_primary_term" : 1,
        "_score" : 1.0,
        "_source" : {
          "protocol" : "aws_sigv4",
          "name" : "BedRock claude Connector",
          "description" : "The connector to BedRock service for claude model",
          "version" : "1",
          "parameters" : {
            "endpoint" : "bedrock.us-east-1.amazonaws.com",
            "content_type" : "application/json",
            "auth" : "Sig_V4",
            "max_tokens_to_sample" : "8000",
            "service_name" : "bedrock",
            "temperature" : "1.0E-4",
            "response_filter" : "$.completion",
            "region" : "us-east-1",
            "anthropic_version" : "bedrock-2023-05-31"
          },
          "actions" : [
            {
              "headers" : {
                "x-amz-content-sha256" : "required",
                "content-type" : "application/json"
              },
              "method" : "POST",
              "request_body" : "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }",
              "action_type" : "PREDICT",
              "url" : "https://bedrock.us-east-1.amazonaws.com/model/anthropic.claude-v2/invoke"
            }
          ]
        }
      },
      {
        "_index" : ".plugins-ml-connector",
        "_id" : "rm_u8osBPD67W0wkCpsG",
        "_version" : 1,
        "_seq_no" : 4,
        "_primary_term" : 1,
        "_score" : 1.0,
        "_source" : {
          "protocol" : "aws_sigv4",
          "name" : "BedRock Claude-Instant v1",
          "description" : "Bedrock connector for Claude Instant testing",
          "version" : "1",
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
              "headers" : {
                "x-amz-content-sha256" : "required",
                "content-type" : "application/json"
              },
              "method" : "POST",
              "request_body" : "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }",
              "action_type" : "PREDICT",
              "url" : "https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-instant-v1/invoke"
            }
          ]
        }
      }
    ]
  }
}
```

