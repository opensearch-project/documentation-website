---
layout: default
title: Boolean
nav_order: 20
has_children: false
parent: Supported field types
---

# Boolean field type

A Boolean field type takes `true` or `false` values, or "true" or "false" strings. You can also pass an empty string "" in place of a `false` value.

## Example

Create a mapping where a, b, and c are Boolean fields:

```json
PUT testindex
{
    "mappings" : {
        "properties" :  {
            "a" : {
                "type" : "boolean"
            },
            "b" : {
                "type" : "boolean"
            },
            "c" : {
                "type" : "boolean"
            }
        }
    }
}
```

Index a document with boolean values:

```json
PUT testindex/_doc/1 
{
    "a" : true,
    "b" : "true",
    "c" : ""
}
```

As a result, `a` and `b` will be set to `true`, and `c` will be set to `false`.

Search for all documents where `c` is false:

```json
GET testindex/_search 
{
  "query": {
      "term" : {
        "c" : false
    }
  }
}
```

## Parameters

The following table lists the parameters accepted by boolean field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`doc_values` | A Boolean value that specifies if the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `false`.
`index` | A Boolean value that specifies if the field should be searchable. Default is true. 
`meta` | Accepts metadata for this field.
`null_value` | A  value of the same type as the field that is used as null value. If this parameter is not specified, the field is treated as missing when its value is null. Default is null.
`store` | A Boolean value that specifies if the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 

## Boolean values in aggregations and scripts

In aggregations on Boolean fields, `key` returns numeric values (1 for `true` and 0 for `false`), and `key_as_string` returns strings ("true" or "false"). Scripts return `true` and `false` for Booleans.

### Example

Request:

```json
GET testindex/_search
{
  "aggs": {
    "agg1": {
      "terms": {
        "field": "a"
      }
    }
  },
  "script_fields": {
    "a": {
      "script": {
        "lang": "painless",
        "source": "doc['a'].value"
      }
    }
  }
}
```

Response:

```json
{
  "took" : 1133,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "fields" : {
          "a" : [
            true
          ]
        }
      }
    ]
  },
  "aggregations" : {
    "agg1" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 1,
          "key_as_string" : "true",
          "doc_count" : 1
        }
      ]
    }
  }
}
```
