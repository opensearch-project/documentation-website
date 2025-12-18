---
layout: default
title: Index
parent: Metadata fields
nav_order: 40
redirect_from:
  - /field-types/metadata-fields/index-metadata/
canonical_url: https://docs.opensearch.org/latest/mappings/metadata-fields/index-metadata/
---

# Index

When querying across multiple indexes, you may need to filter results based on the index into which a document was indexed. The `index` field matches documents based on their index. 

The following example request creates two indexes, `products` and `customers`, and adds a document to each index:

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

You can then query both indexes and filter the results using the `_index` field, as shown in the following example request:

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
- The `script_fields` section adds a new field called `index_name` to the search results containing the `_index` field value for each document.

## Querying on the `_index` field

The `_index` field represents the index into which a document was indexed. You can use this field in your queries to filter, aggregate, sort, or retrieve index information for your search results.

Because the `_index` field is automatically added to every document, you can use it in your queries like any other field. For example, you can use the `terms` query to match documents from multiple indexes. The following example query returns all documents from the `products` and `customers` indexes:

```json
 {
  "query": {
    "terms": {
      "_index": ["products", "customers"]
    }
  }
}
```
{% include copy-curl.html %}
