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
**Introduced 3.3**
{: .label .label-purple }
<!-- vale on -->

The `QueryPlanningTool` generates an OpenSearch query domain-specific language (DSL) query from a natural language question. It is a core component of [agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/), which enables natural language query processing through agent-driven workflows. 

The `QueryPlanningTool` supports two approaches for generating DSL queries from natural language questions:

- **Using LLM knowledge only (default)**: The large language model (LLM) generates queries using only its training knowledge and any system/user prompts you provide. This approach relies entirely on the model's understanding of DSL syntax and your specific prompting instructions.

- **Using search templates**: The LLM uses predefined search templates as additional context when generating queries. You provide a collection of search templates with descriptions, and the LLM uses these as examples and guidance to create more accurate queries. If the LLM determines that none of the provided templates are suitable for the user's question, it falls back to a default `match_all` query.

The `user_templates` approach is particularly useful when you have established query patterns for your specific use case or domain: it helps the LLM to generate queries that follow your preferred structure and to use appropriate field names from your index mappings.

## Step 1: Register and deploy a model

The following request registers a remote model from Amazon Bedrock and deploys it to your cluster. The API call creates the connector and model in one step. Replace the `region`, `access_key`, `secret_key`, and `session_token` with your own values. You can use any model that supports the `converse` API, such as [Anthropic Claude 4](https://www.anthropic.com/news/claude-4) or [GPT 5](https://openai.com/index/introducing-gpt-5). You can use other model providers by creating a connector to this model (see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#connector-blueprints)).

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
        "request_body": """{ "system": [{"text": "${parameters.query_planner_system_prompt}"}], "messages": [{"role":"user","content":[{"text":"${parameters.query_planner_user_prompt}"}]}]}"""
      }
    ]
  }
}
```
{% include copy-curl.html %}

The following example registers and deploys the OpenAI GPT 5 model:

```json
POST /_plugins/_ml/models/_register?deploy=true
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
      "model": "gpt-5",
      "response_filter": "$.choices[0].message.content"
    },
    "credential": {
      "openAI_key": "OPENAI KEY"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "headers": {
          "Authorization": "Bearer ${credential.openAI_key}"
        },
        "request_body": """{ "model": "${parameters.model}", "messages": [{"role":"system","content":"${parameters.query_planner_system_prompt}"},{"role":"user","content":"${parameters.query_planner_user_prompt}"}], "reasoning_effort":"minimal"}"""
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

## Step 2: Register an agent

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
      "description": "A general tool to answer any question.",
      "parameters": {
        "model_id": "ANiSxJgBOh0h20Y9XYXl"
      }
    }
  ]
}
```
{% include copy-curl.html %}

When registering the agent, you can override parameters that you specified during model registration, such as `query_planner_system_prompt` and `query_planner_user_prompt`. 


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
POST /_scripts/flower_species_search_template_2
{
  "script": {
    "lang": "mustache",
    "source": {
      "from": "{% raw %} {{from}}{{^from}}0{{/from}} {% endraw %} ",
      "size": "{% raw %} {{size}}{{^size}}10{{/size}} {% endraw %} ",
      "query": {
        "term": {
          "species": "{% raw %} {{species}} {% endraw %} "
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
            "template_id": "flower_species_search_template_2",
            "template_description": "This template searches for flowers that match the given species using a term query."
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The LLM uses the `template_description` as additional context to help it choose the best template to use when generating an OpenSearch DSL query based on the user-provided `question`. If the LLM determines that none of the provided search templates are applicable to the given `question`, then the LLM uses a default `match_all` query. Note that the LLM doesn't directly populate template variables or render the template; instead, it analyzes the template's query structure and uses it as a guide to generate a new, contextually appropriate OpenSearch DSL query.

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "RNjQi5gBOh0h20Y9-RX1"
}
```

## Step 3: Execute the agent

Execute the agent by sending the following request:

