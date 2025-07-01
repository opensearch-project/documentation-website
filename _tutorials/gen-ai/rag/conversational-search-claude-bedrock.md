---
layout: default
title: Conversational search using Anthropic Claude on Amazon Bedrock
parent: RAG
grand_parent: Generative AI
nav_order: 160
redirect_from:
  - /vector-search/tutorials/conversational-search/conversational-search-claude-bedrock/
  - /tutorials/vector-search/rag/conversational-search/conversational-search-claude-bedrock/
---

# Conversational search using Anthropic Claude on Amazon Bedrock

This tutorial shows you how to configure conversational search with retrieval-augmented generation (RAG) using Anthropic Claude models hosted on Amazon Bedrock. For more information, see [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).

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

You can configure conversational search using the following Amazon Bedrock APIs:

1. [Converse API](#option-1-amazon-bedrock-converse-api)
2. [Invoke API](#option-2-amazon-bedrock-invoke-api)

<!-- vale off -->
## Option 1: Amazon Bedrock Converse API
<!-- vale on -->

Follow these steps to use the Amazon Bedrock Converse API for conversational search.

### Step 1.1: Create a connector and register the model

First, create a connector for the Claude model. In this example, you'll use Anthropic Claude 3.5 Sonnet:

```json
POST _plugins/_ml/connectors/_create
{
    "name": "Amazon Bedrock claude v3",
    "description": "Test connector for Amazon Bedrock claude v3",
    "version": 1,
    "protocol": "aws_sigv4",
    "credential": {
        "access_key": "your_access_key",
        "secret_key": "your_secret_key",
        "session_token": "your_session_token"
    },
    "parameters": {
        "region": "your_aws_region",
        "service_name": "bedrock",
        "model": "anthropic.claude-3-5-sonnet-20240620-v1:0",
        "system_prompt": "you are a helpful assistant.",
        "temperature": 0.0,
        "top_p": 0.9,
        "max_tokens": 1000
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
            "request_body": "{ \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": ${parameters.messages} , \"inferenceConfig\": {\"temperature\": ${parameters.temperature}, \"topP\": ${parameters.top_p}, \"maxTokens\": ${parameters.max_tokens}} }"
        }
    ]
}
```
{% include copy-curl.html %}

To use Claude 2, specify `anthropic.claude-v2` instead of `anthropic.claude-3-5-sonnet-20240620-v1:0` as the `model`.

Note the connector ID; you'll use it to register the model.

Next, register the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Bedrock Claude3.5 model",
    "description": "Bedrock Claude3.5 model",
    "function_name": "remote",
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
        "role": "user",
        "content": [
          {
            "text": "hello"
          }
        ]
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
            "metrics": {
              "latencyMs": 955.0
            },
            "output": {
              "message": {
                "content": [
                  {
                    "text": "Hello! How can I assist you today? Feel free to ask me any questions or let me know if you need help with anything."
                  }
                ],
                "role": "assistant"
              }
            },
            "stopReason": "end_turn",
            "usage": {
              "inputTokens": 14.0,
              "outputTokens": 30.0,
              "totalTokens": 44.0
            }
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

### Step 1.2: Configure RAG

To configure RAG, create a search pipeline containing a RAG processor:

```json
PUT /_search/pipeline/my-conversation-search-pipeline-claude
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "Demo pipeline",
        "description": "Demo pipeline Using Bedrock Claude",
        "model_id": "your_model_id",
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
GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-claude
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
      "llm_model": "bedrock-converse/anthropic.claude-3-sonnet-20240229-v1:0",
      "llm_question": "What's the population increase of New York City from 2021 to 2023?",
      "context_size": 5
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
      "answer": "The population of the New York City metro area increased by 114,000 people from 2021 to 2023. In 2021, the population was 18,823,000. By 2023, it had grown to 18,937,000. This represents a total increase of about 0.61% over the two-year period, with growth rates of 0.23% from 2021 to 2022 and 0.37% from 2022 to 2023."
    }
  }
}
```

### Step 1.3: Configure conversational search

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
    "memory_id": "sBAqY5UBSzdNxlHvrSJK"
    }
    ```

2. To save the conversation history, include a memory ID in your search request:

    ```json 
    GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-claude
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
        "llm_model": "bedrock-converse/anthropic.claude-3-sonnet-20240229-v1:0",
        "llm_question": "What's the population increase of New York City from 2021 to 2023?",
        "context_size": 5,
        "memory_id": "sBAqY5UBSzdNxlHvrSJK"
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
        "answer": "The population of the New York City metro area increased by 114,000 people from 2021 to 2023. In 2021, the population was 18,823,000. By 2023, it had grown to 18,937,000. This represents a total increase of about 0.61% over the two-year period, with growth rates of 0.23% from 2021 to 2022 and 0.37% from 2022 to 2023.",
        "message_id": "sRAqY5UBSzdNxlHvzCIL"
        }
    }
    }
    ```

3. To continue the conversation, provide the same memory ID in the next search:

    ```json
    GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-claude
    {
    "query": {
        "match": {
        "text": "What's the population increase of Chicago from 2021 to 2023?"
        }
    },
    "size": 1,
    "_source": [
        "text"
    ],
    "ext": {
        "generative_qa_parameters": {
        "llm_model": "bedrock-converse/anthropic.claude-3-sonnet-20240229-v1:0",
        "llm_question": "can you compare the population increase of Chicago with New York City",
        "context_size": 5,
        "memory_id": "sBAqY5UBSzdNxlHvrSJK"
        }
    }
    }
    ```
    {% include copy-curl.html %}

    Using the conversation history from memory, the model compares Chicago's population data with the previously discussed New York City statistics:

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
            "_id": "3",
            "_score": 3.6660428,
            "_source": {
            "text": "Chart and table of population level and growth rate for the Chicago metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Chicago in 2023 is 8,937,000, a 0.4% increase from 2022.\\nThe metro area population of Chicago in 2022 was 8,901,000, a 0.27% increase from 2021.\\nThe metro area population of Chicago in 2021 was 8,877,000, a 0.14% increase from 2020.\\nThe metro area population of Chicago in 2020 was 8,865,000, a 0.03% increase from 2019."
            }
        }
        ]
    },
    "ext": {
        "retrieval_augmented_generation": {
        "answer": "Based on the provided data for Chicago, we can compare its population increase to New York City from 2021 to 2023:\n\nChicago's population increased from 8,877,000 in 2021 to 8,937,000 in 2023, a total increase of 60,000 people or about 0.68%.\n\nNew York City's population increased by 114,000 people or 0.61% in the same period.\n\nWhile New York City had a larger absolute increase, Chicago experienced a slightly higher percentage growth rate during this two-year period.",
        "message_id": "shArY5UBSzdNxlHvQyL-"
        }
    }
    }
    ```

