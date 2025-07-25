---
layout: default
title: RAG chatbot with a conversational flow agent
parent: Tutorials
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/tutorials/rag-conversational-agent/
---

# RAG chatbot with a conversational flow agent

This tutorial explains how to use a conversational flow agent to build a retrieval-augmented generation (RAG) application with your OpenSearch data as a knowledge base.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

An alternative way to build RAG conversational search is to use a RAG pipeline. For more information, see [Conversational search using the Cohere Command model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/conversational-search-cohere/).

## Prerequisite

In this tutorial, you'll build a RAG application that provides an OpenSearch [k-NN index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/) as a knowledge base for a large language model (LLM). For data retrieval, you'll use [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/). For a comprehensive semantic search tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

First, you'll need to update your cluster settings. If you don't have a dedicated machine learning (ML) node, set `"plugins.ml_commons.only_run_on_ml_node": false`. To avoid triggering a native memory circuit breaker, set `"plugins.ml_commons.native_memory_threshold"` to 100%:

```json
PUT _cluster/settings
{
    "persistent": {
        "plugins.ml_commons.only_run_on_ml_node": false,
        "plugins.ml_commons.native_memory_threshold": 100,
        "plugins.ml_commons.agent_framework_enabled": true
    }
}
```
{% include copy-curl.html %}

## Step 1: Prepare the knowledge base

Use the following steps to prepare the knowledge base that will supplement the LLM's knowledge.

### Step 1.1: Register a text embedding model

Register a text embedding model that will translate text into vector embeddings:

