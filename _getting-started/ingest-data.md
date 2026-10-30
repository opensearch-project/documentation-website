---
layout: default
title: Ingest data
nav_order: 40
description: "Get started with ingesting data into OpenSearch, including bulk indexing multiple documents, and experiment with sample data."
---

# Ingest your data into OpenSearch

Adding a document to an index is called *ingesting* or *indexing* the document. Although the terms are often used interchangeably, they have slightly different meanings: *ingesting* data means adding it to OpenSearch, while *indexing* means organizing that data so that it can be searched. When you add a document to an index, OpenSearch automatically indexes the document.

In [Add and manage your data]({{site.url}}{{site.baseurl}}/getting-started/manage-data/), you added documents one at a time. Because sending a separate request for every document isn't practical for a real dataset, OpenSearch provides the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/), which indexes many documents in a single request.

## Bulk indexing

These examples assume that the `students` index doesn't exist. If you didn't delete it at the end of [Add and manage your data]({{site.url}}{{site.baseurl}}/getting-started/manage-data/), send a `DELETE /students` request first.
{: .note}

To index several documents into the `students` index in one request, send the following request:

```json
POST _bulk
{ "create": { "_index": "students", "_id": "1" } }
{ "name": "John Doe", "gpa": 3.89, "grad_year": 2022 }
{ "create": { "_index": "students", "_id": "2" } }
{ "name": "Jonathan Powers", "gpa": 3.85, "grad_year": 2025 }
{ "create": { "_index": "students", "_id": "3" } }
{ "name": "Jane Doe", "gpa": 3.52, "grad_year": 2024 }
```
{% include copy-curl.html %}

Each document takes two lines: an action line naming the index and document ID, followed by the document itself. The `create` action fails if a document with that ID already exists; use `index` instead to overwrite existing documents.

To index your own data from a file, send the file to the `_bulk` endpoint. For more information, see [Submitting bulk requests using cURL]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/#submitting-bulk-requests-using-curl).

## Choosing an ingestion method

The Bulk API works well for loading a dataset once. For data that arrives continuously or comes from another system, choose a method based on where your data is. The following table lists the ingestion methods for common data sources.

| Data source | Ingestion method |
| :--- | :--- |
| Your application | An OpenSearch language client, which sends requests in the language that your application is written in. For more information, see [Language clients]({{site.url}}{{site.baseurl}}/clients/). |
| Log files on your hosts | A log collector such as Fluent Bit that forwards logs to [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/), a server-side data collector. For more information, see [Getting started with log analytics]({{site.url}}{{site.baseurl}}/observing-your-data/log-ingestion/). |
| Applications instrumented using OpenTelemetry | The Data Prepper OTLP source, which receives logs, metrics, and traces. For more information, see [OTLP source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otlp-source/). To monitor service performance using this data, see [Application Performance Monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/configuring-telemetry-ingestion/). |
| A collector that you already run, such as Jaeger, Logstash, or Beats | Configure Jaeger to use OpenSearch as its storage backend, install the OpenSearch output plugin for Logstash, or use a compatible version of Beats. For more information, see [Analyzing Jaeger trace data]({{site.url}}{{site.baseurl}}/observing-your-data/trace/trace-analytics-jaeger/), [Logstash]({{site.url}}{{site.baseurl}}/tools/logstash/), and [Agents and ingestion tools]({{site.url}}{{site.baseurl}}/tools/#agents-and-ingestion-tools). |
| Streams in Apache Kafka or Amazon Kinesis | Pull-based ingestion, in which OpenSearch reads directly from the stream. For more information, see [Pull-based ingestion]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/). |
| Objects in Amazon S3 | The Data Prepper S3 source. For more information, see [S3 source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/). |
| Databases and applications such as Atlassian Confluence or Jira | A Data Prepper source for that system. For more information, see [Sources]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/). |

After ingesting data from a common source, such as NGINX or Amazon VPC Flow logs, you can install an OpenSearch Dashboards integration that provides mappings and visualizations for that source. For more information, see [Integrations]({{site.url}}{{site.baseurl}}/dashboards/integrations/index/).

## Transforming data during ingestion

To parse, transform, or enrich documents during ingestion, use an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/) or [Data Prepper processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/). For more information, see [Ingest pipelines compared to Data Prepper]({{site.url}}{{site.baseurl}}/ingest-pipelines/#ingest-pipelines-compared-to-data-prepper).

## Next steps

- To query the documents that you indexed, see [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/).
