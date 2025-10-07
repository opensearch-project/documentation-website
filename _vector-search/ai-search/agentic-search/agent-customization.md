---
layout: default
title: Customizing agents
parent: Agentic search
grand_parent: AI search
nav_order: 60
has_children: false
---

# Customizing agentic search agents

You can customize agentic search agents by configuring their models, tools, and prompts:

- [Model configurations](#model-configurations): Choose different LLMs optimized for various tasks.
- [Tool orchestration](#tool-orchestration): Combine multiple tools for automated workflows.
- [Prompt engineering](#prompt-engineering-and-customization): Finetune agent behavior using custom prompts.

## Model configurations

Select the appropriate language model based on your performance requirements and use case.

### OpenAI GPT models

The following OpenAI GPT models are supported.

#### GPT-5 (Recommended)

GPT-5 provides advanced reasoning capabilities and is recommended for production use cases.

**Model registration:**

```json
POST /_plugins/_ml/models/_register
{
    "name": "OpenAI GPT-5 Agent Model",
    "function_name": "remote",
    "description": "GPT-5 model for agentic search with advanced reasoning",
    "connector": {
        "name": "OpenAI GPT-5 Connector",
        "description": "Connector to OpenAI GPT-5 chat completions",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "model": "gpt-5"
        },
        "credential": {
            "openAI_key": "your-openai-api-key"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://api.openai.com/v1/chat/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.user_prompt}\"}${parameters._interactions:-}], \"reasoning_effort\":\"minimal\", \"tools\": [${parameters._tools:-}],\"parallel_tool_calls\":${parameters.parallel_tool_calls},\"tool_choice\": \"${parameters.tool_choice}\"}"
            }
        ]
    }
}
```
{% include copy-curl.html %}

**Reasoning modes:**

- `minimal` (recommended): Fastest response time, suitable for most use cases
- `low`: Slightly more reasoning, better for complex queries
- `medium`: Enhanced reasoning for sophisticated tasks
- `high`: Maximum reasoning power for the most complex scenarios

As you select higher reasoning modes, overall latency increases. Choose the lowest mode that meets your accuracy needs.
{: .tip}

### Anthropic Claude models

Anthropic Claude models are available through Amazon Bedrock integration and provide analytical capabilities for complex search scenarios.

#### Claude 4 Sonnet

**Bedrock connector setup:**

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Bedrock Claude 4 Sonnet Connector",
    "description": "Amazon Bedrock connector for Claude 4 Sonnet",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
        "region": "your-aws-region",
        "service_name": "bedrock",
        "model": "us.anthropic.claude-sonnet-4-20250514-v1:0"
    },
    "credential": {
        "access_key": "your-aws-access-key",
        "secret_key": "your-aws-secret-key",
        "session_token": "your-aws-session-token"
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

### Agent interface configuration

When registering agents, configure the `_llm_interface` parameter to specify how the agent parses LLM output when using function calling. Choose the interface that matches your model type:

- `"bedrock/converse/claude"`: Anthropic Claude models hosted on Amazon Bedrock
- `"openai/v1/chat/completions"`: OpenAI chat completion models

Each interface defines a default response schema and function call parser optimized for that model family.

## Tool orchestration

You must configure a QueryPlanningTool for agentic search. You can configure additional tools to extend your agent's functionality.

### QueryPlanningTool

The [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/) is required for agentic search functionality. It translates natural language queries into OpenSearch DSL.

### Additional tools

You can configure additional [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/) to extend your agent's functionality.

The conversational agent automatically selects and orchestrates the appropriate tools based on the query context.

#### Complete agent configuration

The following example shows how to register an agent with multiple tools:

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Advanced Agentic Search Agent",
    "type": "conversational",
    "description": "Multi-tool agentic search with index discovery and web integration",
    "llm": {
        "model_id": "your-conversational-model-id",
        "parameters": {
            "max_iteration": 15
        }
    },
    "memory": {
        "type": "conversation_index"
    },
    "parameters": {
        "_llm_interface": "openai/v1/chat/completions"
    },
    "tools": [
         {
            "type": "ListIndexTool",
            "name": "ListIndexTool"
        },
        {
            "type": "IndexMappingTool",
            "name": "IndexMappingTool"
        },
        {
            "type": "WebSearchTool",
            "name": "DuckduckgoWebSearchTool",
            "parameters": {
                "engine": "duckduckgo"
            }
        },
        {
            "type": "QueryPlanningTool",
            "parameters": {
                "model_id": "your-query-planner-model-id"
            }
        }
    ],
    "app_type": "os_chat"
}
```
{% include copy-curl.html %}

### Intelligent index selection

When you include a `ListIndexTool`, `IndexMappingTool`, or other relevant tools, your agent can automatically choose the correct index and generate queries for that index.

To search without specifying an index, send the following request:

```json
GET /_search?search_pipeline=agentic-pipeline
{
    "query": {
        "agentic": {
            "query_text": "Find products with high ratings and low prices"
        }
    }
}
```
{% include copy-curl.html %}

The agent automatically discovers product indexes, analyzes their structure, and generates appropriate queries.

If you don't specify an index in your search query, the search runs against all shards in the cluster, which can be expensive. For better performance, specify the target index when possible.
{: .tip}

## Prompt engineering and customization

Configure your agent's behavior and output format using custom prompts that guide the model's reasoning process.

### System prompt optimization

Customize your agent's behavior with tailored system prompts that fit for your specific use case.

### Agent output format

The agent must have the following output format:

```json
{
    "dsl_query": "<OpenSearch DSL Object>",
    "agent_steps_summary": "<chronological steps taken by the agent>"
}
```
{% include copy.html %}

**Custom prompt configuration:**

When customizing prompts, ensure that both your system and user prompts guide the model to always return results in the preceding agent output format. Proper prompt engineering is crucial for consistent output formatting.

Provide your custom prompts during agent registration as follows:

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Custom Prompt Agent",
    "type": "conversational",
    "description": "Agent with custom system and user prompts",
    "llm": {
        "model_id": "your-model-id",
        "parameters": {
            "max_iteration": 15,
            "system_prompt": "<YOUR CUSTOM SYSTEM PROMPT>",
            "user_prompt": "<YOUR CUSTOM USER PROMPT>"
        }
    },
    "memory": {
        "type": "conversation_index"
    },
    "parameters": {
        "_llm_interface": "openai/v1/chat/completions"
    },
    "tools": [
        {
            "type": "QueryPlanningTool",
            "parameters": {
                "model_id": "your-query-planner-model-id"
            }
        }
    ],
    "app_type": "os_chat"
}
```
{% include copy-curl.html %}

### Prompt best practices

Follow these guidelines to create effective prompts that produce consistent, accurate results:

- **Be specific**: Clearly define the expected agent output format with `dsl_query` and `agent_steps_summary` fields.
- **Include examples**: Provide sample queries and expected responses in the correct agent output format.
- **Set constraints**: Specify field names, data types, and query limits.
- **Optimize for JSON**: Ensure that your prompts guide the model to produce valid JSON with the required agent output structure.

### Default system prompt

The following system prompt is used by default. You can customize this to modify your agent's behavior:

<details open markdown="block">
  <summary>
    Prompt
  </summary>
  {: .text-delta}

```json
==== PURPOSE ====
Produce correct OpenSearch DSL by orchestrating tools. You MUST call the Query Planner Tool (query_planner_tool, "qpt") to author the DSL.
Your job: (a) gather only essential factual context, (b) compose a self-contained natural-language question for qpt, (c) validate coverage of qpt's DSL and iterate if needed, then (d) return a strict JSON result with the DSL and a brief step trace.

==== OUTPUT CONTRACT (STRICT) ====
Return ONLY a valid JSON object with exactly these keys:
{"dsl_query": <OpenSearch DSL Object>, "agent_steps_summary": "<chronological steps taken by the agent>"}
- No markdown, no extra text, no code fences. Double-quote all keys/strings.
- Escape quotes that appear inside values (including inside agent_steps_summary and inside the inlined qpt.question you report there).
- The output MUST parse as JSON.

==== OPERATING LOOP (QPT-CENTRIC) ====
1) PLAN (minimal): Identify the smallest set of facts truly required: entities, IDs/names, values, explicit time windows, disambiguations, definitions, normalized descriptors.
2) COLLECT (as needed): Use tools to fetch ONLY those facts. Do NOT mention schema fields, analyzers, or DSL constructs to the qpt.
3) SELECT index_name:
   - If provided by the caller, use it as-is.
   - Otherwise, discover and choose a single best index (e.g., list indices, inspect names/mappings) WITHOUT copying schema terms into qpt.question.
4) COMPOSE qpt.question: One concise, clear, self-contained natural-language question containing:
   - The user's request (no schema/DSL hints), and
   - The factual context you resolved (verbatim values, IDs, names, explicit date ranges, normalized descriptors).
   This question is the ONLY context (besides index_name) that qpt relies on.
5) CALL qpt with {question, index_name, embedding_model_id(if available)}.
6) VALIDATE qpt response and ensure it answers user's question else iterate by providing more context
7) FINALIZE when qpt produces a plausible, fully covered DSL.

==== CONTEXT RULES ====
- Use tools to resolve needed facts.
- When tools return user-specific values, RESTATE them verbatim in qpt.question in pure natural language.
- NEVER mention schema/field names, analyzers, or DSL constructs in qpt.question.
- Resolve ambiguous references BEFORE the final qpt call.

==== TRACE FORMAT (agent_steps_summary) ====
- First entry EXACTLY: "I have these tools available: [ToolA, ToolB, ...]"
- Then one entry per step:
  "First I used: <ToolName> — input: <short input>; context gained: <concise result>"
  "Second I used: …"
  …
  "N-th I used: query_planner_tool — qpt.question: <exact text with escaped quotes>; index_name_provided: <index-name>"
- Keep brief and factual. Do NOT restate the DSL. After the final qpt step you may add a short validation note.

==== FAILURE MODE ====
If required context is unavailable or qpt cannot produce a valid DSL
- Set "dsl_query" to {"query":{"match_all":{}}}
- Append a brief error note to agent_steps_summary, e.g., "error: missing relevant indices", "error: unresolved entity ID", "error: qpt failed to converge".

==== STYLE & SAFETY ====
- qpt.question must be purely natural-language and context-only.
- Be minimal and deterministic; avoid speculation.
- Use only the concise step summary.
- Always produce valid JSON per the contract.

==== END-TO-END EXAMPLE RUN (NON-EXECUTABLE, FOR SHAPE ONLY) ====
User question:
"Find shoes under 500 dollars. I am so excited for shoes yay!"

Process (brief):
- Index name not provided → use ListIndexTool to enumerate indices: "products", "machine-learning-training-data", …
- Choose "products" as most relevant for items/footwear.
- Confirm with IndexMappingTool that "products" index has expected data (do not copy schema terms into qpt.question).
- Compose qpt.question with natural-language constraints only.
- Call qpt and validate.

qpt.question (self-contained, no schema terms):
"Find shoes under 500 dollars."

qpt.output:
"{\"query\":{\"bool\":{\"must\":[{\"match\":{\"category\":\"shoes\"}}],\"filter\":[{\"range\":{\"price\":{\"lte\":500}}}]}}}"

Final response JSON:
{
  "dsl_query": {\"query\":{\"bool\":{\"must\":[{\"match\":{\"category\":\"shoes\"}}],\"filter\":[{\"range\":{\"price\":{\"lte\":500}}}]}}}},
  "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: ListIndexTool — input: \"\"; context gained: \"Of the available indices, products index seems promising\"\nSecond I used: IndexMappingTool — input: \"products\"; context gained: \"index contains relevant fields\"\nThird I used: query_planner_tool — qpt.question: \"Find shoes under 500 dollars.\"; index_name_provided: \"products\"\nValidation: qpt output is valid JSON and reflects the user request."
}
```

</details>

### Default user prompt

The default user prompt template passes the natural language question and available parameters to the agent:

```json
"NLQ is: ${parameters.question} and index_name is: ${parameters.index_name:-}, model ID for neural search is: ${parameters.embedding_model_id:-}"
```

## Next steps

For a complete walkthrough of using customized agents in practice, see [Inspecting agentic search and continuing conversations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/). 
