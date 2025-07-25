---
layout: default
title: Geopolygon
parent: Geographic and xy queries
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/query-dsl/geo-and-xy/geopolygon/
---

# Geopolygon query

A geopolygon query returns documents containing geopoints that are within the specified polygon. A document containing multiple geopoints matches the query if at least one geopoint matches the query.

A polygon is specified by a list of vertices in coordinate form. Unlike specifying a polygon for a geoshape field, the polygon does not have to be closed (specifying the first and last points at the same is unnecessary). Though points do not have to follow either clockwise or counterclockwise order, it is recommended that you list them in either of these orders. This will ensure that the correct polygon is captured.

The searched document field must be mapped as `geo_point`.
{: .note}

## Example

Create a mapping with the `point` field mapped as `geo_point`:

```json
PUT /testindex1
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
    "lat": 73.71,
    "lon": 41.32
  }
}
```
{% include copy-curl.html %}

Search for documents whose `point` objects are within the specified `geo_polygon`:

```json
GET /testindex1/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_polygon": {
          "point": {
            "points": [
              { "lat": 74.5627, "lon": 41.8645 },
              { "lat": 73.7562, "lon": 42.6526 },
              { "lat": 73.3245, "lon": 41.6189 },
              { "lat": 74.0060, "lon": 40.7128 }
           ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The polygon specified in the preceding request is the quadrilateral depicted in the following image. The matching document is within this quadrilateral. The coordinates of the quadrilateral vertices are specified in `(latitude, longitude)` format.

![Search for points within the specified quadrilateral]({{site.url}}{{site.baseurl}}/images/geopolygon-query.png)

The response contains the matching document:

```json
{
  "took": 6,
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
            "lat": 73.71,
            "lon": 41.32
          }
        }
      }
    ]
  }
}
```

In the preceding search request, you specified the polygon vertices in clockwise order:

```json
"geo_polygon": {
    "point": {
    "points": [
        { "lat": 74.5627, "lon": 41.8645 },
        { "lat": 73.7562, "lon": 42.6526 },
        { "lat": 73.3245, "lon": 41.6189 },
        { "lat": 74.0060, "lon": 40.7128 }
    ]
    }
}
```

Alternatively, you can specify the vertices in counterclockwise order:

```json
"geo_polygon": {
    "point": {
    "points": [
        { "lat": 74.5627, "lon": 41.8645 },
        { "lat": 74.0060, "lon": 40.7128 },
        { "lat": 73.3245, "lon": 41.6189 },
        { "lat": 73.7562, "lon": 42.6526 }
    ]
    }
}
```

The resulting query response contains the same matching document.

However, if you specify the vertices in the following order:

```json
"geo_polygon": {
    "point": {
    "points": [
        { "lat": 74.5627, "lon": 41.8645 },
        { "lat": 74.0060, "lon": 40.7128 },
        { "lat": 73.7562, "lon": 42.6526 },
        { "lat": 73.3245, "lon": 41.6189 }
    ]
    }
}
```

The response returns no results.

## Request fields

Geopolygon queries accept the following fields.

Field | Data type | Description
:--- | :--- | :--- 
`_name` | String | The name of the filter. Optional.
`validation_method` | String | The validation method. Valid values are `IGNORE_MALFORMED` (accept geopoints with invalid coordinates), `COERCE` (try to coerce coordinates to valid values), and `STRICT` (return an error when coordinates are invalid). Optional. Default is `STRICT`.
`ignore_unmapped` | Boolean | Specifies whether to ignore an unmapped field. If set to `true`, then the query does not return any documents that contain an unmapped field. If set to `false`, then an exception is thrown when the field is unmapped. Optional. Default is `false`.

## Accepted formats

You can specify the geopoint coordinates when indexing a document and searching for documents in any [format]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) accepted by the geopoint field type.  