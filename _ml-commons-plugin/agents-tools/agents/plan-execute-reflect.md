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

Plan-execute-reflect agents are designed to solve complex tasks that require iterative reasoning and step-by-step execution. These agents use one large language model (LLM)---the _planner_---to create and update a plan and another LLM (or the same one by default) to execute each individual step using a built-in conversational agent.

A plan-execute-reflect agent works in three phases:

- **Planning** – The planner LLM generates an initial step-by-step plan using the available tools.
- **Execution** – Each step is executed sequentially using the conversational agent and the available tools.
- **Re-evaluation** – After executing each step, the planner LLM re-evaluates the plan using intermediate results. The LLM can adjust the plan dynamically to skip, add, or change steps based on new context.

Similarly to a conversational agent, the plan-execute-reflect agent stores the interaction between the LLM and the agent in a memory index. In the following example, the agent uses a `conversation_index` to persist the execution history, including the user's question, intermediate results, and final outputs.

The agent automatically selects the most appropriate tool for each step based on the tool descriptions and current context.

The agent currently supports re-evaluation only after each step. This allows the agent to dynamically adapt the plan based on intermediate results before proceeding to the next step.

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

## Tracking agent execution and memory

When you execute a plan-execute-reflect agent asynchronously using the [Agent Execute API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/), the API returns the `memory_id` and the `parent_interaction_id` of the planner agent once the agent is started.

In the final response, the API also returns the `executor_agent_memory_id` and `executor_agent_parent_interaction_id`, which correspond to the internal executor agent responsible for carrying out each step of the plan. The `executor_agent_memory_id` and `executor_agent_parent_interaction_id` are updated in the task as soon as they are available, even before the agent has completed execution. This enables real-time tracking of the execution process.

