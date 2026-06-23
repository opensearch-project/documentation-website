---
layout: default
title: Geohash grid
parent: Bucket aggregations
nav_order: 80
redirect_from:
  - /query-dsl/aggregations/bucket/geohash-grid/
---

# Geohash grid aggregations

The `geohash_grid` aggregation groups documents into grid cells based on their [geohash](https://en.wikipedia.org/wiki/Geohash) value. Each cell is labeled with its geohash string, and the precision parameter controls cell size---lower precision values produce fewer, larger cells, while higher values produce many smaller cells. You can aggregate documents on [geo_point]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) or [geo_shape]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) fields. A geo_point is placed in exactly one cell, while a geo_shape is counted in every cell it intersects.

Precision values range from 1 to 12. High-precision requests can consume significant memory and produce large responses because they generate many buckets. Filter to a small geographic area before using high precision values.
{: .note}

## Parameters

The `geohash_grid` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The field to aggregate on. Must be mapped as `geo_point` or `geo_shape`. |
| `precision` | Optional | Integer or String | The geohash length controlling cell size. Valid integer values are 1--12. You can also specify an approximate distance (for example, `1km` or `10m`), and OpenSearch selects the precision level whose cells do not exceed that size. Default is `5`. |
| `bounds` | Optional | Object | A bounding box that restricts which points are considered. Only points within the box are aggregated. Accepts all [geo_point formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats). |
| `size` | Optional | Integer | The maximum number of buckets to return. When there are more buckets than `size`, buckets with the highest document counts are returned. Default is `10000`. |
| `shard_size` | Optional | Integer | The maximum number of buckets returned from each shard. Default is max(10, `size` × number of shards). |

## Example: Low-precision grid

The following example groups ecommerce customer locations into geohash cells at precision 4 (approximately 39 km × 19.5 km):

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "geo_hash": {
      "geohash_grid": {
        "field": "geoip.location",
        "precision": 4
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: High-precision grid with bounding box filter

When zooming into a specific region, first filter documents to that area before requesting high precision. The following example uses a `geo_bounding_box` query to narrow to the New York City area, then aggregates at precision 7 (approximately 153 m × 152 m):

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "zoomed_in": {
      "filter": {
        "geo_bounding_box": {
          "geoip.location": {
            "top_left": "41.0, -74.5",
            "bottom_right": "40.5, -73.5"
          }
        }
      },
      "aggs": {
        "detailed_grid": {
          "geohash_grid": {
            "field": "geoip.location",
            "precision": 7
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The following response corresponds to the high-precision example:

```json
{
  "took": 23,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "zoomed_in": {
      "doc_count": 896,
      "detailed_grid": {
        "buckets": [
          {
            "key": "dr72h56",
            "doc_count": 747
          },
          {
            "key": "dr5rs14",
            "doc_count": 149
          }
        ]
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array | The grid cell buckets, ordered by `doc_count` descending. |
| `buckets.key` | String | The geohash string identifying the cell. |
| `buckets.doc_count` | Integer | The number of documents (or geoshape intersections) in this cell. |

You can use a returned geohash key as both the `top_left` and `bottom_right` of a `geo_bounding_box` query to zoom into that cell at a higher precision. Client-side geohash libraries (such as [ngeohash](https://github.com/sunng87/node-geohash) for JavaScript) can decode bucket keys into lat/lon bounding boxes for map rendering.
{: .tip}

## Aggregating geoshapes

To run an aggregation on a geoshape field, first create an index and map the `location` field as a `geo_shape`:

```json
PUT /national_parks
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
PUT /national_parks/_doc/1
{
  "name": "Yellowstone National Park",
  "location":
  {"type": "envelope","coordinates": [ [-111.15, 45.12], [-109.83, 44.12] ]}
}
```
{% include copy-curl.html %}

```json
PUT /national_parks/_doc/2
{
  "name": "Yosemite National Park",
  "location": 
  {"type": "envelope","coordinates": [ [-120.23, 38.16], [-119.05, 37.45] ]}
}
```
{% include copy-curl.html %}

```json
PUT /national_parks/_doc/3
{
  "name": "Death Valley National Park",
  "location": 
  {"type": "envelope","coordinates": [ [-117.34, 37.01], [-116.38, 36.25] ]}
}
```
{% include copy-curl.html %}

You can run an aggregation on the `location` field as follows:

```json
GET /national_parks/_search
{
  "aggregations": {
    "grouped": {
      "geohash_grid": {
        "field": "location",
        "precision": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

A geoshape can appear in multiple buckets when it spans more than one grid cell:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
  
```json
{
  "took" : 24,
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
    "grouped" : {
      "buckets" : [
        {
          "key" : "9",
          "doc_count" : 3
        },
        {
          "key" : "c",
          "doc_count" : 1
        }
      ]
    }
  }
}
```
</details>

OpenSearch supports geoshape aggregation through the API but not in OpenSearch Dashboards visualizations.
{: .note}

## Geohash precision

The following table lists the approximate cell dimensions at each precision level. Cell dimensions vary with latitude; the values shown represent the widest case at the equator.

Precision /<br>geohash length | Latitude bits | Longitude bits | Latitude error | Longitude error | Cell height | Cell width
:---:|:-------------:|:--------------:|:--------------:|:---------------:|:-----------:|:----------:
  1  |       2       |       3        |      ±23       |       ±23       |  4992.6 km  | 5009.4 km  
  2  |       5       |       5        |      ±2.8      |      ±5.6       |  624.1 km   | 1252.3 km  
  3  |       7       |       8        |     ±0.70      |      ±0.70      |   156 km    |  156.5 km  
  4  |      10       |       10       |     ±0.087     |      ±0.18      |   19.5 km   |  39.1 km   
  5  |      12       |       13       |     ±0.022     |     ±0.022      |   4.9 km    |   4.9 km   
  6  |      15       |       15       |    ±0.0027     |     ±0.0055     |   609.4 m   |   1.2 km   
  7  |      17       |       18       |    ±0.00068    |    ±0.00068     |   152.5 m   |  152.9 m   
  8  |      20       |       20       |    ±0.00086    |    ±0.000172    |    19 m     |   38.2 m   
  9  |      22       |       23       |   ±0.000021    |    ±0.000021    |    4.8 m    |   4.8 m    
 10  |      25       |       25       |  ±0.00000268   |   ±0.00000536   |   59.5 cm   |   1.2 m    
 11  |      27       |       28       |  ±0.00000067   |   ±0.00000067   |   14.9 cm   |  14.9 cm   
 12  |      30       |       30       |  ±0.00000008   |   ±0.00000017   |   1.9 cm    |   3.7 cm   
