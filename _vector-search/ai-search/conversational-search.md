---
layout: default
title: Conversational search with RAG
parent: AI search
has_children: false
nav_order: 70
redirect_from:
  - /ml-commons-plugin/conversational-search/
  - /search-plugins/conversational-search/
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/conversational-search/
---

# Conversational search with RAG

Conversational search allows you to ask questions in natural language and refine the answers by asking follow-up questions. Thus, the conversation becomes a dialog between you and a large language model (LLM). For this to happen, instead of answering each question individually, the model needs to remember the context of the entire conversation. 

Conversational search is implemented with the following components:

- [Conversation history](#conversation-history): Allows an LLM to remember the context of the current conversation and understand follow-up questions.
- [Retrieval-augmented generation (RAG)](#rag): Allows an LLM to supplement its static knowledge base with proprietary or current information.

## Conversation history

Conversation history consists of a simple CRUD-like API comprising two resources: _memories_ and _messages_. All messages for the current conversation are stored within one conversation _memory_. A _message_ represents a question/answer pair: a human-input question and an AI answer. Messages do not exist by themselves; they must be added to a memory. 

## RAG

RAG retrieves data from the index and history and sends all the information as context to the LLM. The LLM then supplements its static knowledge base with the dynamically retrieved data. In OpenSearch, RAG is implemented through a search pipeline containing a [retrieval-augmented generation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rag-processor/). The processor intercepts OpenSearch query results, retrieves previous messages in the conversation from the conversation memory, and sends a prompt to the LLM. After the processor receives a response from the LLM, it saves the response in conversation memory and returns both the original OpenSearch query results and the LLM response. 

As of OpenSearch 2.11, the RAG technique has only been tested with OpenAI models and the Anthropic Claude model on Amazon Bedrock.
{: .warning}

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory. No user can see another user's memory.
{: .note}

## Prerequisites

To begin using conversational search, enable conversation memory and RAG pipeline features:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory_feature_enabled": true,
    "plugins.ml_commons.rag_pipeline_feature_enabled": true
  }
}
```
{% include copy-curl.html %}

## Configuring conversational search

There are two ways to configure conversational search:

- [**Automated workflow**](#automated-workflow) (Recommended for quick setup): Automatically create an ingest pipeline and index with minimal configuration.
- [**Manual setup**](#manual-setup) (Recommended for custom configurations): Manually configure each component for greater flexibility and control.

## Automated workflow

OpenSearch provides a [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates#conversational-search-using-an-llm) that automatically creates a connector for the LLM, registers and deploys the LLM, and configures a search pipeline. You must provide the API key for the configured LLM when creating a workflow. Review the conversational search workflow template [defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/conversational-search-defaults.json) to determine whether you need to update any of the parameters. For example, if the model endpoint is different from the default (`https://api.cohere.ai/v1/chat`), specify the endpoint of your model in the `create_connector.actions.url` parameter. To create the default conversational search workflow, send the following request:

```json
POST /_plugins/_flow_framework/workflow?use_case=conversational_search_with_llm_deploy&provision=true
{
"create_connector.credential.key": "<YOUR_API_KEY>"
}
```
{% include copy-curl.html %}

OpenSearch responds with a workflow ID for the created workflow:

```json
{
  "workflow_id" : "U_nMXJUBq_4FYQzMOS4B"
}
```

To check the workflow status, send the following request:

```json
GET /_plugins/_flow_framework/workflow/U_nMXJUBq_4FYQzMOS4B/_status
```
{% include copy-curl.html %}

Once the workflow completes, the `state` changes to `COMPLETED`. The workflow creates the following components:

- A model connector: Connects to the specified model.
- A registered and deployed model: The model is ready for inference.
- A search pipeline: Configured to handle conversational queries.

