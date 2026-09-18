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

## Other ways to ingest data

Along with the Bulk API, you can ingest data into OpenSearch in the following ways:

- Collect, transform, and route data from your sources using OpenSearch Data Prepper, a server-side data collector that can enrich data for downstream analysis and visualization. For more information, see [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/).
- Index data from your application using an OpenSearch language client, which sends requests for you in the language you're already writing in. For more information, see [Language clients]({{site.url}}{{site.baseurl}}/clients/).
- Send data using a log agent or data collection tool that you already run. OpenSearch supports a range of third-party agents and ingestion tools. For more information, see [Agents and ingestion tools]({{site.url}}{{site.baseurl}}/tools/#agents-and-ingestion-tools).

## Next steps

- To query the documents that you indexed, see [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/).
