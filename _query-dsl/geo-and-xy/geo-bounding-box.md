---
layout: default
title: Geo-bounding box
parent: Geographic and xy queries
grand_parent: Query DSL
nav_order: 10
redirect_from:
  - /opensearch/query-dsl/geo-and-xy/geo-bounding-box/
  - /query-dsl/query-dsl/geo-and-xy/geo-bounding-box/
---

# Geo-bounding box query

To search for documents that contain [geopoint]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) fields, use a geo-bounding box query. The geo-bounding box query returns documents whose geopoints are within the bounding box specified in the query. A document with multiple geopoints matches the query if at least one geopoint is within the bounding box.

## Example

You can use a geo-bounding box query to search for documents that contain geopoints. 

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

Index three geopoints as objects with latitudes and longitudes:

```json
PUT testindex1/_doc/1
{
  "point": { 
    "lat": 74.00,
    "lon": 40.71
  }
}

PUT testindex1/_doc/2
{
  "point": { 
    "lat": 72.64,
    "lon": 22.62
  } 
}

PUT testindex1/_doc/3
{
  "point": { 
    "lat": 75.00,
    "lon": 28.00
  }
}
```

Search for all documents and filter the documents whose points lie within the rectangle defined in the query:

```json
GET testindex1/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_bounding_box": {
          "point": {
            "top_left": {
              "lat": 75,
              "lon": 28
            },
            "bottom_right": {
              "lat": 73,
              "lon": 41
            }
          }
        }
      }
    }
  }
}
```

The response contains the matching document:

```json
{
  "took" : 20,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex1",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "point" : {
            "lat" : 74.0,
            "lon" : 40.71
          }
        }
      }
    ]
  }
}
```

The preceding response does not include the document with a geopoint of `"lat": 75.00, "lon": 28.00` because of the geopoint's limited [precision](#precision).
{: .note}

## Precision

Geopoint coordinates are always rounded down at index time. At query time, the upper boundaries of the bounding box are rounded down, and the lower boundaries are rounded up. Therefore, the documents with geopoints that lie on the lower and left edges of the bounding box might not be included in the results due to rounding error. On the other hand, geopoints that lie on the upper and right edges of the bounding box might be included in the results even though they are outside the boundaries. The rounding error is less than 4.20 &times; 10<sup>&minus;8</sup> degrees for latitude and less than 8.39 &times; 10<sup>&minus;8</sup> degrees for longitude (around 1 cm). 

## Specifying the bounding box

You can specify the bounding box by providing any of the following combinations of its vertex coordinates:

- `top_left` and `bottom_right`
- `top_right` and `bottom_left`
- `top`, `left`, `bottom`, and `right`

The following example shows how to specify the bounding box using the `top`, `left`, `bottom`, and `right` coordinates:

```json
GET testindex1/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_bounding_box": {
          "point": {
            "top": 75,
            "left": 28,
            "bottom": 73,
            "right": 41            
          }
        }
      }
    }
  }
}
```

## Request fields

Geo-bounding box queries accept the following fields.

Field | Data type | Description
:--- | :--- | :--- 
`_name` | String | The name of the filter. Optional.
`validation_method` | String | The validation method. Valid values are `IGNORE_MALFORMED` (accept geopoints with invalid coordinates), `COERCE` (try to coerce coordinates to valid values), and `STRICT` (return an error when coordinates are invalid). Default is `STRICT`.
`type` | String | Specifies how to execute the filter. Valid values are `indexed` (index the filter) and `memory` (execute the filter in memory). Default is `memory`.
`ignore_unmapped` | Boolean | Specifies whether to ignore an unmapped field. If set to `true`, the query does not return any documents that have an unmapped field. If set to `false`, an exception is thrown when the field is unmapped. Default is `false`.

## Accepted formats

You can specify coordinates of the bounding box vertices in any [format]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point#formats) that the geopoint field type accepts.  

### Using a geohash to specify the bounding box

If you use a geohash to specify the bounding box, the geohash is treated as a rectangle. The upper-left vertex of the bounding box corresponds to the upper-left vertex of the `top_left` geohash, and the lower-right vertex of the bounding box corresponds to the lower-right vertex of the `bottom_right` geohash. 

The following example shows how to use a geohash to specify the same bounding box as the previous examples:

```json
GET testindex1/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_bounding_box": {
          "point": {
            "top_left": "ut7ftjkfxm34",
            "bottom_right": "uuvpkcprc4rc"
          }
        }
      }
    }
  }
}
```

To specify a bounding box that covers the whole area of a geohash, provide that geohash as both `top_left` and `bottom_right` parameters of the bounding box:

```json
GET testindex1/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_bounding_box": {
          "point": {
            "top_left": "ut",
            "bottom_right": "ut"
          }
        }
      }
    }
  }
}
```