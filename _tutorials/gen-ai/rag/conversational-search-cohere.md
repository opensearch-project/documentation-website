---
layout: default
title: Conversational search using Cohere Command
parent: RAG
grand_parent: Generative AI
nav_order: 150
redirect_from:
  - /ml-commons-plugin/tutorials/conversational-search-cohere/
  - /vector-search/tutorials/conversational-search/conversational-search-cohere/
  - /tutorials/vector-search/rag/conversational-search/conversational-search-cohere/
---

# Conversational search using Cohere Command

This tutorial shows you how to configure conversational search with RAG using the Cohere Command model. For more information, see [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).

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

## Step 1: Create a connector and register a model

Conversational search only supports the [OpenAI](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/open_ai_connector_chat_blueprint.md) 
and [Amazon Bedrock Claude](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_anthropic_claude_blueprint.md) input/output styles.
{: .important}

This tutorial follows the Amazon Bedrock Claude model input/output style by:
- Mapping the Cohere Command `message` input parameter to the `inputs` parameter in order to match the Cohere Claude model input style.
- Using a post-processing function to convert the Cohere Command model output to the Claude model output style.

Create a connector for the Cohere Command model:

```json
POST _plugins/_ml/connectors/_create
{
    "name": "Cohere Chat Model",
    "description": "The connector to Cohere's public chat API",
    "version": "1",
    "protocol": "http",
    "credential": {
        "cohere_key": "your_cohere_api_key"
    },
    "parameters": {
        "model": "command"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://api.cohere.ai/v1/chat",
            "headers": {
                "Authorization": "Bearer ${credential.cohere_key}",
                "Request-Source": "unspecified:opensearch"
            },
            "request_body": "{ \"message\": \"${parameters.inputs}\", \"model\": \"${parameters.model}\" }",
            "post_process_function": "\n    String escape(def input) { \n      if (input.contains(\"\\\\\")) {\n        input = input.replace(\"\\\\\", \"\\\\\\\\\");\n      }\n      if (input.contains(\"\\\"\")) {\n        input = input.replace(\"\\\"\", \"\\\\\\\"\");\n      }\n      if (input.contains('\r')) {\n        input = input = input.replace('\r', '\\\\r');\n      }\n      if (input.contains(\"\\\\t\")) {\n        input = input.replace(\"\\\\t\", \"\\\\\\\\\\\\t\");\n      }\n      if (input.contains('\n')) {\n        input = input.replace('\n', '\\\\n');\n      }\n      if (input.contains('\b')) {\n        input = input.replace('\b', '\\\\b');\n      }\n      if (input.contains('\f')) {\n        input = input.replace('\f', '\\\\f');\n      }\n      return input;\n    }\n    def name = 'response';\n    def result = params.text;\n    def json = '{ \"name\": \"' + name + '\",' +\n          '\"dataAsMap\": { \"completion\":  \"' + escape(result) +\n          '\"}}';\n    return json;\n   \n    "
        }
    ]
}
```
{% include copy-curl.html %}

Starting in OpenSearch 2.12, you can use the default `escape` function directly in the `post_process_function`:

```json
"post_process_function": "    \n    def name = 'response';\n    def result = params.text;\n    def json = '{ \"name\": \"' + name + '\",' +\n                 '\"dataAsMap\": { \"completion\":  \"' + escape(result) +\n               '\"}}';\n    return json;"
```
{% include copy-curl.html %}

Note the connector ID; you'll use it to register the model.

Register the Cohere Command model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Cohere command model",
    "function_name": "remote",
    "description": "Cohere command model",
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
    "inputs": "What is the weather like in Seattle?"
  }
}
```
{% include copy-curl.html %}

The response contains the LLM completion:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "completion": """It is difficult to provide a comprehensive answer without a specific location or time frame in mind. 

As an AI language model, I have no access to real-time data or the ability to provide live weather reports. Instead, I can offer some general information about Seattle's weather, which is known for its mild, wet climate. 

Located in the Pacific Northwest region of the United States, Seattle experiences a maritime climate with cool, dry summers and mild, wet winters. While it is best known for its rainy days, Seattle's annual rainfall is actually less than New York City and Boston. 

Would you like me to provide more details on Seattle's weather?  Or, if you have a specific date or location in mind, I can try to retrieve real-time or historical weather information for you."""
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

## Step 2: Configure conversational search

Create a search pipeline containing a RAG processor:

```json
PUT /_search/pipeline/my-conversation-search-pipeline-cohere
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

To run a conversational search, specify its parameters in the `generative_qa_parameters` object:

```json
GET /qa_demo/_search?search_pipeline=my-conversation-search-pipeline-cohere
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

The response contains the model's answer:

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
          "text": """Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."""
        }
      }
    ]
  },
  "ext": {
    "retrieval_augmented_generation": {
      "answer": "The population of the New York City metro area increased by about 210,000 from 2021 to 2023. The 2021 population was 18,823,000, and in 2023 it was 18,937,000. The average growth rate is 0.23% yearly."
    }
  }
}
```