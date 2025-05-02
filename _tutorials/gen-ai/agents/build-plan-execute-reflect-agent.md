---
layout: default
title: Building a plan, execute and reflect agent
parent: Agentic AI
grand_parent: Generative AI
nav_order: 10
---

# Building a Plan, Execute and Reflect agent

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/3745).    
{: .warning}

This tutorial describes how to build and use a plan, execute and reflect agent. This agent can be used to solve complex problems that benefit from multi-step execution and reasoning. In this example, we will ask the agent to analyze flight data in our OpenSearch index. For more information about agents, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/).

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisite

Log in to the OpenSearch Dashboards home page, select **Add sample data** and add the **Sample Flight data**. 

## Step 1: Prepare an LLM

This tutorial uses the [Amazon Bedrock Claude model](https://aws.amazon.com/bedrock/claude/), specifically the 3.7-sonnet model. You can also use other LLMs.

For more information, see
- [Using other LLMs](#Using-other-LLMs).
- [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

Create a connector for the model:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "BedRock Claude 3.7-sonnet connectr",
    "description": "Connector to BedRock service for claude model",
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

As the agent is a long-running agent that executes multiple steps, it is highly recommend to setup retries for your model. For more details, see [Connector Client Config]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters)

Example:
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

`-1` implies no limit on retries.

### Step 2: Create an agent

Create an agent of `plan_execute_and_reflect` type.

The agent is configured with the following information:

- Meta information: `name`, `type`, `description`.
- LLM information: The agent uses an LLM to reason, come up with a plan for completing the task, execute the steps with appropriate tools, and reflect on the intermediate results to optimize the plan.
- Tools: A tool is a function that can be executed by the agent. Each tool can define its own `name`, `description`, `parameters` and `attributes`.
- Memory: Stores chat messages. Currently, OpenSearch only supports one memory type: `conversation_index`.

The agent contains the following parameters:

- `app_type`: Specify this parameter for reference purposes in order to differentiate between multiple agents.
- `llm`: Defines the LLM configuration.
    - `model_id`: Model to be used for this agent.
    - `parameters`: Additional configuration for the model.
- `parameters`: Agent parameters. It can be used to control the `max_steps` executed by the agent, modify default prompts, etc.
    - `llm_interface`: Defines default parameters for the model to be used for function calling and path to the llm response. This is required as each LLM can return the response in it's own format. Currently, OpenSearch supports defaults for 3 models:
        - `bedrock/converse/claude`: For bedrock converse claude models.
        - `openai/v1/chat/completions`: For OpenAI chat completion models.
        - `bedrock/converse/deepseek_r1`: For bedrock converse deepseek models. 
    Since the `llm_interface` only sets defines defaults. You can setup function calling for any model by populating the internal `parameters`. For more information, please see [Function Calling Defaults](#Function-calling-defaults)
    - `max_steps`: Control the max number of steps executed by the agent.
    - `executor_agent_id`: This agent internally uses a `conversational` agent to execute each step. An executor agent is created by default using the same model. However, you can create and pass your own agent via this field. This can be useful if you wish to use different models for planning and execution.
- `memory`: Defines how to store messages. Currently, OpenSearch only supports the `conversation_index` memory, which stores messages in a memory index.
- Tools: 
   - An LLM will reason to decide which tool to run and will prepare the tool's input. 
   - By default, the tool's `name` is the same as the tool's `type`, and each tool has a default description. You can override the tool's `name` and `description`.
   - Each tool in the `tools` list must have a unique name. Each tool has a custom description so that the LLM can easily understand what the tool does.
   - Each tool must be accompanied by an `attributes` field used to define the expected `input_schema` of the tool. 
   
   For more information about tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

This example request configures several sample tools in an agent. You can configure other tools that are relevant to your use case as needed.
{: .note}

Register the agent:

In this example, we will only be using the `ListIndexTool`, `SearchIndexTool` and `IndexMappingTool`.

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

If you wish to use other tools, make sure to provide the `attributes` field for the tool. This is crucial as attributes is used to inform the LLM of the expected input schema for executing the tool.

Note: `ListIndexTool`, `SearchIndexTool`, `IndexMappingTool` and `WebSearchTool` already come with pre-defined attributes.

Example attributes for the `ListIndexTool`:
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

## Test the agent

Note the following testing tips:
- To view the detailed steps of agent execution, use the GET Trace API: `GET _plugins/_ml/memory/message/your_message_id/traces`
- An LLM may hallucinate. It may choose the wrong tool to solve your problem, especially when you have configured many tools. To avoid hallucinations, try the following options:
   - Avoid configuring many tools in an agent.
   - Provide a detailed tool description clarifying what the tool can do.
   - Ensure that the necessary tools to complete the task are provided to the agent.
   - Provide some context about your cluster with your task, for example, `Can you identify the error in my cluster by analyzing the "spans" and "logs" index.
- It is highly recommended to setup retries for your LLM. See [Connector Client Config]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters)

Test the agent:

As this agent is a long-running agent, it is highly recommended to provide `async` request parameter during execution to avoid timeouts. Providing this parameter executes the agent asynchronously within a task. For more information, see [Execute Agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent.md)

```json
POST _plugins/_ml/agents/your_agent_id/_execute?async=true
{
  "parameters": {
    "question": "How many flights from Beijing to Seattle?"
  }
}
```
{% include copy-curl.html %}

Note the task ID and memory ID; you'll need it to view the result

Query the task index to check execution status:

```json
GET _plugins/_ml/tasks/your_task_id
```
{% include copy-curl.html %}

Example response once the task is completed:
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

Let's understand the output:
- `memory_id`: Contains the messages between the plan_execute_and_reflect agent and the LLM
- `parent_interaction_id`: Contains the message_id that was the parent of all messages
- `executor_agent_memory_id`: Contains the messages between the executor agent and the LLM
- `executor_agent_parent_interaction_id`: Contains the message_id that was the parent message in the executor agent
- `response`: Contains the final result of the Agent

Query the memory index to fetch messages:
```json
GET _plugins/_ml/memory/your_memory_id/messages
```
{% include copy-curl.html %}



Note the message ID to fetch traces:
```json
GET /_plugins/_ml/memory/message/your_message_id/traces
```
{% include copy-curl.html %}

For more information, obtain trace data by calling the [Get Message Traces API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message-traces/)

#### Test conversational memory

To continue the same conversation, specify the conversation's `memory_id` when executing the agent. Previous messages are extracted and provided as context to the model.
Note: Use `memory_id` of the planner agent to continue a conversation. 
```json
POST _plugins/_ml/agents/your_agent_id/_execute?async=true
{
  "parameters": {
    "question": "your_question",
    "memory_id": "your_memory_id",
  }
}
```

## Step 4 (Optional): Create agent with custom prompts

Default prompts for the Plan, Execute and Reflect Agent. These can be modified by providing the prompts during agent registration as part of parameters or modifed on the fly during the agent execution. 

Planner Prompt Template: Template used to ask the LLM to come up with a plan for the given task
```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n ${parameters.plan_execute_reflect_response_format}
```

Planner Prompt: Prompt used to ask the LLM to come up with a plan
```json
For the given objective, come up with a simple step by step plan. This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps. The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps. At all costs, do not execute the steps. You will be told when to execute the steps.
```

Planner Prompt With History Template: Template used when `memory_id` is provided with the execution to provide the LLM context about the previous task. 
```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n\n You have currently executed the following steps: \n[${parameters.completed_steps}] \n\n \n ${parameters.plan_execute_reflect_response_format}
```

Reflection Prompt Template: Template used to ask the LLM to rethink the original plan based on completed steps
```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n Original plan:\n [${parameters.steps}] \n You have currently executed the following steps: \n [${parameters.completed_steps}] \n ${parameters.reflect_prompt} \n ${parameters.plan_execute_reflect_response_format}
```

Reflection Prompt: Prompt used to ask the LLM to rethink the original plan
```json
Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that. Otherwise, fill out the plan. Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan. Please follow the below response format
```

Planner System Prompt:
```json
You are part of an OpenSearch cluster. When you deliver your final result, include a comprehensive report. This report MUST:\n1. List every analysis or step you performed.\n2. Summarize the inputs, methods, tools, and data used at each step.\n3. Include key findings from all intermediate steps — do NOT omit them.\n4. Clearly explain how the steps led to your final conclusion.\n5. Return the full analysis and conclusion in the 'result' field, even if some of this was mentioned earlier.\n\nThe final response should be fully self-contained and detailed, allowing a user to understand the full investigation without needing to reference prior messages. Always respond in JSON format.
```

Executor System Prompt:
```json
You are a dedicated helper agent working as part of a plan‑execute‑reflect framework. Your role is to receive a discrete task, execute all necessary internal reasoning or tool calls, and return a single, final response that fully addresses the task. You must never return an empty response. If you are unable to complete the task or retrieve meaningful information, you must respond with a clear explanation of the issue or what was missing. Under no circumstances should you end your reply with a question or ask for more information. If you search any index, always include the raw documents in the final result instead of summarizing the content. This is critical to give visibility into what the query retrieved.
```

It is recommended to never modify ${parameters.plan_execute_reflect_response_format} and to always include it towards the end of your prompt templates.

To modify the prompts, simply provide them during agent registration:
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
    "_llm_interface": "bedrock/converse/claude",
    "planner_prompt_template": "your_planner_prompt_template",
    "planner_prompt": "your_planner_prompt",
    "reflect_prompt_template": "your_reflect_prompt_template",
    "reflect_prompt": "your_reflect_prompt",
    "planner_with_history_template": "your_planner_with_history_template",
    "system_prompt": "your_planner_system_prompt",
    "executor_system_prompt": "your_executor_system_prompt"
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

You can also modify the prompts during agent execution:
```json
POST _plugins/_ml/agents/your_agent_id/_execute?async=true
{
  "parameters": {
    "question": "How many flights from Beijing to Seattle?",
    "planner_prompt_template": "your_planner_prompt_template",
    "planner_prompt": "your_planner_prompt"
  }
}
```

## Using other LLMs

In order to use other models for this agent, modify the connector body and `llm_interface` field during agent registration appropriately. Rest of the steps remain the same.

To configure OpenAI GPT-4o Model: 
```json
POST /_plugins/_ml/connectors/_create
{
    "name": "My openai connector: gpt-4",
    "description": "The connector to openai chat model",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "model": "gpt-4o"
    },
    "credential": {
        "openAI_key": "your_open_ai_key"
    },
    "actions": [
        {
        "action_type": "predict",
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "headers": {
            "Authorization": "Bearer ${credential.openAI_key}"
        },
        "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}${parameters._interactions:-}]${parameters.tool_configs:-} }"
        }
    ]
}
```
{% include copy-curl.html %}

Note down the connector ID and use it to register the model. 
Use `openai/v1/chat/completions` for `llm_interface` during agent registration.

To configure Bedrock DeepSeek R1:
```json
POST /_plugins/_ml/connectors/_create
{
    "name": "My DeepSeek R1 connector",
    "description": "my test connector",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
        "region": "your_region",
        "service_name": "bedrock",
        "model": "us.deepseek.r1-v1:0"
    },
    "credential": {
        "access_key": "your_access_key",
        "secret_key": "your_secret_key",
        "session_token": "your_session_token"
    },
    "actions": [
        {
        "action_type": "predict",
        "method": "POST",
        "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
        "headers": {
            "content-type": "application/json"
        },
        "request_body": "{ \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": [${parameters._chat_history:-}{\"role\":\"user\",\"content\":[{\"text\":\"${parameters.prompt}\"}]}${parameters._interactions:-}] }"
        }
    ]
}
```
{% include copy-curl.html %}

Note down the connector ID and use it to register the model. 
Use `bedrock/converse/deepseek_r1` for `llm_interface` during agent registration.

Since bedrock deepseek_r1 lacks default function calling support, provide the following as a `executor_system_prompt` during agent registration:

```json
"You are a helpful assistant. You can ask Human to use tools to look up information that may be helpful in answering the users original question. The tools the human can use are:\n[${parameters._tools.toString()}]\n\nIf need to use tool, return which tool should be used and the input to user is enough. User will run the tool to get information. To make it easier for user to parse the response to know whether they should invoke a tool or not, please also return \"stop_reason\", it only return one of two enum values: [end_turn, tool_use], add a random tool call id to differenciate in case same tool invoked multiple times. Tool call id follow this pattern \"tool_use_<random string>\". The random string should be some UUID.\n\nFor example, you should return a json like this if need to use tool:\n{\"stop_reason\": \"tool_use\", \"tool_calls\": [{\"id\":\"tool_use_IIHBxMgOTjGb6ascCiOILg\",tool_name\":\"search_opensearch_index\",\"input\": {\"index\":\"population_data\",\"query\":{\"query\":{\"match\":{\"city\":\"New York City\"}}}}}]}\n\nIf don't need to use tool, return a json like this:\n{\"stop_reason\": \"end_turn\", \"message\": {\"role\":\"user\",\"content\":[{\"text\":\"What is the most popular song on WZPZ?\"}]}}\n\nNOTE: Don't wrap response in markdown ```json<response>```. For example don't return ```json\\n{\"stop_reason\": \"end_turn\", \"message\": {\"role\":\"user\",\"content\":[{\"text\":\"What is the most popular song on WZPZ?\"}]}}```\n"
```
{% include copy-curl.html %}