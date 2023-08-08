---
layout: default
title: Date histogram
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 20
redirect_from:
  - /query-dsl/aggregations/bucket/date-histogram/
---

# Date histogram aggregations

The `date_histogram` aggregation uses [date math]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#date-math) to generate histograms for time-series data.

For example, you can find how many hits your website gets per month:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "logs_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
"aggregations" : {
  "logs_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595
      }
    ]
  }
}
}
```

The response has three months worth of logs. If you graph these values, you can see the peak and valleys of the request traffic to your website month over month.
