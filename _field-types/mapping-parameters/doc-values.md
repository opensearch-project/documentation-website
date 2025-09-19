---
layout: default
title: Doc values
parent: Mapping parameters

nav_order: 25
has_children: false
has_toc: false
---

# Doc values

Most fields are indexed by default, making them searchable through the inverted index. The inverted index allows queries to look up search terms in a unique sorted list of terms and immediately access the list of documents containing those terms.

However, sorting, aggregations, and accessing field values in scripts require a different data access pattern. Instead of looking up terms to find documents, these operations need to look up documents to find the terms they contain in specific fields.

Doc values are the on-disk data structure, built at document index time, that makes this document-to-field access pattern possible. They store the same values as the `_source` field but in a column-oriented fashion that is much more efficient for sorting and aggregations.

Doc values are supported on almost all field types, with the notable exception of `text` fields.

All fields that support doc values have them enabled by default. If you're certain you won't need to sort or aggregate on a field, or access the field value from a script, you can disable doc values to save disk space.

## Examples

### Basic doc_values configuration

Create an index with doc_values enabled and disabled for different fields:

```json
PUT /web_analytics
{
  "mappings": {
    "properties": {
      "status_code": {
        "type": "keyword"
      },
      "session_id": {
        "type": "keyword",
        "doc_values": false
      }
    }
  }
}
```
{% include copy-curl.html %}

In this configuration:
- The `status_code` field has doc_values enabled by default, supporting sorting and aggregations
- The `session_id` field has doc_values disabled but can still be queried normally

### Demonstrating the impact of doc_values

Add some sample data to the index:

```json
PUT /web_analytics/_doc/1
{
  "status_code": "200",
  "session_id": "abc123"
}

PUT /web_analytics/_doc/2
{
  "status_code": "404",
  "session_id": "def456"
}

PUT /web_analytics/_doc/3
{
  "status_code": "200",
  "session_id": "ghi789"
}
```
{% include copy-curl.html %}

Perform an aggregation on the field with doc_values enabled:

```json
GET /web_analytics/_search
{
  "size": 0,
  "aggs": {
    "status_codes": {
      "terms": {
        "field": "status_code"
      }
    }
  }
}
```
{% include copy-curl.html %}

This aggregation works because `status_code` has doc_values enabled.

Attempt to aggregate on the field with doc_values disabled:

```json
GET /web_analytics/_search
{
  "size": 0,
  "aggs": {
    "session_counts": {
      "terms": {
        "field": "session_id"
      }
    }
  }
}
```
{% include copy-curl.html %}

This aggregation will fail because `session_id` has doc_values disabled, preventing the document-to-field lookup required for aggregations.
