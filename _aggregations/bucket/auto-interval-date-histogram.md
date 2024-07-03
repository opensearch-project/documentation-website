---
layout: default
title: Auto-date histogram
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 15
---

# Auto-date histogram

The `auto_date_histogram` aggregation automatically creates date histogram buckets based on the time range of your data. This aggregation is particularly useful when you are working with time-series data and want to visualize or analyze data over different time intervals without having to specify the bucket size manually.

To use the `auto_date_histogram` aggregation, you need to specify the field containing the date or timestamp values. Additionally, you can provide optional parameters to customize the behavior of the aggregation.

For example, you can use the `auto_date_histogram` aggregation to :

```json
GET /sample-index/_search
{
  "size": 0,
  "aggs": {
    "histogram": {
      "auto_date_histogram": {
        "field": "timestamp",
        "buckets": 2,
        "minimum_interval": "day",
        "time_zone": "America/Los_Angeles",
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
  "aggregations": {
    "histogram": {
      "buckets": [
        {
          "key_as_string": "2023-04-01 00:00:00",
          "key": 1680332400000,
          "doc_count": 2
        },
        {
          "key_as_string": "2023-04-02 00:00:00",
          "key": 1680418800000,
          "doc_count": 1
        }
      ],
      "interval": "1d"
    }
  }
}
```
{% include copy-curl.html %}
