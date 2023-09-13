---
layout: default
title: Conversational search
has_children: false
nav_order: 200
---

# Conversational search

Conversational search is an experimental machine learning (ML) feature that enables a new search interface. Whereas traditional document search allows a user to ask a question and receive a list of documents that might contain the answer to that question, conversation search uses large language models (LLM) to read the top N documents and synthesizes those documents into a plaintest "answer" to your question.

Currently, conversational search utilizes two systems to synthesize documents:

- [Conversation memory](#conversation-memory)
- [Retreival Augmented Generation (RAG) pipeline](#rag-pipeline)

## Conversation memory

Conversation memory consists of a simple CRUD-life API comprised of two resources: **Conversations** and **Interactions**. Conversations are made up of interactions. An interaction represents a pair of messages; a human input and the AI response.

To make it easier to build and debug applications that make use of conversation memory, `conversation-meta` and `conversation-interactions` are stored in two system indexes.

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

In the `conversation-interactions` index, the following fields are all set by the user or AI application. Each of the following fields are input as strings:

| Field | Description |
| :--- | :--- |
| `input` | The question which forms the basis for an interaction.
| `prompt_template` | The prompt template that was used as the framework for this interaction. |
| `response` | The AI’s response to the prompt. |
| `origin` | The name of the AI or other system that generated the response. |
| `additional_info` | Any other information that was sent to the “origin” in the prompt. |

The goal of the `conversation-interactions` index is to create a clean interaction and make it easy for the index to reconstruct the exact prompts sent to the LLM, enabling robust debugging and explainability, as shown in the following schema:

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

### Creating conversations and interactions

To begin using conversation memory, enable the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory_feature_enabled": true
  }
}
```

After conversation memory is enabled, you can now use the Memory API to create a conversation. Remember, you cannot create an interactions until you've created a conversation. 

To make the conversation easily identifable, use the optional `name` field in the Memory API, as shown in the following example. This will be your only opportunity to give your conversation a name.



```json
POST /_plugins/_ml/memory/conversation
{
  "name": Example conversation
}
```

The Memory API responds with the conversation ID, as shown in the following example response:

```json
{ "conversation_id": "4of2c9nhoIuhcr" }
```

You'll use the `conversation_id` to create interactions inside the conversation. To create interactions, enter the `conversation_id` into the Memory API path. Then, customize the [fields](#conversation-interactions-index) in the request body, as shown in the following example:

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

The Memory API then responds with an interaction ID, as shown in the following response:

```json
{ "interaction_id": "948vh_PoiY2hrnpo" }
```

### Getting conversations

You can get a list of conversation using the following Memory API operation:

```json
GET /_plugins/_ml/memory/conversation?max_results=3&next_token=0
```

Use the following path parameters to customize your results:

Parameter | Data type | Description
:--- | :--- | :---
`max_results` | Integer | The maximum number of results returned by the response. Default is `10`.
`next_token` | Integer | The number of paginated results returned when more than the `max_results` exist.

The Memory API responds with the most recent conversation created first, as indicated in the `create_time` field of the response as shown in the following example:

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


If there are fewer than the number of conversations set in `max_results`, then the response only returns the number of conversations that exist. Lastly, `next_token` provides an ordered position of the sorted list of conversations. When a conversation is added between subsequent GET conversation calls, then one of the listed conversations will be duplicated in the result, for example:

```json
GetConversations               -> [BCD]EFGH
CreateConversation             -> ABCDEFGH
GetConversations(next_token=3) -> ABC[DEF]GH
```

### Getting interactions

To see a list of interactions in a conversation, enter the `conversation_id` at the end of API request, as shown in the following example. You can use the `max_results` and `next_token` to sort the response:

```json
GET /_plugins/_ml/memory/conversation/4of2c9nhoIuhcr
```

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

To delete a conversation, use the `DELETE` operation as showing in the following example:

```json
DELETE /_plugins/_ml/memory/conversation/4of2c9nhoIuhcr
```

The Memory API responds with the following:

```json
{ "success": true }
```

## RAG pipeline

RAG is a technique for grounding LLMs and a natural language interface, implemented as a search pipeline. 

### Enabling RAG

Use the following cluster setting to enable the RAG pipeline feature:

```json
PUT /_cluster/settings
{
  "persistent": {"plugins.ml_commons.rag_pipline_feature_enabled": "true"}
}
```

RAG requires a LLM to function. We recommend using a [connector](https://opensearch.org/docs/latest/ml-commons-plugin/extensibility/connectors/)