---
layout: default
title: Constant keyword
nav_order: 71
has_children: false
parent: String field types
grand_parent: Supported field types
canonical_url: https://docs.opensearch.org/docs/latest/field-types/supported-field-types/constant-keyword/
---

# Constant keyword field type
**Introduced 2.14**
{: .label .label-purple }

A constant keyword field uses the same value for all documents in the index. 

When a search request spans multiple indexes, you can filter on a constant keyword field to match documents from indexes with the given constant value but not from indexes with a different value.

## Example

The following query creates a mapping with a constant keyword field:

```json
PUT romcom_movies
{
  "mappings" : {
    "properties" : {
      "genre" : {
        "type": "constant_keyword",
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
`value` | The string field value for all documents in the index.

