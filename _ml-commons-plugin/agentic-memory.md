---
layout: default
title: Agentic memory
nav_order: 60
---

# Agentic memory
**Introduced 3.3**
{: .label .label-purple }

Agentic memory enables AI agents to learn, remember, and reason over structured information across conversations. Unlike simple conversation memory that only stores message history, agentic memory provides persistent, intelligent storage that helps agents maintain context, learn user preferences, and improve their responses over time.

Using agentic memory, you can build AI agents that can do the following:

- Remember user preferences across multiple conversation sessions
- Learn from past interactions to provide more personalized responses
- Maintain conversation context beyond simple message history
- Store and retrieve factual knowledge extracted from conversations
- Track agent execution traces for debugging and analysis
- Organize information across different users, sessions, or agent instances

Currently, agentic memory is designed for integration with external agent frameworks like LangChain and LangGraph. OpenSearch's internal [agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/) cannot interact with agentic memory.
{: .note}

## Memory containers

Agentic memory is organized into _memory containers_ that hold all memory types for a specific use case, such as a chatbot, research assistant, or customer service agent.

Each container can be configured with the following components:

- Text embedding models: For semantic search capabilities.
- Large language models (LLMs): For inference and knowledge extraction.
- [Memory processing strategies](#memory-processing-strategies): For defining how memories are processed or extracted.
- [Namespaces](#namespaces): For partitioning and isolating memories by context, user, agent, or session.

For example, to create a memory container with two strategies, send the following request:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "customer-service-agent",
  "description": "Memory container for customer service agent",
  "configuration": {
    "embedding_model_type": "TEXT_EMBEDDING",
    "embedding_model_id": "your-embedding-model-id",
    "llm_id": "your-llm-model-id",
    "strategies": [
      {
        "type": "USER_PREFERENCE",
        "namespace": ["user_id"]
      },
      {
        "type": "SUMMARY",
        "namespace": ["user_id", "session_id"]
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Memory types

Each memory container can store four distinct types of memory:

- `sessions` -- Manages conversation sessions and their metadata. Each session represents a distinct interaction context between users and agents, containing session-specific information such as start time, participants, and session state.

- `working` -- Stores active conversation data and structured information that agents use during ongoing interactions. This includes recent messages, current context, agent state, execution traces, and temporary data needed for immediate processing.

- `long-term` -- Contains processed knowledge and facts extracted from conversations over time. When inference is enabled, LLMs extract key insights, user preferences, and important information from working memory and store them as persistent knowledge.

- `history` -- Maintains an audit trail of all memory operations (add, update, delete) across the memory container. This provides a comprehensive log of how memories have evolved and changed over time.

## Payload types

When adding memories, you can specify different payload types:

- `conversational` -- Stores conversational messages between users and assistants.
- `data` -- Stores structured, non-conversational data such as agent state, checkpoints, or reference information.

To add a conversation memory with inference, send the following request:

```json
POST /_plugins/_ml/memory_containers/<container_id>/memories
{
  "messages": [
    {
      "role": "user",
      "content": "I prefer email notifications over SMS"
    },
    {
      "role": "assistant",
      "content": "I've noted your preference for email notifications"
    }
  ],
  "namespace": {
    "user_id": "user123",
    "session_id": "session456"
  },
  "payload_type": "conversational",
  "infer": true
}
```
{% include copy-curl.html %}

To add agent state data, send the following request:

```json
POST /_plugins/_ml/memory_containers/<container_id>/memories
{
  "structured_data": {
    "agent_state": "researching",
    "current_task": "analyze customer feedback",
    "progress": 0.75
  },
  "namespace": {
    "agent_id": "research-agent-1",
    "session_id": "session456"
  },
  "payload_type": "data",
  "infer": false
}
```
{% include copy-curl.html %}

## Inference mode

You can control how OpenSearch processes memories using the `infer` parameter:

- `false` (default) -- Stores raw messages and data in `working` memory without LLM processing.
- `true` -- Uses the configured LLM to extract key information and knowledge from the content.

## Memory processing strategies

Memory containers can use the following _strategies_ to automatically process and organize memories:

- `SEMANTIC` -- Groups related memories by meaning and content similarity.
- `USER_PREFERENCE` -- Extracts and stores user preferences from conversations.
- `SUMMARY` -- Creates condensed summaries of conversation content.

Strategies are optional; you can create containers without them for simple storage needs.

## Namespaces

_Namespaces_ organize memories within containers by grouping them with identifiers like `user_id`, `session_id`, or `agent_id`. This allows you to separate memories for different users or conversation sessions.

To search memories by namespace, send the following request:

```json
GET /_plugins/_ml/memory_containers/<container_id>/memories/long-term/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "namespace.user_id": "user123"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

## Example use cases

The following examples demonstrate how you can use agentic memory.

### Personalized chatbot

Create a memory container that learns user preferences over time:

- Store conversations in `working` memory with inference enabled.
- Extract user preferences into `long-term` memory using the `USER_PREFERENCE` strategy.
- Use namespaces to separate different users' memories.

### Research assistant agent

Build an agent that accumulates knowledge from research sessions:

- Store research queries and results in `working` memory.
- Use the `SEMANTIC` strategy to group related research topics.
- Maintain `history` to track how knowledge evolved over time.

### Customer service agent

Develop an agent that remembers customer interactions:

- Store customer conversations with inference to extract key issues.
- Use `SUMMARY` strategy to create concise interaction summaries.
- Organize by customer ID using namespaces.

## Getting started

To implement agentic memory in your agents:

1. **[Create a memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/)** with appropriate models and strategies.
2. **[Add memories]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)** during agent interactions.
3. **[Search and retrieve]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/)** relevant memories to inform agent responses.
4. **[Update memories]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory/)** as conversations evolve.

For detailed API documentation, see [Agentic Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/).

## Next steps

- Explore [memory container configuration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/) options.
- Review the complete [Agentic Memory API reference]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/).