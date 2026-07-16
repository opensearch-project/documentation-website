---
layout: default
title: Field data
parent: Mapping parameters
nav_order: 50
has_children: false
has_toc: false
---

# Field data

By default, `text` fields cannot be used for sorting, aggregations, or scripting. The inverted index that powers full-text search maps terms to documents but does not provide the per-document field values that sorting and aggregations need. Attempting to aggregate or sort on a `text` field returns an error suggesting you use a `keyword` field instead.

The `fielddata` mapping parameter loads analyzed tokens into a heap-resident data structure, making `text` fields available for sorting, aggregations, and scripting. OpenSearch constructs this structure on demand when the field is first accessed for one of these operations.

Because field data operates on analyzed tokens, aggregating a text field produces buckets for individual terms (for example, "open" and "source") rather than the original multi-word values (for example, "Open Source"). If you need to aggregate on exact values that are not analyzed, use a `keyword` field instead.
{: .note}

Field data can consume a significant amount of heap memory because it loads all unique tokens for the field across all documents in the segment and remains in memory for the lifetime of that segment. In most cases, using a [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/) subfield in [multi-fields]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/fields/) is a better approach than enabling field data.
{: .warning}

## Example

The following example creates an index with `fielddata` enabled on a text field:

```json
PUT /fielddata_test
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fielddata": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Index some documents:

```json
POST /fielddata_test/_bulk?refresh=true
{"index":{}}
{"title":"OpenSearch performance tuning"}
{"index":{}}
{"title":"OpenSearch security configuration"}
{"index":{}}
{"title":"OpenSearch index management"}
```
{% include copy-curl.html %}

With `fielddata` enabled, you can aggregate on the analyzed tokens of the `title` field:

```json
GET /fielddata_test/_search
{
  "size": 0,
  "aggs": {
    "top_terms": {
      "terms": {
        "field": "title",
        "size": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns buckets for the individual analyzed tokens (not the full field value):

```json
{
  "took" : 3,
  "timed_out" : false,
  "terminated_early" : true,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "top_terms" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 2,
      "buckets" : [
        {
          "key" : "opensearch",
          "doc_count" : 3
        },
        {
          "key" : "configuration",
          "doc_count" : 1
        },
        {
          "key" : "index",
          "doc_count" : 1
        },
        {
          "key" : "management",
          "doc_count" : 1
        },
        {
          "key" : "performance",
          "doc_count" : 1
        }
      ]
    }
  }
}
```

The `fielddata` setting is dynamically updatable. You can enable it on an existing field without reindexing:

```json
PUT /fielddata_test/_mapping
{
  "properties": {
    "title": {
      "type": "text",
      "fielddata": true
    }
  }
}
```
{% include copy-curl.html %}

## Field data frequency filter

The `fielddata_frequency_filter` parameter reduces memory usage by loading only tokens whose document frequency falls within a specified range. Tokens that are extremely common (such as stop words) or extremely rare (such as typos) are excluded from field data, reducing heap consumption while still supporting most aggregation use cases.

The following table lists the `fielddata_frequency_filter` parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `min` | Required | Float | The minimum document frequency (as a ratio between 0 and 1) for a token to be loaded. Tokens appearing in fewer documents than this threshold are excluded. |
| `max` | Required | Float | The maximum document frequency (as a ratio between 0 and 1) for a token to be loaded. Tokens appearing in more documents than this threshold are excluded. |
| `min_segment_size` | Optional | Integer | The minimum number of documents a segment must contain for the frequency filter to apply. Smaller segments load all tokens regardless of frequency. Default is `0`. |

The following example loads only tokens that appear in between 1% and 50% of documents, and only applies this filter to segments with at least 100 documents:

```json
PUT /my-index
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "fielddata": true,
        "fielddata_frequency_filter": {
          "min": 0.01,
          "max": 0.5,
          "min_segment_size": 100
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
