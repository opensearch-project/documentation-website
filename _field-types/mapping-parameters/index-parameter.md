---
layout: default
title: Index
parent: Mapping parameters

nav_order: 60
has_children: false
has_toc: false
---

# Index

The `index` mapping parameter controls whether a field is included in the inverted index. When set to `true`, the field is indexed and available for queries. When set to `false`, the field is stored in the document but not indexed, making it non-searchable when [doc_values]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) are not enabled. If you do not need to search a particular field, disabling indexing and doc_values for that field can reduce index size and improve indexing performance. For example, you can disable indexing on large text fields or metadata that is only used for display.

By default, all field types are indexed.

## Index and Doc Values

Enabling the index parameter will create an mapping between the terms and document lists. For any subsequent documents, the value of the fields where the index parameter is enabled will be processed into its terms, and foe each of those terms, the document id will be added to the corresponding document list of the term in the mapping. When the `doc_values` parameter is enabled, the document will be mapped to the list of terms is contains for that field. This helps with operations that need to quickly access a value for a document like in sorting.

The table below shows how the field bahaves depending on the combination of how index and `doc_values` are enabled.

| Index Option | Doc Values Option | Behavior       | Use Case       
| :--       | :--               | :--            | :--            |
| True   | True          | When index and `doc_values` are enabled, the field can be searched on, and sorting, scripting, and aggregations are supported.    | This should be used for any field you want to query directly and perform complex operations on.          |
| True   | False          | When index is enabled but `doc_values` is not, the field can be only be searched on, meaning that queries can still be performed, but the document-to-term lookup is no longer supported. Sort, scripting, and aggregation operations will now take longer.    | Used for fields that you want to query but not perform sorts or aggregations on like text fields.          |
| False   | True          | When the index is not enabled bug `doc_values` is, we can still search on the field (although not as efficiently), and sorting, scripting, and aggregations will work. It is worth noting that not all field types support doc_values like text, for example.     | Used for fields that you want to analyze with aggregations but not filter and query.          |
| False   | False          | Now, that both index and `doc_values` are disabled, we are no longer able to search on this field, and queries that attempt to search on that field will return an error.    | Data that you do not have to perform any operations on like metadata.          |

## Supported data types

The `index` mapping parameter can be applied to the following data types:

- [Text]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/)
- [Keyword]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/)
- [Boolean]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/boolean/)
- [IP address]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/ip/)
- [Date field types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/dates/)
- [Numeric field types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/)

## Enabling indexing on a field

The following request creates an index named `products` with both a `description` and `name` field that are indexed (the default behavior):

```json
PUT /products
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text"
      },
      "name": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using the following request:

```json
PUT /products/_doc/1
{
  "description": "This product has a searchable description.",
  "name": "doc1"
}
```
{% include copy-curl.html %}

Query the description field:

```json
POST /products/_search
{
  "query": {
    "match": {
      "description": "searchable"
    }
  }
}
```
{% include copy-curl.html %}

The following response confirms that the indexed document was successfully matched by the query:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.13076457,
        "_source": {
          "description": "This product has a searchable description.",
          "name": "doc1"
        }
      }
    ]
  }
}
```

## Disabling indexing on a field

Create an index named `products-no-index` with a `description` field and a `name` field that are not indexed:

```json
PUT /products-no-index
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "index": false
      },
      "name": {
        "type": "keyword",
        "index": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using the following request:

```json
PUT /products-no-index/_doc/1
{
  "description": "This product has a non-searchable description.",
  "name": "doc1"
}
```
{% include copy-curl.html %}

Query `products-no-index` using the `description` field:

```json
POST /products-no-index/_search
{
  "query": {
    "match": {
      "description": "non-searchable"
    }
  }
}
```
{% include copy-curl.html %}

The following error response indicates that the search query failed because the description field is not indexed:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "query_shard_exception",
        "reason": "failed to create query: Cannot search on field [description] since it is not indexed.",
        "index": "products-no-index",
        "index_uuid": "yX2F4En1RqOBbf3YWihGCQ"
      }
    ],
    "type": "search_phase_execution_exception",
    "reason": "all shards failed",
    "phase": "query",
    "grouped": true,
    "failed_shards": [
      {
        "shard": 0,
        "index": "products-no-index",
        "node": "0tmy2tf7TKW8qCmya9sG2g",
        "reason": {
          "type": "query_shard_exception",
          "reason": "failed to create query: Cannot search on field [description] since it is not indexed.",
          "index": "products-no-index",
          "index_uuid": "yX2F4En1RqOBbf3YWihGCQ",
          "caused_by": {
            "type": "illegal_argument_exception",
            "reason": "Cannot search on field [description] since it is not indexed."
          }
        }
      }
    ]
  },
  "status": 400
}
```

For text fields, the index parameter being false is enough to disable searching on that field (this is because text fields do not support doc_values), however, for the other field types, we must also disable `doc_values` to have the same effect.  

Query `products-no-index` using the `name` field:

```json
POST /products-no-index/_search
{
  "query": {
    "term": {
      "name": {
        "value": "doc1"
      }
    }
  }
}
```
{% include copy-curl.html %}

The following response indicates that the search query succeeded because the name field is not indexed but still has `doc_values` enabled:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "products-no-index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "description": "This product has a non-searchable description.",
          "name": "doc1"
        }
      }
    ]
  }
}
```
