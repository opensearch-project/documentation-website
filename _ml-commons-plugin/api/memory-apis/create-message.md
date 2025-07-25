---
layout: default
title: Create or update message
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/memory-apis/create-message/
---

# Create or update a message
**Introduced 2.12**
{: .label .label-purple }

Use this API to create or update a message within a conversational memory for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). A memory stores conversation history for the current conversation. A message represents one question/answer pair within a conversation.

Once a message is created, you'll provide its `message_id` to other APIs.

The POST method creates a new message. The PUT method updates an existing message.

You can only update the `additional_info` field of a message.
{: .note}

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Endpoints

```json
POST /_plugins/_ml/memory/<memory_id>/messages
PUT /_plugins/_ml/memory/message/<message_id>
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`memory_id` | String | The ID of the memory to which to add the message. Required for the POST method.
`message_id` | String | The ID of the message to be updated. Required for the PUT method.

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Updatable | Description
:--- | :--- | :--- | :--- | :---
| `input` | String | Optional | No | The question (human input) in the message. |
| `prompt_template` | String | Optional | No | The prompt template that was used for the message. The template may contain instructions or examples that were sent to the large language model. |
| `response` | String | Optional | No | The answer (generative AI output) to the question. |
| `origin` | String | Optional | No | The name of the AI or other system that generated the response. |
| `additional_info` | Object | Optional | Yes | Any other information that was sent to the `origin`. |

#### Example request: Create a message

```json
POST /_plugins/_ml/memory/SXA2cY0BfUsSoeNTz-8m/messages
{
    "input": "How do I make an interaction?",
    "prompt_template": "Hello OpenAI, can you answer this question?",
    "response": "Hello, this is OpenAI. Here is the answer to your question.",
    "origin": "MyFirstOpenAIWrapper",
    "additional_info": {
      "suggestion": "api.openai.com"
    }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "memory_id": "WnA3cY0BfUsSoeNTI-_J"
}
```

#### Example request: Add a field to `additional_info`

```json
PUT /_plugins/_ml/memory/message/WnA3cY0BfUsSoeNTI-_J
{
  "additional_info": {
    "feedback": "positive"
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-ml-memory-message",
  "_id": "WnA3cY0BfUsSoeNTI-_J",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 45,
  "_primary_term": 1
}
```

The updated message contains an additional `feedback` field:

```json
{
  "memory_id": "SXA2cY0BfUsSoeNTz-8m",
  "message_id": "WnA3cY0BfUsSoeNTI-_J",
  "create_time": "2024-02-03T23:04:15.554370024Z",
  "input": "How do I make an interaction?",
  "prompt_template": "Hello OpenAI, can you answer this question?",
  "response": "Hello, this is OpenAI. Here is the answer to your question.",
  "origin": "MyFirstOpenAIWrapper",
  "additional_info": {
    "feedback": "positive",
    "suggestion": "api.openai.com"
  }
}
```

#### Example request: Change a field in `additional_info`

```json
PUT /_plugins/_ml/memory/message/WnA3cY0BfUsSoeNTI-_J
{
  "additional_info": {
    "feedback": "negative"
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-ml-memory-message",
  "_id": "WnA3cY0BfUsSoeNTI-_J",
  "_version": 3,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 46,
  "_primary_term": 1
}
```

The updated message contains the updated `feedback` field:

```json
{
  "memory_id": "SXA2cY0BfUsSoeNTz-8m",
  "message_id": "WnA3cY0BfUsSoeNTI-_J",
  "create_time": "2024-02-03T23:04:15.554370024Z",
  "input": "How do I make an interaction?",
  "prompt_template": "Hello OpenAI, can you answer this question?",
  "response": "Hello, this is OpenAI. Here is the answer to your question.",
  "origin": "MyFirstOpenAIWrapper",
  "additional_info": {
    "feedback": "negative",
    "suggestion": "api.openai.com"
  }
}
```