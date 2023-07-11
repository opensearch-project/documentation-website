---
layout: default
title: Geobounds
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 40
---

## Geobounds aggregations

The `geo_bounds` metric is a multi-value metric aggregation that calculates the bounding box in terms of latitude and longitude around a `geo_point` field.

The following example returns the `geo_bounds` metrics for the `geoip.location` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "geo": {
      "geo_bounds": {
        "field": "geoip.location"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
"aggregations" : {
  "geo" : {
    "bounds" : {
      "top_left" : {
        "lat" : 52.49999997206032,
        "lon" : -118.20000001229346
      },
      "bottom_right" : {
        "lat" : 4.599999985657632,
        "lon" : 55.299999956041574
      }
    }
  }
 }
}
```