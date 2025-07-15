---
layout: default
title: Amazon Bedrock model guardrails 
parent: Model guardrails
grand_parent: Generative AI
nav_order: 170
redirect_from:
  - /ml-commons-plugin/tutorials/bedrock-guardrails/
  - /vector-search/tutorials/model-controls/bedrock-guardrails/
---

# Amazon Bedrock model guardrails 

This tutorial shows you how to apply Amazon Bedrock guardrails to your externally hosted models in two ways:

- [Using the Amazon Bedrock Guardrails standalone API](#using-the-amazon-bedrock-guardrails-standalone-api)
- [Using guardrails embedded in the Amazon Bedrock Model Inference API](#using-guardrails-embedded-in-the-amazon-bedrock-model-inference-api)

For more information about guardrails, see [Configuring model guardrails]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/guardrails/).

Replace the placeholders starting with the prefix `your_` with your own values.
{: .note}

## Prerequisites

Before you begin, you must create your Amazon Bedrock guardrails. For detailed instructions, see [Create a guardrail](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-create.html).

## Using the Amazon Bedrock Guardrails standalone API

Use the following steps to call the Amazon Bedrock Guardrails standalone API.

### Step 1: Create a connector for your Amazon Bedrock guardrail endpoint

First, create a connector that will interface with your Amazon Bedrock guardrail endpoint. This connector will handle authentication and communication with the guardrail service:

```json
POST _plugins/_ml/connectors/_create
{
  "name": "BedRock Guardrail Connector",
  "description": "BedRock Guardrail Connector",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "your_aws_region like us-east-1",
    "service_name": "bedrock",
    "source": "INPUT"
  },
  "credential": {
    "access_key": "your_aws_access_key",
    "secret_key": "your_aws_secret_key",
    "session_token": "your_aws_session_token"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/guardrail/your_guardrailIdentifier/version/1/apply",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{\"source\":\"${parameters.source}\", \"content\":[ { \"text\":{\"text\": \"${parameters.question}\"} } ] }"
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2: Register the guardrail model

Now that you've created a connector, register it as a remote guardrail model that will be used to validate inputs:

```json
POST _plugins/_ml/models/_register
{
  "name": "bedrock test guardrail API",
  "function_name": "remote",
  "description": "guardrail test model",
  "connector_id": "your_guardrail_connector_id"
}
```
{% include copy-curl.html %}

### Step 3: Test the guardrail model

Verify that the guardrail is properly filtering inappropriate content:

```json
POST _plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "question": "\n\nHuman:How to rob a bank\n\nAssistant:"
  }
}
```
{% include copy-curl.html %}

The response shows that the guardrail blocks the request when it detects inappropriate content:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "action": "GUARDRAIL_INTERVENED",
            "assessments": [
              {
                "contentPolicy": {
                  "filters": [
                    {
                      "action": "BLOCKED",
                      "confidence": "HIGH",
                      "type": "VIOLENCE"
                    },
                    {
                      "action": "BLOCKED",
                      "confidence": "HIGH",
                      "type": "PROMPT_ATTACK"
                    }
                  ]
                },
                "wordPolicy": {
                  "customWords": [
                    {
                      "action": "BLOCKED",
                      "match": "rob"
                    }
                  ]
                }
              }
            ],
            "blockedResponse": "Sorry, the model cannot answer this question.",
            "output": [
              {
                "text": "Sorry, the model cannot answer this question."
              }
            ],
            "outputs": [
              {
                "text": "Sorry, the model cannot answer this question."
              }
            ],
            "usage": {
              "contentPolicyUnits": 1.0,
              "contextualGroundingPolicyUnits": 0.0,
              "sensitiveInformationPolicyFreeUnits": 0.0,
              "sensitiveInformationPolicyUnits": 0.0,
              "topicPolicyUnits": 1.0,
              "wordPolicyUnits": 1.0
            }
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

### Step 4: Create a Claude model connector

To use the guardrails with an Amazon Bedrock Claude model, first create a connector for the Claude endpoint:

```json
POST _plugins/_ml/connectors/_create
{
  "name": "BedRock claude Connector",
  "description": "BedRock claude Connector",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "your_aws_region like us-east-1",
    "service_name": "bedrock",
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens_to_sample": 8000,
    "temperature": 0.0001,
    "response_filter": "$.completion"
  },
  "credential": {
    "access_key": "your_aws_access_key",
    "secret_key": "your_aws_secret_key",
    "session_token": "your_aws_session_token"
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

### Step 5: Register the Claude model

Register the Claude model with input guardrails enabled. This configuration ensures that all requests sent to the model are first validated by the guardrails:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Bedrock Claude V2 model",
    "function_name": "remote",
    "description": "Bedrock Claude V2 model",
    "connector_id": "your_connector_id",
    "guardrails": {
        "input_guardrail": {
            "model_id": "your_guardrail_model_id",
            "response_filter":"$.action",
            "response_validation_regex": "^\"NONE\"$"
        },
        "type": "model"
    }
}
```
{% include copy-curl.html %}

### Step 6: Test the model

First, test the model with acceptable input:

```json
POST /_plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "prompt": "\n\nHuman:${parameters.question}\n\nnAssistant:",
    "question": "hello"
  }
}
```
{% include copy-curl.html %}

The response shows that the call was successful:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "response": " Hello!"
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

Next, test the model with inappropriate input:

```json
POST /_plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "prompt": "\n\nHuman:${parameters.question}\n\nnAssistant:",
    "question": "how to rob a bank"
  }
}
```
{% include copy-curl.html %}

The response shows that the inappropriate input was blocked:

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

## Using guardrails embedded in the Amazon Bedrock Model Inference API

Use the following steps to use the guardrails embedded in the Model Inference API.

### Step 1: Create a connector for an Amazon Bedrock model containing guardrail headers

Create a connector that includes guardrail headers in its configuration. In this approach, the guardrail checks are embedded directly in the model inference process. The `post_process_function` is required in order to define the logic used by the model to block inappropriate input:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "BedRock claude Connector",
  "description": "BedRock claude Connector",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
      "region": "your_aws_region like us-east-1",
      "service_name": "bedrock",
      "max_tokens_to_sample": 8000,
      "temperature": 0.0001
  },
  "credential": {
      "access_key": "your_aws_access_key",
      "secret_key": "your_aws_secret_key",
      "session_token": "your_aws_session_token"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-v2/invoke",
      "headers": { 
        "content-type": "application/json",
        "x-amz-content-sha256": "required",
        "X-Amzn-Bedrock-Trace": "ENABLED",
        "X-Amzn-Bedrock-GuardrailIdentifier": "your_GuardrailIdentifier",
        "X-Amzn-Bedrock-GuardrailVersion": "your_bedrock_guardrail_version"
      },
      "request_body": "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }",
      "post_process_function": "\n      if (params['amazon-bedrock-guardrailAction']=='INTERVENED') throw new IllegalArgumentException(\"test guardrail from post process function\");\n    "
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2: Register the model

Register the model using the connector with embedded guardrails:

```json
POST _plugins/_ml/models/_register
{
  "name": "bedrock model with guardrails",
  "function_name": "remote",
  "description": "guardrails test model",
  "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

### Step 3: Test the model

Verify that the embedded guardrails are functioning by testing them with potentially inappropriate input:

```json
POST _plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "input": "\n\nHuman:how to rob a bank\n\nAssistant:"
  }
}
```
{% include copy-curl.html %}

The response shows that the inappropriate input was blocked:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "m_l_exception",
        "reason": "Fail to execute predict in aws connector"
      }
    ],
    "type": "m_l_exception",
    "reason": "Fail to execute predict in aws connector",
    "caused_by": {
      "type": "script_exception",
      "reason": "runtime error",
      "script_stack": [
        "throw new IllegalArgumentException(\"test guardrail from post process function\");\n    ",
        "      ^---- HERE"
      ],
      "script": " ...",
      "lang": "painless",
      "position": {
        "offset": 73,
        "start": 67,
        "end": 152
      },
      "caused_by": {
        "type": "illegal_argument_exception",
        "reason": "test guardrail from post process function"
      }
    }
  },
  "status": 500
}
```