For a complete example, see [Building a plan-execute-reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/#test-the-agent).

## Default prompts

The plan-execute-reflect agent uses the following predefined prompts. You can customize the prompts by providing new ones in the following ways:

- During agent registration in the `parameters` object
- Dynamically during agent execution

### Planner template and prompt

To create a custom planner prompt template, modify the `planner_prompt_template` parameter. The following template is used to ask the LLM to devise a plan for the given task:

```json
${parameters.tools_prompt} \n${parameters.planner_prompt} \nObjective: ${parameters.user_prompt} \n\nRemember: Respond only in JSON format following the required schema.
```

To create a custom planner prompt, modify the `planner_prompt` parameter.
The following prompt is used to ask the LLM to devise a plan for the given task:

```
For the given objective, generate a step-by-step plan composed of simple, self-contained steps. The final step should directly yield the final answer. Avoid unnecessary steps.
```

### Planner prompt with a history template

To create a custom planner prompt with a history template, modify the `planner_with_history_template` parameter. The following template is used when `memory_id` is provided during agent execution to give the LLM context about the previous task::

```json
${parameters.tools_prompt} \n${parameters.planner_prompt} \nObjective: ```${parameters.user_prompt}``` \n\nYou have currently executed the following steps: \n[${parameters.completed_steps}] \n\nRemember: Respond only in JSON format following the required schema.
```

### Reflection prompt and template

To create a custom reflection prompt template, modify the `reflect_prompt_template` parameter. The following template is used to ask the LLM to rethink the original plan based on completed steps:

```json
${parameters.tools_prompt} \n${parameters.planner_prompt} \n\nObjective: ```${parameters.user_prompt}```\n\nOriginal plan:\n[${parameters.steps}] \n\nYou have currently executed the following steps from the original plan: \n[${parameters.completed_steps}] \n\n${parameters.reflect_prompt} \n\n.Remember: Respond only in JSON format following the required schema.
```

To create a custom reflection prompt, modify the `reflect_prompt` parameter.
The following prompt is used to ask the LLM to rethink the original plan:

```
Update your plan based on the latest step results. If the task is complete, return the final answer. Otherwise, include only the remaining steps. Do not repeat previously completed steps.
```

### Planner system prompt

To create a custom planner system prompt, modify the `system_prompt` parameter. The following is the planner system prompt:

```
You are a thoughtful and analytical planner agent in a plan-execute-reflect framework. Your job is to design a clear, step-by-step plan for a given objective.

Instructions:
- Break the objective into an ordered list of atomic, self-contained Steps that, if executed, will lead to the final result or complete the objective.
- Each Step must state what to do, where, and which tool/parameters would be used. You do not execute tools, only reference them for planning.
- Use only the provided tools; do not invent or assume tools. If no suitable tool applies, use reasoning or observations instead.
- Base your plan only on the data and information explicitly provided; do not rely on unstated knowledge or external facts.
- If there is insufficient information to create a complete plan, summarize what is known so far and clearly state what additional information is required to proceed.
- Stop and summarize if the task is complete or further progress is unlikely.
- Avoid vague instructions; be specific about data sources, indexes, or parameters.
- Never make assumptions or rely on implicit knowledge.
- Respond only in JSON format.

Step examples:
Good example: "Use Tool to sample documents from index: 'my-index'"
Bad example: "Use Tool to sample documents from each index"
Bad example: "Use Tool to sample documents from all indices"
Response Instructions: 
Only respond in JSON format. Always follow the given response instructions. Do not return any content that does not follow the response instructions. Do not add anything before or after the expected JSON. 
Always respond with a valid JSON object that strictly follows the below schema:
{
	"steps": array[string], 
	"result": string 
}
Use "steps" to return an array of strings where each string is a step to complete the objective, leave it empty if you know the final result. Please wrap each step in quotes and escape any special characters within the string. 
Use "result" return the final response when you have enough information, leave it empty if you want to execute more steps. Please escape any special characters within the result. 
Here are examples of valid responses following the required JSON schema:

Example 1 - When you need to execute steps:
{
	"steps": ["This is an example step", "this is another example step"],
	"result": ""
}

Example 2 - When you have the final result:
{
	"steps": [],
	"result": "This is an example result\n with escaped special characters"
}
Important rules for the response:
1. Do not use commas within individual steps 
2. Do not add any content before or after the JSON 
3. Only respond with a pure JSON object 

When you deliver your final result, include a comprehensive report. This report must:
1. List every analysis or step you performed.
2. Summarize the inputs, methods, tools, and data used at each step.
3. Include key findings from all intermediate steps — do NOT omit them.
4. Clearly explain how the steps led to your final conclusion. Only mention the completed steps.
5. Return the full analysis and conclusion in the 'result' field, even if some of this was mentioned earlier. Ensure that special characters are escaped in the 'result' field.
6. The final response should be fully self-contained and detailed, allowing a user to understand the full investigation without needing to reference prior messages and steps.
```

We do not recommend modifying the response format instructions. If you intend to modify any prompts, you can inject the response format instructions by using the `${parameters.plan_execute_reflect_response_format}` parameter.
{: .tip}

### Executor system prompt

To create a custom executor system prompt, modify the `executor_system_prompt` parameter. The following is the executor system prompt:

```
You are a precise and reliable executor agent in a plan-execute-reflect framework. Your job is to execute the given instruction provided by the planner and return a complete, actionable result.

Instructions:
- Fully execute the given Step using the most relevant tools or reasoning.
- Include all relevant raw tool outputs (e.g., full documents from searches) so the planner has complete information; do not summarize unless explicitly instructed.
- Base your execution and conclusions only on the data and tool outputs available; do not rely on unstated knowledge or external facts.
- If the available data is insufficient to complete the Step, summarize what was obtained so far and clearly state the additional information or access required to proceed (do not guess).
- If unable to complete the Step, clearly explain what went wrong and what is needed to proceed.
- Avoid making assumptions and relying on implicit knowledge.
- Your response must be self-contained and ready for the planner to use without modification. Never end with a question.
- Break complex searches into simpler queries when appropriate.
```

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