```json
POST /_plugins/_ml/models/_register
{
  "name": "huggingface/sentence-transformers/all-MiniLM-L12-v2",
  "version": "1.0.1",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Note the text embedding model ID; you'll use it in the following steps.

As an alternative, you can get the model ID by calling the [Get Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

```json
GET /_plugins/_ml/tasks/your_task_id
```
{% include copy-curl.html %}

Deploy the model:

```json
POST /_plugins/_ml/models/your_text_embedding_model_id/_deploy
```
{% include copy-curl.html %}

Test the model:

```json
POST /_plugins/_ml/models/your_text_embedding_model_id/_predict
{
  "text_docs":[ "today is sunny"],
  "return_number": true,
  "target_response": ["sentence_embedding"]
}
```
{% include copy-curl.html %}

For more information about using models within your OpenSearch cluster, see [Pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

### Step 1.2: Create an ingest pipeline

Create an ingest pipeline with a text embedding processor, which can invoke the model created in the previous step to generate embeddings from text fields:

```json
PUT /_ingest/pipeline/test_population_data_pipeline
{
    "description": "text embedding pipeline",
    "processors": [
        {
            "text_embedding": {
                "model_id": "your_text_embedding_model_id",
                "field_map": {
                    "population_description": "population_description_embedding"
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

For more information about ingest pipelines, see [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/).

### Step 1.3: Create a k-NN index

Create a k-NN index specifying the ingest pipeline as a default pipeline:

```json
PUT test_population_data
{
  "mappings": {
    "properties": {
      "population_description": {
        "type": "text"
      },
      "population_description_embedding": {
        "type": "knn_vector",
        "dimension": 384
      }
    }
  },
  "settings": {
    "index": {
      "knn.space_type": "cosinesimil",
      "default_pipeline": "test_population_data_pipeline",
      "knn": "true"
    }
  }
}
```
{% include copy-curl.html %}

For more information about k-NN indexes, see [k-NN index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).

### Step 1.4: Ingest data

Ingest test data into the k-NN index:

```json
POST _bulk
{"index": {"_index": "test_population_data"}}
{"population_description": "Chart and table of population level and growth rate for the Ogden-Layton metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of Ogden-Layton in 2023 is 750,000, a 1.63% increase from 2022.\nThe metro area population of Ogden-Layton in 2022 was 738,000, a 1.79% increase from 2021.\nThe metro area population of Ogden-Layton in 2021 was 725,000, a 1.97% increase from 2020.\nThe metro area population of Ogden-Layton in 2020 was 711,000, a 2.16% increase from 2019."}
{"index": {"_index": "test_population_data"}}
{"population_description": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."}
{"index": {"_index": "test_population_data"}}
{"population_description": "Chart and table of population level and growth rate for the Chicago metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Chicago in 2023 is 8,937,000, a 0.4% increase from 2022.\\nThe metro area population of Chicago in 2022 was 8,901,000, a 0.27% increase from 2021.\\nThe metro area population of Chicago in 2021 was 8,877,000, a 0.14% increase from 2020.\\nThe metro area population of Chicago in 2020 was 8,865,000, a 0.03% increase from 2019."}
{"index": {"_index": "test_population_data"}}
{"population_description": "Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."}
{"index": {"_index": "test_population_data"}}
{"population_description": "Chart and table of population level and growth rate for the Austin metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Austin in 2023 is 2,228,000, a 2.39% increase from 2022.\\nThe metro area population of Austin in 2022 was 2,176,000, a 2.79% increase from 2021.\\nThe metro area population of Austin in 2021 was 2,117,000, a 3.12% increase from 2020.\\nThe metro area population of Austin in 2020 was 2,053,000, a 3.43% increase from 2019."}
{"index": {"_index": "test_population_data"}}
{"population_description": "Chart and table of population level and growth rate for the Seattle metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Seattle in 2023 is 3,519,000, a 0.86% increase from 2022.\\nThe metro area population of Seattle in 2022 was 3,489,000, a 0.81% increase from 2021.\\nThe metro area population of Seattle in 2021 was 3,461,000, a 0.82% increase from 2020.\\nThe metro area population of Seattle in 2020 was 3,433,000, a 0.79% increase from 2019."}
```
{% include copy-curl.html %}

## Step 2: Prepare an LLM

This tutorial uses the [Amazon Bedrock Claude model](https://aws.amazon.com/bedrock/claude/) for conversational search. You can also use other LLMs. For more information about using externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

### Step 2.1: Create a connector

Create a connector for the Claude model:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "BedRock Claude instant-v1 Connector ",
  "description": "The connector to BedRock service for claude model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "us-east-1",
    "service_name": "bedrock",
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens_to_sample": 8000,
    "temperature": 0.0001,
    "response_filter": "$.completion"
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
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-instant-v1/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }"
    }
  ]
}
```
{% include copy-curl.html %}

Note the connector ID; you'll use it to register the model.

### Step 2.2: Register the model

Register the Claude model hosted on Amazon Bedrock:

```json
POST /_plugins/_ml/models/_register
{
    "name": "Bedrock Claude Instant model",
    "function_name": "remote",
    "description": "Bedrock Claude instant-v1 model",
    "connector_id": "your_LLM_connector_id"
}
```
{% include copy-curl.html %}

Note the LLM model ID; you'll use it in the following steps.

### Step 2.3: Deploy the model

Deploy the Claude model:

```json
POST /_plugins/_ml/models/your_LLM_model_id/_deploy
```
{% include copy-curl.html %}

### Step 2.4: Test the model

To test the model, send a Predict API request:

```json
POST /_plugins/_ml/models/your_LLM_model_id/_predict
{
  "parameters": {
    "prompt": "\n\nHuman: how are you? \n\nAssistant:"
  }
}
```
{% include copy-curl.html %}

## Step 3: Register an agent

OpenSearch provides the following agent types: `flow`, `conversational_flow`, and `conversational`. For more information about agents, see [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/#agents).

You will use a `conversational_flow` agent in this tutorial. The agent consists of the following:

- Meta info: `name`, `type`, and `description`.
- `app_type`: Differentiates between application types.
- `memory`: Stores user questions and LLM responses as a conversation so that an agent can retrieve conversation history from memory and continue the same conversation.
- `tools`: Defines a list of tools to use. The agent will run these tools sequentially.

To register an agent, send the following request:

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
                "model_id": "your_text_embedding_model_id",
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
                "model_id": "your_LLM_model_id",
                "prompt": "\n\nHuman:You are a professional data analysist. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\nContext:\n${parameters.population_knowledge_base.output:-}\n\n${parameters.chat_history:-}\n\nHuman:${parameters.question}\n\nAssistant:"
            }
        }
    ]
}
```
{% include copy-curl.html %}

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "fQ75lI0BHcHmo_czdqcJ"
}
```

Note the agent ID; you'll use it in the next step. 

## Step 4: Run the agent

You'll run the agent to analyze the increase in Seattle's population. When you run this agent, the agent will create a new conversation. Later, you can continue this conversation by asking other questions.

### Step 4.1: Start a new conversation

First, start a new conversation by asking the LLM a question:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023?"
  }
}
```
{% include copy-curl.html %}

The response contains the answer generated by the LLM:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "memory_id",
          "result": "gQ75lI0BHcHmo_cz2acL" 
        },
        {
          "name": "parent_message_id",
          "result": "gg75lI0BHcHmo_cz2acZ"
        },
        {
          "name": "bedrock_claude_model",
          "result": """ Based on the context given:
- The metro area population of Seattle in 2021 was 3,461,000
- The current metro area population of Seattle in 2023 is 3,519,000
- So the population increase of Seattle from 2021 to 2023 is 3,519,000 - 3,461,000 = 58,000"""
        }
      ]
    }
  ]
}
```

The response contains the following fields:

- `memory_id` is the identifier for the memory (conversation) that groups all messages within a single conversation. Note this ID; you'll use it in the next step.
- `parent_message_id` is the identifier for the current message (one question/answer) between the human and the LLM. One memory can contain multiple messages.

To obtain memory details, call the [Get Memory API](ml-commons-plugin/api/memory-apis/get-memory/):

```json
GET /_plugins/_ml/memory/gQ75lI0BHcHmo_cz2acL
```
{% include copy-curl.html %}

To obtain all messages within a memory, call the [Get Messages API](ml-commons-plugin/api/memory-apis/get-message/):

```json
GET /_plugins/_ml/memory/gQ75lI0BHcHmo_cz2acL/messages
```
{% include copy-curl.html %}

To obtain message details, call the [Get Message API](ml-commons-plugin/api/memory-apis/get-message/):

```json
GET /_plugins/_ml/memory/message/gg75lI0BHcHmo_cz2acZ
```
{% include copy-curl.html %}

For debugging purposes, you can obtain trace data for a message by calling the [Get Message Traces API](ml-commons-plugin/api/memory-apis/get-message-traces/):

```json
GET /_plugins/_ml/memory/message/gg75lI0BHcHmo_cz2acZ/traces
```
{% include copy-curl.html %}

### 4.2 Continue a conversation by asking new questions

To continue the same conversation, provide the memory ID from the previous step.

Additionally, you can provide the following parameters:

- `message_history_limit`: Specify how many historical messages you want included in the new question/answer round for an agent.
- `prompt`: Use this parameter to customize the LLM prompt. For example, the following example adds a new instruction `always learn useful information from chat history` 
and a new parameter `next_action`:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "question": "What's the population of New York City in 2023?",
    "next_action": "then compare with Seattle population of 2023",
    "memory_id": "gQ75lI0BHcHmo_cz2acL",
    "message_history_limit": 5,
    "prompt": "\n\nHuman:You are a professional data analysist. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\nContext:\n${parameters.population_knowledge_base.output:-}\n\n${parameters.chat_history:-}\n\nHuman:always learn useful information from chat history\nHuman:${parameters.question}, ${parameters.next_action}\n\nAssistant:"
  }
}
```
{% include copy-curl.html %}

