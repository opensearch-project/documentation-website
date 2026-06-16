---
layout: default
title: Learn about main applications and query languages
parent: Getting started
nav_order: 25
has_children: false
---

# Learn about main applications and query languages

OpenSearch Dashboards provides several applications for working with your data. The standard workflow is to explore your data, build individual visualizations, then assemble those visualizations into a dashboard.

## The Discover application

The **Discover** application lets you search, filter, and examine your data interactively. Use it to understand what fields are available, how data is distributed over time, and what patterns exist.

![The Discover application showing flight data filtered by delay]({{site.url}}{{site.baseurl}}/images/dashboards/opensearch-dashboards-discover.png){: width="700" }

For a hands-on tutorial, see [Explore the Discover application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-discover/). For the full reference, see [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).

## The Visualize application

The **Visualize** application lets you create charts, maps, tables, and other visual representations of your data using a point-and-click interface. You select a visualization type, configure metrics and buckets, and adjust display settings.

![A line chart created in the Visualize application]({{site.url}}{{site.baseurl}}/images/dashboards/visualize-app-line-chart-example.png){: width="700" }

For a hands-on tutorial, see [Explore the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-visualize/). For the full reference, see [Creating visualizations in the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).

## The Dashboards application

The **Dashboards** application lets you combine multiple visualizations into a single page for monitoring and analysis. You can add existing visualizations, create new ones, resize and reposition panels, and apply filters that affect all panels simultaneously.

![A dashboard with multiple visualization panels]({{site.url}}{{site.baseurl}}/images/dashboards/add-dash-panel.png){: width="700" }

For a hands-on tutorial, see [Explore the Dashboards application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-dashboards/). For the full reference, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).

## Dev Tools

The **Dev Tools** console lets you run OpenSearch API queries directly using [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/). Use it to test queries, manage indexes, and perform cluster operations without leaving the browser.

![The Dev Tools console showing a query and response]({{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-response.png){: width="700" }

For a hands-on tutorial, see [Run queries in the Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-dev-tools/). For the full reference, see [Running queries in the Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/discover/run-queries/).

## Query languages

In OpenSearch Dashboards, different applications support different query languages.

| Application | Query languages | Use case |
| :--- | :--- | :--- |
| [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) and [Dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/) search bar | [DQL]({{site.url}}{{site.baseurl}}/dashboards/dql/) or [query string (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) | Quick searches and filtering |
| [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-dev-tools/) | [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) | Full API access to OpenSearch |
| [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/) | [SQL]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql/) or [PPL]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/) | Querying data using familiar syntax |
| [Visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/) | [PPL]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/) or PromQL | Query-driven visualizations (requires [workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/)) |

## Next steps

- Try the first hands-on tutorial in [Explore the Discover application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-discover/).
