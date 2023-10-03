---
layout: default
title: Geodistance
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 70
redirect_from:
  - /query-dsl/aggregations/bucket/geo-distance/
---

# Geodistance aggregations

The `geo_distance` aggregation groups documents into concentric circles based on distances from an origin `geo_point` field.
It's the same as the `range` aggregation, except that it works on geo locations.

For example, you can use the `geo_distance` aggregation to find all pizza places within 1 km of you. The search results are limited to the 1 km radius specified by you, but you can add another result found within 2 km.

You can only use the `geo_distance` aggregation on fields mapped as `geo_point`.

A point is a single geographical coordinate, such as your current location shown by your smart-phone. A point in OpenSearch is represented as follows:

```json
{
  "location": {
    "type": "point",
    "coordinates": {
      "lat": 83.76,
      "lon": -81.2
    }
  }
}
```

You can also specify the latitude and longitude as an array `[-81.20, 83.76]` or as a string `"83.76, -81.20"`

This table lists the relevant fields of a `geo_distance` aggregation:

Field | Description | Required
:--- | :--- |:---
`field` |  Specify the geopoint field that you want to work on. | Yes
`origin` |  Specify the geopoint that's used to compute the distances from. | Yes
`ranges`  |  Specify a list of ranges to collect documents based on their distance from the target point. | Yes
`unit` |  Define the units used in the `ranges` array. The `unit` defaults to `m` (meters), but you can switch to other units like `km` (kilometers), `mi` (miles), `in` (inches), `yd` (yards), `cm` (centimeters), and `mm` (millimeters).  | No
`distance_type` | Specify how OpenSearch calculates the distance. The default is `sloppy_arc` (faster but less accurate), but can also be set to `arc` (slower but most accurate) or `plane` (fastest but least accurate). Because of high error margins, use `plane` only for small geographic areas. | No

The syntax is as follows:

```json
{
  "aggs": {
    "aggregation_name": {
      "geo_distance": {
        "field": "field_1",
        "origin": "x, y",
        "ranges": [
          {
            "to": "value_1"
          },
          {
            "from": "value_2",
            "to": "value_3"
          },
          {
            "from": "value_4"
          }
        ]
      }
    }
  }
}
```

This example forms buckets from the following distances from a `geo-point` field:

- Fewer than 10 km
- From 10 to 20 km
- From 20 to 50 km
- From 50 to 100 km
- Above 100 km

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "position": {
      "geo_distance": {
        "field": "geo.coordinates",
        "origin": {
          "lat": 83.76,
          "lon": -81.2
        },
        "ranges": [
          {
            "to": 10
          },
          {
            "from": 10,
            "to": 20
          },
          {
            "from": 20,
            "to": 50
          },
          {
            "from": 50,
            "to": 100
          },
          {
            "from": 100
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
  "position" : {
    "buckets" : [
      {
        "key" : "*-10.0",
        "from" : 0.0,
        "to" : 10.0,
        "doc_count" : 0
      },
      {
        "key" : "10.0-20.0",
        "from" : 10.0,
        "to" : 20.0,
        "doc_count" : 0
      },
      {
        "key" : "20.0-50.0",
        "from" : 20.0,
        "to" : 50.0,
        "doc_count" : 0
      },
      {
        "key" : "50.0-100.0",
        "from" : 50.0,
        "to" : 100.0,
        "doc_count" : 0
      },
      {
        "key" : "100.0-*",
        "from" : 100.0,
        "doc_count" : 14074
      }
    ]
  }
 }
}
```