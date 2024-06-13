---
layout: default
title: Connector tool
has_children: false
has_toc: false
nav_order: 20
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Connector tool
**Introduced 2.15**
{: .label .label-purple }
<!-- vale on -->

The `ConnectorTool` runs `execute` action in a connector.

## Step 1: Register a connector with execute action

`ConnectorTool` can only run `execute` action in a connector. So you need to create a connector with `execute` action. It's very similar to the `predict` action in connector. For example, create a connector to execute an AWS Lambda function with [Function URL](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html).
The Lambda function accepts two integer numbers and returns the sum.

```
POST _plugins/_ml/connectors/_create
{
  "name": "Lambda connector of simple calculator",
  "description": "Demo connector of lambda function",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "YOUR AWS REGION",
    "service_name": "lambda"
  },
  "credential": {
    "access_key": "YOUR ACCESS KEY",
    "secret_key": "YOUR SECRET KEY",
    "session_token": "YOUR SESSION TOKEN"
  },
  "actions": [
    {
      "action_type": "execute",
      "method": "POST",
      "url": "YOUR LAMBDA FUNCTION URL",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"number1\":\"${parameters.number1}\", \"number2\":\"${parameters.number2}\" }"
    }
  ]
}
```
OpenSearch responds with an agent ID:

```json
{
  "connector_id": "Zz1XEJABXWrLmr4mewEF"
}
```

## Step 2: Register a flow agent that will run the ConnectorTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

Suppose the Lambda function will return such response
```json
{
  "result": 10
}
```
Need to set `response_filter` to retrieve the result `10` with json path `$.result`.

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Demo agent of Lambda connector",
  "type": "flow",
  "description": "This is a demo agent",
  "app_type": "demo",
  "tools": [
    {
      "type": "ConnectorTool",
      "name": "lambda_function",
      "parameters": {
        "connector_id": "YOUR CONNECTOR ID",
        "response_filter": "$.result"
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
  "agent_id": "az1XEJABXWrLmr4miAFj"
}
```

## Step 3: Run the agent


Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "number1": 2,
    "number2": 3
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the index information:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": 5
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`connector_id` | String | Required | A connector which has execute action.
`response_filter` | String | Optional | A json path to retrieve target result.

## Execute parameters

You can use any parameter defined in your connector `execute` action `request_body`.