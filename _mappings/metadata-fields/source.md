---
layout: default
title: Source
parent: Metadata fields
nav_order: 70
redirect_from:
  - /field-types/metadata-fields/source/
---

# Source metadata field

The `_source` field contains the original JSON document body that was indexed. While this field is not searchable, it is stored so that the full document can be returned when executing fetch requests, such as `get` and `search`.

## Disabling the field

Storing `_source` increases the size of the index. If you never need to retrieve the original documents, you can disable the `_source` field by setting the `enabled` parameter to `false`, as shown in the following example request:

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

Without `_source`, search and get requests return document metadata, such as `_id`, but not the document content. Fields remain searchable and can be used in aggregations.

Disabling `_source` limits what you can do with the index later. Without `_source`, OpenSearch cannot provide the following features:

- The [Update Document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/), [Update by Query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/), and [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) APIs, which read documents from `_source`. Because you cannot reindex, you also cannot move the data into a new index to change its mappings or analyzers.
- [Highlighting]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/) for fields that are not stored separately. A search that requests highlighting returns no highlights for these fields. To highlight a field, set its [`store`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) parameter to `true`.
- Viewing the original document to troubleshoot why a query or aggregation returns unexpected results.

You cannot enable or disable `_source` for an existing index. To support these features without storing the `_source` field explicitly, use [derived source](#derived-source). To reduce storage without removing `_source`, use a more compact [index codec]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/).
{: .warning}

Disabling `_source` is most suitable for indexes that contain many small documents consisting only of numbers, dates, and keywords, such as metrics. These documents are typically never updated or reindexed, and searches on them return aggregations. In this case, disabling `_source` reduces disk usage and input/output.

## Including or excluding fields

You can selectively control the contents of the `_source` field by using the `includes` and `excludes` parameters. OpenSearch indexes the complete document but removes the specified fields from `_source` before storing it. Both parameters accept wildcard patterns. The following request creates an index that stores only request counts and host information in `_source` and removes the host notes and tags:

```json
PUT app-metrics
{
  "mappings": {
    "_source": {
      "includes": [
        "*.count",
        "host.*"
      ],
      "excludes": [
        "host.notes",
        "host.tags.*"
      ]
    }
  }
}
```
{% include copy-curl.html %}

Index a document into the index:

```json
PUT app-metrics/_doc/1?refresh=true
{
  "requests": {
    "count": 42,
    "path": "/checkout"
  },
  "host": {
    "name": "web-01",
    "notes": "Rebooted after kernel update",
    "tags": {
      "rack": "r12",
      "zone": "us-east-1a"
    }
  }
}
```
{% include copy-curl.html %}

The fields removed from `_source` are still indexed, so you can search them. The following request searches the excluded `host.tags.zone` field:

```json
GET app-metrics/_search
{
  "query": {
    "match": {
      "host.tags.zone": "us-east-1a"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the document, but its `_source` includes only `host.name` and `requests.count`. The `requests.path` field is removed because it matches no `includes` pattern, and the `tags` object is empty because all of its fields are excluded:

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.39229372,
    "hits": [
      {
        "_index": "app-metrics",
        "_id": "1",
        "_score": 0.39229372,
        "_source": {
          "host": {
            "name": "web-01",
            "tags": {}
          },
          "requests": {
            "count": 42
          }
        }
      }
    ]
  }
}
```

The Update Document, Update by Query, and Reindex APIs rebuild documents from the stored `_source`, so they drop the removed fields. For example, after you update any field in the preceding document, the `host.tags.zone` field is no longer indexed, and the search no longer matches the document. As with the `enabled` parameter, you cannot change `includes` or `excludes` for an existing index. To omit fields from search results without removing them from storage, use [source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering) in the search request.
{: .warning}

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
{% include copy-curl.html %}

If this setting is used, the `_source` content may differ depending on whether it is still in the translog or has been written to a segment.

### Supported fields and parameters

Derived source uses [`doc_values`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) and [`stored_fields`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) to reconstruct the document at query time. Because of the implementation of `doc_values`, the dynamically generated `_source` may differ in format or precision from the original ingested document.

Derived source supports the following field types, with most of them not requiring any changes to field mappings (with some [limitations](#limitations)):

- [`boolean`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/boolean/)
- [`byte`, `double`, `float`, `half_float`, `integer`, `long`, `short`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)
- [`date`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/)
- [`date_nanos`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date-nanos/)
- [`geo_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/)
- [`ip`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/ip/)
- [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/)
- [`unsigned_long`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/unsigned-long/)
- [`scaled_float`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/)
- [`text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/)
- [`wildcard`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/wildcard/)

For a [`text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/) field with derived source enabled, the field value is stored as a stored field by default. You do not need to set the `store` mapping parameter to `true`.
{: .note}

To use the [`wildcard`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/wildcard/) field with a derived source, the mapping parameter [`doc_values`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) must be set to `true`.
{: .note}

### Limitations

Derived source does not support the following fields:

- Fields containing [`copy_to`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/copy-to/) parameters.
- [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) and [`wildcard`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/wildcard/) fields that define either the [`ignore_above`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/ignore-above/) or [`normalizer`]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) parameters.
- Nested fields.
