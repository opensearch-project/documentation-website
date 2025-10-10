---
layout: default
title: Scratchpad tools
has_children: false
has_toc: false
nav_order: 60
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Scratchpad tools
**Introduced 3.3**
{: .label .label-purple }
<!-- vale on -->

The scratchpad tools consist of `WriteToScratchPadTool` and `ReadFromScratchPadTool`, which enable agents to store and retrieve intermediate thoughts and results during runtime. These tools serve as temporary memory for a single agent execution session, allowing agents to take notes and store important findings during tool executions.

**Important**: The scratchpad acts as runtime memory that persists only during a single agent execution. When you call the agent's `_execute` API, a new scratchpad is created for that session. All notes and data, except persistent_notes, are cleared when the execution completes, ensuring each execution starts with a fresh scratchpad.

## Use cases

- **Task decomposition**: Store research plans, intermediate findings, and progress notes during multi-step operations within a single execution
- **Temporary state management**: Maintain context and accumulated knowledge during the current agent execution session
- **Multi-step workflows**: Save key findings after searches to build comprehensive responses in complex tasks
- **Execution planning**: Store and reference step-by-step plans during complex operations

## Tool parameters

### ReadFromScratchPadTool

**Registration parameters** (when adding to an agent):

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`persistent_notes` | String | Optional | Initial notes or instructions to store in the scratchpad when first created

**Execution parameters** (when calling the tool directly):

Parameter | Type | Required/Optional | Description
:--- | :--- |:------------------| :---
`persistent_notes` | String | Required          | Initial notes or instructions to store in the scratchpad


## Testing the tools

You can directly use the tools API to execute both scratchpad tools and test their responses before registering them with your agents.

### Testing ReadFromScratchPadTool

```json
POST /_plugins/_ml/tools/_execute/ReadFromScratchPadTool
{
  "parameters": {
    "persistent_notes": "You are a helpful researcher to conduct searches in OpenSearch cluster. Before making the search, please remember to use the listIndexTool to figure out what are the available indices first. When using listIndexTool, remember the index name has to be in an array format. Please write down important notes after tool used."
  }
}
```
{% include copy-curl.html %}

When giving persistent_notes, you will see when tool response, it will try to show the persistent notes given in the response.

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "response",
                    "result": "Notes from scratchpad:\n- You are a helpful researcher to conduct searches in OpenSearch cluster. Before making the search, please remember to use the listIndexTool to figure out what are the available indices first. When using listIndexTool, remember the index name has to be in an array format. Please write down important notes after tool used."
                }
            ]
        }
    ]
}
```

You can also test with empty persistent notes.

```json 
POST /_plugins/_ml/tools/_execute/ReadFromScratchPadTool
{
  "parameters": {
    "persistent_notes": ""
  }
}
```

You will get a response about empty scratchpad.

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "response",
                    "result": "Scratchpad is empty."
                }
            ]
        }
    ]
}
```

### WriteToScratchPadTool

**Registration parameters** (when adding to an agent):

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`return_history` | Boolean | Optional | When set to `true`, returns the full scratchpad content after writing. When `false` or omitted (default), returns the newly added note with confirmation

**Execution parameters** (when calling the tool directly):

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`notes` | String | Required | The content to write to the scratchpad
`return_history` | Boolean | Optional | When set to `true`, returns the full scratchpad content after writing. When `false` or omitted (default), returns the newly added note with confirmation

### Testing WriteToScratchPadTool

You can directly use the tools API to execute WriteToScratchPadTool and test the tool response before registering it with your agents.

```json
POST /_plugins/_ml/tools/_execute/WriteToScratchPadTool
{
  "parameters": {
    "notes": "Research Plan for OpenSearch History and ML Evolution:\\n\\n1. OpenSearch version history, major releases after v2.0\\n2. For each major release:\\n    a. Key architectural upgrades\\n    b. New machine learning capabilities, especially ML Commons Agent framework \\n    c. Descriptions of major Agent tools added\\n    d. GitHub issue IDs tied to Agent framework features\\n3. Look for official OpenSearch documentation, release notes, blogs\\n4. Search code repositories for more technical details on ML changes\\n"
  }
}
```
{% include copy-curl.html %}

You can see the sample response from the tool output as follows:
```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "Wrote to scratchpad: Research Plan for OpenSearch History and ML Evolution:\\n\\n1. OpenSearch version history, major releases after v2.0\\n2. For each major release:\\n    a. Key architectural upgrades\\n    b. New machine learning capabilities, especially ML Commons Agent framework \\n    c. Descriptions of major Agent tools added\\n    d. GitHub issue IDs tied to Agent framework features\\n3. Look for official OpenSearch documentation, release notes, blogs\\n4. Search code repositories for more technical details on ML changes\\n"
        }
      ]
    }
  ]
}
```
you can opt to set `return_history` parameter to `true` to get the full scratchpad content after writing.

```json
POST /_plugins/_ml/tools/_execute/WriteToScratchPadTool
{
  "parameters": {
    "notes": "Research Plan for OpenSearch History and ML Evolution:\\n\\n1. OpenSearch version history, major releases after v2.0\\n2. For each major release:\\n    a. Key architectural upgrades\\n    b. New machine learning capabilities, especially ML Commons Agent framework \\n    c. Descriptions of major Agent tools added\\n    d. GitHub issue IDs tied to Agent framework features\\n3. Look for official OpenSearch documentation, release notes, blogs\\n4. Search code repositories for more technical details on ML changes\\n",
    "return_history": true
  }
}
```
{% include copy-curl.html %}

