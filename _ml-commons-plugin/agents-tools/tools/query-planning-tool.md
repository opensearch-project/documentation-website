---
layout: default
title: Query Planning tool
has_children: false
has_toc: false
nav_order: 50
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Query Planning tool
plugins.ml_commons.agentic_search_enabled: true
{: .label .label-purple }
This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}
<!-- vale on -->

The `QueryPlanningTool` generates an OpenSearch Query DSL query string from a natural language question.

## Step 1: Enable the agentic search feature flag

To use the `QueryPlanningTool`, you must first enable the `agentic_search_enabled` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.ml_commons.agentic_search_enabled" : true
  }
}
```
{% include copy-curl.html %}

OpenSearch responds with an acknowledgment:

```json
{
  "acknowledged": true,
  "persistent": {
    "plugins": {
      "ml_commons": {
        "agentic_search_enabled": "true"
      }
    }
  },
  "transient": {}
}
```

## Step 2: Create a connector for a model

The following example request creates a connector for a model hosted on Amazon Bedrock:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Amazon Bedrock Claude 3.7-sonnet connector",
    "description": "connector for base agent with tools",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
      "region": "us-west-2",
      "service_name": "bedrock",
      "model": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
      "system_prompt":"please help answer the user question "
    },
    "credential": {
      "access_key": "<YOUR_ACCESS_KEY>",
      "secret_key": "<YOUR_SECRET_KEY>",
      "session_token": "<YOUR_SESSION_TOKEN>"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
        "headers": {
          "content-type": "application/json"
        },
        "request_body": "{ \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": [${parameters._chat_history:-}{\"role\":\"user\",\"content\":[{\"text\":\"${parameters.user_prompt}\"}]}${parameters._interactions:-}]${parameters.tool_configs:-} }"
      }
    ]
}
```
{% include copy-curl.html %}

OpenSearch responds with a connector ID:

```json
{
  "connector_id": "NtjQi5gBOh0h20Y9GBWK"
}
```

## Step 3: Register and deploy the model

To register and deploy the model to OpenSearch, send the following request, providing the connector ID from the previous step:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "agentic search base model",
    "function_name" : "remote",
    "connector_id": "NtjQi5gBOh0h20Y9GBWK"
}
```
{% include copy-curl.html %}

OpenSearch responds with a model ID:

```json
{
  "task_id": "O9jQi5gBOh0h20Y9ghVC",
  "status": "CREATED",
  "model_id": "PNjQi5gBOh0h20Y9ghVY"
}
```

## Step 4: Register a flow agent that will run the QueryPlanningTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, providing the model ID in the `model_id` parameter:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Agentic Search with Claude 3.7",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "QueryPlanningTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "PNjQi5gBOh0h20Y9ghVY",
        "response_filter": "$.output.message.content[0].text"
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
  "agent_id": "RNjQi5gBOh0h20Y9-RX1"
}
```

## Step 5: Run the agent

Run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/RNjQi5gBOh0h20Y9-RX1/_execute
{
    "parameters": {
        "user_prompt": "You are an OpenSearch Query DSL generation assistant, generate an OpenSearch Query DSL to retrieve the most relevant documents for the user provided natural language question: ${parameters.query_text}, please return the query dsl only, no other texts. Please don't use size:0, because that would limit the query to return no result. please return a query to find the most relevant documents related to users question. For example: {\"query\":{\"match\":{\"species\":\"setosa\"}}} \n",
        "query_text": "How many iris flowers of type setosa are there?"
    }
}
```
{% include copy-curl.html %}

OpenSearch returns the inference results, which include the generated Query DSL:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{'query':{'term':{'species':'setosa'}}}"
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
`model_id` | String | Required | The model ID of the large language model (LLM) to use for generating the Query DSL.
`response_filter` | String | Optional | A JSONPath expression to extract the generated query from the LLM's response.
`generation_type` | String | Optional | The type of query generation. Currently, only `llmGenerated` is supported. Defaults to `llmGenerated`.
`system_prompt` | String | Optional | A system prompt that provides high-level instructions to the LLM. Defaults to "You are an OpenSearch Query DSL generation assistant, translating natural language questions to OpenSeach DSL Queries".
`user_prompt` | String | Optional | A user prompt template for the LLM. It can contain placeholders for execution-time parameters like `${parameters.query_text}`.

## Execute parameters

The execution parameters for the `QueryPlanningTool` are flexible and depend on both the tool's configuration and the underlying language model's requirements as defined in its connector.

There are three layers of parameters to consider:

1.  **Connector Parameters**: When you create a connector, the `request_body` defines the JSON payload sent to the model. This payload can contain variables like `${parameters.prompt}` or `${parameters.user_prompt}`. The names of these variables depend on the specific model's API. The `QueryPlanningTool`'s purpose is to provide values for these variables.

2.  **Tool Parameters**: The `QueryPlanningTool` uses its own set of parameters, such as `user_prompt` and `system_prompt`, to construct the final string that will be passed to the connector. The tool takes the `user_prompt` string, resolves any variables within it, and the resulting string is then used to fill the appropriate variable (for example, `${parameters.user_prompt}`) in the connector's `request_body`.

3.  **Prompt Variables**: These are the variables inside the `user_prompt`, which have the format `${parameters.your_variable_name}`. These must be provided in the `_execute` API call. For example, if your `user_prompt` is `"Generate a query for: ${parameters.query_text}"`, then you must provide a `query_text` parameter when you run the agent.

In summary, the required parameters for an `_execute` call are the **Prompt Variables**. The tool's own parameters (like `user_prompt`) can be overridden at execution time to change how the final prompt is constructed.

For example, if you are using the default `user_prompt`, it contains the variable `${parameters.question}`. Therefore, `question` becomes a required execution parameter:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "question": "How many iris flowers of type setosa are there?"
  }
}
```

### Improving query accuracy

To help the language model generate more accurate Query DSL, you can provide additional context within the `user_prompt`. This context can include information like:

- Index mappings
- Relevant field names
- Sample documents or queries

You can pass this information by defining variables in your `user_prompt` and providing the corresponding values in the `parameters` of your `_execute` call.

**Example of an enriched `user_prompt`**

Here is an example of how you can structure a `user_prompt` to include an index mapping and guide the model to generate a more precise query:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
    "parameters": {
        "user_prompt": "You are an OpenSearch Query DSL generation expert. Use the following index mapping to inform your query: ${parameters.index_mapping}. Based on this mapping, generate a query for the user's question: ${parameters.question}. Only use fields mentioned in the mapping.",
        "question": "Find all movies directed by John Doe",
        "index_mapping": "{\"properties\":{\"title\":{\"type\":\"text\"},\"director\":{\"type\":\"keyword\"},\"year\":{\"type\":\"integer\"}}}"
    }
}
```

> **Note:** When passing complex JSON objects like an `index_mapping` as a parameter, ensure that the JSON string is properly escaped to be a valid single-line string within the parent JSON document.