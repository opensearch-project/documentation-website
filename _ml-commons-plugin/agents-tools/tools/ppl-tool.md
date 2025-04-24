---
layout: default
title: PPL tool
has_children: false
has_toc: false
nav_order: 60
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/agents-tools/tools/ppl-tool/
---

# PPL tool
**Introduced 2.13**
{: .label .label-purple }

The `PPLTool` translates natural language into a PPL query. The tool provides an `execute` flag to specify whether to run the query. If you set the flag to `true`, the `PPLTool` runs the query and returns the query and the results. 

## Prerequisite

To create a PPL tool, you need a fine-tuned model that translates natural language into PPL queries. Alternatively, you can use large language models for prompt-based translation. The PPL tool supports the Anthropic Claude and OpenAI models.

## Step 1: Create a connector for a model

The following example request creates a connector for a model hosted on Amazon SageMaker:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "sagemaker: t2ppl",
  "description": "Test connector for Sagemaker t2ppl model",
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

For information about connecting to an Anthropic Claude model or OpenAI models, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). 

## Step 2: Register and deploy the model 

To register and deploy the model to OpenSearch, send the following request, providing the connector ID from the previous step:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-inference",
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

<!-- vale off -->
## Step 3: Register a flow agent that will run the PPLTool
<!-- vale on -->

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, providing the model ID in the `model_id` parameter. To run the generated query, set `execute` to `true`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_PPL",
  "type": "flow",
  "description": "this is a test agent",
  "memory": {
    "type": "demo"
  },
  "tools": [
    {
      "type": "PPLTool",
      "name": "TransferQuestionToPPLAndExecuteTool",
      "description": "Use this tool to transfer natural language to generate PPL and execute PPL to query inside. Use this tool after you know the index name, otherwise, call IndexRoutingTool first. The input parameters are: {index:IndexName, question:UserQuestion}",
      "parameters": {
        "model_id": "h5AUWo0BkIylWTeYT4SU",
        "model_type": "FINETUNE",
        "execute": true
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

Before you run the agent, make sure that you add the sample OpenSearch Dashboards `Sample web logs` dataset. To learn more, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart#adding-sample-data).

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "verbose": true,
    "question": "what is the error rate yesterday",
    "index": "opensearch_dashboards_sample_data_logs"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the PPL query and the query results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result":"{\"ppl\":\"source\=opensearch_dashboards_sample_data_logs| where timestamp \> DATE_SUB(NOW(), INTERVAL 1 DAY) AND timestamp \< NOW() | eval is_error\=IF(response\=\'200\', 0, 1.0) | stats AVG(is_error) as error_rate\",\"executionResult\":\"{\\n  \\\"schema\\\": [\\n    {\\n      \\\"name\\\": \\\"error_rate\\\",\\n      \\\"type\\\": \\\"double\\\"\\n    }\\n  ],\\n  \\\"datarows\\\": [\\n    [\\n      null\\n    ]\\n  ],\\n  \\\"total\\\": 1,\\n  \\\"size\\\": 1\\n}\"}"
        }
      ]
    }
  ]
}
```

If you set `execute` to `false`, OpenSearch only returns the query but does not run it:

```json
{
  "inference_results": [
    {
      "output": [
        {
            "name": "response",
            "result": "source=opensearch_dashboards_sample_data_logs| where timestamp > DATE_SUB(NOW(), INTERVAL 1 DAY) AND timestamp < NOW() | eval is_error=IF(response='200', 0, 1.0) | stats AVG(is_error) as error_rate"
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
`model_id` | String | Required | The model ID of the large language model (LLM) to use for translating text into a PPL query.
`model_type` | String | Optional | The model type. Valid values are `CLAUDE` (Anthropic Claude model), `OPENAI` (OpenAI models), and `FINETUNE` (custom fine-tuned model). 
`prompt` | String | Optional | The prompt to provide to the LLM.
`execute` | Boolean | Optional | Specifies whether to run the PPL query. Default is `true`.
`input` | Object | Optional | Contains two parameters that specify the index to search and the question for the LLM. For example, `"input": "{\"index\": \"${parameters.index}\", \"question\": ${parameters.question} }"`.
`head` | Integer | Optional | Limits the number of returned execution results if `execute` is set to `true`. Default is `-1` (no limit).

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`index` | String | Required | The index on which to run the PPL query.
`question` | String | Required | The natural language question to send to the LLM. 
`verbose` | Boolean | Optional | Whether to provide verbose output. Default is `false`.