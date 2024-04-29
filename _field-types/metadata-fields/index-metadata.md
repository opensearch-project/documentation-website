---
layout: default
title: Index
nav_order: 25
has_children: false
parent: Metadata fields
---

# Index

When querying across multiple indexes, you may need to filter results based on the index a document was indexed into. The `index` field matches documents based on their index. 

The following example creates two indexes, `products` and `customers` and adds a document to each index:

```json
PUT products/_doc/1
{
  "name": "Widget X"
}

PUT customers/_doc/2
{
  "name": "John Doe"
}
```
{% include copy-curl.html %}

Now, you can query both indexes and filter the results using the `_index` field:

```json
GET products,customers/_search
{
  "query": {
    "terms": {
      "_index": ["products", "customers"]
    }
  },
  "aggs": {
    "index_groups": {
      "terms": {
        "field": "_index",
        "size": 10
      }
    }
  },
  "sort": [
    {
      "_index": {
        "order": "desc"
      }
    }
  ],
  "script_fields": {
    "index_name": {
      "script": {
        "lang": "painless",
        "source": "doc['_index'].value"
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example:

- The `query` section uses a `terms` query to match documents from the `products` and `customers` indexes.
- The `aggs` section performs a `terms` aggregation on the `_index` field, grouping the results by index.
- The `sort` section sorts the results by the `_index` field in ascending order.
- The `script_fields` section adds a new field `index_name` to the search results that contains the value of the `_index` field for each document.

## Querying on the `_index` field

<SME: Please provide information necessary for users to understand how this works for them.>
