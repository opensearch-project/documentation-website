---
layout: default
title: Get document
parent: Document APIs
nav_order: 5
redirect_from: 
 - /opensearch/rest-api/document-apis/get-documents/
---

# Get document
**Introduced 1.0**
{: .label .label-purple }

After adding a JSON document to your index, you can use the get document API operation to retrieve the document's information and data.

## Example

```json
GET sample-index1/_doc/1
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET <index>/_doc/<_id>
HEAD <index>/_doc/<_id>
```
```
GET <index>/_source/<_id>
HEAD <index>/_source/<_id>
```

## URL parameters

All get document URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
preference | String | Specifies a preference of which shard to retrieve results from. Available options are `_local`, which tells the operation to retrieve results from a locally allocated shard replica, and a custom string value assigned to a specific shard replica. By default, OpenSearch executes get document operations on random shards.
realtime | Boolean | Specifies whether the operation should run in realtime. If false, the operation waits for the index to refresh to analyze the source to retrieve data, which makes the operation near-realtime. Default is true.
refresh | Boolean | If true, OpenSearch refreshes shards to make the get operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`.
routing | String | A value used to route the operation to a specific shard.
stored_fields | Boolean | Whether the get operation should retrieve fields stored in the index. Default is false.
_source | String | Whether to include the `_source` field in the response body. Default is true.
_source_excludes | String | A comma-separated list of source fields to exclude in the query response.
_source_includes | String | A comma-separated list of source fields to include in the query response.
version | Integer | The version of the document to return, which must match the current version of the document.
version_type | Enum | Retrieves a specifically typed document. Available options are `external` (retrieve the document if the specified version number is greater than the document's current version) and `external_gte` (retrieve the document if the specified version number is greater than or equal to the document's current version). For example, to retrieve version 3 of a document, use `/_doc/1?version=3&version_type=external`.


## Response
```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 9,
  "found": true,
  "_source": {
    "text": "This is just some sample text."
  }
}
```

## Response body fields

Field | Description
:--- | :---
_index | The name of the index.
_id | The document's ID.
_version | The document's version number. Updated whenever the document changes.
_seq_no | The sequence number assigned when the document is indexed.
primary_term | The primary term assigned when the document is indexed.
found | Whether the document exists.
_routing | The shard that the document is routed to. If the document is not routed to a particular shard, this field is omitted.
_source | Contains the document's data if `found` is true. If `_source` is set to false or `stored_fields` is set to true in the URL parameters, this field is omitted.
_fields | Contains the document's data that's stored in the index. Only returned if both `stored_fields` and `found` are true.
