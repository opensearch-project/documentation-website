---
layout: default
title: Indexing data
nav_order: 3
redirect_from:
  - /opensearch/index-data/
---

# Indexing data

OpenSearch creates an index automatically the first time you add a document to a name that does not yet exist, and generates a document ID if you do not supply one. The following request creates the `movies` index and indexes one document into it:

```json
POST movies/_doc
{ "title": "Spirited Away" }
```
{% include copy-curl.html %}

Specify the ID yourself when you expect to update or retrieve the document later. Sending the following request repeatedly leaves a single document in the index and increments its `_version` field, whereas repeating the preceding request creates a new document each time:

```json
PUT movies/_doc/1
{ "title": "Spirited Away" }
```
{% include copy-curl.html %}

A document ID must be 512 bytes or smaller.

## Indexing multiple documents

To index many documents in one request, use the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/). Each action is described by a metadata line followed by the document itself, and every line must end with a newline character (`\n`), including the last one:

```json
POST _bulk
{ "index": { "_index": "movies", "_id": "2" } }
{ "title": "My Neighbor Totoro" }
{ "index": { "_index": "movies", "_id": "3" } }
{ "title": "Princess Mononoke" }
```
{% include copy-curl.html %}

Bulk requests give better throughput than individual requests for large numbers of documents. If one action in a bulk request fails, OpenSearch runs the remaining actions and reports the outcome of each one in the `items` array of the response, in the order in which you specified the actions.

## Related documentation

- [Add and manage your data]({{site.url}}{{site.baseurl}}/getting-started/manage-data/): A tutorial that creates an index, adds documents to it, and reads them back.
- [Ingest data]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/): Other ways to send data to OpenSearch, such as OpenSearch Ingestion and pull-based ingestion.
- [Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/): Retrieving, updating, and deleting documents.
