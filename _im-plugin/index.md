---
layout: default
title: Managing indexes
nav_order: 1
has_children: false
nav_exclude: true
permalink: /im-plugin/
redirect_from:
  - /opensearch/index-data/
  - /im-plugin/index/
---

# Managing indexes

An index is the basic unit of data storage in OpenSearch: a collection of JSON documents, each identified by a unique ID, distributed across one or more shards. This section covers what you do with an index after your data is in it---creating and deleting indexes, grouping them behind aliases and data streams, automating their lifecycle, and tuning how they store and retrieve data.

If you are new to OpenSearch, start with [Add and manage your data]({{site.url}}{{site.baseurl}}/getting-started/manage-data/), which walks through creating an index, adding documents to it, and reading them back.

## Indexing documents

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

For the rest of the document operations, including retrieving, updating, and deleting documents, see [Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/).

## Naming restrictions for indexes

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

Names beginning with a period (`.`) are reserved for OpenSearch system indexes.

## In this section

Each page in this section describes what an operation does and how to run it using the OpenSearch API, followed by the equivalent steps in OpenSearch Dashboards.

| Topic | Description |
| :--- | :--- |
| [Index operations]({{site.url}}{{site.baseurl}}/im-plugin/index-operations/) | Create, inspect, close, open, and delete an index. |
| [Index maintenance]({{site.url}}{{site.baseurl}}/im-plugin/index-maintenance/) | Refresh, flush, clear caches, force merge, shrink, split, clone, and roll over an index. |
| [Index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/) | Apply the same settings and mappings to every index whose name matches a pattern. |
| [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/) | Query a group of indexes under one name and switch that name between indexes without changing your clients. |
| [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/) | Manage append-only time-series data as a single named stream backed by rolling indexes. |
| [Append-only index]({{site.url}}{{site.baseurl}}/im-plugin/append-only-index/) | Prevent updates and deletes on an index to reduce indexing overhead. |
| [Reindexing data]({{site.url}}{{site.baseurl}}/im-plugin/reindex-data/) | Copy documents from one index into another, applying new mappings or transformations. |
| [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) | Automate lifecycle operations, such as rollover and delete, based on index age, size, or document count. |
| [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/) | Summarize historical data into a smaller index to reduce storage cost. |
| [Index transforms]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/index/) | Build a materialized summary of your data, grouped by the fields you query most. |
| [Long-running operation notifications]({{site.url}}{{site.baseurl}}/im-plugin/notifications-settings/) | Get notified when a reindex, force merge, shrink, split, or open operation finishes or fails. |
| [Tuning indexes]({{site.url}}{{site.baseurl}}/im-plugin/index-tuning/) | Configure codecs, index sorting, similarity, and other storage and retrieval options. |
| [Index management security]({{site.url}}{{site.baseurl}}/im-plugin/security/) | Control who can perform index management operations. |

## Related documentation

- [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/)
- [Index Management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/)
- [Ingest your data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/)
- [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/)
