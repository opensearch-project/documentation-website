---
layout: default
title: Guardrails
has_children: false
has_toc: false
nav_order: 70
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/remote-models/guardrails/
---

# Configuring model guardrails
**Introduced 2.13**
{: .label .label-purple }

Guardrails can guide a large language model (LLM) toward desired behavior. They act as a filter, preventing the LLM from generating output that is harmful or violates ethical principles and facilitating safer use of AI. Guardrails also cause the LLM to produce more focused and relevant output. 

To configure guardrails for your LLM, you can provide a list of words to be prohibited in the input or output of the model. Alternatively, you can provide a regular expression against which the model input or output will be matched.

## Prerequisites

Before you start, make sure you have fulfilled the [prerequisites]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#prerequisites) for connecting to an externally hosted model.

## Step 1: Create a guardrail index

To start, create an index that will store the excluded words (_stopwords_). In the index settings, specify a `title` field, which will contain excluded words, and a `query` field of the [percolator]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/percolator/) type. The percolator query will be used to match the LLM input or output:

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
      "query": "title: blacklist"
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

For more query string options, see [Query string query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/).

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

Now you can create a connector for the model. In this example, you'll create a connector to the Anthropic Claude model hosted on Amazon Bedrock:

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
    "type": "local_regex",
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
        ".*abort.*",
        ".*kill.*"
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
        ".*abort.*",
        ".*kill.*"
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
    "prompt": "\n\nHuman:this is a test\n\nnAssistant:"
  }
}
```
{% include copy-curl.html %}

The response contains inference results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "response": " Thank you for the test, I appreciate you taking the time to interact with me. I'm an AI assistant created by Anthropic to be helpful, harmless, and honest."
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

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

The response contains an error message because guardrails were triggered:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "illegal_argument_exception",
        "reason": "guardrails triggered for user input"
      }
    ],
    "type": "illegal_argument_exception",
    "reason": "guardrails triggered for user input"
  },
  "status": 400
}
```

Guardrails are also triggered when a prompt matches the supplied regular expression.

## Next steps

- For more information about configuring guardrails, see [The `guardrails` parameter]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-guardrails-parameter).