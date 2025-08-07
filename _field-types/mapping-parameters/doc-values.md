---
layout: default
title: Doc values
parent: Mapping parameters

nav_order: 25
has_children: false
has_toc: false
---

# doc_values

By default, OpenSearch indexes most fields for search purposes. The `doc_values ` parameter enables document-to-term lookups for operations such as sorting, aggregations, and scripting.

The `doc_values` parameter accepts the following options.

Option | Description
:--- | :---
`true` | Enables `doc_values` for the field. Default is `true`.
`false` | Disables `doc_values` for the field.

The `doc_values` parameter is not supported for use in text fields.

For more information on using `doc_values` with the `index` parameter, see [The `index` and `doc_values` parameters compared]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/index-parameter/#the-index-and-doc-values-parameters-compared).

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
