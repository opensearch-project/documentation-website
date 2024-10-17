---
layout: default
title: format 
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 55
has_children: false
has_toc: false
---

# Format

The `format` parameter is used in mapping to specify how date values should be parsed and formatted in JSON documents. In OpenSearch, dates are represented as strings, and the `format` parameter allows you to define how these strings should be interpreted.

OpenSearch provides a set of preconfigured formats to recognize and parse date strings into long values representing milliseconds-since-the-epoch in UTC. Custom date formats can be specified using the `yyyy/MM/dd` syntax. See [Date field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/) for more information.

---

## Example: Mapping various date fields

The following example request shows different date formats:

```json
PUT my_index-003
{
  "mappings": {
    "properties": {
      "created_at": {
        "type": "date",
        "format": "strict_date_optional_time||epoch_millis"
      },
      "updated_at": {
        "type": "date",
        "format": "yyyy-MM-dd'T'HH:mm:ss.SSSZ||epoch_millis"
      },
      "release_date": {
        "type": "date",
        "format": "yyyy-MM-dd||MM/dd/yyyy"
      },
      "expiration_date": {
        "type": "date",
        "format": "strict_date||epoch_second"
      },
      "last_login": {
        "type": "date",
        "format": "basic_date_time||epoch_millis"
      }
    }
  }
}
```
{% include copy-curl.html %}