You can see the full content in the response:

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "response",
                    "result": "Scratchpad updated. Full content:\n- Research Plan for OpenSearch History and ML Evolution:\\n\\n1. OpenSearch version history, major releases after v2.0\\n2. For each major release:\\n    a. Key architectural upgrades\\n    b. New machine learning capabilities, especially ML Commons Agent framework \\n    c. Descriptions of major Agent tools added\\n    d. GitHub issue IDs tied to Agent framework features\\n3. Look for official OpenSearch documentation, release notes, blogs\\n4. Search code repositories for more technical details on ML changes\\n"
                }
            ]
        }
    ]
}
```
{% include copy-curl.html %}

## Example: Building a research agent with scratchpad tools

## Step 1: Register and deploy a model

Register a conversational model that supports the agent framework. The following example uses Anthropic Claude:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "Claude Sonnet for Research Agent",
  "function_name": "remote",
  "description": "Claude model for research agent with scratchpad",
  "connector": {
    "name": "Bedrock Claude Sonnet Connector",
    "description": "Amazon Bedrock connector for Claude Sonnet",
    "version": 1,
    "protocol": "aws_sigv4",
    "parameters": {
      "region": "us-east-1",
      "service_name": "bedrock",
      "model": "anthropic.claude-3-5-sonnet-20241022-v2:0"
    },
    "credential": {
      "access_key": "${AWS_ACCESS_KEY_ID}",
      "secret_key": "${AWS_SECRET_ACCESS_KEY}",
      "session_token": "${AWS_SESSION_TOKEN}"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
        "headers": {
          "content-type": "application/json"
        },
        "request_body": """{"system": [{"text": "${parameters.system_prompt}"}], "messages": ${parameters.messages}, "inferenceConfig": {"maxTokens": 8000, "temperature": 0}}"""
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Step 2: Register an agent with scratchpad tools

Register a conversational agent that includes both scratchpad tools along with other research tools:

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Research Agent with Scratchpad",
    "type": "conversational",
    "description": "Research assistant with persistent scratchpad memory",
    "app_type": "rag",
    "llm": {
        "model_id": "your-model-id",
        "parameters": {
            "max_iteration": 50,
            "system_prompt": "You are a sophisticated research assistant with access to OpenSearch indices and a persistent scratchpad for note-taking.\n\nYour Research Workflow:\n1. Check Scratchpad: Before starting a new research task, check your scratchpad to see if you have any relevant information already saved\n2. Create Research Plan: Create a structured research plan\n3. Write to Scratchpad: Save the research plan and any important information to your scratchpad\n4. Use Search: Gather information using OpenSearch search queries\n5. Update Scratchpad: After each search, update your scratchpad with new findings\n6. Iterate: Repeat searching and updating until you have comprehensive information\n7. Complete Task: Provide a thorough response based on your accumulated research\n\nRemember: Your scratchpad is temporary memory for this execution session only. Use it to organize your thoughts and findings during this task.",
            "prompt": "${parameters.question}"
        }
    },
    "memory": {
        "type": "conversation_index"
    },
    "parameters": {
        "_llm_interface": "bedrock/converse/claude"
    },
    "tools": [
        {
            "type": "SearchIndexTool"
        },
        {
            "type": "ListIndexTool"
        },
        {
            "type": "IndexMappingTool"
        },
        {
            "type": "ReadFromScratchPadTool",
            "name": "ReadFromScratchPadTool",
            "parameters": {
                "persistent_notes": "You are a helpful researcher. Before making searches, use the ListIndexTool to discover available indices. Write down important notes after using tools."
            }
        },
        {
            "type": "WriteToScratchPadTool",
            "name": "WriteToScratchPadTool"
        }
    ]
}
```
{% include copy-curl.html %}

## Step 3: Execute the agent

Execute the agent with a research question:

```json
POST /_plugins/_ml/agents/<your-agent-id>/_execute?async=true
{
    "parameters": {
        "question": "How many residents are in New York?"
    }
}
```
{% include copy-curl.html %}


The agent will:
1. Read from its scratchpad to check for existing relevant information (starts empty for new executions)
2. Create and save a research plan to the scratchpad
3. Execute searches and update the scratchpad with findings
4. Provide a comprehensive answer based on accumulated research

When using the `agents/<your-agent-id>/_execute` API, you will get a `parent_interaction_id` and `memory_id` in the response. Note the `parent_interaction_id` for later tracing steps.

## Viewing scratchpad activity

You can monitor how the agent uses the scratchpad by examining the execution traces:

```json
GET /_plugins/_ml/memory/message/<parent_interaction_id>/traces?next_token=0
```
{% include copy-curl.html %}

The traces will show the sequence of scratchpad reads and writes, demonstrating how the agent builds up its knowledge during the execution session.

## Scratchpad lifecycle

The scratchpad follows a simple lifecycle:

1. **Creation**: A new, empty scratchpad is created when an agent execution begins
2. **Usage**: During execution, the agent can read from and write to the scratchpad multiple times
3. **Cleanup**: The scratchpad is automatically cleared when the execution completes

Each call to the agent's `_execute` API creates a fresh scratchpad, ensuring executions are isolated from each other.

## Best practices

- **Structured notes**: Encourage agents to maintain organized, structured notes in the scratchpad
- **Regular updates**: Have agents update the scratchpad after each significant step or finding
- **Session awareness**: Remember that scratchpad content is temporary and specific to the current execution
- **Efficient usage**: Use the scratchpad for intermediate results that need to be referenced multiple times during execution

## Related pages

- [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/)
- [Conversational agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/)
