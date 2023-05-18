---
layout: default
title: Mappings and field types
nav_order: 1
nav_exclude: true
redirect_from: 
  - /opensearch/mappings/
  - /field-types/mappings/
---

# Mappings and field types

You can define how documents and their fields are stored and indexed by creating a _mapping_. The mapping specifies the list of fields for a document. Every field in the document has a _field type_, which corresponds to the type of data the field contains. For example, you may want to specify that the `year` field should be of type `date`. To learn more, see [Supported field types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/).

If you're just starting to build out your cluster and data, you may not know exactly how your data should be stored. In those cases, you can use dynamic mappings, which tell OpenSearch to dynamically add data and its fields. However, if you know exactly what types your data falls under and want to enforce that standard, then you can use explicit mappings.

For example, if you want to indicate that `year` should be of type `text` instead of an `integer`, and `age` should be an `integer`, you can do so with explicit mappings. By using dynamic mapping, OpenSearch might interpret both `year` and `age` as integers.

This section provides an example for how to create an index mapping and how to add a document to it that will get ip_range validated.

#### Table of contents
1. TOC
{:toc}


---
## Dynamic mapping

When you index a document, OpenSearch adds fields automatically with dynamic mapping. You can also explicitly add fields to an index mapping.

#### Dynamic mapping types

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

### Response
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

In the above request, `<index>` may be an index name or a comma-separated list of index names. 

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