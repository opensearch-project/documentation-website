---
layout: default
title: Conversational search using OpenAI
parent: RAG
grand_parent: Generative AI
nav_order: 170
redirect_from:
  - /vector-search/tutorials/conversational-search/conversational-search-openai/
  - /tutorials/vector-search/rag/conversational-search/conversational-search-openai/
---

# Conversational search using OpenAI

This tutorial shows you how to configure conversational search with retrieval-augmented generation (RAG) using the OpenAI `gpt-4o` model. For more information, see [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

Alternatively, you can build a RAG/conversational search using agents and tools. For more information, see [Retrieval-augmented generation chatbot]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/rag-conversational-agent/).

## Prerequisite

Ingest test data:

```json
POST _bulk
{"index": {"_index": "qa_demo", "_id": "1"}}
{"text": "Chart and table of population level and growth rate for the Ogden-Layton metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of Ogden-Layton in 2023 is 750,000, a 1.63% increase from 2022.\nThe metro area population of Ogden-Layton in 2022 was 738,000, a 1.79% increase from 2021.\nThe metro area population of Ogden-Layton in 2021 was 725,000, a 1.97% increase from 2020.\nThe metro area population of Ogden-Layton in 2020 was 711,000, a 2.16% increase from 2019."}
{"index": {"_index": "qa_demo", "_id": "2"}}
{"text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."}
{"index": {"_index": "qa_demo", "_id": "3"}}
{"text": "Chart and table of population level and growth rate for the Chicago metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Chicago in 2023 is 8,937,000, a 0.4% increase from 2022.\\nThe metro area population of Chicago in 2022 was 8,901,000, a 0.27% increase from 2021.\\nThe metro area population of Chicago in 2021 was 8,877,000, a 0.14% increase from 2020.\\nThe metro area population of Chicago in 2020 was 8,865,000, a 0.03% increase from 2019."}
{"index": {"_index": "qa_demo", "_id": "4"}}
{"text": "Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."}
{"index": {"_index": "qa_demo", "_id": "5"}}
{"text": "Chart and table of population level and growth rate for the Austin metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Austin in 2023 is 2,228,000, a 2.39% increase from 2022.\\nThe metro area population of Austin in 2022 was 2,176,000, a 2.79% increase from 2021.\\nThe metro area population of Austin in 2021 was 2,117,000, a 3.12% increase from 2020.\\nThe metro area population of Austin in 2020 was 2,053,000, a 3.43% increase from 2019."}
{"index": {"_index": "qa_demo", "_id": "6"}}
{"text": "Chart and table of population level and growth rate for the Seattle metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Seattle in 2023 is 3,519,000, a 0.86% increase from 2022.\\nThe metro area population of Seattle in 2022 was 3,489,000, a 0.81% increase from 2021.\\nThe metro area population of Seattle in 2021 was 3,461,000, a 0.82% increase from 2020.\\nThe metro area population of Seattle in 2020 was 3,433,000, a 0.79% increase from 2019."}
```
{% include copy-curl.html %}

## Step 1: Create a connector and register the model

First, create a connector for the OpenAI `gpt-4o` model:

```json
POST _plugins/_ml/connectors/_create
{
  "name": "OpenAI GPT-4o",
  "description": "Connector of OpenAI GPT-4o",
  "version": "1.0",
  "protocol": "http",
  "parameters": {
    "endpoint": "api.openai.com",
    "model": "gpt-4o"
  },
  "credential": {
    "openAI_key": "your_openai_key"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://${parameters.endpoint}/v1/chat/completions",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
    }
  ]
}
```
{% include copy-curl.html %}

For more information, see [this blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/open_ai_connector_chat_blueprint.md).

Note the connector ID; you'll use it to register the model.

Next, register the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "OpenAI GPT-4o model",
    "function_name": "remote",
    "description": "OpenAI GPT-4o model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID; you'll use it in the following steps.

Test the model:

```json
POST /_plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Who won the world series in 2020?"
      }
    ]
  }
}
```
{% include copy-curl.html %}

The response contains the text generated by the model:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "chatcmpl-A9Rtgkyk4PVlLil2u4JRUH2oXb25v",
            "object": "chat.completion",
            "created": 1.726815552E9,
            "model": "gpt-4o-2024-05-13",
            "choices": [
              {
                "index": 0.0,
                "message": {
                  "role": "assistant",
                  "content": "The Los Angeles Dodgers won the World Series in 2020. They defeated the Tampa Bay Rays in six games to secure their first championship since 1988.",
                  "refusal": null
                },
                "logprobs": null,
                "finish_reason": "stop"
              }
            ],
            "usage": {
              "prompt_tokens": 27.0,
              "completion_tokens": 32.0,
              "total_tokens": 59.0,
              "completion_tokens_details": {
                "reasoning_tokens": 0.0
              }
            },
            "system_fingerprint": "fp_52a7f40b0b"
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

