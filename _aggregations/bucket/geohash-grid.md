---
layout: default
title: Geohash grid
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 80
redirect_from:
  - /query-dsl/aggregations/bucket/geohash-grid/
---

# Geohash grid aggregations

The `geohash_grid` aggregation buckets documents for geographical analysis. It organizes a geographical region into a grid of smaller regions of different sizes or precisions. Lower values of precision represent larger geographical areas, and higher values represent smaller, more precise geographical areas. You can aggregate documents on [geopoint]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) or [geoshape]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) fields using a geohash grid aggregation. One notable difference is that a geopoint is only present in one bucket, but a geoshape is counted in all geohash grid cells with which it intersects.

The number of results returned by a query might be far too many to display each geopoint individually on a map. The `geohash_grid` aggregation buckets nearby geopoints together by calculating the geohash for each point, at the level of precision that you define (between 1 to 12; the default is 5). To learn more about geohash, see [Wikipedia](https://en.wikipedia.org/wiki/Geohash).

The web logs example data is spread over a large geographical area, so you can use a lower precision value. You can zoom in on this map by increasing the precision value:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "geo_hash": {
      "geohash_grid": {
        "field": "geo.coordinates",
        "precision": 4
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
  "geo_hash" : {
    "buckets" : [
      {
        "key" : "c1cg",
        "doc_count" : 104
      },
      {
        "key" : "dr5r",
        "doc_count" : 26
      },
      {
        "key" : "9q5b",
        "doc_count" : 20
      },
      {
        "key" : "c20g",
        "doc_count" : 19
      },
      {
        "key" : "dr70",
        "doc_count" : 18
      }
      ...
    ]
  }
 }
}
```

You can visualize the aggregated response on a map using OpenSearch Dashboards.

The more accurate you want the aggregation to be, the more resources OpenSearch consumes because of the number of buckets that the aggregation has to calculate. By default, OpenSearch does not generate more than 10,000 buckets. You can change this behavior by using the `size` attribute, but keep in mind that the performance might suffer for very wide queries consisting of thousands of buckets.

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

You can run an aggregation on the `location` field as follows:

```json
GET national_parks/_search
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

When aggregating geoshapes, one geoshape can be counted for multiple buckets because it overlaps multiple grid cells:

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

Currently, OpenSearch supports geoshape aggregation through the API but not in OpenSearch Dashboards visualizations. If you'd like to see geoshape aggregation implemented for visualizations, upvote the related [GitHub issue](https://github.com/opensearch-project/dashboards-maps/issues/250).
{: .note}

## Supported parameters

Geohash grid aggregation requests support the following parameters.

Parameter | Data type | Description
:--- | :--- | :---
field | String | The field on which aggregation is performed. This field must be mapped as a `geo_point` or `geo_shape` field. If the field contains an array, all array values are aggregated. Required.
precision | Integer | The zoom level used to determine grid cells for bucketing results. Valid values are in the [0, 15] range. Optional. Default is 5. 
bounds | Object | The bounding box for filtering geopoints and geoshapes. The bounding box is defined by the upper-left and lower-right vertices. Only shapes that intersect with this bounding box or are completely enclosed by this bounding box are included in the aggregation output. The vertices are specified as geopoints in one of the following formats: <br>- An object with a latitude and longitude<br>- An array in the [`longitude`, `latitude`] format<br>- A string in the "`latitude`,`longitude`" format<br>- A geohash <br>- WKT<br> See the [geopoint formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) for formatting examples. Optional.
size | Integer | The maximum number of buckets to return. When there are more buckets than `size`, OpenSearch returns buckets with more documents. Optional. Default is 10,000.
shard_size | Integer | The maximum number of buckets to return from each shard. Optional. Default is max (10, `size` &middot; number of shards), which provides a more accurate count of more highly prioritized buckets.