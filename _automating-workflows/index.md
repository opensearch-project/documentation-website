---
layout: default
title: Automating workflows
nav_order: 1
has_children: false
nav_exclude: true
redirect_from: /automating-workflows/
---

# Automating workflows
**Introduced 2.12**
{: .label .label-purple }

You can automate complex OpenSearch setup and preprocessing tasks by providing templates for common use cases. For example, automating machine learning (ML) setup tasks streamlines the use of OpenSearch ML offerings.

In OpenSearch 2.12, automating workflows is limited to ML tasks.
{: .info}

OpenSearch use case templates provide a compact description of the setup process in a JSON or YAML document. These templates describe configurations for automated workflows for conversational chat or query generation, configuring AI connectors, tools, agents, and other components that prepare OpenSearch as a backend for generative models. 

## Key features

Automating workflows provides the following benefits:

* **Use case templates**: Get started with predefined templates that outline the setup process for your general use cases.
* **Customizable workflows**: Customize the workflows in the template for your specific use case.
* **Setup automation**: Easily configure AI connectors, tools, agents, and other components in a single API call.

## Overview

**Templates** implement workflow automation in OpenSearch. You can provide these templates in JSON or YAML format. You can describe one or more templates with a sequence of steps required in a particular use case. Each template consists of the following parts:

* **Metadata**: A name, description, use case category, template version, and OpenSearch version compatibility range.
* **User Input**: Parameters expected from the user which are common to all automation steps across all workflows, such as an index name.
* **Workflows**: One or more workflows containing the following elements:
    * **User Input**:  Parameters expected from the user specific to steps in this workflow.
    * **Workflow Steps**: The workflow steps described as a directed acyclic graph (DAG):  
        * ***Nodes*** describe steps of the process, which may be executed in parallel. For the syntax of workflow steps, see [Workflow steps]({{site.url}}{{site.baseurl}}/automating-workflows/workflow-steps/). 
        * ***Edges*** sequence nodes to be executed after the previous step completes and may use output fields of those previous steps. When a node includes a key in the `previous_node_input` map referring to a previous node’s workflow step, a corresponding edge is automatically added to the template during parsing and may be omitted for simplicity of the template.

## Next steps

- Flow Framework provides its own set of REST APIs. For details, see [Flow Framework APIs](https://quip-amazon.com/tBZPAb0qRx58/Flow-Framework#temp:C:PMc4eaad143dd4e44e9908f55699).
- For the workflow step syntax, see [Workflow steps]({{site.url}}{{site.baseurl}}/automating-workflows/workflow-steps/).  
- For a complete example, see [Workflow tutorial]({{site.url}}{{site.baseurl}}/automating-workflows/workflow-tutorial/).
- For configurable settings, see [Workflow settings]({{site.url}}{{site.baseurl}}/automating-workflows/workflow-settings/).
