---
layout: default
title: Agentic memory APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 40
redirect_from: 
  - /ml-commons-plugin/api/agentic-memory-apis/
---

# Agentic memory APIs
**Introduced 3.3**
{: .label .label-purple }

Agentic Memory APIs provide persistent memory management for AI agents. This enables agents to learn, remember, and reason over structured information across conversations.

## Memory containers

Agentic memory is organized into **memory containers** that hold different types of memory data. Memory containers are the top-level organizational unit that holds all memory types for a specific use case. Each container can be configured with:

- **Text embedding models** for semantic search capabilities
- **Large language models (LLMs)** for inference and knowledge extraction
- **Memory processing strategies** (semantic analysis, summarization, user preference extraction)
- **Namespace organization** for multi-tenant or multi-session scenarios

## Memory types

Each memory container can store the following memory types:

- **`sessions`** - Manages conversation sessions and their metadata. Each session represents a distinct interaction context between users and agents, containing session-specific information such as start time, participants, and session state.

- **`working`** - Stores active conversation data and structured information that agents use during ongoing interactions. This includes recent messages, current context, agent state, execution traces, and temporary data needed for immediate processing.

- **`long-term`** - Contains processed knowledge and facts extracted from conversations over time. When inference is enabled, large language models extract key insights, user preferences, and important information from working memory and store them as persistent knowledge.

- **`history`** - Maintains an audit trail of all memory operations (add, update, delete) across the memory container. This provides a comprehensive log of how memories have evolved and changed over time.

## Payload types

When adding memories, you can specify the following payload types:

- **`conversational`** - Stores conversational messages between users and assistants.
- **`data`** - Stores structured, non-conversational data such as agent state, checkpoints, or reference information.

## Inference mode

You can control how OpenSearch processes memories using the `infer` parameter:

- **`false` (default)** - Stores raw messages and data in `working` memory without LLM processing.
- **`true`** - Uses the configured large language model (LLM) to extract key information and knowledge from the content.

## Memory processing strategies

Memory containers can use strategies to automatically process and organize memories:

- **`SEMANTIC`** - Groups related memories by meaning and content similarity
- **`USER_PREFERENCE`** - Extracts and stores user preferences from conversations
- **`SUMMARY`** - Creates condensed summaries of conversation content

Strategies are optional - you can create containers without them for simple storage needs.

## Disabling Agentic Memory APIs

Agentic Memory APIs are enabled by default. To disable Agentic Memory APIs, update the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
      "plugins.ml_commons.agentic_memory_enabled": false
  }
}
```
{% include copy-curl.html %}

OpenSearch supports the following memory container APIs:

- [Create memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/)
- [Get memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-container/)
- [Update memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory-container/)
- [Delete memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-container/)
- [Search memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory-container/)

OpenSearch supports the following memory APIs:

- [Add memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)
- [Get memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory/)
- [Update memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory/)
- [Delete memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory/)
- [Search memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/)