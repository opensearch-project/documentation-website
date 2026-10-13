---
layout: default
title: Getting started
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /dashboards/getting-started/
  - /dashboards/get-started/quickstart-dashboards/
  - /dashboards/quickstart-dashboards/
  - /dashboards/browser-compatibility/
  - /dashboards/quickstart/
install_items:
  - heading: "Install OpenSearch Dashboards"
    link: "/dashboards/getting-started/install/"
  - heading: "Access OpenSearch Dashboards"
    link: "/dashboards/getting-started/access/"
  - heading: "Prepare your data"
    link: "/dashboards/getting-started/data-setup/"
learn_items:
  - heading: "Learn about the main applications"
    description: "Explore what each application does and when to use it."
    link: "/dashboards/getting-started/learn-dashboards/"
  - heading: "Explore the Discover application"
    description: "Search and filter data."
    link: "/dashboards/getting-started/explore-discover/"
  - heading: "Explore the Visualize application"
    description: "Create a visualization."
    link: "/dashboards/getting-started/explore-visualize/"
  - heading: "Explore the Dashboards application"
    description: "View and filter a dashboard."
    link: "/dashboards/getting-started/explore-dashboards/"
  - heading: "Run queries in the Dev Tools console"
    description: "Send OpenSearch API requests using Query DSL."
    link: "/dashboards/getting-started/explore-dev-tools/"
workflow_items:
  - heading: "Explore data with Discover"
    description: "Search, filter, and examine your data interactively. Understand what fields are available, how data is distributed over time, and what patterns exist."
    link: "/dashboards/discover/index-discover/"
  - heading: "Build visualizations"
    description: "Learn about ways to create charts, maps, tables, and other visual representations of your data."
    link: "/dashboards/visualize/"
  - heading: "Assemble dashboards"
    description: "Combine multiple visualizations into a single page for monitoring and analysis."
    link: "/dashboards/dashboard/"
---

# Getting started with OpenSearch Dashboards

OpenSearch Dashboards is the web interface for OpenSearch. Use it to explore your data, build visualizations, assemble dashboards, and run queries.

Before you begin, ensure that you're familiar with basic OpenSearch concepts like documents and indexes. For more information, see [Introduction to OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/intro/).
{: .note}

## Step 1: Set up OpenSearch Dashboards

Choose one of the following options.

### Option 1: Use the OpenSearch Playground

Open the [OpenSearch Playground](https://playground.opensearch.org/app/home#/) in your browser. The Playground is read only and already includes the sample flight data, so you can start learning about the OpenSearch Dashboards applications in [Step 2](#step-2-explore-opensearch-dashboards-applications).

### Option 2: Use your own installation

To install OpenSearch Dashboards and add the sample data, follow these steps:

{% include list.html list_items=page.install_items %}

## Step 2: Explore OpenSearch Dashboards applications

{% include list.html list_items=page.learn_items %}

## Next steps

Once you're familiar with the applications, the standard approach to building dashboards follows three steps: explore your data, build individual visualizations, then assemble those visualizations into a dashboard. To learn about each step in detail, use the following links to explore the full documentation.

{% include list.html list_items=page.workflow_items %}
