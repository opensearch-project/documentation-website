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
  - /data-prepper/migrating-from-logstash-data-prepper/
---

# ![Data Prepper icon]({{site.url}}{{site.baseurl}}/images/icons/OpenSearch-DataPrepper-1.png){: .heading-icon} OpenSearch Data Prepper

OpenSearch Data Prepper is a server-side data collector capable of filtering, enriching, transforming, normalizing, and aggregating data for downstream analysis and visualization. Data Prepper is the preferred data ingestion tool for OpenSearch. It is recommended for most data ingestion use cases in OpenSearch and for processing large, complex datasets.

With Data Prepper you can build custom pipelines to improve the operational view of applications. Two common use cases for Data Prepper are trace analytics and log analytics. [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/) can help you visualize event flows and identify performance problems. [Log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/) equips you with tools to enhance your search capabilities, conduct comprehensive analysis, and gain insights into your applications' performance and behavior.

## Key concepts

Data Prepper ingests data through [pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/), which process data as _events_. An event is a single data item, such as a log line or a trace span. When a pipeline writes to OpenSearch, each event becomes a document. Each pipeline reads events from a [source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/), transforms or drops them using [processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/), and writes the result to one or more [sinks]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/sinks/). For more information, see [Getting started with OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/).

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/){: .btn-dark-blue}
</span>
