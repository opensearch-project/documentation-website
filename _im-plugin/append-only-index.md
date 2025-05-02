---
layout: default
title: Append-only index
nav_order: 14
redirect_from:
  - /opensearch/append-only-index/
---

# Append-only index

An append-only index is an immutable index that only allows document ingestion (appending) while blocking all updates or deletions after initial document creation. When you enable the append-only setting for an index, OpenSearch prevents any modifications to existing documents. You can only add new documents to the index.

When an index is configured as an append-only index, the following operations will return an error:
- Document update call (Update API)
- Document delete call (Delete API)
- Update by query call
- Delete by query call

For the bulk API requests, below actions will return error for individual operation in the bulk api response
- All update, delete, or upsert actions
- Any index action with a custom document ID

Append-only indexes offer several advantages:
- Optimized performance because they eliminate costly updates/delete operations
- Optimized storage and segment merges because they eliminate soft deletes and version tracking
- Future optimizations like auto-rollovers and efficient warm tiering

Append-only indexes are ideal for immutable workloads, such as those containing log, metric, observability, or security event data, where data is not modified once ingested.


## Example request

The following example request creates a new index named `my-append-only-index` with all updates disabled:

```json
PUT /my-append-only-index
{
  "settings": {
    "index.append_only.enabled": true
  }
}
```

### Considerations

#### Reindex document
As we are not allowing passing custom doc id in any index or update call, reindexing docs of an existing index to a new index will break. If you want to append data from an existing index to the new append-only index using reindexing, set the id of the document as null. The following example reindexes documents from a source index (`my-source-index`) into the new append-only index:
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