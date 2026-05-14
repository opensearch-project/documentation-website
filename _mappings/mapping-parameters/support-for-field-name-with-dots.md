---
layout: default
title: Support for field name with dots in OpenSearch
parent: Mapping parameters
nav_order: 27
has_children: false
has_toc: false
---

# Support for field name with dots in OpenSearch

By default, OpenSearch interprets field names containing dots (`.`) as hierarchical object paths. For example, a field named `metrics.cpu.usage` is expanded into a nested object structure with `metrics` as the top-level object containing a `cpu` object, which in turn contains a `usage` field.

While this behavior is appropriate for structured JSON documents, it can cause issues in analytics and metrics workloads where dotted names are intended to be literal flat field identifiers. The `disable_objects` mapping parameter allows dotted fields to be treated as standalone flat fields, ensuring deterministic ingestion behavior.

## Parameters

The `disable_objects` parameter accepts the following values.

Parameter | Description
:--- | :---
`false` (Default) | Dotted field names are expanded into nested object structures.
`true` | Dotted field names are treated as literal flat field identifiers. No object mappers are created for intermediate path segments.

The `disable_objects` parameter cannot be changed after index creation.
{: .warning}

## Motivation

Many ingestion pipelines generate flat metric-style fields such as `metrics.cpu.usage`, `metrics.cpu.idle`, or `system.memory.free`. Without `disable_objects`, OpenSearch's automatic expansion of dotted fields into nested objects can cause:

- Mapping conflicts when the same path prefix is used as both a value field and an object
- Non-deterministic failures depending on ingestion order
- Bulk ingestion instability
- Object versus scalar conflicts

Enabling `disable_objects` ensures:

- Literal dotted field handling
- Auto-flattening of nested object input into dotted field names
- Ingestion-sequence agnosticism
- Deterministic mappings regardless of document structure or ingest order

## Behavior

When `disable_objects` is set to `true`:

- Dotted field names are stored as exact literal field identifiers.
- Nested JSON input is automatically flattened into dotted field names at ingestion time.
- No implicit object mappers are created.
- Ingestion order does not affect mapping results.

---

## Example: Index-level configuration

Enable flat dotted field semantics for an entire index by setting `index.mapping.disable_objects` in the index settings:

```json
PUT /metrics-index
{
  "settings": {
    "index.mapping.disable_objects": true
  }
}
```
{% include copy-curl.html %}

Index a document using a dotted field name:

```json
POST /metrics-index/_doc
{
  "metrics.cpu.usage": 0.82
}
```
{% include copy-curl.html %}

The field `metrics.cpu.usage` is stored as a single flat field. No object mapper is created for `metrics` or `metrics.cpu`.

Index a document using nested JSON:

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

The nested input is automatically flattened to `metrics.cpu.usage = 0.65`, producing the same flat field as the previous document.

Verify the mapping to confirm that no nested objects were created:

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

---

## Example: Object-level configuration

Apply `disable_objects` to a specific object field so that only fields under that object use flat semantics:

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

---

## Example: Field-level configuration

Apply `disable_objects` to a specific field to override index-level and object-level defaults:

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

This overrides any index-level or object-level setting for the `metrics.cpu.usage` field.

---

## Example: Ingestion-order independence

When `disable_objects` is enabled, ingestion order does not affect mapping results. Consider the following two documents:

Document A:

```json
POST /metrics-index/_doc
{
  "foo": "value"
}
```
{% include copy-curl.html %}

Document B:

```json
POST /metrics-index/_doc
{
  "foo.bar": "value2"
}
```
{% include copy-curl.html %}

Without `disable_objects`, the ingestion order determines whether the index succeeds or fails:

- If document A is indexed first, `foo` is mapped as a text field. Indexing document B then fails because `foo.bar` would require `foo` to be an object.
- If document B is indexed first, `foo` is mapped as an object. Indexing document A then fails because `foo` cannot be both an object and a scalar.

With `disable_objects` set to `true`, both documents are indexed successfully regardless of order:

- `foo` is stored as a standalone field.
- `foo.bar` is stored as a separate standalone field.
- No implicit object creation occurs, so no structural conflicts arise.

---

## Auto-flattening

When `disable_objects` is set to `true`, OpenSearch automatically flattens nested JSON input into dotted field names at ingestion time. This means the following two documents produce identical results:

Flat input:

```json
POST /metrics-index/_doc
{
  "metrics.cpu.usage": 0.82
}
```
{% include copy-curl.html %}

Nested input:

```json
POST /metrics-index/_doc
{
  "metrics": {
    "cpu": {
      "usage": 0.82
    }
  }
}
```
{% include copy-curl.html %}

Both documents are stored with the flat field `metrics.cpu.usage`. This ensures consistent representation regardless of how the document is structured at ingest time.

---

## Configuration precedence

The `disable_objects` parameter can be set at multiple levels. When multiple levels are configured, the following precedence applies (highest to lowest):

1. Field-level
2. Object-level
3. Index-level (`index.mapping.disable_objects`)
4. Global default (`false`)

---

## Searching dotted fields

When `disable_objects` is enabled, OpenSearch supports both qualified (full path) and unqualified (short name) searches on dotted fields. However, because dotted fields are stored as flat literal identifiers rather than nested objects, search behavior differs from the default object expansion mode.

### Qualified search

You can search using the full dotted field name:

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

### Unqualified search

Unqualified (short name) searches are also supported. For example, if a field is mapped as `metrics.cpu.usage`, you can search using the leaf portion:

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

Both qualified and unqualified searches resolve to the same flat field.
{: .note}

### Limitation: Field name ambiguity with unqualified searches

When using unqualified searches, ambiguity can arise if multiple dotted fields share the same leaf name. For example, if an index contains both `metrics.cpu.usage` and `metrics.memory.usage`, an unqualified search for `usage` may not resolve to the intended field. In such cases, always use the fully qualified field name to avoid ambiguity.
{: .warning}

---

## Compatibility and limitations

- The default behavior remains unchanged. Existing indexes are not affected.
- Index templates may specify the `disable_objects` setting.
- Dynamic mappings honor literal field semantics when `disable_objects` is enabled.
- The `disable_objects` parameter cannot be changed after index creation.
- Nested queries and object-based field grouping are not supported when `disable_objects` is enabled.
- When a concrete field name (for example, `address`) shares a prefix with an existing dotted field (for example, `address.city`), both are stored as independent flat fields. No conflict occurs because no object mapper is created for the shared prefix.

---

## When to use `disable_objects`

Enable `disable_objects` when:

- Indexing metrics or time-series data with dotted field identifiers
- Migrating analytics pipelines that use flat field naming conventions
- Avoiding mapping conflicts from mixed input styles (flat and nested)
- Ensuring ingestion-order independence for bulk operations

Keep the default behavior (`disable_objects: false`) when:

- Modeling hierarchical JSON documents
- Using nested queries
- Relying on object-based field grouping
