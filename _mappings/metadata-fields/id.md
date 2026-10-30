---
layout: default
title: ID
parent: Metadata fields
nav_order: 20
redirect_from:
  - /field-types/metadata-fields/id/
---

# ID metadata field

Each document in OpenSearch has a unique `_id` field. This field is indexed, allowing you to retrieve documents using the [Get Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/get-documents/) or the [`ids` query]({{site.url}}{{site.baseurl}}/query-dsl/term/ids/).

You set the `_id` in the request path when you [index a document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/), for example, `PUT test-index1/_doc/1`. If you do not provide an `_id` value, OpenSearch generates one.

An `_id` can be at most 512 bytes long in UTF-8 encoding. OpenSearch rejects requests that specify a longer ID. Characters outside the ASCII range take more than 1 byte, so an ID containing such characters reaches the limit with fewer than 512 characters.

## Querying document IDs

You can search the `_id` field using the `term`, `terms`, `match`, `query_string`, and `simple_query_string` queries. The field must match the full ID, so the `prefix`, `wildcard`, and `range` queries are not supported.

The following example requests create an index named `test-index1` and add two documents with different `_id` values.

The first request adds a document with an `_id` of `1`:

```json
PUT test-index1/_doc/1
{
  "text": "Document with ID 1"
}
```
{% include copy-curl.html %}

The second request adds a document with an `_id` of `2` and refreshes the index so that both documents are immediately searchable:

```json
PUT test-index1/_doc/2?refresh=true
{
  "text": "Document with ID 2"
}
```
{% include copy-curl.html %}

You can then query the documents using the `_id` field, as shown in the following example request:

```json
GET test-index1/_search
{
  "query": {
    "terms": {
      "_id": ["1", "2"]
    }
  }
}
```
{% include copy-curl.html %}

The response returns both documents with `_id` values of `1` and `2`:

```json
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "test-index1",
        "_id": "1",
        "_score": 1,
        "_source": {
          "text": "Document with ID 1"
        }
      },
      {
        "_index": "test-index1",
        "_id": "2",
        "_score": 1,
        "_source": {
          "text": "Document with ID 2"
        }
      }
    ]
  }
}
```

## Sorting and aggregating on document IDs

The `_id` field does not store doc values. To sort, aggregate, or access `_id` in a script, OpenSearch loads all IDs in the shard into memory, which can use a large amount of heap on indexes containing many documents. This access is deprecated, and OpenSearch writes a warning to the deprecation log when it occurs. The `indices.id_field_data.enabled` cluster setting controls whether it is allowed. If you set it to `false`, OpenSearch rejects requests that sort or aggregate on `_id`. For more information, see [Cluster settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-gateway-and-indexes-settings).

To sort or aggregate on document IDs, store the ID in a separate `keyword` field in the document body as well. Fields of type `keyword` store doc values by default.
