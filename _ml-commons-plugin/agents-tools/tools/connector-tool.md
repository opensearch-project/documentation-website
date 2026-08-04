---
layout: default
title: Connector tool
has_children: false
has_toc: false
nav_order: 20
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/connector-tool/
---

<!-- vale off -->
# Connector tool
**Introduced 2.15**
{: .label .label-purple }
<!-- vale on -->

The `ConnectorTool` uses a [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) to call any REST API function. For example, you can use a `ConnectorTool` to call a Lambda function through its REST API interface.

## Step 1: Register a connector with an execute action

The `ConnectorTool` can only run an `execute` action within a connector. Before you can create a `ConnectorTool`, you need to configure a connector and provide an `execute` action in the `actions` array. The `execute` action is used to invoke a function at a REST API endpoint. It is similar to the `predict` action, which is used to invoke a machine learning (ML) model. 

For this example, you'll create a connector for a simple AWS Lambda function that accepts two integers and returns their sum. This function is hosted on a dedicated endpoint with a specific URL, which you'll provide in the `url` parameter. For more information, see [Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html).

To create a connector, send the following request:

```json
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
{% include copy-curl.html %} 

OpenSearch responds with a connector ID:

```json
{
  "connector_id": "Zz1XEJABXWrLmr4mewEF"
}
```

## Step 2: Register a flow agent that will run the ConnectorTool

For this example, the Lambda function adds the two input numbers and returns their sum in the `result` field:

```json
{
  "result": 5
}
```

By default, the `ConnectorTool` expects the response from the Lambda function to contain a field named `response`. However, in this example the Lambda function response doesn't include a `response` field. To retrieve the result from the `result` field instead, you need to provide a `response_filter`, specifying the [JSON path](https://github.com/json-path/JsonPath) to the `result` field (`$.result`). Using the `response_filter`, the `ConnectorTool` will retrieve the result with the specified JSON path and return it in the `response` field.

To configure the Lambda function workflow, create a flow agent. A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, providing the connector ID from the previous step and a `response_filter`:

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

OpenSearch returns the output of the Lambda function execution. In the output, the field name is `response`, and the `result` field contains the Lambda function result:

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
`connector_id` | String | Required | A connector ID of a connector configured with an `execute` action that invokes an API.
`response_filter` | String | Optional | A [JSON path](https://github.com/json-path/JsonPath) to the response field that contains the result of invoking the API. If a `response_filter` is not specified, then the `ConnectorTool` expects the API response to be in a field named `response`.

## Execute parameters

When running the agent, you can define any parameter needed for the API call in the `request_body` of your connector's `execute` action. In this example, the parameters are `number1` and `number2`:

```json
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
```

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.