---
layout: default
title: Constant Keyword
nav_order: 46
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/constant-keyword/
  - /field-types/constant-keyword/
---

# Constant keyword field type

A constant keyword field uses the same value for documents in the index. 

When a search request spans multiple indices, you can filter on a constant keyword field to match documents from indices with the given constant value, 
but not indices with a different value.

## Example

The following query creates a mapping with a constant keyword field. 

```json
PUT romcom_movies
{
  "mappings" : {
    "properties" : {
      "genre" : {
        "value" : "Romantic comedy"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by constant keyword field types. All values are required.

Parameter | Description 
:--- | :--- 
`value` | The string value for the field for all documents in the index.

