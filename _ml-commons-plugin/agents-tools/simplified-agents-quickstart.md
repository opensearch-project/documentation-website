---
layout: default
title: Simplified agents quick start
parent: Agents and tools
nav_order: 16
---

# Simplified agents quick start
**Introduced 3.5**
{: .label .label-purple }
**Experimental release**
{: .label .label-red }

This quick start guide shows you how to create and use agents with the simplified interface.

This is an experimental release supporting only Amazon Bedrock Converse Claude models.
{: .important}


## Step 1: Enable the simplified interface

The simplified agent interface is disabled by default. Enable it with the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.simplified_agent_registration_enabled": true
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
        "simplified_agent_registration_enabled": "true"
      }
    }
  },
  "transient": {}
}
```

## Step 2: Register an agent

Create an agent with a single API call. The connector and model are created automatically:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My First Simplified Agent",
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

### Response

```json
{
  "agent_id": "abc123xyz"
}
```

Save the `agent_id` for the next steps.

## Step 3: Execute the agent with text

Send a simple text prompt to your agent:

```json
POST /_plugins/_ml/agents/abc123xyz/_execute
{
  "input": "List all indices in the cluster"
}
```
{% include copy-curl.html %}

### Response

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

## Step 4: Execute with multimodal input

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

## Step 5: Have a conversation

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
          "text": "My favorite index is logs-2024"
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I'll remember that logs-2024 is your favorite index."
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Can you search my favorite index for errors?"
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

The agent remembers that `logs-2024` is your favorite index and searches it accordingly.

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

## Supported agent types

The simplified interface currently supports:

- `conversational`: Interactive agents with tool calling
- `plan_execute_and_reflect`: Multi-step planning agents

## Supported input formats

The `input` field accepts:

1. **Plain text**: `"input": "your question"`
2. **Content blocks**: `"input": [{"type": "text", "text": "..."}, {"type": "image", ...}]`
3. **Messages**: `"input": [{"role": "user", "content": [...]}, ...]`

## Next steps

- Learn more about the [simplified agent interface]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/simplified-agents/)
- Explore [agent types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/)
- Review available [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/)
- Check the [Agent APIs reference]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/)
