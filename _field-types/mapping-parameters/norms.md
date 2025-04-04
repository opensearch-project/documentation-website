---
layout: default
title: Norms
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 120
has_children: false
has_toc: false
---

# Norms

The `norms` mapping parameter controls whether normalization factors are computed and stored for a field. These factors are used during query scoring to adjust the relevance of the search results, however, storing `norms` increases the index size and consumes additional memory.

By default, `norms` are enabled on `text` fields where relevance scoring is important. Fields that do not require these scoring features are configured with `norms` disabled, such as `keyword` fields used only for filtering.

## Disabling norms on a field

The following request creates an index named `products` with the `description` field as a `text` field with `norms` disabled:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "norms": false
      }
    }
  }
}
```
{% include copy-curl.html %}

You can disable `norms` on a field in an existing index using the following command:

```json
PUT /products/_mapping
{
  "properties": {
    "review": {
      "type": "text",
      "norms": false
    }
  }
}
```
{% include copy-curl.html %}

Enabling `norms` on a field which has `norms` disabled is not possible. This will generate the following error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "illegal_argument_exception",
        "reason": "Mapper for [description] conflicts with existing mapper:\n\tCannot update parameter [norms] from [false] to [true]"
      }
    ],
    "type": "illegal_argument_exception",
    "reason": "Mapper for [description] conflicts with existing mapper:\n\tCannot update parameter [norms] from [false] to [true]"
  },
  "status": 400
}
```