<!-- vale off -->
## Option 2: Amazon Bedrock Invoke API
<!-- vale on -->

Follow these steps to use the Amazon Bedrock Invoke API for conversational search.

Anthropic Claude 3.x models are not supported by the Amazon Bedrock Invoke API because they require a different interface.
{: .important}

### Step 2.1: Create a connector and register the model

First, create a connector for the Claude model. In this example, you'll use Anthropic Claude v2:

```json
POST _plugins/_ml/connectors/_create
{
    "name": "Bedrock Claude2",
    "description": "Connector for Bedrock Claude2",
    "version": 1,
    "protocol": "aws_sigv4",
    "credential": {
        "access_key": "your_access_key",
        "secret_key": "your_secret_key",
        "session_token": "your_session_token"
    },
    "parameters": {
        "region": "your_aws_region",
        "service_name": "bedrock",
        "model": "anthropic.claude-v2"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
            "request_body": "{\"prompt\":\"\\n\\nHuman: ${parameters.inputs}\\n\\nAssistant:\",\"max_tokens_to_sample\":300,\"temperature\":0.5,\"top_k\":250,\"top_p\":1,\"stop_sequences\":[\"\\\\n\\\\nHuman:\"]}"
        }
    ]
}
```
{% include copy-curl.html %}

Note the connector ID; you'll use it to register the model.

Next, register the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Bedrock Claude2 model",
    "function_name": "remote",
    "description": "Bedrock Claude2 model",
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
      "inputs": "Who won the world series in 2020?"
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
            "type": "completion",
            "completion": " The Los Angeles Dodgers won the 2020 World Series, defeating the Tampa Bay Rays 4 games to 2. The World Series was played at a neutral site in Arlington, Texas due to the COVID-19 pandemic. It was the Dodgers' first World Series championship since 1988.",
            "stop_reason": "stop_sequence",
            "stop": "\n\nHuman:"
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

### Step 2.2: Configure RAG

To configure RAG, create a search pipeline containing a RAG processor:

```json
PUT /_search/pipeline/my-conversation-search-pipeline-claude2
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "Demo pipeline",
        "description": "Demo pipeline Using Bedrock Claude2",
        "model_id": "your_model_id",
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
GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-claude2
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
      "llm_model": "bedrock/claude",
      "llm_question": "What's the population increase of New York City from 2021 to 2023?",
      "context_size": 5,
      "timeout": 15
    }
  }
}
```
{% include copy-curl.html %}

The response is similar to the one in [Step 1.2](#step-12-configure-rag).

### Step 2.3: Configure conversational search

Continue to [Step 1.3](#step-13-configure-conversational-search) to configure conversational search.