---
layout: default
title: Nested
nav_order: 42
has_children: false
parent: Object field types
grand_parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/nested/
  - /opensearch/supported-field-types/nested/
  - /field-types/nested/
---

# Nested field type
**Introduced 1.0**
{: .label .label-purple }

A nested field type is a special type of [object field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/object/). 

Any object field can take an array of objects. Each of the objects in the array is dynamically mapped as an object field type and stored in flattened form. This means that the objects in the array are broken down into individual fields, and values for each field across all objects are stored together. It is sometimes necessary to use the nested type to preserve a nested object as a whole so that you can perform a search on it.

Use the nested type when a document contains an array of objects and your queries must match conditions within the same object, for example, finding a patient who is both older than 75 and a smoker. Nested objects are more expensive to index and query than regular objects, so use them only when you need this independence. To store key-value pairs whose keys vary from document to document, consider the [`flat_object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/flat-object/) field type, which maps an entire object as a single field.

## Flattened form

Index a document containing an array of patient objects:

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

Some queries work correctly in this representation. If you search for patients older than 75 OR smokers, document 100 matches.

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
  "took": 11,
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
    "max_score": 1.1643897,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "100",
        "_score": 1.1643897,
        "_source": {
          "patients": [
            {
              "name": "John Doe",
              "age": 56,
              "smoker": true
            },
            {
              "name": "Mary Major",
              "age": 85,
              "smoker": false
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

## Mapping objects as nested

Nested objects are stored as separate documents, and the parent object has references to its children. To mark objects as nested, create an index containing a mapping with a nested field type:

```json
PUT testindex2
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
PUT testindex2/_doc/100
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
GET testindex2/_search
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

The query correctly returns document 100 because at least one patient matches the conditions:

```json
{
  "took": 25,
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
    "max_score": 0.6575334,
    "hits": [
      {
        "_index": "testindex2",
        "_id": "100",
        "_score": 0.6575334,
        "_source": {
          "patients": [
            {
              "name": "John Doe",
              "age": 56,
              "smoker": true
            },
            {
              "name": "Mary Major",
              "age": 85,
              "smoker": false
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
GET testindex2/_search
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
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

## Retrieving matching nested objects

A nested query returns the whole parent document. To see which nested objects matched, add `inner_hits` to the query. The following request searches for patients named Mary who are older than 75 and highlights the matching name:

```json
GET testindex2/_search
{
  "_source": false,
  "query": {
    "nested": {
      "path": "patients",
      "query": {
        "bool": {
          "must": [
            { "match": { "patients.name": "mary" } },
            { "range": { "patients.age": { "gte": 75 } } }
          ]
        }
      },
      "inner_hits": {
        "highlight": {
          "fields": {
            "patients.name": {}
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `inner_hits` object in the response contains only the matching patient. The `_nested.offset` value is the position of that patient in the `patients` array:

```json
{
  "took": 22,
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
    "max_score": 1.3150668,
    "hits": [
      {
        "_index": "testindex2",
        "_id": "100",
        "_score": 1.3150668,
        "inner_hits": {
          "patients": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1.3150668,
              "hits": [
                {
                  "_index": "testindex2",
                  "_id": "100",
                  "_nested": {
                    "field": "patients",
                    "offset": 1
                  },
                  "_score": 1.3150668,
                  "_source": {
                    "smoker": false,
                    "name": "Mary Major",
                    "age": 85
                  },
                  "highlight": {
                    "patients.name": [
                      "<em>Mary</em> Major"
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

For more information, see [Inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).

## Working with nested objects

Because each nested object is stored as a separate hidden document, regular queries on the parent document do not match fields in nested objects. In the preceding example, a `term` query on `patients.smoker` that is not wrapped in a `nested` query returns no results. Use the following features to work with nested objects:

- The [`nested` query]({{site.url}}{{site.baseurl}}/query-dsl/joining/nested/) to search nested objects
- The [`nested`]({{site.url}}{{site.baseurl}}/aggregations/bucket/nested/) and [`reverse_nested`]({{site.url}}{{site.baseurl}}/aggregations/bucket/reverse-nested/) aggregations to aggregate on nested fields and return to the parent document
- [Nested sorting]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/#sorting-nested-objects) to sort parent documents by values in nested objects
- [Inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/) to return the matching nested objects

The same separation applies when retrieving field values. Requesting a nested field in the top-level `docvalue_fields` or `stored_fields` parameter returns no values. To retrieve these fields, request them in `inner_hits`.

To also index nested fields in the parent document, set `include_in_parent` or `include_in_root` to `true`. Regular queries then match these fields, but the parent document stores the values in flattened form, so these queries cannot tell which values belong to the same object.

Nested fields can contain other nested fields. The two parameters differ only when nested fields are more than one level deep. For example, if `patients` is a nested field that contains a nested `visits` field, setting `include_in_parent` on `visits` adds the visit fields to each `patients` object, so a `nested` query on `patients` can match them. Setting `include_in_root` on `visits` adds the visit fields to the top-level document, so a regular query can match them.

## Limits on nested fields

OpenSearch indexes every nested object as a separate Lucene document in addition to the parent document. In the preceding example, document 100 is stored as three Lucene documents: one for the parent and one for each patient. The `docs.count` value returned by `GET _cat/indices` includes these hidden documents, while the Count API counts only parent documents.

To prevent excessive resource use, OpenSearch provides the following limits:

- `index.mapping.nested_fields.limit`: The maximum number of distinct `nested` fields in an index mapping. Default is `50`.
- `index.mapping.nested_objects.limit`: The maximum total number of nested objects in a single document, counted across all `nested` fields. Default is `10000`.

For more information, see [Mapping explosion]({{site.url}}{{site.baseurl}}/mappings/mapping-explosion/#mapping-limit-settings).

## Parameters

The following table lists the parameters accepted by nested field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
[`dynamic`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/object#the-dynamic-parameter) | Specifies whether new fields can be dynamically added to the object. Valid values are `true`, `false`, `strict`, `strict_allow_templates`, and `false_allow_templates`. Default is `true`.
`include_in_parent` | A Boolean value that specifies whether all fields in the child nested object should also be added to the parent document in flattened form. Default is `false`.
`include_in_root` | A Boolean value that specifies whether all fields in the child nested object should also be added to the root document in flattened form. Default is `false`.
`properties` | Fields of this object, which can be of any supported type. New properties can be dynamically added to this object if `dynamic` is set to `true`. For more information, see [Properties]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/properties/).

## Next steps

- Learn about [joining queries]({{site.url}}{{site.baseurl}}/query-dsl/joining/) on nested fields.
- Learn about [retrieving inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).
- Learn about the [disable objects]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/disable-objects/) mapping parameter.