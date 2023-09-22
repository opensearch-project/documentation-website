---
layout: default
title: Supported field types
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /opensearch/supported-field-types/
  - /opensearch/supported-field-types/index/
---

# Supported field types

You can specify data types for your fields when creating a mapping. The following table lists all data field types that OpenSearch supports.

Category | Field types and descriptions
:--- | :---
Alias | [`alias`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/alias/): An additional name for an existing field.
Binary | [`binary`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/binary/):  A binary value in Base64 encoding. 
[Numeric]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/) | A numeric value (`byte`, `double`, `float`, `half_float`, `integer`, `long`, [`unsigned_long`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/unsigned-long/), `scaled_float`, `short`). 
Boolean | [`boolean`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/boolean/): A Boolean value. 
[Date]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/dates/)|  [`date`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/): A date stored in milliseconds. <br> [`date_nanos`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date-nanos/): A date stored in nanoseconds.
IP | [`ip`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/ip/): An IP address in IPv4 or IPv6 format. 
[Range]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/range/) | A range of values (`integer_range`, `long_range`, `double_range`, `float_range`, `date_range`, `ip_range`).
[Object]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/object-fields/)| [`object`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/object/): A JSON object. <br>[`nested`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/): Used when objects in an array need to be indexed independently as separate documents.<br>[`flat_object`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/flat-object/): A JSON object treated as a string.<br>[`join`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/): Establishes a parent-child relationship between documents in the same index. 
[String]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/string/)|[`keyword`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/): Contains a string that is not analyzed.<br> [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/): Contains a string that is analyzed.<br>[`token_count`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/token-count/): Stores the number of analyzed tokens in a string.
[Autocomplete]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/autocomplete/) |[`completion`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/completion/): Provides autocomplete functionality through a completion suggester.<br> [`search_as_you_type`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/search-as-you-type/): Provides search-as-you-type functionality using both prefix and infix completion. 
[Geographic]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/geographic/)| [`geo_point`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/geo-point/): A geographic point.<br>[`geo_shape`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/geo-shape/): A geographic shape.
[Rank]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/rank/) | Boosts or decreases the relevance score of documents (`rank_feature`, `rank_features`).  
[k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/) | Allows indexing a k-NN vector into OpenSearch and performing different kinds of k-NN search.
Percolator | [`percolator`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/percolator/): Specifies to treat this field as a query. 

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