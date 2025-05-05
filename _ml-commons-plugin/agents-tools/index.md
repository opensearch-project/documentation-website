---
layout: default
title: Agents and tools
has_children: true
has_toc: false
nav_order: 27
redirect_from:
  - /ml-commons-plugin/agents-tools/
---

# Agents and tools
**Introduced 2.13**
{: .label .label-purple }

You can automate machine learning (ML) tasks using agents and tools. An _agent_ orchestrates and runs ML models and tools. A _tool_ performs a set of specific tasks. Some examples of tools are the `VectorDBTool`, which supports vector search, and the `CATIndexTool`, which executes the `cat indices` operation. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

## Agents

An _agent_ is a coordinator that uses a large language model (LLM) to solve a problem. After the LLM reasons and decides what action to take, the agent coordinates the action execution. OpenSearch supports the following agent types:

- [_Flow agent_](#flow-agents): Runs tools sequentially, in the order specified in its configuration. The workflow of a flow agent is fixed. Useful for retrieval-augmented generation (RAG).
- [_Conversational flow agent_](#conversational-flow-agents): Runs tools sequentially, in the order specified in its configuration. The workflow of a conversational flow agent is fixed. Stores conversation history so that users can ask follow-up questions. Useful for creating a chatbot.
- [_Conversational agent_](#conversational-agents): Reasons in order to provide a response based on the available knowledge, including the LLM knowledge base and a set of tools provided to the LLM. The LLM reasons iteratively to decide what action to take until it obtains the final answer or reaches the iteration limit. Stores conversation history so that users can ask follow-up questions. The workflow of a conversational agent is variable, based on follow-up questions. For specific questions, uses the Chain-of-Thought (CoT) process to select the best tool from the configured tools for providing a response to the question. Useful for creating a chatbot that employs RAG.
- [_Plan, execute, and reflect agent_](#plan-execute-and-reflect-agents): Dynamically plans, executes, and refines multi-step workflows to solve complex tasks. Internally, a plan, execute, and reflect agent uses a conversational agent to execute each individual step in the plan. The agent automatically selects the most appropriate tool for each step based on tool descriptions and context. Ideal for long-running, exploratory processes that benefit from iterative reasoning and adaptive execution. Useful for conducting research or performing root-cause analysis (RCA).

## Flow agents

A flow agent is configured with a set of tools that it runs in order. For example, the following agent runs the `VectorDBTool` and then the `MLModelTool`. The agent coordinates the tools so that one tool's output can become another tool's input. In this example, the `VectorDBTool` queries the k-NN index and the agent passes its output `${parameters.VectorDBTool.output}` to the `MLModelTool` as context, along with the `${parameters.question}` (see the `prompt` parameter):

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": ["text"],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "YOUR_LLM_MODEL_ID",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer a question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say you don't know. \n\n Context:\n${parameters.VectorDBTool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```

## Conversational flow agents

Similarly to a flow agent, a conversational flow agent is configured with a set of tools that it runs in order. The difference between them is that a conversational flow agent stores the conversation in an index, in the following example, the `conversation_index`. The following agent runs the `VectorDBTool` and then the `MLModelTool`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "population data analysis agent",
  "type": "conversational_flow",
  "description": "This is a demo agent for population data analysis",
  "app_type": "rag",
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "VectorDBTool",
      "name": "population_knowledge_base",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "test_population_data",
        "embedding_field": "population_description_embedding",
        "source_field": [
          "population_description"
        ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "name": "bedrock_claude_model",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "YOUR_LLM_MODEL_ID",
        "prompt": """

Human:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. 

Context:
${parameters.population_knowledge_base.output:-}

${parameters.chat_history:-}

Human:${parameters.question}

Assistant:"""
      }
    }
  ]
}
```

## Conversational agents

Similarly to a conversational flow agent, a conversational agent stores the conversation in an index, in the following example, the `conversation_index`. A conversational agent can be configured with an LLM and a set of supplementary tools that perform specific jobs. For example, you can set up an LLM and a `CATIndexTool` when configuring an agent. When you send a question to the model, the agent also includes the `CATIndexTool` as context. The LLM then decides whether it needs to use the `CATIndexTool` to answer questions like "How many indexes are in my cluster?" The context allows an LLM to answer specific questions that are outside of its knowledge base. For example, the following agent is configured with an LLM and a `CATIndexTool` that retrieves information about your OpenSearch indexes:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ReAct_ClaudeV2",
  "type": "conversational",
  "description": "this is a test agent",
  "llm": {
    "model_id": "YOUR_LLM_MODEL_ID",
    "parameters": {
      "max_iteration": 5,
      "stop_when_no_tool_found": true,
      "response_filter": "$.completion"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "VectorDBTool",
      "name": "VectorDBTool",
      "description": "A tool to search opensearch index with natural language question. If you don't know answer for some question, you should always try to search data with this tool. Action Input: <natural language question>",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": [ "text" ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "CatIndexTool",
      "name": "RetrieveIndexMetaTool",
      "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
    }
  ],
  "app_type": "my app"
}
```

## Plan, execute, and reflect agents
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/3745).    
{: .warning}

