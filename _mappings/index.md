---
layout: default
title: Mappings
nav_order: 1
nav_exclude: true
permalink: /mappings/
redirect_from: 
  - /opensearch/mappings/
  - /field-types/mappings/
  - /mappings/index/
  - /field-types/
  - /field-types/index/
  - /field-types/mappings-use-cases/
---

# Mappings

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
`float` | A single-precision, 32-bit IEEE 754 floating-point number, restricted to finite values.
`double` | A double-precision, 64-bit IEEE 754 floating-point number, restricted to finite values.
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

Mapping parameters are used to configure the behavior of index fields. For detailed information about all available mapping parameters, see [Mapping parameters]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/).

## Metadata fields

OpenSearch automatically manages several metadata fields for each document, such as `_source`, `_id`, and `_index`. For information about all available metadata fields and their configuration options, see [Metadata fields]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/).

## Mapping limit settings

OpenSearch provides several settings to prevent mapping explosion and control mapping growth. These settings help maintain cluster performance and prevent memory issues caused by excessive field proliferation.

For detailed information about all mapping limit settings, including their default values, allowed ranges, and best practices for preventing mapping explosion, see [Mapping explosion]({{site.url}}{{site.baseurl}}/mappings/mapping-explosion/).

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

## Example: Ignoring malformed IP addresses

The following example shows you how to create a mapping specifying that OpenSearch should ignore any documents containing malformed IP addresses that do not conform to the [`ip`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/ip/) data type. You can accomplish this by setting the `ignore_malformed` parameter to `true`.

### Create an index with an `ip` mapping

To create an index with an `ip` mapping, use a PUT request:

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
{% include copy-curl.html %}

Then add a document with a malformed IP address:

```json
PUT /test-index/_doc/1 
{
  "ip_address" : "malformed ip address"
}
```
{% include copy-curl.html %}

When you query the index, the `ip_address` field will be ignored. You can query the index using the following request:

```json
GET /test-index/_search
```
{% include copy-curl.html %}

#### Response

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
{% include copy-curl.html %}


## Mapping string fields to `text` and `keyword` types

To create an index named `movies1` with a dynamic template that maps all string fields to both the `text` and `keyword` types, you can use the following request:

```json
PUT movies1
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "fields": {
              "keyword": {
                "type":  "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

This dynamic template ensures that any string fields in your documents will be indexed as both a full-text `text` type and a `keyword` type.
