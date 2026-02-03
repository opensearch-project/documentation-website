---
layout: default
title: Unified agent API quick start
parent: Agents and tools
nav_order: 16
---

# Unified agent API quick start
**Introduced 3.5**
{: .label .label-purple }
**Experimental release**
{: .label .label-red }

This quick start guide shows you how to create and use agents with the unified agent API.

This is an experimental release supporting Amazon Bedrock Converse Claude and Gemini models.
{: .important}


## Step 1: Enable the unified agent API

The unified agent API is disabled by default. Enable it with the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.unified_agent_api_enabled": true
  }
}
```
{% include copy-curl.html %}

### Response

```json
{
  "acknowledged": true,
  "persistent": {
    "plugins": {
      "ml_commons": {
        "unified_agent_api_enabled": "true"
      }
    }
  },
  "transient": {}
}
```

## Comparison with traditional workflow

### Traditional workflow (before 3.5)

1. Register connector (manual configuration)
2. Register model (using connector ID)
3. Register agent (using model ID)
4. Execute with `parameters.question`

### Simplified workflow (3.5+)

1. Register agent (automatic connector and model creation)
2. Execute with `input` field

The simplified workflow reduces three steps to one and eliminates error-prone manual configuration.

## Step 2: Register an agent

The unified agent API currently supports:

- `conversational`: Interactive agents with tool calling
- `plan_execute_and_reflect`: Multi-step planning agents

Create an agent with a single API call. Behind the scenes, the connector and model are created automatically and configured with the agent:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My First Unified Agent",
  "type": "conversational",
  "description": "A simple agent using Claude",
  "model": {
    "model_id": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "YOUR_AWS_ACCESS_KEY",
      "secret_key": "YOUR_AWS_SECRET_KEY",
      "session_token": "YOUR_AWS_SESSION_TOKEN"
    }
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "SearchIndexTool"
    }
  ],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Example: Gemini agent registration

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Gemini Multimodal Agent",
  "type": "conversational",
  "description": "Test agent for Gemini multimodal capabilities",
  "model": {
    "model_id": "gemini-2.5-pro",
    "model_provider": "gemini/v1beta/generatecontent",
    "credential": {
      "gemini_api_key": "YOUR_API_KEY"
    },
    "model_parameters": {
      "system_prompt": "You are a helpful assistant that can understand images and text."
    }
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "IndexMappingTool"
    },
    {
      "type": "SearchIndexTool"
    }
  ],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Response

```json
{
  "agent_id": "abc123xyz"
}
```

Save the `agent_id` for the next steps.

## Step 3: Execute the agent

The `input` field accepts three formats:

1. **Plain text**: `"input": "your question"`
2. **Content blocks**: `"input": [{"type": "text", "text": "..."}, {"type": "image", ...}]`
3. **Messages**: `"input": [{"role": "user", "content": [...]}, ...]`

### Execute with text

Send a simple text prompt to your agent:

```json
POST /_plugins/_ml/agents/abc123xyz/_execute
{
  "input": "List all indices in the cluster"
}
```
{% include copy-curl.html %}

#### Response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": "Here are the indices in your cluster:\n\n1. my-index-1\n2. my-index-2\n3. system-index"
        }
      ]
    }
  ]
}
```

### Execute with multimodal input

Send an image along with your question:

