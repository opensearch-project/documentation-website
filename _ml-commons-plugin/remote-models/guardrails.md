---
layout: default
title: Guardrails
has_children: false
has_toc: false
nav_order: 70
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
---

# Configuring model guardrails
**Introduced 2.13**
{: .label .label-purple }

Guardrails can guide a large language model (LLM) toward desired behavior. They act as a filter, preventing the LLM from generating outputs that are harmful or violate ethical principles and facilitating a safer use of AI. Guardrails also steer the LLM to produce a more focused and relevant output. 

To configure guardrails for your LLM, you can provide a list of words that are prohibited in the input or output of the model. Alternatively, you can provide a regular expression against which the model input or output will be matched.

## Step 1: Create a guardrail index

To start, create an index that will hold the excluded words (_stopwords_). In the index settings, specify for the index to contain a `title` field, which will contain excluded words, and a `query` field, which is of the [percolator]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/percolator/) type. The percolator query will be used to match the LLM input or output:

```json
PUT /words0
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "query": {
        "type": "percolator"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Index excluded words or phrases

Next, index a query string query that will be used to match excluded words in the model input or output:

```json
PUT /words0/_doc/1?refresh
{
  "query": {
    "query_string": {
      "query": "title: \"Black day blacklist\""
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /words0/_doc/2?refresh
{
  "query": {
    "query_string": {
      "query": "title: \"Master slave architecture\""
    }
  }
}
```
{% include copy-curl.html %}

## Step 3: Register a model group

To register a model group, send the following request:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "bedrock",
    "description": "This is a public model group."
}
```
{% include copy-curl.html %}

The response contains the model group ID that you'll use to register a model to this model group:

```json
{
 "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
 "status": "CREATED"
}
```

To learn more about model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Step 4: Create a connector

Create a connector to the model. In this example, you'll create a connector to the Anthropic Claude model hosted on Amazon Bedrock:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "BedRock test claude Connector",
  "description": "The connector to BedRock service for claude model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
      "region": "us-east-1",
      "service_name": "bedrock",
      "anthropic_version": "bedrock-2023-05-31",
      "endpoint": "bedrock.us-east-1.amazonaws.com",
      "auth": "Sig_V4",
      "content_type": "application/json",
      "max_tokens_to_sample": 8000,
      "temperature": 0.0001,
      "response_filter": "$.completion"
  },
  "credential": {
      "access_key": "<YOUR_ACCESS_KEY>",
      "secret_key": "<YOUR_SECRET_KEY>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-v2/invoke",
      "headers": { 
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }"
    }
  ]
}
```
{% include copy-curl.html %}

The response contains the connector ID for the newly created connector:

```json
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

## Step 5: Register and deploy the model with guardrails

To register an externally hosted model, provide the model group ID from step 3 and the connector ID from step 4 in the following request. To configure guardrails, include the `guardrails` object:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "Bedrock Claude V2 model",
  "function_name": "remote",
  "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
  "description": "test model",
  "connector_id": "a1eMb4kBJ1eYAeTMAljY",
  "guardrails": {
    "input_guardrail": {
      "stop_words": [
        {
          "index_name": "words0",
          "source_fields": [
            "title"
          ]
        }
      ],
      "regex": [
        "regex1",
        "regex2"
      ]
    },
    "output_guardrail": {
      "stop_words": [
        {
          "index_name": "words0",
          "source_fields": [
            "title"
          ]
        }
      ],
      "regex": [
        "regex1",
        "regex2"
      ]
    }
  }
}
```
{% include copy-curl.html %}

For more information, see [The `guardrails` parameter]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-guardrails-parameter).

OpenSearch returns the task ID of the register operation:

```json
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

```bash
GET /_plugins/_ml/tasks/cVeMb4kBJ1eYAeTMFFgj
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```json
{
  "model_id": "cleMb4kBJ1eYAeTMFFg4",
  "task_type": "DEPLOY_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "n-72khvBTBi3bnIIR8FTTw"
  ],
  "create_time": 1689793851077,
  "last_update_time": 1689793851101,
  "is_async": true
}
```

## Step 6 (Optional): Test the model

To demonstrate how guardrails are applied, first run the predict operation that does not contain any excluded words:

```json
POST /_plugins/_ml/models/p94dYo4BrXGpZpgPp98E/_predict
{
  "parameters": {
    "prompt": "\n\nHuman:hello\n\nnAssistant:"
  }
}
```
{% include copy-curl.html %}

Then run the predict operation that contains excluded words:

```json
POST /_plugins/_ml/models/p94dYo4BrXGpZpgPp98E/_predict
{
  "parameters": {
    "prompt": "\n\nHuman:this is a test of Master slave architecture\n\nnAssistant:"
  }
}
```
{% include copy-curl.html %}

## Next steps

- For more information about configuring guardrails, see [The `guardrails` parameter]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-guardrails-parameter).