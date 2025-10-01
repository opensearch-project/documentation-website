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

Disabling the `_source` field can impact the availability of certain features, such as the `update`, `update_by_query`, and `reindex` APIs, as well as the ability to debug queries or aggregations using the original indexed document. To support these features without storing the `_source` field explicitly, [Derived source]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/#derived-source) can be used without compromising storage constraints.
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

## Derived source

OpenSearch stores each ingested document in the `_source` field and also indexes individual fields for search. The `_source` field can consume significant storage space. To reduce storage use, you can configure OpenSearch to skip storing the `_source` field and instead reconstruct it dynamically when needed, for example, during `search`, `get`, `mget`, `reindex`, or `update` operations.

To enable derived source, configure the `derived_source` index-level setting:


```json
PUT sample-index1
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
{% include copy-curl.html %}

While skipping the `_source` field can significantly reduce storage requirements, dynamically deriving the source is generally slower than reading a stored `_source`. To avoid this overhead during search queries, do not request the `_source` field when it's not needed. You can do this in the search query by setting the `_source` parameter to `false` (demonstrated in the following example) or providing a list of `include` and `exclude` fields:

```json
GET sample-index1/_search
{
  "_source": false,
  "query": { "match_all": {} }
}
```
{% include copy-curl.html %}

For real-time reads using the [Get Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/get-documents/) or [Multi-get Documents API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/), which are served from the translog until [`refresh`]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/) happens, performance can be slower when using a derived source. This is because the document must first be ingested temporarily before the source can be reconstructed. You can avoid this additional latency by using an index-level `derived_source.translog` setting that disables generating a derived source during translog reads:

```json
PUT sample-index1
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

If this setting is used, you may notice differences in the `_source` content for a document depending on whether it is still in the translog or has been written to a segment.

### Supported fields and parameters

Derived source uses [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) and [`stored_fields`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/store/) to reconstruct the document at query time. Because of the implementation of `doc_values`, the dynamically generated `_source` may differ in format or precision from the original ingested document.

Derived source supports the following field types, with most of them not requiring any changes to field mappings (with some [limitations](#limitations)):

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

For a [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field with derived source enabled, the field value is stored as a stored field by default. You do not need to set the `store` mapping parameter to `true`.
{: .note}

To use the [`wildcard`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/wildcard/) field with a derived source, the mapping parameter [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) must be set to `true`.
{: .note}

### Limitations

Derived source does not support the following fields:

- Fields containing [`copy_to`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/copy-to/) parameters.
- [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) and [`wildcard`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/wildcard/) fields that define either the [`ignore_above`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/ignore-above/) or [`normalizer`]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) parameters.
