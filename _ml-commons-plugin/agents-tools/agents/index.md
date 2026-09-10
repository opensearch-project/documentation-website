---
layout: default
title: Agents
parent: Agents and tools
has_children: true
has_toc: false
nav_order: 20
redirect_from: 
  - /ml-commons-plugin/agents-tools/agents/
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/agents/index/
---

# Agents
**Introduced 2.13**
{: .label .label-purple }

An _agent_ is a coordinator that uses a large language model (LLM) to solve a problem. After the LLM reasons and decides what action to take, the agent coordinates the action execution. OpenSearch supports the following agent types:

- [_Flow agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/flow/): Runs tools sequentially, in the order specified in its configuration. The workflow of a flow agent is fixed. Useful for retrieval-augmented generation (RAG).
- [_Conversational flow agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational-flow/): Runs tools sequentially, in the order specified in its configuration. The workflow of a conversational flow agent is fixed. Stores conversation history so that users can ask follow-up questions. Useful for creating a chatbot.
- [_Conversational agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/): Reasons in order to provide a response based on the available knowledge, including the LLM knowledge base and a set of tools provided to the LLM. The LLM reasons iteratively to decide what action to take until it obtains the final answer or reaches the iteration limit. Stores conversation history so that users can ask follow-up questions. The workflow of a conversational agent is variable, based on follow-up questions. For specific questions, uses the Chain-of-Thought (CoT) process to select the best tool from the configured tools for providing a response to the question. Useful for creating a chatbot that employs RAG.
- [_Plan-execute-reflect agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/): Dynamically plans, executes, and refines multi-step workflows to solve complex tasks. Internally, a plan-execute-reflect agent uses a conversational agent to execute each individual step in the plan. The agent automatically selects the most appropriate tool for each step based on tool descriptions and context. Ideal for long-running, exploratory processes that benefit from iterative reasoning and adaptive execution. Useful for conducting research or performing root cause analysis (RCA).

## Hidden agents
**Introduced 2.13**
{: .label .label-purple }

To hide agent details from end users, including the cluster admin, you can register a _hidden_ agent. If an agent is hidden, non-superadmin users don't have permission to call any [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/index/), except for the [Execute API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/), on the agent.

Only superadmin users can register a hidden agent. To register a hidden agent, you first need to authenticate with an [admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates):

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XGET 'https://localhost:9200/.opendistro_security/_search'
```
{% include copy.html %}

All agents created by a superadmin user are automatically registered as hidden. Only the superadmin user can view hidden agent details and delete hidden agents.
To register a hidden agent, send a request to the `_register` endpoint:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -X POST 'https://localhost:9200/_plugins/_ml/agents/_register' -H 'Content-Type: application/json' -d '
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "name": "vector_tool",
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "zBRyYIsBls05QaITo5ex",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": [
          "text"
        ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "NWR9YIsBUysqmzBdifVJ",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\n Context:\n${parameters.vector_tool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}'
```
{% include copy.html %}

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For a step-by-step tutorial on using a plan-execute-reflect agent, see [Building a plan-execute-reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).
