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
boolean | OpenSearch accepts `true` and `false` as boolean values. An empty string is equal to `false.`
float | A single-precision 32-bit floating point number.
double | A double-precision 64-bit floating point number.
integer | A signed 32-bit number.
object | Objects are standard JSON objects, which can have fields and mappings of their own. For example, a `movies` object can have additional properties such as `title`, `year`, and `director`.
array | Arrays in OpenSearch can only store values of one type, such as an array of just integers or strings. Empty arrays are treated as though they are fields with no values.
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
`analyzer` | Specifies the analyzer used to analyze string fields.
`boost` | Specifies a field-level query time to boost.
`coerce` | Tries to convert the value to the specified data type.
`copy_to` | Copies the values of this field to another field.
`doc_values` | Specifies whether the field should be stored on disk to make sorting and aggregation faster.
`dynamic` | Determines whether new fields should be added dynamically.
`enabled` | Specifies whether the field is enabled or disabled. 
`format` | Specifies the date format for date fields. 
`ignore_above` | Skips indexing values that are longer than the specified length.
`ignore_malformed` | Specifies whether malformed values should be ignored. 
`index` | Specifies whether the field should be indexed.
`index_options` | Specifies what information should be stored in the index for scoring purposes.

## Mapping limit settings

OpenSearch may have certain limits or settings related to mappings, such as the maximum number of fields allowed in an index or the maximum depth of nested objects. These settings can be configured based on your requirements. 

<_Need SME input about mapping limits settings, their default values, and how to configure them if needed._>

## Removing mapping types

<_Need SME input. Does OpenSearch allow for defining mapping types within an index? If so, SME needs to provide information to include in documentation. Do we have guidance on how to structure data without relying on mapping types?_>

## Runtime fields

You can define fields at query time, rather than at index time, by using runtime fields. this can be useful for creating fields based on the values of other fields, or for performing transformations on data during the query process. Runtime fields are defined in the query itself and do not affect the underlying data in the index.

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

## Delete a mapping

The syntax for deleting a mapping depends on whether you want to delete the entire mapping for an index or the mapping for a specific field. The syntax for deleting a mapping is as follows:

```json
DELETE /<index_name>/_mapping
DELETE /<field_name/_mapping>
```

For example, to delete the entire mapping for the `sample-index1` index, you can use the following commands:

```json
<insert command>
```

If you want to delete the mapping for a specific field, you can <insert instructional text> For example, to delete the mapping for the `year` field, use the following command:

```json
<insert command>
```

Deleting a field mapping will remove the mapping definition for that field across all indexes or the specified index. It will not delete the actual data stored in those fields.
{: .note}