The response contains the answer generated by the LLM:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "memory_id",
          "result": "gQ75lI0BHcHmo_cz2acL"
        },
        {
          "name": "parent_message_id",
          "result": "wQ4JlY0BHcHmo_cz8Kc-"
        },
        {
          "name": "bedrock_claude_model",
          "result": """ Based on the context given:
- The current metro area population of New York City in 2023 is 18,937,000
- The current metro area population of Seattle in 2023 is 3,519,000
- So the population of New York City in 2023 (18,937,000) is much higher than the population of Seattle in 2023 (3,519,000)"""
        }
      ]
    }
  ]
}
```

If you know which tool the agent should use to execute a particular Predict API request, you can specify the tool when executing the agent. For example, if you want to translate the preceding answer into Chinese, you don't need to retrieve any data from the knowledge base. To run only the Claude model, specify the `bedrock_claude_model` tool in the `selected_tools` parameter:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "question": "Translate last answer into Chinese?",
    "selected_tools": ["bedrock_claude_model"]
  }
}
```
{% include copy-curl.html %}

The agent will run the tools one by one in the new order defined in `selected_tools`. 
{: .note}

## Configuring multiple knowledge bases

You can configure multiple knowledge bases for an agent. For example, if you have both product description and comment data, you can configure the agent with the following two tools:

```json
{
    "name": "My product agent",
    "type": "conversational_flow",
    "description": "This is an agent with product description and comments knowledge bases.",
    "memory": {
        "type": "conversation_index"
    },
    "app_type": "rag",
    "tools": [
        {
            "type": "VectorDBTool",
            "name": "product_description_vectordb",
            "parameters": {
                "model_id": "your_embedding_model_id",
                "index": "product_description_data",
                "embedding_field": "product_description_embedding",
                "source_field": [
                    "product_description"
                ],
                "input": "${parameters.question}"
            }
        },
        {
            "type": "VectorDBTool",
            "name": "product_comments_vectordb",
            "parameters": {
                "model_id": "your_embedding_model_id",
                "index": "product_comments_data",
                "embedding_field": "product_comment_embedding",
                "source_field": [
                    "product_comment"
                ],
                "input": "${parameters.question}"
            }
        },
        {
            "type": "MLModelTool",
            "description": "A general tool to answer any question",
            "parameters": {
                "model_id": "{{llm_model_id}}",
                "prompt": "\n\nHuman:You are a professional product recommendation engine. You will always recommend product based on the given context. If you don't have enough context, you will ask Human to provide more information. If you don't see any related product to recommend, just say we don't have such product. \n\n Context:\n${parameters.product_description_vectordb.output}\n\n${parameters.product_comments_vectordb.output}\n\nHuman:${parameters.question}\n\nAssistant:"
            }
        }
    ]
}
```
{% include copy-curl.html %}

When you run the agent, the agent will query product description and comment data and then send the query results and the question to the LLM.

To query a specific knowledge base, specify it in `selected_tools`. For example, if the question relates only to product comments, you can retrieve information only from `product_comments_vectordb`:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
  "parameters": {
    "question": "What feature people like the most for Amazon Echo Dot",
    "selected_tools": ["product_comments_vectordb", "MLModelTool"]
  }
}
```
{% include copy-curl.html %}

## Running queries on an index

Use `SearchIndexTool` to run any OpenSearch query on any index.

### Setup: Register an agent

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Demo agent",
    "type": "conversational_flow",
    "description": "This agent supports running any search query",
    "memory": {
        "type": "conversation_index"
    },
    "app_type": "rag",
    "tools": [
        {
            "type": "SearchIndexTool",
            "parameters": {
                "input": "{\"index\": \"${parameters.index}\", \"query\": ${parameters.query} }"
            }
        },
        {
            "type": "MLModelTool",
            "description": "A general tool to answer any question",
            "parameters": {
                "model_id": "your_llm_model_id",
                "prompt": "\n\nHuman:You are a professional data analysist. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\n Context:\n${parameters.SearchIndexTool.output:-}\n\nHuman:${parameters.question}\n\nAssistant:"
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Run a BM25 query

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
    "parameters": {
        "question": "what's the population increase of Seattle from 2021 to 2023?",
        "index": "test_population_data",
        "query": {
            "query": {
                "match": {
                    "population_description": "${parameters.question}"
                }
            },
            "size": 2,
            "_source": "population_description"
        }
    }
}
```
{% include copy-curl.html %}

### Exposing only the `question` parameter

