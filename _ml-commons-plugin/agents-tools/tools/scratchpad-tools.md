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

The scratchpad tools consist of `WriteToScratchPadTool` and `ReadFromScratchPadTool`, which enable agents to store and retrieve intermediate thoughts and results in persistent memory. These tools allow agents to break down complex tasks into smaller steps, maintain state across interactions, and facilitate communication between multiple agents.

## Use cases

- **Task decomposition**: Store research plans, intermediate findings, and progress notes during multi-step operations
- **State persistence**: Maintain context and accumulated knowledge across agent interactions
- **Inter-agent communication**: Share information between agents by writing to another agent's scratchpad
- **Research workflows**: Save key findings after searches to build comprehensive responses

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
      "access_key": "your-aws-access-key",
      "secret_key": "your-aws-secret-key",
      "session_token": "your-aws-session-token"
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
            "system_prompt": "You are a sophisticated research assistant with access to OpenSearch indices and a persistent scratchpad for note-taking.\n\nYour Research Workflow:\n1. Check Scratchpad: Before starting a new research task, check your scratchpad to see if you have any relevant information already saved\n2. Create Research Plan: Create a structured research plan\n3. Write to Scratchpad: Save the research plan and any important information to your scratchpad\n4. Use Search: Gather information using OpenSearch search queries\n5. Update Scratchpad: After each search, update your scratchpad with new findings\n6. Iterate: Repeat searching and updating until you have comprehensive information\n7. Complete Task: Provide a thorough response based on your accumulated research\n\nAlways maintain organized notes in your scratchpad and build upon previous research systematically.",
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
                "persistent_notes": "You are a helpful researcher. Before making searches, use the listIndexTool to discover available indices. Write down important notes after using tools."
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
POST /_plugins/_ml/agents/your-agent-id/_execute?async=true
{
    "parameters": {
        "question": "How many residents are in New York?"
    }
}
```
{% include copy-curl.html %}

The agent will:
1. Read from its scratchpad to check for existing relevant information
2. Create and save a research plan to the scratchpad
3. Execute searches and update the scratchpad with findings
4. Provide a comprehensive answer based on accumulated research

## Tool parameters

### ReadFromScratchPadTool

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`persistent_notes` | String | Optional | Initial notes or instructions to store in the scratchpad when first created

### WriteToScratchPadTool

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`notes` | String | Required (at execution) | The content to write to the scratchpad

## Execute parameters

When executing an agent with scratchpad tools, provide the following parameters:

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`question` | String | Required | The research question or task for the agent to work on
`notes` | String | Optional | Specific notes to write to the scratchpad (when using WriteToScratchPadTool directly)

## Viewing scratchpad activity

You can monitor how the agent uses the scratchpad by examining the execution traces:

```json
GET /_plugins/_ml/memory/message/your-memory-id/traces?next_token=0
```
{% include copy-curl.html %}

The traces will show the sequence of scratchpad reads and writes, demonstrating how the agent builds up its knowledge over time.

## Inter-agent communication

Scratchpad tools can facilitate communication between multiple agents. For example, a planning agent can write an execution plan to an executor agent's scratchpad:

1. **Planning Agent**: Creates a detailed plan and writes it to the executor's scratchpad
2. **Executor Agent**: Reads the plan from its scratchpad before beginning task execution

This enables sophisticated multi-agent workflows where agents can coordinate and share context effectively.

## Best practices

- **Structured notes**: Encourage agents to maintain organized, structured notes in the scratchpad
- **Regular updates**: Have agents update the scratchpad after each significant step or finding
- **Clear communication**: When using inter-agent communication, establish clear conventions for scratchpad content format
- **Memory management**: Consider the scratchpad as persistent memory that accumulates over the agent's lifetime

## Related pages

- [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/)
- [Conversational agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/)
