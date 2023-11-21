---
layout: default
title: Conversational search
has_children: false
nav_order: 200
---

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://forum.opensearch.org/t/feedback-conversational-search-and-retrieval-augmented-generation-using-search-pipeline-experimental-release/16073). 
{: .warning}

# Conversational search

Conversational search is an experimental machine learning (ML) feature that enables a new search interface. Whereas traditional document search allows you to ask a question and receive a list of documents that might contain the answer to that question, conversational search uses large language models (LLMs) to read the top N documents and synthesizes those documents into a plaintext "answer" to your question.

Currently, conversational search uses two systems to synthesize documents:

- [Conversation memory](#conversation-memory)
- [Retrieval Augmented Generation (RAG) pipeline](#rag-pipeline)

## Conversation memory

Conversation memory consists of a simple CRUD-like API comprising two resources: **Conversations** and **Interactions**. Conversations are made up of interactions. An interaction represents a pair of messages: a human input and an artificial intelligence (AI) response. You cannot create any interactions until you've created a conversation. 

To make it easier to build and debug applications that use conversation memory, `conversation-meta` and `conversation-interactions` are stored in two system indexes.

### `conversation-meta` index

In the `conversation-meta` index, you can customize the `name` field to make it easier for end users to know how to continue a conversation with the AI, as shown in the following schema:

```jsx
.plugins-ml-conversation-meta
{
    "_meta": {
        "schema_version": 1
    },
    "properties": {
        "name": {"type": "keyword"},
        "create_time": {"type": "date", "format": "strict_date_time||epoch_millis"},
        "user": {"type": "keyword"}
    }
}
```

### `conversation-interactions` index

In the `conversation-interactions` index, all of the following fields are set by the user or AI application. Each field is entered as a string.

| Field | Description |
| :--- | :--- |
| `input` | The question that forms the basis for an interaction. |
| `prompt_template` | The prompt template that was used as the framework for this interaction. |
| `response` | The AI response to the prompt. |
| `origin` | The name of the AI or other system that generated the response. |
| `additional_info` | Any other information that was sent to the "origin" in the prompt. |

The `conversation-interactions` index creates a clean interaction abstraction and make it easy for the index to reconstruct the exact prompts sent to the LLM, enabling robust debugging and explainability, as shown in the following schema:

```jsx
.plugins-ml-conversation-interactions
{
    "_meta": {
        "schema_version": 1
    },
    "properties": {
        "conversation_id": {"type": "keyword"},
        "create_time": {"type": "date", "format": "strict_date_time||epoch_millis"},
        "input": {"type": "text"},
        "prompt_template": {"type": "text"},
        "response": {"type": "text"},
        "origin": {"type": "keyword"},
        "additional_info": {"type": "text"}
    }
}
```

## Working with conversations and interactions

When the Security plugin is enabled, all conversations in ML Commons exist in a "private" security mode. Only the user who created a conversation can interact with that conversation. No users on the cluster can see another user's conversation.
{: .note}

To begin using conversation memory, enable the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory_feature_enabled": true
  }
}
```
{% include copy-curl.html %}

After conversation memory is enabled, you can use the Memory API to create a conversation. 

To make the conversation easily identifiable, use the optional `name` field in the Memory API, as shown in the following example. This will be your only opportunity to name your conversation.



```json
POST /_plugins/_ml/memory/conversation
{
  "name": Example conversation
}
```
{% include copy-curl.html %}

The Memory API responds with the conversation ID, as shown in the following example response:

```json
{ "conversation_id": "4of2c9nhoIuhcr" }
```

You'll use the `conversation_id` to create interactions inside the conversation. To create interactions, enter the `conversation_id` into the Memory API path. Then customize the [fields](#conversation-interactions-index) in the request body, as shown in the following example:

```json
POST /_plugins/_ml/memory/conversation/4of2c9nhoIuhcr
{
  "input": "How do I make an interaction?",
  "prompt_template": "Hello OpenAI, can you answer this question? \
											Here's some extra info that may help. \
											[INFO] \n [QUESTION]",
  "response": "Hello, this is OpenAI. Here is the answer to your question.",
  "origin": "MyFirstOpenAIWrapper",
  "additional_info": "Additional text related to the answer \
											A JSON or other semi-structured response"
}
```
{% include copy-curl.html %}

The Memory API then responds with an interaction ID, as shown in the following example response:

```json
{ "interaction_id": "948vh_PoiY2hrnpo" }
```

### Getting conversations

You can get a list of conversations using the following Memory API operation:

```json
GET /_plugins/_ml/memory/conversation?max_results=3&next_token=0
```
{% include copy-curl.html %}

Use the following path parameters to customize your results.

Parameter | Data type | Description
:--- | :--- | :---
`max_results` | Integer | The maximum number of results returned by the response. Default is `10`.
`next_token` | Integer | Represents the conversation order position that will be retrieved. For example, if conversations A, B, and C exist, `next_token=1` would return conversations B and C. Default is `0`.

The Memory API responds with the most recent conversation, as indicated in the `create_time` field of the following example response:

```json
{
  "conversations": [
    {
      "conversation_id": "0y4hto_in1",
      "name": "",
      "create_time": "2023-4-23 10:25.324662"
	  }, ... (2 more since we specified max_results=3)
	],
  "next_token": 3
}
```


If there are fewer conversations than the number set in `max_results`, the response only returns the number of conversations that exist. Lastly, `next_token` provides an ordered position of the sorted list of conversations. When a conversation is added between subsequent GET conversation calls, one of the listed conversations will be duplicated in the results, for example:

```plaintext
GetConversations               -> [BCD]EFGH
CreateConversation             -> ABCDEFGH
GetConversations(next_token=3) -> ABC[DEF]GH
```

### Getting interactions

To see a list of interactions in a conversation, enter the `conversation_id` at the end of the API request, as shown in the following example. You can use `max_results` and `next_token` to sort the response:

```json
GET /_plugins/_ml/memory/conversation/4of2c9nhoIuhcr
```
{% include copy-curl.html %}

The Memory API returns the following interaction information:

```json
{
  "interactions": [
    {
      "interaction_id": "342968y2u4-0",
      "conversation_id": "0y4hto_in1",
      "create_time": "2023-4-23 10:25.324662",
      "input": "How do I make an interaction?",
      "prompt_template": "Hello OpenAI, can you answer this question? \
											Here's some extra info that may help. \
											[INFO] \n [QUESTION]",
      "response": "Hello, this is OpenAI. Here is the answer to your question.",
      "origin": "MyFirstOpenAIWrapper",
      "additional_info": "Additional text related to the answer \
											A JSON or other semi-structured response"
	  }, ... (9 more since max_results defaults to 10)
	],
  "next_token": 10
}
```

### Deleting conversations

To delete a conversation, use the `DELETE` operation, as shown in the following example:

```json
DELETE /_plugins/_ml/memory/conversation/4of2c9nhoIuhcr
```
{% include copy-curl.html %}

The Memory API responds with the following:

```json
{ "success": true }
```

## RAG pipeline

RAG is a technique that retrieves documents from an index, passes them through a seq2seq model, such as an LLM, and then supplements the static LLM information with the dynamically retrieved data in context.

As of OpenSearch 2.11, the RAG technique has only been tested with OpenAI models and the Anthropic Claude model on Amazon Bedrock.
{: .warning}

### Enabling RAG

Use the following cluster setting to enable the RAG pipeline feature:

```json
PUT /_cluster/settings
{
  "persistent": {"plugins.ml_commons.rag_pipeline_feature_enabled": "true"}
}
```
{% include copy-curl.html %}

### Connecting the model

RAG requires an LLM in order to function. We recommend using a [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).

Use the following steps to set up an HTTP connector using the OpenAI GPT 3.5 model:

1. Use the Connector API to create the HTTP connector:

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
            "openAI_key": "<your OpenAI key>"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/chat/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages}, \"temperature\": ${parameters.temperature} }"
            }
        ]
    }
    ```
    {% include copy-curl.html %}

