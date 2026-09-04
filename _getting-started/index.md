---
layout: default
title: Getting started
nav_order: 1
has_children: true
has_toc: false
nav_exclude: true
description: "Get started with OpenSearch, the distributed search and analytics engine, by learning core concepts and how to install, ingest data, and run searches."
permalink: /getting-started/
next_steps:
  - heading: "Intro to OpenSearch"
    description: "Learn how OpenSearch stores data and ranks search results."
    link: "/getting-started/intro/"
  - heading: "Installation quickstart"
    description: "Install OpenSearch and OpenSearch Dashboards using Docker."
    link: "/getting-started/quickstart/"
  - heading: "Communicate with OpenSearch"
    description: "Send REST API requests to your cluster from a terminal or the Dev Tools console."
    link: "/getting-started/communicate/"
  - heading: "Add and manage your data"
    description: "Create your first OpenSearch index and add data to it."
    link: "/getting-started/manage-data/"
  - heading: "Ingest data"
    description: "Index multiple documents at once using the Bulk API and learn about other ingestion methods."
    link: "/getting-started/ingest-data/"
  - heading: "Search your data"
    description: "Query your data using query strings and query DSL."
    link: "/getting-started/search-data/"
  - heading: "Analyze your data"
    description: "Apply what you've learned to explore and summarize data in a larger dataset."
    link: "/getting-started/analyze-data/"
---

# Getting started with OpenSearch

OpenSearch is a distributed search and analytics engine based on [Apache Lucene](https://lucene.apache.org/). Use it as a data store and vector database to add search to an application, build AI-powered applications, and analyze logs, metrics, and traces.

## Watch a demo

Watch this video to explore key features of OpenSearch and see a demo of its core capabilities in action.

{% include youtube-player.html id='u1zxUSWWGjs' %}

## OpenSearch components

OpenSearch is more than just the core engine. The following components ingest, query, and visualize the data in your cluster:

- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/): A server-side data collector capable of filtering, enriching, transforming, normalizing, and aggregating data for downstream analysis and visualization.
- [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/): The OpenSearch data visualization UI.
- [Clients]({{site.url}}{{site.baseurl}}/clients/): Language APIs that let you communicate with OpenSearch in several popular programming languages.

The following image shows how these components interact.

![OpenSearch Data Prepper transforms and enriches data from your data sources and ingests it into the OpenSearch core engine, your application ingests and searches data using the REST API or a language client, and OpenSearch Dashboards visualizes the data]({{site.url}}{{site.baseurl}}/images/getting-started/components.png){: width="900" }

OpenSearch provides additional tools for specific tasks. Use [OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/) to measure the performance of your cluster and [Migration Assistant]({{site.url}}{{site.baseurl}}/migration-assistant/) to migrate to OpenSearch from another search engine.

## Common use cases

OpenSearch supports various use cases, with search and observability among the most common.

### Search

After adding your data to OpenSearch, you can perform full-text searches on it with all of the features you might expect: search by field, search multiple indexes, boost fields, rank results by score, sort results by field, and aggregate results. Unsurprisingly, builders often use a search engine like OpenSearch as the backend for a [search application]({{site.url}}{{site.baseurl}}/search-plugins/)---think [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:FAQ/Technical#What_software_is_used_to_run_Wikipedia?) or an online store. It offers excellent performance and can scale up or down as the needs of the application grow or shrink.

### Vector search

Search applications often need to match on meaning rather than on exact words. With [vector search]({{site.url}}{{site.baseurl}}/vector-search/), OpenSearch stores _vector embeddings_---numerical representations of data such as text, images, or audio---and returns the results that are closest to a query in that vector space. This approach underlies semantic search, retrieval-augmented generation (RAG), and multimodal search, and you can combine it with full-text search in a single query. OpenSearch can generate the embeddings for you from [machine learning models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/) that you deploy to your cluster.

### Observability

Another popular use case is [observability]({{site.url}}{{site.baseurl}}/observing-your-data/), in which you take the logs, metrics, and traces from your applications and infrastructure, feed them into OpenSearch, and use the rich search and visualization functionality to identify issues. For example, a malfunctioning web server might throw a 500 error 0.5% of the time, which can be hard to notice unless you have a real-time graph of all HTTP status codes that the server has thrown in the past four hours. You can use [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/) to build these sorts of visualizations from data in OpenSearch.

## Next steps

To learn OpenSearch and run your first searches, follow these steps in order. Each one builds on the cluster and data created by the ones before it, so start by installing OpenSearch and work through the sequence.

{% include list.html list_items=page.next_steps %}
