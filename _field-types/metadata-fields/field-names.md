---
layout: default
title: _field_names
nav_order: 10
has_children: false
parent: Metadata fields
---

# Field names

The `_field_names` field indexes the names of fields within a document that contain non-null values. This field support the `exists` query, which identifies documents with or without non-null values for a specified field. 

`_field_names` only indexes field names when both `doc_values` and `norms` are disabled for those fields. If either `doc_values` or `norms` are enabled, the `exists` query remains functional but does not rely on `_field_names`.

## Mapping example

{
    "mappings": {
       "_field_names": {
        "enabled": "true"
      },
    "properties": {
      },
      "title": {
        "type": "text",
        "doc_values": false,
        "norms": false
      },
      "description": {
        "type": "text",
        "doc_values": true,
        "norms": false
      },
      "price": {
        "type": "float",
        "doc_values": false,
        "norms": true
      }
    }
  }
}
{% include copy-curl.html %}
