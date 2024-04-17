---
layout: default
title: ID
nav_order: 20
has_children: false
parent: Metadata fields
---

# ID

Each document has an `_id` field that uniquely identifies it. This field is indexed, allowing documents to be retrieved either through the `GET` API or the [`ids` query]({{site.url}}{{site.baseurl}}/query-dsl/term/ids/).

The following examples creates an index `test-index1` and add two documents with different `_id` values:

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

Now, you can query the documents using the `_id` field:

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

The following response shows that this query returns both documents with `_id` values of `1` and `2`.

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

## Querying on the `_id` field

While the `_id` field is accessible in various queries, it is restricted from use in aggregations, sorting, and scripting. If you need to sort or aggregate on the `_id` field, it is recommended to duplicate the content of the `_id` field into another field that has `doc_values` enabled.
