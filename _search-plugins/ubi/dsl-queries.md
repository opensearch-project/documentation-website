---
layout: default
title: Example UBI query DSL queries
parent: User Behavior Insights
has_children: false
nav_order: 15
---

# Example UBI query DSL queries

You can use the OpenSearch search query language, [query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/), to write User Behavior Insights (UBI) queries. The following example returns the number of times that each `action_name` event occurs.
For more extensive analytic queries, see [Example UBI SQL queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/). 
#### Example request
```json
GET ubi_events/_search
{
  "size":0, 
  "aggs":{ 
    "event_types":{
      "terms": {
        "field":"action_name", 
        "size":10
      }
    }
  }
}
```
{% include copy.html %}

#### Example response

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
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "event_types": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "brand_filter",
          "doc_count": 3084
        },
        {
          "key": "product_hover",
          "doc_count": 3068
        },
        {
          "key": "button_click",
          "doc_count": 3054
        },
        {
          "key": "product_sort",
          "doc_count": 3012
        },
        {
          "key": "on_search",
          "doc_count": 3010
        },
        {
          "key": "type_filter",
          "doc_count": 2925
        },
        {
          "key": "login",
          "doc_count": 2433
        },
        {
          "key": "logout",
          "doc_count": 1447
        },
        {
          "key": "new_user_entry",
          "doc_count": 207
        }
      ]
    }
  }
}
```
{% include copy.html %}

You can run the preceding queries in the OpenSearch Dashboards [Dev Tools]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/) console.