To expose only the `question` parameter, define the agent as follows:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Demo agent",
  "type": "conversational_flow",
  "description": "This is a test agent support running any search query",
  "memory": {
    "type": "conversation_index"
  },
  "app_type": "rag",
  "tools": [
    {
      "type": "SearchIndexTool",
      "parameters": {
        "input": "{\"index\": \"${parameters.index}\", \"query\": ${parameters.query} }",
        "index": "test_population_data",
        "query": {
          "query": {
            "match": {
              "population_description": "${parameters.question}"
            }
          },
          "size": 2,
          "_source": "population_description"
        }
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "your_llm_model_id",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\n Context:\n${parameters.SearchIndexTool.output:-}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Now you can run the agent specifying only the `question` parameter:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
    "parameters": {
        "question": "what's the population increase of Seattle from 2021 to 2023?"
    }
}
```
{% include copy-curl.html %}

### Run a neural search query

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
    "parameters": {
        "question": "what's the population increase of Seattle from 2021 to 2023??",
        "index": "test_population_data",
        "query": {
            "query": {
                "neural": {
                    "population_description_embedding": {
                        "query_text": "${parameters.question}",
                        "model_id": "your_embedding_model_id",
                        "k": 10
                    }
                }
            },
            "size": 2,
            "_source": ["population_description"]
        }
    }
}
```
{% include copy-curl.html %}

To expose the `question` parameter, see [Exposing only the `question` parameter](#exposing-only-the-question-parameter).

### Run a hybrid search query

Hybrid search combines keyword and neural search to improve search relevance. For more information, see [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

Configure a search pipeline:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
    "description": "Post processor for hybrid search",
    "phase_results_processors": [
      {
        "normalization-processor": {
          "normalization": {
            "technique": "min_max"
          },
          "combination": {
            "technique": "arithmetic_mean",
            "parameters": {
              "weights": [
                0.3,
                0.7
              ]
            }
          }
        }
      }
    ]
  }
```
{% include copy-curl.html %}

Run an agent with a hybrid query:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
    "parameters": {
        "question": "what's the population increase of Seattle from 2021 to 2023??",
        "index": "test_population_data",
        "query": {
            "_source": {
                "exclude": [
                    "population_description_embedding"
                ]
            },
            "size": 2,
            "query": {
                "hybrid": {
                    "queries": [
                        {
                            "match": {
                                "population_description": {
                                    "query": "${parameters.question}"
                                }
                            }
                        },
                        {
                            "neural": {
                                "population_description_embedding": {
                                    "query_text": "${parameters.question}",
                                    "model_id": "your_embedding_model_id",
                                    "k": 10
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

To expose the `question` parameter, see [Exposing only the `question` parameter](#exposing-only-the-question-parameter).

### Natural language query

The `PPLTool` can translate a natural language query (NLQ) to [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) and execute the generated PPL query.

#### Setup

Before you start, go to the OpenSearch Dashboards home page, select `Add sample data`, and then add `Sample eCommerce orders`.

<!-- vale off -->
#### Step 1: Register an agent with the PPLTool
<!-- vale on -->

The `PPLTool` has the following parameters:

- `model_type` (Enum): `CLAUDE`, `OPENAI`, or `FINETUNE`.
- `execute` (Boolean): If `true`, executes the generated PPL query.
- `input` (String): You must provide the `index` and `question` as inputs.

For this tutorial, you'll use Bedrock Claude, so set the `model_type` to `CLAUDE`:

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Demo agent for NLQ",
    "type": "conversational_flow",
    "description": "This is a test flow agent for NLQ",
    "memory": {
        "type": "conversation_index"
    },
    "app_type": "rag",
    "tools": [
        {
            "type": "PPLTool",
            "parameters": {
                "model_id": "your_ppl_model_id",
                "model_type": "CLAUDE",
                "execute": true,
                "input": "{\"index\": \"${parameters.index}\", \"question\": ${parameters.question} }"
            }
        },
        {
            "type": "MLModelTool",
            "description": "A general tool to answer any question",
            "parameters": {
                "model_id": "your_llm_model_id",
                "prompt": "\n\nHuman:You are a professional data analysist. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\n Context:\n${parameters.PPLTool.output:-}\n\nHuman:${parameters.question}\n\nAssistant:"
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Step 2: Run the agent with an NLQ

Run the agent:

```json
POST /_plugins/_ml/agents/your_agent_id/_execute
{
    "parameters": {
        "question": "How many orders do I have in last week",
        "index": "opensearch_dashboards_sample_data_ecommerce"
    }
}
```
{% include copy-curl.html %}

The response contains the answer generated by the LLM:

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "memory_id",
                    "result": "sqIioI0BJhBwrVXYeYOM"
                },
                {
                    "name": "parent_message_id",
                    "result": "s6IioI0BJhBwrVXYeYOW"
                },
                {
                    "name": "MLModelTool",
                    "result": " Based on the given context, the number of orders in the last week is 3992. The data shows a query that counts the number of orders where the order date is greater than 1 week ago. The query result shows the count as 3992."
                }
            ]
        }
    ]
}
```

For more information, obtain trace data by calling the [Get Message Traces API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message-traces/):

```json
GET _plugins/_ml/memory/message/s6IioI0BJhBwrVXYeYOW/traces
```
{% include copy-curl.html %}