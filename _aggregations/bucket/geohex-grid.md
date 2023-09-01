---
layout: default
title: Geohex grid
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 85
redirect_from:
  - /aggregations/geohexgrid/
  - /query-dsl/aggregations/geohexgrid/
  - /query-dsl/aggregations/bucket/geohex-grid/
---

# Geohex grid aggregations

The Hexagonal Hierarchical Geospatial Indexing System (H3) partitions the Earth's areas into identifiable hexagon-shaped cells. 

The H3 grid system works well for proximity applications because it overcomes the limitations of Geohash's non-uniform partitions. Geohash encodes latitude and longitude pairs, leading to significantly smaller partitions near the poles and a degree of longitude near the equator. However, the H3 grid system's distortions are low and limited to 5 partitions of 122. These five partitions are placed in low-use areas (for example, in the middle of the ocean), leaving the essential areas error free. Thus, grouping documents based on the H3 grid system provides a better aggregation than the Geohash grid.

The geohex grid aggregation groups [geopoints]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) into grid cells for geographical analysis. Each grid cell corresponds to an [H3 cell](https://h3geo.org/docs/core-library/h3Indexing/#h3-cell-indexp) and is identified using the [H3Index representation](https://h3geo.org/docs/core-library/h3Indexing/#h3index-representation).

## Precision

The `precision` parameter controls the level of granularity that determines the grid cell size. The lower the precision, the larger the grid cells. 

The following example illustrates low-precision and high-precision aggregation requests.

To start, create an index and map the `location` field as a `geo_point`:

```json
PUT national_parks
{
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_point"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents into the sample index:

```json
PUT national_parks/_doc/1
{
  "name": "Yellowstone National Park",
  "location": "44.42, -110.59" 
}
```
{% include copy-curl.html %}

```json
PUT national_parks/_doc/2
{
  "name": "Yosemite National Park",
  "location": "37.87, -119.53" 
}
```
{% include copy-curl.html %}

```json
PUT national_parks/_doc/3
{
  "name": "Death Valley National Park",
  "location": "36.53, -116.93" 
}
```
{% include copy-curl.html %}

You can index geopoints in several formats. For a list of all supported formats, see the [geopoint documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats). 
{: .note}

## Low-precision requests

Run a low-precision request that buckets all three documents together:

```json
GET national_parks/_search
{
  "aggregations": {
    "grouped": {
      "geohex_grid": {
        "field": "location",
        "precision": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

You can use either the `GET` or `POST` HTTP method for geohex grid aggregation queries.
{: .note}

The response groups documents 2 and 3 together because they are close enough to be bucketed in one grid cell:

```json
{
  "took" : 4,
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
          "location" : "44.42, -110.59"
        }
      },
      {
        "_index" : "national_parks",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yosemite National Park",
          "location" : "37.87, -119.53"
        }
      },
      {
        "_index" : "national_parks",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "name" : "Death Valley National Park",
          "location" : "36.53, -116.93"
        }
      }
    ]
  },
  "aggregations" : {
    "grouped" : {
      "buckets" : [
        {
          "key" : "8129bffffffffff",
          "doc_count" : 2
        },
        {
          "key" : "8128bffffffffff",
          "doc_count" : 1
        }
      ]
    }
  }
}
```

## High-precision requests

Now run a high-precision request:

```json
GET national_parks/_search
{
  "aggregations": {
    "grouped": {
      "geohex_grid": {
        "field": "location",
        "precision": 6
      }
    }
  }
}
```
{% include copy-curl.html %}

All three documents are bucketed separately because of higher granularity:

```json
{
  "took" : 5,
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
          "location" : "44.42, -110.59"
        }
      },
      {
        "_index" : "national_parks",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yosemite National Park",
          "location" : "37.87, -119.53"
        }
      },
      {
        "_index" : "national_parks",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "name" : "Death Valley National Park",
          "location" : "36.53, -116.93"
        }
      }
    ]
  },
  "aggregations" : {
    "grouped" : {
      "buckets" : [
        {
          "key" : "8629ab6dfffffff",
          "doc_count" : 1
        },
        {
          "key" : "8629857a7ffffff",
          "doc_count" : 1
        },
        {
          "key" : "862896017ffffff",
          "doc_count" : 1
        }
      ]
    }
  }
}
```

## Filtering requests

High-precision requests are resource intensive, so we recommend using a filter like `geo_bounding_box` to limit the geographical area. For example, the following query applies a filter to limit the search area:

```json
GET national_parks/_search
{
  "size" : 0,  
  "aggregations": {
    "filtered": {
      "filter": {
        "geo_bounding_box": {
          "location": {
            "top_left": "38, -120",
            "bottom_right": "36, -116"
          }
        }
      },
      "aggregations": {
        "grouped": {
          "geohex_grid": {
            "field": "location",
            "precision": 6
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the two documents that are within the `geo_bounding_box` bounds:

```json
{
  "took" : 4,
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
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "filtered" : {
      "doc_count" : 2,
      "grouped" : {
        "buckets" : [
          {
            "key" : "8629ab6dfffffff",
            "doc_count" : 1
          },
          {
            "key" : "8629857a7ffffff",
            "doc_count" : 1
          }
        ]
      }
    }
  }
}
```

You can also restrict the geographical area by providing the coordinates of the bounding envelope in the `bounds` parameter. Both `bounds` and `geo_bounding_box` coordinates can be specified in any of the [geopoint formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats). The following query uses the well-known text (WKT) "POINT(`longitude` `latitude`)" format for the `bounds` parameter:

```json
GET national_parks/_search
{
  "size": 0,
  "aggregations": {
    "grouped": {
      "geohex_grid": {
        "field": "location",
        "precision": 6,
        "bounds": {
            "top_left": "POINT (-120 38)",
            "bottom_right": "POINT (-116 36)"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains only the two results that are within the specified bounds:

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
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "grouped" : {
      "buckets" : [
        {
          "key" : "8629ab6dfffffff",
          "doc_count" : 1
        },
        {
          "key" : "8629857a7ffffff",
          "doc_count" : 1
        }
      ]
    }
  }
}
```

The `bounds` parameter can be used with or without the `geo_bounding_box` filter; these two parameters are independent and can have any spatial relationship to each other.

## Supported parameters

Geohex grid aggregation requests support the following parameters.

Parameter | Data type | Description
:--- | :--- | :---
field | String | The field that contains the geopoints. This field must be mapped as a `geo_point` field. If the field contains an array, all array values are aggregated. Required.
precision | Integer | The zoom level used to determine grid cells for bucketing results. Valid values are in the [0, 15] range. Optional. Default is 5. 
bounds | Object | The bounding box for filtering geopoints. The bounding box is defined by the upper-left and lower-right vertices. The vertices are specified as geopoints in one of the following formats: <br>- An object with a latitude and longitude<br>- An array in the [`longitude`, `latitude`] format<br>- A string in the "`latitude`,`longitude`" format<br>- A geohash <br>- WKT<br> See the [geopoint formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) for formatting examples. Optional.
size | Integer | The maximum number of buckets to return. When there are more buckets than `size`, OpenSearch returns buckets with more documents. Optional. Default is 10,000.
shard_size | Integer | The maximum number of buckets to return from each shard. Optional. Default is max (10, `size` &middot; number of shards), which provides a more accurate count of more highly prioritized buckets.