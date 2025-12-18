---
layout: default
title: Query Planning tool
has_children: false
has_toc: false
nav_order: 50
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/
---

<!-- vale off -->
# Query Planning tool
**Introduced 3.3**
{: .label .label-purple }
<!-- vale on -->

The `QueryPlanningTool` generates an OpenSearch query domain-specific language (DSL) query from a natural language question. It is a core component of [agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/), which enables natural language query processing through agent-driven workflows.

The `QueryPlanningTool` supports two approaches for generating DSL queries from natural language questions:

- **Using LLM knowledge only (default)**: The large language model (LLM) generates queries using only its training knowledge and any system/user prompts you provide. This approach relies entirely on the model's understanding of DSL syntax and your specific prompting instructions.

- **Using search templates**: The LLM uses predefined search templates as additional context when generating queries. You provide a collection of search templates with descriptions, and the LLM uses these as examples and guidance to create more accurate queries. If the LLM determines that none of the provided templates are suitable for the user's question, the LLM attempts to generate the query independently.

The `user_templates` approach is particularly useful when you have established query patterns for your specific use case or domain: it helps the LLM to generate queries that follow your preferred structure and to use appropriate field names from your index mappings.

## Step 1: Create an index and ingest sample data

First, create an index for the `iris` dataset:

```json
PUT /iris-index
{
  "mappings": {
    "properties": {
      "petal_length_in_cm": {
        "type": "float"
      },
      "petal_width_in_cm": {
        "type": "float"
      },
      "sepal_length_in_cm": {
        "type": "float"
      },
      "sepal_width_in_cm": {
        "type": "float"
      },
      "species": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, ingest sample documents into the index:

```json
POST _bulk
{ "index": { "_index": "iris-index", "_id": "1" } }
{ "petal_length_in_cm": 1.4, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 5.1, "sepal_width_in_cm": 3.5, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "2" } }
{ "petal_length_in_cm": 4.5, "petal_width_in_cm": 1.5, "sepal_length_in_cm": 6.4, "sepal_width_in_cm": 2.9, "species": "versicolor" }
{ "index": { "_index": "iris-index", "_id": "3" } }
{ "petal_length_in_cm": 6.0, "petal_width_in_cm": 2.5, "sepal_length_in_cm": 5.9, "sepal_width_in_cm": 3.0, "species": "virginica" }
```
{% include copy-curl.html %}

## Step 2: Register and deploy a model

The following request registers a remote model from Amazon Bedrock and deploys it to your cluster. The API call creates the connector and model in one step. Replace the `region`, `access_key`, `secret_key`, and `session_token` with your own values. You can use any model that supports the `converse` API, such as [Anthropic Claude 4](https://www.anthropic.com/news/claude-4) or [GPT 5](https://openai.com/index/introducing-gpt-5). You can use other model providers by creating a connector to this model (see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#connector-blueprints)).

**Important**: When creating connectors for the `QueryPlanningTool`, the request body must include the `system_prompt` and `user_prompt` parameters. These parameters are required for the tool to properly inject the system and user prompts into the model's request. 

The following example registers and deploys the Anthropic Claude 4 model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "Claude 4 sonnet Query Planner tool Model",
  "function_name": "remote",
  "description": "Claude 4 sonnet for Query Planning",
  "connector": {
    "name": "Bedrock Claude 4 Sonnet Connector",
    "description": "Amazon Bedrock connector for Claude 4 Sonnet",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
      "region": "us-east-1",
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
}
```
{% include copy-curl.html %}

The following example registers and deploys the OpenAI GPT 5 model:

```json
POST /_plugins/_ml/models/_register
{
    "name": "My OpenAI model: gpt-5",
    "function_name": "remote",
    "description": "test model",
    "connector": {
        "name": "My openai connector: gpt-5",
        "description": "The connector to openai chat model",
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
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.user_prompt}\"}${parameters._interactions:-}], \"reasoning_effort\":\"low\"${parameters.tool_configs:-}}"
            }
        ]
    }
}
```
{% include copy-curl.html %}

OpenSearch responds with the model ID:

```json
{
  "task_id": "_9iSxJgBOh0h20Y9XYTH",
  "status": "CREATED",
  "model_id": "ANiSxJgBOh0h20Y9XYXl"
}
```

