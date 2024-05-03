---
layout: default
title: Multi-get document
parent: Document APIs
nav_order: 30
redirect_from: 
 - /opensearch/rest-api/document-apis/multi-get/
---

# Multi-get documents
**Introduced 1.0**
{: .label .label-purple }

The multi-get operation allows you to run multiple GET operations in one request, so you can get back all documents that match your criteria.

## Path and HTTP methods

```
GET _mget
GET <index>/_mget
POST _mget
POST <index>/_mget
```

## URL parameters

All multi-get URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :--- | :---
&lt;index&gt; | String | Name of the index to retrieve documents from.
preference | String | Specifies the nodes or shards OpenSearch should execute the multi-get operation on. Default is random.
realtime | Boolean | Specifies whether the operation should run in realtime. If false, the operation waits for the index to refresh to analyze the source to retrieve data, which makes the operation near-realtime. Default is `true`.
refresh | Boolean | If true, OpenSearch refreshes shards to make the multi-get operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`.
routing | String | Value used to route the multi-get operation to a specific shard.
stored_fields | Boolean | Specifies whether OpenSearch should retrieve documents fields from the index instead of the document's `_source`. Default is `false`.
_source | String | Whether to include the `_source` field in the query response. Default is `true`.
_source_excludes | String | A comma-separated list of source fields to exclude in the query response.
_source_includes | String | A comma-separated list of source fields to include in the query response.

## Request body

If you don't specify an index in your request's URL, you must specify your target indexes and the relevant document IDs in the request body. Other fields are optional.

Field | Type | Description | Required
:--- | :--- | :--- | :---
docs | Array | The documents you want to retrieve data from. Can contain the attributes: `_id`, `_index`, `_routing`, `_source`, and `_stored_fields`. If you specify an index in the URL, you can omit this field and add IDs of the documents to retrieve. | Yes if an index is not specified in the URL
_id | String | The ID of the document. | Yes if `docs` is specified in the request body
_index | String | Name of the index. | Yes if an index is not specified in the URL
_routing | String | The value of the shard that has the document. | Yes if a routing value was used when indexing the document
_source | Object | Specifies whether to return the `_source` field from an index (boolean), whether to return specific fields (array), or whether to include or exclude certain fields. | No
_source.includes | Array | Specifies which fields to include in the query response. For example, `"_source": { "include": ["Title"] }` retrieves `Title` from the index. | No
_source.excludes | Array | Specifies which fields to exclude in the query response. For example, `"_source": { "exclude": ["Director"] }` excludes `Director` from the query response. | No
ids | Array | IDs of the documents to retrieve. Only allowed when an index is specified in the URL. | No


#### Example without specifying index in URL

```json
GET _mget
{
  "docs": [
  {
    "_index": "sample-index1",
    "_id": "1"
  },
  {
    "_index": "sample-index2",
    "_id": "1",
    "_source": {
      "include": ["Length"]
    }
  }
  ]
}
```
{% include copy-curl.html %}

#### Example of specifying index in URL

```json
GET sample-index1/_mget
{
  "docs": [
    {
      "_id": "1",
      "_source": false
    },
    {
      "_id": "2",
      "_source": [ "Director", "Title" ]
    }
  ]
}
```
{% include copy-curl.html %}

#### Example Response 
```json
{
  "docs": [
    {
      "_index": "sample-index1",
      "_id": "1",
      "_version": 4,
      "_seq_no": 5,
      "_primary_term": 19,
      "found": true,
      "_source": {
        "Title": "Batman Begins",
        "Director": "Christopher Nolan"
      }
    },
    {
      "_index": "sample-index2",
      "_id": "1",
      "_version": 1,
      "_seq_no": 6,
      "_primary_term": 19,
      "found": true,
      "_source": {
        "Title": "The Dark Knight",
        "Director": "Christopher Nolan"
      }
    }
  ]
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
