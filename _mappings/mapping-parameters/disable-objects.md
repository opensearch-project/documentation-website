---
layout: default
title: Disable objects
parent: Mapping parameters
nav_order: 27
has_children: false
has_toc: false
---

# Disable objects

By default, OpenSearch interprets field names containing dots (`.`) as hierarchical object paths. For example, a field named `metrics.cpu.usage` is expanded into a nested object structure with `metrics` as the top-level object containing a `cpu` object, which in turn contains a `usage` field.

This behavior can cause mapping conflicts in analytics and metrics workloads where dotted names represent flat field identifiers rather than nested objects. For example, many ingestion pipelines generate flat metric-style fields such as `metrics.cpu.usage`, `metrics.cpu.idle`, or `system.memory.free`. Without intervention, OpenSearch's automatic expansion of these dotted fields into nested objects can cause mapping conflicts when the same path prefix is used as both a value field and an object, non-deterministic failures depending on ingestion order, and bulk ingestion instability.

The `disable_objects` mapping parameter prevents this expansion. When enabled, dotted field names are stored as literal flat identifiers, nested JSON input is automatically flattened into dotted field names at ingestion time, and ingestion order does not affect mapping results.

The `disable_objects` parameter can be set at multiple levels. When multiple levels are configured, the following precedence applies (highest to lowest):

1. Field level
2. Object level
3. Index-level mapping definition (`"mappings": { "disable_objects": true }`)
4. Global default (`false`)

## Parameters

The following table lists the values accepted by the `disable_objects` parameter.

Parameter | Description
:--- | :---
`false` (Default) | Dotted field names are expanded into nested object structures.
`true` | Dotted field names are treated as literal flat field identifiers. No object mappers are created for intermediate path segments.

## Example: Index-level configuration

To enable flat dotted field semantics for an entire index, set `disable_objects` at the index level of the mappings definition:

```json
PUT /metrics-index
{
  "mappings": {
    "disable_objects": true
  }
}
```
{% include copy-curl.html %}

The following request indexes a document using a dotted field name:

```json
POST /metrics-index/_doc
{
  "metrics.cpu.usage": 0.82
}
```
{% include copy-curl.html %}

The field `metrics.cpu.usage` is stored as a single flat field. No object mapper is created for `metrics` or `metrics.cpu`.

The following request indexes a document using nested JSON:

```json
POST /metrics-index/_doc
{
  "metrics": {
    "cpu": {
      "usage": 0.65
    }
  }
}
```
{% include copy-curl.html %}

The nested input is automatically flattened to `metrics.cpu.usage` and set to `0.65`, producing the same flat field as the previous document.

The following request retrieves the mapping to confirm that no nested objects were created:

```json
GET /metrics-index/_mapping
```
{% include copy-curl.html %}

The response shows that `metrics.cpu.usage` is stored as a flat field:

```json
{
  "metrics-index": {
    "mappings": {
      "properties": {
        "metrics.cpu.usage": {
          "type": "float"
        }
      }
    }
  }
}
```

## Example: Object-level configuration

To apply flat semantics only to fields under a specific object, set `disable_objects` on that object field:

```json
PUT /my-index
{
  "mappings": {
    "properties": {
      "metrics": {
        "type": "object",
        "disable_objects": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Only fields under `metrics` are treated as flat dotted fields. Other fields in the index retain the default object expansion behavior.

## Example: Field-level configuration

To override index-level and object-level defaults, apply `disable_objects` to a specific field:

```json
PUT /my-index
{
  "mappings": {
    "properties": {
      "metrics.cpu.usage": {
        "type": "float",
        "disable_objects": true
      }
    }
  }
}
```
{% include copy-curl.html %}

## Searching dotted fields

When `disable_objects` is enabled, OpenSearch supports both full-path and short-name searches on dotted fields. Because dotted fields are stored as flat literal identifiers rather than nested objects, search behavior differs from the default object expansion mode: both full-path and short-name searches resolve to the same flat field.

### Full-path search

For a full-path search, provide the full dotted field name in the query:

```json
POST /metrics-index/_search
{
  "query": {
    "term": {
      "metrics.cpu.usage": {
        "value": 0.82
      }
    }
  }
}
```
{% include copy-curl.html %}

### Short-name search

For a short-name search, provide only the last segment of the field name in the query:

```json
POST /metrics-index/_search
{
  "query": {
    "term": {
      "usage": {
        "value": 0.82
      }
    }
  }
}
```
{% include copy-curl.html %}

When using short-name searches, ambiguity can arise if multiple dotted fields share the same last segment. For example, if an index contains both `metrics.cpu.usage` and `metrics.memory.usage`, a short-name search for `usage` may not resolve to the intended field. In such cases, use the full field path to avoid ambiguity.
{: .note}

## Limitations

The following limitations apply to the `disable_objects` parameter:

- The `disable_objects` parameter cannot be changed after index creation.
- Nested queries and object-based field grouping are not supported when `disable_objects` is enabled.
- When a concrete field name (for example, `address`) shares a prefix with an existing dotted field (for example, `address.city`), both are stored as independent flat fields. No conflict occurs because no object mapper is created for the shared prefix.

## Related documentation

- [Object field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/object/)
- [Flat object field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/flat-object/)
- [Nested field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/)