You can now continue with [steps 4, 5, and 6](#step-4-ingest-rag-data-into-an-index) to ingest RAG data into the index, create a conversation memory, and use the pipeline for RAG.

## Manual setup

To manually configure conversational search, follow these steps:

1. [Create a connector for a model](#step-1-create-a-connector-for-a-model).
1. [Register and deploy the model](#step-2-register-and-deploy-the-model).
1. [Create a search pipeline](#step-3-create-a-search-pipeline).
1. [Ingest RAG data into an index](#step-4-ingest-rag-data-into-an-index).
1. [Create a conversation memory](#step-5-create-a-conversation-memory).
1. [Use the pipeline for RAG](#step-6-use-the-pipeline-for-rag).

### Step 1: Create a connector for a model

RAG requires an LLM in order to function. To connect to an LLM, create a [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). The following request creates a connector for the OpenAI GPT 3.5 model:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "OpenAI Chat Connector",
  "description": "The connector to public OpenAI model service for GPT 3.5",
  "version": 2,
  "protocol": "http",
  "parameters": {
    "endpoint": "api.openai.com",
    "model": "gpt-3.5-turbo",
    "temperature": 0
  },
  "credential": {
    "openAI_key": "<YOUR_OPENAI_KEY>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://${parameters.endpoint}/v1/chat/completions",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": """{ "model": "${parameters.model}", "messages": ${parameters.messages}, "temperature": ${parameters.temperature} }"""
    }
  ]
}
```
{% include copy-curl.html %}

OpenSearch responds with a connector ID for the connector:

```json
{
  "connector_id": "u3DEbI0BfUsSoeNTti-1"
}
```

For example requests that connect to other services and models, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
{: .tip}

### Step 2: Register and deploy the model

Register the LLM for which you created a connector in the previous step. To register the model with OpenSearch, provide the `connector_id` returned in the previous step:

```json
POST /_plugins/_ml/models/_register
{
  "name": "openAI-gpt-3.5-turbo",
  "function_name": "remote",
  "description": "test model",
  "connector_id": "u3DEbI0BfUsSoeNTti-1"
}
``` 
{% include copy-curl.html %}

OpenSearch returns a task ID for the register task and a model ID for the registered model:

```json
{
  "task_id": "gXDIbI0BfUsSoeNT_jAb",
  "status": "CREATED",
  "model_id": "gnDIbI0BfUsSoeNT_jAw"
}
```

To verify that the registration is complete, call the Tasks API:

```json
GET /_plugins/_ml/tasks/gXDIbI0BfUsSoeNT_jAb
```
{% include copy-curl.html %}

The `state` changes to `COMPLETED` in the response:

```json
{
  "model_id": "gnDIbI0BfUsSoeNT_jAw",
  "task_type": "REGISTER_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "kYv-Z5-mQ4uCUy_cRC6LXA"
  ],
  "create_time": 1706927128091,
  "last_update_time": 1706927128125,
  "is_async": false
}
```

To deploy the model, provide the `model_id` to the Deploy API:

```json
POST /_plugins/_ml/models/gnDIbI0BfUsSoeNT_jAw/_deploy
```
{% include copy-curl.html %}

OpenSearch acknowledges that the model is deployed:

```json
{
  "task_id": "cnDObI0BfUsSoeNTDzGd",
  "task_type": "DEPLOY_MODEL",
  "status": "COMPLETED"
}
```

### Step 3: Create a search pipeline

Next, create a search pipeline with a `retrieval_augmented_generation` processor: 

```json
PUT /_search/pipeline/rag_pipeline
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "openai_pipeline_demo",
        "description": "Demo pipeline Using OpenAI Connector",
        "model_id": "gnDIbI0BfUsSoeNT_jAw",
        "context_field_list": ["text"],
        "system_prompt": "You are a helpful assistant",
        "user_instructions": "Generate a concise and informative answer in less than 100 words for the given question"
      }
    }
  ]
}
```
{% include copy-curl.html %}

For information about the processor fields, see [Retrieval-augmented generation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rag-processor/).

### Step 4: Ingest RAG data into an index

RAG augments the LLM's knowledge with some supplementary data. 

First, create an index in which to store this data and set the default search pipeline to the pipeline created in the previous step:

```json
PUT /my_rag_test_data
{
  "settings": {
    "index.search.default_pipeline" : "rag_pipeline"
  },
  "mappings": {
    "properties": {
      "text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, ingest the supplementary data into the index:

```json
POST _bulk
{"index": {"_index": "my_rag_test_data", "_id": "1"}}
{"text": "Abraham Lincoln was born on February 12, 1809, the second child of Thomas Lincoln and Nancy Hanks Lincoln, in a log cabin on Sinking Spring Farm near Hodgenville, Kentucky.[2] He was a descendant of Samuel Lincoln, an Englishman who migrated from Hingham, Norfolk, to its namesake, Hingham, Massachusetts, in 1638. The family then migrated west, passing through New Jersey, Pennsylvania, and Virginia.[3] Lincoln was also a descendant of the Harrison family of Virginia; his paternal grandfather and namesake, Captain Abraham Lincoln and wife Bathsheba (née Herring) moved the family from Virginia to Jefferson County, Kentucky.[b] The captain was killed in an Indian raid in 1786.[5] His children, including eight-year-old Thomas, Abraham's father, witnessed the attack.[6][c] Thomas then worked at odd jobs in Kentucky and Tennessee before the family settled in Hardin County, Kentucky, in the early 1800s."}
{"index": {"_index": "my_rag_test_data", "_id": "2"}}
{"text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."}
```
{% include copy-curl.html %}

## RAG pipeline

RAG is a technique that retrieves documents from an index, passes them through a seq2seq model, such as an LLM, and then supplements the static LLM information with the dynamically retrieved data in context.

As of OpenSearch 2.12, the RAG technique has only been tested with OpenAI models, the Anthropic Claude model on Amazon Bedrock, and Cohere Command models. 
{: .warning}

Configuring the Cohere Command model to enable RAG requires using a post-processing function to transform the model output. For more information, see the [Cohere RAG Tutorial](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/tutorials/conversational_search/conversational_search_with_Cohere_Command.md).

### Step 5: Create a conversation memory

You'll need to create a conversation memory that will store all messages from a conversation. To make the memory easily identifiable, provide a name for the memory in the optional `name` field, as shown in the following example. Because the `name` parameter is not updatable, this is your only opportunity to name your conversation.

```json
POST /_plugins/_ml/memory/
{
  "name": "Conversation about NYC population"
}
```
{% include copy-curl.html %}

OpenSearch responds with a memory ID for the newly created memory:

```json
{
  "memory_id": "znCqcI0BfUsSoeNTntd7"
}
```

You'll use the `memory_id` to add messages to the memory. 


### Step 6: Use the pipeline for RAG

To use the RAG pipeline, send a query to OpenSearch and provide additional parameters in the `ext.generative_qa_parameters` object. 

The `generative_qa_parameters` object supports the following parameters.

Parameter | Required | Description
:--- | :--- | :---
`llm_question` | Yes | The question that the LLM must answer. 
`llm_model` | No | Overrides the original model set in the connection in cases where you want to use a different model (for example, GPT 4 instead of GPT 3.5). This option is required if a default model is not set during pipeline creation.
`memory_id` | No | If you provide a `memory_id`, the pipeline retrieves the 10 most recent messages in the specified memory and adds them to the LLM prompt. If you don't specify a `memory_id`, the prior context is not added to the LLM prompt. 
`context_size` | No | The number of search results sent to the LLM. This is typically needed in order to meet the token size limit, which can vary by model. Alternatively, you can use the `size` parameter in the Search API to control the number of search results sent to the LLM.
`message_size` | No | The number of messages sent to the LLM. Similarly to the number of search results, this affects the total number of tokens received by the LLM. When not set, the pipeline uses the default message size of `10`.
`timeout` | No | The number of seconds that the pipeline waits for the remote model using a connector to respond. Default is `30`.

If your LLM includes a set token limit, set the `size` field in your OpenSearch query to limit the number of documents used in the search response. Otherwise, the RAG pipeline will send every document in the search results to the LLM.
{: .note}

If you ask an LLM a question about the present, it cannot provide an answer because it was trained on data from a few years ago. However, if you add current information as context, the LLM is able to generate a response. For example, you can ask the LLM about the population of the New York City metro area in 2023. You'll construct a query that includes an OpenSearch match query and an LLM query. Provide the `memory_id` so that the message is stored in the appropriate memory object:

```json
GET /my_rag_test_data/_search
{
  "query": {
    "match": {
      "text": "What's the population of NYC metro area in 2023"
    }
  },
  "ext": {
    "generative_qa_parameters": {
      "llm_model": "gpt-3.5-turbo",
      "llm_question": "What's the population of NYC metro area in 2023",
      "memory_id": "znCqcI0BfUsSoeNTntd7",
      "context_size": 5,
      "message_size": 5,
      "timeout": 15
    }
  }
}
```
{% include copy-curl.html %}

Because the context included a document containing information about the population of New York City, the LLM was able to correctly answer the question (though it included the word "projected" because it was trained on data from previous years). The response contains the matching documents from the supplementary RAG data and the LLM response:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 5.781642,
    "hits": [
      {
        "_index": "my_rag_test_data",
        "_id": "2",
        "_score": 5.781642,
        "_source": {
          "text": """Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."""
        }
      },
      {
        "_index": "my_rag_test_data",
        "_id": "1",
        "_score": 0.9782871,
        "_source": {
          "text": "Abraham Lincoln was born on February 12, 1809, the second child of Thomas Lincoln and Nancy Hanks Lincoln, in a log cabin on Sinking Spring Farm near Hodgenville, Kentucky.[2] He was a descendant of Samuel Lincoln, an Englishman who migrated from Hingham, Norfolk, to its namesake, Hingham, Massachusetts, in 1638. The family then migrated west, passing through New Jersey, Pennsylvania, and Virginia.[3] Lincoln was also a descendant of the Harrison family of Virginia; his paternal grandfather and namesake, Captain Abraham Lincoln and wife Bathsheba (née Herring) moved the family from Virginia to Jefferson County, Kentucky.[b] The captain was killed in an Indian raid in 1786.[5] His children, including eight-year-old Thomas, Abraham's father, witnessed the attack.[6][c] Thomas then worked at odd jobs in Kentucky and Tennessee before the family settled in Hardin County, Kentucky, in the early 1800s."
        }
      }
    ]
  },
  "ext": {
    "retrieval_augmented_generation": {
      "answer": "The population of the New York City metro area in 2023 is projected to be 18,937,000.",
      "message_id": "x3CecI0BfUsSoeNT9tV9"
    }
  }
}
```
</details>

Now you'll ask an LLM a follow-up question as part of the same conversation. Again, provide the `memory_id` in the request: 

```json
GET /my_rag_test_data/_search
{
  "query": {
    "match": {
      "text": "What was it in 2022"
    }
  },
  "ext": {
    "generative_qa_parameters": {
      "llm_model": "gpt-3.5-turbo",
      "llm_question": "What was it in 2022",
      "memory_id": "znCqcI0BfUsSoeNTntd7",
      "context_size": 5,
      "message_size": 5,
      "timeout": 15
    }
  }
}
```
{% include copy-curl.html %}

The LLM correctly identifies the subject of the conversation and returns a relevant response:

```json
{
  ...
  "ext": {
    "retrieval_augmented_generation": {
      "answer": "The population of the New York City metro area in 2022 was 18,867,000.",
      "message_id": "p3CvcI0BfUsSoeNTj9iH"
    }
  }
}
```

To verify that both messages were added to the memory, provide the `memory_ID` to the Get Messages API:

```json
GET /_plugins/_ml/memory/znCqcI0BfUsSoeNTntd7/messages
```

The response contains both messages:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "messages": [
    {
      "memory_id": "znCqcI0BfUsSoeNTntd7",
      "message_id": "x3CecI0BfUsSoeNT9tV9",
      "create_time": "2024-02-03T20:33:50.754708446Z",
      "input": "What's the population of NYC metro area in 2023",
      "prompt_template": """[{"role":"system","content":"You are a helpful assistant"},{"role":"user","content":"Generate a concise and informative answer in less than 100 words for the given question"}]""",
      "response": "The population of the New York City metro area in 2023 is projected to be 18,937,000.",
      "origin": "retrieval_augmented_generation",
      "additional_info": {
        "metadata": """["Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019.","Abraham Lincoln was born on February 12, 1809, the second child of Thomas Lincoln and Nancy Hanks Lincoln, in a log cabin on Sinking Spring Farm near Hodgenville, Kentucky.[2] He was a descendant of Samuel Lincoln, an Englishman who migrated from Hingham, Norfolk, to its namesake, Hingham, Massachusetts, in 1638. The family then migrated west, passing through New Jersey, Pennsylvania, and Virginia.[3] Lincoln was also a descendant of the Harrison family of Virginia; his paternal grandfather and namesake, Captain Abraham Lincoln and wife Bathsheba (née Herring) moved the family from Virginia to Jefferson County, Kentucky.[b] The captain was killed in an Indian raid in 1786.[5] His children, including eight-year-old Thomas, Abraham's father, witnessed the attack.[6][c] Thomas then worked at odd jobs in Kentucky and Tennessee before the family settled in Hardin County, Kentucky, in the early 1800s."]"""
      }
    },
    {
      "memory_id": "znCqcI0BfUsSoeNTntd7",
      "message_id": "p3CvcI0BfUsSoeNTj9iH",
      "create_time": "2024-02-03T20:36:10.24453505Z",
      "input": "What was it in 2022",
      "prompt_template": """[{"role":"system","content":"You are a helpful assistant"},{"role":"user","content":"Generate a concise and informative answer in less than 100 words for the given question"}]""",
      "response": "The population of the New York City metro area in 2022 was 18,867,000.",
      "origin": "retrieval_augmented_generation",
      "additional_info": {
        "metadata": """["Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019.","Abraham Lincoln was born on February 12, 1809, the second child of Thomas Lincoln and Nancy Hanks Lincoln, in a log cabin on Sinking Spring Farm near Hodgenville, Kentucky.[2] He was a descendant of Samuel Lincoln, an Englishman who migrated from Hingham, Norfolk, to its namesake, Hingham, Massachusetts, in 1638. The family then migrated west, passing through New Jersey, Pennsylvania, and Virginia.[3] Lincoln was also a descendant of the Harrison family of Virginia; his paternal grandfather and namesake, Captain Abraham Lincoln and wife Bathsheba (née Herring) moved the family from Virginia to Jefferson County, Kentucky.[b] The captain was killed in an Indian raid in 1786.[5] His children, including eight-year-old Thomas, Abraham's father, witnessed the attack.[6][c] Thomas then worked at odd jobs in Kentucky and Tennessee before the family settled in Hardin County, Kentucky, in the early 1800s."]"""
      }
    }
  ]
}
```
</details>

## Next steps

- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) to learn how to build AI search applications. 