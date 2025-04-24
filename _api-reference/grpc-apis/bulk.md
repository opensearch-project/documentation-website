---
layout: default
title: Bulk gRPC
parent: gRPC APIs
nav_order: 20
---

# Bulk (gRPC)
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).    
{: .warning}

The gRPC Bulk API provides an efficient, binary-encoded alternative to the [HTTP Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) for performing multiple document operations—such as indexing, updating, and deleting—in a single call. This service uses protocol buffers and mirrors the REST API in terms of parameters and structure.

## Client protobufs
In order for users to submit GRPC requests, a set of protobufs are required on the client-side. These can be obtained by one of the following ways.
1. Download the raw protobufs from the [OpenSearch Protobufs GitHub repository (v0.3.0)](https://github.com/opensearch-project/opensearch-protobufs). Client-side code can then be generated using the protocol buffer compiler for these [supported languages](https://grpc.io/docs/languages/). 
1. For Java clients specifically, download the `opensearch-protobufs` jar from the [Central Maven repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0). 

## GRPC Service and Method
[DocumentService](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/services/document_service.proto#L23C12-L23C23) is where all the GRPC Document APIs reside.

Bulk requests can be submitted by invoking the GRPC method `Bulk` within the `DocumentService`. The method takes in a [`BulkRequest`](#bulkrequest-fields) and returns a [`BulkResponse`](#bulkresponsebody-fields).

### Document format

In GRPC, documents must be provided and are returned as bytes. Use Base64 encoding to provide documents in a gRPC request.
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

The `BulkRequest` message is the top-level container for a gRPC bulk operation. 


It accepts the following fields. All fields are optional except `request_body`. 

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| `index` | string | Default index for all operations unless overridden in request_body. Specifying the `index` in the `BulkRequest` means you don't need to include it in the [BulkRequestBody](#bulkrequestbody-fields). Optional. |
| `source` | SourceConfigParam | Control `source` return fields. Optional. |
| `source_excludes` | repeated string | Fields to exclude from `source`. Optional. |
| `source_includes` | repeated string | Fields to include from `source`. Optional. |
| `pipeline` | string | Preprocessing ingest pipeline ID. Optional. |
| `refresh` | Refresh (enum) | Whether to refresh shards after indexing. Optional. |
| `require_alias` | bool | If true, actions must target an alias. Optional. |
| `routing` | string | Routing value for shard assignment. Optional. |
| `timeout` | string | Timeout duration (e.g., "1m"). Optional. |
| `type` | string | (Deprecated.) Document type, always _doc. Optional. |
| `wait_for_active_shards` | WaitForActiveShards (enum) | Min number of active shards to wait for. Optional. |
| `request_body` | repeated BulkRequestBody | List of bulk operations (index/create/update/delete). Required. |

## BulkRequestBody fields

The [`BulkRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/document.proto#L53) message represents a single document-level operation within a `BulkRequest`.

All fields are optional, but exactly one of `index`, `create`, `update`, or `delete` must be set per `BulkRequestBody`. 

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| `index` | IndexOperation | Index a document. Replaces if already exists. Optional. |
| `create` | CreateOperation | Create a new document. Fails if the document already exists. Optional. |
| `update` | UpdateOperation | Partially update a document or use upsert/script options. Optional. |
| `delete` | DeleteOperation | Delete a document by ID. Optional. |
| `detect_noop` | bool | If true, skips update if the document content hasn't changed. Default is true. Optional. |
| `doc` | bytes | Partial or full document data for update or index. Optional. |
| `doc_as_upsert` | bool | If true, treat doc as the full upsert document if the target doc doesn't exist. Only for update. Optional. |
| `script` | Script | A script to apply to the document (used with update). Optional. |
| `scripted_upsert` | bool | If true, executes the script whether or not the document exists. Optional. |
| `source` | SourceConfig | Controls how the document source is fetched or filtered. Optional. |
| `upsert` | bytes | Full document to use if the target does not exist. Used with script. Optional. |
| `object` | bytes | Full document content, used with create. Optional. |


### Create

`CreateOperation` adds a new document only if it doesn’t already exist. 

The document itself will be provided in the `object` field, outside of the `CreateOperation` message.

The following optional fields can also be provided.

| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| `id` | string | Document ID. If omitted, one is auto-generated. Optional. |
| `index` | string | Target index. Required if not set globally in the BulkRequest. Optional. |
| `routing` | string | Custom routing value to control shard placement. Optional. |
| `if_primary_term` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `if_seq_no` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `version` | int64 | Explicit document version for concurrency control. Optional. |
| `version_type` | VersionType | Controls version matching behavior. Optional. |
| `pipeline` | string | Ingest pipeline ID for preprocessing. Optional. |
| `require_alias` | bool | Enforces use of index aliases only. Optional. |

#### Example request

```json
{
  "index": "movies",
  "request_body": [
    {
      "create": {
        "index": "movies",
        "id": "tt1375666"
      },
      "object": "eyJ0aXRsZSI6ICJJbmNlcHRpb24iLCAieWVhciI6IDIwMTB9"
    }
  ]
}
```

### Delete

The `DeleteOperation` removes a document by ID.

All the following fields are optional except the `id`. 


| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| `id` | string | ID of the document to delete. Required. |
| `index` | string | Target index. Required if not set globally in the BulkRequest. Optional. |
| `routing` | string | Custom routing value to control shard placement. Optional. |
| `if_primary_term` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `if_seq_no` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `version` | int64 | Explicit document version for concurrency control. Optional. |
| `version_type` | VersionType | Controls version matching behavior. Optional. |


### Example request

```json
{
  "index": "movies",
  "request_body": [
    {
      "delete": {
        "index": "movies",
        "id": "tt1392214"
      }
    }
  ]
}
```
{% include copy.html %}

### Index

`IndexOperation` creates or overwrites a document. If an ID is not provided, one will be generated.

The document itself will be provided in the `doc` field, outside of the `IndexOperation` message.

The following optional fields can also be provided.


| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| `id` | string | Document ID. If omitted, one is auto-generated. Optional. |
| `index` | string | Target index. Required only if not set globally in the BulkRequest. |
| `routing` | string | Custom routing value to control shard placement. Optional. |
| `if_primary_term` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `if_seq_no` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `op_type` | OpType | index (default) or create. Controls overwriting behavior. Optional. |
| `version` | int64 | Explicit document version for concurrency control. Optional. |
| `version_type` | VersionType | Controls version matching behavior. Optional. |
| `pipeline` | string | Ingest pipeline ID for preprocessing. Optional. |
| `require_alias` | bool | Enforces use of index aliases only. Optional. |


#### Example request
Example request payload sent to the `org.opensearch.protobufs.services.DocumentService/Bulk` method:
```json
{
  "index": "movies",
  "request_body": [
    {
      "index": {
        "index": "movies",
        "id": "tt0468569"
      },
      "doc": "eyJ0aXRsZSI6ICJUaGUgRGFyayBLbmlnaHQiLCAieWVhciI6IDIwMDh9"
    }
  ]
}
```
{% include copy.html %}

### Update

The `UpdateOperation` performs partial document updates.  

The document itself will be provided in the `doc` field, outside of the `UpdateOperation` message.

All fields of the `UpdateOperation` below are optional except the `id`. 

| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| `id` | string |  ID of the document to update. Required. |
| `index` | string | Target index. Required if not set globally in the BulkRequest. Optional. |
| `routing` | string | Custom routing value to control shard placement. Optional. |
| `if_primary_term` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `if_seq_no` | int64 | Concurrency control: only proceed if this matches. Optional. |
| `require_alias` | bool | Enforces use of index aliases only. Optional. |
| `retry_on_conflict` | int32 | Number of retry attempts on version conflict. Optional. |


#### Example request

```json
{
  "index": "movies",
  "request_body": [
    {
      "update": {
        "index": "movies",
        "id": "tt1375666"
      },
      "doc": "eyJ5ZWFyIjogMjAxMX0=",
      "detect_noop": true
    }
  ]
}
```
{% include copy.html %}

### Upsert

If the document exists, update it. If not, create it with the given doc. 

To upsert a document, provide an `UpdateOperation`, but specify `doc_as_upsert` as `true`. The document to be upserted should be provided in the `doc_as_upsert` field outside of the `UpdateOperation`.


#### Example request

```json
{
  "index": "movies",
  "request_body": [
    {
      "update": {
        "index": "movies",
        "id": "tt1375666"
      },
      "doc": "eyJ5ZWFyIjogMjAxMn0=",
      "doc_as_upsert": true
    }
  ]
}
```
{% include copy.html %}

### Script

Run a stored or inline script to modify a document.
 
 
To specify a script, provide an `UpdateOperation`, and additionally provide a `script` field outside of the `UpdateOperation`. 

#### Example request

```json
{
  "index": "movies",
  "request_body": [
    {
      "update": {
        "index": "movies",
        "id": "tt1375666"
      },
      "script": {
        "source": "ctx._source.year += 1",
        "lang": "painless"
      }
    }
  ]
}
```
{% include copy.html %}


## Response

### `BulkResponseBody` fields

The `BulkResponse` message provides a summary and per-item result of a bulk operation.

If any operation fails, the response's `errors` field will be true.

If true, you can iterate over the individual `Item` actions for more detailed information.


| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| `errors` | bool | Indicates whether any of the operations in the bulk request failed. |
| `items` | repeated Item | The result of each operation in the bulk request, in the order they were submitted. |
| `took` | int64 | How long, in milliseconds, it took to process the bulk request. |
| `ingest_took` | int64| How long, in milliseconds, it took to process documents through an ingest pipeline |


### `Item` fields
Each item in the response corresponds to a single operation in the request. Only one of the following fields will be provided, for each operation.

| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| `create` | ResponseItem | Result of the `CreateOperation`. |
| `delete` | ResponseItem | Result of the `DeleteOperation`.   |
| `index` | ResponseItem | Result of the `IndexOperation`.  |
| `update` | ResponseItem | Result of the `UpdateOperation`.  |


### `ResponseItem` fields

Each item in the response corresponds to a single operation in the request.

| Field | Protobuf Type | Description |
|------------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `type` | string | The document type. |
| `id` | ResponseItem.Id | The document ID associated with the operation. Can be null. |
| `index` | string | Name of the index associated with the operation. If a data stream was targeted, this is the backing index. |
| `status` | int32 | HTTP status code returned for the operation. *(Note: may be replaced with gRPC codes in future.)* |
| `error` | ErrorCause | Contains additional information about a failed operation. |
| `primary_term` | int64 | The primary term assigned to the document. |
| `result` | string | Result of the operation. Possible values: created, deleted, updated. |
| `seq_no` | int64 | Sequence number assigned to the document to maintain version order. |
| `shards` | ShardInfo | Shard information for the operation (only on success). |
| `version` | int64 | Document version (only returned for successful actions). |
| `forced_refresh` | bool | If true, immediate visibility of the document is required. |
| `get` | InlineGetDictUserDefined | Contains the document source returned from an inline get if requested. |
 
### Example response

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
          "primaryTerm": "1",
          "result": "created",
          "seqNo": "0",
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
          "primaryTerm": "1",
          "result": "created",
          "seqNo": "0",
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
          "primaryTerm": "1",
          "result": "updated",
          "seqNo": "1",
          "shards": {
            "successful": 1,
            "total": 2
          },
          "version": "2",
          "forcedRefresh": true,
          "get": {
            "found": true,
            "seqNo": "1",
            "primaryTerm": "1",
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
          "primaryTerm": "1",
          "result": "deleted",
          "seqNo": "2",
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

The example below shows a Java client that submits a sample Bulk GRPC request, then checks whether there were any errors in the bulk response.

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
                .setIndex("my-index")
                .setId("1")
                .build();

        BulkRequestBody indexBody = BulkRequestBody.newBuilder()
                .setIndex(indexOp)
                .setDoc(ByteString.copyFromUtf8("{\"field\": \"value\"}"))
                .build();

        DeleteOperation deleteOp = DeleteOperation.newBuilder()
                .setIndex("my-index")
                .setId("2")
                .build();

        BulkRequestBody deleteBody = BulkRequestBody.newBuilder()
                .setDelete(deleteOp)
                .build();

        BulkRequest request = BulkRequest.newBuilder()
                .setIndex("my-index")
                .addRequestBody(indexBody)
                .addRequestBody(deleteBody)
                .build();

        BulkResponse response = stub.bulk(request);
        System.out.println("Bulk errors: " + response.getErrors());

        channel.shutdown();
    }
}
```
{% include copy.html %}
