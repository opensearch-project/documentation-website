---
layout: default
title: Conversational agents
has_children: false
has_toc: false
nav_order: 30
parent: Agents
grand_parent: Agents and tools
---

# Conversational agents
**Introduced 2.13**
{: .label .label-purple }

Similarly to a [conversational flow agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational-flow/), a conversational agent stores a conversation in an index, in the following example, the `conversation_index`. A conversational agent can be configured with a large language model (LLM) and a set of supplementary tools that perform specific jobs. For example, you can set up an LLM and a `CATIndexTool` when configuring an agent. When you send a question to the model, the agent also includes the `CATIndexTool` as context. The LLM then decides whether it needs to use the `CATIndexTool` to answer questions like "How many indexes are in my cluster?" The context allows an LLM to answer specific questions that are outside of its knowledge base. For example, the following agent is configured with an LLM and a `CATIndexTool` that retrieves information about your OpenSearch indexes:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ReAct_ClaudeV2",
  "type": "conversational",
  "description": "this is a test agent",
  "llm": {
    "model_id": "YOUR_LLM_MODEL_ID",
    "parameters": {
      "max_iteration": 5,
      "stop_when_no_tool_found": true,
      "response_filter": "$.completion"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "VectorDBTool",
      "name": "VectorDBTool",
      "description": "A tool to search opensearch index with natural language question. If you don't know answer for some question, you should always try to search data with this tool. Action Input: <natural language question>",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": [ "text" ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "CatIndexTool",
      "name": "RetrieveIndexMetaTool",
      "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
    }
  ],
  "app_type": "my app"
}
```
{% include copy-curl.html %}

For more information about the Register Agent API request fields, see [Request body fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#request-body-fields).

For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).


## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).