---
layout: default
title: Geocentroid
parent: Metric aggregations
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/geocentroid/
---

# Geocentroid

The `geo_centroid` aggregation calculates the geographic center or focal point of a set of `geo_point` values. It returns the centroid location as a latitude-longitude pair.

## Parameters

The `geo_centroid` aggregation takes the following parameter.

| Parameter        | Required/Optional | Data type      | Description |
| :--              | :--               | :--            | :--         |
| `field`          | Required          | String         | The name of the field containing the geopoints for which the geocentroid is computed. |

## Example

The following example returns the `geo_centroid` for the `geoip.location` of every order in the e-commerce sample data. Each `geoip.location` is a geopoint:


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

The response includes a `centroid` object with `lat` and `lon` properties representing the centroid location of all indexed data points:

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

The centroid location is in the Atlantic Ocean north of Morocco. This is not very meaningful, given the wide geographical dispersion of orders in the database.

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

This returns a centroid location for each continent's bucket:

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
