---
layout: default
title: ID
nav_order: 20
parent: Metadata fields
---

# ID

Each document in OpenSearch has a unique `_id` field. This field is indexed, allowing you to retrieve documents using the GET API or the [`ids` query]({{site.url}}{{site.baseurl}}/query-dsl/term/ids/).

If you do not provide an `_id` value, then OpenSearch automatically generates one for the document.
{: .note}

The following example request creates an index named `test-index1` and adds two documents with different `_id` values:

```json
PUT test-index1/_doc/1
{
  "text": "Document with ID 1"
}

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
  "took": 10,
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
```
{% include copy-curl.html %}

## Limitations of the `_id` field

While the `_id` field can be used in various queries, it is restricted from use in aggregations, sorting, and scripting. If you need to sort or aggregate on the `_id` field, it is recommended to duplicate the `_id` content into another field with `doc_values` enabled. Refer to [IDs query]({{site.url}}{{site.baseurl}}/query-dsl/term/ids/) for an example.
