---
layout: default
title: Index
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/index-parameter/
nav_order: 150
has_children: false
has_toc: false
---

# Index mapping parameter

The `index` mapping parameter controls whether a field is included in the inverted index. When set to `true`, the field is indexed and available for queries. When set to `false`, the field is stored in the document but not indexed, making it non-searchable when [`doc_values`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) are not enabled. If you do not need to search a particular field, disabling indexing and `doc_values` for that field can reduce index size and improve indexing performance. For example, you can disable indexing on large text fields or metadata that is only used for display.

By default, all field types are indexed. For indexes that use a pluggable data format, `index` defaults to `false` for the field types whose values are stored in doc values. For more information, see [Pluggable data format indexes](#pluggable-data-format-indexes).

##  The index and doc values parameters compared

When you enable the `index` parameter, OpenSearch creates a mapping of terms to the documents that contain them. For each new document, the values of the indexed fields are broken into terms, and each term is linked to the document ID in the mapping.

When you enable the `doc_values` parameter, OpenSearch creates a reverse mapping: each document is linked to the list of terms found in that field. This is useful for operations like sorting, where the system needs fast access to a document's field values.

The following table illustrates the field behavior depending on the combination of `index` and `doc_values`.

| `index` parameter value | `doc_values` parameter value | Behavior       | Use case       
| :--       | :--               | :--            | :--            |
| `true`   | `true`          | The field is searchable and supports sorting, scripting, and aggregations.    | Use for any field you want to query directly and perform complex operations on.          |
| `true`   | `false`          | The field is searchable but does not support document-to-term lookup (thus, sorting, scripting, and aggregations take longer). |  Use for fields you want to query but don't need for sorting or aggregations, such as `text` fields.          |
| `false`   | `true`         | The field is searchable (although not as efficiently) and supports sorting, scripting, and aggregations. Note that not all field types support `doc_values` (for example, `text` fields do not support `doc_values`).     | Use for fields that you want to aggregate on but not filter or query.          |
| `false`  | `false`          | The field is not searchable. Queries that attempt to search the field return an error.    | Use for fields on which you do not want to perform any operations, such as metadata fields.          |

## Supported data types

The `index` mapping parameter can be applied to the following data types:

- [Text]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/)
- [Keyword]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/)
- [Boolean]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/boolean/)
- [IP address]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/ip/)
- [Date field types]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/dates/)
- [Numeric field types]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)

## Enabling indexing on a field

The following request creates an index named `products` with `description` and `name` fields that are indexed (the default behavior):

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

For `text` fields, setting the `index` parameter to `false` disables search on the field because `text` fields do not support `doc_values`. To make other fields not searchable, you must additionally set `doc_values` to `false`.  

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

The following response confirms that the search query succeeded because the `name` field, though not indexed, has `doc_values` enabled:

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

## Pluggable data format indexes
**Introduced 3.9**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

For indexes that use a pluggable data format, fields of the following types are not indexed by default:

- Numeric types, including `scaled_float`
- `date`
- `date_nanos`
- `ip`
- `boolean`

Fields of these types remain searchable because OpenSearch serves `range`, `term`, and `terms` queries on them from doc values. Fields of all other types are indexed by default. For information about enabling and disabling experimental features, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

Setting `index` to `true` for these fields is not supported.

Because the default value is not stored in the mapping, the `index` parameter does not appear in the response to a `GET _mapping` request for these fields, and the Field Capabilities API reports them as `"searchable": false`.
