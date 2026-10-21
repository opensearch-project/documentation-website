---
layout: default
title: Doc values
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/doc-values/
nav_order: 25
has_children: false
has_toc: false
---

# Doc values mapping parameter

The `doc_values` mapping parameter controls whether OpenSearch stores a field's values in doc values, an on-disk structure organized by document. OpenSearch builds doc values at index time and uses them for operations that need a field's value for each matching document: sorting, aggregations, and accessing field values in scripts.

Searching uses a different structure. The inverted index maps each term to the documents that contain it, which makes it fast to find documents for a query but slow to look up the value of a field in a given document. Doc values store the same values as the `_source` field, but in columns, one per field, so OpenSearch can read the value for any document without parsing `_source`.

Doc values are enabled by default for all field types that support them. The `text` field type does not support doc values, and OpenSearch ignores `doc_values` in a `text` field mapping. To sort or aggregate on text, add a [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/) subfield or, less commonly, enable [field data]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/field-data/).

If you do not sort, aggregate, or run scripts on a field, you can disable doc values to reduce disk usage. A field with doc values disabled can still be searched. Note the following considerations before disabling doc values:

- You cannot change `doc_values` for an existing field. To enable or disable doc values later, you must reindex your data into a new index.
- [Derived source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/#derived-source) reconstructs `_source` from doc values and stored fields. OpenSearch rejects a derived source mapping that disables both `doc_values` and [`store`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) for a field.

The reverse trade-off is also possible for numeric fields. If you set [`index`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-parameter/) to `false` on a numeric field but keep doc values, OpenSearch can still search the field by scanning its doc values. Such queries are slower than queries on indexed fields, so this configuration suits fields that are mainly aggregated and only occasionally searched.

## Example: Disabling doc values on a lookup field

The following request creates an index in which the `response_code` field uses the default doc values, so you can sort and aggregate on it. The `request_id` field has doc values disabled because each value is unique and is only used to look up individual requests:

```json
PUT /web_analytics
{
  "mappings": {
    "properties": {
      "response_code": {
        "type": "keyword"
      },
      "request_id": {
        "type": "keyword",
        "doc_values": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Add some sample data to the index:

```json
PUT /web_analytics/_doc/1
{
  "response_code": "200",
  "request_id": "req-7f3a"
}
```
{% include copy-curl.html %}

```json
PUT /web_analytics/_doc/2
{
  "response_code": "404",
  "request_id": "req-91c2"
}
```
{% include copy-curl.html %}

```json
PUT /web_analytics/_doc/3?refresh=true
{
  "response_code": "200",
  "request_id": "req-b04e"
}
```
{% include copy-curl.html %}

Perform an aggregation on the `response_code` field:

```json
GET /web_analytics/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response_code"
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregation returns a bucket for each response code:

```json
{
  "took": 4,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "response_codes": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "200",
          "doc_count": 2
        },
        {
          "key": "404",
          "doc_count": 1
        }
      ]
    }
  }
}
```

Attempt to aggregate on the `request_id` field:

```json
GET /web_analytics/_search
{
  "size": 0,
  "aggs": {
    "request_counts": {
      "terms": {
        "field": "request_id"
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch rejects the request because `request_id` has no doc values from which to read each document's value. Sorting on `request_id` fails for the same reason. However, you can still search the field. For example, a `term` query for `req-91c2` returns document 2.
