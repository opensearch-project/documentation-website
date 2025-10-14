---
layout: default
title: Dynamic
parent: Mapping parameters

nav_order: 30
has_children: false
has_toc: false
redirect_from:
  - /opensearch/dynamic/
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/dynamic/
---

# Dynamic

The `dynamic` parameter specifies whether newly detected fields can be added dynamically to a mapping. It accepts the parameters listed in the following table.

Parameter | Description 
:--- | :--- 
`true`  | Specifies that new fields can be added dynamically to the mapping. Default is `true`.
`false` | Specifies that new fields cannot be added dynamically to the mapping. If a new field is detected, then it is not indexed or searchable but can be retrieved from the `_source` field.
`strict` | Throws an exception. The indexing operation fails when new fields are detected.
`strict_allow_templates` | Adds new fields if they match predefined dynamic templates in the mapping.

--- 

## Example: Create an index with `dynamic` set to `true`

1. Create an index with `dynamic` set to `true` by sending the following request:

```json
PUT testindex1
{
  "mappings": {
    "dynamic": true
  }
}
```
{% include copy-curl.html %}

2. Index a document with an object field `patient` containing two string fields by sending the following request:

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

3. Confirm the mapping works as expected by sending the following request:

```json
GET testindex1/_mapping
```
{% include copy-curl.html %}

The object field `patient` and two subfields `name` and `id` are added to the mapping, as shown in the following response:

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

---

## Example: Create an index with `dynamic` set to `false`

1. Create an index with explicit mappings and `dynamic` set to `false` by sending the following request:

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

2. Index a document with an object field `patient` containing two string fields and additional unmapped fields by sending the following request:

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

3.  Confirm the mapping works as expected by sending the following request:

```json
GET testindex1/_mapping
```
{% include copy-curl.html %}

The following response shows that the new fields `room` and `floor` were not added to the mapping, which remained unchanged:

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

4. Get the unmapped fields `room` and `floor` from the document by sending the following request:

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

The following request searches for the fields `room` and `floor`:

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

The response returns no results:

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

---

## Example: Create an index with `dynamic` set to `strict`

1. Create an index with explicit mappings and `dynamic` set to `strict` by sending the following request:

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

2. Index a document with an object field `patient` containing two string fields and additional unmapped fields by sending the following request:

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

Note that an exception is thrown, as shown in the following response: 

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

---

## Example: Create an index with `dynamic` set to `strict_allow_templates`

1. Create an index with predefined dynamic templates and `dynamic` set to `strict_allow_templates` by sending the following request: 

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

2. Index a document with an object field `patient` containing two string fields and a new field `room` that matches one of the dynamic templates by sending the following request:

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

Indexing succeeds because the new field `room` matches the dynamic templates. However, indexing fails for the new field `floor` because it does not match one of the dynamic templates and is not explicitly mapped, as shown in the following response:

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
