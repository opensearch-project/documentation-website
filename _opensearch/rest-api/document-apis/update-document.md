---
layout: default
title: Update document
parent: Document APIs
grand_parent: REST API reference
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/api-reference/document-apis/update-document/
---

# Update document
Introduced 1.0
{: .label .label-purple }

If you need to update a document's fields in your index, you can use the update document API operation. You can do so by specifying the new data you want in your index or by including a script in your request body, which OpenSearch runs to update the document.

## Example

```json
POST /sample-index1/_update/1
{
  "doc": {
    "first_name" : "Bruce",
    "last_name" : "Wayne"
  }
}
```

## Script example

```json
POST /test-index1/_update/1
{
  "script" : {
    "source": "ctx._source.secret_identity = \"Batman\""
  }
}
```

## Path and HTTP methods

```
POST /<index>/_update/<_id>
```

## URL parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
&lt;index&gt; | String | Name of the index. | Yes
&lt;_id&gt; | String | The ID of the document to update. | Yes
if_seq_no | Integer | Only perform the delete operation if the document's version number matches the specified number. | No
if_primary_term | Integer | Perform the update operation if the document has the specified primary term. | No
lang | String | Language of the script. Default is `painless`. | No
require_alias | Boolean | Specifies whether the destination must be an index alias. Default is false. | No
refresh | Enum | If true, OpenSearch refreshes shards to make the operation visible to searching. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`. | No
retry_on_conflict | Integer | The amount of times OpenSearch should retry the operation if there's a document conflict. Default is 0. | No
routing | String | Value to route the update operation to a specific shard. | No
_source | List | Whether to include the `_source` field in the response body. Default is true. | No
_source_excludes | List | A comma-separated list of source fields to exclude in the query response. | No
_source_includes | List | A comma-separated list of source fields to include in the query response. | No
timeout | Time | How long to wait for a response from the cluster. | No
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the update request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed. | No

## Request body

Your request body must contain the information you want to update your document with. If you just want to replace certain fields in your document, your request body must include a `doc` object, which has the fields you want to update.

```json
{
  "doc": {
    "first_name": "Thomas",
    "last_name": "Wayne"
    }
}
```

You can also use a script to tell OpenSearch how to update your document.

```json
{
  "script" : {
    "source": "ctx._source.oldValue += params.newValue",
    "lang": "painless",
    "params" : {
      "newValue" : 10
    }
  }
}
```

## Response
```json
{
  "_index": "sample-index1",
  "_type": "_doc",
  "_id": "1",
  "_version": 3,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 4,
  "_primary_term": 17
}
```

## Response body fields

Field | Description
:--- | :---
_index | The name of the index.
_type | The document's type. OpenSearch only supports one type, which is `_doc`.
_id | The document's ID.
_version | The document's version.
_result | The result of the delete operation.
_shards | Detailed information about the cluster's shards.
total | The total number of shards.
successful | The number of shards OpenSearch succssfully deleted the document from.
failed | The number of shards OpenSearch failed to delete the document from.
_seq_no | The sequence number assigned when the document was indexed.
_primary_term | The primary term assigned when the document was indexed.
