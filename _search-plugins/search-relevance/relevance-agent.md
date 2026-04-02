---
layout: default
title: Relevance Agent
nav_order: 20
parent: Search relevance
has_children: true
has_toc: false
---

# Relevance agent
Introduced 3.6
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/20602).
{: .warning}

The OpenSearch Relevance Agent enables you to identify relevance issues interactively, receive step-by-step guidance on tuning strategies, and execute complex workflows using natural language through a chat-based interface embedded in OpenSearch Dashboards. It leverages the suite of tools the [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/) provides.

The agent is part of the [OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server), a standalone service that hosts and orchestrates AI-powered agents for OpenSearch workflows.

## How it works

When you submit a message through the chat interface, a **router** analyzes the context and directs the request to the Relevance Agent when relevant. The Relevance Agent is itself a multi-agent system: an internal orchestrator interprets your intent and delegates work to specialized sub-agents, each responsible for a specific part of the relevance tuning process. The orchestrator synthesizes the results and streams them back to you in real time.

## Specialized agents

The Relevance Agent orchestrator coordinates three specialized sub-agents:

### User behavior analysis agent

The User Behavior Analysis Agent examines engagement patterns and click-through rates from [User Behavior Insights (UBI)]({{site.url}}{{site.baseurl}}/search-plugins/ubi/) data. It identifies high-performing and poorly performing queries, correlates user behavior with search quality issues, and surfaces metrics-driven insights to inform tuning decisions.

### Hypothesis generation agent

The Hypothesis Generation Agent analyzes search quality issues by examining query structure and DSL configurations. It leverages UBI data to identify patterns and generates testable hypotheses for potential improvements, such as field weight adjustments or query boosting strategies. It validates hypotheses using [pairwise comparison experiments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/comparing-search-results/) before recommending configuration changes.

### Evaluation agent

The Evaluation Agent designs and executes offline relevance evaluation experiments. It creates [judgment lists]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/) from UBI click data (when sufficient event data is available) or from LLM-generated relevance ratings. It then runs experiments using your [search configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/) and computes search quality metrics including NDCG, MAP, and Precision@K to compare them.

## Prerequisites

Before using the Relevance Agent, ensure that the following components are set up:

- **OpenSearch Agent Server**: The agent server must be running and connected to your OpenSearch cluster. For setup instructions, see the [OpenSearch Agent Server repository](https://github.com/opensearch-project/opensearch-agent-server).
- **OpenSearch Dashboards**: The chat interface is embedded in OpenSearch Dashboards. You must have Dashboards configured to point to the running agent server.
- **LLM provider**: An LLM must be configured for the agent server. [AWS Bedrock](https://aws.amazon.com/bedrock/) is currently supported as the model provider.
- **User Behavior Insights (optional)**: For behavior-driven analysis and judgment generation from click data, [UBI]({{site.url}}{{site.baseurl}}/search-plugins/ubi/) must be enabled and collecting events on your cluster.

The agent server requires Python 3.12 or later.

## Accessing the agent

Once the agent server is running and Dashboards is configured, you can access the Relevance Agent through the chat icon in the OpenSearch Dashboards header. The agent responds in real time using server-sent events (SSE) and may ask for your confirmation before executing experiment steps.

## Next steps

- [Setting up the OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server)
- [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/)
- [User Behavior Insights]({{site.url}}{{site.baseurl}}/search-plugins/ubi/)
- [Experiments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/experiments/)
