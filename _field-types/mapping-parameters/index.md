The `dynamic` parameter specifies whether new detected fields can be added dynamically, it accepts four parameters:

Parameter | Description 
:--- | :--- 
`true`  | New fields can be added to the mapping dynamically. This is the default.
`false` | New fields cannot be added to the mapping dynamically. If a new field is detected, it is not indexed or searchable. However, it is still retrievable from the _source field.
`strict` | Throws exception and fail the indexing operation when new fields are detected.
`strict_allow_templates` | If the new detected fields can match any pre-defined dynamic template in the mapping, then they will be added to the mapping, if not match an exception will be thrown as same as `strict`.

## Example 1
Create an index with setting `dynamic` to `true`(or do not set):

```json
PUT testindex1
{
  "mappings": {
    "dynamic": true
  }
}
```
{% include copy-curl.html %}

Index a document with an object field `patient`, and two string fields under the `patient` object:

```json
PUT testindex1/_doc/1
{ 
  "patient": { 
    "name" : "John Doe",
    "id" : "123456"
  } 
}
```
{% include copy-curl.html %}

Check the mapping:

```json
GET testindex1/_mapping
```
{% include copy-curl.html %}

, you can see that an object field `patient` and two sub-fields `name` and `id` were added to the mapping:

```json
{
  "testindex1": {
    "mappings": {
      "dynamic": "true",
      "properties": {
        "patient": {
          "properties": {
            "id": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            },
            "name": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Example 2
Create an index with setting `dynamic` to `false` but with some explicit mapping:

```json
PUT testindex1
{
  "mappings": {
    "dynamic": false,
    "properties": {
      "patient": {
        "properties": {
          "id": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with an object field `patient`, and two string fields under the `patient` object, and also other new fields which are not shown in the mapping:

```json
PUT testindex1/_doc/1
{ 
  "patient": { 
    "name" : "John Doe",
    "id" : "123456"
  },
  "room": "room1",
  "floor": "1"
}
```
{% include copy-curl.html %}

Check the mapping:

```json
GET testindex1/_mapping
```
{% include copy-curl.html %}

, you can see that the new fields `room` and `floor` were not added to the mapping, the mapping didn't change:

```json
{
  "testindex1": {
    "mappings": {
      "dynamic": "false",
      "properties": {
        "patient": {
          "properties": {
            "id": {
              "type": "keyword"
            },
            "name": {
              "type": "keyword"
            }
          }
        }
      }
    }
  }
}
```

However, you can still get the fields `room` and `floor` from the document:

```json
PUT testindex1/_doc/1
{ 
  "patient": { 
    "name" : "John Doe",
    "id" : "123456"
  },
  "room": "room1",
  "floor": "1"
}
```
, but search on the fields `room` or `floor` will return no results:

```json
POST testindex1/_search
{
  "query": {
    "term": {
      "room": "room1"
    }
  }
}
```
, the response is:

```json
{
  "took": 3,
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

## Example 3
Create an index with setting `dynamic` to `strict` but with some explicit mapping:

```json
PUT testindex1
{
  "mappings": {
    "dynamic": strict,
    "properties": {
      "patient": {
        "properties": {
          "id": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with an object field `patient`, and two string fields under the `patient` object, and also other new fields which are not shown in the mapping:

```json
PUT testindex1/_doc/1
{ 
  "patient": { 
    "name" : "John Doe",
    "id" : "123456"
  },
  "room": "room1",
  "floor": "1"
}
```
{% include copy-curl.html %}

This time, an exception is thrown:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "strict_dynamic_mapping_exception",
        "reason": "mapping set to strict, dynamic introduction of [room] within [_doc] is not allowed"
      }
    ],
    "type": "strict_dynamic_mapping_exception",
    "reason": "mapping set to strict, dynamic introduction of [room] within [_doc] is not allowed"
  },
  "status": 400
}
```

## Example 4
Create an index with setting `dynamic` to `strict_allow_templates` and with some dynamic templates:

```json
PUT testindex1
{
  "mappings": {
    "dynamic": "strict_allow_templates",
    "dynamic_templates": [
      {
        "strings": {
          "match": "room*",
          "match_mapping_type": "string",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ],
    "properties": {
      "patient": {
        "properties": {
          "id": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with an object field `patient`, and two string fields under the `patient` object, and a new field `room` which can match the dynamic templates:

```json
PUT testindex1/_doc/1
{ 
  "patient": { 
    "name" : "John Doe",
    "id" : "123456"
  },
  "room": "room1"
}
```
{% include copy-curl.html %}

, index this document succeeds because the new detected field `room` can match the pre-defined dynamic templates.

But index the following document fails because the new detected field `floor` cannot match the pre-defined dynamic templates and was not set explicitly in the mapping.

```json
PUT testindex1/_doc/1
{ 
  "patient": { 
    "name" : "John Doe",
    "id" : "123456"
  },
  "room": "room1",
  "floor": "1"
}
```
