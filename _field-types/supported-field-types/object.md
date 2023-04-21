---
layout: default
title: Object
nav_order: 41
has_children: false
parent: Object field types
grand_parent: Supported field types
redirect_from: 
  - /opensearch/supported-field-types/object/
  - /field-types/object/
---

# Object field type

An object field type contains a JSON object (a set of name/value pairs). A value in a JSON object may be another JSON object. It is not necessary to specify `object` as the type when mapping object fields because `object` is the default type.

## Example

Create a mapping with an object field:

```json
PUT testindex1/_mappings
{
    "properties": {
      "patient": { 
        "properties" :
          {
            "name" : {
              "type" : "text"
            },
            "id" : {
              "type" : "keyword"
            }
          }   
      }
    }
}
```
{% include copy-curl.html %}

Index a document with an object field:

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

Nested objects are stored as flat key/value pairs internally. To refer to a field in a nested object, use `parent field`.`child field` (for example, `patient.id`).

Search for a patient with ID 123456:

```json
GET testindex1/_search
{
  "query": {
    "term" : {
      "patient.id" : "123456"
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by object field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
[`dynamic`](#the-dynamic-parameter) | Specifies whether new fields can be dynamically added to this object. Valid values are `true`, `false`, and `strict`. Default is `true`.
`enabled` | A Boolean value that specifies whether the JSON contents of the object should be parsed. If `enabled` is set to `false`, the object's contents are not indexed or searchable, but they are still retrievable from the _source field. Default is `true`.
`properties` | Fields of this object, which can be of any supported type. New properties can be dynamically added to this object if `dynamic` is set to `true`.

### The `dynamic` parameter

The `dynamic` parameter specifies whether new fields can be dynamically added to an object that is already indexed.

For example, you can initially create a mapping with a `patient` object that has only one field:

```json
PUT testindex1/_mappings
{
    "properties": {
      "patient": { 
        "properties" :
          {
            "name" : {
              "type" : "text"
            }
          }   
      }
    }
}
```
{% include copy-curl.html %}

Then you index a document with a new `id` field in `patient`:

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

As a result, the field `id` is added to the mappings:

```json
{
  "testindex1" : {
    "mappings" : {
      "properties" : {        
        "patient" : {
          "properties" : {
            "id" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "name" : {
              "type" : "text"
            }
          }
        }
      }
    }
  }
}
```

The `dynamic` parameter has the following valid values.

Value | Description 
:--- | :--- 
`true` | New fields can be added to the mapping dynamically. This is the default.
`false` | New fields cannot be added to the mapping dynamically. If a new field is detected, it is not indexed or searchable. However, it is still retrievable from the _source field. 
`strict` | When new fields are added to the mapping dynamically, an exception is thrown. To add a new field to an object, you have to add it to the mapping first.

Inner objects inherit the `dynamic` parameter value from their parent unless they declare their own `dynamic` parameter value.
{: .note }
