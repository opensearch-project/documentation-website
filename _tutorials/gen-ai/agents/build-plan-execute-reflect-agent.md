---
layout: default
title: Building a plan-execute-reflect agent
parent: Agentic AI
grand_parent: Generative AI
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/
---

# Building a plan-execute-reflect agent

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/3745).    
{: .warning}

This tutorial describes how to build and use a _plan-execute-reflect_ agent. This agent can be used to solve complex problems that benefit from multi-step execution and reasoning. In this example, you will ask the agent to analyze flight data in your OpenSearch index. For more information about this agent, see [Plan-execute-reflect agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/).

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisite

Log in to the OpenSearch Dashboards home page, select **Add sample data**, and add the **Sample Flight data**. 

## Step 1: Prepare an LLM

A plan-execute-reflect agent requires a large language model (LLM) in order to function. This tutorial uses the [Anthropic Claude 3.7 model hosted on Amazon Bedrock](https://aws.amazon.com/bedrock/claude/). You can also [use other supported LLMs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/#supported-llms).

### Step 1(a): Create a connector

Create a connector for the model:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Amazon Bedrock Claude 3.7-sonnet connector",
    "description": "Connector to Amazon Bedrock service for the Claude model",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
      "region": "your_aws_region",
      "service_name": "bedrock",
      "model": "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
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
        "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
        "headers": {
          "content-type": "application/json"
        },
        "request_body": "{ \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": [${parameters._chat_history:-}{\"role\":\"user\",\"content\":[{\"text\":\"${parameters.prompt}\"}]}${parameters._interactions:-}]${parameters.tool_configs:-} }"
      }
    ]
}
```
{% include copy-curl.html %}

Note the connector ID; you'll use it to register the model.

### Step 1(b): Register the model

Register the model:

```json
POST /_plugins/_ml/models/_register
{
    "name": "Bedrock Claude Sonnet model",
    "function_name": "remote",
    "description": "Bedrock Claude 3.7 sonnet model for Plan, Execute and Reflect Agent",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID; you'll use it in the following steps.

### Step 1(c): Configure a retry policy

Because the agent is a long-running agent that executes multiple steps, we strongly recommend configuring a retry policy for your model. For more information, see the `client_config` parameter in [Configuration parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters). For example, to configure unlimited retries, set `max_retry_times` to `-1`:

```json
PUT /_plugins/_ml/models/your_model_id
{
  "connector": {
    "client_config": {
      "max_retry_times": -1,
      "retry_backoff_millis": 300,
      "retry_backoff_policy": "exponential_full_jitter"
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Create an agent

Create a `plan_execute_and_reflect` agent configured with the following information:

- Meta information: `name`, `type`, `description`.
- LLM information: The agent uses an LLM to reason, devise a plan for completing the task, execute the steps in the plan using appropriate tools, and reflect on the intermediate results in order to optimize the plan.
- Tools: A tool is a function that can be executed by the agent. Each tool can define its own `name`, `description`, `parameters` and `attributes`.
- Memory: Stores chat messages. OpenSearch currently only supports one memory type: `conversation_index`.

For more information about all request fields, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#request-body-fields).

To register the agent, send the following request. In this example, you'll create an agent with the `ListIndexTool`, `SearchIndexTool`, and `IndexMappingTool`:

```json
POST _plugins/_ml/agents/_register
{
  "name": "My Plan Execute and Reflect agent with Claude 3.7",
  "type": "plan_execute_and_reflect",
  "description": "this is a test agent",
  "llm": {
    "model_id": "your_llm_model_id_from_step1",
    "parameters": {
      "prompt": "${parameters.question}"
  }},
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "bedrock/converse/claude"
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "SearchIndexTool"
    },
    {
      "type": "IndexMappingTool"
    }
  ],
}
```
{% include copy-curl.html %}

Note the agent ID; you'll use it in the next step.

You can configure other tools that are relevant to your use case as needed. To configure other tools, make sure to provide the `attributes` field for the tool. This is crucial because `attributes` are used to inform the LLM of the expected input schema for executing the tool.

`ListIndexTool`, `SearchIndexTool`, `IndexMappingTool`, and `WebSearchTool` contain predefined attributes. For example, the `ListIndexTool` provides the following attributes:

```json
tools: [{
    "type": "ListIndexTool",
    "attributes": {
        "input_schema": {
            "type": "object",
            "properties": {
                "indices": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "OpenSearch index name list, separated by comma. for example: [\"index1\", \"index2\"], use empty array [] to list all indices in the cluster"
                }
            },
        },
        "strict": false
    }
}]
```

### Test the agent

Use the following tips to test your `plan_execute_and_reflect` agent effectively:

- **Trace agent execution**: Use the Get Message Traces API to view detailed execution steps:
  ```http
  GET _plugins/_ml/memory/message/your_message_id/traces
  ```

- **Mitigate hallucinations**: An LLM may "hallucinate" by selecting the wrong tool or misinterpreting the task, especially if the agent is configured with too many tools. To avoid hallucinations, try the following options:
  - Limit the number of tools configured in an agent.
  - Provide clear, specific descriptions for each tool.
  - Ensure the agent has access to all necessary tools for the task.
  - Include relevant context about your cluster in the prompt; for example, `Can you identify the error in my cluster by analyzing the "spans" and "logs" indexes?`

- **Configure retries**: LLM calls can occasionally fail. Set up retries to improve reliability. For more information, see the `client_config` parameter in [Configuration parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters).

To test the agent, run it using the [Execute Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/). Because this agent performs long-running tasks, we recommend running it asynchronously to avoid timeouts. Use the `async=true` query parameter to run the agent as a separate task:

```json
POST _plugins/_ml/agents/your_agent_id/_execute?async=true
{
  "parameters": {
    "question": "How many flights from Beijing to Seattle?"
  }
}
```
{% include copy-curl.html %}

Note the `task_id` and `memory_id` in the response. You'll use these to track progress and view results.

Use the following request to check whether the task is still running or has completed:

```json
GET _plugins/_ml/tasks/your_task_id
```
{% include copy-curl.html %}

Once the task is completed, it returns a response from the agent:

```json
{
  "task_type": "AGENT_EXECUTION",
  "function_name": "AGENT",
  "state": "COMPLETED",
  "worker_node": [
    "q5yAqa75RM-rv0I67V1VVQ"
  ],
  "create_time": 1746148548710,
  "last_update_time": 1746148706345,
  "is_async": false,
  "response": {
    "memory_id": "bzWQjpYBKhItn1nNYHtu",
    "inference_results": [
      {
        "output": [
          {
            "result": "bzWQjpYBKhItn1nNYHtu",
            "name": "memory_id"
          },
          {
            "result": "cDWQjpYBKhItn1nNYHuS",
            "name": "parent_interaction_id"
          },
          {
            "result": "dTWQjpYBKhItn1nNbHsw",
            "name": "executor_agent_memory_id"
          },
          {
            "result": "YjWQjpYBKhItn1nN6oYk",
            "name": "executor_agent_parent_interaction_id"
          },
          {
            "name": "response",
            "dataAsMap": {
              "response": """# Comprehensive Analysis Report: Flights from Beijing to Seattle

## Executive Summary
After analyzing the OpenSearch sample flight dataset, I found that there are 0 direct flights from Beijing to Seattle in the dataset.

## Analysis Process

### Step 1: Identify Available Data Sources
I began by examining the indices available in the OpenSearch cluster to locate flight-related data. This search revealed one relevant index: `opensearch_dashboards_sample_data_flights`, which contains 13,059 flight records with comprehensive information including origin and destination cities, flight numbers, carriers, and other flight details.

### Step 2: Data Schema Analysis
I analyzed the index structure and confirmed it contains the necessary fields for this investigation, including:
- Origin/destination city names (`OriginCityName`, `DestCityName`) 
- Airport codes (`Origin`, `Dest`)
- Airport IDs (`OriginAirportID`, `DestAirportID`)
- Geographic information for origins and destinations

### Step 3: Query Construction and Execution
I created and executed a search query to find flights where:
- Origin city is Beijing (also checked for "Beijing Capital International Airport" and airport code "PEK")
- Destination city is Seattle (also checked for "Seattle Tacoma International Airport" and airport code "SEA")

### Step 4: Result Verification
To ensure the search was properly constructed, I verified that:
1. Flights from Beijing to other destinations exist in the dataset
2. Flights to Seattle from other origins exist in the dataset

This confirmed that both cities are represented in the data, but no flights connect them directly.

## Key Findings
- Beijing appears as an origin city in the dataset, with flights to destinations including Warsaw, Pittsburgh, Xi'an, Vienna, and Chicago/Rockford
- Seattle appears as both origin and destination in the dataset, with connections to cities like Vienna, Istanbul, New Orleans, St Louis, and Treviso
- The dataset contains 0 flights from Beijing to Seattle

## Conclusion
Based on a comprehensive search of the OpenSearch flight sample dataset, there are 0 flights from Beijing to Seattle in this dataset. While both cities appear in the dataset with connections to other locations, this specific route is not represented in the sample data."""
            }
          }
        ]
      }
    ]
  }
}
```

The agent execution response includes several key fields:

- `memory_id`: The ID of the memory that stores all messages exchanged between the `plan_execute_and_reflect` agent and the LLM.
- `parent_interaction_id`: The `message_id` of the parent message that initiated the conversation in the planning agent.
- `executor_agent_memory_id`: The ID of the memory that stores messages exchanged between the internal executor agent and the LLM.
- `executor_agent_parent_interaction_id`: The `message_id` of the parent message in the executor agent's conversation.
- `response`: The final result produced by the agent after all steps are executed.

When you execute a plan-execute-reflect agent asynchronously, the API returns the `memory_id` and the `parent_interaction_id` of the planner agent once the agent is started.

In the final response, the API also returns the `executor_agent_memory_id` and `executor_agent_parent_interaction_id`, which correspond to the internal executor agent responsible for carrying out each step of the plan. The `executor_agent_memory_id` and `executor_agent_parent_interaction_id` are updated in the task as soon as they are available, even before the agent has completed execution. This enables real-time tracking of the execution process.

To inspect the message history of the agent, use the Get Memory API:

```json
GET _plugins/_ml/memory/your_memory_id/messages
```
{% include copy-curl.html %}

For more information, see the [Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/).

Note the `message_id` of the relevant message and use it to fetch the step-by-step execution trace:

```json
GET _plugins/_ml/memory/message/your_message_id/traces
```
{% include copy-curl.html %}

For more information, see the [Get Message Traces API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message-traces/).

### Test conversational memory

To continue the same conversation, specify the conversation's `memory_id` when executing the agent. Previous messages are extracted and provided as context to the model. Use the `memory_id` of the planner agent to continue a conversation:

```json
POST _plugins/_ml/agents/your_agent_id/_execute?async=true
{
  "parameters": {
    "question": "your_question",
    "memory_id": "your_memory_id",
  }
}
```
{% include copy-curl.html %}

## Next steps

- For information about using other models, see [Supported LLMs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/#supported-llms).
- For information about creating agents with custom prompts, see [Modifying default prompts]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/#modifying-default-prompts).