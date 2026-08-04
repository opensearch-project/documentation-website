---
layout: default
title: Relevance agent
nav_order: 100
parent: Search Relevance Workbench
grand_parent: Optimizing search quality
has_toc: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/relevance-agent/
---

# Relevance agent
**Introduced 3.6**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/20602).
{: .warning}

The OpenSearch relevance agent helps you identify and resolve search relevance issues through natural language conversation. Using a chat interface embedded in OpenSearch Dashboards, you can interactively diagnose problems, receive step-by-step tuning guidance, and execute complex workflows. The agent leverages the tools provided by the [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/).

The agent is part of the [OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server), a standalone service that hosts and orchestrates AI-powered agents for OpenSearch workflows.

## How it works

When you submit a message through the chat interface, a **router** analyzes the context and directs the request to the relevance agent when appropriate. The router activates the relevance agent when you're on Search Relevance Workbench pages or the search workspace homepage.

The relevance agent operates as a multi-agent system. An internal orchestrator interprets your intent and delegates work to specialized subagents, each responsible for a specific part of the relevance tuning process. The orchestrator synthesizes results from the subagents and streams them back to you in real time.

## Specialized agents

The relevance agent orchestrator coordinates three specialized subagents. These subagents are invoked automatically based on your questions and do not require separate configuration.

### User behavior analysis agent

The user behavior analysis agent analyzes [User Behavior Insights (UBI)]({{site.url}}{{site.baseurl}}/search-plugins/ubi/) data to examine engagement patterns and click-through rates. It identifies high-performing and poorly performing queries, correlates user behavior with search quality issues, and provides metrics-driven insights to inform tuning decisions.

### Hypothesis generation agent

The hypothesis generation agent examines query structure and DSL configurations to analyze search quality issues. It uses UBI data to identify patterns and generates testable hypotheses for improvements, such as field weight adjustments or query boosting strategies. Before recommending configuration changes, it validates hypotheses using [pairwise comparison experiments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/comparing-search-results/).

### Evaluation agent

The evaluation agent designs and executes offline relevance evaluation experiments. It creates [judgment lists]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/) from UBI click data when sufficient event data is available or from LLM-generated relevance ratings when click data is limited. The agent then runs experiments using your [search configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/) and computes search quality metrics (NDCG, MAP, and Precision@K) to compare their performance.

## Prerequisites

Before using the relevance agent, ensure that you have the following components:

- **OpenSearch Agent Server** -- The agent server must be running and connected to your OpenSearch cluster. For setup instructions, see the [OpenSearch Agent Server repository](https://github.com/opensearch-project/opensearch-agent-server).
- **OpenSearch Dashboards** -- The chat interface is embedded in OpenSearch Dashboards. You must configure OpenSearch Dashboards to point to the running agent server.
- **A large language model (LLM) provider** -- Configure an LLM for the agent server. The only provider supported is [Amazon Bedrock](https://aws.amazon.com/bedrock/).
- **User Behavior Insights (UBI)** (Optional) -- For behavior-driven analysis and judgment generation from click data, [enable UBI]({{site.url}}{{site.baseurl}}/search-plugins/ubi/) and configure it to collect events on your cluster.

## Accessing the agent

After the agent server is running and Dashboards is configured, access the relevance agent by selecting the chat icon in the OpenSearch Dashboards header. Navigate to a Search Relevance Workbench page or the search workspace homepage to activate the agent.

The agent responds in real time and may request your confirmation before executing experiment steps.

## Next steps

- [Setting up the OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server)
- [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/)
- [User Behavior Insights]({{site.url}}{{site.baseurl}}/search-plugins/ubi/)
- [Experiments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/experiments/)
