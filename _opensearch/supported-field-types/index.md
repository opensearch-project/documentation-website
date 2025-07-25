---
layout: default
title: Supported field types
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /opensearch/supported-field-types/
canonical_url: https://docs.opensearch.org/latest/field-types/supported-field-types/index/
---

# Supported field types

You can specify data types for your fields when creating a mapping. The following table lists all data field types that OpenSearch supports.

Field data type | Description
:--- | :--- 
[`alias`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/alias/) | An additional name for an existing field.
[`binary`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary/) |  A binary value in Base64 encoding. 
[Numeric]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) | `byte`, `double`, `float`, `half_float`, `integer`, `long`, `scaled_float`, `short`.
[`boolean`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/boolean/) | A Boolean value. 
[`date`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/) | A date value as a formatted string, a long value, or an integer. 
[`ip`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/ip/) | An IP address in IPv4 or IPv6 format. 
[Range]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/) | `integer_range`, `long_range`,`double_range`, `float_range`, `date_range`,`ip_range`. 
[Object]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/object-fields/) | `object`, `nested`, `join`.
String | [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/), [`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/), [`token_count`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/token-count/).
[Autocomplete]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/autocomplete/) | `completion`, `search_as_you_type`.
[Geographic]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geographic/) | `geo_point`, `geo_shape`.
[Rank]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/rank/) | `rank_feature`, `rank_features`. 
[`percolator`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/percolator/) | Specifies to treat this field as a query. 

## Arrays

There is no dedicated array field type in OpenSearch. Instead, you can pass an array of values into any field. All values in the array must have the same field type.

```json
PUT testindex1/_doc/1
{
  "number": 1 
}

PUT testindex1/_doc/2
{
  "number": [1, 2, 3] 
}
```

## Multifields

Multifields are used to index the same field differently. Strings are often mapped as `text` for full-text queries and `keyword` for exact-value queries.

Multifields can be created using the `fields` parameter. For example, you can map a book `title` to be of type `text` and keep a `title.raw` subfield of type `keyword`.

```json
PUT books
{
  "mappings" : {
    "properties" : {
      "title" : {
        "type" : "text",
        "fields" : {
          "raw" : {
            "type" : "keyword"
          }
        }
      }
    }
  }
}
```

## Null value

Setting a field's value to `null`, an empty array or an array of `null` values makes this field equivalent to an empty field. Therefore, you cannot search for documents that have `null` in this field. 

To make a field searchable for `null` values, you can specify its `null_value` parameter in the index's mappings. Then, all `null` values passed to this field will be replaced with the specified `null_value`.

The `null_value` parameter must be of the same type as the field. For example, if your field is a string, the `null_value` for this field must also be a string.
{: .note}

### Example

Create a mapping to replace `null` values in the `emergency_phone` field with the string "NONE":

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "emergency_phone": {
        "type": "keyword",
        "null_value": "NONE" 
      }
    }
  }
}
```

Index three documents into testindex. The `emergency_phone` fields of documents 1 and 3 contain `null`, while the `emergency_phone` field of document 2 has an empty array:

```json
PUT testindex/_doc/1
{
  "name": "Akua Mansa",
  "emergency_phone": null
}
```

```json
PUT testindex/_doc/2
{
  "name": "Diego Ramirez",
  "emergency_phone" : []
}
```

```json
PUT testindex/_doc/3 
{
  "name": "Jane Doe",
  "emergency_phone": [null, null]
}
```

Search for people who do not have an emergency phone:

```json
GET testindex/_search
{
  "query": {
    "term": {
      "emergency_phone": "NONE"
    }
  }
}
```

The response contains documents 1 and 3 but not document 2 because only explicit `null` values are replaced with the string "NONE":

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.18232156,
    "hits" : [
      {
        "_index" : "testindex",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.18232156,
        "_source" : {
          "name" : "Akua Mansa",
          "emergency_phone" : null
        }
      },
      {
        "_index" : "testindex",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 0.18232156,
        "_source" : {
          "name" : "Jane Doe",
          "emergency_phone" : [
            null,
            null
          ]
        }
      }
    ]
  }
}
```

The `_source` field still contains explicit `null` values because it is not affected by the `null_value`.
{: .note}