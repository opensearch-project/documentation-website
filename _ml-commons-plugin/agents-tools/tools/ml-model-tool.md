---
layout: default
title: ML Model tool
has_children: false
has_toc: false
nav_order: 40
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# ML Model tool
plugins.ml_commons.rag_pipeline_feature_enabled: true
{: .label .label-purple }
<!-- vale on -->

The `MLModelTool` runs a machine learning (ML) model and returns inference results.

## Step 1: Create a connector for a model

The following example request creates a connector for a model hosted on [Amazon SageMaker](https://aws.amazon.com/pm/sagemaker/):

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "sagemaker model",
  "description": "Test connector for Sagemaker model",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "<YOUR ACCESS KEY>",
    "secret_key": "<YOUR SECRET KEY>"
  },
  "parameters": {
    "region": "us-east-1",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "url": "<YOUR SAGEMAKER ENDPOINT>",
      "request_body": """{"prompt":"${parameters.prompt}"}"""
    }
  ]
}
```
{% include copy-curl.html %} 

OpenSearch responds with a connector ID:

```json
{
  "connector_id": "eJATWo0BkIylWTeYToTn"
}
```

## Step 2: Register and deploy the model 

To register and deploy the model to OpenSearch, send the following request, providing the connector ID from the previous step:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-inferene",
  "function_name": "remote",
  "description": "test model",
  "connector_id": "eJATWo0BkIylWTeYToTn"
}
```
{% include copy-curl.html %} 

OpenSearch responds with a model ID:

```json
{
  "task_id": "7X7pWI0Bpc3sThaJ4I8R",
  "status": "CREATED",
  "model_id": "h5AUWo0BkIylWTeYT4SU"
}
```

## Step 3: Register a flow agent that will run the MLModelTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, providing the model ID in the `model_id` parameter:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test agent for embedding model",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "h5AUWo0BkIylWTeYT4SU",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

## Step 4: Run the agent

Run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the inference results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": " I do not have direct data on the population increase of Seattle from 2021 to 2023 in the context provided. As a data analyst, I would need to research population statistics from credible sources like the US Census Bureau to analyze population trends and make an informed estimate. Without looking up actual data, I don't have enough information to provide a specific answer to the question."
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`model_id` | String | Required | The model ID of the large language model (LLM) to use for generating the response.
`prompt` | String | Optional | The prompt to provide to the LLM.
`response_field` | String | Optional | The name of the response field. Default is `response`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.