1. Create a new model group for the connected model. You'll use the `model_group_id` returned by the Register API to register the model:

    ```json
    POST /_plugins/_ml/model_groups/_register
    {
      "name": "public_model_group", 
      "description": "This is a public model group"
    }
    ```
    {% include copy-curl.html %}

1. Register and deploy the model using the `connector_id` from the Connector API response in Step 1 and the `model_group_id` returned in Step 2:

    ```json
    POST /_plugins/_ml/models/_register
    {
      "name": "openAI-gpt-3.5-turbo",
      "function_name": "remote",
      "model_group_id": "fp-hSYoBu0R6vVqGMnM1",
      "description": "test model",
      "connector_id": "f5-iSYoBu0R6vVqGI3PA"
    }
    ``` 
    {% include copy-curl.html %}

1. With the model registered, use the `task_id` returned in the registration response to get the `model_id`. You'll use the `model_id` to deploy the model to OpenSearch:

    ```json
    GET /_plugins/_ml/tasks/<task_id>
    ```
    {% include copy-curl.html %}

1. Using the `model_id` from step 4, deploy the model:

    ```json
    POST /_plugins/_ml/models/<model_id>/_deploy
    ```
    {% include copy-curl.html %}

### Setting up the pipeline

Next, you'll create a search pipeline for the connector model. Use the following Search API request to create a pipeline: 

