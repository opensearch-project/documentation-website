---
layout: default
title: Field names
parent: Metadata fields
nav_order: 10
redirect_from:
  - /field-types/metadata-fields/field-names/
canonical_url: https://docs.opensearch.org/latest/mappings/metadata-fields/field-names/
---

# Field names

The `_field_names` field indexes field names that contain non-null values. This enables the use of the `exists` query, which can identify documents that either have or do not have non-null values for a specified field. 

However, `_field_names` only indexes field names when both `doc_values` and `norms` are disabled. If either `doc_values` or `norms` are enabled, then the `exists` query still functions but will not rely on the `_field_names` field.

## Mapping example

```json
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
```
{% include copy-curl.html %}
