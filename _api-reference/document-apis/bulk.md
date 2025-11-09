---
layout: default
title: Bulk
parent: Document APIs
nav_order: 20
redirect_from:
 - /opensearch/rest-api/document-apis/bulk/
---

# Bulk API
**Introduced 1.0**
{: .label .label-purple }

The bulk operation lets you add, update, or delete multiple documents in a single request. Compared to individual OpenSearch indexing requests, the bulk operation has significant performance benefits. Whenever practical, we recommend batching indexing operations into bulk requests.


Beginning in OpenSearch 2.9, when indexing documents using the bulk operation, the document `_id` must be 512 bytes or less in size.
{: .note}



## Endpoints

```json
POST _bulk
POST <index>/_bulk
```

Specifying the index in the path means you don't need to include it in the [request body]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/#request-body).

OpenSearch also accepts PUT requests to the `_bulk` path, but we highly recommend using POST. The accepted usage of PUT---adding or replacing a single resource at a given path---doesn't make sense for bulk requests.
{: .note }


## Query parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
pipeline | String | The pipeline ID for preprocessing documents.
refresh | Enum | Whether to refresh the affected shards after performing the indexing operations. Default is `false`. `true` causes the changes show up in search results immediately but degrades cluster performance. `wait_for` waits for a refresh. Requests take longer to return, but cluster performance isn't degraded.
require_alias | Boolean | Set to `true` to require that all actions target an index alias rather than an index. Default is `false`.
routing | String | Routes the request to the specified shard.
timeout | Time | How long to wait for the request to return. Default is `1m`.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the bulk request. Default is `1` (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have 2 replicas distributed across 2 additional nodes in order for the request to succeed.


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

### Create

  Creates a document if it doesn't already exist and returns an error otherwise. The next line must include a JSON document:

  ```json
  { "create": { "_index": "movies", "_id": "tt1392214" } }
  { "title": "Prisoners", "year": 2013 }
  ```

### Delete

This action deletes a document if it exists. If the document doesn't exist, OpenSearch doesn't return an error but instead returns `not_found` under `result`. Delete actions don't require documents on the next line:

```json
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
```

### Index

Index actions create a document if it doesn't yet exist and replace the document if it already exists. The next line must include a JSON document:

```json
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013}
```

### Update

By default, this action updates existing documents and returns an error if the document doesn't exist. The next line must include a full or partial JSON document, depending on how much of the document you want to update:

```json
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
```

### Upsert

To upsert a document, either:
1. Specify the document in the `doc` field, and set `doc_as_update=true`. If the document exists, it is updated with the contents of the `doc` field; if it does not exist, a new document is indexed with the parameters specified in the `doc` field.

```json
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" }, "doc_as_upsert": true }
```
2. Or specify the document to be updated (if the document exists) in the `doc` field , and the document to be upserted (if the document doesn't exist) in the `upsert` field, and leave `doc_as_update` as `false`.
This is best used in the scenario where you only want to update only specific fields when a document exists, but insert a complete document when it doesn't exist.

```
{ "update": { "_index": "products", "_id": "widget-123" } }
{ "doc": { "stock": 75, "updated_at": "2025-01-15T10:30:00Z" }, "upsert": { "name": "Widget", "price": 39.99, "stock": 100, "created_at": "2025-01-15T10:30:00Z" }}
```

### Script

You can specify a script for more complex document updates by defining the script with the `source` or `id` from a document:

```json
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "script" : { "source": "ctx._source.title = \"World War Z\"" } }
```

### Scripted upsert

You can use a script to update or upsert a document.

1. To upsert a document using a script, set `scripted_upsert` to `true`. This ensures that the script runs whether or not the document exists. If the document does not exist, the script initializes its content from scratch.

```json
POST _bulk
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "script": { "source": "ctx._source.title = params.title; ctx._source.genre = params.genre;", "params": { "title": "World War Z", "genre": "Action" } }, "scripted_upsert": true }
```

This operation creates a new document if one with ID `tt0816711` does not exist, using the logic in the script. If the document does exist, the same script is applied to update its fields.

You can aso use a script only to update a document.

2. To update a document (if the document exists) using a script, but to upsert a document (if the document document exist, set both the `script` and `upsert` fields. `script` will be used if the document exists and `upsert` will be used if it doesn't.

```
POST _bulk
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "script": { "source": "ctx._source.title = params.title; ctx._source.genre = params.genre;", "params": { "title": "World War Z", "genre": "Action" } }, "upsert": { "title": "World War Z", "genre": "Action", "author": "Tom Smith" } }
`
```

## Example request

<!-- spec_insert_start
component: example_code
rest: POST /_bulk
body: |
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
-->
{% capture step1_rest %}
POST /_bulk
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  body = '''
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

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
