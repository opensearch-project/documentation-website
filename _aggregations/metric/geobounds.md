---
layout: default
title: Geobounds
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 40
redirect_from:
  - /query-dsl/aggregations/metric/geobounds/
---

## Geobounds aggregations

The `geo_bounds` metric is a multi-value metric aggregation that calculates the [geographic bounding box](https://docs.ogc.org/is/12-063r5/12-063r5.html#30) containing all values of a given `geo_point` or `geo_shape` field. The bounding box is returned as the upper-left and lower-right vertices of the rectangle in terms of latitude and longitude.

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

## Aggregating geoshapes

To run an aggregation on a geoshape field, first create an index and map the `location` field as a `geo_shape`:

```json
PUT national_parks
{
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_shape"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, index some documents into the `national_parks` index:

```json
PUT national_parks/_doc/1
{
  "name": "Yellowstone National Park",
  "location":
  {"type": "envelope","coordinates": [ [-111.15, 45.12], [-109.83, 44.12] ]}
}
```
{% include copy-curl.html %}

```json
PUT national_parks/_doc/2
{
  "name": "Yosemite National Park",
  "location": 
  {"type": "envelope","coordinates": [ [-120.23, 38.16], [-119.05, 37.45] ]}
}
```
{% include copy-curl.html %}

```json
PUT national_parks/_doc/3
{
  "name": "Death Valley National Park",
  "location": 
  {"type": "envelope","coordinates": [ [-117.34, 37.01], [-116.38, 36.25] ]}
}
```
{% include copy-curl.html %}

You can run a `geo_bounds` aggregation on the `location` field as follows:

```json
GET national_parks/_search
{
  "aggregations": {
    "grouped": {
      "geo_bounds": {
        "field": "location",
        "wrap_longitude": true
      }
    }
  }
}
```
{% include copy-curl.html %}

The optional `wrap_longitude` parameter specifies whether the bounding box returned by the aggregation can overlap the international date line (180&deg; meridian). If `wrap_longitude` is set to `true`, the bounding box can overlap the international date line and return a `bounds` object in which the lower-left longitude is greater than the upper-right longitude. The default value for `wrap_longitude` is `true`.

The response contains the geo-bounding box that encloses all shapes in the `location` field:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 3,
  "timed_out" : false,
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
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "national_parks",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yellowstone National Park",
          "location" : {
            "type" : "envelope",
            "coordinates" : [
              [
                -111.15,
                45.12
              ],
              [
                -109.83,
                44.12
              ]
            ]
          }
        }
      },
      {
        "_index" : "national_parks",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yosemite National Park",
          "location" : {
            "type" : "envelope",
            "coordinates" : [
              [
                -120.23,
                38.16
              ],
              [
                -119.05,
                37.45
              ]
            ]
          }
        }
      },
      {
        "_index" : "national_parks",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "name" : "Death Valley National Park",
          "location" : {
            "type" : "envelope",
            "coordinates" : [
              [
                -117.34,
                37.01
              ],
              [
                -116.38,
                36.25
              ]
            ]
          }
        }
      }
    ]
  },
  "aggregations" : {
    "Grouped" : {
      "bounds" : {
        "top_left" : {
          "lat" : 45.11999997776002,
          "lon" : -120.23000006563962
        },
        "bottom_right" : {
          "lat" : 36.249999976716936,
          "lon" : -109.83000006526709
        }
      }
    }
  }
}
```
</details>

Currently, OpenSearch supports geoshape aggregation through the API but not in OpenSearch Dashboards visualizations. If you'd like to see geoshape aggregation implemented for visualizations, upvote the related [GitHub issue](https://github.com/opensearch-project/dashboards-maps/issues/250).
{: .note}
