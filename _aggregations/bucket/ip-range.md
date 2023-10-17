---
layout: default
title: IP range
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 110
redirect_from:
  - /query-dsl/aggregations/bucket/ip-range/
---

# IP range aggregations

The `ip_range` aggregation is for IP addresses.
It works on `ip` type fields. You can define the IP ranges and masks in the [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "access": {
      "ip_range": {
        "field": "ip",
        "ranges": [
          {
            "from": "1.0.0.0",
            "to": "126.158.155.183"
          },
          {
            "mask": "1.0.0.0/8"
          }
        ]
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
  "access" : {
    "buckets" : [
      {
        "key" : "1.0.0.0/8",
        "from" : "1.0.0.0",
        "to" : "2.0.0.0",
        "doc_count" : 98
      },
      {
        "key" : "1.0.0.0-126.158.155.183",
        "from" : "1.0.0.0",
        "to" : "126.158.155.183",
        "doc_count" : 7184
      }
    ]
  }
 }
}
```

If you add a document with malformed fields to an index that has `ip_range` set to `false` in its mappings, OpenSearch rejects the entire document. You can set `ignore_malformed` to `true` to specify that OpenSearch should ignore malformed fields. The default is `false`.

```json
...
"mappings": {
  "properties": {
    "ips": {
      "type": "ip_range",
      "ignore_malformed": true
    }
  }
}
```