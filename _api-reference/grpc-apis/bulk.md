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

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#how-to-use-grpc-apis).

## gRPC service and method

gRPC Document APIs reside in the [DocumentService](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/services/document_service.proto#L22).

You can submit bulk requests by invoking the [`Bulk`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/services/document_service.proto#L24) gRPC method within the `DocumentService`. The method takes a [`BulkRequest`](#bulkrequest-fields) and returns a [`BulkResponse`](#bulkresponse-fields).

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

The [`BulkRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L17) message is the top-level container for a gRPC bulk operation. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `bulk_request_body` | `repeated `[`BulkRequestBody`](#bulkrequestbody-fields) | The list of bulk operations, each containing one of the operation types (`index`/`create`/`update`/`delete`). Required. |
| `index` | `string` | The default index for all operations unless overridden in `bulk_request_body`. Specifying the `index` in the `BulkRequest` means that you don't need to include it in the [BulkRequestBody](#bulkrequestbody-fields). Optional. |
| `x_source` | [`SourceConfigParam`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L195) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. Optional. |
| `x_source_excludes` | `repeated string` | Fields to exclude from `source`. Optional. |
| `x_source_includes` | `repeated string` | Fields to include from `source`. Optional. |
| `pipeline` | `string` | The preprocessing ingest pipeline ID. Optional. |
| `refresh` | [`Refresh`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L265) | Whether to refresh shards after indexing. Optional. |
| `require_alias` | `bool` | If `true`, actions must target an alias. Optional. |
| `routing` | `string` | The routing value for shard assignment. Optional. |
| `timeout` | `string` | The timeout duration (for example, `1m`). Optional. |
| `type` (Deprecated) | `string` | The document type (always `_doc`). Optional. |
| `wait_for_active_shards` | [`WaitForActiveShards`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L24) | The minimum number of active shards to wait for. Optional. |
| `global_params` | [`GlobalParams`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L15) | Global parameters for the request. Optional. |


## BulkRequestBody fields

The [`BulkRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L48) message represents a single document-level operation within a `BulkRequest`. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `operation_container` | [`OperationContainer`](#operationcontainer-fields) | The operation to perform (`index`, `create`, `update`, or `delete`). Required. |
| `update_action` | [`UpdateAction`](#updateaction-fields) | Additional update-specific options. Optional. |
| `object` | `bytes` | The full document content used with `create` and `index` operations. Optional. |

## OperationContainer fields

The [`OperationContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L57) message contains exactly one operation type. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | [`IndexOperation`](#index) | Index a document. Replaces the document if it already exists. |
| `create` | [`WriteOperation`](#create) | Create a new document. Fails if the document already exists. |
| `update` | [`UpdateOperation`](#update) | Partially update a document or use upsert/script options. |
| `delete` | [`DeleteOperation`](#delete) | Delete a document by ID. |

## UpdateAction fields

The [`UpdateAction`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L71) message provides additional options for update operations. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `detect_noop` | `bool` | If `true`, skips the update if the document content hasn't changed. Optional. Default is `true`. |
| `doc` | `bytes` | Partial or full document data for `update` operations. Optional. |
| `doc_as_upsert` | `bool` | If `true`, treats the document as the full upsert document if the target document doesn't exist. Only valid for the `update` operation. Optional. |
| `script` | [`Script`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L37) | A script to apply to the document (used with `update`). Optional. |
| `scripted_upsert` | `bool` | If `true`, executes the script whether or not the document exists. Optional. |
| `upsert` | `bytes` | The full document to use if the target does not exist. Used with `script`. Optional. |
| `x_source` | [`SourceConfig`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L226) | Controls how the document source is fetched or filtered. Optional. |


### Create

`WriteOperation` adds a new document only if it doesn't already exist.

The document itself must be provided in the `object` field of the `BulkRequestBody` message.

The following optional fields can also be provided.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `x_id` | `string` | The document ID. If omitted, one is auto-generated. Optional. |
| `x_index` | `string` | The target index. Required if not set globally in the `BulkRequest`. Optional. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `pipeline` | `string` | The preprocessing ingest pipeline ID. Optional. |
| `require_alias` | `bool` | If `true`, requires that all actions target an index alias rather than an index. Default is `false`. Optional. |

#### Example request

The following example shows a bulk request with a `create` operation. It creates a document with the ID `tt1375666` in the `movies` index. The document content, provided in Base64 encoding, represents `{"title": "Inception", "year": 2010}`:

```json
{
  "index": "movies",
  "bulk_request_body": [
    {
      "operation_container": {
        "create": {
          "x_index": "movies",
          "x_id": "tt1375666"
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
| `x_id` | `string` | The ID of the document to delete. Required. |
| `x_index` | `string` | The target index. Required if not set globally in the `BulkRequest`. Optional. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `if_primary_term` | `int64` | Used for concurrency control. The operation only runs if the document's primary term matches this value. Optional. |
| `if_seq_no` | `int64` | Used for concurrency control. The operation only runs if the document's sequence number matches this value. Optional. |
| `version` | `int64` | The explicit document version for concurrency control. Optional. |
| `version_type` | [`VersionType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L95) | Controls version matching behavior. Optional. |

#### Example request

The following example shows a bulk request with a `delete` operation. It deletes a document with the ID `tt1392214` from the `movies` index:

```json
{
  "index": "movies",
  "bulk_request_body": [
    {
      "operation_container": {
        "delete": {
          "x_index": "movies",
          "x_id": "tt1392214"
        }
      }
    }
  ]
}
```
{% include copy.html %}

### Index

The `IndexOperation` creates or overwrites a document. If an ID is not provided, one is generated.

The document itself is provided in the `object` field of the `BulkRequestBody` message.

The following optional fields can also be provided.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `x_id` | `string` | The document ID. If omitted, one is auto-generated. Optional. |
| `x_index` | `string` | The target index. Required only if not set globally in the `BulkRequest`. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `if_primary_term` | `int64` | Used for concurrency control. The operation only runs if the document's primary term matches this value. Optional. |
| `if_seq_no` | `int64` | Used for concurrency control. The operation only runs if the document's sequence number matches this value. Optional. |
| `op_type` | [`OpType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L89) | The operation type. Controls the overwriting behavior. Valid values are `index` (default) and `create`. Optional. |
| `version` | `int64` | The explicit document version for concurrency control. Optional. |
| `version_type` | [`VersionType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L95) | Controls version matching behavior. Optional. |
| `pipeline` | `string` | The preprocessing ingest pipeline ID. Optional. |
| `require_alias` | `bool` | If `true`, requires that all actions target an index alias rather than an index. Default is `false`. Optional. |


#### Example request

The following example shows a bulk request with an `index` operation. It indexes a Base64-encoded document with the ID `tt0468569` into the `movies` index:

```json
{
  "index": "movies",
  "bulk_request_body": [
    {
      "operation_container": {
        "index": {
          "x_index": "movies",
          "x_id": "tt0468569"
        }
      },
      "object": "eyJ0aXRsZSI6ICJUaGUgRGFyayBLbmlnaHQiLCAieWVhciI6IDIwMDh9"
    }
  ]
}
```
{% include copy.html %}

### Update

The `UpdateOperation` performs partial document updates.

The update options are provided in the `update_action` field within the `BulkRequestBody` message.

All `UpdateOperation` fields, listed in the following table, are optional except for `x_id`.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `x_id` | `string` | The ID of the document to update. Required. |
| `x_index` | `string` | The target index. Required if not set globally in the `BulkRequest`. Optional. |
| `routing` | `string` | A custom routing value used to control shard placement. Optional. |
| `if_primary_term` | `int64` | Used for concurrency control. The operation only runs if the document's primary term matches this value. Optional. |
| `if_seq_no` | `int64` | Used for concurrency control. The operation only runs if the document's sequence number matches this value. Optional. |
| `require_alias` | `bool` | If `true`, requires that all actions target an index alias rather than an index. Default is `false`. Optional. |
| `retry_on_conflict` | `int32` | The number of times to retry the operation if a version conflict occurs. Optional. |


#### Example request

The following example shows a bulk request with an `update` operation. It will update a document with the ID `tt1375666` in the `movies` index to `{"year": 2011}`:

```json
{
  "index": "movies",
  "bulk_request_body": [
    {
      "operation_container": {
        "update": {
          "x_index": "movies",
          "x_id": "tt1375666"
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

To upsert a document, provide an `UpdateOperation` and specify `doc_as_upsert` as `true` in the `BulkRequestBody`. The document to be upserted should be provided in the `doc` field.

#### Example request

The following example shows a bulk request with an `upsert` operation. It updates the `year` field of the document with ID `tt1375666` in the `movies` index to `{"year": 2012}`:

```json
{
  "index": "movies",
  "bulk_request_body": [
    {
      "operation_container": {
        "update": {
          "x_index": "movies",
          "x_id": "tt1375666"
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

To specify a script, provide an `UpdateOperation` and a `script` field in the `BulkRequestBody`.

#### Example request

The following example shows a bulk request with a `script` operation. It increments the `year` field of the document with the ID `tt1375666` in the `movies` index by 1:

```json
{
  "index": "movies",
  "bulk_request_body": [
    {
      "operation_container": {
        "update": {
          "x_index": "movies",
          "x_id": "tt1375666"
        }
      },
      "update_action": {
        "script": {
          "inline": {
            "source": "ctx._source.year += 1",
            "lang": {
              "builtin": "BUILTIN_SCRIPT_LANGUAGE_PAINLESS"
            }
          }
        }
      }
    }
  ]
}
```
{% include copy.html %}


## Response fields

The gRPC Bulk API provides the following response fields.

### BulkResponse fields

The [`BulkResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L187) message is returned directly from the `Bulk` gRPC method and provides a summary and per-item result of a bulk operation. It contains the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `errors` | `bool` | Indicates whether any of the operations in the bulk request failed. If any operation fails, the response's `errors` field will be `true`. You can iterate over the individual `Item` actions for more detailed information.|
| `items` | `repeated` [`Item`](#item-fields) | The result of all operations in the bulk request, in the order they were submitted. |
| `took` | `int64` | The amount of time taken to process the bulk request, in milliseconds. |
| `ingest_took` | `int64` | The amount of time taken to process documents through an ingest pipeline, in milliseconds. |


### Item fields

Each `Item` in the response corresponds to a single operation in the request. For each operation, only one of the following fields is provided.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `create` | [`ResponseItem`](#responseitem-fields) | The result of the `CreateOperation`. |
| `delete` | [`ResponseItem`](#responseitem-fields) | The result of the `DeleteOperation`.   |
| `index` | [`ResponseItem`](#responseitem-fields) | The result of the `IndexOperation`.  |
| `update` | [`ResponseItem`](#responseitem-fields) | The result of the `UpdateOperation`.  |


### ResponseItem fields

Each `ResponseItem` corresponds to a single operation in the request. It contains the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `type` | `string` | The document type. |
| `id` | `string` | The document ID associated with the operation. |
| `index` | `string` | The name of the index associated with the operation. If a data stream was targeted, this is the backing index. |
| `status` | `int32` | The HTTP status code returned for the operation. *(Note: This field may be replaced with a gRPC code in the future.)* |
| `error` | [`ErrorCause`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L288) | Contains additional information about a failed operation. |
| `primary_term` | `int64` | The primary term assigned to the document. |
| `result` | `string` | The operation result. Valid values are `created`, `deleted`, and `updated`. |
| `seq_no` | `int64` | A sequence number assigned to the document to maintain version order. |
| `shards` | [`ShardInfo`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L329) | Shard information for the operation (only returned for successful actions). |
| `version` | `int64` | The document version (only returned for successful actions). |
| `forced_refresh` | `bool` | If `true`, forces the document to become visible immediately after the operation. |
| `get` | [`InlineGetDictUserDefined`](#inlinegetdictuserdefined-fields) | Contains the document `source` returned from an inline get, if requested. |

### InlineGetDictUserDefined fields

The [`InlineGetDictUserDefined`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/document.proto#L248) message contains the document source returned from an inline get operation.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `metadata_fields` | `optional` [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107) | The document's metadata fields. |
| `fields` | `optional` [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107) | The document's stored fields. |
| `found` | `bool` | Whether the document exists. |
| `x_seq_no` | `optional int64` | The document's sequence number. |
| `x_primary_term` | `optional int64` | The document's primary term. |
| `x_routing` | `optional string` | The document's routing value. |
| `x_source` | `optional bytes` | The document's source data. |

## Example response

```json
{
  "errors": false,
  "items": [
    {
      "index": {
        "x_id": "2",
        "x_index": "my_index",
        "status": 201,
        "x_primary_term": 1,
        "result": "created",
        "x_seq_no": 0,
        "x_shards": {
          "successful": 1,
          "total": 2
        },
        "x_version": 1,
        "forced_refresh": true
      }
    },
    {
      "create": {
        "x_id": "1",
        "x_index": "my_index",
        "status": 201,
        "x_primary_term": 1,
        "result": "created",
        "x_seq_no": 0,
        "x_shards": {
          "successful": 1,
          "total": 2
        },
        "x_version": 1,
        "forced_refresh": true
      }
    },
    {
      "update": {
        "x_id": "2",
        "x_index": "my_index",
        "status": 200,
        "x_primary_term": 1,
        "result": "updated",
        "x_seq_no": 1,
        "x_shards": {
          "successful": 1,
          "total": 2
        },
        "x_version": 2,
        "forced_refresh": true,
        "get": {
          "found": true,
          "x_seq_no": 1,
          "x_primary_term": 1,
          "x_source": "e30="
        }
      }
    },
    {
      "delete": {
        "x_id": "2",
        "x_index": "my_index",
        "status": 200,
        "x_primary_term": 1,
        "result": "deleted",
        "x_seq_no": 2,
        "x_shards": {
          "successful": 1,
          "total": 2
        },
        "x_version": 3,
        "forced_refresh": true
      }
    }
  ],
  "took": 87,
  "ingest_took": 0
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

        // Create an index operation
        IndexOperation indexOp = IndexOperation.newBuilder()
                .setXIndex("my-index")
                .setXId("1")
                .build();

        BulkRequestBody indexBody = BulkRequestBody.newBuilder()
                .setOperationContainer(OperationContainer.newBuilder().setIndex(indexOp).build())
                .setObject(ByteString.copyFromUtf8("{\"field\": \"value\"}"))
                .build();

        // Create a delete operation
        DeleteOperation deleteOp = DeleteOperation.newBuilder()
                .setXIndex("my-index")
                .setXId("2")
                .build();

        BulkRequestBody deleteBody = BulkRequestBody.newBuilder()
                .setOperationContainer(OperationContainer.newBuilder().setDelete(deleteOp).build())
                .build();

        // Build the bulk request
        BulkRequest request = BulkRequest.newBuilder()
                .setIndex("my-index")
                .addBulkRequestBody(indexBody)
                .addBulkRequestBody(deleteBody)
                .build();

        // Execute the bulk request
        try {
            BulkResponse response = stub.bulk(request);

            // Handle the response
            System.out.println("Bulk errors: " + response.getErrors());
            System.out.println("Bulk took: " + response.getTook() + " ms");
            if (response.hasIngestTook()) {
                System.out.println("Ingest took: " + response.getIngestTook() + " ms");
            }

            // Process individual items
            for (Item item : response.getItemsList()) {
                if (item.hasIndex()) {
                    System.out.println("Index operation: " + item.getIndex().getStatus());
                } else if (item.hasDelete()) {
                    System.out.println("Delete operation: " + item.getDelete().getStatus());
                } else if (item.hasCreate()) {
                    System.out.println("Create operation: " + item.getCreate().getStatus());
                } else if (item.hasUpdate()) {
                    System.out.println("Update operation: " + item.getUpdate().getStatus());
                }
            }
        } catch (io.grpc.StatusRuntimeException e) {
            System.err.println("gRPC request failed with status: " + e.getStatus());
            System.err.println("Error message: " + e.getMessage());
        }

        channel.shutdown();
    }
}
```
{% include copy.html %}

## Python gRPC client example

The following example shows how to send the same request using a Python client application.

First, install the `opensearch-protobufs` package using `pip`:

```bash
pip install opensearch-protobufs==0.24.0
```
{% include copy.html %}

Use the following code to send the request:

```python
import grpc

from opensearch.protobufs.schemas import *
from opensearch.protobufs.services import DocumentServiceStub

channel = grpc.insecure_channel(
    target="localhost:9400",
)

document_stub = DocumentServiceStub(channel)

# Add documents to a request body
requestBody = BulkRequestBody(
    operation_container=OperationContainer(index=IndexOperation())
)
requestBody.object = "{\"field\": \"value\"}".encode('utf-8')

# Append to a bulk request
request = BulkRequest()
request.index = "my-index"
request.bulk_request_body.append(requestBody)

# Send request and handle response
try:
    response = document_stub.Bulk(request=request)
    if response.items:
        print("Received {} response items".format(len(response.items)))
        print(response.items)
except grpc.RpcError as e:
    if e.code() == StatusCode.UNAVAILABLE:
        print("Failed to reach server: {}".format(e))
    elif e.code() == StatusCode.PERMISSION_DENIED:
        print("Permission denied: {}".format(e))
    elif e.code() == StatusCode.INVALID_ARGUMENT:
        print("Invalid argument: {}".format(e))
finally:
    channel.close()
```
{% include copy.html %}