```json
POST /_plugins/_ml/agents/abc123xyz/_execute
{
  "input": [
    {
      "type": "text",
      "text": "Describe what you see in this chart"
    },
    {
      "type": "image",
      "source": {
        "type": "base64",
        "format": "png",
        "data": "iVBORw0KGgoAAAANSUhEUgAA..."
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Execute with conversation

Maintain context across multiple turns:

```json
POST /_plugins/_ml/agents/abc123xyz/_execute
{
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "I like red"
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "Thanks for telling me that! I'll remember it."
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Show me shoes of my fav color from the \"products-index\""
        }
      ]
    }
  ],
  "parameters": {
    "verbose": true
  }
}
```
{% include copy-curl.html %}

#### Response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "memory_id",
          "result": "iEgpJZwBZx9B0F4spD5v"
        },
        {
          "name": "parent_interaction_id",
          "result": "ikgpJZwBZx9B0F4spT61"
        },
        {
          "name": "response",
          "result": "{\"candidates\":[{\"content\":{\"parts\":[{\"functionCall\":{\"name\":\"IndexMappingTool\",\"args\":{\"index\":[\"products-index\"]}},\"thoughtSignature\":\"Co....hmK\"}],\"role\":\"model\"},\"finishReason\":\"STOP\",\"index\":0,\"finishMessage\":\"Model generated function call(s).\"}],\"usageMetadata\":{\"promptTokenCount\":627,\"candidatesTokenCount\":17,\"totalTokenCount\":1041,\"promptTokensDetails\":[{\"modality\":\"TEXT\",\"tokenCount\":627}],\"thoughtsTokenCount\":397},\"modelVersion\":\"gemini-2.5-pro\",\"responseId\":\"gliCae-3EbDmz7IPp7DSoAs\"}"
        },
        {
          "name": "response",
          "result": "index: products-index\n\nmappings:\nproperties={average_rating={type=float}, bought_together={type=keyword}, brand={type=text, fields={keyword={type=keyword, ignore_above=256}}}, categories={type=keyword}, category={type=text, fields={keyword={type=keyword, ignore_above=256}}}, color={type=text, fields={keyword={type=keyword, ignore_above=256}}}, currency={type=text, fields={keyword={type=keyword, ignore_above=256}}}, description={type=text}, details={dynamic=false, properties={additional_attributes={type=text}, best_sellers_rank={type=text}, brand={type=keyword}, color={type=keyword}, country={type=keyword}, date_available={type=keyword}, dimensions={type=keyword}, manufacturer={type=keyword}, model_number={type=keyword}, weight={type=keyword}}}, features={type=text}, images={type=object, dynamic=false}, in_stock={type=boolean}, main_category={type=keyword}, parent_asin={type=keyword}, price={type=float}, product_id={type=text, fields={keyword={type=keyword, ignore_above=256}}}, product_name={type=text, fields={keyword={type=keyword, ignore_above=256}}}, rating_number={type=float}, size={type=text, fields={keyword={type=keyword, ignore_above=256}}}, store={type=keyword}, title={type=text, analyzer=standard}, videos={type=object, dynamic=false}}\n\n\nsettings:\nindex.creation_date=1770149755332\nindex.number_of_replicas=1\nindex.number_of_shards=1\nindex.provided_name=products-index\nindex.replication.type=DOCUMENT\nindex.uuid=6ycDJtzLTyOIWHAG9HAT0w\nindex.version.created=137267827\n\n\n"
        },
        {
          "name": "response",
          "result": "{\"candidates\":[{\"content\":{\"parts\":[{\"functionCall\":{\"name\":\"SearchIndexTool\",\"args\":{\"query\":{\"query\":{\"bool\":{\"filter\":[{\"match\":{\"color\":\"red\"}},{\"match\":{\"category\":\"shoes\"}}]}},\"size\":5},\"index\":\"products-index\"}},\"thoughtSignature\":\"Cr0G..,gFsxdg==\"}],\"role\":\"model\"},\"finishReason\":\"STOP\",\"index\":0,\"finishMessage\":\"Model generated function call(s).\"}],\"usageMetadata\":{\"promptTokenCount\":1129,\"candidatesTokenCount\":55,\"totalTokenCount\":1386,\"promptTokensDetails\":[{\"modality\":\"TEXT\",\"tokenCount\":1129}],\"thoughtsTokenCount\":202},\"modelVersion\":\"gemini-2.5-pro\",\"responseId\":\"hViCaeb7OfStz7IPjvLb2Qg\"}"
        },
        {
          "name": "response",
          "result": "{\"_index\":\"products-index\",\"_source\":{\"color\":\"red\",\"size\":\"10\",\"price\":110.0,\"product_id\":\"P6009\",\"description\":\"Everyday red sneakers\",\"currency\":\"USD\",\"in_stock\":true,\"category\":\"shoes\",\"product_name\":\"New Balance 574 Red\",\"brand\":\"New Balance\"},\"_id\":\"51\",\"_score\":0.0}\n"
        },
        {
          "name": "response",
          "result": "I found a pair of red shoes for you:\n\n**New Balance 574 Red**\n* **Brand:** New Balance\n* **Price:** $110.00\n* **Description:** Everyday red sneakers\n* **Size:** 10\n* **In Stock:** Yes"
        }
      ]
    }
  ]
}
```

The agent remembers that red is your favorite color and searches accordingly.

## Next steps

- Learn more about the [unified agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/unified-agents/)
- Explore [agent types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/)
- Review available [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/)
- Check the [Agent APIs reference]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/)
