---
layout: default
title: Ignore malformed
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/ignore-malformed/
nav_order: 130
has_children: false
has_toc: false
---

# Ignore malformed mapping parameter

The `ignore_malformed` mapping parameter specifies whether OpenSearch skips field values that cannot be parsed as the field's type. When `ignore_malformed` is `true`, OpenSearch does not index the malformed value but indexes the rest of the document normally. The original value remains in the [`_source`]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/) field.

By default, `ignore_malformed` is `false`, so a single value that cannot be parsed causes OpenSearch to reject the entire document. Set `ignore_malformed` to `true` when you ingest data from sources you do not control and prefer to keep a document containing one bad value over losing the whole document. For example, one client might send a `price` field as a number, and another might send it as a string such as `"call for price"`.

Because skipped values are not indexed, they do not match queries and are not counted in aggregations or sorting. If many documents contain malformed values for a field, results for that field become unreliable. To find affected documents, query the [`_ignored`]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/ignored/) metadata field, which records the names of the fields whose values were skipped. The `_ignored` field is also returned in search hits and document retrieval responses.

## Supported field types

The following field types support the `ignore_malformed` parameter:

- [Numeric]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) field types, including [`unsigned_long`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/unsigned-long/) and `scaled_float`
- [`date`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/) and [`date_nanos`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date-nanos/)
- [`ip`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/ip/)
- [`geo_point`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/) and [`geo_shape`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-shape/)
- [`xy_point`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/xy-point/) and [`xy_shape`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/xy-shape/)
- [Range]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) field types
- [Derived]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/) fields, for which the parameter determines whether a search fails when the script emits a value of the wrong type

Note the following considerations when using `ignore_malformed`:

- If a field contains an array, OpenSearch evaluates each element separately. Valid elements are indexed, and malformed elements are skipped.
- If a field that supports `ignore_malformed` receives a JSON object, OpenSearch skips the object but does not record the field in `_ignored`, so querying `_ignored` does not find the document.
- If an `object` or `nested` field receives a scalar value, such as a string or number, OpenSearch rejects the document regardless of the `ignore_malformed` setting.
- You can change the `ignore_malformed` value of an existing field using the [Create or Update Index Mappings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/). The new value applies only to documents indexed after the change.

## Example: ignore_malformed off

Create an index named `people_no_ignore` containing an `age` field of type `integer`:

```json
PUT /people_no_ignore
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document containing a malformed value:

```json
PUT /people_no_ignore/_doc/1
{
  "age": "twenty"
}
```
{% include copy-curl.html %}

The request fails because of the malformed value:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "mapper_parsing_exception",
        "reason": "failed to parse field [age] of type [integer] in document with id '1'. Preview of field's value: 'twenty'"
      }
    ],
    "type": "mapper_parsing_exception",
    "reason": "failed to parse field [age] of type [integer] in document with id '1'. Preview of field's value: 'twenty'",
    "caused_by": {
      "type": "number_format_exception",
      "reason": "For input string: \"twenty\""
    }
  },
  "status": 400
}
```

## Example: ignore_malformed on

Create an index named `people_ignore` in which the `age` field has `ignore_malformed` set to `true`:

```json
PUT /people_ignore
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer",
        "ignore_malformed": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document containing a malformed value:

```json
PUT /people_ignore/_doc/1
{
  "age": "twenty"
}
```
{% include copy-curl.html %}

Retrieve the document:

```json
GET /people_ignore/_doc/1
```
{% include copy-curl.html %}

The response shows that the document was indexed successfully, despite having a malformed value:

```json
{
  "_index": "people_ignore",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "_ignored": [
    "age"
  ],
  "found": true,
  "_source": {
    "age": "twenty"
  }
}
```

## Example: Setting an index-level default

To enable `ignore_malformed` for all fields in an index, set the `index.mapping.ignore_malformed` index setting to `true`. A field-level `ignore_malformed` value overrides the index-level default. Because `index.mapping.ignore_malformed` is a static setting, you can set it only when creating an index or on a closed index. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

The index-level setting also applies to field types that do not accept the `ignore_malformed` mapping parameter, such as `boolean` and `keyword`. For example, if a `boolean` field receives the string `"maybe"`, OpenSearch skips the value and indexes the document. OpenSearch does not record these skipped values in `_ignored`, so you cannot find the affected documents by querying `_ignored`.

Create an index in which the `rating` and `in_stock_since` fields inherit the index-level default and the `quantity` field overrides it:

```json
PUT /products_ignore_malformed
{
  "settings": {
    "index.mapping.ignore_malformed": true
  },
  "mappings": {
    "properties": {
      "rating": {
        "type": "byte"
      },
      "in_stock_since": {
        "type": "date"
      },
      "quantity": {
        "type": "integer",
        "ignore_malformed": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document containing malformed `rating` and `in_stock_since` values:

```json
PUT /products_ignore_malformed/_doc/1
{
  "rating": "five stars",
  "in_stock_since": "last week",
  "quantity": 12
}
```
{% include copy-curl.html %}

The document is indexed because both malformed fields inherit `ignore_malformed` from the index settings.

Index a document containing a malformed `quantity` value:

```json
PUT /products_ignore_malformed/_doc/2
{
  "rating": 4,
  "quantity": "a dozen"
}
```
{% include copy-curl.html %}

OpenSearch rejects the document because the `quantity` field disables `ignore_malformed`.

To find documents in which values were skipped, run an `exists` query on the `_ignored` field:

```json
GET /products_ignore_malformed/_search
{
  "query": {
    "exists": {
      "field": "_ignored"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the first document. The `_ignored` array lists the fields whose values were skipped:

```json
{
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products_ignore_malformed",
        "_id": "1",
        "_score": 1,
        "_ignored": [
          "in_stock_since",
          "rating"
        ],
        "_source": {
          "rating": "five stars",
          "in_stock_since": "last week",
          "quantity": 12
        }
      }
    ]
  }
}
```