## Step 3: Register an agent

You can use any [OpenSearch agent type]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/) to run the `QueryPlanningTool`. The following example uses a `flow` agent, which runs a sequence of tools in order and returns the last tool's output.

### Using LLM knowledge only

To use prompts only, don't specify the `generation_type`, so it defaults to `llmGenerated`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Agentic Search with Claude 4",
  "type": "flow",
  "description": "A test agent for query planning.",
  "tools": [
    {
      "type": "QueryPlanningTool",
      "parameters": {
        "model_id": "ANiSxJgBOh0h20Y9XYXl"
      }
    }
  ]
}
```
{% include copy-curl.html %}

When registering the agent, you can override parameters that you specified during model registration, such as `system_prompt` and `user_prompt`. 


### Using search templates

You can add [search templates]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/index/) as additional context to assist the LLM in OpenSearch DSL generation.

First, create the search templates:

```json
POST /_scripts/flower_species_search_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "from": "{% raw %} {{from}}{{^from}}0{{/from}} {% endraw %} ",
      "size": "{% raw %} {{size}}{{^size}}10{{/size}} {% endraw %} ",
      "query": {
        "match": {
          "species": "{% raw %} {{species}} {% endraw %} "
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
POST /_scripts/flower_petal_length_range_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "from": "{% raw %} {{from}}{{^from}}0{{/from}} {% endraw %} ",
      "size": "{% raw %} {{size}}{{^size}}10{{/size}} {% endraw %} ",
      "query": {
        "range": {
          "petal_length_in_cm": {
            "gte": "{% raw %} {{min_length}} {% endraw %} ",
            "lte": "{% raw %} {{max_length}} {% endraw %} "
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, register an agent with `generation_type` set to `user_templates` and provide the `template_id` and `template_description` for each template in the `search_templates` parameter:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Agentic Search with Claude 4",
  "type": "flow",
  "description": "A test agent for query planning.",
  "tools": [
    {
      "type": "QueryPlanningTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "ANiSxJgBOh0h20Y9XYXl",
        "generation_type": "user_templates",
        "search_templates": [
          {
            "template_id": "flower_species_search_template",
            "template_description": "This template searches for flowers that match the given species using a match query."
          },
          {
            "template_id": "flower_petal_length_range_template",
            "template_description": "This template searches for flowers within a specific petal length range using a range query."
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The LLM uses the `template_description` as the only context to help it choose the best template to use when generating an OpenSearch DSL query based on the user-provided `question`. Make sure to provide a good description of the templates to help the LLM make appropriate choices. Note that the LLM doesn't directly populate template variables or render the template; instead, it analyzes the template's query structure and uses it as a guide to generate a new, contextually appropriate OpenSearch DSL query.

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "RNjQi5gBOh0h20Y9-RX1"
}
```

## Step 4: Execute the agent

Execute the agent by sending the following request:

```json
POST /_plugins/_ml/agents/RNjQi5gBOh0h20Y9-RX1/_execute
{
  "parameters": {
    "question": "How many iris flowers of type setosa are there?",
    "index_name": "iris-index"
  }
}

```
{% include copy-curl.html %}

OpenSearch returns the inference results, which include the generated query DSL:

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
`model_id` | String | Required | The model ID of the LLM used to generate the query DSL. When used within a `conversational` agent, if this value is not provided, the agent's own `llm.model_id` is used by default.
`response_filter` | String | Optional | A JSONPath expression used to extract the generated query from the LLM's response.
`generation_type` | String | Optional | Determines how queries are generated. Use `llmGenerated` to rely solely on the LLM's built-in knowledge or `user_templates` to provide predefined search templates that guide query generation for consistent results. Default is `llmGenerated`.
`query_planner_system_prompt` | String | Optional | A system prompt that provides high-level instructions to the LLM.
`query_planner_user_prompt` | String | Optional | A user prompt template that defines how the natural language question and context are presented to the LLM for query generation.
`search_templates` | Array | Optional | Applicable only when `generation_type` is `user_templates`. A list of search templates that provide the LLM with predefined query patterns for generating query DSL. Each template must include a `template_id` (unique identifier) and `template_description` (explains the template's purpose and use case to help the LLM choose appropriately).

All parameters that were configured either in the connector or in the agent registration can be overridden during agent execution.
{: .note}

## Response filter configuration

The `response_filter` parameter uses JSONPath expressions to extract the generated query from the LLM's response. Different model providers return responses in different formats, so you need to specify the appropriate filter for your model type.

**OpenAI models**:

```json
"response_filter": "$.choices[0].message.content"
```
{% include copy.html %}

**Anthropic Claude models (Amazon Bedrock Converse API)**:

```json
"response_filter": "$.output.message.content[0].text"
```
{% include copy.html %}

## Execute parameters

The `QueryPlanningTool` accepts the following execution parameters.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`question` | String | Required | A complete natural language query with all necessary context to generate OpenSearch DSL. Include the question, any specific requirements, filters, or constraints. Examples: `Find all products with price greater than 100 dollars`, `Show me documents about machine learning published in 2023`, `Search for users with status active and age between 25 and 35`.
`index_name` | String | Required | The name of the index for which the query needs to be generated.
`embedding_model_id` | String | Optional | The model ID used to perform semantic search.

## Customizing the prompts

You can provide your own `query_planner_system_prompt` and `query_planner_user_prompt` to customize how the LLM generates OpenSearch DSL queries.

When creating custom prompts, ensure that they include clear output formatting rules so that they work properly with agentic search. The system prompt should specify that the LLM must return only a valid JSON object without any additional text, code fences, or explanations.
{: .important}

**Custom prompt configuration**:
Provide your custom prompts during tool registration in agents as follows:
```json
POST /_plugins/_ml/agents/_register
{
  "name": "Flow Agent for Agentic Search",
  "type": "flow",
  "description": "Flow agent for agentic search",
  "tools": [
    {
      "type": "QueryPlanningTool",
      "parameters": {
        "model_id": "your_model_id",
        "response_filter": "<response-filter-based-on-model-type>",
        "query_planner_system_prompt": "<YOUR CUSTOM SYSTEM PROMPT>",
        "query_planner_user_prompt": "<YOUR CUSTOM USER PROMPT>"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the appropriate `response_filter` based on your model type. For more information and examples, see [Response filter configuration](#response-filter-configuration).
{: .note}

The following is the default system prompt:

<details open markdown="block">
  <summary>
    Prompt
  </summary>
  {: .text-delta}

```json
==== PURPOSE ====
You are an OpenSearch DSL expert. Convert a natural-language question into a strict JSON OpenSearch query body.

==== RULES ====
Use only fields present in the provided mapping; never invent names.
Choose query types based on user intent and field types:

match: single-token full-text on analyzed text fields.

match_phrase: multi-token phrases on analyzed text fields (search string contains spaces, hyphens, commas, etc.).

multi_match: when multiple analyzed text fields are equally relevant.

term / terms: exact match on keyword, numeric, boolean.

range: numeric/date comparisons (gt, lt, gte, lte).

bool with must, should, must_not, filter: AND/OR/NOT logic.

wildcard / prefix on keyword: "starts with" / pattern matching.

exists: field presence/absence.

nested query / nested agg: ONLY if the mapping for that exact path (or a parent) has "type":"nested".

neural: semantic similarity on a 'semantic' or 'knn_vector' field (dense). Use "query_text" and "k"; include "model_id" unless bound in mapping.

neural (top-level): allowed when it's the only relevance clause needed; otherwise wrap in a bool when combining with filters/other queries.

Mechanics:

Put exact constraints (term, terms, range, exists, prefix, wildcard) in bool.filter (non-scoring). Put full-text relevance (match, match_phrase, multi_match) in bool.must.

Top N items/products/documents: return top hits (set "size": N as an integer) and sort by the relevant metric(s). Do not use aggregations for item lists.

Neural retrieval size: set "k" ≥ "size" (e.g. heuristic, k = max(size*5, 100) and k<=ef_search).

Spelling tolerance: match_phrase does NOT support fuzziness; use match or multi_match with "fuzziness": "AUTO" when tolerant matching is needed.

Text operators (OR vs AND): default to OR for natural-language queries; to tighten, use minimum_should_match (e.g., "75%"). Use AND only when every token is essential; if order/adjacency matters, use match_phrase.

Numeric note: use ONLY integers for size and k (not floats).

Aggregations (counts, averages, grouped summaries, distributions):

Use aggregations when the user asks for grouped summaries (e.g., counts by category, averages by brand, or top N categories/brands).

terms on field.keyword or numeric for grouping / top N groups (not items).

Metric aggs (avg, min, max, sum, stats, cardinality) on numeric fields.

date_histogram, histogram, range for distributions.

Always set "size": 0 when only aggregations are needed.

Use sub-aggregations + order for "top N groups by metric".

If grouping/filtering exactly on a text field, use its .keyword sub-field when present.

DATE RULES

Use range on date/date_nanos in bool.filter.

Emit ISO 8601 UTC ('Z') bounds; don't set time_zone for explicit UTC. (now is UTC)

Date math: now±N{y|M|w|d|h|m|s}.

Rounding: "/UNIT" floors to start (now/d, now/w, now/M, now/y).

End boundaries: prefer the next unit’s start.

Formats: only add "format" when inputs aren’t default; epoch_millis allowed.

Buckets: use date_histogram with calendar_interval or fixed_interval.

NEURAL / SEMANTIC SEARCH
When to use: conceptual/semantic intent, or when user asks for semantic/neural/vector/embedding search.
When not to use: purely structured/exact queries, or when no semantic/knn_vector field or model_id is available.
How to query:

Use the "neural" clause against the chosen field.

Required: "query_text" and "k".

Model rules:

For "semantic" fields, omit model_id unless overriding.

For "knn_vector", include model_id unless default is bound.

If no model id, do not generate neural clause.

Top-level allowed if no filters/other queries. Otherwise wrap in bool with filters in bool.filter.

Size: set "k" ≥ "size" (heuristic: k = max(size*5, 100)).

FIELD SELECTION & PROXYING
Goal: pick the smallest set of mapping fields that best capture the user's intent.

When provided, and present in the mapping, prioritize query_fields.

Proxy Rule: If at least one field is loosely related, proceed with the best proxy; do NOT fallback to match_all due to ambiguity.

Steps: harvest candidates, pick mapping fields, ignore irrelevant ones.

Micro Self-Check: verify fields exist; if not, swap to proxies. Only if no relevant fields exist at all, fallback to match_all.

==== OUTPUT FORMAT ====

Return EXACTLY ONE JSON object (valid OpenSearch request body).

No escapes, no code fences, no quotes around the whole object.

If nothing relevant exists, return exactly:
{"size":10,"query":{"match_all":{}}}

==== EXAMPLES ====
(Then follows Examples 1–13 exactly as in your original text, but without escapes.)

==== TEMPLATE USE ====
Use this search template provided by the user as reference to generate the query: ${parameters.template}
Note that this template might contain terms that are not relevant to the question at hand; in that case ignore the template.
```

</details>

The following is the default user prompt:

```json
Question: ${parameters.question}
Mapping: ${parameters.index_mapping:-}
Query Fields: ${parameters.query_fields:-}
Sample Document from index: ${parameters.sample_document:-}
In UTC: ${parameters.current_time:-} format: yyyy-MM-dd'T'HH:mm:ss'Z'
Embedding Model ID for Neural Search: ${parameters.embedding_model_id:- not provided}

==== OUTPUT ====
GIVE THE OUTPUT PART ONLY IN YOUR RESPONSE (a single JSON object)
Output:
```

## Fallback behavior

The `QueryPlanningTool` includes a default fallback query: `{"size":10,"query":{"match_all":{}}}`. 

The code automatically extracts the first valid JSON object from the LLM's response, even if the JSON is surrounded by additional text, Markdown code fences, explanations, or other content. However, if no valid JSON can be extracted from the response (for example, when the response is completely empty, contains only non-JSON text, or contains only malformed JSON), the tool returns the default fallback query.

When the fallback is triggered, no error is thrown. Instead, a debug log is shown in the system logs. This ensures that query planning operations continue to work even when the LLM provides unexpected output.

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.

## Related documentation

- [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index)