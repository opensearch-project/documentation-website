---
layout: default
title: Configuring agents for semantic search
parent: Agentic search
grand_parent: AI search
nav_order: 90
has_children: false
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/agentic-search/neural-search/
---

# Configuring agents for semantic search

When you have vector indexes with embeddings and want agentic search to automatically perform semantic searches based on user intent, you need to configure your agent with embedding model information. This allows the agent to generate `neural` queries that search for semantic similarity rather than exact text matches, providing more relevant results for conceptual questions.

When you configure agents for semantic search, the agents choose between traditional keyword searches and semantic vector searches at query time. To enable semantic search in agentic search, you need to provide embedding model information. You can either add the `embedding_model_id` parameter to your agent's configuration or include the embedding model ID directly in your natural language query. 

## Step 1: Configure a vector index

First, configure a vector index.

### Step 1(a): Create an embedding model

Register an embedding model that will convert text into vector representations for semantic search:

```json
POST /_plugins/_ml/models/_register
{
  "name": "Bedrock embedding model",
  "function_name": "remote",
  "description": "Bedrock text embedding model v2",
  "connector": {
    "name": "Amazon Bedrock Connector: embedding",
    "description": "The connector to bedrock Titan embedding model",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
      "region": "your-aws-region",
      "service_name": "bedrock",
      "model": "amazon.titan-embed-text-v2:0",
      "dimensions": 1024,
      "normalize": true,
      "embeddingTypes": [
        "float"
      ]
    },
    "credential": {
      "access_key": "your-access-key",
      "secret_key": "your-secret-key",
      "session_token": "your-session-token"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
        "headers": {
          "content-type": "application/json",
          "x-amz-content-sha256": "required"
        },
        "request_body": "{ \"inputText\": \"${parameters.inputText}\", \"dimensions\": ${parameters.dimensions}, \"normalize\": ${parameters.normalize}, \"embeddingTypes\": ${parameters.embeddingTypes} }",
        "pre_process_function": "connector.pre_process.bedrock.embedding",
        "post_process_function": "connector.post_process.bedrock.embedding"
      }
    ]
  }
}
```
{% include copy-curl.html %}

### Step 1(b): Create an ingest pipeline

Create an ingest pipeline that automatically generates embeddings for text fields during document ingestion:

