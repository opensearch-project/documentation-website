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
  - /mappings/supported-field-types/
---

# Supported field types

You can specify data types for your fields when creating a mapping. The following sections group supported field types by purpose or data structure.

## Core field types

| Field type  | Description |
| [`alias`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/alias/)           | An alternate name for an existing field.                                 |
| [`boolean`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/boolean/)       | A true/false value.                                                      |
| [`binary`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/binary/)         | A binary value in Base64 encoding.                                       |

## String-based field types

| Field type  | Description |
| [`text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/)                       | Analyzed full-text string.                                 |
| [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/)                 | A non-analyzed string, useful for exact matches.           |
| [`match_only_text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/match-only-text/) | A lightweight version of `text` for search-only use cases. |
| [`wildcard`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/wildcard/)               | Enables efficient substring and regex matching.            |
| [`token_count`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/token-count/)         | Stores the number of tokens after analysis.                |
| [`constant_keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/constant-keyword/) | Uses the same value for all documents in the index.      |

## Numeric field types

| Field type  | Description |
| [`byte`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)       | A signed 8-bit integer. Minimum is −128. Maximum is 127.                                |
| [`short`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)      | A signed 16-bit integer. Minimum is −2¹⁵. Maximum is 2¹⁵ − 1.                          |
| [`integer`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)    | A signed 32-bit integer. Minimum is −2³¹. Maximum is 2³¹ − 1.                          |
| [`long`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)       | A signed 64-bit integer. Minimum is −2⁶³. Maximum is 2⁶³ − 1.                          |
| [`unsigned_long`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/unsigned-long/) | An unsigned 64-bit integer. Minimum is 0. Maximum is 2⁶⁴ − 1.          |
| [`half_float`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) | A half-precision 16-bit IEEE 754 floating-point value. Maximum magnitude is 65504.     |
| [`float`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)      | A single-precision 32-bit IEEE 754 floating-point value.                                |
| [`double`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)     | A double-precision 64-bit IEEE 754 floating-point value.                                |
| [`scaled_float`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) | A floating-point value that is multiplied by the double scale factor and stored as a long value. |

## Date and time field types

| Field type  | Description |
| [`date`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/)             | A date or timestamp stored in milliseconds. |
| [`date_nanos`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date-nanos/) | A date or timestamp stored in nanoseconds.  |

## IP field types

| Field type  | Description |
| [`ip`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/ip/)               | Stores IPv4 or IPv6 addresses.  |

## Geographic field types

| Field type  | Description |
| [`geo_point`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/) | A geographic point specified by latitude and longitude. |
| [`geo_shape`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-shape/) | A geographic shape, such as a polygon or a collection of geographic points. |

## Cartesian field types

| Field type  | Description |
| [`xy_point`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/xy-point/) | A point in a two-dimensional Cartesian coordinate system. |
| [`xy_shape`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/xy-shape/) | A shape in a two-dimensional Cartesian coordinate system. |

## Range field types

| Field type  | Description |
| [`integer_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) | A range of integer values. |
| [`long_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) | A range of long values. |
| [`double_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) | A range of double values. |
| [`float_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) | A range of float values. |
| [`ip_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) | A range of IP addresses in IPv4 or IPv6 format. |
| [`date_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) | A range of date values. |

## Object field types

| Field type  | Description |
| [`object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/object/)           | A JSON object.                                           |
| [`nested`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/)           | An array of JSON objects, indexed as separate documents. |
| [`flat_object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/flat-object/) | A JSON object treated as a flat map of strings.          |
| [`join`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/)               | Defines parent/child relationships between documents.    |

## Autocomplete field types

| Field type  | Description |
| [`completion`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/completion/)                 | Supports autocomplete functionality using a suggester.                                                                                    |
| [`search_as_you_type`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/search-as-you-type/) | Enables prefix and infix search-as-you-type queries.                                                                                      |

## Vector field types

| Field type  | Description |
| [`knn_vector`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/)                 | Indexes a dense vector for k-NN search and vector similarity operations.                                                                   |
| [`sparse_vector`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/sparse-vector/)               | Indexes a sparse vector for [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann). |

## Specialized search field types

| Field type  | Description |
| [`semantic`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/semantic/)                     | Wraps a text or binary field to simplify semantic search setup.                                                                           |
| [`rank_feature`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/rank/)                     | Boosts or decreases the relevance score of documents.                                                                                     |
| [`rank_features`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/rank/)                    | Boosts or decreases the relevance score of documents. Used when the list of features is sparse.                                          |
| [`percolator`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/percolator/)                 | A field that acts as a stored query for reverse search operations.                                                                        |
| [`star_tree`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/star-tree/)                   | Precomputes aggregations for faster performance using a [star-tree index](https://docs.pinot.apache.org/basics/indexing/star-tree-index). |
| [`derived`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/)                       | A dynamically generated field computed from other fields using a script.                                                                  |


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

semantic field cannot support an array of values since we will map it to an embedding field as rank_features/knn_vector, and they cannot support multiple vectors.
{: .note}

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
