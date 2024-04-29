---
layout: default
title: Source
nav_order: 40
has_children: false
parent: Metadata fields
---

# Source

The `_source` field contains the original JSON document body that was passed at index time. This field is not indexed and is not searchable but is stored so that it can be returned when executing fethc requests such as `get` and `search`.

## Disabling the field

You can disable the `_source` field as shown in the following example:

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

Disabling the `_source` field can cause certain featues to become not supported, such as `update`, `update_by_query`, and `reindex` APIs and the ability to debug queries or aggregations by using the the original document at index time.
{: .warning}

## Including or excluding fields

You can prune contents of the `_source` field after the document has been indexed but before the field is stored. You can use the `includes` and excludes` parameters to control which field are included in the stored `_source` field, as shown in the following example:

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

Although these fields are not stored in the `_source`, you can still search on them, as the data is still indexed.
