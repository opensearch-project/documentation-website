---
layout: default
title: Workflow tutorial
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/automating-configurations/workflow-tutorial/
---

# Workflow tutorial

You can automate the setup of common use cases, such as conversational chat, using a Chain-of-Thought (CoT) agent. An _agent_ orchestrates and runs ML models and tools. A _tool_ performs a set of specific tasks. This page presents a complete example of setting up a CoT agent. For more information about agents and tools, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/)

The setup requires the following sequence of API requests, with provisioned resources used in subsequent requests. The following list provides an overview of the steps required for this workflow. The step names correspond to the names in the template:

1. **Deploy a model on the cluster**
    * [`create_connector_1`](#create_connector_1): Create a connector to an externally hosted model.
    * [`register_model_2`](#register_model_2): Register a model using the connector that you created.
    * [`deploy_model_3`](#deploy_model_3): Deploy the model.
1. **Use the deployed model for inference**
    * Set up several tools that perform specific tasks:
      * [`cat_index_tool`](#cat_index_tool): Set up a tool to obtain index information.
      * [`ml_model_tool`](#ml_model_tool): Set up a machine learning (ML) model tool.
    * Set up one or more agents that use some combination of the tools:
      * [`sub_agent`](#sub_agent): Create an agent that uses the `cat_index_tool`.
    * Set up tools representing these agents:
      * [`agent_tool`](#agent_tool): Wrap the `sub_agent` so that you can use it as a tool.
    * [`root_agent`](#root_agent): Set up a root agent that may delegate the task to either a tool or another agent.

The following sections describe the steps in detail. For the complete workflow template, see [Complete YAML workflow template](#complete-yaml-workflow-template).

## Workflow graph

The workflow described in the previous section is organized into a [template](#complete-yaml-workflow-template). Note that you can order the steps in several ways. In the example template, the `ml_model_tool` step is specified right before the `root_agent` step, but you can specify it at any point after the `deploy_model_3` step and before the `root_agent` step. The following diagram shows the directed acyclic graph (DAG) that OpenSearch creates for all of the steps in the order specified in the template.

![Example workflow steps graph]({{site.url}}{{site.baseurl}}/images/automatic-workflow-dag.png){:style="width: 100%; max-width: 600px;" class="img-centered"}

## 1. Deploy a model on the cluster

To deploy a model on the cluster, you need to create a connector to the model, register the model, and deploy the model.

<!-- vale off -->
### create_connector_1
<!-- vale on -->

The first step in the workflow is to create a connector to an externally hosted model (in the following example, this step is called `create_connector_1`). The content of the `user_inputs` field exactly matches the ML Commons [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/):

```yaml
nodes:
- id: create_connector_1
  type: create_connector
  user_inputs:
    name: OpenAI Chat Connector
    description: The connector to public OpenAI model service for GPT 3.5
    version: '1'
    protocol: http
    parameters:
      endpoint: api.openai.com
      model: gpt-3.5-turbo
    credential:
      openAI_key: '12345'
    actions:
    - action_type: predict
      method: POST
      url: https://${parameters.endpoint}/v1/chat/completions
```

When you create a connector, OpenSearch returns a `connector_id`, which you need in order to register the model. 

<!-- vale off -->
### register_model_2
<!-- vale on -->

When registering a model, the `previous_node_inputs` field tells OpenSearch to obtain the required `connector_id` from the output of the `create_connector_1` step. Other inputs required by the [Register Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/) are included in the `user_inputs` field:

```yaml
- id: register_model_2
  type: register_remote_model
  previous_node_inputs:
    create_connector_1: connector_id
  user_inputs:
    name: openAI-gpt-3.5-turbo
    function_name: remote
    description: test model
```

The output of this step is a `model_id`. You must then deploy the registered model to the cluster. 

<!-- vale off -->
### deploy_model_3
<!-- vale on -->

The [Deploy Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/) requires the `model_id` from the previous step, as specified in the `previous_node_inputs` field:

```yaml
- id: deploy_model_3
  type: deploy_model
  # This step needs the model_id produced as an output of the previous step
  previous_node_inputs:
    register_model_2: model_id
```

When using the Deploy Model API directly, a task ID is returned, requiring use of the [Tasks API](https://docs.opensearch.org/latest/ml-commons-plugin/api/tasks-apis/get-task/) to determine when the deployment is complete. The automated workflow eliminates the manual status check and returns the final `model_id` directly.

### Ordering steps

To order these steps in a sequence, you must connect them by an edge in the graph. When a `previous_node_input` field is present in a step, OpenSearch automatically creates a node with `source` and `dest` fields for this step. The output of the `source` is required as input for the `dest`. For example, the `register_model_2` step requires the `connector_id` from the `create_connector_1` step. Similarly, the `deploy_model_3` step requires the `model_id` from the `register_model_2` step. Thus, OpenSearch creates the first two edges in the graph as follows in order to match the output with the required input and raise errors if the required input is missing:

```yaml
edges:
- source: create_connector_1
  dest: register_model_2
- source: register_model_2
  dest: deploy_model_3
```

If you define `previous_node_inputs`, then defining edges is optional.
{: .note}

## 2. Use the deployed model for inference

A CoT agent can use the deployed model in a tool. This step doesn’t strictly correspond to an API but represents a component of the body required by the [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/). This simplifies the register request and allows reuse of the same tool in multiple agents. For more information about agents and tools, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/).

<!-- vale off -->
### cat_index_tool
<!-- vale on -->

You can configure other tools to be used by the CoT agent. For example, you can configure a `cat_index_tool` as follows. This tool does not depend on any previous steps:

```yaml
- id: cat_index_tool
  type: create_tool
  user_inputs:
    name: CatIndexTool
    type: CatIndexTool
    parameters:
      max_iteration: 5
```

<!-- vale off -->
### sub_agent
<!-- vale on -->

To use the `cat_index_tool` in the agent configuration, specify it as one of the tools in the `previous_node_inputs` field of the agent. You can add other tools to `previous_node_inputs` as necessary. The agent also needs a large language model (LLM) in order to reason with the tools. The LLM is defined by the `llm.model_id` field. This example assumes that the `model_id` from the `deploy_model_3` step will be used. However, if another model is already deployed, the `model_id` of that previously deployed model could be included in the `user_inputs` field instead:

```yaml
- id: sub_agent
  type: register_agent
  previous_node_inputs:
    # When llm.model_id is not present this can be used as a fallback value
    deploy-model-3: model_id
    cat_index_tool: tools
  user_inputs:
    name: Sub Agent
    type: conversational
    description: this is a test agent
    parameters:
      hello: world
    llm.parameters:
      max_iteration: '5'
      stop_when_no_tool_found: 'true'
    memory:
      type: conversation_index
    app_type: chatbot
```

OpenSearch will automatically create the following edges so that the agent can retrieve the fields from the previous node: 

```yaml
- source: cat_index_tool
  dest: sub_agent
- source: deploy_model_3
  dest: sub_agent
```

<!-- vale off -->
### agent_tool
<!-- vale on -->

You can use an agent as a tool for another agent. Registering an agent produces an `agent_id` in the output. The following step defines a tool that uses the `agent_id` from the previous step:

```yaml
- id: agent_tool
  type: create_tool
  previous_node_inputs:
    sub_agent: agent_id
  user_inputs:
    name: AgentTool
    type: AgentTool
    description: Agent Tool
    parameters:
      max_iteration: 5
```

OpenSearch automatically creates an edge connection because this step specifies the `previous_node_input`:

```yaml
- source: sub_agent
  dest: agent_tool
```

<!-- vale off -->
### ml_model_tool
<!-- vale on -->

A tool may reference an ML model. This example gets the required `model_id` from the model deployed in a previous step:

```yaml
- id: ml_model_tool
  type: create_tool
  previous_node_inputs:
    deploy-model-3: model_id
  user_inputs:
    name: MLModelTool
    type: MLModelTool
    alias: language_model_tool
    description: A general tool to answer any question.
    parameters:
      prompt: Answer the question as best you can.
      response_filter: choices[0].message.content
```

OpenSearch automatically creates an edge in order to use the `previous_node_input`:

```yaml
- source: deploy-model-3
  dest: ml_model_tool
```

<!-- vale off -->
### root_agent
<!-- vale on -->

A conversational chat application will communicate with a single root agent that includes the ML model tool and the agent tool in its `tools` field. It will also obtain the `llm.model_id` from the deployed model. Some agents require tools to be in a specific order, which can be enforced by including the `tools_order` field in the user inputs:

```yaml
- id: root_agent
  type: register_agent
  previous_node_inputs:
    deploy-model-3: model_id
    ml_model_tool: tools
    agent_tool: tools
  user_inputs:
    name: DEMO-Test_Agent_For_CoT
    type: conversational
    description: this is a test agent
    parameters:
      prompt: Answer the question as best you can.
    llm.parameters:
      max_iteration: '5'
      stop_when_no_tool_found: 'true'
    tools_order: ['agent_tool', 'ml_model_tool']
    memory:
      type: conversation_index
    app_type: chatbot
```

OpenSearch automatically creates edges for the `previous_node_input` sources:

```yaml
- source: deploy-model-3
  dest: root_agent
- source: ml_model_tool
  dest: root_agent
- source: agent_tool
  dest: root_agent
```

For the complete DAG that OpenSearch creates for this workflow, see the [workflow graph](#workflow-graph).

## Complete YAML workflow template

The following is the final template including all of the `provision` workflow steps in YAML format:

<details open markdown="block">
  <summary>
    YAML template
  </summary>
  {: .text-delta}

```yaml
# This template demonstrates provisioning the resources for a 
# Chain-of-Thought chat bot
name: tool-register-agent
description: test case
use_case: REGISTER_AGENT
version:
  template: 1.0.0
  compatibility:
  - 2.12.0
  - 3.0.0
workflows:
  # This workflow defines the actions to be taken when the Provision Workflow API is used
  provision:
    nodes:
    # The first three nodes create a connector to a remote model, registers and deploy that model
    - id: create_connector_1
      type: create_connector
      user_inputs:
        name: OpenAI Chat Connector
        description: The connector to public OpenAI model service for GPT 3.5
        version: '1'
        protocol: http
        parameters:
          endpoint: api.openai.com
          model: gpt-3.5-turbo
        credential:
          openAI_key: '12345'
        actions:
        - action_type: predict
          method: POST
          url: https://${parameters.endpoint}/v1/chat/completions
    - id: register_model_2
      type: register_remote_model
      previous_node_inputs:
        create_connector_1: connector_id
      user_inputs:
        # deploy: true could be added here instead of the deploy step below
        name: openAI-gpt-3.5-turbo
        description: test model
    - id: deploy_model_3
      type: deploy_model
      previous_node_inputs:
        register_model_2: model_id
    # For example purposes, the model_id obtained as the output of the deploy_model_3 step will be used
    # for several below steps.  However, any other deployed model_id can be used for those steps.
    # This is one example tool from the Agent Framework.
    - id: cat_index_tool
      type: create_tool
      user_inputs:
        name: CatIndexTool
        type: CatIndexTool
        parameters:
          max_iteration: 5
    # This simple agent only has one tool, but could be configured with many tools
    - id: sub_agent
      type: register_agent
      previous_node_inputs:
        deploy-model-3: model_id
        cat_index_tool: tools
      user_inputs:
        name: Sub Agent
        type: conversational
        parameters:
          hello: world
        llm.parameters:
          max_iteration: '5'
          stop_when_no_tool_found: 'true'
        memory:
          type: conversation_index
        app_type: chatbot
    # An agent can be used itself as a tool in a nested relationship
    - id: agent_tool
      type: create_tool
      previous_node_inputs:
        sub_agent: agent_id
      user_inputs:
        name: AgentTool
        type: AgentTool
        parameters:
          max_iteration: 5
    # An ML Model can be used as a tool
    - id: ml_model_tool
      type: create_tool
      previous_node_inputs:
        deploy-model-3: model_id
      user_inputs:
        name: MLModelTool
        type: MLModelTool
        alias: language_model_tool
        parameters:
          prompt: Answer the question as best you can.
          response_filter: choices[0].message.content
    # This final agent will be the interface for the CoT chat user
    # Using a flow agent type tools_order matters
    - id: root_agent
      type: register_agent
      previous_node_inputs:
        deploy-model-3: model_id
        ml_model_tool: tools
        agent_tool: tools
      user_inputs:
        name: DEMO-Test_Agent
        type: flow
        parameters:
          prompt: Answer the question as best you can.
        llm.parameters:
          max_iteration: '5'
          stop_when_no_tool_found: 'true'
        tools_order: ['agent_tool', 'ml_model_tool']
        memory:
          type: conversation_index
        app_type: chatbot
    # These edges are all automatically created with previous_node_input
    edges:
    - source: create_connector_1
      dest: register_model_2
    - source: register_model_2
      dest: deploy_model_3
    - source: cat_index_tool
      dest: sub_agent
    - source: deploy_model_3
      dest: sub_agent
    - source: sub_agent
      dest: agent_tool
    - source: deploy-model-3
      dest: ml_model_tool
    - source: deploy-model-3
      dest: root_agent
    - source: ml_model_tool
      dest: root_agent
    - source: agent_tool
      dest: root_agent
```
</details>

## Complete JSON workflow template

The following is the same template in JSON format:

<details open markdown="block">
  <summary>
    JSON template
  </summary>
  {: .text-delta}

```json
{
  "name": "tool-register-agent",
  "description": "test case",
  "use_case": "REGISTER_AGENT",
  "version": {
    "template": "1.0.0",
    "compatibility": [
      "2.12.0",
      "3.0.0"
    ]
  },
  "workflows": {
    "provision": {
      "nodes": [
        {
          "id": "create_connector_1",
          "type": "create_connector",
          "user_inputs": {
            "name": "OpenAI Chat Connector",
            "description": "The connector to public OpenAI model service for GPT 3.5",
            "version": "1",
            "protocol": "http",
            "parameters": {
              "endpoint": "api.openai.com",
              "model": "gpt-3.5-turbo"
            },
            "credential": {
              "openAI_key": "12345"
            },
            "actions": [
              {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/chat/completions"
              }
            ]
          }
        },
        {
          "id": "register_model_2",
          "type": "register_remote_model",
          "previous_node_inputs": {
            "create_connector_1": "connector_id"
          },
          "user_inputs": {
            "name": "openAI-gpt-3.5-turbo",
            "description": "test model"
          }
        },
        {
          "id": "deploy_model_3",
          "type": "deploy_model",
          "previous_node_inputs": {
            "register_model_2": "model_id"
          }
        },
        {
          "id": "cat_index_tool",
          "type": "create_tool",
          "user_inputs": {
            "name": "CatIndexTool",
            "type": "CatIndexTool",
            "parameters": {
              "max_iteration": 5
            }
          }
        },
        {
          "id": "sub_agent",
          "type": "register_agent",
          "previous_node_inputs": {
            "deploy-model-3": "llm.model_id",
            "cat_index_tool": "tools"
          },
          "user_inputs": {
            "name": "Sub Agent",
            "type": "conversational",
            "parameters": {
              "hello": "world"
            },
            "llm.parameters": {
              "max_iteration": "5",
              "stop_when_no_tool_found": "true"
            },
            "memory": {
              "type": "conversation_index"
            },
            "app_type": "chatbot"
          }
        },
        {
          "id": "agent_tool",
          "type": "create_tool",
          "previous_node_inputs": {
            "sub_agent": "agent_id"
          },
          "user_inputs": {
            "name": "AgentTool",
            "type": "AgentTool",
            "parameters": {
              "max_iteration": 5
            }
          }
        },
        {
          "id": "ml_model_tool",
          "type": "create_tool",
          "previous_node_inputs": {
            "deploy-model-3": "model_id"
          },
          "user_inputs": {
            "name": "MLModelTool",
            "type": "MLModelTool",
            "alias": "language_model_tool",
            "parameters": {
              "prompt": "Answer the question as best you can.",
              "response_filter": "choices[0].message.content"
            }
          }
        },
        {
          "id": "root_agent",
          "type": "register_agent",
          "previous_node_inputs": {
            "deploy-model-3": "llm.model_id",
            "ml_model_tool": "tools",
            "agent_tool": "tools"
          },
          "user_inputs": {
            "name": "DEMO-Test_Agent",
            "type": "flow",
            "parameters": {
              "prompt": "Answer the question as best you can."
            },
            "llm.parameters": {
              "max_iteration": "5",
              "stop_when_no_tool_found": "true"
            },
            "tools_order": [
              "agent_tool",
              "ml_model_tool"
            ],
            "memory": {
              "type": "conversation_index"
            },
            "app_type": "chatbot"
          }
        }
      ],
      "edges": [
        {
          "source": "create_connector_1",
          "dest": "register_model_2"
        },
        {
          "source": "register_model_2",
          "dest": "deploy_model_3"
        },
        {
          "source": "cat_index_tool",
          "dest": "sub_agent"
        },
        {
          "source": "deploy_model_3",
          "dest": "sub_agent"
        },
        {
          "source": "sub_agent",
          "dest": "agent_tool"
        },
        {
          "source": "deploy-model-3",
          "dest": "ml_model_tool"
        },
        {
          "source": "deploy-model-3",
          "dest": "root_agent"
        },
        {
          "source": "ml_model_tool",
          "dest": "root_agent"
        },
        {
          "source": "agent_tool",
          "dest": "root_agent"
        }
      ]
    }
  }
}
```
</details>

## Next steps

To learn more about agents and tools, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/).