Plan, execute, and reflect agents are designed for solving complex tasks that require iterative reasoning and step-by-step execution. These agents use one LLM (the _planner_) to create and update a plan and another LLM (or the same one by default) to execute each individual step using a built-in conversational agent.

A plan, execute, and reflect agent works in three phases:

- **Planning** – The planner LLM generates an initial step-by-step plan using the available tools.
- **Execution** – Each step is executed sequentially using the conversational agent and the available tools.
- **Re-evaluation** – After executing each step, the planner LLM re-evaluates the plan using intermediate results. The LLM can adjust the plan dynamically to skip, add, or change steps based on new context.

Similarly to a conversational agent, the plan, execute, and reflect agent stores the interaction between the LLM and the agent in a memory index. In the following example, the agent uses a `conversation_index` to persist the execution history, including the user's question, intermediate results, and final outputs.

The agent automatically selects the most appropriate tool for each step based on the tool descriptions and current context.

The agent currently supports re-evaluation only after each step. This allows the agent to dynamically adapt the plan based on intermediate results before proceeding to the next step.

The following example request creates a plan, execute, and reflect agent with three tools:

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

For a step-by-step tutorial on using a plan, execute, and reflect agent, see [Building a plan, execute, and reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/).

### Default prompts

The plan, execute, and reflect agent uses the following predefined prompts. You can modify the prompts by providing new ones in the following ways:

- During agent registration in the `parameters` object
- Dynamically during agent execution

#### Planner template and prompt 

The following template is used to ask the LLM to devise a plan for the given task:

```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n ${parameters.plan_execute_reflect_response_format}
```

The following prompt is used to ask the LLM to devise a plan for the given task:

```
For the given objective, come up with a simple step by step plan. This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps. The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps. At all costs, do not execute the steps. You will be told when to execute the steps.
```

#### Planner prompt with a history template

The following template is used when `memory_id` is provided during agent execution to give the LLM context about the previous task:

```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n\n You have currently executed the following steps: \n[${parameters.completed_steps}] \n\n \n ${parameters.plan_execute_reflect_response_format}
```

#### Reflection prompt and template

The following template is used to ask the LLM to rethink the original plan based on completed steps:

```json
${parameters.planner_prompt} \n Objective: ${parameters.user_prompt} \n Original plan:\n [${parameters.steps}] \n You have currently executed the following steps: \n [${parameters.completed_steps}] \n ${parameters.reflect_prompt} \n ${parameters.plan_execute_reflect_response_format}
```

The following prompt is used to ask the LLM to rethink the original plan:

```
Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that. Otherwise, fill out the plan. Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan. Please follow the below response format
```

#### Planner system prompt

The following is the planner system prompt:

```
You are part of an OpenSearch cluster. When you deliver your final result, include a comprehensive report. This report MUST:\n1. List every analysis or step you performed.\n2. Summarize the inputs, methods, tools, and data used at each step.\n3. Include key findings from all intermediate steps — do NOT omit them.\n4. Clearly explain how the steps led to your final conclusion.\n5. Return the full analysis and conclusion in the 'result' field, even if some of this was mentioned earlier.\n\nThe final response should be fully self-contained and detailed, allowing a user to understand the full investigation without needing to reference prior messages. Always respond in JSON format.
```

#### Executor system prompt

The following is the executor system prompt:

```
You are a dedicated helper agent working as part of a plan‑execute‑reflect framework. Your role is to receive a discrete task, execute all necessary internal reasoning or tool calls, and return a single, final response that fully addresses the task. You must never return an empty response. If you are unable to complete the task or retrieve meaningful information, you must respond with a clear explanation of the issue or what was missing. Under no circumstances should you end your reply with a question or ask for more information. If you search any index, always include the raw documents in the final result instead of summarizing the content. This is critical to give visibility into what the query retrieved.
```

We recommend never modifying `${parameters.plan_execute_reflect_response_format}` and always including it towards the end of your prompt templates.
{: .tip}

### Modifying default prompts

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
- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For a step-by-step tutorial on using a plan, execute, and reflect agent, see [Building a plan, execute, and reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/)
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).
