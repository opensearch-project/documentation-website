---
layout: default
title: Document APIs
has_children: true
has_toc: false
nav_order: 25
redirect_from:
  - /opensearch/rest-api/document-apis/index/
  - /api-reference/document-apis/
---

# Document APIs
**Introduced 1.0**
{: .label .label-purple }

Document APIs allow you to perform create, read, update, and delete (CRUD) operations on documents stored in your indexes. Use these APIs to manage individual documents or process multiple documents efficiently in batch operations.

## Operation types

OpenSearch document APIs are organized into the following categories based on the number of documents they process.

### Single-document operations

Single-document operations work with one document at a time. Use these APIs when you need to perform targeted operations on specific documents or when working with individual records:

- Use the Index Document API to add new documents or replace existing documents with the same ID.
- Use the Get Document API to fetch documents by their unique ID.
- Use the Update Document API to change specific fields in an existing document without reindexing the entire document.
- Use the Delete Document API to remove documents from an index.

### Multi-document operations

Multi-document operations process multiple documents in a single API request, offering significant performance advantages over submitting individual requests. When working with large datasets or batch operations, always prefer multi-document APIs because they:

- Reduce network overhead by combining multiple operations into one request.
- Improve throughput by allowing OpenSearch to optimize batch processing.
- Minimize the number of round trips between your application and the cluster.

Use multi-document operations for data ingestion pipelines, bulk updates, batch deletions, and any scenario where you need to process multiple documents efficiently.

### Term vector operations

Term vector operations retrieve information about the terms in a specific document field, including term frequencies, positions, and offsets. Use these operations for text analysis, relevance scoring, and custom similarity calculations.

## Important considerations

**Single-index limitation**: All document APIs operate on a single index at a time. The `index` parameter accepts only one index name or an alias that points to a single index. You cannot target multiple indexes in a single document API request. For operations across multiple indexes, you must submit separate requests for each index.

**Document routing**: OpenSearch uses a routing algorithm to determine which shard stores each document. By default, documents are routed based on their ID, but you can specify custom routing values to control shard placement. When retrieving, updating, or deleting documents that were indexed with custom routing, you must provide the same routing value.

## Data replication model

OpenSearch maintains multiple copies of your data across shards to ensure fault tolerance and high availability. This replication model is based on the primary-backup pattern, where one shard copy acts as the primary and other copies serve as replicas.

### Write operations

When you index, update, or delete a document, OpenSearch follows this process:

1. **Routing**: The operation is routed to the appropriate primary shard based on the document ID or custom routing value.
2. **Primary processing**: The primary shard validates and executes the operation locally.
3. **Replication**: The primary shard forwards the operation to all active replica shards in parallel.
4. **Acknowledgment**: After all in-sync replicas confirm the operation, the primary shard acknowledges success to the client.

This process ensures that all shard copies remain synchronized and that acknowledged writes are durable across multiple nodes.

### Read operations

Read operations can be served by any shard copy (primary or replica), which provides several benefits:

- **Load distribution**: Read requests are distributed across multiple shard copies, improving throughput and response times.
- **High availability**: If one shard copy becomes unavailable, OpenSearch automatically routes requests to other copies.
- **Consistency**: All shard copies contain the same data (except for in-flight operations), ensuring consistent read results.

By default, OpenSearch uses round-robin distribution to select which shard copy handles each read request. You can influence this selection using the `preference` parameter available in many document APIs.

## Refresh behavior

The Index, Update, Delete, and Bulk APIs support a `refresh` parameter that controls when changes become visible to search operations. Understanding refresh behavior is important for balancing data freshness with system performance.

### Refresh parameter values

The `refresh` parameter accepts the following values:

- `false` (default): No refresh-related actions are taken. Changes become visible when the index is automatically refreshed based on the `index.refresh_interval` setting (default is 1 second).
- `true`: Immediately refreshes the relevant primary and replica shards after the operation completes, making changes visible to search immediately. Use this option sparingly because it can significantly impact performance.
- `wait_for`: Waits for the changes to become visible through a refresh before responding to the client. This option does not force an immediate refresh but waits for the next scheduled refresh or for another operation to trigger one.

### Choosing the right refresh setting

For most use cases, use the default `refresh=false` to achieve the best performance. Consider the following guidelines:

- **Use `false` (default)** for high-throughput indexing where near-real-time visibility (within 1 second) is acceptable.
- **Use `wait_for`** when you need confirmation that changes are searchable but do not want to force an immediate refresh. This option is more efficient than `refresh=true` for batch operations.
- **Use `true` sparingly** only when you absolutely need immediate visibility and understand the performance implications. Frequent refreshes create inefficient index segments that require more resources to search and merge.

Excessive use of `refresh=true` can significantly degrade cluster performance by creating many small segments and increasing merge overhead.

## Optimistic concurrency control

OpenSearch uses optimistic concurrency control to ensure that document updates do not overwrite newer changes with older data. This mechanism is essential in distributed systems where multiple operations may occur concurrently.

### How it works

Every operation that changes a document is assigned a sequence number (`_seq_no`) and a primary term (`_primary_term`) by the coordinating primary shard:

- **Sequence number**: A strictly increasing number assigned to each operation. Newer operations always have higher sequence numbers than older ones.
- **Primary term**: Identifies the current primary shard assignment. This value changes when a new primary shard is elected after a failure.

Together, `_seq_no` and `_primary_term` uniquely identify each change to a document, allowing OpenSearch to detect and prevent out-of-order updates.

### Using sequence numbers for conditional updates

You can use the `if_seq_no` and `if_primary_term` parameters with the Index, Update, and Delete APIs to ensure that operations only succeed if the document has not changed since you retrieved it. OpenSearch returns the current `_seq_no` and `_primary_term` values in Get API responses and search results (when requested).

This approach prevents lost updates in scenarios where multiple clients or processes modify the same document concurrently. If the sequence number or primary term does not match the current values, OpenSearch returns a version conflict error, allowing your application to retry the operation with the latest document version.

## Single document operations

- [Index document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/)
- [Get document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/get-documents/)
- [Update document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/)
- [Delete document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-document/)

## Multi-document operations

- [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/)
- [Streaming bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk-streaming/)
- [Multi-get documents]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/)
- [Update by query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/)
- [Delete by query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-by-query/)
- [Reindex documents]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/)

## Term vector operations

- [Term vector]({{site.url}}{{site.baseurl}}/api-reference/document-apis/termvector/)
- [Multi term vectors]({{site.url}}{{site.baseurl}}/api-reference/document-apis/mtermvectors/)

## Pull-based ingestion

- [Pull-based ingestion]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/)
