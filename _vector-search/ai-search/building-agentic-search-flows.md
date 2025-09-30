---
layout: default
title: Configuring agentic search
parent: Building AI search workflows in OpenSearch Dashboards
grand_parent: AI search
nav_order: 20
---

# Configuring agentic search

This is an experimental UI feature. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).  
{: .warning}

**Introduced 3.3**
{: .label .label-purple }

Agentic search lets you ask questions in natural language and have OpenSearch agents plan and execute the retrieval automatically. The AI Search Flows plugin offers an intuitive user interface for configuring agents, equipping agents with different tools, and executing agentic searches.

**Prerequisite: Provision ML resources**<br>
If you'd like to configure new agents, be sure to first provision appropriate models. For working examples, see [here]({{site.url}}{{site.baseurl}}/TODO/).

**Prerequisite: Ingest data**<br>
Ensure you have a sufficient number of documents in your cluster to reasonably evaluate your agentic searches.

<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

## Agentic search workflow editor

You can build and test your agentic search workflow in the editor, shown in the following image.

![Agentic search workflow editor]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-editor.png)

The workflow editor is organized into two main components:

- **Configure agent**: The resizable panel panel for configuring agents. Select existing agents to view details, update existing agents, or create new agents from scratch. Create `flow` or `conversational` agents, and enable different tools to expand your agent's capabilities, such as searching the web, or searching other indices in your cluster. For full customization, toggle to the `JSON` view and edit directly.
- **Test flow**: The resizable panel for executing your agentic search flow. This consists of 2 main selections:
  - **Index**: Select an existing index to search against, or search against all available indices.
  - **Query**: Write your natural language query. Optionally add query fields, which help the agent focus on particular fields in your selected index to search against (if applicable). You may also toggle to the `JSON` view to edit the full `agentic` search query directly.

## Example: Product search with GPT-5

This example is using a deployed OpenAI GPT-5 model as specified [here]({{site.url}}{{site.baseurl}}/TODO/).
{: .note}

1. On the **Workflows** page, select the **New workflow** tab, as shown in the following image.
   ![New workflow page]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/new-workflow-page.png)
2. In the **Agentic Search** template, select **Create**.
3. Provide some basic details, as shown in the following image:
   - A unique workflow name and description
     ![Quick configure modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-quick-configure-modal.png)
4. Click **Create** to create your workflow, and automatically navigate to the **Workflow Details** page, where you can begin configuring.
5. Under **Configure agent**, click **Create new agent**. This will pre-populate an agent for you. Provide a unique name and description.
6. Under **Tools** > **Query Planning** > **Query planning model**, select the **GPT-5** model.
7. Click **Create agent** in the bottom-left corner.
   ![Agent configuration]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agent-configuration.png)
8. Under **Test flow** > **Index**, select the index you'd like to search against. In this case, a sample index `sports_and_outdoors` containing a subset of documents from the MIT-licensed [AmazonReview2023 dataset](https://github.com/hyp1231/AmazonReviews2023).
9. Under **Test flow** > **Search**, enter a natural language query describing the results you want.
10. Click **Search**. The agent may take several seconds to execute.
    ![Agent searching]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agent-searching.png)
11. Under **Generated query**, view the query DSL that the agent generated and ran against your cluster.
    ![Agent query]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-agent-query.png)
12. Under **Search results**, view the **Raw response**, the formatted table of **Hits**, or **Aggregations** if applicable.
    ![Search results]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-results.png)
