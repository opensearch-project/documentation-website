---
layout: default
title: ignore_malformed 
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 65
has_children: false
has_toc: false
---

# Ignore_malformed

The `ignore_malformed` parameter allows you to handle issues caused by malformed data. When `ignore_malformed` is enabled for a field, and a document contains malformed data for that field, OpenSearch ignores the malformed field, not indexing it, and processes and indexes all other fields in the document normally.

---

## Example: Ignoring a malformed field

The following example request sets `ignore_malformed` to `true` for the `user_id` and `signup_date` fields. If a document is indexed with a non-integer `user_id` or an invalid date format for `signup_date`, those fields are ignored, but the rest of the document is indexed:

```json
PUT /my_index
{
  "settings": {
    "index.mapping.ignore_malformed": true
  },
  "mappings": {
    "properties": {
      "user_id": { "type": "integer" },
      "email": { "type": "keyword" },
      "signup_date": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Updating existing mappings

The following example request updates the `ignore_malformed` setting on an existing field:

```json
PUT /my_index/_mapping
{
  "properties": {
    "user_id": {
      "ignore_malformed": false
    }
  }
}
```
{% include copy-curl.html %}
