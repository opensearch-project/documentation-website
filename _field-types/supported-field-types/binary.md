---
layout: default
title: Binary
parent: Supported field types
nav_order: 12
has_children: false
redirect_from:
  - /opensearch/supported-field-types/binary/
  - /field-types/binary/
---

# Binary field type

A binary field type contains a binary value in [Base64](https://en.wikipedia.org/wiki/Base64) encoding that is not searchable. 

## Example

Create a mapping with a binary field:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "binary_value" : {
        "type" : "binary"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a binary value:

```json
PUT testindex/_doc/1 
{
  "binary_value" : "bGlkaHQtd29rfx4="
}
```
{% include copy-curl.html %}

Use `=` as a padding character. Embedded newline characters are not allowed.
{: .note }

## Parameters

The following table lists the parameters accepted by binary field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Optional. Default is `true`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Optional. Default is `false`.