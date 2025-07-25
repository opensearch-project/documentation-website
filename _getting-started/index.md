---
layout: default
title: Getting started
nav_order: 1
has_children: true
has_toc: false
nav_exclude: true
permalink: /getting-started/
canonical_url: https://docs.opensearch.org/latest/getting-started/
---

# Getting started

OpenSearch is a distributed search and analytics engine based on [Apache Lucene](https://lucene.apache.org/). After adding your data to OpenSearch, you can perform full-text searches on it with all of the features you might expect: search by field, search multiple indexes, boost fields, rank results by score, sort results by field, and aggregate results.

Unsurprisingly, builders often use a search engine like OpenSearch as the backend for a search application---think [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:FAQ/Technical#What_software_is_used_to_run_Wikipedia?) or an online store. It offers excellent performance and can scale up or down as the needs of the application grow or shrink.

An equally popular, but less obvious use case is log analytics, in which you take the logs from an application, feed them into OpenSearch, and use the rich search and visualization functionality to identify issues. For example, a malfunctioning web server might throw a 500 error 0.5% of the time, which can be hard to notice unless you have a real-time graph of all HTTP status codes that the server has thrown in the past four hours. You can use [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/) to build these sorts of visualizations from data in OpenSearch.

## Components

OpenSearch is more than just the core engine. It also includes the following components:

- [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/): The OpenSearch data visualization UI.
- [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/): A server-side data collector capable of filtering, enriching, transforming, normalizing, and aggregating data for downstream analysis and visualization.
- [Clients]({{site.url}}{{site.baseurl}}/clients/): Language APIs that let you communicate with OpenSearch in several popular programming languages.

## Use cases

OpenSearch supports a variety of use cases, for example:

- [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/): Visualize data-driven events by using Piped Processing Language (PPL) to explore, discover, and query data stored in OpenSearch.
- [Search]({{site.url}}{{site.baseurl}}/search-plugins/): Choose the best search method for your application, from regular lexical search to conversational search powered by machine learning (ML).
- [Machine learning]({{site.url}}{{site.baseurl}}/ml-commons-plugin/): Integrate ML models into your OpenSearch application.
- [Security analytics]({{site.url}}{{site.baseurl}}/security-analytics/): Investigate, detect, analyze, and respond to security threats that can jeopardize organizational success and online operations. 

## Next steps

- See [Introduction to OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/intro/) to learn about essential OpenSearch concepts.