## Step 2: Configure RAG

To configure RAG, create a search pipeline containing a RAG processor:

```json
PUT /_search/pipeline/my-conversation-search-pipeline-openai
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "Demo pipeline",
        "description": "Demo pipeline Using Cohere",
        "model_id": "your_model_id_created_in_step1",
        "context_field_list": [
          "text"
        ],
        "system_prompt": "You are a helpful assistant",
        "user_instructions": "Generate a concise and informative answer in less than 100 words for the given question"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Run a basic RAG search without storing conversation history:

```json
GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-openai
{
  "query": {
    "match": {
      "text": "What's the population increase of New York City from 2021 to 2023?"
    }
  },
  "size": 1,
  "_source": [
    "text"
  ],
  "ext": {
    "generative_qa_parameters": {
      "llm_model": "gpt-4o",
      "llm_question": "What's the population increase of New York City from 2021 to 2023?",
      "context_size": 5,
      "timeout": 15
    }
  }
}
```
{% include copy-curl.html %}

The response contains the model answer and related document:

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": 9.042081,
    "hits": [
      {
        "_index": "qa_demo",
        "_id": "2",
        "_score": 9.042081,
        "_source": {
          "text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."
        }
      }
    ]
  },
  "ext": {
    "retrieval_augmented_generation": {
      "answer": "The population of the New York City metro area increased by 114,000 from 2021 to 2023, rising from 18,823,000 in 2021 to 18,937,000 in 2023."
    }
  }
}
```
{% include copy-curl.html %}

## Step 3: Configure conversational search

Follow these steps to configure conversational search by storing conversation history in a memory.

1. Create a memory:

    ```json
    POST /_plugins/_ml/memory/
    {
    "name": "Conversation about NYC population"
    }
    ```
    {% include copy-curl.html %}

    The response contains the memory ID:

    ```json
    {
    "memory_id": "rBAbY5UBSzdNxlHvIyI3"
    }
    ```

2. To save the conversation history, include a memory ID in your search request:

    ```json
    GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-openai
    {
    "query": {
        "match": {
        "text": "What's the population increase of New York City from 2021 to 2023?"
        }
    },
    "size": 1,
    "_source": [
        "text"
    ],
    "ext": {
        "generative_qa_parameters": {
        "llm_model": "gpt-4o",
        "llm_question": "What's the population increase of New York City from 2021 to 2023?",
        "context_size": 5,
        "timeout": 15,
        "memory_id": "rBAbY5UBSzdNxlHvIyI3"
        }
    }
    }
    ```
    {% include copy-curl.html %}

    The response contains the model answer and related document:

    ```json
    {
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
        "value": 6,
        "relation": "eq"
        },
        "max_score": 9.042081,
        "hits": [
        {
            "_index": "qa_demo",
            "_id": "2",
            "_score": 9.042081,
            "_source": {
            "text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."
            }
        }
        ]
    },
    "ext": {
        "retrieval_augmented_generation": {
        "answer": "The population of the New York City metro area increased from 18,823,000 in 2021 to 18,937,000 in 2023. This represents an increase of 114,000 people over the two-year period.",
        "message_id": "rRAcY5UBSzdNxlHvyiI1"
        }
    }
    }
    ```

3. To continue the conversation, provide the same memory ID in the next search:

    ```json
    GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-openai
    {
    "query": {
        "match": {
        "text": "What's the population increase of Miami from 2021 to 2023?"
        }
    },
    "size": 1,
    "_source": [
        "text"
    ],
    "ext": {
        "generative_qa_parameters": {
        "llm_model": "gpt-4o",
        "llm_question": "compare population increase of New York City and Miami",
        "context_size": 5,
        "timeout": 15,
        "memory_id": "rBAbY5UBSzdNxlHvIyI3"
        }
    }
    }
    ```
    {% include copy-curl.html %}

    Using the conversation history from memory, the model compares Miami's population data with the previously discussed New York City statistics:

    ```json
    {
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
        "value": 6,
        "relation": "eq"
        },
        "max_score": 3.6660428,
        "hits": [
        {
            "_index": "qa_demo",
            "_id": "4",
            "_score": 3.6660428,
            "_source": {
            "text": "Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."
            }
        }
        ]
    },
    "ext": {
        "retrieval_augmented_generation": {
        "answer": "From 2021 to 2023, the New York City metro area increased by 114,000 people, while the Miami metro area grew by 98,000 people. This means New York City saw a slightly larger population increase compared to Miami over the same period.",
        "message_id": "rhAdY5UBSzdNxlHv5SKa"
        }
    }
    }
    ```