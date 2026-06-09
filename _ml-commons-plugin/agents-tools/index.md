---
layout: default
title: Agents and tools
has_children: true
has_toc: false
nav_order: 20
redirect_from:
  - /ml-commons-plugin/agents-tools/
---

# Agents and tools
**Introduced 2.13**
{: .label .label-purple }

You can automate machine learning (ML) tasks using agents and tools.

An _agent_ orchestrates and runs ML models and tools. For a list of supported agents, see [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/).

A _tool_ performs a set of specific tasks. Some examples of tools are the [`VectorDBTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/vector-db-tool/), which supports vector search, and the [`ListIndexTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/list-index-tool/), which executes the List Indices API. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

You can modify and transform tool outputs using a [processor chain]({{site.url}}{{site.baseurl}}/ml-commons-plugin/processor-chain/).
This section describes OpenSearch agents and tools that run inside the OpenSearch cluster and perform common OpenSearch operations such as listing indexes and running queries. 

## Related features

OpenSearch also provides tools for external AI assistants to connect to and query your clusters. These tools run outside your OpenSearch cluster. For more information, see [AI agent integrations]({{site.url}}{{site.baseurl}}/ai-agent-integrations/).
