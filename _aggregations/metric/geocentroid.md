---
layout: default
title: Geocentroid
parent: Metric aggregations
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/geocentroid/
---

# Geocentroid

The OpenSearch `geo_centroid` aggregation is a powerful tool that allows you to calculate the weighted geographic center or focal point of a set of spatial data points. This metric aggregation operates on `geo_point` fields and returns the centroid location as a latitude-longitude pair.

## Using the aggregation

Follow these steps to use the `geo_centroid` aggregation:

**1. Create an index with a `geopoint` field**

First, you need to create an index with a `geo_point` field type. This field stores the geographic coordinates you want to analyze. For example, to create an index called `restaurants` with a `location` field of type `geo_point`, use the following request:

```json
PUT /restaurants
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "location": {
        "type": "geo_point"
      }
    }
  }
}
```
{% include copy-curl.html %}

**2. Index documents with spatial data**

Next, index your documents containing the spatial data points you want to analyze. Make sure to include the `geo_point` field with the appropriate latitude-longitude coordinates. For example, index your documents using the following request:

```json
POST /restaurants/_bulk?refresh
{"index": {"_id": 1}}
{"name": "Cafe Delish", "location": "40.7128, -74.0059"}
{"index": {"_id": 2}}
{"name": "Tasty Bites", "location": "51.5074, -0.1278"}
{"index": {"_id": 3}}
{"name": "Sushi Palace", "location": "48.8566, 2.3522"}
{"index": {"_id": 4}}
{"name": "Burger Joint", "location": "34.0522, -118.2437"}
```
{% include copy-curl.html %}

**3. Run the `geo_centroid` aggregation**

To caluculate the centroid location across all documents, run a search with the `geo_centroid` aggregation on the `geo_point` field. For example, use the following request:

```json
GET /restaurants/_search
{
  "size": 0,
  "aggs": {
    "centroid": {
      "geo_centroid": {
        "field": "location"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes a `centroid` object with `lat` and `lon` properties representing the weighted centroid location of all indexed data point, as shown in the following example:

 ```json
 "aggregations": {
    "centroid": {
      "location": {
        "lat": 43.78224998130463,
        "lon": -47.506300045643
      },
      "count": 4
```
{% include copy-curl.html %}

**4. Nest under other aggregations (optional)**

You can also nest the `geo_centroid` aggregation under other bucket aggregations, such as `terms`, to calculate the centroid for subsets of your data. For example, to find the centroid location for each city, use the following request:

```json
GET /restaurants/_search
{
  "size": 0,
  "aggs": {
    "cities": {
      "terms": {
        "field": "city.keyword"
      },
      "aggs": {
        "centroid": {
          "geo_centroid": {
            "field": "location"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This returns a centroid location for each city bucket, allowing you to analyze the geographic center of data points in different cities.

## Using `geo_centroid` with the `geohash_grid` aggregation

The `geohash_grid` aggregation partitions geospatial data into buckets based on geohash prefixes. 

When a document contains multiple geopoint values in a field, the `geohash_grid` aggregation assigns the document to multiple buckets, even if one or more of its geopoints are outside the bucket boundaries. This behavior is different from how individual geopoints are treated, where only those within the bucket boundaries are considered.

When you nest the `geo_centroid` aggregation under the `geohash_grid` aggregation, each centroid is calculated using all geopoints in a bucket, including those that may be outside the bucket boundaries. This can result in centroid locations that fall outside the geographic area represented by the bucket.

#### Example 

In this example, the `geohash_grid` aggregation with a `precision` of `3` creates buckets based on geohash prefixes of length `3`. Because each document has multiple geopoints, they may be assigned to multiple buckets, even if some of the geopoints fall outside the bucket boundaries.

The `geo_centroid` subaggregation calculates the centroid for each bucket using all geopoints assigned to that bucket, including those outside the bucket boundaries. This means that the resulting centroid locations may not necessarily lie within the geographic area represented by the corresponding geohash bucket.

First, create an index and index documents containing multiple geopoints: 

```json
PUT /locations
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "coordinates": {
        "type": "geo_point"
      }
    }
  }
}

POST /locations/_bulk?refresh
{"index": {"_id": 1}}
{"name": "Point A", "coordinates": ["40.7128, -74.0059", "51.5074, -0.1278"]}
{"index": {"_id": 2}}
{"name": "Point B", "coordinates": ["48.8566, 2.3522", "34.0522, -118.2437"]}
```

Then, run `geohash_grid` with the `geo_centroid` subaggregation:

```json
GET /locations/_search
{
  "size": 0,
  "aggs": {
    "grid": {
      "geohash_grid": {
        "field": "coordinates",
        "precision": 3
      },
      "aggs": {
        "centroid": {
          "geo_centroid": {
            "field": "coordinates"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 26,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "grid": {
      "buckets": [
        {
          "key": "u09",
          "doc_count": 1,
          "centroid": {
            "location": {
              "lat": 41.45439997315407,
              "lon": -57.945750039070845
            },
            "count": 2
          }
        },
        {
          "key": "gcp",
          "doc_count": 1,
          "centroid": {
            "location": {
              "lat": 46.11009998945519,
              "lon": -37.06685005221516
            },
            "count": 2
          }
        },
        {
          "key": "dr5",
          "doc_count": 1,
          "centroid": {
            "location": {
              "lat": 46.11009998945519,
              "lon": -37.06685005221516
            },
            "count": 2
          }
        },
        {
          "key": "9q5",
          "doc_count": 1,
          "centroid": {
            "location": {
              "lat": 41.45439997315407,
              "lon": -57.945750039070845
            },
            "count": 2
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

</details>
