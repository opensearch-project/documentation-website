---
layout: default
title: Auto-date histogram
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 15
---

# Auto-date histogram

The `auto_date_histogram` aggregation automatically creates date histogram buckets based on the time range of your data. This aggregation is particularly useful when you are working with time-series data and want to visualize or analyze data over different time intervals without specifying the bucket size manually.

To use the `auto_date_histogram` aggregation, you need to specify the field containing the date or timestamp values. Additionally, you can provide optional parameters to customize the behavior of the aggregation.

For example, you can use the following `auto_date_histogram` aggregation to create date-based buckets:

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

The accepted units for the `minimum_interval` parameter are `year`, `month`, `day`, `hour`, `minute`, and `second`.

The `auto_date_histogram` aggregation does not try to use an interval shorter than the one specified in the `minimum_interval` parameter.

The following example response shows that the `auto_date_histogram` aggregation has generated a set of date-based buckets for the data in the `sample-index` index. The response shows two buckets, each representing a single day.

#### Response: Automated date bucketing  
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
