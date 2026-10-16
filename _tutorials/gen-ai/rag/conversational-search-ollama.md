---
layout: default
title: Conversational search using Ollama
parent: RAG
grand_parent: Generative AI
nav_order: 180
---

# Conversational search using Ollama

This tutorial shows you how to configure conversational search with retrieval-augmented generation (RAG) using a large language model (LLM) hosted locally in [Ollama](https://ollama.com/). The tutorial uses the `qwen3:4b` model. For more information, see [Conversational search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/conversational-search/).

The connector in this tutorial calls the OpenAI-compatible Chat Completions API that Ollama provides. The same connector works with other local or self-hosted servers that provide an OpenAI-compatible API, such as llama.cpp or vLLM. To use one of these servers, change the `endpoint` and `model` connector parameters, and the trusted endpoint pattern, to match your server.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

Alternatively, you can build a RAG/conversational search using agents and tools. For more information, see [RAG chatbot with a conversational flow agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/chatbots/rag-conversational-agent/).

## Prerequisites

Before you start, set up the model server, configure the cluster settings, and ingest test data.

### Set up Ollama

Install Ollama on the host that runs OpenSearch, and then download the `qwen3:4b` model:

```bash
ollama pull qwen3:4b
```
{% include copy.html %}

By default, Ollama listens on `127.0.0.1:11434`, which this tutorial uses as the connector endpoint.

If OpenSearch runs in a Docker container, `127.0.0.1` refers to the OpenSearch container, not to the host or container that runs Ollama. In this case, use an Ollama address that the OpenSearch container can reach in the connector endpoint and the trusted endpoint pattern. If Ollama runs in a container on the same Docker network as OpenSearch, use the Ollama container name, for example, `ollama:11434`. If Ollama runs on the host, configure Ollama to listen on an address that the container can reach by setting the `OLLAMA_HOST` environment variable.
{: .note}

### Configure cluster settings

By default, ML Commons rejects connector requests to hosts that resolve to private or loopback IP addresses, such as `127.0.0.1`. Additionally, the connector URL must match a pattern in the `plugins.ml_commons.trusted_connector_endpoints_regex` setting, and the default patterns don't include a local `http://` endpoint.

To allow the connector to send requests to the local Ollama server, enable private IP addresses for connectors and add the Ollama endpoint to the trusted endpoints:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.connector.private_ip_enabled": true,
    "plugins.ml_commons.trusted_connector_endpoints_regex": [
      "^http://127\\.0\\.0\\.1:11434/.*$"
    ]
  }
}
```
{% include copy-curl.html %}

The `plugins.ml_commons.trusted_connector_endpoints_regex` setting replaces the entire list of trusted endpoints, including the default patterns. If your cluster uses connectors for other endpoints, include their patterns in the list as well. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#adding-trusted-endpoints).
{: .important}

To view the current list of trusted endpoints, including the default patterns, send the following request:

```json
GET /_cluster/settings?include_defaults=true&filter_path=*.plugins.ml_commons.trusted_connector_endpoints_regex
```
{% include copy-curl.html %}

### Ingest test data

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

First, create a connector for the `qwen3:4b` model hosted in Ollama:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Ollama Qwen3",
  "description": "Connector for the Qwen3 model hosted in Ollama",
  "version": "1.0",
  "protocol": "http",
  "parameters": {
    "endpoint": "127.0.0.1:11434",
    "model": "qwen3:4b"
  },
  "credential": {
    "openAI_key": "your_api_key"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "http://${parameters.endpoint}/v1/chat/completions",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
    }
  ]
}
```
{% include copy-curl.html %}

Ollama doesn't check the API key, so you can provide any value in `openAI_key`. If your model server requires an API key, provide the key in `openAI_key`; the connector sends it in the `Authorization` header as a bearer token. For more information, see [this blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/ollama_connector_chat_blueprint.md).

The `qwen3:4b` model generates its reasoning before the answer, so a response can take several minutes on a host without a GPU. If requests to the model fail with a timeout, increase the connector's read timeout, which defaults to 30 seconds, by adding a `client_config` object with a larger `read_timeout` value (in seconds), for example, `"client_config": {"read_timeout": 300}`. For more information, see [Request body fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).
{: .note}

