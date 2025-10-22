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
canonical_url: https://docs.opensearch.org/latest/mappings/
---

# Mappings and field types

Mappings tell OpenSearch how to store and index your documents and their fields. You can specify the data type for each field (for example, `year` as `date`) to make storage and querying more efficient. 

While [dynamic mappings](#dynamic-mapping) automatically add new data and fields, using explicit mappings is recommended. Explicit mappings let you define the exact structure and data types upfront. This helps to maintain data consistency and optimize performance, especially for large datasets or high-volume indexing operations.

For example, with explicit mappings, you can ensure that `year` is treated as text and `age` as an integer instead of both being interpreted as integers by dynamic mapping.

## Dynamic mapping

When you index a document, OpenSearch adds fields automatically with dynamic mapping. You can also explicitly add fields to an index mapping.

### Dynamic mapping types

Type | Description
:--- | :---
`null` | A `null` field can't be indexed or searched. When a field is set to null, OpenSearch behaves as if the field has no value.
`boolean` | OpenSearch accepts `true` and `false` as Boolean values. An empty string is equal to `false.`
`float` | A single-precision, 32-bit floating-point number.
`double` | A double-precision, 64-bit floating-point number.
`integer` | A signed 32-bit number.
`object` | Objects are standard JSON objects, which can have fields and mappings of their own. For example, a `movies` object can have additional properties such as `title`, `year`, and `director`.
`array` | OpenSearch does not have a specific array data type. Arrays are represented as a set of values of the same data type (for example, integers or strings) associated with a field. When indexing, you can pass multiple values for a field, and OpenSearch will treat it as an array. Empty arrays are valid and recognized as array fields with zero elements---not as fields with no values. OpenSearch supports querying and filtering arrays, including checking for values, range queries, and array operations like concatenation and intersection. Nested arrays, which may contain complex objects or other arrays, can also be used for advanced data modeling. 
`text` | A string sequence of characters that represent full-text values.
`keyword` | A string sequence of structured characters, such as an email address or ZIP code.
date detection string | Enabled by default, if new string fields match a date's format, then the string is processed as a `date` field. For example, `date: "2012/03/11"` is processed as a date.
numeric detection string | If disabled, OpenSearch may automatically process numeric values as strings when they should be processed as numbers. When enabled, OpenSearch can process strings into `long`, `integer`, `short`, `byte`, `double`, `float`, `half_float`, `scaled_float`, and `unsigned_long`. Default is disabled.

### Dynamic templates

Dynamic templates are used to define custom mappings for dynamically added fields based on the data type, field name, or field path. They allow you to define a flexible schema for your data that can automatically adapt to changes in the structure or format of the input data.

You can use the following syntax to define a dynamic mapping template:

```json
PUT index
{
  "mappings": {
    "dynamic_templates": [
        {
          "fields": {
            "mapping": {
              "type": "short"
            },
            "match_mapping_type": "string",
            "path_match": "status*"
          }
        }
    ]
  }
}
```
{% include copy-curl.html %}

This mapping configuration dynamically maps any field with a name starting with `status` (for example, `status_code`) to the `short` data type if the initial value provided during indexing is a string.

### Dynamic mapping parameters

The `dynamic_templates` support the following parameters for matching conditions and mapping rules. The default value is `null`.

Parameter | Description |
----------|-------------|
`match_mapping_type` | Specifies the JSON data type (for example, string, long, double, object, binary, Boolean, date) that triggers the mapping.
`match` | A regular expression used to match field names and apply the mapping.
`unmatch` | A regular expression used to exclude field names from the mapping.
`match_pattern` | Determines the pattern matching behavior, either `regex` or `simple`. Default is `simple`.
`path_match` | Allows you to match nested field paths using a regular expression.
`path_unmatch` | Excludes nested field paths from the mapping using a regular expression.
`mapping` | The mapping configuration to apply.

## Explicit mapping

If you know exactly which field data types you need to use, then you can specify them in your request body when creating your index, as shown in the following example request:

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
{% include copy-curl.html %}

#### Response
```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "sample-index1"
}
```
{% include copy-curl.html %}

To add mappings to an existing index or data stream, you can send a request to the `_mapping` endpoint using the `PUT` or `POST` HTTP method, as shown in the following example request:

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
{% include copy-curl.html %}

You cannot change the mapping of an existing field, you can only modify the field's mapping parameters. 
{: .note}

## Mapping parameters

Mapping parameters are used to configure the behavior of index fields. See [Mappings and field types]({{site.url}}{{site.baseurl}}/field-types/) for more information.

## Mapping limit settings

OpenSearch has certain mapping limits and settings, such as the settings listed in the following table. Settings can be configured based on your requirements. 

| Setting | Default value | Allowed value | Type | Description |
|-|-|-|-|-|
| `index.mapping.nested_fields.limit` | 50 | [0,) | Dynamic | Limits the maximum number of nested fields that can be defined in an index mapping. |
| `index.mapping.nested_objects.limit` | 10,000 | [0,) | Dynamic | Limits the maximum number of nested objects that can be created in a single document. |
| `index.mapping.total_fields.limit` | 1,000 | [0,) | Dynamic | Limits the maximum number of fields that can be defined in an index mapping. |
| `index.mapping.depth.limit` | 20 | [1,100] | Dynamic | Limits the maximum depth of nested objects and nested fields that can be defined in an index mapping. |
| `index.mapping.field_name_length.limit` | 50,000 | [1,50000] | Dynamic | Limits the maximum length of field names that can be defined in an index mapping. |
| `index.mapper.dynamic` | true | {true,false} | Dynamic | Determines whether new fields should be dynamically added to a mapping. |

---

## Get a mapping

To get all mappings for one or more indexes, use the following request:

```json
GET <index>/_mapping
```
{% include copy-curl.html %}

In the previous request, `<index>` may be an index name or a comma-separated list of index names. 

To get all mappings for all indexes, use the following request:

```json
GET _mapping
```
{% include copy-curl.html %}

To get a mapping for a specific field, provide the index name and the field name:

```json
GET _mapping/field/<fields>
GET /<index>/_mapping/field/<fields>
```
{% include copy-curl.html %}

Both `<index>` and `<fields>` can be specified as either one value or a comma-separated list. For example, the following request retrieves the mapping for the `year` and `age` fields in `sample-index1`:

```json
GET sample-index1/_mapping/field/year,age
```
{% include copy-curl.html %}

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
{% include copy-curl.html %}

## Mappings use cases

See [Mappings use cases]({{site.url}}{{site.baseurl}}/field-types/mappings-use-cases/) for use case examples, including examples of mapping string fields and ignoring malformed IP addresses. 
