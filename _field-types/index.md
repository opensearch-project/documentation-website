---
layout: default
title: Mappings and field types
nav_order: 1
nav_exclude: true
permalink: /field-types/
redirect_from: 
  - /opensearch/mappings/
  - /field-types/mappings/
  - /field-types/index/
---

# Mappings and field types

You can define how documents and their fields are stored and indexed by creating a _mapping_. The mapping specifies the list of fields for a document. Every field in the document has a _field type_, which defines the type of data the field contains. For example, you may want to specify that the `year` field should be of type `date`. To learn more, see [Supported field types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/).

If you're starting to build out your cluster and data, you may not know exactly how your data should be stored. In those cases, you can use dynamic mappings, which tell OpenSearch to dynamically add data and its fields. However, if you know exactly what types your data falls under and want to enforce that standard, then you can use explicit mappings.

For example, if you want to indicate that `year` should be of type `text` instead of an `integer`, and `age` should be an `integer`, you can do so with explicit mappings. By using dynamic mapping, OpenSearch might interpret both `year` and `age` as integers.

This documentation provides an example for how to create an index mapping and how to add a document to it that will get `ip_range` validated.

## Dynamic mapping

When you index a document, OpenSearch adds fields automatically with dynamic mapping. You can also explicitly add fields to an index mapping.

### Dynamic mapping types

Type | Description
:--- | :---
null | A `null` field can't be indexed or searched. When a field is set to null, OpenSearch behaves as if that field has no values.
boolean | OpenSearch accepts `true` and `false` as Boolean values. An empty string is equal to `false.`
float | A single-precision 32-bit floating point number.
double | A double-precision 64-bit floating point number.
integer | A signed 32-bit number.
object | Objects are standard JSON objects, which can have fields and mappings of their own. For example, a `movies` object can have additional properties such as `title`, `year`, and `director`.
array | Arrays in OpenSearch can only store values of one type, such as an array of only integers or strings. Empty arrays are treated as though they are fields with no values.
text | A string sequence of characters that represent full-text values.
keyword | A string sequence of structured characters, such as an email address or ZIP code.
date detection string | Enabled by default, if new string fields match a date's format, then the string is processed as a `date` field. For example, `date: "2012/03/11"` is processed as a date.
numeric detection string | If disabled, OpenSearch may automatically process numeric values as strings when they should be processed as numbers. When enabled, OpenSearch can process strings into `long`, `integer`, `short`, `byte`, `double`, `float`, `half_float`, `scaled_float`, and `unsigned_long`. Default is disabled.

## Explicit mapping

If you know exactly what your field data types need to be, you can specify them in your request body when creating your index.

```json
PUT sample-index1
{
  "mappings": {
    "properties": {
      "year":    { "type" : "text" },
      "age":     { "type" : "integer" },
      "director":{ "type" : "text" }
    }
  }
}
```

#### Response
```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "sample-index1"
}
```

To add mappings to an existing index or data stream, you can send a request to the `_mapping` endpoint using the `PUT` or `POST` HTTP method:

```json
POST sample-index1/_mapping
{
  "properties": {
    "year":    { "type" : "text" },
    "age":     { "type" : "integer" },
    "director":{ "type" : "text" }
  }
}
```

You cannot change the mapping of an existing field, you can only modify the field's mapping parameters. 
{: .note}

## Mapping parameters

Mapping parameters are used to configure the behavior of fields in an index. The following table lists commonly used mapping parameters.

