---
layout: default
title: Geodistance
parent: Bucket aggregations
nav_order: 70
redirect_from:
  - /query-dsl/aggregations/bucket/geo-distance/
---

# Geodistance aggregations

The `geo_distance` aggregation groups documents into distance-based rings around a central point. Each range defines a ring, and documents are placed into buckets based on how far their `geo_point` field value is from the specified origin. This is conceptually similar to the [`range` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/range/) but operates on geographic coordinates rather than numeric values.

The target field must be mapped as `geo_point`. If a document's geo_point field contains multiple values, all distances are evaluated and the document is bucketed accordingly.

## Parameters

The `geo_distance` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The `geo_point` field to compute distances from. |
| `origin` | Required | Object, String, or Array | The center point from which distances are measured. Accepts object format (`{"lat": 40.71, "lon": -74.00}`), string format (`"40.71, -74.00"`), or GeoJSON array format (`[-74.00, 40.71]`). |
| `ranges` | Required | Array | A list of distance ranges defining the buckets. Each range can include `from`, `to`, and optionally `key`. |
| `unit` | Optional | String | The unit for distance values in `ranges`. Default is `m` (meters). Valid values: `m`, `km`, `mi`, `yd`, `in`, `cm`, `mm`. |
| `distance_type` | Optional | String | The algorithm used to compute distances. <br>Valid values are:<br> - `arc`: Computes distances using the full spherical geometry of the Earth. Most accurate but slowest. <br> - `plane`: Projects coordinates onto a flat plane and computes Euclidean distances. Fastest but least accurate. Only suitable for small geographic areas (approximately 5 km or less). <br><br>Default is `arc`.  |
| `keyed` | Optional | Boolean | When `true`, returns buckets as an object keyed by range name instead of an array. Default is `false`. |

## Example: Basic distance rings

The following example groups e-commerce orders into three distance rings around New York City, measured in miles:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "distance_from_nyc": {
      "geo_distance": {
        "field": "geoip.location",
        "origin": "40.7128, -74.0060",
        "unit": "mi",
        "ranges": [
          { "to": 50 },
          { "from": 50, "to": 500 },
          { "from": 500 }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Keyed response with custom range names

Setting `keyed` to `true` returns buckets as an object instead of an array. You can assign custom names to each range using the `key` property:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "distance_from_nyc": {
      "geo_distance": {
        "field": "geoip.location",
        "origin": "40.7128, -74.0060",
        "unit": "mi",
        "keyed": true,
        "ranges": [
          { "to": 50, "key": "local" },
          { "from": 50, "to": 500, "key": "domestic" },
          { "from": 500, "key": "international" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The following response corresponds to the keyed example:

```json
{
  "took": 18,
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
    "distance_from_nyc": {
      "buckets": {
        "local": {
          "from": 0.0,
          "to": 50.0,
          "doc_count": 896
        },
        "domestic": {
          "from": 50.0,
          "to": 500.0,
          "doc_count": 0
        },
        "international": {
          "from": 500.0,
          "doc_count": 3779
        }
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array or Object | The distance buckets. Returned as an array by default, or as an object when `keyed` is `true`. |
| `buckets.key` | String | The auto-generated range label (for example, `*-500.0` or `500.0-3000.0`), or a custom key if specified. |
| `buckets.from` | Double | The lower bound of the distance range, in the specified `unit`. |
| `buckets.to` | Double | The upper bound of the distance range, in the specified `unit`. |
| `buckets.doc_count` | Integer | The number of documents falling within this distance range. |
