---
layout: default
title: Append-only index
nav_order: 15
canonical_url: https://docs.opensearch.org/latest/im-plugin/append-only-index/
---

# Append-only index

An append-only index is an immutable index that only allows document ingestion (appending) while blocking all updates or deletions after initial document creation. When you enable the append-only setting for an index, OpenSearch prevents any modifications to existing documents. You can only add new documents to the index.

When you configure an index as append-only, the following operations return an error:

- Document update call (Update API)
- Document delete call (Delete API)
- Update by query call
- Delete by query call
- Bulk API calls made with the update, delete, or upsert actions
- Bulk API calls containing an index action with a custom document ID

## Benefits

Append-only indexes offer several advantages:

- Optimized performance by eliminating costly update and delete operations
- Optimized storage and segment merges by eliminating soft deletes and version tracking
- Support for future optimizations like auto-rollovers and efficient warm tiering

Append-only indexes are ideal for immutable workloads, such as those containing log, metric, observability, or security event data, where data is not modified once ingested.

## Creating an append-only index

The following request creates a new index named `my-append-only-index` with all updates disabled:

```json
PUT /my-append-only-index
{
  "settings": {
    "index.append_only.enabled": true
  }
}
```
{% include copy-curl.html %}

After an index is set to append-only, it cannot be changed to another index type.
{: .warning}


To append data from an existing index to a new append-only index, use the Reindex API. Because append-only indexes don't support custom document IDs, you need to set the `ctx._id` of the source index to `null`. This allows documents to be added through reindexing.

The following example reindexes documents from a source index (`my-source-index`) into the new append-only index:

```json
POST /_reindex
{
  "source": {
    "index": "my-source-index"
  },
  "dest": {
    "index": "my-append-only-index"
  },
  "script": {
    "source": "ctx._id = null",
    "lang": "painless"
  }
}

```
{% include copy-curl.html %}
