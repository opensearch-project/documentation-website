---
layout: default
title: Delete document
parent: Document APIs
nav_order: 15
redirect_from: 
 - /opensearch/rest-api/document-apis/delete-document/
---

# Delete document
**Introduced 1.0**
{: .label .label-purple }

If you no longer need a document in your index, you can use the delete document API operation to delete it.

## Example

```
DELETE /sample-index1/_doc/1
```
{% include copy-curl.html %}

## Path and HTTP methods

```
DELETE /<index>/_doc/<_id>
```

## URL parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
&lt;index&gt; | String | The index to delete from. | Yes
&lt;_id&gt; | String | The ID of the document to delete. | Yes
if_seq_no | Integer | Only perform the delete operation if the document's version number matches the specified number. | No
if_primary_term | Integer | Only perform the delete operation if the document has the specified primary term. | No
refresh | Enum | If true, OpenSearch refreshes shards to make the delete operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`. | No
routing | String | Value used to route the operation to a specific shard. | No
timeout | Time | How long to wait for a response from the cluster.	Default is `1m`. | No
version | Integer | The version of the document to delete, which must match the last updated version of the document. | No
version_type | Enum | Retrieves a specifically typed document. Available options are `external` (retrieve the document if the specified version number is greater than the document's current version) and `external_gte` (retrieve the document if the specified version number is greater than or equal to the document's current version). For example, to delete version 3 of a document, use `/_doc/1?version=3&version_type=external`. | No
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the delete request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed. | No


## Response
```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_version": 2,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 15
}
```

## Response body fields

Field | Description
:--- | :---
_index | The name of the index.
_id | The document's ID.
_version | The document's version.
_result | The result of the delete operation.
_shards | Detailed information about the cluster's shards.
total | The total number of shards.
successful | The number of shards OpenSearch successfully deleted the document from.
failed | The number of shards OpenSearch failed to delete the document from.
_seq_no | The sequence number assigned when the document was indexed.
_primary_term | The primary term assigned when the document was indexed.