```json
PUT /_ingest/pipeline/my_bedrock_embedding_pipeline
{
  "description": "text embedding pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "fxzel5kB-5P992SCH-qM",
        "field_map": {
          "content_text": "content_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 1(c): Create a vector index with an ingest pipeline

Create a vector index with mappings for both text content and vector embeddings, using the ingest pipeline to automatically process documents:

```json
PUT /research_papers
{
  "settings": {
    "index": {
      "default_pipeline": "my_bedrock_embedding_pipeline",
      "knn": "true"
    }
  },
  "mappings": {
    "properties": {
      "content_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "engine": "lucene"
        }
      },
      "published_date": {
        "type": "date"
      },
      "rating": {
        "type": "integer"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 1(d): Ingest data into the vector index

Add research paper documents to the index. The ingest pipeline will automatically generate embeddings for the `content_text` field:

```json
POST /_bulk
{ "index": { "_index": "research_papers", "_id": "1" } }
{ "content_text": "Autonomous robotic systems for warehouse automation and industrial manufacturing", "published_date": "2024-05-15", "rating": 5 }
{ "index": { "_index": "research_papers", "_id": "2" } }
{ "content_text": "Gene expression analysis and CRISPR-Cas9 genome editing applications in cancer research", "published_date": "2024-06-02", "rating": 4 }
{ "index": { "_index": "research_papers", "_id": "3" } }
{ "content_text": "Reinforcement learning algorithms for sequential decision making and optimization problems", "published_date": "2024-03-20", "rating": 5 }
{ "index": { "_index": "research_papers", "_id": "4" } }
{ "content_text": "Climate change impact on coral reef ecosystems and marine biodiversity conservation", "published_date": "2024-04-10", "rating": 4 }
{ "index": { "_index": "research_papers", "_id": "5" } }
{ "content_text": "Tectonic plate movements and earthquake prediction using geological fault analysis", "published_date": "2024-01-22", "rating": 4 }
```
{% include copy-curl.html %}

## Step 2: Configure agentic search

Next, configure agentic search.

### Step 2(a): Create a model for agentic search

Register a model that will be used by both the conversational agent and the `QueryPlanningTool`:

```json
POST /_plugins/_ml/models/_register
{
  "name": "My OpenAI model: gpt-5",
  "function_name": "remote",
  "description": "Model for agentic search with neural queries",
  "connector": {
    "name": "My openai connector: gpt-5",
    "description": "The connector to openai chat model",
    "version": 1,
    "protocol": "http",
    "parameters": {
      "model": "gpt-5"
    },
    "credential": {
      "openAI_key": "<OPEN AI KEY>"
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

### Step 2(b): Create an agent with an embedding model ID

Create an agent with the `embedding_model_id` specified in the agent registration. This allows the agent to automatically generate neural queries when semantic search is needed:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "GPT 5 Agent for Agentic Search",
  "type": "conversational",
  "description": "Use this for Agentic Search",
  "llm": {
    "model_id": "your-agent-model-id",
    "parameters": {
      "max_iteration": 15,
      "embedding_model_id": "your-embedding-model-id-from-step1"
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
        "model_id": "your-qpt-model-id"
      }
    }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

### Step 2(c): Create a search pipeline

Create a search pipeline that uses your agent for agentic search:

```json
PUT _search/pipeline/my_pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your-agent-id-from-step-2b"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 3: Run an agentic search

Run various configurations of agentic search.

### Run a semantic search

Perform agentic search with a question that requires semantic understanding:

```json
POST /research_papers/_search?search_pipeline=my_pipeline
{
  "query": {
    "agentic": {
      "query_text": "Show me 3 robots training related research papers "
    }
  }
}
```
{% include copy-curl.html %}

The agent successfully identifies that semantic search is needed. The `ext` object demonstrates that the `QueryPlanningTool` successfully generated a `neural` query using the embedding model ID. The response includes matching research papers ranked by semantic similarity:

```json
{
  "took": 10509,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 0.40031588,
    "hits": [
      {
        "_index": "research_papers",
        "_id": "1",
        "_score": 0.40031588,
        "_source": {
          "content_text": "Autonomous robotic systems for warehouse automation and industrial manufacturing",
          "rating": 5,
          "content_embedding": ["<redacted>"],
          "published_date": "2024-05-15"
        }
      },
      {
        "_index": "research_papers",
        "_id": "3",
        "_score": 0.36390686,
        "_source": {
          "content_text": "Reinforcement learning algorithms for sequential decision making and optimization problems",
          "rating": 5,
          "content_embedding": ["<redacted>"],
          "published_date": "2024-03-20"
        }
      },
      {
        "_index": "research_papers",
        "_id": "5",
        "_score": 0.34401828,
        "_source": {
          "content_text": "Tectonic plate movements and earthquake prediction using geological fault analysis",
          "rating": 4,
          "content_embedding": ["<redacted>"],
          "published_date": "2024-01-22"
        }
      }
    ]
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: ListIndexTool — input: \"[]\"; context gained: \"Found indices; 'research_papers' appears relevant\"\nSecond I used: IndexMappingTool — input: \"[\"research_papers\"]\"; context gained: \"Index has text content and an embedding field suitable for neural search\"\nThird I used: query_planner_tool — qpt.question: \"Show me 3 research papers related to robots training.\"; index_name_provided: \"research_papers\"\nValidation: qpt output is valid and limits results to 3 using neural search with the provided model.",
    "memory_id": "jhzpl5kB-5P992SCwOqe",
    "dsl_query": "{\"size\":3.0,\"query\":{\"neural\":{\"content_embedding\":{\"model_id\":\"fxzel5kB-5P992SCH-qM\",\"k\":100.0,\"query_text\":\"robots training\"}}}}"
  }
}
```

### Run a traditional search with filters

Next, perform agentic search with a question that requires filtering rather than semantic understanding:

```json
POST /research_papers/_search?search_pipeline=my_pipeline
{
  "query": {
    "agentic": {
      "query_text": "Show me papers published after 2024 May"
    }
  }
}
```
{% include copy-curl.html %}

The agent recognizes the query as a date-based filter query and generates a traditional `range` query instead of a `neural` query:

```json
{
  "took": 8522,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "research_papers",
        "_id": "2",
        "_score": null,
        "_source": {
          "content_text": "Gene expression analysis and CRISPR-Cas9 genome editing applications in cancer research",
          "rating": 4,
          "content_embedding": ["<redacted>"],
          "published_date": "2024-06-02"
        },
        "sort": [
          1717286400000
        ]
      }
    ]
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: query_planner_tool — qpt.question: \"Show me papers published after May 2024.\"; index_name_provided: \"research_papers\"\nValidation: qpt output is valid JSON and matches the user request with the specified date filter and sorting.",
    "memory_id": "vBzyl5kB-5P992SCI-o1",
    "dsl_query": "{\"size\":10.0,\"query\":{\"bool\":{\"filter\":[{\"range\":{\"published_date\":{\"gt\":\"2024-05-31T23:59:59Z\"}}}]}},\"sort\":[{\"published_date\":{\"order\":\"desc\"}}]}"
  }
}
```

### Specify embedding models in query text

For maximum flexibility, you can register an agent without specifying an embedding model ID and then specify the embedding model ID in the `query_text` directly when sending a query.

Create an agent without specifying the embedding model ID in the agent parameters:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "GPT 5 Agent for Agentic Search",
  "type": "conversational",
  "description": "Use this for Agentic Search",
  "llm": {
    "model_id": "your-agent-model-id",
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
      "type": "QueryPlanningTool",
      "parameters": {
        "model_id": "your-qpt-model-id"
      }
    }
  ],
  "app_type": "os_chat"
}
```

Send an agentic search request that includes the embedding model ID directly in the natural language `query_text`:

```json
POST /research_papers/_search?search_pipeline=my_pipeline
{
  "query": {
    "agentic": {
      "query_text": "Show me 3 robots training related research papers use this model id for neural search:fxzel5kB-5P992SCH-qM "
    }
  }
}
```
{% include copy-curl.html %}

The agent successfully extracts the embedding model ID directly from the query text and generates the appropriate neural DSL query:

```json
{
  "took": 14989,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "max_score": 0.38957736,
    "hits": [
      {
        "_index": "research_papers",
        "_id": "1",
        "_score": 0.38957736,
        "_source": {
          "content_text": "Autonomous robotic systems for warehouse automation and industrial manufacturing",
          "rating": 5,
          "content_embedding": [],
          "published_date": "2024-05-15"
        }
      },
      {
        "_index": "research_papers",
        "_id": "3",
        "_score": 0.36386627,
        "_source": {
          "content_text": "Reinforcement learning algorithms for sequential decision making and optimization problems",
          "rating": 5,
          "content_embedding": [],
          "published_date": "2024-03-20"
        }
      },
      {
        "_index": "research_papers",
        "_id": "2",
        "_score": 0.35789147,
        "_source": {
          "content_text": "Gene expression analysis and CRISPR-Cas9 genome editing applications in cancer research",
          "rating": 4,
          "content_embedding": [],
          "published_date": "2024-06-02"
        }
      }
    ]
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: ListIndexTool — input: \"\"; context gained: \"Found indices, including research_papers with 5 documents\"\nSecond I used: IndexMappingTool — input: \"research_papers\"; context gained: \"Index exists and contains text and embedding fields suitable for neural search\"\nThird I used: query_planner_tool — qpt.question: \"Show me 3 research papers related to robot training.\"; index_name_provided: \"research_papers\"\nValidation: qpt output is valid neural search DSL using the provided model ID and limits results to 3.",
    "memory_id": "whz1l5kB-5P992SCPOqn",
    "dsl_query": "{\"size\":3.0,\"query\":{\"neural\":{\"content_embedding\":{\"model_id\":\"fxzel5kB-5P992SCH-qM\",\"k\":100.0,\"query_text\":\"research papers related to robot training\"}}},\"sort\":[{\"_score\":{\"order\":\"desc\"}}],\"track_total_hits\":false}"
  }
}
```