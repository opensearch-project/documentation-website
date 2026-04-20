---
layout: default
title: Bulk
parent: Document APIs
nav_order: 20
redirect_from:
 - /opensearch/rest-api/document-apis/bulk/
---

# Bulk API
**Introduced 1.0**
{: .label .label-purple }

The Bulk API performs multiple indexing, update, or delete operations in a single request. This significantly reduces overhead and can greatly increase indexing speed by minimizing the number of network round trips and processing cycles required.

The Bulk API uses a newline-delimited JSON (NDJSON) structure for the request body. Each action is specified on one line, and if the action requires source data (such as for `index`, `create`, or `update` operations), the source data is provided on the following line. This format enables OpenSearch to quickly parse and process actions without reading the entire request body into memory.

Beginning in OpenSearch 2.9, when indexing documents using the bulk operation, the document `_id` must be 512 bytes or less in size.
{: .note}

Use the Bulk API for the following purposes:

- Indexing large datasets efficiently by grouping multiple document operations into a single request.
- Performing mixed operations (index, create, update, and delete) on multiple documents simultaneously.
- Minimizing network overhead when performing many document operations.
- Reindexing data from one index to another using client bulk helpers.

The Bulk API processes actions independently. If one action fails, OpenSearch continues processing subsequent actions. The response indicates whether each individual action succeeded or failed.

<!-- spec_insert_start
api: bulk
component: endpoints
-->
## Endpoints
```json
POST /_bulk
PUT  /_bulk
POST /{index}/_bulk
PUT  /{index}/_bulk
```
<!-- spec_insert_end -->

