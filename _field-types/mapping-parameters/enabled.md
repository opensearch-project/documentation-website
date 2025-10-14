---
layout: default
title: Enabled
parent: Mapping parameters

nav_order: 40
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/enabled/
---

# Enabled

The `enabled` parameter allows you to control whether OpenSearch parses the contents of a field. This parameter can be applied to the top-level mapping definition and to object fields.

The `enabled` parameter accepts the following values. 

Parameter | Description
:--- | :---
`true` | The field is parsed and indexed. Default is `true`.
`false` | The field is not parsed or indexed but is still retrievable from the `_source` field. When `enabled` is set to `false`, OpenSearch stores the field's value in the `_source` field but does not index or parse its contents. This can be useful for fields that you want to store but do not need to search, sort, or aggregate on.

---

## Example: Using the `enabled` parameter

In the following example request, the `session_data` field is disabled. OpenSearch stores its contents in the `_source` field but does not index or parse them:

```json
PUT my-index-002
{
  "mappings": {
    "properties": {
      "user_id": {
        "type": "keyword"
      },
      "last_updated": {
        "type": "date"
      },
      "session_data": {
        "type": "object",
        "enabled": false
      }
    }
  }
}
```
{% include copy-curl.html %}