```json
POST /_plugins/_ml/agents/RNjQi5gBOh0h20Y9-RX1/_execute
{
  "parameters": {
    "query_planner_user_prompt": """You are an OpenSearch Query DSL generation assistant, generate an OpenSearch Query DSL to retrieve the most relevant documents for the user provided natural language question: ${parameters.question}, please return the query dsl only, no other texts. Please don't use size:0, because that would limit the query to return no result. please return a query to find the most relevant documents related to users question. For example: {"query":{"match":{"species":"setosa"}}} 
""",
    "question": "How many iris flowers of type setosa are there?"
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
`model_id` | String | Required | The model ID of the large language model (LLM) to use for generating the query DSL.
`response_filter` | String | Optional | A JSONPath expression used to extract the generated query from the LLM's response.
`generation_type` | String | Optional | The type of query generation. Valid values are `llmGenerated` (use LLM knowledge only) and `user_templates` (provide search templates as additional context). Default is `llmGenerated`.
`query_planner_system_prompt` | String | Optional | A system prompt that provides high-level instructions to the LLM. Default is `You are an OpenSearch Query DSL generation assistant, translating natural language questions to OpenSeach DSL Queries`.
`query_planner_user_prompt` | String | Optional | A user prompt template for the LLM. Can contain placeholders for execution-time parameters like `${parameters.question}`.
`search_templates` | Array | Optional | Applicable only when `generation_type` is set to `user_templates`. A list of search templates for an LLM to use as context when generating an OpenSearch DSL query. Each entry within the `search_templates` array must include a `template_id` and a `template_description` (provides the LLM with additional context about the template contents).

## Execute parameters

The execution parameters for the `QueryPlanningTool` are flexible and depend on both the tool's configuration and the underlying language model's requirements as defined in its connector.

There are three layers of parameters to consider:

1.  **Connector parameters**: When you create a connector, the `request_body` defines the JSON payload sent to the model. This payload can contain variables like `${parameters.prompt}` or `${parameters.query_planner_user_prompt}`. The names of these variables depend on the specific model's API. The `QueryPlanningTool` provides values for these variables.

2.  **Tool parameters**: The `QueryPlanningTool` uses its own set of parameters, such as `query_planner_user_prompt` and `query_planner_system_prompt`, to construct the final string that will be passed to the connector. The tool takes the `query_planner_user_prompt` string and resolves any variables within it, and the resulting string is then used to fill the appropriate variable (for example, `${parameters.query_planner_user_prompt}`) in the connector's `request_body`.

3.  **Prompt variables**: These are the variables inside the `query_planner_user_prompt`, which have the format `${parameters.your_variable_name}`. These must be provided in the `_execute` API call. For example, if your `user_prompt` is "Generate a query for: ${parameters.question}", then you must provide a `question` parameter when you run the agent.

In summary, the required parameters for an `_execute` call are the **prompt variables**. The tool's own parameters (like `query_planner_user_prompt`) can be overridden at execution time to change how the final prompt is constructed.

For example, if you are using the default `query_planner_user_prompt`, it contains the variable `${parameters.question}`. Therefore, `question` becomes a required execution parameter:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "question": "How many iris flowers of type setosa are there?"
  }
}
```
{% include copy-curl.html %}

### Improving query accuracy

To help the language model generate more accurate query DSL, you can provide additional context within the `query_planner_user_prompt`. This context can include information like:

- Index mappings.
- Relevant field names.
- Sample documents or queries.

You can pass this information by defining variables in your `query_planner_user_prompt` and providing the corresponding values in the `parameters` of your `_execute` call.

**Example of an enriched `query_planner_user_prompt`**

Here is an example of how you can structure a `query_planner_user_prompt` to include an index mapping and guide the model to generate a more precise query:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "query_planner_user_prompt": "You are an OpenSearch Query DSL generation expert. Use the following index mapping to inform your query: ${parameters.index_mapping}. Based on this mapping, generate a query for the user's question: ${parameters.question}. Only use fields mentioned in the mapping.",
    "question": "Find all movies directed by John Doe",
    "index_mapping": """{"properties":{"title":{"type":"text"},"director":{"type":"keyword"},"year":{"type":"integer"}}}"""
  }
}
```
{% include copy-curl.html %}

When passing complex JSON objects like an `index_mapping` as a parameter, ensure that the JSON string is properly escaped to be a valid single-line string within the parent JSON document.
{: .note}

## Related pages

- [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/)