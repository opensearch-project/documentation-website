---
layout: default
title: Conversational flow agents
has_children: false
has_toc: false
nav_order: 20
parent: Agents
grand_parent: Agents and tools
---

# Conversational flow agents
**Introduced 2.13**
{: .label .label-purple }

Similarly to a [flow agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/flow/), a conversational flow agent is configured with a set of tools that it runs in order. The difference between them is that a conversational flow agent stores the conversation in an index, in the following example, the `conversation_index`. The following agent runs the `VectorDBTool` and then the `MLModelTool`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "population data analysis agent",
  "type": "conversational_flow",
  "description": "This is a demo agent for population data analysis",
  "app_type": "rag",
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "VectorDBTool",
      "name": "population_knowledge_base",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "test_population_data",
        "embedding_field": "population_description_embedding",
        "source_field": [
          "population_description"
        ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "name": "bedrock_claude_model",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "YOUR_LLM_MODEL_ID",
        "prompt": """

Human:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. 

Context:
${parameters.population_knowledge_base.output:-}

${parameters.chat_history:-}

Human:${parameters.question}

Assistant:"""
      }
    }
  ]
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