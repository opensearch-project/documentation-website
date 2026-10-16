---
layout: default
title: Search connector
parent: Connector APIs
grand_parent: ML Commons APIs
nav_order: 25
---

# Search Connector API

Use the `_search` endpoint to search for a connector. This API uses a query to search for matching connectors.

## Endpoints

```json
POST /_plugins/_ml/connectors/_search
GET /_plugins/_ml/connectors/_search
```

## Example request

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

## Example response

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
          "created_time" : 1792088563675,
          "protocol" : "aws_sigv4",
          "last_updated_time" : 1792088563675,
          "name" : "BedRock claude Connector",
          "description" : "The connector to BedRock service for claude model",
          "version" : "1",
          "parameters" : {
            "endpoint" : "bedrock.us-east-1.amazonaws.com",
            "content_type" : "application/json",
            "auth" : "Sig_V4",
            "max_tokens" : "8000",
            "service_name" : "bedrock",
            "temperature" : "1.0E-4",
            "response_filter" : "$.content[0].text",
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
              "request_body" : "{\"messages\":[{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}], \"max_tokens\":${parameters.max_tokens}, \"temperature\":${parameters.temperature}, \"anthropic_version\":\"${parameters.anthropic_version}\" }",
              "action_type" : "PREDICT",
              "url" : "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-6/invoke"
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
          "created_time" : 1792088569179,
          "protocol" : "aws_sigv4",
          "last_updated_time" : 1792088569179,
          "name" : "BedRock claude Connector",
          "description" : "The connector to BedRock service for claude model",
          "version" : "1",
          "parameters" : {
            "endpoint" : "bedrock.us-east-1.amazonaws.com",
            "content_type" : "application/json",
            "auth" : "Sig_V4",
            "max_tokens" : "8000",
            "service_name" : "bedrock",
            "temperature" : "1.0E-4",
            "response_filter" : "$.content[0].text",
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
              "request_body" : "{\"messages\":[{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}], \"max_tokens\":${parameters.max_tokens}, \"temperature\":${parameters.temperature}, \"anthropic_version\":\"${parameters.anthropic_version}\" }",
              "action_type" : "PREDICT",
              "url" : "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-6/invoke"
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
          "created_time" : 1792088573796,
          "protocol" : "aws_sigv4",
          "last_updated_time" : 1792088573796,
          "name" : "BedRock Claude Sonnet 4.6",
          "description" : "Bedrock connector for Claude Sonnet 4.6 testing",
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
              "request_body" : "{\"messages\":[{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}], \"max_tokens\":${parameters.max_tokens}, \"temperature\":${parameters.temperature}, \"anthropic_version\":\"${parameters.anthropic_version}\" }",
              "action_type" : "PREDICT",
              "url" : "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-6/invoke"
            }
          ]
        }
      }
    ]
  }
}
```

