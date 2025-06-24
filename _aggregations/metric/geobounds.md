---
layout: default
title: Geobounds
parent: Metric aggregations
nav_order: 40
redirect_from:
  - /query-dsl/aggregations/metric/geobounds/
canonical_url: https://docs.opensearch.org/docs/latest/aggregations/metric/geobounds/
---

# Geobounds aggregation

The `geo_bounds` aggregation is a multi-value aggregation that calculates the [geographic bounding box](https://docs.ogc.org/is/12-063r5/12-063r5.html#30) encompassing a set of [`geo_point`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/geo-point/) or [`geo_shape`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/geo-shape/) objects. The bounding box is returned as the upper-left and lower-right vertices of the rectangle given as a decimal-encoded latitude-longitude (lat-lon) pair.

## Parameters

The `geo_bounds` aggregation takes the following parameters.

| Parameter        | Required/Optional | Data type      | Description |
| :--              | :--               | :--            | :--         |
| `field`          | Required          | String         | The name of the field containing the geopoints or geoshapes for which the geobounds are computed. |
| `wrap_longitude` | Optional          | Boolean        | Whether to allow the bounding box to overlap the international date line. Default is `true`. |

## Example

The following example returns the `geo_bounds` for the `geoip.location` of every order in the e-commerce sample data (each `geoip.location` is a geopoint):

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
{% include copy-curl.html %}

## Example response

As shown in the following example response, the aggregation returns the `geobounds` containing all geopoints in the `geoip.location` field:

```json
{
  "took": 16,
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
    "geo": {
      "bounds": {
        "top_left": {
          "lat": 52.49999997206032,
          "lon": -118.20000001229346
        },
        "bottom_right": {
          "lat": 4.599999985657632,
          "lon": 55.299999956041574
        }
      }
    }
  }
}
```

## Aggregating geoshapes

You can run a `geo_bounds` aggregation on geoshapes.

Prepare an example by inserting an index containing a geoshape field:

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

Ingest documents into the index. GeoJSON input specifies longitude first:

```json
POST _bulk
{ "create": { "_index": "national_parks", "_id": "1" } }
{"name": "Yellowstone National Park", "location": {"type": "envelope","coordinates": [ [-111.15, 45.12], [-109.83, 44.12] ]}}
{ "create": { "_index": "national_parks", "_id": "2" } }
{ "name": "Yosemite National Park", "location": {"type": "envelope","coordinates": [ [-120.23, 38.16], [-119.05, 37.45] ]} }
{ "create": { "_index": "national_parks", "_id": "3" } }
{ "name": "Death Valley National Park", "location": {"type": "envelope","coordinates": [ [-117.34, 37.01], [-116.38, 36.25] ]} }
{ "create": { "_index": "national_parks", "_id": "4" } }
{ "name": "War In The Pacific National Historic Park Guam", "location": {"type": "point","coordinates": [144.72, 13.47]} }
```
{% include copy-curl.html %}

Run a `geo_bounds` aggregation on the `location` field:

```json
GET national_parks/_search
{
  "size": 0,
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

The response contains the smallest geo-bounding box that encloses all shapes in the `location` field:

```json
{
  "took": 8,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "grouped": {
      "bounds": {
        "top_left": {
          "lat": 45.11999997776002,
          "lon": 144.71999991685152
        },
        "bottom_right": {
          "lat": 13.469999986700714,
          "lon": -109.83000006526709
        }
      }
    }
  }
}
```

## Wrapping longitude

If the optional `wrap_longitude` parameter is set to `true`, the bounding box can overlap the international date line (180&deg; meridian) and return a `bounds` object in which the upper-left longitude is greater than the lower-right longitude. The default value for `wrap_longitude` is `true`.

Rerun the `geo_bounds` aggregation on the national parks geoshape with `wrap_longitude` set to `false`:

```json
GET national_parks/_search
{
  "size": 0,
  "aggregations": {
    "grouped": {
      "geo_bounds": {
        "field": "location",
        "wrap_longitude": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Note that the new resulting geobound encompasses a larger area to avoid overlapping the dateline:

```json
{
...
  "aggregations": {
    "grouped": {
      "bounds": {
        "top_left": {
          "lat": 45.11999997776002,
          "lon": -120.23000006563962
        },
        "bottom_right": {
          "lat": 13.469999986700714,
          "lon": 144.71999991685152
        }
      }
    }
  }
}
```

OpenSearch supports geoshape aggregation through the API but not in OpenSearch Dashboards visualizations.
{: .note}
