---
layout: default
title: Agent customization
parent: Agentic search
grand_parent: AI search
nav_order: 60
has_children: false
---

# Agent customization

Transform your agentic search experience by customizing models, tools, and configurations. This guide shows you how to unlock advanced capabilities and tailor your agent to specific use cases.

## Overview

Agentic search agents can be customized in several ways to enhance their capabilities:

- **Model configurations**: Choose from different LLMs optimized for various tasks
- **Tool orchestration**: Combine multiple tools for intelligent automation
- **Prompt engineering**: Fine-tune agent behavior with custom prompts

## Model configurations

### OpenAI GPT models

#### GPT-5 (Recommended)

GPT-5 offers superior reasoning capabilities and is recommended for production use cases.

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

### Anthropic Claude models

Claude models provide excellent performance through Amazon Bedrock integration.

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

**Agent interface configuration:**

- Claude models: `"_llm_interface": "bedrock/converse/claude"`
- OpenAI models: `"_llm_interface": "openai/v1/chat/completions"`

## Tool orchestration

### Essential tools for intelligent search

#### QueryPlanningTool (Required)

The [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/) is mandatory for agentic search functionality. It translates natural language queries into OpenSearch DSL.

#### Additional tools

You can add any tools from the [ML Commons Tools documentation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/) to enhance your agent's capabilities. 

The conversational agent will automatically select and orchestrate the appropriate tools based on the query context.

**Complete agent configuration:**

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Advanced Agentic Search Agent",
    "type": "conversational",
    "description": "Multi-tool agentic search with index discovery and web integration",
    "llm": {
        "model_id": "your-conversational-model-id",
        "parameters": {
            "max_iteration": 15,
            "embedding_model_id": "your-embedding-model-id"
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

With `ListIndexTool`, `IndexMappingTool`, and other relevant tools, your agent can automatically choose the right index and generate queries for that index.

**Search without index specification:**

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

The agent will automatically discover product indices, analyze their structure, and generate appropriate queries.
**Performance consideration**: When you don't specify an index in your search query, the search runs against all shards in the cluster, which can be expensive. For better performance, specify the target index when possible.

## Prompt engineering and customization

### System prompt optimization

Customize your agent's behavior with tailored system prompts that fit for your specific use case.

**Default output format:**

```json
{
    "dsl_query": "<OpenSearch DSL Object>",
    "agent_steps_summary": "<chronological steps taken by the agent>"
}
```

**Custom prompt configuration:**

When customizing prompts, ensure your system and user prompts guide the model to always return results in the JSON format above. Proper prompt engineering is crucial for consistent output formatting.

Provide your custom prompts during agent registration like this:

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

- **Be specific**: Clearly define the expected JSON output format with `dsl_query` and `agent_steps_summary` fields
- **Include examples**: Provide sample queries and expected responses in the correct JSON format
- **Set constraints**: Specify field names, data types, and query limits
- **Optimize for JSON**: Ensure prompts guide the model to produce valid JSON with the required structure

### Default System Prompt:
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

### Default User Prompt:
```json
"NLQ is: ${parameters.question} and index_name is: ${parameters.index_name:-}, model ID for neural search is: ${parameters.embedding_model_id:-}"
```

## End to End Example:

Find end to end example here: [Converse and Monitor Agentic Search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/#end-to-end-example) 
