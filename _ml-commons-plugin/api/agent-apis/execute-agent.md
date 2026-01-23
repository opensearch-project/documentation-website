---
layout: default
title: Execute agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Execute Agent API
**Introduced 2.13**
{: .label .label-purple }

When an agent is executed, it runs the tools with which it is configured. Starting with OpenSearch version 3.0, you can execute an agent asynchronously by setting the `async` query parameter to `true`.

Starting with OpenSearch 3.5, agents created using the [simplified interface]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/simplified-agents/) support a standardized `input` field that accepts plain text, multimodal content, or message-based conversations.
{: .note}

### Endpoints

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
```

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Required/Optional | Description
:---  | :--- | :--- 
`async` | Boolean | Optional | If `true`, executes the agent asynchronously and returns a `task_id` to track execution. To check the status of the task, use the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Default is `false`.

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`parameters`| Object | Optional | The parameters required by the agent. Any agent parameters configured during registration can be overridden using this field. Used with traditional agent workflow.
`parameters.question`| String | Optional | The question to ask the agent. Used with traditional agent workflow.
`parameters.verbose`| Boolean | Optional | Provides verbose output.
`input` | String or Array | Optional | **Simplified interface (3.5+)**: Standardized input field supporting plain text, multimodal content blocks, or message-based conversations. See [Simplified agent interface]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/simplified-agents/).

## Traditional agent execution

For agents created using the traditional workflow, use the `parameters` field:

```json
POST /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": """ Based on the given context, the key information is:

The metro area population of Seattle in 2021 was 3,461,000.
The metro area population of Seattle in 2023 is 3,519,000.

To calculate the population increase from 2021 to 2023:

Population in 2023 (3,519,000) - Population in 2021 (3,461,000) = 58,000

Therefore, the population increase of Seattle from 2021 to 2023 is 58,000."""
        }
      ]
    }
  ]
}
```

## Simplified interface execution (Experimental)
**Introduced 3.5**
{: .label .label-purple }
**Experimental release**
{: .label .label-red }

For agents created using the simplified interface, use the `input` field. The `input` field supports three formats:

### Plain text input

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
{
  "input": "What tools do you have access to?"
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": "I have access to the following tools:\n\n1. ListIndexTool - Lists all indices in the cluster\n2. SearchIndexTool - Searches within OpenSearch indices\n3. IndexMappingTool - Retrieves index mapping information"
        }
      ]
    }
  ]
}
```

### Multimodal content blocks

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
{
  "input": [
    {
      "type": "text",
      "text": "What can you see in this image?"
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

### Message-based conversations

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
{
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "I like the color red"
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
          "text": "What color do I like?"
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

For more information about the simplified interface and input formats, see [Simplified agent interface]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/simplified-agents/).