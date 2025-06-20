---
layout: default
title: Plan-execute-reflect agents
has_children: false
has_toc: false
nav_order: 40
parent: Agents
grand_parent: Agents and tools
---

# Plan-execute-reflect agents
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/3745).    
{: .warning}

Plan-execute-reflect agents are designed to solve complex tasks that require iterative reasoning and step-by-step execution. These agents use one large language model (LLM)---the _planner_---to create and update a plan and another LLM (or the same one by default) to execute each individual step using a built-in conversational agent.

A plan-execute-reflect agent works in three phases:

- **Planning** – The planner LLM generates an initial step-by-step plan using the available tools.
- **Execution** – Each step is executed sequentially using the conversational agent and the available tools.
- **Re-evaluation** – After executing each step, the planner LLM re-evaluates the plan using intermediate results. The LLM can adjust the plan dynamically to skip, add, or change steps based on new context.

Similarly to a conversational agent, the plan-execute-reflect agent stores the interaction between the LLM and the agent in a memory index. In the following example, the agent uses a `conversation_index` to persist the execution history, including the user's question, intermediate results, and final outputs.

The agent automatically selects the most appropriate tool for each step based on the tool descriptions and current context.

The agent currently supports re-evaluation only after each step. This allows the agent to dynamically adapt the plan based on intermediate results before proceeding to the next step.

## Tracking agent execution and memory

When you execute a plan-execute-reflect agent asynchronously using the [Agent Execute API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/), the API returns the `memory_id` of the planner agent as soon as the agent is started. This allows you to immediately begin tracking the conversation and planning process.

In the final response, the API also returns the `executor_agent_memory_id` and `executor_agent_parent_interaction_id`, which correspond to the internal executor agent responsible for carrying out each step of the plan. These IDs allow you to inspect the detailed execution history and results for each step.

**Starting from version 3.1**, the `executor_agent_memory_id` and `executor_agent_parent_interaction_id` will be updated in the task as soon as they are available, even before the agent has completed execution. This enables real-time tracking of the execution process as it progresses.

For a concrete example of how these IDs are returned and used, see the [Building a plan-execute-reflect agent tutorial]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/#test-the-agent).

For more details about memory, see the [memory documentation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/).

## Creating a plan-execute-reflect agent

