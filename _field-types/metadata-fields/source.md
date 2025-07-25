---
layout: default
title: Source
nav_order: 40
parent: Metadata fields
canonical_url: https://docs.opensearch.org/latest/field-types/metadata-fields/source/
---

# Source

The `_source` field contains the original JSON document body that was indexed. While this field is not searchable, it is stored so that the full document can be returned when executing fetch requests, such as `get` and `search`.

## Disabling the field

You can disable the `_source` field by setting the `enabled` parameter to `false`, as shown in the following example request:

```json
PUT sample-index1
{
  "mappings": {
    "_source": {
      "enabled": false
    }
  }
}
```
{% include copy-curl.html %}

Disabling the `_source` field can impact the availability of certain features, such as the `update`, `update_by_query`, and `reindex` APIs, as well as the ability to debug queries or aggregations using the original indexed document.
{: .warning}

## Including or excluding fields

You can selectively control the contents of the `_source` field by using the `includes` and `excludes` parameters. This allows you to prune the stored `_source` field after it is indexed but before it is saved, as shown in the following example request:

```json
PUT logs
{
  "mappings": {
    "_source": {
      "includes": [
        "*.count",
        "meta.*"
      ],
      "excludes": [
        "meta.description",
        "meta.other.*"
      ]
    }
  }
}
```
{% include copy-curl.html %}

These fields are not stored in the `_source`, but you can still search them because the data remains indexed.
