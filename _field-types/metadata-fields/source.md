---
layout: default
title: Source
nav_order: 40
parent: Metadata fields
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

## Derived Source

OpenSearch stores ingested document as a `_source` field, along with this, it also indexes the individual fields as well. `_source` takes up the significant space, instead of storing document as it is during ingestion, OpenSearch can derive it dynamically as and when needed during operations like `fetch`, `reindex`, `update` etc. To enable this and skip storing `_source` field without compromising on capabilities which rely on `_source` field, index level setting can be configured.

```json
{
  "settings": {
    "index": {
      "derived_source": {
        "enabled": true
      }
    }
  }
}
```
While this can save up lot of storage space, it is generally slower while dynamically deriving source as compared to directly reading stored `_source`. This can be avoided by not requesting `_source`, when it's not needed in search queries by leveraging `size` parameter.

For realtime reads using [`get`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/get-documents/) or [`mget`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/) APIs served from translog, it is generally slower with derived source as, it first ingests the document temporarily, and then it generated the derived source, this additional latency to ingest the document and generating derived source can be avoided using the addition index level setting. If opted out of derived source for while reading from translog, variation can be observed for the same document when it's in translog vs it gets written to segment. 
```json
{
  "settings": {
    "index": {
      "derived_source": {
        "translog": {
          "enabled": false
        }
      }
    }
  }
}
```

### Supported fields and parameters
Derived source uses [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) and [`stored fields`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/store/) to dynamically derive the `_source`. Due to the nature of [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/), dynamically generated `_source` might differ in display form as compared to ingested document. 
Following field types are supported under derived source without any modification to field mapping with some restrictions.
- [`boolean`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/boolean/)
- [`byte`, `double`, `float`, `half_float`, `integer`, `long`, `short`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/)
- [`date`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/)
- [`date-nanos`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date-nanos/)
- [`geo_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/)
- [`ip`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/ip/)
- [`keyword`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/)
- [`unsigned_long`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/unsigned-long/)
- [`scaled_float`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/)
- [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/)
- [`wildcard`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/wildcard/)

### Restrictions
Fields containing these parameters are not supported for derived source.
1. [`copy_to`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/copy-to/)
2. For [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) and [`wildcard`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/wildcard/) field type, if [`ignore_above`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/ignore-above/) or [`normalizer`]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) parameter is defined


