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

[Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/) lets you ask questions in natural language and have OpenSearch agents plan and execute the retrieval automatically. OpenSearch Dashboards offers an intuitive UI for configuring agents, equipping agents with different tools, executing agentic searches, and how to use in your downstream applications.

![Agentic search editor]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-editor.png)

## Prerequisites

Before configuring agentic search, ensure that you fulfill the following prerequisites.

### Provision ML resources

To configure new agents, be sure to first provision appropriate models. For working examples, see [Model configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration).

### Ingest data

Ensure that you have a sufficient number of documents in your cluster to reasonably evaluate your agentic searches. For more information, see [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/).

## Accessing the plugin

To access the plugin, go to **OpenSearch Dashboards** and select **OpenSearch Plugins** > **AI Search Flows** from the top menu.

## Configuring agents

Agents are very customizable and can be configured in many different ways depending on your target use case. The following image shows a fully-configured conversational agent.

![Agent configuration]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agent-configuration.png)

### Agent types

`Flow` agents are optimized for speed and simplicity in query generation. `Conversational` agents can be configured with more tools and functionality for deeper thinking. Agent types can only be configured **once** during agent creation.

When configuring `Flow` agents, ensure to add an appropriate `response_filter` in the **Query Planning** tool. For more details, see [Register a flow agent]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/flow-agent/#step-4-register-a-flow-agent).  
{: .note}

### Models

Models can be optimized for different scenarios: cost-efficient, fast inference versus resource-intensive, deep-thinking approaches. For a list of tested, compatible models, see [Model configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration).

### Tools

All agents must have the **Query Planning** tool enabled for executing agentic searches. Query generation can be entirely LLM-generated (default), or can be steered to select from a list of available search templates. Search templates can be useful to maintain control over the queries generated, and for the model to leverage known, working, and performant queries.
![Search templates]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-search-template.png)

Other pre-built tools are available for `Conversational` agents, including **Search Index**, **List Index**, **Index Mapping**, and **Web Search**. Enable these to extend your agent's capabilities.

### MCP servers

Integrate with MCP servers to let `Conversational` agents access more external tools. Limit which tools the agents can access by configuring filters under **Tool filters**. For more information, see [Using external MCP servers]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/mcp-server).

## Running agentic searches

Test how the agents perform with different indices and different search queries. Collapse the **Configure agent** panel to focus entirely on running searches and viewing the search responses. The following image shows a search for **mens blue shirts** against an index **demo_amazon_fashion** with relevant result images.

![Agent configuration]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-configuration.png)

### Index

Try out different indices in your cluster. Select the **Inspect** button to view the index details. For `Conversational` agents, you can default to **All indices** and let the agent decide.

### Agent

Try out different agents you've created. Select the **Inspect** button to view the agent details.

### Query

Try out different natural language queries. You can also specify query fields for the agent to focus on in your selected index. To edit the full `agentic` search query directly, toggle to the **JSON** view. For `Conversational` agents, select **Continue conversation** after a search to persist the context for future searches. Select **Clear conversation** to remove any history and start a new conversation.

### Running searches

Select **Search** to execute an agentic search. This can take several seconds for the agent to reason about the query, analyze the indices and their mappings, and any other tool orchestration and execution the agent decided to do. If it's taking too long, or you want to try a new search, you can select **Stop**.

Once the search is completed, under **Generated query**, view the query domain-specific language (DSL) that the agent generated and ran against your cluster. Under **Search results**, view the search response. Depending on the response, you may see different tabs available, such as **Aggregations** if the response contains aggregations, or **Visual hits** if the documents contain images. **Raw response** will always be available. If the search was executed with a `Conversational` agent, you can select **View agent summary** to get a step-by-step breakdown of the agent's actions, including the sequence of tools it used and why.

### Using in your application

Select **Export** to view all of the underlying resources needed for leveraging agentic search in your downstream application, including the agent and search pipeline details.

![Agentic search export]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-export.png)

## Example: Product search with GPT-5

This example uses a deployed OpenAI GPT-5 model described in [this documentation]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#gpt-5-recommended), and an index generated from [Fashion Product Images Dataset](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset).
{: .note}

1. Navigate to the **AI Search Flows** plugin. On the **Workflows** page, select the **New workflow** tab, as shown in the following image. In the **Agentic Search** template, select **Create**.
   ![New workflow page]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/new-workflow-page.png)
2. Provide a unique workflow **Name** and an optional **Description**, as shown in the following image. Then select **Create** to create your workflow. You are automatically directed to the workflow editor, where you can begin configuring the agent.
   ![Quick configure modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-quick-configure-modal.png)
3. Under **Configure agent**, select **Create new agent**. Enter a unique **Name**, optionally provide a **Description**, and under **Model**, select the deployed **OpenAI GPT-5** model. Finally, select **Create agent** at the bottom.
   ![Agentic search configuration]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-example-configuration.png)
4. Under **Agentic search**, select the index you'd like to search against. The agent will already be selected.
5. Under **Query**, enter a natural language query about your data. Select **Search** to run an agentic search.
   ![Agentic search]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-example-search.png)
6. View the agent's generated query, the search hits, and agent summary.
   ![Agentic search results]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/agentic-search-example-search-results.png)

## Next steps

- Learn more about Agentic Search [here]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/)
- Learn more about agents [here]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agent-tools/agents/index/)
- Join the discussion on the [OpenSearch forum](https://forum.opensearch.org/)
- For any issues or bugs found, please open an issue on [GitHub](https://github.com/opensearch-project/dashboards-flow-framework)
- TODO link to blog
