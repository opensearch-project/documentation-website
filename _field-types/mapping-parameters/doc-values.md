---
layout: default
title: doc_values
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 25
has_children: false
has_toc: false
---

# Doc_values

OpenSearch indexes most fields by default for searching. While the inverted index allows quick term-to-document lookups, doc values enable efficient document-to-term access for sorting, aggregations, and scripting.

The `doc_values` parameter accepts the following values:

Parameter | Description
:--- | :---
`true` | Enables doc values for the field. Default is `true`.
`false` | Disables doc values for the field.

---

## Example: Creating an index with `doc_values` enabled and disabled

The following example request creates an index with `doc_values` enabled for one field and disabled for another:

```json
PUT my-index-001
{
  "mappings": {
    "properties": {
      "status_code": { 
        "type": "keyword"
      },
      "session_id": { 
        "type": "keyword",
        "doc_values": false
      }
    }
  }
}
```
{% include copy-curl.html %}
