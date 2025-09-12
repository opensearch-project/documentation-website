---
layout: default
title: Index sorting
nav_order: 25
---

# Index sorting

OpenSearch allows you to configure how documents are organized within each segment at index creation time. By default, Lucene applies no sorting to documents. The `index.sort.*` settings specify how documents are organized within each segment.

The sorting behavior is controlled by the `index.sort.field`, `index.sort.order`, `index.sort.mode`, and `index.sort.missing` settings. For more information, see [Static index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings#index-sort-settings).

Index sorting can only be configured during index creation and cannot be modified afterward. This feature impacts indexing performance because documents must be sorted during flush and merge operations. We recommend testing the performance impact of sorting before implementing it in production.
{: .note}

Nested fields cannot be used with index sorting because they require nested documents to be stored with consecutive document IDs, which index sorting can disrupt. Attempting to enable index sorting on an index containing nested fields results in an error.
{: .note}

## Sorting by a single field

The following example sorts the index by the `timestamp` field in descending order:

```json
PUT /sample-index
{
  "settings": {
    "index": {
      "sort.field": "timestamp",
      "sort.order": "desc"
    }
  },
  "mappings": {
    "properties": {
      "timestamp": {
        "type": "date"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Sorting by multiple fields

You can also sort by multiple fields, with priority given to the first field. The following example sorts documents first by `category` in ascending order, then by `timestamp` in descending order:

```json
PUT /sample-index
{
  "settings": {
    "index": {
      "sort.field": [
        "category",
        "timestamp"
      ],
      "sort.order": [
        "asc",
        "desc"
      ]
    }
  },
  "mappings": {
    "properties": {
      "category": {
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

## Search optimization with early termination

When your index sort configuration matches your search sort criteria, OpenSearch can optimize query performance by limiting the number of documents examined per segment. This optimization is particularly effective for retrieving top-ranked results.

Consider an index sorted by timestamp in descending order:

```json
PUT /events
{
  "settings": {
    "index": {
      "sort.field": "timestamp",
      "sort.order": "desc"
    }
  },
  "mappings": {
    "properties": {
      "timestamp": {
        "type": "date"
      }
    }
  }
}
```
{% include copy-curl.html %}

To retrieve the 10 most recent events, use the following request:

```json
GET /events/_search
{
  "size": 10,
  "sort": [
    {
      "timestamp": "desc"
    }
  ]
}
```
{% include copy-curl.html %}

OpenSearch recognizes that the segment documents are already sorted and only examines the first 10 documents per segment, while still collecting remaining documents for total count and aggregations.

If you don't need the total hit count, disable hit tracking for maximum performance:

```json
GET /events/_search
{
    "size": 10,
    "sort": [
        { "timestamp": "desc" }
    ],
    "track_total_hits": false
}
```
{% include copy-curl.html %}

This allows OpenSearch to terminate collection after finding the required number of documents per segment.

Aggregations process all matching documents regardless of the `track_total_hits` setting.
{: .note}

## Optimizing conjunction queries

Index sorting can improve the performance of conjunction queries (AND operations) by organizing document IDs to group documents that match similar criteria. This organization helps skip large ranges of documents that don't match the query conditions.

This technique works best with low-cardinality fields that are frequently used in filters. Sort priority should favor fields with both low cardinality and high filter frequency. The sort direction (ascending or descending) doesn't matter for this optimization.

For example, when indexing vehicle listings, you might sort by fuel type, body style, manufacturer, year, and finally mileage to optimize common filter combinations.
