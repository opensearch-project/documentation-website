---
layout: default
title: Geocentroid
parent: Metric aggregations
nav_order: 45
---

# Geocentroid

The `geo_centroid` metric is a multi-value metric that calculates the weighted geographic center or focal point of a set of `geo_point` values. It returns the centroid location as a latitude-longitude pair.

## Parameters

The `geo_centroid` aggregation takes the following parameter:

| Parameter        | Required/Optional | Data type      | Description |
| :--              | :--               | :--            | :--         |
| `field`          | Required          | String         | Name of the field containing the geopoints for which the geocentroid is computed. |

## Example

This example returns the `geo_centroid` for the `geoip.location` of every order in the ecommerce sample data. Each `geoip.location` is a geopoint:


```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "centroid": {
      "geo_centroid": {
        "field": "geoip.location"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response is as follows:

```json
{
  "took": 35,
  "timed_out": false,
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
    "centroid": {
      "location": {
        "lat": 35.54990372113027,
        "lon": -9.079764742533712
      },
      "count": 4675
    }
  }
}
```

The response includes a `centroid` object with `lat` and `lon` properties representing the focal point of all the `geoip.location` points. The centroid location is in the Atlantic Ocean north of Morocco. Interesting but not very meaningful, given the wide geographical dispersion of orders in the database.

## Nesting under other aggregations

You can nest the `geo_centroid` aggregation inside bucket aggregations to calculate the centroid for subsets of your data.

### Example: Nesting under a terms aggregation

You can nest `geo_centroid` aggregations under `terms` buckets of a string field.

To find the centroid location of `geoip` for the orders on each continent, sub-aggregate the centroid within the `geoip.continent_name` field:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "continents": {
      "terms": {
        "field": "geoip.continent_name"
      },
      "aggs": {
        "centroid": {
          "geo_centroid": {
            "field": "geoip.location"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This returns a centroid location for each continent bucket:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 34,
  "timed_out": false,
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
    "continents": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Asia",
          "doc_count": 1220,
          "centroid": {
            "location": {
              "lat": 28.023606536509163,
              "lon": 47.83377046025068
            },
            "count": 1220
          }
        },
        {
          "key": "North America",
          "doc_count": 1206,
          "centroid": {
            "location": {
              "lat": 39.06542286878007,
              "lon": -85.36152573149485
            },
            "count": 1206
          }
        },
        {
          "key": "Europe",
          "doc_count": 1172,
          "centroid": {
            "location": {
              "lat": 48.125767892293325,
              "lon": 2.7529009746915243
            },
            "count": 1172
          }
        },
        {
          "key": "Africa",
          "doc_count": 899,
          "centroid": {
            "location": {
              "lat": 30.780756367941297,
              "lon": 13.464182392125318
            },
            "count": 899
          }
        },
        {
          "key": "South America",
          "doc_count": 178,
          "centroid": {
            "location": {
              "lat": 4.599999985657632,
              "lon": -74.10000007599592
            },
            "count": 178
          }
        }
      ]
    }
  }
}
```
</details>

### Example: Nesting under a `geohash_grid` aggregation

The [`geohash_grid`]({{site.url}}{{site.baseurl}}/aggregations/bucket/geohash-grid/)
aggregation partitions geospatial data into buckets based on [geohash](https://en.wikipedia.org/wiki/Geohash) prefixes.

If a document contains multiple geopoint values in a field, the `geohash_grid` aggregation can assign the entire document to multiple buckets, even if one or more of its geopoints are outside the bucket boundaries. In other words, an entire document is assigned into a bucket if one or more of its points falls in that bucket.

When you nest the `geo_centroid` aggregation under the `geohash_grid` aggregation, each bucket's centroid is calculated using all the geopoints of the field for each document in the bucket, including those that may be outside the bucket. This can result in centroid locations that fall outside the geographic area represented by the bucket.

In this example, the `geohash_grid` aggregation with a `precision` of `3` creates buckets based on geohash prefixes of length `3`. Each document has multiple geopoints, so the `geo_centroid` subaggregation calculates the centroid for each bucket using all geopoints assigned to that bucket, including those outside the bucket boundaries.

Create an index and add documents containing multiple geopoints: 

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

POST /locations/_bulk
{"index": {"_id": 1}}
{"name": "Set A", "coordinates": ["40.7128, -74.0059", "51.5074, -0.1278"]}
{"index": {"_id": 2}}
{"name": "Set B", "coordinates": ["48.8566, 2.3522", "34.0522, -118.2437"]}
```
{% include copy-curl.html %}

Run `geohash_grid` with the `geo_centroid` subaggregation:

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

The response is as follows:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 221,
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
</details>

The result shows four centroids. Note that each point is in a separate grid bucket, but that each centroid is based on all the points in each bucketed document.