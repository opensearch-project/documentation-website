---
layout: default
title: Index document
parent: Document APIs
nav_order: 1
redirect_from: 
 - /opensearch/rest-api/document-apis/index-document/
canonical_url: https://docs.opensearch.org/latest/api-reference/document-apis/index-document/
---

# Index document
**Introduced 1.0**
{: .label .label-purple}

You can use the `Index document` operation to add a single document to your index.

## Example

```json
PUT sample-index/_doc/1
{
  "Description": "To be or not to be, that is the question."
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
PUT <index>/_doc/<_id>
POST <index>/_doc

PUT <index>/_create/<_id>
POST <index>/_create/<_id>
```

- PUT adds or updates documents in the index with a specified ID. Used for controlled document creation or updates.
- POST adds documents with auto-generated IDs to the index. Useful for adding new documents without specifying IDs.
- `_create` is a type identifier indicating that document creation should only occur if the document with the specified ID doesn't already exist.
- `<index>` represents the name of the index to which the document will be added.
- `<_id>` represents the unique identifier of the document.

## Adding a sample index 

Sample data can be added to the index with curl commands in the terminal or through the API.

To test the Document APIs, add a document by following these steps:
1. Open OpenSearch Dashboards.
2. Navigate to the actions menu. 
3. In the **Management** section, choose **Dev Tools**.
4. Enter a command, and then select the green triangle play button to send the request. The following are some example commands.

### Create a sample-index
```json
PUT /sample-index
```
{% include copy-curl.html %}

### Example PUT request

```json
PUT /sample_index/_doc/1
{
  "name": "Example",
  "price": 29.99,
  "description": "To be or not to be, that is the question"
}
```
{% include copy-curl.html %}

### Example POST request

```json
POST /sample_index/_doc
{
  "name": "Another Example",
  "price": 19.99,
  "description": "We are such stuff as dreams are made on"
}

```
{% include copy-curl.html %}

## URL parameters

In your request, you must specify the index you want to add your document to. If the index doesn't already exist, OpenSearch automatically creates the index and adds in your document. All other URL parameters are optional.

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
&lt;index&gt; | String | Name of the index. | Yes
&lt;_id&gt; | String | A unique identifier to attach to the document. To automatically generate an ID, use `POST <target>/doc` in your request instead of PUT. | No
if_seq_no | Integer | Only perform the index operation if the document has the specified sequence number. | No
if_primary_term | Integer | Only perform the index operation if the document has the specified primary term.| No
op_type | Enum | Specifies the type of operation to complete with the document. Valid values are `create` (index a document only if it doesn't exist) and `index`. If a document ID is included in the request, then the default is `index`. Otherwise, the default is `create`. | No
pipeline | String | Route the index operation to a certain pipeline. | No
routing | String | value used to assign the index operation to a specific shard. | No
refresh | Enum | If true, OpenSearch refreshes shards to make the operation visible to searching. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is false. | No
timeout | Time | How long to wait for a response from the cluster. Default is `1m`. | No
version | Integer | The document's version number. | No
version_type | Enum | Assigns a specific type to the document. Valid options are `external` (retrieve the document if the specified version number is greater than the document's current version) and `external_gte` (retrieve the document if the specified version number is greater than or equal to the document's current version). For example, to index version 3 of a document, use `/_doc/1?version=3&version_type=external`. | No
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed. | No
require_alias | Boolean | Specifies whether the target index must be an index alias. Default is false. | No

## Request body

Your request body must contain the information you want to index.

```json
{
  "Description": "This is just a sample document"
}
```

## Response
```json
{
  "_index": "sample-index",
  "_id": "1",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```

## Response body fields

Field | Description
:--- | :---
_index | The name of the index.
_id | The document's ID.
_version | The document's version.
result | The result of the index operation.
_shards | Detailed information about the cluster's shards.
total | The total number of shards.
successful | The number of shards OpenSearch successfully added the document to.
failed | The number of shards OpenSearch failed to add the document to.
_seq_no | The sequence number assigned when the document was indexed.
_primary_term | The primary term assigned when the document was indexed.
