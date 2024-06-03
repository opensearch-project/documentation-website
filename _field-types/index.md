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
Boolean | OpenSearch accepts `true` and `false` as Boolean values. An empty string is equal to `false.`
float | A single-precision 32-bit floating point number.
double | A double-precision 64-bit floating point number.
integer | A signed 32-bit number.
object | Objects are standard JSON objects, which can have fields and mappings of their own. For example, a `movies` object can have additional properties such as `title`, `year`, and `director`.
array | Arrays in OpenSearch can only store values of one type, such as an array of only integers or strings. Empty arrays are treated as though they are fields with no values.
text | A string sequence of characters that represent full-text values.
keyword | A string sequence of structured characters, such as an email address or ZIP code.
date detection string | Enabled by default, if new string fields match a date's format, then the string is processed as a `date` field. For example, `date: "2012/03/11"` is processed as a date.
numeric detection string | If disabled, OpenSearch may automatically process numeric values as strings when they should be processed as numbers. When enabled, OpenSearch can process strings into `long`, `integer`, `short`, `byte`, `double`, `float`, `half_float`, `scaled_float`, and `unsigned_long`. Default is disabled.

### Dynamic templates

Dynamic templates are used to define custom mappings for dynamically added fields based on data type, field name, or field path. They allow you to define a flexible schema for your data, which can automatically adapt to changes in the structure or format of the input data.

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
{% include copy-curl.html %}

You cannot change the mapping of an existing field, you can only modify the field's mapping parameters. 
{: .note}

## Mapping parameters

Mapping parameters are used to configure the behavior of fields in an index. See the [Mapping parameters](inert-link-to-page) page for more information.

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
{% include copy-curl.html %}

You can add a document that has a malformed IP address to your index:

```json
PUT /test-index/_doc/1 
{
  "ip_address" : "malformed ip address"
}
```
{% include copy-curl.html %}

This indexed IP address does not throw an error because `ignore_malformed` is set to true. 

You can query the index using the following request:

```json
GET /test-index/_search
```
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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

Both `<index>` and `<fields>` can be specified as one value or a comma-separated list.

For example, the following request retrieves the mapping for the `year` and `age` fields in `sample-index1`:

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

## Map null fields to a custom value

The following example maps all null fields to a custom `N/A` value:

```json
{
  "dynamic_templates": [
    {
      "null_fields": {
        "match_mapping_type": "null",
        "mapping": {
          "type": "text",
          "null_value": "N/A"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Map numeric fields

The following example ensures that all float, double, and integer fields are mapped to the appropriate numeric types, rather than being treated as strings:

```json
{
  "dynamic_templates": [
    {
      "floats": {
        "match_mapping_type": "float",
        "mapping": {
          "type": "float"
        }
      },
      "doubles": {
        "match_mapping_type": "double",
        "mapping": {
          "type": "double"
        }
      },
      "integers": {
        "match_mapping_type": "integer",
        "mapping": {
          "type": "integer"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}