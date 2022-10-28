---
layout: default
title: GeoHex grid aggregations
parent: Aggregations
nav_order: 4
has_children: false
---

# GeoHex grid aggregations

The Hexagonal hierarchical geospatial indexing system (H3) partitions the Earth's areas into identifiable hexagon-shaped cells. 

The H3 grid system works well for proximity applications, because it overcomes the shortcomings of geohash's non-uniform partitions. Geohash encodes latitude and longitude pairs, leading to significantly smaller partitions near the poles and a degree of longitude near the equator. However, the H3 grid system's distortions are low and limited to five partitions of 122. These five partitions are placed in low-use areas (for example, in the middle of the ocean), leaving the essential areas error-free. Thus, grouping documents based on the H3 grid system provides a better aggregation than the geohash grid.

The GeoHex grid aggregation groups [geopoints]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) into grid cells for geographical analysis. Each grid cell corresponds to an [H3 cell](https://h3geo.org/docs/core-library/h3Indexing/#h3-cell-indexp) and is identified using the [H3Index representation](https://h3geo.org/docs/core-library/h3Indexing/#h3index-representation).

## Precision

The `precision` parameter controls the level of granularity that determines the grid cell size. The lower the precision, the larger the grid cells. 

The following example illustrates low-precision and high-precision aggregation requests.

To start, create an index and map the `location` field as geopoint:

```json
PUT testindex
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

Index the following documents into the sample index:

```json
PUT testindex/_doc/1
{
  "name": "Yellowstone National Park",
  "location": "44.42, -110.59" 
}

PUT testindex/_doc/2
{
  "name": "Yosemite National Park",
  "location": "37.87, -119.53" 
}

PUT testindex/_doc/3
{
  "name": "Death Valley National Park",
  "location": "36.53, -116.93" 
}
```

You can index geopoints in several formats. For a list of all supported formats, see the [geopoint documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/). 
{: .note}

## Low-precision requests

Run a low-precision request that should bucket all three documents together:

```json
GET testindex/_search
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

You can use either `GET` or `POST` HTTP method for GeoHex grid aggregation queries.
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
        "_index" : "testindex",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yellowstone National Park",
          "location" : "44.42, -110.59"
        }
      },
      {
        "_index" : "testindex",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yosemite National Park",
          "location" : "37.87, -119.53"
        }
      },
      {
        "_index" : "testindex",
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

Now run a higher precision request:

```json
GET testindex/_search
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
        "_index" : "testindex",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yellowstone National Park",
          "location" : "44.42, -110.59"
        }
      },
      {
        "_index" : "testindex",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "Yosemite National Park",
          "location" : "37.87, -119.53"
        }
      },
      {
        "_index" : "testindex",
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

High-precision requests are resource-intensive, so we recommend to use a filter like `geo_bounding_box` to limit the geographical area. For example, the following query applies a filter to limit the search area:

```json
GET testindex1/_search
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

## Supported parameters

GeoHex grid aggregation requests support the following parameters.

Field | Data Type | Description
:--- | :--- | :---
field | String | The field that contains the geopoints. This field must be mapped as a `geo_point` field. If the field contains an array, all array values are aggregated. Required.
precision | Integer | The zoom level used to determine grid cells for bucketing results. Valid values are in the [0, 15] range. Default is 5. 
bounds | Object | The bounding box for filtering geopoints. The bounding box is defined by the top left and bottom right vertices. The vertices are specified as geopoints in one of the following formats: <br>- An object with a latitude and longitude<br>- An array in the [`longitude`, `latitude`] format<br>- A string in the "`latitude`,`longitude`" format<br>- A geohash <br>- Well-known text (WKT).<br> See the [geopoint documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) for format examples. Optional.
size | Integer | The maximum number of buckets to return. When there are more buckets than `size`, OpenSearch returns buckets with more documents. Optional. Default is 10,000.
shard_size | Integer | The maximum number of buckets to return from each shard. Optional. Default is max (10, `size` &middot; number of shards), which gives a more accurate count of higher prioritized buckets.