---
layout: default
title: Optimizing composite aggregations with early termination
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 35
---

# Optimizing composite aggregations with early termination

Composite aggregations can be optimized for better performance by using the early termination feature. Early termination stops processing the aggregation as soon as it has found all the relevant buckets.

## Setting the index sort 

To enable early termination, you need to set the `sort.field` and `sort.order` settings on your index. These settings define the order in which the documents are sorted in the index, which should match the order of the sources in your composite aggregation.

The following example request shows how to set the index sort when creating an index, sorting by `username` in ascending order and then by the `timestamp` field in descending order: 

```json
PUT my-index
{
  "settings": {
    "index": {
      "sort.field": ["username", "timestamp"],
      "sort.order": ["asc", "desc"]
    }
  },
  "mappings": {
    "properties": {
      "username": {
        "type": "keyword",
        "doc_values": true
      },
      "timestamp": {
        "type": "date"
      }
    }
  }
}
```
{% include copy-curl.html %}


## Ordering sources

For optimal early termination, composite aggregation sources should be ordered to match the index sort, with higher cardinality sources placed first, followed by lower cardinality sources. The field order within the aggregation must align with the index sort order. 

For example, if the index is sorted by `username` (ascending) and then `timestamp` (descending), your composite aggregation should have the same order similar the following query:

```json
GET /my-index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "user_name": { "terms": { "field": "username" } } },
          { "date": { "date_histogram": { "field": "timestamp", "calendar_interval": "1d", "order": "desc" } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 10,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "buckets": []
    }
  }
}
```
{% include copy-curl.html %}

## Disabling total hit tracking

To further optimize performance, you can disable the tracking of total hits by setting `track_total_hits` to `false` in your query. This prevents OpenSearch from calculating the total number of matching documents for every page of results. Note that if you need to know the total number of matching documents, you can retrieve it from the first request and skip the calculation for subsequent requests. See the following example query:

```json
GET /my-index/_search
{
  "size": 0,
  "track_total_hits": false,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "user_name": { "terms": { "field": "username" } } },
          { "date": { "date_histogram": { "field": "timestamp", "calendar_interval": "1d", "order": "desc" } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 13,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "buckets": []
    }
  }
}
```
{% include copy-curl.html %}

## Additional considerations

Keep in the following considerations in mind when working with this feature:

- Multi-valued fields cannot be used for early termination, so it is recommended to place them last in the `sources` array.
- Index sorting can potentially slow down indexing operations, so it is important to test the impact of index sorting on your specific use case and dataset.
- If the index is not sorted, composite aggregations will still attempt early termination if the query matches all documents, for example, a `match_all` query.
