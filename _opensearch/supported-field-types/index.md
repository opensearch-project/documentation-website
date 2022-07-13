---
layout: default
title: Supported field types
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /opensearch/supported-field-types/
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
[Object]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/object/) | `object`, `nested`, `join`.
String | [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/), [`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/), [`token_count`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/token-count/).
[Autocomplete]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/autocomplete/) | `completion`, `search_as_you_type`.
[Geographic]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geographic/) | `geo_point`, `geo_shape`.
[Rank]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/rank/) | `rank_feature`, `rank_features`. 
[`percolator`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/percolator/) | Specifies to treat this field as a query. 

## Arrays

There is no dedicated array field type. Instead, you can pass an array of values into any field. All values in the array must have the same field type.

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

## Multi-fields

Multi-fields are used to index the same field differently. Strings are often mapped as `text` for full-text queries, and `keyword` for exact-value queries.

Multi-fields can be created using the `fields` parameter. For example, you can map a book `title` to be of type `text`, and keep a `title.raw` subfield of type `keyword`.

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