Note the connector ID; you'll use it to register the model.

Next, register and deploy the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "Ollama Qwen3 model",
  "function_name": "remote",
  "description": "Qwen3 model hosted in Ollama",
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

The response contains the text generated by the model. Ollama returns the answer in the `content` field and the model's reasoning in a separate `reasoning` field. The following response is shortened:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "chatcmpl-417",
            "object": "chat.completion",
            "created": 1792110903,
            "model": "qwen3:4b",
            "system_fingerprint": "fp_ollama",
            "choices": [
              {
                "index": 0,
                "message": {
                  "role": "assistant",
                  "content": "The **Los Angeles Dodgers** won the 2020 World Series, defeating the **Tampa Bay Rays** in a best-of-seven series (4–2).",
                  "reasoning": "Okay, the user is asking who won the World Series in 2020. Let me think about this carefully."
                },
                "finish_reason": "stop"
              }
            ],
            "usage": {
              "prompt_tokens": 33,
              "completion_tokens": 801,
              "total_tokens": 834
            }
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

The answer that the RAG processor returns in the following steps contains only the `content` text, not the reasoning.

## Step 2: Configure RAG

To configure RAG, create a search pipeline containing a RAG processor:

```json
PUT /_search/pipeline/my-conversation-search-pipeline-ollama
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "Demo pipeline",
        "description": "Demo pipeline using Ollama",
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

Run a basic RAG search without storing conversation history. The RAG processor passes the `llm_model` value to the connector as the `model` parameter, so set `llm_model` to the name of the model in Ollama:

```json
GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-ollama
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
      "llm_model": "qwen3:4b",
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
    "max_score": 4.110037,
    "hits": [
      {
        "_index": "qa_demo",
        "_id": "2",
        "_score": 4.110037,
        "_source": {
          "text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."
        }
      }
    ]
  },
  "ext": {
    "retrieval_augmented_generation": {
      "answer": "The population increased by 114,000 people (from 18,823,000 in 2021 to 18,937,000 in 2023). This represents a 0.60% growth over the two-year period."
    }
  }
}
```

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

2. To save the conversation history, include the memory ID in your search request:

    ```json
    GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-ollama
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
          "llm_model": "qwen3:4b",
          "llm_question": "What's the population increase of New York City from 2021 to 2023?",
          "context_size": 5,
          "timeout": 15,
          "memory_id": "rBAbY5UBSzdNxlHvIyI3"
        }
      }
    }
    ```
    {% include copy-curl.html %}

    The response contains the model answer, the related document, and the ID of the message stored in the memory:

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
        "max_score": 4.110037,
        "hits": [
          {
            "_index": "qa_demo",
            "_id": "2",
            "_score": 4.110037,
            "_source": {
              "text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."
            }
          }
        ]
      },
      "ext": {
        "retrieval_augmented_generation": {
          "answer": "New York City's metro area population increased by 114,000 from 2021 (18,823,000) to 2023 (18,937,000), representing a 0.61% rise over that two-year period.",
          "message_id": "rRAcY5UBSzdNxlHvyiI1"
        }
      }
    }
    ```

3. To continue the conversation, provide the same memory ID in the next search:

    ```json
    GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-ollama
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
          "llm_model": "qwen3:4b",
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
        "max_score": 1.666383,
        "hits": [
          {
            "_index": "qa_demo",
            "_id": "4",
            "_score": 1.666383,
            "_source": {
              "text": "Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."
            }
          }
        ]
      },
      "ext": {
        "retrieval_augmented_generation": {
          "answer": "New York City grew by 114,000 (0.61%) from 18.82M in 2021 to 18.94M in 2023. Miami increased by 98,000 (0.8% annually) from 6.17M in 2021 to 6.27M in 2023.",
          "message_id": "rhAdY5UBSzdNxlHv5SKa"
        }
      }
    }
    ```

## Related documentation

- [Conversational search with RAG]({{site.url}}{{site.baseurl}}/vector-search/ai-search/conversational-search/)
- [Retrieval-augmented generation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rag-processor/)
- [Connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/)
