---
layout: default
title: Reindex data
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /opensearch/reindex-data/
  - /im-plugin/reindex-data/
---


# Reindex data

After creating an index, you might need to make an extensive change such as adding a new field to every document or combining multiple indexes to form a new one. Rather than deleting your index, making the change offline, and then indexing your data again, you can use the `reindex` operation.

With the `reindex` operation, you can copy all or a subset of documents that you select through a query to another index. Reindex is a `POST` operation. In its most basic form, you specify a source index and a destination index.

Reindexing can be an expensive operation depending on the size of your source index. We recommend you disable replicas in your destination index by setting `number_of_replicas` to `0` and re-enable them once the reindex process is complete.
{: .note }

For a complete API reference with all parameters and advanced options, see the [Reindex Documents API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/).
{: .note}


## How reindex works

The reindex operation performs the following steps:

1. **Reads documents from the source index**: OpenSearch retrieves documents from the `_source` field of the source index.
2. **Processes the documents**: Optionally applies any specified query filters, scripts, or ingest pipelines to transform the data.
3. **Writes to the destination index**: Indexes the processed documents into the destination index using the destination index's current mappings and settings.

Note the following considerations:

- The reindex operation reads from the `_source` field and ignores any `stored_fields` configuration. If `_source` is disabled in your source index, the reindex operation will fail. Ensure that `_source` is enabled for all documents you want to reindex.
- Documents are indexed according to the destination index's mappings, not the source index's mappings. Create your destination index with the desired mappings before reindexing.

