---
layout: default
title: OpenSearch Data Prepper 
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /data-prepper/
redirect_from: 
  - /clients/data-prepper/index/
  - /monitoring-plugins/trace/data-prepper/
  - /data-prepper/index/
tutorial_cards:
  - heading: "Trace analytics"
    description: "Visualize event flows and find performance issues."
    link: "/data-prepper/common-use-cases/trace-analytics/"
  - heading: "Log analytics"
    description: "Search, analyze, and gain insights from logs."
    link: "/data-prepper/common-use-cases/log-analytics/"
items:
  - heading: "Getting started with OpenSearch Data Prepper"
    description: "Set up Data Prepper and start processing data."
    link: "/data-prepper/getting-started/"
  - heading: "Get familiar with Data Prepper pipelines"
    description: "Learn how to build and configure pipelines."
    link: "/data-prepper/pipelines/pipelines/"
  - heading: "Explore common use cases"
    description: "See how Data Prepper supports key use cases."
    link: "/data-prepper/common-use-cases/common-use-cases/"
---

# OpenSearch Data Prepper

OpenSearch Data Prepper is a server-side data collector capable of filtering, enriching, transforming, normalizing, and aggregating data for downstream analysis and visualization. Data Prepper is the preferred data ingestion tool for OpenSearch. It is recommended for most data ingestion use cases in OpenSearch and for processing large, complex datasets.

With Data Prepper you can build custom pipelines to improve the operational view of applications. Two common use cases for Data Prepper are trace analytics and log analytics. 

{% include cards.html cards=page.tutorial_cards %}

## Using OpenSearch Data Prepper

{% include list.html list_items=page.items%}