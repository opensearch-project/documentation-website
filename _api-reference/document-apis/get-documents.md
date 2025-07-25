---
layout: default
title: Get document
parent: Document APIs
nav_order: 5
redirect_from:
 - /opensearch/rest-api/document-apis/get-documents/
canonical_url: https://docs.opensearch.org/latest/api-reference/document-apis/get-documents/
---

# Get document
**Introduced 1.0**
{: .label .label-purple }

After adding a JSON document to your index, you can use the Get Document API operation to retrieve the document's information and data.


## Endpoints

Use the GET method to retrieve a document and its source or stored fields from a particular index. Use the HEAD method to verify that a document exists:

```json
GET <index>/_doc/<_id>
HEAD <index>/_doc/<_id>
```

Use `_source` to retrieve the document source or to verify that it exists:

```json
GET <index>/_source/<_id>
HEAD <index>/_source/<_id>
```

## Path parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
&lt;index&gt; | String | The index to retrieve the document from. | Yes
&lt;_id&gt; | String | The ID of the document to retrieve. | Yes

## Query parameters

All query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
preference | String | Specifies a preference of which shard to retrieve results from. Available options are `_local`, which tells the operation to retrieve results from a locally allocated shard replica, and a custom string value assigned to a specific shard replica. By default, OpenSearch executes get document operations on random shards.
realtime | Boolean | Specifies whether the operation should run in realtime. If false, the operation waits for the index to refresh to analyze the source to retrieve data, which makes the operation near-realtime. Default is `true`.
refresh | Boolean | If true, OpenSearch refreshes shards to make the get operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`.
routing | String | A value used to route the operation to a specific shard.
stored_fields | List | A comma-separated list of fields stored in the index that should be retrieved. Default is no stored fields will be returned.
_source | String | Whether to include the `_source` field in the response body. Default is `true`.
_source_excludes | String | A comma-separated list of source fields to exclude in the query response.
_source_includes | String | A comma-separated list of source fields to include in the query response.
version | Integer | The version of the document to return, which must match the current version of the document.
version_type | Enum | Retrieves a specifically typed document. Available options are `external` (retrieve the document if the specified version number is greater than the document's current version) and `external_gte` (retrieve the document if the specified version number is greater than or equal to the document's current version). For example, to retrieve version 3 of a document, use `/_doc/1?version=3&version_type=external`.

### Real time

The OpenSearch Get Document API operates in real time by default, which means that it retrieves the latest version of the document regardless of the index's refresh rate or the rate at which new data becomes searchable. However, if you request stored fields (using the `stored_fields` parameter) for a document that has been updated but not yet refreshed, then the Get Document API parses and analyzes the document's source to extract those stored fields.

To disable the real-time behavior and retrieve the document based on the last refreshed state of the index, set the `realtime` parameter to `false`.

### Source filtering

By default, the Get Document API returns the entire contents of the `_source` field for the requested document. However, you can choose to exclude the `_source` field from the response by using the `_source` URL parameter and setting it to `false`, as shown in the following example:

```json
GET test-index/_doc/0?_source=false
```

#### `source` includes and excludes

If you only want to retrieve specific fields from the source, use the `_source_includes` or `_source_excludes` parameters to include or exclude particular fields, respectively. This can be beneficial for large documents because retrieving only the required fields can reduce network overhead.

Both parameters accept a comma-separated list of fields and wildcard expressions, as shown in the following example, where any `_source` that contains `*.play` is included in the response but sources with the field `entities` are excluded:

```json
GET test-index/_doc/0?_source_includes=*.play&_source_excludes=entities
```

#### Shorter notation

If you only want to include certain fields and don't need to exclude any, you can use a shorter notation by specifying the desired fields directly in the `_source` parameter:

```json
GET test-index/_doc/0?_source=*.id
```

### Routing

When indexing documents in OpenSearch, you can specify a `routing` value to control the shard assignments for documents. If routing was used during indexing, you must provide the same routing value when retrieving the document using the Get Document API, as shown in the following example:

```json
GET test-index/_doc/1?routing=user1
```

This request retrieves the document with the ID `1`, but it uses the routing value "user1" to determine on which shard the document is stored. If the correct routing value is not specified, the Get Document API is not able to locate and fetch the requested document.

### Preference

The Get Document API allows you to control which shard replica handles the request. By default, the operation is randomly distributed across the available shard replicas.

However, you can specify a preference to influence the replica selection. The preference can be set to one of the following values:

- `_local`: The operation attempts to execute on a locally allocated shard replica, if possible. This can improve performance by reducing network overhead.
- Custom (string) value: Specifying a custom string value ensures that requests with the same value are routed to the same set of shards. This consistency can be beneficial when managing shards in different refresh states because it prevents "jumping values" that may occur when hitting shards with varying data visibility. A common practice is to use a web session ID or a user name as the custom value.


### Refresh

Set the `refresh` parameter to `true` to force a refresh of the relevant shard before running the Get Document API operation. This ensures that the most recent data changes are made searchable and visible to the API. However, a refresh should be performed judiciously because it can potentially impose a heavy load on the system and slow down indexing performance. It's recommended to carefully evaluate the trade-off between data freshness and system load before enabling the `refresh` parameter.

### Distributed

When running the Get Document API, OpenSearch first calculates a hash value based on the document ID, which determines the specific ID of the shard on which the document resides. The operation is then redirected to one of the replicas (including the primary shard and its replica shards) in that shard ID group, and the result is returned from that replica.

A higher number of shard replicas improves the scalability and performance of GET operations because the load can be distributed across multiple replica shards. This means that as the number of replicas increases, you can achieve better scaling and throughput for Get Document API requests.

### Versioning support

Use the `version` parameter to retrieve a document only if its current version matches the specified version number. This can be useful for ensuring data consistency and preventing conflicts when working with versioned documents.

Internally, when a document is updated in OpenSearch, the original version is marked as deleted, and a new version of the document is added. However, the original version doesn't immediately disappear from the system. While you won't be able to access it through the Get Document API, OpenSearch manages the cleanup of deleted document versions in the background as you continue indexing new data.

## Example request

The following example request retrieves information about a document named `1`:

```json
GET sample-index1/_doc/1
```
{% include copy-curl.html %}


## Example response
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
_source | Contains the document's data if `found` is true. If `_source` is set to false or `stored_fields` is set to true in the parameters, this field is omitted.
_fields | Contains the document's data that's stored in the index. Only returned if both `stored_fields` and `found` are true.
