---
layout: default
title: Geohash grid
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 80
---

# Geohash grid aggregations

The `geohash_grid` aggregation buckets documents for geographical analysis. It organizes a geographical region into a grid of smaller regions of different sizes or precisions. Lower values of precision represent larger geographical areas and higher values represent smaller, more precise geographical areas.

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

## Supported parameters

Geohash grid aggregation requests support the following parameters.

Parameter | Data type | Description
:--- | :--- | :---
field | String | The field that contains the geopoints. This field must be mapped as a `geo_point` field. If the field contains an array, all array values are aggregated. Required.
precision | Integer | The zoom level used to determine grid cells for bucketing results. Valid values are in the [0, 15] range. Optional. Default is 5. 
bounds | Object | The bounding box for filtering geopoints. The bounding box is defined by the upper-left and lower-right vertices. The vertices are specified as geopoints in one of the following formats: <br>- An object with a latitude and longitude<br>- An array in the [`longitude`, `latitude`] format<br>- A string in the "`latitude`,`longitude`" format<br>- A geohash <br>- WKT<br> See the [geopoint formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) for formatting examples. Optional.
size | Integer | The maximum number of buckets to return. When there are more buckets than `size`, OpenSearch returns buckets with more documents. Optional. Default is 10,000.
shard_size | Integer | The maximum number of buckets to return from each shard. Optional. Default is max (10, `size` &middot; number of shards), which provides a more accurate count of more highly prioritized buckets.