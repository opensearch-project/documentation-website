---
layout: default
title: AI search workflows
parent: AI search
nav_order: 80
has_children: true
redirect_from:
  - /automating-configurations/
  - /automating-configurations/index/
  - /vector-search/ai-search/workflows/
---

# AI search workflows
**Introduced 2.13**
{: .label .label-purple }

You can automate complex OpenSearch setup and preprocessing tasks by providing templates for common use cases. For example, automating machine learning (ML) setup tasks streamlines the use of OpenSearch ML offerings. Workflow automation is limited to ML and vector search tasks.

OpenSearch use case templates provide a compact description of the setup process in a JSON or YAML document. These templates describe automated workflow configurations for conversational chat or query generation, AI connectors, tools, agents, and other components that prepare OpenSearch as a backend for generative models. For custom template examples, see [Sample templates](https://github.com/opensearch-project/flow-framework/tree/main/sample-templates). For OpenSearch-provided templates, see [Workflow templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/workflow-templates/).

Workflow automation provides the following benefits:

* **Use case templates**: Get started with predefined templates that outline the setup process for your general use cases.
* **Customizable workflows**: Customize the workflow templates to your specific use case.
* **Setup automation**: Easily configure AI connectors, tools, agents, and other components in a single API call.

## Template structure

**Templates** implement workflow automation in OpenSearch. You can provide these templates in JSON or YAML format. You can describe one or more templates with a sequence of steps required for a particular use case. Each template consists of the following elements:

* **Metadata**: A name, description, use case category, template version, and OpenSearch version compatibility range.
* **User input**: Parameters expected from the user that are common to all automation steps across all workflows, such as an index name.
* **Workflows**: One or more workflows containing the following elements:
    * **User input**: Parameters expected from the user that are specific to the steps in this workflow.
    * **Workflow Steps**: The workflow steps described as a directed acyclic graph (DAG):  
        * ***Nodes*** describe steps of the process, which may be executed in parallel. For the syntax of workflow steps, see [Workflow steps]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/workflow-steps/). 
        * ***Edges*** sequence nodes to be executed after the previous step is complete and may use the output fields of previous steps. When a node includes a key in the `previous_node_input` map referring to a previous node’s workflow step, a corresponding edge is automatically added to the template during parsing and may be omitted for the sake of simplicity.

## Next steps

To learn the syntax for the steps that make up a workflow, see [Workflow steps]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/workflow-steps/).