```json
PUT /_search/pipeline/<pipeline_name>
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "openai_pipeline_demo",
        "description": "Demo pipeline Using OpenAI Connector",
        "model_id": "<model_id>",
        "context_field_list": ["text"],
        "system_prompt": "You are a helpful assistant",
        "user_instructions": "Generate a concise and informative answer in less than 100 words for the given question"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Context field list

`context_field_list` is the list of fields in document sources that the pipeline uses as context for the RAG. For example, when `context_field_list` parses through the following document, the pipeline sends the `text` field from the response to OpenAI model:

```json
{
  "_index": "qa_demo",
  "_id": "SimKcIoBOVKVCYpk1IL-",
  "_source": {
    "title": "Abraham Lincoln 2",
    "text": "Abraham Lincoln was born on February 12, 1809, the second child of Thomas Lincoln and Nancy Hanks Lincoln, in a log cabin on Sinking Spring Farm near Hodgenville, Kentucky.[2] He was a descendant of Samuel Lincoln, an Englishman who migrated from Hingham, Norfolk, to its namesake, Hingham, Massachusetts, in 1638. The family then migrated west, passing through New Jersey, Pennsylvania, and Virginia.[3] Lincoln was also a descendant of the Harrison family of Virginia; his paternal grandfather and namesake, Captain Abraham Lincoln and wife Bathsheba (née Herring) moved the family from Virginia to Jefferson County, Kentucky.[b] The captain was killed in an Indian raid in 1786.[5] His children, including eight-year-old Thomas, Abraham's father, witnessed the attack.[6][c] Thomas then worked at odd jobs in Kentucky and Tennessee before the family settled in Hardin County, Kentucky, in the early 1800s.[6]\n"
  }
}
```

You can customize `context_field_list` in your RAG pipeline to send any fields that exist in your documents to the LLM.

### RAG parameter options

Use the following options when setting up a RAG pipeline under the `retrieval_augmented_generation` argument.

Parameter | Required | Description
:--- | :--- | :---
`tag` | No | A tag to help identify the pipeline.
`description` | Yes | A description of the pipeline.
`model_id` | Yes | The ID of the model used in the pipeline.
`context_field_list` | Yes | The list of fields in document sources that the pipeline uses as context for the RAG. For more information, see [Context Field List](#context-field-list).
`system_prompt` | No | The message sent to the LLM with a `system` role. This is the message the user sees when the LLM receives an interaction.
`user_instructions` | No | An additional message sent by the LLM with a `user` role. This parameter allows for further customization of what the user receives when interacting with the LLM.

### Using the pipeline

Using the pipeline is similar to submitting [search queries]({{site.url}}{{site.baseurl}}/api-reference/search/#example) to OpenSearch, as shown in the following example:

```json
GET /<index_name>/_search?search_pipeline=<pipeline_name>
{
	"query" : {...},
	"ext": {
		"generative_qa_parameters": {
			"llm_model": "gpt-3.5-turbo",
			"llm_question": "Was Abraham Lincoln a good politician",
			"conversation_id": "_ikaSooBHvd8_FqDUOjZ",
                         "context_size": 5,
                         "interaction_size": 5,
                         "timeout": 15
		}
	}
}
```
{% include copy-curl.html %}

The RAG search query uses the following request objects under the `generative_qa_parameters` option.

Parameter | Required | Description
:--- | :--- | :---
`llm_question` | Yes | The question the LLM must answer. 
`llm_model` | No | Overrides the original model set in the connection in cases where you want to use a different model (for example, GPT 4 instead of GPT 3.5). This option is required if a default model is not set during pipeline creation.
`conversation_id` | No | Integrates conversation memory into your RAG pipeline by adding the 10 most recent conversations into the context of the search query to the LLM. 
`context_size` | No | The number of search results sent to the LLM. This is typically needed in order to meet the token size limit, which can vary by model. Alternatively, you can use the `size` parameter in the Search API to control the amount of information sent to the LLM.
`interaction_size` | No | The number of interactions sent to the LLM. Similarly to the number of search results, this affects the total number of tokens seen by the LLM. When not set, the pipeline uses the default interaction size of `10`.
`timeout` | No | The number of seconds that the pipeline waits for the remote model using a connector to respond. Default is `30`.

If your LLM includes a set token limit, set the `size` field in your OpenSearch query to limit the number of documents used in the search response. Otherwise, the RAG pipeline will send every document in the search results to the LLM.

## Next steps

- To learn more about connecting to models on external platforms, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).
- To learn more about using custom models within your OpenSearch cluster, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).

