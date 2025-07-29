---
layout: default
title: Supported field types
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /opensearch/supported-field-types/
  - /opensearch/supported-field-types/index/
  - /field-types/supported-field-types/
---

# Supported field types

You can specify data types for your fields when creating a mapping. The following sections group supported field types by purpose or data structure.

## General field types

| Field type  | Description |
| [`alias`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/alias/)           | An alternate name for an existing field.                                 |
| [`boolean`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/boolean/)       | A true/false value.                                                      |
| [`binary`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/binary/)         | A binary value in Base64 encoding.                                       |
| [`percolator`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/percolator/) | A field that acts as a stored query.                                     |
| [`derived`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/derived/)       | A dynamically generated field computed from other fields using a script. |

## String-based field types

| Field type  | Description |
| [`keyword`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/)                 | A non-analyzed string, useful for exact matches.           |
| [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/)                       | Analyzed full-text string.                                 |
| [`match_only_text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/match-only-text/) | A lightweight version of `text` for search-only use cases. |
| [`token_count`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/token-count/)         | Stores the number of tokens after analysis.                |
| [`wildcard`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/wildcard/)               | Enables efficient substring and regex matching.            |

## Numeric field types

| Field type  | Description |
| [`byte`, `double`, `float`, `half_float`, `integer`, `long`, `short`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/) | Stores integer or floating-point numbers in various precisions. |
| [`unsigned_long`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/unsigned-long/)                                               | A 64-bit unsigned integer.                                      |
| [`scaled_float`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/)                                                      | A floating-point number scaled by a fixed factor for storage.   |

## Date and time field types

| Field type  | Description |
| [`date`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/)             | A date or timestamp stored in milliseconds. |
| [`date_nanos`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date-nanos/) | A date or timestamp stored in nanoseconds.  |

## IP field types

| Field type  | Description |
| [`ip`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/ip/)               | Stores IPv4 or IPv6 addresses.  |

## Range field types

| Field type  | Description |
| [`integer_range`, `long_range`, `double_range`, `float_range`, `ip_range`, `date_range`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/range/) | Define ranges of numeric, date, or IP values. |

## Object field types

| Field type  | Description |
| [`object`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/object/)           | A JSON object.                                           |
| [`nested`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/)           | An array of JSON objects, indexed as separate documents. |
| [`flat_object`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/flat-object/) | A JSON object treated as a flat map of strings.          |
| [`join`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/)               | Defines parent/child relationships between documents.    |

## Specialized search field types

| Field type  | Description |
| [`completion`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/completion/)                 | Supports autocomplete functionality using a suggester.                                                                                    |
| [`search_as_you_type`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/search-as-you-type/) | Enables prefix and infix search-as-you-type queries.                                                                                      |
| [`rank_feature`, `rank_features`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/rank/)    | Boosts or lowers document relevance scores.                                                                                                 |
| [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)                 | Indexes a vector for k-NN search.                                                                                                         |
| [`semantic`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/semantic/)                     | Wraps a text or binary field to simplify semantic search setup.                                                                           |
| [`star_tree`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/star-tree/)                   | Precomputes aggregations for faster performance using a [star-tree index](https://docs.pinot.apache.org/basics/indexing/star-tree-index). |

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

Setting a field's value to `null`, an empty array, or an array of `null` values makes this field equivalent to an empty field. Therefore, you cannot search for documents that have `null` in this field. 

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
