---
layout: default
title: Coerce
parent: Mapping parameters

nav_order: 15
has_children: false
has_toc: false
---

# Coerce

The `coerce` mapping parameter controls whether OpenSearch attempts to normalize and convert values to match the field's data type during indexing.

Data is not always consistent. Depending on how it's produced, a number might be rendered as a true JSON number like 10, but it might also be rendered as a string like "10". Similarly, a number that should be an integer might be rendered as a floating point like 10.0 or even as a string like "10.0".

Coercion attempts to transform these inconsistencies to fit the field's data type:

- **Strings are coerced to numbers**: `"10"` becomes `10`.
- **Floating-point numbers are coerced to integers by truncating**: `10.0` becomes `10`.

The `coerce` setting can be updated on existing fields using the update mapping API.
{: .tip}

## Examples

The following examples demonstrate how to use the `coerce` mapping parameter.

### Field-level coercion

Create an index with different coercion settings for comparison. Coercion is enabled by default:

```json
PUT /data_quality_demo
{
  "mappings": {
    "properties": {
      "price_with_coercion": {
        "type": "integer"
      },
      "price_without_coercion": {
        "type": "integer",
        "coerce": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with coercion enabled:

```json
PUT /data_quality_demo/_doc/1
{
  "price_with_coercion": "10"
}
```
{% include copy-curl.html %}

The `price_with_coercion` field will contain the integer `10` because the string `"10"` is coerced to match the integer field type.

Attempt to index a document with coercion disabled:

```json
PUT /data_quality_demo/_doc/2
{
  "price_without_coercion": "10"
}
```
{% include copy-curl.html %}

This document will be rejected because coercion is disabled and the string `"10"` doesn't match the expected integer type.

### Index-level coercion setting

You can set a default coercion policy for the entire index as follows:

```json
PUT /strict_data_index
{
  "settings": {
    "index.mapping.coerce": false
  },
  "mappings": {
    "properties": {
      "flexible_field": {
        "type": "integer",
        "coerce": true
      },
      "strict_field": {
        "type": "integer"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document containing a `flexible_field`:

```json
PUT /strict_data_index/_doc/1
{
  "flexible_field": "10"
}
```
{% include copy-curl.html %}

The `flexible_field` overrides the index-level setting and enables coercion, so the string `"10"` is successfully converted to the integer `10`.

Index another document containing a `strict_field`:

```json
PUT /strict_data_index/_doc/2
{
  "strict_field": "10"
}
```
{% include copy-curl.html %}

This document will be rejected because the `strict_field` inherits the index-level coercion setting (`false`), and the string `"10"` cannot be stored in an integer field without coercion.
