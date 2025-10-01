---
layout: default
title: Agentic search
parent: AI search
nav_order: 30
has_children: true
---

# Agentic search
**Introduced 3.2**
{: .label .label-purple }

Agentic search lets users ask questions in natural language and have OpenSearch plan and execute the retrieval automatically. A preconfigured **agent** reads the question, plans the search, and returns relevant results.

**Prerequisite**<br>
Before using agentic search, you must configure an agent with the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/).

## Configuring Agentic Search

**UI Configuration**<br>
You can configure Agents and execute Agentic Search through the UI using AI Search Flows. For detailed instructions, see [Building Agentic Search Flows]({{site.url}}{{site.baseurl}}/vector-search/ai-search/building-agentic-search-flows/).

**API Configuration**<br>
To configure Agentic Search via APIs, follow these steps:

1. [Create an index for ingestion](#step-1-create-an-index-for-ingestion).
2. [Ingest documents into the index](#step-2-ingest-documents-into-the-index).
3. [Create a model for Query Planning tool](#step-3-create-a-model-for-query-planning-tool).
4. [Create a Model for Conversational Agent](#step-4-create-a-model-for-conversational-agent).
5. [Create an Agent](#step-5-create-an-agent).
6. [Create a search pipeline](#step-6-create-a-search-pipeline).
7. [Search the index](#step-7-search-the-index).


### Step 1: Create an index for ingestion

Create an index for ingestion:

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

### Step 2: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following requests:

```json
POST _bulk
{ "index": { "_index": "iris-index", "_id": "1" } }
{ "petal_length_in_cm": 1.4, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 5.1, "sepal_width_in_cm": 3.5, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "2" } }
{ "petal_length_in_cm": 4.5, "petal_width_in_cm": 1.5, "sepal_length_in_cm": 6.4, "sepal_width_in_cm": 2.9, "species": "versicolor" }
```
{% include copy-curl.html %}


### Step 3: Create a model for Query Planning tool
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
            "model": "gpt-5",
            "response_filter": "$.choices[0].message.content"
        },
        "credential": {
            "openAI_key": <OPEN AI KEY>
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://api.openai.com/v1/chat/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"system\",\"content\":\"${parameters.query_planner_system_prompt}\"},{\"role\":\"user\",\"content\":\"${parameters.query_planner_user_prompt}\"}], \"reasoning_effort\":\"minimal\" }"
            }
        ]
    }
}
```
{% include copy-curl.html %}

### Step 4: Create a Model for Conversational Agent:

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
            "openAI_key": "OpenAI Key"
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

### Step 5: Create an Agent:
Create a Conversational Agent with the QueryPlannerTool(Mandatory) and other tools as needed
```json
POST /_plugins/_ml/agents/_register
{
    "name": "GPT 5 Agent for Agentic Search",
    "type": "conversational",
    "description": "Use this for Agentic Search",
    "llm": {
        "model_id": <Model ID from Step 4> ,
        "parameters": {
            "max_iteration": 15,
            "embedding_model_id": "<Provide if you want to do neural search>"
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
                "model_id": <Model ID from Step 3> 
            }
        }
        
    ],
    "app_type": "os_chat"
}
```

### Step 6: Create a search pipeline

Create a search pipeline with an agentic query translator search request processor and pass the agent ID created in step 5:

```json
PUT _search/pipeline/agentic-pipeline
{
     "request_processors": [
        {
            "agentic_query_translator": {
                "agent_id": "<Agent ID from Step 5>"
            }
        }
     ]
}
```
{% include copy-curl.html %}

### Step 7: Search the index

To perform agentic search, use the agentic query clause with your narural language question.

The following example request uses an agentic query to search for a natural language question:

```json
GET iris-index/_search?search_pipeline=agentic-pipeline
{
    "query": {
        "agentic": {
            "query_text": "List all the flowers present",
            "query_fields": ["species", "petal_length_in_cm"],
        }
    }
}
```
{% include copy-curl.html %}

The request contains the following fields:
1. `query_text`: The natural language question.
2. `query_fields` (optional): A list of fields that the agent should consider when generating the search query.


The agentic search request executes the agent with the QueryPlanningTool and sends the natural language question, along with the index mapping and a default prompt, to a large language model (LLM) to generate a query domain-specific language (DSL) query. The returned DSL query is then executed as a search request in OpenSearch:

```json
"hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "iris-index",
                "_id": "1",
                "_score": 1.0,
                "_source": {
                    "petal_length_in_cm": 1.4,
                    "petal_width_in_cm": 0.2,
                    "sepal_length_in_cm": 5.1,
                    "sepal_width_in_cm": 3.5,
                    "species": "setosa"
                }
            },
            {
                "_index": "iris-index",
                "_id": "2",
                "_score": 1.0,
                "_source": {
                    "petal_length_in_cm": 4.5,
                    "petal_width_in_cm": 1.5,
                    "sepal_length_in_cm": 6.4,
                    "sepal_width_in_cm": 2.9,
                    "species": "versicolor"
                }
            }
        ]
    }
```

## Next steps

- [Agent customization]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/) - Learn how to customize your agentic search agent with different models, tools, and configurations.