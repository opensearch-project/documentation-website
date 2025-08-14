---
layout: default
title: Bulk (gRPC)
parent: gRPC APIs
nav_order: 20
---

# Bulk API (gRPC)
**Introduced 3.0**
{: .label .label-purple }

The gRPC Bulk API provides an efficient, binary-encoded alternative to the [HTTP Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) for performing multiple document operations—such as indexing, updating, and deleting—in a single call. This service uses protocol buffers and mirrors the REST API in terms of parameters and structure.

## Prerequisite

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#using-grpc-apis).

## gRPC service and method

gRPC Document APIs reside in the [DocumentService](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/services/document_service.proto#L21).

You can submit bulk requests by invoking the [`Bulk`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/services/document_service.proto#L23) gRPC method within the `DocumentService`. The method takes in a [`BulkRequest`](#bulkrequest-fields) and returns a [`BulkResponse`](#bulkresponsebody-fields).

## Document format

In gRPC, documents must be provided and returned as bytes. Use Base64 encoding to provide documents in a gRPC request.
{: .note }

For example, consider the following document in a regular Bulk API request:

```json
"doc":  "{\"title\": \"Inception\", \"year\": 2010}"
```

For a gRPC Bulk API request, provide the same document in Base64 encoding:

```json
"doc": "eyJ0aXRsZSI6ICJJbmNlcHRpb24iLCAieWVhciI6IDIwMTB9"
```

## BulkRequest fields

The [`BulkRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L16) message is the top-level container for a gRPC bulk operation. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `request_body` | `repeated `[`BulkRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L53) | The list of bulk operations, each containing an `OperationContainer` with one of the operation types (`index`/`create`/`update`/`delete`). Required. |
| `index` | `string` | The default index for all operations unless overridden in `request_body`. Specifying the `index` in the `BulkRequest` means that you don't need to include it in the [BulkRequestBody](#bulkrequestbody-fields). Optional. |
| `source` | [`SourceConfigParam`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L154) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. Optional. |
| `source_excludes` | `repeated string` | Fields to exclude from `source`. Optional. |
| `source_includes` | `repeated string` | Fields to include from `source`. Optional. |
| `pipeline` | `string` | The preprocessing ingest pipeline ID. Optional. |
| `refresh` | [`Refresh`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L307) | Whether to refresh shards after indexing. Optional. |
| `require_alias` | `bool` | If `true`, actions must target an alias. Optional. |
| `routing` | `string` | The routing value for shard assignment. Optional. |
| `timeout` | `string` | The timeout duration (for example, `1m`). Optional. |
| `type` (Deprecated) | `string` | The document type (always `_doc`). Optional. |
| `wait_for_active_shards` | [`WaitForActiveShards`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L13) | The minimum number of active shards to wait for. Optional. |


## BulkRequestBody fields

The [`BulkRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L53) message represents a single document-level operation within a `BulkRequest`. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `operation_container` | [`OperationContainer`](#operationcontainer-fields) | The operation to perform. Valid values are `index`, `create`, `update`, and `delete`. Required. |
| `update_action` | [`UpdateAction`](#updateaction-fields) | Additional fields for update operations. Optional. |
| `object` | `bytes` | The full document content used with `create` operations. Optional. |


### OperationContainer fields

The `OperationContainer` message contains exactly one of the following operation types.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | [`IndexOperation`](#index) | Index a document. Replaces the document if it already exists. |
| `create` | [`WriteOperation`](#create) | Create a new document. Fails if the document already exists. |
| `update` | [`UpdateOperation`](#update) | Partially update a document or use upsert/script options. |
| `delete` | [`DeleteOperation`](#delete) | Delete a document by ID. |


### UpdateAction fields

The `UpdateAction` message contains the following additional fields for `update` operations.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `detect_noop` | `bool` | If `true`, skips the update if the document content hasn't changed. Optional. Default is `true`. |
| `doc` | `bytes` | Partial or full document data for `update` operations. Optional. |
| `doc_as_upsert` | `bool` | If `true`, treats the document as the full upsert document if the target document doesn't exist. Only valid for the `update` operation. Optional. |
| `script` | [`Script`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L27) | A script to apply to the document (used with `update`). Optional. |
| `scripted_upsert` | `bool` | If `true`, executes the script whether or not the document exists. Optional. |
| `upsert` | `bytes` | The full document to use if the target does not exist. Used with `script`. Optional. |
| `source` | [`SourceConfig`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L176) | Controls how the document source is fetched or filtered. Optional. |


### Create

`WriteOperation` adds a new document only if it doesn't already exist.

The document itself must be provided in the `object` field, outside of the `WriteOperation` message.

The following optional fields can also be provided.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `id` | `string` | The document ID. If omitted, one is auto-generated. Optional. |
| `index` | `string` | The target index. Required if not set globally in the `BulkRequest`. Optional. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `pipeline` | `string` | The preprocessing ingest pipeline ID. Optional. |
| `require_alias` | `bool` | Enforces the use of index aliases only. Optional. |

#### Example request

The following example shows a bulk request with a `create` operation. It creates a document with the ID `tt1375666` in the `movies` index. The document content, provided in Base64 encoding, represents `{"title": "Inception", "year": 2010}`:

```json
{
  "index": "movies",
  "request_body": [
    {
      "operation_container": {
        "create": {
          "index": "movies",
          "id": "tt1375666"
        }
      },
      "object": "eyJ0aXRsZSI6ICJJbmNlcHRpb24iLCAieWVhciI6IDIwMTB9"
    }
  ]
}
```

### Delete

The `DeleteOperation` removes a document by ID. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `id` | `string` | The ID of the document to delete. Required. |
| `index` | `string` | The target index. Required if not set globally in the `BulkRequest`. Optional. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `if_primary_term` | `int64` | Used for concurrency control. The operation only runs if the document's primary term matches this value. Optional. |
| `if_seq_no` | `int64` | Used for concurrency control. The operation only runs if the document's sequence number matches this value. Optional. |
| `version` | `int64` | The explicit document version for concurrency control. Optional. |
| `version_type` | [`VersionType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L99) | Controls version matching behavior. Optional. |

#### Example request

The following example shows a bulk request with a `delete` operation. It deletes a document with the ID `tt1392214` from the `movies` index:

```json
{
  "index": "movies",
  "request_body": [
    {
      "operation_container": {
        "delete": {
          "index": "movies",
          "id": "tt1392214"
        }
      }
    }
  ]
}
```
{% include copy.html %}

### Index

The `IndexOperation` creates or overwrites a document. If an ID is not provided, one is generated.

The document itself is provided in the `doc` field, outside of the `IndexOperation` message.

The following optional fields can also be provided.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `id` | `string` | The document ID. If omitted, one is auto-generated. Optional. |
| `index` | `string` | The target index. Required only if not set globally in the `BulkRequest`. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `if_primary_term` | `int64` | Used for concurrency control. The operation only runs if the document's primary term matches this value. Optional. |
| `if_seq_no` | `int64` | Used for concurrency control. The operation only runs if the document's sequence number matches this value. Optional. |
| `op_type` | [`OpType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L91) | The operation type. Controls the overwriting behavior. Valid values are `index` (default) and `create`. Optional. |
| `version` | `int64` | The explicit document version for concurrency control. Optional. |
| `version_type` | [`VersionType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L99) | Controls version matching behavior. Optional. |
| `pipeline` | `string` | The preprocessing ingest pipeline ID. Optional. |
| `require_alias` | `bool` | Enforces the use of index aliases only. Optional. |


#### Example request

The following example shows a bulk request with an `index` operation. It indexes a Base64-encoded document with the ID `tt0468569` into the `movies` index:

```json
{
  "index": "movies",
  "request_body": [
    {
      "operation_container": {
        "index": {
          "index": "movies",
          "id": "tt0468569"
        }
      },
      "update_action": {
        "doc": "eyJ0aXRsZSI6ICJUaGUgRGFyayBLbmlnaHQiLCAieWVhciI6IDIwMDh9"
      }
    }
  ]
}
```
{% include copy.html %}

### Update

The `UpdateOperation` performs partial document updates.

The document itself is provided in the `doc` field within the `UpdateAction` message.

All `UpdateOperation` fields, listed in the following table, are optional except for `id`.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `id` | `string` |  The ID of the document to update. Required. |
| `index` | `string` | The target index. Required if not set globally in the `BulkRequest`. Optional. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `if_primary_term` | `int64` | Used for concurrency control. The operation only runs if the document's primary term matches this value. Optional. |
| `if_seq_no` | `int64` | Used for concurrency control. The operation only runs if the document's sequence number matches this value. Optional. |
| `require_alias` | `bool` | Enforces the use of index aliases only. Optional. |
| `retry_on_conflict` | `int32` | The number of times to retry the operation if a version conflict occurs. Optional. |


#### Example request

The following example shows a bulk request with an `update` operation. It will update a document with the ID `tt1375666` in the `movies` index to `{"year": 2011}`:

```json
{
  "index": "movies",
  "request_body": [
    {
      "operation_container": {
        "update": {
          "index": "movies",
          "id": "tt1375666"
        }
      },
      "update_action": {
        "doc": "eyJ5ZWFyIjogMjAxMX0=",
        "detect_noop": true
      }
    }
  ]
}
```
{% include copy.html %}

### Upsert

The `upsert` operation updates the document if it already exists. Otherwise, it creates a new document using the provided document content.

To upsert a document, provide an `UpdateOperation` but specify `doc_as_upsert` as `true` in the `UpdateAction`. The document to be upserted should be provided in the `doc` field.

#### Example request

The following example shows a bulk request with an `upsert` operation. It updates the `year` field of the document with ID `tt1375666` in the `movies` index to `{"year": 2012}`:

```json
{
  "index": "movies",
  "request_body": [
    {
      "operation_container": {
        "update": {
          "index": "movies",
          "id": "tt1375666"
        }
      },
      "update_action": {
        "doc": "eyJ5ZWFyIjogMjAxMn0=",
        "doc_as_upsert": true
      }
    }
  ]
}
```
{% include copy.html %}

### Script

Run a stored or inline script to modify a document.

To specify a script, provide an `UpdateOperation` and a `script` field in the `UpdateAction`.

#### Example request

The following example shows a bulk request with a `script` operation. It increments the `year` field of the document with the ID `tt1375666` in the `movies` index by 1:

```json
{
  "index": "movies",
  "request_body": [
    {
      "operation_container": {
        "update": {
          "index": "movies",
          "id": "tt1375666"
        }
      },
      "update_action": {
        "script": {
          "source": "ctx._source.year += 1",
          "lang": "painless"
        }
      }
    }
  ]
}
```
{% include copy.html %}


## Response fields

The gRPC Bulk API provides the following response fields.

### BulkResponseBody fields

The [`BulkResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L211) message wraps either a `BulkResponseBody` for successful requests, or a `BulkErrorResponse` for failed requests. The `BulkResponseBody` provides a summary and per-item result of a bulk operation and contains the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `errors` | `bool` | Indicates whether any of the operations in the bulk request failed. If any operation fails, the response's `errors` field will be `true`. You can iterate over the individual `Item` actions for more detailed information.|
| `items` | `repeated Item` | The result of all operations in the bulk request, in the order they were submitted. |
| `took` | `int64` | The amount of time taken to process the bulk request, in milliseconds. |
| `ingest_took` | `int64` | The amount of time taken to process documents through an ingest pipeline, in milliseconds. |


### Item fields

Each `Item` in the response corresponds to a single operation in the request. For each operation, only one of the following fields is provided.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `create` | `ResponseItem` | The result of the `CreateOperation`. |
| `delete` | `ResponseItem` | The result of the `DeleteOperation`.   |
| `index` | `ResponseItem` | The result of the `IndexOperation`.  |
| `update` | `ResponseItem` | The result of the `UpdateOperation`.  |


### ResponseItem fields

Each `ResponseItem` corresponds to a single operation in the request. It contains the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `type` | `string` | The document type. |
| `id` | [`ResponseItem.Id`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L254) | The document ID associated with the operation. Can be `null`. |
| `index` | `string` | The name of the index associated with the operation. If a data stream was targeted, this is the backing index. |
| `status` | `int32` | The HTTP status code returned for the operation. *(Note: This field may be replaced with a gRPC code in the future.)* |
| `error` | [`ErrorCause`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L239) | Contains additional information about a failed operation. |
| `primary_term` | `int64` | The primary term assigned to the document. |
| `result` | `string` | The operation result. Valid values are `created`, `deleted`, and `updated`. |
| `seq_no` | `int64` | A sequence number assigned to the document to maintain version order. |
| `shards` | [`ShardInfo`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L286) | Shard information for the operation (only returned for successful actions). |
| `version` | `int64` | The document version (only returned for successful actions). |
| `forced_refresh` | `bool` | If `true`, forces the document to become visible immediately after the operation. |
| `get` | [`InlineGetDictUserDefined`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/document.proto#L290) | Contains the document `source` returned from an inline get, if requested. |

## Example response

```json
{
  "bulkResponseBody": {
    "errors": false,
    "items": [
      {
        "index": {
          "id": {
            "string": "2"
          },
          "index": "my_index",
          "status": 201,
          "primary_term": "1",
          "result": "created",
          "seq_no": "0",
          "shards": {
            "successful": 1,
            "total": 2
          },
          "version": "1",
          "forcedRefresh": true
        }
      },
      {
        "create": {
          "id": {
            "string": "1"
          },
          "index": "my_index",
          "status": 201,
          "primary_term": "1",
          "result": "created",
          "seq_no": "0",
          "shards": {
            "successful": 1,
            "total": 2
          },
          "version": "1",
          "forcedRefresh": true
        }
      },
      {
        "update": {
          "id": {
            "string": "2"
          },
          "index": "my_index",
          "status": 200,
          "primary_term": "1",
          "result": "updated",
          "seq_no": "1",
          "shards": {
            "successful": 1,
            "total": 2
          },
          "version": "2",
          "forcedRefresh": true,
          "get": {
            "found": true,
            "seq_no": "1",
            "primary_term": "1",
            "source": "e30="
          }
        }
      },
      {
        "delete": {
          "id": {
            "string": "2"
          },
          "index": "my_index",
          "status": 200,
          "primary_term": "1",
          "result": "deleted",
          "seq_no": "2",
          "shards": {
            "successful": 1,
            "total": 2
          },
          "version": "3",
          "forcedRefresh": true
        }
      }
    ],
    "took": "87",
    "ingestTook": "0"
  }
}
```
{% include copy.html %}


## Java gRPC client example

The following example shows a Java client-side program that submits an example bulk gRPC request and then checks whether there were any errors in the bulk response:

```java
import org.opensearch.protobufs.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import com.google.protobuf.ByteString;

public class BulkClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9400)
                .usePlaintext()
                .build();

        DocumentServiceGrpc.DocumentServiceBlockingStub stub = DocumentServiceGrpc.newBlockingStub(channel);

        IndexOperation indexOp = IndexOperation.newBuilder()
                .setXIndex("my-index")
                .setXId("1")
                .build();

        OperationContainer indexContainer = OperationContainer.newBuilder()
                .setIndex(indexOp)
                .build();

        UpdateAction indexAction = UpdateAction.newBuilder()
                .setDoc(ByteString.copyFromUtf8("{\"field\": \"value\"}"))
                .build();

        BulkRequestBody indexBody = BulkRequestBody.newBuilder()
                .setOperationContainer(indexContainer)
                .setUpdateAction(indexAction)
                .build();

        DeleteOperation deleteOp = DeleteOperation.newBuilder()
                .setXIndex("my-index")
                .setXId("2")
                .build();

        OperationContainer deleteContainer = OperationContainer.newBuilder()
                .setDelete(deleteOp)
                .build();

        BulkRequestBody deleteBody = BulkRequestBody.newBuilder()
                .setOperationContainer(deleteContainer)
                .build();

        BulkRequest request = BulkRequest.newBuilder()
                .setIndex("my-index")
                .addRequestBody(indexBody)
                .addRequestBody(deleteBody)
                .build();

        BulkResponse response = stub.bulk(request);
        System.out.println("Bulk errors: " + response.getBulkResponseBody().getErrors());

        channel.shutdown();
    }
}
```
{% include copy.html %}
