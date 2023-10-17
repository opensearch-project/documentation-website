---
layout: default
title: Nested
nav_order: 42
has_children: false
parent: Object field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/nested/
  - /field-types/nested/
---

# Nested field type

A nested field type is a special type of [object field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/object/). 

Any object field can take an array of objects. Each of the objects in the array is dynamically mapped as an object field type and stored in flattened form. This means that the objects in the array are broken down into individual fields, and values for each field across all objects are stored together. It is sometimes necessary to use the nested type to preserve a nested object as a whole so that you can perform a search on it.

## Flattened form

By default, each of the nested objects is dynamically mapped as object field type. Any object field can take an array of objects. 

```json
PUT testindex1/_doc/100
{ 
  "patients": [ 
    {"name" : "John Doe", "age" : 56, "smoker" : true},
    {"name" : "Mary Major", "age" : 85, "smoker" : false}
  ] 
}
```
{% include copy-curl.html %}

When these objects are stored, they are flattened, so their internal representation has an array of all values for each field:

```json
{
    "patients.name" : ["John Doe", "Mary Major"],
    "patients.age" : [56, 85],
    "patients.smoker" : [true, false]
}
```

Some queries will work correctly in this representation. If you search for patients older than 75 OR smokers, document 100 should match.

```json
GET testindex1/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "patients.smoker": true
          }
        },
        {
          "range": {
            "patients.age": {
              "gte": 75
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The query correctly returns document 100:

```json
{
  "took" : 3,
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
    "max_score" : 1.3616575,
    "hits" : [
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "100",
        "_score" : 1.3616575,
        "_source" : {
          "patients" : [
            {
              "name" : "John Doe",
              "age" : "56",
              "smoker" : true
            },
            {
              "name" : "Mary Major",
              "age" : "85",
              "smoker" : false
            }
          ]
        }
      }
    ]
  }
}
```

Alternatively, if you search for patients older than 75 AND smokers, document 100 should not match.

```json
GET testindex1/_search 
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "patients.smoker": true
          }
        },
        {
          "range": {
            "patients.age": {
              "gte": 75
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

However, this query still incorrectly returns document 100. This is because the relation between age and smoking was lost when arrays of values for individual fields were created.

## Nested field type 

Nested objects are stored as separate documents, and the parent object has references to its children. To mark objects as nested, create a mapping with a nested field type.

```json
PUT testindex1
{
  "mappings" : {
    "properties": {
      "patients": { 
        "type" : "nested"
      }
    }
  }
}
```
{% include copy-curl.html %}

Then, index a document with a nested field type:

```json
PUT testindex1/_doc/100
{ 
  "patients": [ 
    {"name" : "John Doe", "age" : 56, "smoker" : true},
    {"name" : "Mary Major", "age" : 85, "smoker" : false}
  ] 
}
```
{% include copy-curl.html %}

You can use the following nested query to search for patients older than 75 OR smokers:

```json
GET testindex1/_search
{
  "query": {
    "nested": {
      "path": "patients",
      "query": {
        "bool": {
          "should": [
            {
              "term": {
                "patients.smoker": true
              }
            },
            {
              "range": {
                "patients.age": {
                  "gte": 75
                }
              }
            }
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query correctly returns both patients:

```json
{
  "took" : 7,
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
    "max_score" : 0.8465736,
    "hits" : [
      {
        "_index" : "testindex1",
        "_id" : "100",
        "_score" : 0.8465736,
        "_source" : {
          "patients" : [
            {
              "name" : "John Doe",
              "age" : 56,
              "smoker" : true
            },
            {
              "name" : "Mary Major",
              "age" : 85,
              "smoker" : false
            }
          ]
        }
      }
    ]
  }
}
```

You can use the following nested query to search for patients older than 75 AND smokers:

```json
GET testindex1/_search
{
  "query": {
    "nested": {
      "path": "patients",
      "query": {
        "bool": {
          "must": [
            {
              "term": {
                "patients.smoker": true
              }
            },
            {
              "range": {
                "patients.age": {
                  "gte": 75
                }
              }
            }
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The previous query returns no results, as expected:

```json
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  }
}
```

## Parameters

The following table lists the parameters accepted by object field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
[`dynamic`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/object#the-dynamic-parameter) | Specifies whether new fields can be dynamically added to this object. Valid values are `true`, `false`, and `strict`. Default is `true`.
`include_in_parent` | A Boolean value that specifies whether all fields in the child nested object should also be added to the parent document in flattened form. Default is `false`.
`include_in_root` | A Boolean value that specifies whether all fields in the child nested object should also be added to the root document in flattened form. Default is `false`.
`properties` | Fields of this object, which can be of any supported type. New properties can be dynamically added to this object if `dynamic` is set to `true`.