Parameter | Description
:--- | :---
`analyzer` | Specifies the analyzer used to analyze string fields. Default is the `standard` analyzer, which is a general-purpose analyzer that splits text on white space and punctuation, converts to lowercase, and removes stop words. Allowed values are `standard`, `simple`, `whitespace`, and <SME: List any others>. 
`boost` | Specifies a field-level query time to boost. Default boost value is `1.0`, which means no boost is applied. Allowed values are any floating-point number.
`coerce` | Tries to convert the value to the specified data type. Default value is `true`, which means OpenSearch tries to coerce the value to the expected value type. Allowed values are `true` or `false`.
`copy_to` | Copies the values of this field to another field. There is no default value for this parameter. It is an optional parameter that allows you to copy the value of a field to another field. 
`doc_values` | Specifies whether the field should be stored on disk to make sorting and aggregation faster. Default value is `true`, which means the doc values are enabled. Allowed values are a single field name or a list of field names. Allowed values are `true` or `false`.
`dynamic` | Determines whether new fields should be added dynamically. Default value is `true`, which means new fields can be added dynamically. Allowed values are `true`, `false`, or `strict`.
`enabled` | Specifies whether the field is enabled or disabled. Default value is `true`, which means the field is enabled. Allowed values are `true` or `false`.
`format` | Specifies the date format for date fields. There is no default value for this parameter. It is used for date fields to specify the date format. Allowed values are any valid date format string, such as `yyyy-MM-dd` or `epoch_millis`.
`ignore_above` | Skips indexing values that are longer than the specified length. Default value is `2147483647`, which means there is no limit on the length of the field value. Allowed values are any positive integer.
`ignore_malformed` | Specifies whether malformed values should be ignored. Default value is `false`, which means malformed values are not ignored. . Allowed values are `true` or `false`.
`index` | Specifies whether the field should be indexed. Default value is `true`, which means the field is indexed. Allowed values are `true`, `false`, or `not_analyzed`.
`index_options` | Specifies what information should be stored in the index for scoring purposes. Default value `docs`, which means only the document numbers are stored in the index. is Allowed values are `docs`, `freqs`, `positions`, or `offsets`.

## Mapping limit settings

OpenSearch has certain limits or settings related to mappings, such as the settings listed in the following table. Settings can be configured based on your requirements. 

| Setting | Default value | Allowed value | Type | Description |
|-|-|-|-|-|
| index.mapping.nested_fields.limit | 50 | [0,) | Dynamic | Limits the maximum number of nested fields that can be defined in an index mapping. |
| index.mapping.nested_objects.limit | 10000 | [0,) | Dynamic | Limits the maximum number of nested objects that can be created within a single document. |
| index.mapping.total_fields.limit | 1000 | [0,) | Dynamic | Limits the maximum number of fields that can be defined in an index mapping. |
| index.mapping.depth.limit | 20 | [1,100] | Dynamic | Limits the maximum depth of nested objects and nested fields that can be defined in an index mapping. |
| index.mapping.field_name_length.limit | 50000 | [1,50000] | Dynamic | Limits the maximum length of field names that can be defined in an index mapping. |
| index.mapper.dynamic | true | {true,false} | Dynamic | Determines whether new fields should be added dynamically to the mapping when they are encountered in a document. |

---

## Mapping example usage

The following example shows how to create a mapping to specify that OpenSearch should ignore any documents with malformed IP addresses that do not conform to the [`ip`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/ip/) data type. You accomplish this by setting the `ignore_malformed` parameter to `true`.

### Create an index with an `ip` mapping

To create an index, use a PUT request:

```json
PUT /test-index 
{
  "mappings" : {
    "properties" :  {
      "ip_address" : {
        "type" : "ip",
        "ignore_malformed": true
      }
    }
  }
}
```

You can add a document that has a malformed IP address to your index:

```json
PUT /test-index/_doc/1 
{
  "ip_address" : "malformed ip address"
}
```

This indexed IP address does not throw an error because `ignore_malformed` is set to true. 

You can query the index using the following request:

```json
GET /test-index/_search
```

The response shows that the `ip_address` field is ignored in the indexed document:

```json
{
  "took": 14,
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
        "_index": "test-index",
        "_id": "1",
        "_score": 1,
        "_ignored": [
          "ip_address"
        ],
        "_source": {
          "ip_address": "malformed ip address"
        }
      }
    ]
  }
}
```

## Get a mapping

To get all mappings for one or more indexes, use the following request:

```json
GET <index>/_mapping
```

In the previous request, `<index>` may be an index name or a comma-separated list of index names. 

To get all mappings for all indexes, use the following request:

```json
GET _mapping
```

To get a mapping for a specific field, provide the index name and the field name:

```json
GET _mapping/field/<fields>
GET /<index>/_mapping/field/<fields>
```

Both `<index>` and `<fields>` can be specified as one value or a comma-separated list.

For example, the following request retrieves the mapping for the `year` and `age` fields in `sample-index1`:

```json
GET sample-index1/_mapping/field/year,age
```

The response contains the specified fields:

```json
{
  "sample-index1" : {
    "mappings" : {
      "year" : {
        "full_name" : "year",
        "mapping" : {
          "year" : {
            "type" : "text"
          }
        }
      },
      "age" : {
        "full_name" : "age",
        "mapping" : {
          "age" : {
            "type" : "integer"
          }
        }
      }
    }
  }
}
```
