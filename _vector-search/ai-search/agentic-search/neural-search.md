---
layout: default
title: Neural Search
parent: Agentic search
grand_parent: AI search
nav_order: 90
has_children: false
---

# Neural Search

`neural` is a type of DSL claude that requires a `model_id` to perform semantic search on KNN indices (when not model id is not directly associated with the index). To make Agentic Search generate neural queries with `model_id` field, you can provide the embedding model ID during the registration of the agent, and the Query Planner Tool reads this embedding model ID and produces a neural query when the question requires it. This example demonstrates how agentic search can intelligently generate neural DSL queries by providing the embedding model ID in multiple ways - during agent registration, or even directly in your `query_text`.

## Complete Example: Neural DSL Generation with Agentic Search

This example shows how agentic search can smartly write DSL with neural queries, demonstrating the flexibility of providing model IDs in different locations.

## Phase 1: KNN Index Setup

### Step 1: Create Embedding Model

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

### Step 2: Create Ingest Pipeline

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

### Step 3: Create KNN Index with Ingest Pipeline

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

### Step 4: Ingest Data into KNN Index

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

## Phase 2: Agentic Search Setup

### Step 5: Register Models for Agentic Search

Register two models as described in the [Agentic Search setup]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/):

1. **[Register a model for the Agent]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-4-create-a-model-for-conversational-agent)**
2. **[Register a model for Query Planning Tool]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-3-create-a-model-for-query-planning-tool)**

### Step 6: Create Agent with Embedding Model ID

Create an agent with the `embedding_model_id` specified in the agent registration:

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

### Step 7: Create Search Pipeline

Create the search pipeline as described in the [end-to-end example]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/#4-configure-search-pipeline):


## Phase 3: Neural Search Examples

### Example 1: Agentic Search with Neural Query

Perform agentic search and observe neural query being used:

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

**Expected Response:**
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
                    "content_embedding": [<redacted>],
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
                    "content_embedding": [<redacted>],
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
                    "content_embedding": [<redacted>],
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

The `ext` block shows that the Query Planner Tool successfully generated a neural DSL query with the embedding model ID, demonstrating agentic search's ability to create neural search queries when appropriate.

### Example 2: Agentic Search Without Neural Query

Next, perform agentic search with a question that doesn't need embedding model:

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

**Expected Response:**
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
                    "content_embedding": [<redacted>],
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
As demonstrated, when the question doesn't require semantic search, the Agentic Search intelligently generates traditional DSL queries instead of neural queries, showing its ability to choose the appropriate query type based on context.

### Example 3: Query-Level Embedding Model Specification

For maximum flexibility, register an agent without `embedding_model_id` and mention it in the `query_text` directly:

**Register Agent without Embedding Model ID parameter:** 
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

**Perform agentic search with embedding model ID in the query_text:**

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

**Expected Response:**
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

As demonstrated, Agentic Search successfully extracts the embedding model ID directly from the query text and generates the appropriate neural DSL query, showcasing the flexibility of query-level model specification.