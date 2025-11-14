---
layout: default
title: Configuring agentic search
parent: Building AI search workflows in OpenSearch Dashboards
grand_parent: AI search
nav_order: 20
---

# Configuring agentic search
**Introduced 3.3**
{: .label .label-purple }

This is an experimental UI feature. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).  
{: .warning}

[Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/) lets you ask questions in natural language and have OpenSearch agents plan and execute the retrieval automatically. OpenSearch Dashboards offers an intuitive UI for configuring agents, equipping agents with different tools, and executing agentic searches.

## Prerequisites

Before configuring agentic search, ensure that you fulfill the following prerequisites.

### Provision ML resources

To configure new agents, be sure to first provision appropriate models. For working examples, see [Model configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration).

### Ingest data

Ensure that you have a sufficient number of documents in your cluster to reasonably evaluate your agentic searches. For more information, see [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/).

## Example: Product search with GPT-5

This example uses a deployed OpenAI GPT-5 model described in [this documentation]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#gpt-5-recommended).
{: .note}

To build and test your agentic search workflow in OpenSearch Dashboards, follow these steps:

1. Go to **OpenSearch Dashboards** and select **OpenSearch Plugins** > **AI Search Flows** from the top menu.
1. On the **Workflows** page, select the **New workflow** tab, as shown in the following image. In the **Agentic Search** template, select **Create**.
   ![New workflow page]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/new-workflow-page.png)
1. Provide a unique workflow **Name** and an optional **Description**, as shown in the following image. Then select **Create** to create your workflow. You are automatically directed to the workflow editor, where you can begin configuring the agent.
     ![Quick configure modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-quick-configure-modal.png)
1. Under **Configure agent**, select **Create new agent**, as shown in the following image. Once you configure an agent, you can select or update existing agents. For full agent customization, toggle to the `JSON` view and edit directly.
    ![Agentic search workflow editor]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-editor.png)
1. Under **Agent**, enter a unique **Name** and **Description** for the agent, as shown in the following image. Under **Tools** > **Query Planning** > **Query planning model**, select **OpenAI GPT-5**. Then select **Create agent**.
    ![Agent configuration]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agent-configuration.png)
1. Under **Test flow** > **Index**, select the index you'd like to search, as shown in the following image. Under **Test flow** > **Query**, enter a natural language query. Optionally, specify query fields for the agent to search in your selected index. To edit the full `agentic` search query directly, toggle to the `JSON` view. Then select **Search**. The agent may take several seconds to execute.
    ![Agent searching]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agent-searching.png)
1. Under **Generated query**, view the query domain-specific language (DSL) that the agent generated and ran against your cluster.
    ![Agent query]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-agent-query.png)
1. Under **Search results**, select **Raw response**, the formatted table of **Hits**, or **Aggregations** to view the results.
    ![Search results]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-results.png)
