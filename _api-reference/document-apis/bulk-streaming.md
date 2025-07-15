---
layout: default
title: Streaming bulk
parent: Document APIs
nav_order: 25
redirect_from:
 - /opensearch/rest-api/document-apis/bulk/streaming/
---

# Streaming bulk
**Introduced 2.17.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/9065).    
{: .warning}

The streaming bulk operation lets you add, update, or delete multiple documents by streaming the request and getting the results as a streaming response. In comparison to the traditional [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/), streaming ingestion eliminates the need to estimate the batch size (which is affected by the cluster operational state at any given time) and naturally applies backpressure between many clients and the cluster. The streaming works over HTTP/2 or HTTP/1.1 (using chunked transfer encoding), depending on the capabilities of the clients and the cluster.

The default HTTP transport method does not support streaming. You must install the [`transport-reactor-netty4`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/#selecting-the-transport) HTTP transport plugin and use it as the default HTTP transport layer. Both the `transport-reactor-netty4` plugin and the Streaming Bulk API are experimental.
{: .note}

## Endpoints

```json
POST _bulk/stream
POST <index>/_bulk/stream
```

If you specify the index in the path, then you don't need to include it in the [request body chunks]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/#request-body).

OpenSearch also accepts PUT requests to the `_bulk/stream` path, but we highly recommend using POST. The accepted usage of PUT---adding or replacing a single resource on a given path---doesn't make sense for streaming bulk requests.
{: .note }


## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`pipeline` | String | The pipeline ID for preprocessing documents.
`refresh` | Enum | Whether to refresh the affected shards after performing the indexing operations. Default is `false`. `true` causes the changes show up in search results immediately but degrades cluster performance. `wait_for` waits for a refresh. Requests take longer to return, but cluster performance isn't degraded.
`require_alias` | Boolean | Set to `true` to require that all actions target an index alias rather than an index. Default is `false`.
`routing` | String | Routes the request to the specified shard.
`timeout` | Time | How long to wait for the request to return. Default is `1m`.
`type` | String | (Deprecated) The default document type for documents that don't specify a type. Default is `_doc`. We highly recommend ignoring this parameter and using the `_doc` type for all indexes.
`wait_for_active_shards` | String | Specifies the number of active shards that must be available before OpenSearch processes the bulk request. Default is `1` (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have 2 replicas distributed across 2 additional nodes in order for the request to succeed.
`batch_interval` | Time | Specifies for how long bulk operations should be accumulated into a batch before sending the batch to data nodes.
`batch_size` | Time | Specifies how many bulk operations should be accumulated into a batch before sending the batch to data nodes. Default is `1`.
{% comment %}_source | List | asdf
`_source_excludes` | List | asdf
`_source_includes` | List | asdf{% endcomment %}

## Request body fields

The Streaming Bulk API request body is fully compatible with the [Bulk API request body]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/#request-body), where each bulk operation (create/index/update/delete) is sent as a separate chunk.  

## Example request

```json
curl -X POST "http://localhost:9200/_bulk/stream" -H "Transfer-Encoding: chunked" -H "Content-Type: application/json" -d'
{ "delete": { "_index": "movies", "_id": "tt2229499" } }
{ "index": { "_index": "movies", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "movies", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "movies", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }
'
```
{% include copy.html %}

## Example response

Depending on the batch settings, each streamed response chunk may report the results of one or many (batch) bulk operations. For example, for the preceding request with no batching (default), the streaming response may appear as follows:

```json
{"took": 11, "errors": false, "items": [ { "index": {"_index": "movies", "_id": "tt1979320", "_version": 1, "result": "created", "_shards": { "total": 2 "successful": 1, "failed": 0 }, "_seq_no": 1, "_primary_term": 1, "status": 201 } } ] }
{"took": 2, "errors": true, "items": [ { "create": { "_index": "movies", "_id": "tt1392214", "status": 409, "error": { "type": "version_conflict_engine_exception", "reason": "[tt1392214]: version conflict, document already exists (current version [1])", "index": "movies", "shard": "0", "index_uuid": "yhizhusbSWmP0G7OJnmcLg" } } } ] }
{"took": 4, "errors": true, "items": [ { "update": { "_index": "movies", "_id": "tt0816711", "status": 404, "error": { "type": "document_missing_exception", "reason": "[_doc][tt0816711]: document missing", "index": "movies", "shard": "0", "index_uuid": "yhizhusbSWmP0G7OJnmcLg" } } } ] }
```
