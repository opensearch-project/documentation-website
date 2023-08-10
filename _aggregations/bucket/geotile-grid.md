---
layout: default
title: Geotile grid
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 87
redirect_from:
  - /query-dsl/aggregations/bucket/geotile-grid/
---

# Geotile grid aggregations

The geotile grid aggregation groups documents into grid cells for geographical analysis. Each grid cell corresponds to a [map tile](https://en.wikipedia.org/wiki/Tiled_web_map) and is identified using the `{zoom}/{x}/{y}` format. You can aggregate documents on [geopoint]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) or [geoshape]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) fields using a geotile grid aggregation. One notable difference is that a geopoint is only present in one bucket, but a geoshape is counted in all geotile grid cells with which it intersects.

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
      "geotile_grid": {
        "field": "location",
        "precision": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

You can use either the `GET` or `POST` HTTP method for geotile grid aggregation queries.
{: .note}

The response groups all documents together because they are close enough to be bucketed in one grid cell:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 51,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "national_parks",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Yellowstone National Park",
          "location": "44.42, -110.59"
        }
      },
      {
        "_index": "national_parks",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Yosemite National Park",
          "location": "37.87, -119.53"
        }
      },
      {
        "_index": "national_parks",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Death Valley National Park",
          "location": "36.53, -116.93"
        }
      }
    ]
  },
  "aggregations": {
    "grouped": {
      "buckets": [
        {
          "key": "1/0/0",
          "doc_count": 3
        }
      ]
    }
  }
}
```
</details>

## High-precision requests

Now run a high-precision request:

```json
GET national_parks/_search
{
  "aggregations": {
    "grouped": {
      "geotile_grid": {
        "field": "location",
        "precision": 6
      }
    }
  }
}
```
{% include copy-curl.html %}

All three documents are bucketed separately because of higher granularity:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
  
```json
{
  "took": 15,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "national_parks",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Yellowstone National Park",
          "location": "44.42, -110.59"
        }
      },
      {
        "_index": "national_parks",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Yosemite National Park",
          "location": "37.87, -119.53"
        }
      },
      {
        "_index": "national_parks",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Death Valley National Park",
          "location": "36.53, -116.93"
        }
      }
    ]
  },
  "aggregations": {
    "grouped": {
      "buckets": [
        {
          "key": "6/12/23",
          "doc_count": 1
        },
        {
          "key": "6/11/25",
          "doc_count": 1
        },
        {
          "key": "6/10/24",
          "doc_count": 1
        }
      ]
    }
  }
}
```
</details>

You can also restrict the geographical area by providing the coordinates of the bounding envelope in the `bounds` parameter. Both `bounds` and `geo_bounding_box` coordinates can be specified in any of the [geopoint formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats). The following query uses the well-known text (WKT) "POINT(`longitude` `latitude`)" format for the `bounds` parameter:

```json
GET national_parks/_search
{
  "size": 0,
  "aggregations": {
    "grouped": {
      "geotile_grid": {
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

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
  
```json
{
  "took": 48,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "national_parks",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Yellowstone National Park",
          "location": "44.42, -110.59"
        }
      },
      {
        "_index": "national_parks",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Yosemite National Park",
          "location": "37.87, -119.53"
        }
      },
      {
        "_index": "national_parks",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Death Valley National Park",
          "location": "36.53, -116.93"
        }
      }
    ]
  },
  "aggregations": {
    "grouped": {
      "buckets": [
        {
          "key": "6/11/25",
          "doc_count": 1
        },
        {
          "key": "6/10/24",
          "doc_count": 1
        }
      ]
    }
  }
}
```
</details>

The `bounds` parameter can be used with or without the `geo_bounding_box` filter; these two parameters are independent and can have any spatial relationship to each other.

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
      "geotile_grid": {
        "field": "location",
        "precision": 6
      }
    }
  }
}
```
{% include copy-curl.html %}

When aggregating geoshapes, one geoshape can be counted for multiple buckets because it overlaps with multiple grid cells:

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
    "grouped" : {
      "buckets" : [
        {
          "key" : "6/12/23",
          "doc_count" : 1
        },
        {
          "key" : "6/12/22",
          "doc_count" : 1
        },
        {
          "key" : "6/11/25",
          "doc_count" : 1
        },
        {
          "key" : "6/11/24",
          "doc_count" : 1
        },
        {
          "key" : "6/10/24",
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

Geotile grid aggregation requests support the following parameters.

Parameter | Data type | Description
:--- | :--- | :---
field | String | The field that contains the geopoints. This field must be mapped as a `geo_point` field. If the field contains an array, all array values are aggregated. Required.
precision | Integer | The zoom level used to determine grid cells for bucketing results. Valid values are in the [0, 15] range. Optional. Default is 5. 
bounds | Object | The bounding box for filtering geopoints. The bounding box is defined by the upper-left and lower-right vertices. The vertices are specified as geopoints in one of the following formats: <br>- An object with a latitude and longitude<br>- An array in the [`longitude`, `latitude`] format<br>- A string in the "`latitude`,`longitude`" format<br>- A geohash <br>- WKT<br> See the [geopoint formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) for formatting examples. Optional.
size | Integer | The maximum number of buckets to return. When there are more buckets than `size`, OpenSearch returns buckets with more documents. Optional. Default is 10,000.
shard_size | Integer | The maximum number of buckets to return from each shard. Optional. Default is max (10, `size` &middot; number of shards), which provides a more accurate count of more highly prioritized buckets.