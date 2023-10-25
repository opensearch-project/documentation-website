---
layout: default
title: Bulk
parent: Document APIs
nav_order: 20
redirect_from:
 - /opensearch/rest-api/document-apis/bulk/
---

# Bulk
**Introduced 1.0**
{: .label .label-purple }

The bulk operation lets you add, update, or delete multiple documents in a single request. Compared to individual OpenSearch indexing requests, the bulk operation has significant performance benefits. Whenever practical, we recommend batching indexing operations into bulk requests.


Beginning in OpenSearch 2.9, when indexing documents using the bulk operation, the document `_id` must be 512 bytes or less in size.
{: .note}

## Example

```json
POST _bulk
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }

```
{% include copy-curl.html %}


## Path and HTTP methods

```
POST _bulk
POST <index>/_bulk
```

Specifying the index in the path means you don't need to include it in the [request body]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/#request-body).

OpenSearch also accepts PUT requests to the `_bulk` path, but we highly recommend using POST. The accepted usage of PUT---adding or replacing a single resource at a given path---doesn't make sense for bulk requests.
{: .note }


## URL parameters

All bulk URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
pipeline | String | The pipeline ID for preprocessing documents.
refresh | Enum | Whether to refresh the affected shards after performing the indexing operations. Default is `false`. `true` makes the changes show up in search results immediately, but hurts cluster performance. `wait_for` waits for a refresh. Requests take longer to return, but cluster performance doesn't suffer.
require_alias | Boolean | Set to `true` to require that all actions target an index alias rather than an index. Default is `false`.
routing | String | Routes the request to the specified shard.
timeout | Time | How long to wait for the request to return. Default `1m`.
type | String | (Deprecated) The default document type for documents that don't specify a type. Default is `_doc`. We highly recommend ignoring this parameter and using a type of `_doc` for all indexes.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the bulk request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
{% comment %}_source | List | asdf
_source_excludes | list | asdf
_source_includes | list | asdf{% endcomment %}


## Request body

The bulk request body follows this pattern:

```
Action and metadata\n
Optional document\n
Action and metadata\n
Optional document\n

```

The optional JSON document doesn't need to be minified---spaces are fine---but it does need to be on a single line. OpenSearch uses newline characters to parse bulk requests and requires that the request body end with a newline character.

All actions support the same metadata: `_index`, `_id`, and `_require_alias`. If you don't provide an ID, OpenSearch generates one automatically, which can make it challenging to update the document at a later time.

- Create

  Creates a document if it doesn't already exist and returns an error otherwise. The next line must include a JSON document.

  ```json
  { "create": { "_index": "movies", "_id": "tt1392214" } }
  { "title": "Prisoners", "year": 2013 }
  ```

- Delete

  This action deletes a document if it exists. If the document doesn't exist, OpenSearch doesn't return an error, but instead returns `not_found` under `result`. Delete actions don't require documents on the next line.

  ```json
  { "delete": { "_index": "movies", "_id": "tt2229499" } }
  ```

- Index

  Index actions create a document if it doesn't yet exist and replace the document if it already exists. The next line must include a JSON document.

  ```json
  { "index": { "_index": "movies", "_id": "tt1979320" } }
  { "title": "Rush", "year": 2013}
  ```

- Update

  This action updates existing documents and returns an error if the document doesn't exist. The next line must include a full or partial JSON document, depending on how much of the document you want to update.

  ```json
  { "update": { "_index": "movies", "_id": "tt0816711" } }
  { "doc" : { "title": "World War Z" } }
  ```

  It can also include a script or upsert for more complex document updates.

  - Script
  ```json
  { "update": { "_index": "movies", "_id": "tt0816711" } }
  { "script" : { "source": "ctx._source.title = \"World War Z\"" } }
  ```

  - Upsert
  ```json
  { "update": { "_index": "movies", "_id": "tt0816711" } }
  { "doc" : { "title": "World War Z" }, "doc_as_upsert": true }
  ```

## Response

In the response, pay particular attention to the top-level `errors` boolean. If true, you can iterate over the individual actions for more detailed information.

```json
{
  "took": 11,
  "errors": true,
  "items": [
    {
      "index": {
        "_index": "movies",
        "_id": "tt1979320",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 1,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "create": {
        "_index": "movies",
        "_id": "tt1392214",
        "status": 409,
        "error": {
          "type": "version_conflict_engine_exception",
          "reason": "[tt1392214]: version conflict, document already exists (current version [1])",
          "index": "movies",
          "shard": "0",
          "index_uuid": "yhizhusbSWmP0G7OJnmcLg"
        }
      }
    },
    {
      "update": {
        "_index": "movies",
        "_id": "tt0816711",
        "status": 404,
        "error": {
          "type": "document_missing_exception",
          "reason": "[_doc][tt0816711]: document missing",
          "index": "movies",
          "shard": "0",
          "index_uuid": "yhizhusbSWmP0G7OJnmcLg"
        }
      }
    }
  ]
}
```
