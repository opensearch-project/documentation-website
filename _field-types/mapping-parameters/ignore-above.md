---
layout: default
title: ignore_above 
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 60
has_children: false
has_toc: false
---

# Ignore_above

The `ignore_above` parameter is a powerful tool in OpenSearch for managing the indexing of long string values. When applied to a field, it sets a character limit for indexing. This feature is particularly useful for optimizing index size and preventing potential issues with extremely long terms.

String values exceeding the `ignore_above` limit will not be indexed or stored. For arrays of strings, `ignore_above` is applied to each element individually. All original values remain in the `_source` field, if enabled.

---

## Example: Ignoring character

The following example request creates an index with a message field that sets `ignore_above` to 20 characters:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "message": {
        "type": "keyword",
        "ignore_above": 20
      }
    }
  }
}
```
{% include copy-curl.html %}