The following example request creates a plan-execute-reflect agent with three tools:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My Plan Execute Reflect Agent",
  "type": "plan_execute_and_reflect",
  "description": "Agent for dynamic task planning and reasoning",
  "llm": {
    "model_id": "YOUR_LLM_MODEL_ID",
    "parameters": {
      "prompt": "${parameters.question}"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "YOUR_LLM_INTERFACE"
  },
  "tools": [
    { "type": "ListIndexTool" },
    { "type": "SearchIndexTool" },
    { "type": "IndexMappingTool" }
  ],
  "app_type": "os_chat"
}
```

It is important to provide thorough descriptions of the tools so that the LLM can decide in which situations to use those tools.
{: .tip}

For more information about the Register Agent API request fields, see [Request body fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#request-body-fields).

## Supported LLMs

The plan-execute-reflect agent provides built-in function calling interfaces for the following LLMs:

- [Anthropic Claude 3.7 model hosted on Amazon Bedrock](https://aws.amazon.com/bedrock/claude/)
- OpenAI GPT-4o model
- DeepSeek-R1 model hosted on Amazon Bedrock

To request default support for an LLM, [create a feature request issue in the ML Commons repository](https://github.com/opensearch-project/ml-commons/issues).

For a step-by-step tutorial on using a plan-execute-reflect agent, see [Building a plan-execute-reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/).

To configure a plan-execute-reflect agent with a particular model, you need to modify the connector in [Step 1(a): Create a connector]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/#step-1a-create-a-connector) and provide a model-specific `llm_interface` parameter in [Step 2: Create an agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/#step-2-create-an-agent): 

```json
"parameters": {
  "_llm_interface": "bedrock/converse/claude"
}
```

For valid values of the `_llm_interface` field, see [Request body fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#request-body-fields).

The following examples provide the connector and agent creation requests for the supported models.

### Anthropic Claude on Amazon Bedrock

To create a connector for the Anthropic Claude 3.7 Sonnet model hosted on Amazon Bedrock, use the following request:

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

To create a plan-execute-reflect agent with the Anthropic Claude 3.7 Sonnet model, use the following request:

```json
POST _plugins/_ml/agents/_register
{
  "name": "My Plan Execute and Reflect agent with Claude 3.7",
  "type": "plan_execute_and_reflect",
  "description": "this is a test agent",
  "llm": {
    "model_id": "your_llm_model_id",
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
  ]
}
```
{% include copy-curl.html %}

### OpenAI GPT-4o

To create a connector for an OpenAI GPT-4o model, use the following request: 

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

Then register the model and register an agent, specifying `openai/v1/chat/completions` in the `_llm_interface` field.

### Deepseek-R1 on Amazon Bedrock

To create a connector for a DeepSeek-R1 model hosted on Amazon Bedrock, use the following request:

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

Then register the model and register an agent, specifying `bedrock/converse/deepseek_r1` in the `_llm_interface` field.
 
Because the Deepseek-R1 model hosted on Amazon Bedrock lacks default function-calling support, provide the following prompt as an `executor_system_prompt` during agent registration:

```json
"You are a helpful assistant. You can ask Human to use tools to look up information that may be helpful in answering the users original question. The tools the human can use are:\n[${parameters._tools.toString()}]\n\nIf need to use tool, return which tool should be used and the input to user is enough. User will run the tool to get information. To make it easier for user to parse the response to know whether they should invoke a tool or not, please also return \"stop_reason\", it only return one of two enum values: [end_turn, tool_use], add a random tool call id to differenciate in case same tool invoked multiple times. Tool call id follow this pattern \"tool_use_<random string>\". The random string should be some UUID.\n\nFor example, you should return a json like this if need to use tool:\n{\"stop_reason\": \"tool_use\", \"tool_calls\": [{\"id\":\"tool_use_IIHBxMgOTjGb6ascCiOILg\",tool_name\":\"search_opensearch_index\",\"input\": {\"index\":\"population_data\",\"query\":{\"query\":{\"match\":{\"city\":\"New York City\"}}}}}]}\n\nIf don't need to use tool, return a json like this:\n{\"stop_reason\": \"end_turn\", \"message\": {\"role\":\"user\",\"content\":[{\"text\":\"What is the most popular song on WZPZ?\"}]}}\n\nNOTE: Don't wrap response in markdown ```json<response>```. For example don't return ```json\\n{\"stop_reason\": \"end_turn\", \"message\": {\"role\":\"user\",\"content\":[{\"text\":\"What is the most popular song on WZPZ?\"}]}}```\n"
```
{% include copy.html %}

## Default prompts

The plan-execute-reflect agent uses the following predefined prompts. You can customize the prompts by providing new ones in the following ways:

- During agent registration in the `parameters` object
- Dynamically during agent execution

### Planner template and prompt

To create a custom planner prompt template, modify the `planner_prompt_template` parameter.
The following template is used to ask the LLM to devise a plan for the given task:

```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n ${parameters.plan_execute_reflect_response_format}
```

To create a custom planner prompt, modify the `planner_prompt` parameter.
The following prompt is used to ask the LLM to devise a plan for the given task:

```
For the given objective, come up with a simple step by step plan. This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps. The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps. At all costs, do not execute the steps. You will be told when to execute the steps.
```

### Planner prompt with a history template

To create a custom planner prompt with a history template, modify the `planner_with_history_template` parameter.
The following template is used when `memory_id` is provided during agent execution to give the LLM context about the previous task:

```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n\n You have currently executed the following steps: \n[${parameters.completed_steps}] \n\n \n ${parameters.plan_execute_reflect_response_format}
```

### Reflection prompt and template

To create a custom reflection prompt template, modify the `reflect_prompt_template` parameter.
The following template is used to ask the LLM to rethink the original plan based on completed steps:

```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n Original plan:\n [${parameters.steps}] \n You have currently executed the following steps: \n [${parameters.completed_steps}] \n ${parameters.reflect_prompt} \n ${parameters.plan_execute_reflect_response_format}
```

To create a custom reflection prompt, modify the `reflect_prompt` parameter.
The following prompt is used to ask the LLM to rethink the original plan:

```
Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that. Otherwise, fill out the plan. Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan. Please follow the below response format
```

### Planner system prompt

To create a custom planner system prompt, modify the `system_prompt` parameter.
The following is the planner system prompt:

```
You are part of an OpenSearch cluster. When you deliver your final result, include a comprehensive report. This report MUST:\n1. List every analysis or step you performed.\n2. Summarize the inputs, methods, tools, and data used at each step.\n3. Include key findings from all intermediate steps — do NOT omit them.\n4. Clearly explain how the steps led to your final conclusion.\n5. Return the full analysis and conclusion in the 'result' field, even if some of this was mentioned earlier.\n\nThe final response should be fully self-contained and detailed, allowing a user to understand the full investigation without needing to reference prior messages. Always respond in JSON format.
```

### Executor system prompt

To create a custom executor system prompt, modify the `executor_system_prompt` parameter.
The following is the executor system prompt:

```
You are a dedicated helper agent working as part of a plan‑execute‑reflect framework. Your role is to receive a discrete task, execute all necessary internal reasoning or tool calls, and return a single, final response that fully addresses the task. You must never return an empty response. If you are unable to complete the task or retrieve meaningful information, you must respond with a clear explanation of the issue or what was missing. Under no circumstances should you end your reply with a question or ask for more information. If you search any index, always include the raw documents in the final result instead of summarizing the content. This is critical to give visibility into what the query retrieved.
```

We recommend never modifying `${parameters.plan_execute_reflect_response_format}` and always including it toward the end of your prompt templates.
{: .tip}

## Modifying default prompts

To modify the prompts, provide them during agent registration:

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For a step-by-step tutorial on using a plan-execute-reflect agent, see [Building a plan-execute-reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).