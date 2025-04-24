---
layout: default
title: Bulk gRPC
parent: gRPC APIs
nav_order: 20
---

# Bulk (gRPC)
**Introduced 3.0**
{: .label .label-purple }

The gRPC Bulk API provides an efficient, binary-encoded alternative to the [HTTP Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) for performing multiple document operations—such as indexing, updating, and deleting—in a single call. This service uses protocol buffers and mirrors the REST API in terms of parameters and structure.

This plugin is experimental and not recommended for production use. APIs and behavior may change without notice in future releases.
{: .note}

## Client protobufs

1. Refer to the full protobuf schema in the [OpenSearch Protobufs GitHub repository (v0.3.0)](https://github.com/opensearch-project/opensearch-protobufs)  for the source of truth:  
* [document_service.proto](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/services/document_service.proto)  
* [document.proto](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/document.proto)   
1. Java clients can also download the `opensearch-protobufs` jar from the [Central Maven repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0).


## Document format

Documents must be provided and are returned as bytes. 

Use Base64 encoding to provide documents in a gRPC request.
{: .note }

For example, consider the following document in a regular Bulk API request: 

```json
"doc":  "{\"title\": \"Inception\", \"year\": 2010}"
```

For a gRPC Bulk API request, provide the same document in Base64 encoding: 

```json
"doc": "eyJ0aXRsZSI6ICJJbmNlcHRpb24iLCAieWVhciI6IDIwMTB9"
```

## Bulk request fields

The [BulkRequest](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/document.proto#L16) message is the top-level container for a gRPC bulk operation. 

Specifying the `index` in the `BulkRequest` means you don't need to include it in the [BulkRequest body](#bulkrequest-fields).

The `BulkRequest` message accepts the following fields. All fields are optional except `request_body`. 

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| index | string | (Optional.) Default index for all operations unless overridden in request_body. |
| source | SourceConfigParam | (Optional.) Control `source` return fields. |
| source_excludes | repeated string | (Optional.) Fields to exclude from `source`. |
| source_includes | repeated string | (Optional.) Fields to include from `source`. |
| pipeline | string | (Optional.) Preprocessing ingest pipeline ID. |
| refresh | Refresh (enum) | (Optional.) Whether to refresh shards after indexing. |
| require_alias | bool | (Optional.) If true, actions must target an alias. |
| routing | string | (Optional.) Routing value for shard assignment. |
| timeout | string | (Optional.) Timeout duration (e.g., "1m"). |
| type | string | (Deprecated.) Document type, always _doc. |
| wait_for_active_shards | WaitForActiveShards (enum) | (Optional.) Min number of active shards to wait for. |
| request_body | repeated BulkRequestBody | (Required.) List of bulk operations (index/create/update/delete). |

## BulkRequestBody fields

The [`BulkRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/document.proto#L53) message represents a single document-level operation within a `BulkRequest`.

Only one of `index`, `create`, `update`, or `delete` must be set per `BulkRequestBody`. 

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| index | IndexOperation | (Optional.) Index a document. Replaces if already exists. |
| create | CreateOperation | (Optional.) Create a new document. Fails if the document already exists. |
| update | UpdateOperation | (Optional.) Partially update a document or use upsert/script options. |
| delete | DeleteOperation | (Optional.) Delete a document by ID. |
| detect_noop | bool | (Optional.) If true, skips update if the document content hasn't changed. Default is true. |
| doc | bytes | (Optional.) Partial or full document data for update or index. |
| doc_as_upsert | bool | (Optional.) If true, treat doc as the full upsert document if the target doc doesn't exist. Only for update. |
| script | Script | (Optional.) A script to apply to the document (used with update). |
| scripted_upsert | bool | (Optional.) If true, executes the script whether or not the document exists. |
| source | SourceConfig | (Optional.) Controls how the document source is fetched or filtered. |
| upsert | bytes | (Optional.) Full document to use if the target does not exist. Used with script. |
| object | bytes | (Optional.) Full document content, used with create. |


### Create

`CreateOperation` adds a new document only if it doesn’t already exist. 

The document itself will be provided in the `object` field, outside of the `CreateOperation` message.

The following optional fields can also be provided.

| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| id | string | (Optional.) Document ID. If omitted, one is auto-generated. |
| index | string | (Optional.) Target index. Required if not set globally in the BulkRequest. |
| routing | string | (Optional.) Custom routing value to control shard placement. |
| if_primary_term | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| if_seq_no | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| version | int64 | (Optional.) Explicit document version for concurrency control. |
| version_type | VersionType | (Optional.) Controls version matching behavior. |
| pipeline | string | (Optional.) Ingest pipeline ID for preprocessing. |
| require_alias | bool | (Optional.) Enforces use of index aliases only. |

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
| id | string | (Required.) ID of the document to delete. |
| index | string | (Optional.) Target index. Required if not set globally in the BulkRequest. |
| routing | string | (Optional.) Custom routing value to control shard placement. |
| if_primary_term | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| if_seq_no | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| version | int64 | (Optional.) Explicit document version for concurrency control. |
| version_type | VersionType | (Optional.) Controls version matching behavior. |


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
| id | string | (Optional.) Document ID. If omitted, one is auto-generated. |
| index | string | (Optional.) Target index. Required if not set globally in the BulkRequest. |
| routing | string | (Optional.) Custom routing value to control shard placement. |
| if_primary_term | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| if_seq_no | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| op_type | OpType | (Optional.) index (default) or create. Controls overwriting behavior. |
| version | int64 | (Optional.) Explicit document version for concurrency control. |
| version_type | VersionType | (Optional.) Controls version matching behavior. |
| pipeline | string | (Optional.) Ingest pipeline ID for preprocessing. |
| require_alias | bool | (Optional.) Enforces use of index aliases only. |


#### Example request

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
| id | string | (Required.) ID of the document to update. |
| index | string | (Optional.) Target index. Required if not set globally in the BulkRequest. |
| routing | string | (Optional.) Custom routing value to control shard placement. |
| if_primary_term | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| if_seq_no | int64 | (Optional.) Concurrency control: only proceed if this matches. |
| require_alias | bool | (Optional.) Enforces use of index aliases only. |
| retry_on_conflict | int32 | (Optional.) Number of retry attempts on version conflict. |


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

### `BulkResponseBody`field

The `BulkResponse` message provides a summary and per-item result of a bulk operation.

If any operation fails, the response's `errors` field will be true.

If true, you can iterate over the individual `Item` actions for more detailed information.


| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| errors | bool | (Optional.) Indicates whether any of the operations in the bulk request failed. |
| items | repeated Item | (Optional.) The result of each operation in the bulk request, in the order they were submitted. |
| took | int64 | (Optional.) How long, in milliseconds, it took to process the bulk request. |
| ingest_took | int64| (Optional.) How long, in milliseconds, it took to process documents through an ingest pipeline |


### `Item` field
Each item in the response corresponds to a single operation in the request. Only one of the following fields will be provided, for each operation.

| Field | Protobuf Type | Description |
| ----- | ----- | ----- |
| create | ResponseItem | (Optional.) Result of the `CreateOperation`. |
| delete | ResponseItem | (Optional.) Result of the `DeleteOperation`.   |
| index | ResponseItem | (Optional.) Result of the `IndexOperation`.  |
| update | ResponseItem | (Optional.) Result of the `UpdateOperation`.  |


### `ResponseItem` field

Each item in the response corresponds to a single operation in the request.

| Field | Protobuf Type | Description |
|------------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| type | string | (Optional.) The document type. |
| id | ResponseItem.Id | (Optional.) The document ID associated with the operation. Can be null. |
| index | string | (Optional.) Name of the index associated with the operation. If a data stream was targeted, this is the backing index. |
| status | int32 | (Optional.) HTTP status code returned for the operation. *(Note: may be replaced with gRPC codes in future.)* |
| error | ErrorCause | (Optional.) Contains additional information about a failed operation. |
| primary_term | int64 | (Optional.) The primary term assigned to the document. |
| result | string | (Optional.) Result of the operation. Possible values: created, deleted, updated. |
| seq_no | int64 | (Optional.) Sequence number assigned to the document to maintain version order. |
| shards | ShardInfo | (Optional.) Shard information for the operation (only on success). |
| version | int64 | (Optional.) Document version (only returned for successful actions). |
| forced_refresh | bool | (Optional.) If true, immediate visibility of the document is required. |
| get | InlineGetDictUserDefined | (Optional.) Contains the document source returned from an inline get if requested. |
 
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
