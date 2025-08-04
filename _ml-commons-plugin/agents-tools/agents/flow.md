---
layout: default
title: Flow agents
has_children: false
has_toc: false
nav_order: 10
parent: Agents
grand_parent: Agents and tools
---

# Flow agents
**Introduced 2.13**
{: .label .label-purple }

A flow agent is configured with a set of tools that it runs in order. For example, the following agent runs the `VectorDBTool` and then the `MLModelTool`. The agent coordinates the tools so that one tool's output can become another tool's input. In this example, the `VectorDBTool` queries the k-NN index, and the agent passes its output `${parameters.VectorDBTool.output}` to the `MLModelTool` as context along with the `${parameters.question}` (see the `prompt` parameter):

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": ["text"],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "YOUR_LLM_MODEL_ID",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer a question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say you don't know. \n\n Context:\n${parameters.VectorDBTool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
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