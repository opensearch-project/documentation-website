---
layout: default
title: Geodistance
parent: Geographic and xy queries
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/query-dsl/geo-and-xy/geodistance/
---

# Geodistance query

A geodistance query returns documents with geopoints that are within a specified distance from the provided geopoint. A document with multiple geopoints matches the query if at least one geopoint matches the query.

The searched document field must be mapped as `geo_point`.
{: .note}

## Example

Create a mapping with the `point` field mapped as `geo_point`:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "point": {
        "type": "geo_point"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a geopoint, specifying its latitude and longitude:

```json
PUT testindex1/_doc/1
{
  "point": { 
    "lat": 74.00,
    "lon": 40.71
  }
}
```
{% include copy-curl.html %}

Search for documents whose `point` objects are within the specified `distance` from the specified `point`:

```json
GET /testindex1/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_distance": {
          "distance": "50mi",
          "point": {
            "lat": 73.5,
            "lon": 40.5
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 1,
        "_source": {
          "point": {
            "lat": 74,
            "lon": 40.71
          }
        }
      }
    ]
  }
}
```

## Request fields

Geodistance queries accept the following fields.

Field | Data type | Description
:--- | :--- | :--- 
`_name` | String | The name of the filter. Optional.
`distance` | String | The distance within which to match the points. This distance is the radius of a circle centered at the specified point. For supported distance units, see [Distance units]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#distance-units). Required.
`distance_type` | String | Specifies how to calculate the distance. Valid values are `arc` or `plane` (faster but inaccurate for long distances or points close to the poles). Optional. Default is `arc`.
`validation_method` | String | The validation method. Valid values are `IGNORE_MALFORMED` (accept geopoints with invalid coordinates), `COERCE` (try to coerce coordinates to valid values), and `STRICT` (return an error when coordinates are invalid). Optional. Default is `STRICT`.
`ignore_unmapped` | Boolean | Specifies whether to ignore an unmapped field. If set to `true`, then the query does not return any documents that contain an unmapped field. If set to `false`, then an exception is thrown when the field is unmapped. Optional. Default is `false`.

## Accepted formats

You can specify the geopoint coordinates when indexing a document and searching for documents in any [format]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) accepted by the geopoint field type.  