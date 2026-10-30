---
layout: default
title: Norms
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/norms/
nav_order: 200
has_children: false
has_toc: false
---

# Norms mapping parameter

The `norms` mapping parameter controls whether OpenSearch stores normalization factors for a field. During relevance scoring, OpenSearch uses these factors to account for field length: a query term that matches a short field value contributes more to the score than the same term in a long value. For example, if a `review` field has norms enabled, a search for `tent` scores the review `Great tent` higher than a 15-word review that also contains `tent`. If norms are disabled, both reviews receive the same score.

Norms take disk space. For each field that has norms enabled, OpenSearch stores up to 1 byte for every document that contains the field. The actual size can be smaller when many values have similar lengths. Disable norms on fields that you use for filtering, sorting, or aggregations but not for relevance scoring, or on fields for which the value length should not affect relevance.

By default, `norms` is enabled on `text` fields, for which relevance scoring is important, and disabled on `keyword` fields, which are typically used for filtering.

## Disabling norms on a field

The following request creates an index named `products` containing the `description` field of type `text` with `norms` disabled:

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

To add a field with `norms` disabled to an existing index, use the following request:

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

## Changing norms on an existing field

You cannot enable `norms` on a field that has `norms` disabled. OpenSearch rejects the mapping update.

Do not disable `norms` on a field that already contains indexed values. OpenSearch accepts the mapping update, but afterward it rejects every document that contains a value for the field. Closing and reopening the index or deleting the existing documents does not resolve the issue. To disable norms on a field that contains data, create an index containing the new mapping and [reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) your documents into it.
{: .warning}
