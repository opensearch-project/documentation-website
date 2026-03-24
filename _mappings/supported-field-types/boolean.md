---
layout: default
title: Boolean
nav_order: 15
has_children: false
parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/boolean/
  - /opensearch/supported-field-types/boolean/
  - /field-types/boolean/
---

# Boolean field type
**Introduced 1.0**
{: .label .label-purple }

A Boolean field type takes `true` or `false` values, or `"true"` or `"false"` strings. You can also pass an empty string (`""`) in place of a `false` value.

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
{% include copy-curl.html %}

Index a document with Boolean values:

```json
PUT testindex/_doc/1 
{
  "a" : true,
  "b" : "true",
  "c" : ""
}
```
{% include copy-curl.html %}

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
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by Boolean field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0. Dynamically updatable.
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting or scripting. Default is `true`.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`. 
`meta` | Accepts metadata for this field.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 

## Boolean values in aggregations and scripts

In aggregations on Boolean fields, `key` returns numeric values (1 for `true` or 0 for `false`), and `key_as_string` returns strings (`"true"` or `"false"`). Scripts return `true` and `false` for Boolean values.

### Example

Run a terms aggregation query on the field `a`:

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
{% include copy-curl.html %}

The script returns the value of `a` as `true`, `key` returns the value of `a` as `1`, and `key_as_string` returns the value of `a` as `"true"`:

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

## Derived source

When an index uses [derived source]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/#derived-source), OpenSearch may sort values in a multi-value `boolean` field during source reconstruction. The following example shows how OpenSearch processes mixed `boolean` inputs.

Create an index that enables derived source and configures a `boolean` field named `a`:

```json
PUT /sample-index1
{
  "settings": {
    "index": {
      "derived_source": {
        "enabled": true
      }
    }
  },
  "mappings": {
    "properties": {
      "a":  {"type": "boolean"}
    }
  }
}
```

Index a document into the index:

```json
PUT sample-index1/_doc/1
{
  "a": [false, "true", "false", true, ""]
}
```

After OpenSearch reconstructs `_source`, the derived `_source` is as follows:

```json
{
  "a": [false, false, false, true, true]
}
```

If the field mapping defines a [`null_value`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/null-value/), any ingested null values are replaced with that value during reconstruction. The following example demonstrates how `null_value` affects derived source output.

Create an index that enables derived source and configures a `null_value` for the `boolean` field `a`:

```json
PUT sample-index2
{
  "settings": {
    "index": {
      "derived_source": {
        "enabled": true
      }
    }
  },
  "mappings": {
    "properties": {
      "a":  {"type": "boolean", "null_value": true}
    }
  }
}
```

Index a document into the index:

```json
PUT sample-index2/_doc/1
{
  "a": [null, true, "false"]
}
```

After OpenSearch reconstructs `_source`, the derived `_source` is as follows:

```json
{
  "a": [false, true, true]
}
```
