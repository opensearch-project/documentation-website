---
layout: default
title: Getting started
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /dashboards/getting-started/
  - /dashboards/get-started/quickstart-dashboards/
  - /dashboards/quickstart-dashboards/
  - /dashboards/browser-compatibility/
  - /dashboards/quickstart/
install_items:
  - heading: "Installation quickstart"
    description: "Install OpenSearch and OpenSearch Dashboards."
    link: "/dashboards/getting-started/install/"
  - heading: "Access OpenSearch Dashboards"
    description: "Open the UI, learn to navigate, and explore each application."
    link: "/dashboards/getting-started/access/"
  - heading: "Prepare your data"
    description: "Add sample data or ingest your own data and create an index pattern."
    link: "/dashboards/getting-started/data-setup/"
learn_items:
  - heading: "Learn about main applications and query languages"
    description: "Discover what each application does and when to use it."
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

## How to use this section

Follow this section using either the OpenSearch Playground or your own installation:

- To explore OpenSearch Dashboards without installing anything, use the [OpenSearch Playground](https://playground.opensearch.org/app/home#/). The Playground is read-only and already includes the sample flight data that the tutorials use. Start with [Learn about main applications and query languages](#learn-about-main-applications-and-query-languages).
- To follow the tutorials using your own instance, install OpenSearch and OpenSearch Dashboards and add the sample data. Start with [Install OpenSearch Dashboards and add data](#install-opensearch-dashboards-and-add-data), and then continue to [Learn about main applications and query languages](#learn-about-main-applications-and-query-languages).

For terminology definitions, see [Concepts]({{site.url}}{{site.baseurl}}/dashboards/getting-started/concepts/).

### Install OpenSearch Dashboards and add data

{% include list.html list_items=page.install_items %}

### Learn about main applications and query languages

{% include list.html list_items=page.learn_items %}

### Run queries in OpenSearch Dashboards

The Dev Tools console lets you run OpenSearch API queries written in [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) directly in a simplified syntax instead of using cURL. For more information, see [Running queries in the Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-dev-tools/).

## The typical workflow

Once you're familiar with the applications, the standard approach to building dashboards follows three steps: explore your data, build individual visualizations, then assemble those visualizations into a dashboard. To learn about each step in detail, use the following links to explore the full documentation.

{% include list.html list_items=page.workflow_items %}