You can specify the target index in the path or include it in the [request body](#request-body).

OpenSearch accepts `PUT` requests to the `_bulk` endpoint, but using `POST` is strongly recommended. The typical semantics of `PUT`---creating or replacing a single resource at a specific path---do not align with the behavior of bulk operations.
{: .note }

<!-- spec_insert_start
api: bulk
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | Name of the data stream, index, or index alias to perform bulk actions on. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: bulk
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `_source` | Boolean or List or String | `true` or `false` to return the `_source` field or not, or a list of fields to return. |
| `_source_excludes` | List or String | A comma-separated list of source fields to exclude from the response. |
| `_source_includes` | List or String | A comma-separated list of source fields to include in the response. |
| `index` | String | Name of the data stream, index, or index alias to perform bulk actions on. |
| `pipeline` | String | ID of the pipeline to use to preprocess incoming documents. If the index has a default ingest pipeline specified, then setting the value to `_none` disables the default ingest pipeline for this request. If a final pipeline is configured it will always run, regardless of the value of this parameter. |
| `refresh` | Boolean or String | If `true`, OpenSearch refreshes the affected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` do nothing with refreshes. Valid values: `true`, `false`, `wait_for`. <br> Valid values are: <br> - `false`: Do not refresh the affected shards. <br> - `true`: Refresh the affected shards immediately. <br> - `wait_for`: Wait for the changes to become visible before replying. |
| `require_alias` | Boolean | If `true`, the request's actions must target an index alias. _(Default: `false`)_ |
| `routing` | String | A custom value used to route operations to a specific shard. |
| `timeout` | String | Period each action waits for the following operations: automatic index creation, dynamic mapping updates, waiting for active shards. |
| `type` | String | Default document type for items which don't provide one. |
| `wait_for_active_shards` | Integer or String or NULL or String | The number of shard copies that must be active before proceeding with the operation. Set to all or any positive integer up to the total number of shards in the index (`number_of_replicas+1`). <br> Valid values are: <br> - `all`: Wait for all shards to be active. |

<!-- spec_insert_end -->

## Submitting bulk requests using cURL

When submitting bulk requests from a file using the cURL command, use the `--data-binary` flag instead of `-d` to preserve newline characters. The `-d` flag removes newlines, which breaks the NDJSON format required by the Bulk API.

The following example demonstrates the correct approach. First, create a file containing your bulk operations:

```bash
cat > bulk-operations.ndjson << 'EOF'
{ "index": { "_index": "movies", "_id": "curl-test1" } }
{ "title": "Curl Test Movie 1", "year": 2025 }
{ "index": { "_index": "movies", "_id": "curl-test2" } }
{ "title": "Curl Test Movie 2", "year": 2025 }
EOF
```

Then submit the file using `--data-binary`:

```bash
curl -H "Content-Type: application/x-ndjson" -X POST "localhost:9200/_bulk?pretty" --data-binary "@bulk-operations.ndjson"
```

When making inline bulk requests with cURL, ensure that you properly escape newlines in your shell. Using single quotes and literal newlines is often clearer than using `\n` escape sequences.

## Optimistic concurrency control

OpenSearch uses optimistic concurrency control to prevent conflicts when multiple processes attempt to modify the same document simultaneously. The Bulk API supports two approaches for concurrency control: sequence number-based and version-based.

### Sequence number-based concurrency control

Sequence numbers provide the most reliable form of concurrency control. Each document operation increments the `_seq_no` field, and the `_primary_term` tracks primary shard elections. By specifying both values in your bulk operation, you ensure that the operation only succeeds if the document hasn't changed since you last read it.

The following example demonstrates sequence number-based concurrency control:

```json
{ "index": { "_index": "movies", "_id": "version-test", "if_seq_no": 13, "if_primary_term": 1 } }
{ "title": "Updated with OCC", "year": 2025 }
```

If another process has modified the document between your read and update operations, the `_seq_no` or `_primary_term` will have changed, and OpenSearch returns a `version_conflict_engine_exception` error. Your application can then retrieve the latest version of the document and retry the operation.

This approach prevents lost updates without requiring explicit locking, allowing multiple processes to work concurrently while maintaining data consistency.

### Version-based concurrency control

OpenSearch also supports explicit version numbers for concurrency control. Every document has a `_version` field that increments with each modification. You can specify a required version in your bulk operations:

```json
{ "index": { "_index": "movies", "_id": "doc1", "version": 5, "version_type": "internal" } }
{ "title": "Version-controlled update", "year": 2025 }
```

This operation only succeeds if the document's current version is 5. The `version_type` parameter supports the following values:

- `internal` (default): Uses OpenSearch's internal version numbering.
- `external`: Allows you to maintain version numbers from an external system. The version must be greater than the current version.
- `external_gte`: Similar to `external`, but allows the version to be greater than or equal to the current version.

## Versioning

Document versioning in OpenSearch tracks changes to documents over time. The `_version` field automatically increments each time a document is modified through index, update, or delete operations.

### Internal versioning

By default, OpenSearch uses internal versioning, starting at 1 for new documents and incrementing with each modification. Internal versions are managed automatically and persist even when documents are deleted and recreated with the same ID.

The following example creates a document with an external version number:

```json
{ "index": { "_index": "movies", "_id": "external-version-test", "version": 100, "version_type": "external" } }
{ "title": "External Version Movie", "year": 2025 }
```

### External versioning

External versioning is useful when synchronizing OpenSearch with an external data source that maintains its own version numbers. When using `version_type: external`, OpenSearch accepts your version number and only indexes the document if the provided version is greater than the stored version. This ensures that out-of-order updates don't overwrite newer data with older versions.

### Version conflicts

Version conflicts occur when an operation specifies a version that doesn't match the current document version. When this happens, OpenSearch returns a `version_conflict_engine_exception` error in the response for that specific operation. The bulk request continues processing other operations, allowing partial success even when some operations fail due to version conflicts.

## Routing

Routing determines which shard stores a particular document. By default, OpenSearch routes documents using a hash of the document ID, distributing documents evenly across shards. Custom routing allows you to override this behavior and control document placement.

You can specify routing in two ways: at the query parameter level or in individual action metadata.

### Query parameter routing

Applying routing at the query parameter level affects all operations in the bulk request:

```bash
POST /_bulk?routing=user123
{ "index": { "_index": "movies", "_id": "routed-doc" } }
{ "title": "Routed Movie", "user_id": "user123" }
```

### Action-level routing

Specifying routing in the action metadata provides finer control, allowing different operations in the same bulk request to use different routing values:

```bash
POST /_bulk
{ "index": { "_index": "movies", "_id": "routed-action", "routing": "user456" } }
{ "title": "Action Routed Movie", "user_id": "user456" }
```

Custom routing is particularly useful for multi-tenant applications where you want to colocate all documents for a specific tenant on the same shard. This improves query performance when searching within a single tenant because OpenSearch only needs to query one shard instead of all shards in the index.

When using custom routing, you must provide the same routing value for all operations (index, get, update, delete) on a document. Otherwise, OpenSearch may not find the document because it searches the wrong shard.

## Refresh

The `refresh` parameter controls when changes made by bulk operations become visible to search queries. OpenSearch uses a near-real-time search model where documents are not immediately searchable after indexing.

The `refresh` parameter accepts three values:

- `false` (default): Documents are not refreshed immediately. They become searchable based on the index's refresh interval (typically 1 second).
- `true`: Forces an immediate refresh of all affected shards, making documents searchable immediately but with a performance cost.
- `wait_for`: Waits for the next scheduled refresh before returning, balancing visibility and performance.

The following example uses `refresh=wait_for`:

```bash
POST /_bulk?refresh=wait_for
{ "index": { "_index": "movies", "_id": "refresh-test" } }
{ "title": "Refresh Test Movie", "year": 2025 }
```

Only the shards that receive documents from the bulk request are refreshed. If a bulk request contains documents routed to three shards in an index with five shards, only those three shards are refreshed. The other two shards remain unaffected.

Using `refresh=true` can significantly impact cluster performance, especially with frequent bulk requests. For production workloads, consider using the default behavior or `refresh=wait_for`, which provides better performance characteristics while ensuring documents are available for search within a bounded time.

## Wait for active shards

The `wait_for_active_shards` parameter controls how many shard copies must be active before OpenSearch processes a bulk request. This setting helps ensure data durability by preventing operations from proceeding when too many shard copies are unavailable.

By default, `wait_for_active_shards` is set to `1`, meaning only the primary shard must be active. You can set it to:

- A positive integer: The operation waits until that number of shard copies (including the primary) are active.
- `all`: The operation waits until all shard copies (primary and all replicas) are active.

The following example waits for the primary and one replica shard to be active:

```bash
POST /_bulk?wait_for_active_shards=2
{ "index": { "_index": "movies", "_id": "active-shards-test" } }
{ "title": "Active Shards Test", "year": 2025 }
```

For an index configured with one primary and two replicas (`number_of_replicas=2`), setting `wait_for_active_shards=2` requires the primary and at least one replica to be active. This provides a balance between availability and durability.

If the required number of active shards is not available within the timeout period (controlled by the `timeout` parameter), the bulk operation fails with a timeout error. The shards that did become active may still contain the successfully indexed documents.

## Performance considerations

When using the Bulk API, several factors affect performance and throughput. Understanding these considerations helps you optimize bulk operations for your specific workload.

### Optimal batch size

There is no universal "correct" number of operations to include in a single bulk request. The optimal batch size depends on several factors:

- **Document size**: Larger documents require fewer operations per request to reach the ideal request size.
- **Indexing complexity**: Documents with many fields or complex mappings take longer to process.
- **Hardware resources**: Available memory and CPU capacity on your cluster nodes.
- **Network bandwidth**: The connection speed between your client and the OpenSearch cluster.

Start with batches of 1,000 to 5,000 operations and experiment with different sizes. Monitor your cluster's performance metrics (CPU usage, memory consumption, indexing latency) to find the optimal batch size for your workload. A good bulk request size typically falls between 5 MB and 15 MB.

### HTTP chunking

When using the HTTP API, ensure that your client does not send HTTP chunks (`Transfer-Encoding: chunked`). HTTP chunking prevents OpenSearch from efficiently parsing the request body because it must process the data incrementally as chunks arrive rather than reading the entire request at once.

Most HTTP clients disable chunking by default, but if you're experiencing slow bulk operations, verify that your client configuration does not enable chunked transfer encoding.

### Client-side buffering

The NDJSON format used by the Bulk API is designed for minimal buffering. Each action and its optional source data appears on separate lines, allowing OpenSearch to process operations as soon as they're parsed without loading the entire request into memory.

When implementing bulk operations in your application:

- Avoid accumulating all operations in memory before sending them. Instead, stream operations to the Bulk API as you generate them.
- Process the response incrementally rather than waiting for all operations to complete.
- Use client libraries that support efficient bulk helpers, which handle batching and error retry automatically.

### Request parsing

OpenSearch optimizes bulk request processing by parsing only the action metadata on the receiving node. The action metadata contains routing information that determines which shard should handle the operation. Once routing is determined, OpenSearch forwards the complete operation (metadata and source data) to the appropriate shard.

This design minimizes processing on the coordinating node, allowing OpenSearch to efficiently distribute bulk operations across the cluster without creating a bottleneck at the entry point.

## Request body

The bulk request body uses a newline-delimited JSON (NDJSON) format. Each action must be specified on a single line followed by a newline character (`\n`), and source data (when required) must be on the next line followed by a newline character.

```
Action and metadata\n
Optional document\n
Action and metadata\n
Optional document\n
```

Each JSON document can include spaces for readability but must be on a single line. OpenSearch uses newline characters to parse bulk requests and requires that the request body end with a newline character. When sending requests to the Bulk API, set the `Content-Type` header to `application/x-ndjson`.

### Action metadata fields

All actions support the following metadata fields in the action line. The `_index` field is required unless you specify the index in the request path.

Field | Data type | Description
:--- | :--- | :---
`_index` | String | The name of the index. Required if not specified in the request path.
`_id` | String | The document ID. Optional. If not provided, OpenSearch generates an ID automatically.
`_require_alias` | Boolean | When `true`, requires the destination to be an index alias. Default is `false`.
`routing` | String | The custom routing value for the document operation.
`version` | Integer | The explicit version number for the document. Used for optimistic concurrency control.
`version_type` | String | The version type: `internal`, `external`, `external_gte`. Default is `internal`.
`if_seq_no` | Integer | Performs the operation only if the document has this sequence number. Used for optimistic concurrency control.
`if_primary_term` | Integer | Performs the operation only if the document has this primary term. Used for optimistic concurrency control.

### Actions

The Bulk API supports the following actions.

### Create

Creates a document if it doesn't already exist and returns an error otherwise. The next line must include a JSON document:

```json
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
```

### Delete

This action deletes a document if it exists. If the document doesn't exist, OpenSearch doesn't return an error but instead returns `not_found` under `result`. Delete actions don't require documents on the next line:

```json
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
```

### Index

Index actions create a document if it doesn't yet exist and replace the document if it already exists. The next line must include a JSON document:

```json
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013}
```

### Update

By default, this action updates existing documents and returns an error if the document doesn't exist. The next line must include a full or partial JSON document, depending on how much of the document you want to update:

```json
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
```

The `update` action supports a `retry_on_conflict` field in the action metadata. This specifies how many times the update should be retried if a version conflict occurs:

```json
{ "update": { "_index": "movies", "_id": "tt0816711", "retry_on_conflict": 3 } }
{ "doc" : { "title": "World War Z" } }
```

User-defined ingest pipelines are not executed for update operations. If you need to process documents through an ingest pipeline, use an [upsert](#upsert) operation instead.
{: .note}

### Upsert

To upsert a document, use one of the following options:

1. Specify the document in the `doc` field and set `doc_as_upsert=true`. If the document exists, it is updated with the contents of the `doc` field. If the document does not exist, a new document is indexed with the parameters specified in the `doc` field:

    ```json
    { "update": { "_index": "movies", "_id": "tt0816711" } }
    { "doc" : { "title": "World War Z" }, "doc_as_upsert": true }
    ```
1. Specify the document to update (when it exists) in the `doc` field, the document to insert (when it doesn't exist) in the `upsert` field, and leave `doc_as_update` set to `false`:

    ```json
    { "update": { "_index": "products", "_id": "widget-123" } }
    { "doc": { "stock": 75, "updated_at": "2025-01-15T10:30:00Z" }, "upsert": { "name": "Widget", "price": 39.99, "stock": 100, "created_at": "2025-01-15T10:30:00Z" }}
    ```
    
Use this option when you want to only update specific fields when a document exists but insert a complete document when it doesn't exist.

Upsert operations trigger ingest pipelines, allowing you to preprocess documents before they are indexed or updated.
{: .note}

### Script

You can specify a script for more complex document updates by defining the script with the `source` or `id` from a document:

```json
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "script" : { "source": "ctx._source.title = \"World War Z\"" } }
```

### Scripted upsert

You can use a script to update or upsert a document in the following ways:

1. Script + upsert (`scripted_upsert=false`, default): If the document exists, the document is updated using the `script`. If the document does not exist, the document in the `upsert` field is inserted without running the script:

    ```json
    POST _bulk
    { "update": { "_index": "movies", "_id": "tt0816711" } }
    { "script": { "source": "ctx._source.title = params.title; ctx._source.genre = params.genre;", "params": { "title": "World War Z", "genre": "Action" } }, "upsert": { "title": "World War Z", "genre": "Action", "author": "Tom Smith" } }
    ```
    {% include copy-curl.html %}

1. Script + upsert + `scripted_upsert=true`. If the document exists, the document is updated using the `script`. If the document does not exist, the script runs on the `upsert` field and the resulting document is inserted:

    ```json
    POST _bulk
    { "update": { "_index": "movies", "_id": "tt0816711" } }
    { "script": { "source": "ctx._source.title = params.title; ctx._source.genre = params.genre;", "params": { "title": "World War Z", "genre": "Action" } }, "scripted_upsert": true }
    ```
    {% include copy-curl.html %}

## Example: Performing multiple actions

The following example request performs multiple document operations in a single request, including delete, index, create, and update operations:

<!-- spec_insert_start
component: example_code
rest: POST /_bulk
body: |
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
-->
{% capture step1_rest %}
POST /_bulk
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  body = '''
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Specifying the index in the path

The following example request specifies the index in the request path, eliminating the need to include `_index` in each action line:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_bulk
body: |
{ "index": { "_id": "tt0468569" } }
{ "title": "The Dark Knight", "year": 2008, "director": "Christopher Nolan" }
{ "index": { "_id": "tt0137523" } }
{ "title": "Fight Club", "year": 1999, "director": "David Fincher" }
-->
{% capture step1_rest %}
POST /movies/_bulk
{ "index": { "_id": "tt0468569" } }
{ "title": "The Dark Knight", "year": 2008, "director": "Christopher Nolan" }
{ "index": { "_id": "tt0137523" } }
{ "title": "Fight Club", "year": 1999, "director": "David Fincher" }
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  index = "movies",
  body = '''
{ "index": { "_id": "tt0468569" } }
{ "title": "The Dark Knight", "year": 2008, "director": "Christopher Nolan" }
{ "index": { "_id": "tt0137523" } }
{ "title": "Fight Club", "year": 1999, "director": "David Fincher" }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Using upsert operations

The following example request uses `doc_as_upsert` to update documents if they exist or create them if they don't:

<!-- spec_insert_start
component: example_code
rest: POST /_bulk
body: |
{ "update": { "_index": "movies", "_id": "tt0468569" } }
{ "doc": { "rating": 9.0 }, "doc_as_upsert": true }
{ "update": { "_index": "movies", "_id": "tt9999999" } }
{ "doc": { "title": "New Movie", "year": 2024 }, "doc_as_upsert": true }
-->
{% capture step1_rest %}
POST /_bulk
{ "update": { "_index": "movies", "_id": "tt0468569" } }
{ "doc": { "rating": 9.0 }, "doc_as_upsert": true }
{ "update": { "_index": "movies", "_id": "tt9999999" } }
{ "doc": { "title": "New Movie", "year": 2024 }, "doc_as_upsert": true }
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  body = '''
{ "update": { "_index": "movies", "_id": "tt0468569" } }
{ "doc": { "rating": 9.0 }, "doc_as_upsert": true }
{ "update": { "_index": "movies", "_id": "tt9999999" } }
{ "doc": { "title": "New Movie", "year": 2024 }, "doc_as_upsert": true }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Handling version conflicts with retry_on_conflict

The following example request uses `retry_on_conflict` to automatically retry updates when version conflicts occur:

<!-- spec_insert_start
component: example_code
rest: POST /_bulk
body: |
{ "update": { "_index": "movies", "_id": "tt0468569", "retry_on_conflict": 3 } }
{ "doc": { "rating": 9.5 } }
-->
{% capture step1_rest %}
POST /_bulk
{ "update": { "_index": "movies", "_id": "tt0468569", "retry_on_conflict": 3 } }
{ "doc": { "rating": 9.5 } }
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  body = '''
{ "update": { "_index": "movies", "_id": "tt0468569", "retry_on_conflict": 3 } }
{ "doc": { "rating": 9.5 } }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Filtering response to show only errors

The following example request uses the `filter_path` query parameter to return only failed operations:

<!-- spec_insert_start
component: example_code
rest: POST /_bulk?filter_path=items.*.error
body: |
{ "update": { "_index": "movies", "_id": "missing1" } }
{ "doc": { "title": "Error" } }
{ "update": { "_index": "movies", "_id": "missing2" } }
{ "doc": { "title": "Error" } }
{ "update": { "_index": "movies", "_id": "tt0468569" } }
{ "doc": { "title": "Success" } }
-->
{% capture step1_rest %}
POST /_bulk?filter_path=items.*.error
{ "update": { "_index": "movies", "_id": "missing1" } }
{ "doc": { "title": "Error" } }
{ "update": { "_index": "movies", "_id": "missing2" } }
{ "doc": { "title": "Error" } }
{ "update": { "_index": "movies", "_id": "tt0468569" } }
{ "doc": { "title": "Success" } }
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  params = { "filter_path": "items.*.error" },
  body = '''
{ "update": { "_index": "movies", "_id": "missing1" } }
{ "doc": { "title": "Error" } }
{ "update": { "_index": "movies", "_id": "missing2" } }
{ "doc": { "title": "Error" } }
{ "update": { "_index": "movies", "_id": "tt0468569" } }
{ "doc": { "title": "Success" } }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The Bulk API returns information about each operation in the request, in the same order as submitted. Pay particular attention to the top-level `errors` boolean. If `true`, one or more operations failed, and you can examine individual items for details.

The Bulk API always returns a complete response, even when some operations fail due to shard failures or other errors. This partial response behavior ensures that you receive results for all successfully processed operations without waiting indefinitely for failed operations to complete.

The following example response corresponds to the first example request with multiple actions:

```json
{
  "took": 35,
  "errors": false,
  "items": [
    {
      "delete": {
        "_index": "movies",
        "_id": "tt2229499",
        "_version": 1,
        "result": "not_found",
        "_shards": {
          "total": 1,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 1,
        "_primary_term": 1,
        "status": 404
      }
    },
    {
      "index": {
        "_index": "movies",
        "_id": "tt1979320",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 1,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 2,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "create": {
        "_index": "movies",
        "_id": "tt1392214",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 1,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 3,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "update": {
        "_index": "movies",
        "_id": "tt0816711",
        "_version": 2,
        "result": "updated",
        "_shards": {
          "total": 1,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 4,
        "_primary_term": 1,
        "status": 200
      }
    }
  ]
}
```

When operations fail, the response includes an `error` object with details about the failure:

```json
{
  "took": 9,
  "errors": true,
  "items": [
    {
      "update": {
        "_index": "movies",
        "_id": "nonexistent1",
        "status": 404,
        "error": {
          "type": "document_missing_exception",
          "reason": "[nonexistent1]: document missing",
          "index": "movies",
          "shard": "0",
          "index_uuid": "UZdzhOjDQvGihxfS-m_UFA"
        }
      }
    }
  ]
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`took` | Integer | The time in milliseconds it took to process the bulk request.
`errors` | Boolean | Indicates whether any operations in the bulk request failed. If `true`, examine individual items for error details.
`items` | Array of objects | Contains the result of each operation in the bulk request, in the order they were submitted.

### The items array

Each object in the `items` array corresponds to one operation and contains a key matching the action type (`index`, `create`, `update`, or `delete`). The value is an object containing the following fields.

Field | Data type | Description
:--- | :--- | :---
`_index` | String | The name of the index associated with the operation.
`_id` | String | The document ID associated with the operation.
`_version` | Integer | The document version after the operation. Incremented each time the document is updated. Returned only for successful operations.
`result` | String | The result of the operation: `created`, `updated`, `deleted`, or `not_found`. Returned only for successful operations.
`_shards` | Object | Contains shard information for the operation. Returned only for successful operations.
`_shards.total` | Integer | The number of shards on which the operation was attempted.
`_shards.successful` | Integer | The number of shards on which the operation succeeded.
`_shards.failed` | Integer | The number of shards on which the operation failed.
`_seq_no` | Integer | The sequence number assigned to the document for the operation. Used for optimistic concurrency control. Returned only for successful operations.
`_primary_term` | Integer | The primary term assigned to the document for the operation. Used for optimistic concurrency control. Returned only for successful operations.
`status` | Integer | The HTTP status code for the operation: `200` (updated), `201` (created), `404` (not found), or `409` (version conflict).
`error` | Object | Contains information about a failed operation. Returned only for failed operations.
`error.type` | String | The error type for the failed operation, such as `document_missing_exception` or `version_conflict_engine_exception`.
`error.reason` | String | A human-readable explanation of the reason the operation failed.
`error.index` | String | The name of the index associated with the failed operation.
`error.shard` | String | The ID of the shard associated with the failed operation.
`error.index_uuid` | String | The universally unique identifier (UUID) of the index associated with the failed operation.

## Partial responses and shard failures

To ensure fast responses, the Bulk API returns results even when some shard operations fail. Each operation in the bulk request is processed independently, and OpenSearch includes the result of every operation in the response regardless of whether other operations succeeded or failed.

When one or more shards fail to process an operation, OpenSearch continues processing the remaining operations and includes error information for the failed operations in the response. The top-level `errors` field indicates whether any operations encountered errors, allowing you to quickly determine if you need to examine individual operation results.

Shard failures can occur for several reasons:

- **Insufficient resources**: The node hosting the shard runs out of memory or disk space.
- **Network partitions**: The shard becomes temporarily unreachable due to network issues.
- **Version conflicts**: Optimistic concurrency control prevents the operation from completing.
- **Mapping errors**: The document doesn't conform to the index's mapping requirements.

Your application should always check the `errors` field in the response and handle failed operations appropriately. Depending on your use case, you might retry failed operations, log them for later review, or alert operators to investigate the underlying cause.

## Required permissions

If you use the Security plugin, ensure you have the appropriate permissions to perform bulk operations. The required permissions depend on the operations in your bulk request:

- `indices:data/write/bulk`: Required for all bulk operations.
- `indices:data/write/index`: Required for index and create operations.
- `indices:data/write/update`: Required for update operations.
- `indices:data/write/delete`: Required for delete operations.

You also need permissions on the target indexes specified in your bulk request. When using index patterns or aliases, ensure your security role grants access to all indexes that the pattern or alias might match.
