---
layout: default
title: Geoshape
parent: Geographic and xy queries
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/query-dsl/geo-and-xy/geoshape/
---

# Geoshape query

Use a geoshape query to search for documents that contain [geopoint]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) or [geoshape]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) fields. You can filter documents using a [geoshape that is defined within a query](#using-a-new-shape-definition) or use a [pre-indexed geoshape](#using-a-pre-indexed-shape-definition).

The searched document field must be mapped as `geo_point` or `geo_shape`.
{: .note}

## Spatial relations

When you provide a geoshape to the geoshape query, the geopoint and geoshape fields in the documents are matched using the following spatial relations to the provided shape.

Relation | Description | Supporting geographic field type
:--- | :--- | :--- 
`INTERSECTS` | (Default) Matches documents whose geopoint or geoshape intersects with the shape provided in the query. | `geo_point`, `geo_shape`
`DISJOINT` | Matches documents whose geoshape does not intersect with the shape provided in the query. | `geo_shape`
`WITHIN` | Matches documents whose geoshape is completely within the shape provided in the query. | `geo_shape`
`CONTAINS` | Matches documents whose geoshape completely contains the shape provided in the query. | `geo_shape`

## Defining the shape in a geoshape query

You can define the shape to filter documents in a geoshape query either by [providing a new shape definition at query time](#using-a-new-shape-definition) or by [referencing the name of a shape pre-indexed in another index](#using-a-pre-indexed-shape-definition).  

## Using a new shape definition

To provide a new shape to a geoshape query, define it in the `geo_shape` field. You must define the geoshape in [GeoJSON format](https://geojson.org/). 

The following example illustrates searching for documents containing geoshapes that match a geoshape defined at query time.

### Step 1: Create an index

First, create an index and map the `location` field as a `geo_shape`:

```json
PUT /testindex
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

### Step 2: Index documents

Index one document containing a point and another containing a polygon:

```json
PUT testindex/_doc/1
{
  "location": {
    "type": "point",
    "coordinates": [ 73.0515, 41.5582 ]
  }
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{
  "location": {
    "type": "polygon",
    "coordinates": [
      [
        [
          73.0515,
          41.5582
        ],
        [
          72.6506,
          41.5623
        ],
        [
          72.6734,
          41.7658
        ],
        [
          73.0515,
          41.5582
        ]
      ]
    ]
  }
}
```
{% include copy-curl.html %}

### Step 3: Run a geoshape query

Finally, define a geoshape to filter the documents. The following sections illustrate providing various geoshapes in a query. For more information about various geoshape formats, see [Geoshape field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-shape/). 

#### Envelope

An [`envelope`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-shape#envelope) is a bounding rectangle in the `[[minLon, maxLat], [maxLon, minLat]]` format. Search for documents containing  geoshape fields that intersect with the provided envelope:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "envelope",
          "coordinates": [
            [
              71.0589,
              42.3601
            ],
            [
              74.006,
              40.7128
            ]
          ]
        },
        "relation": "WITHIN"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both documents:

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0,
        "_source": {
          "location": {
            "type": "point",
            "coordinates": [
              73.0515,
              41.5582
            ]
          }
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0,
        "_source": {
          "location": {
            "type": "polygon",
            "coordinates": [
              [
                [
                  73.0515,
                  41.5582
                ],
                [
                  72.6506,
                  41.5623
                ],
                [
                  72.6734,
                  41.7658
                ],
                [
                  73.0515,
                  41.5582
                ]
              ]
            ]
          }
        }
      }
    ]
  }
}
```

#### Point

Search for documents whose geoshape fields contain the provided point:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "point",
          "coordinates": [
            72.8000, 
            41.6300
          ]
        },
        "relation": "CONTAINS"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Linestring

Search for documents whose geoshape fields do not intersect with the provided linestring:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "linestring",
          "coordinates": [[74.0060, 40.7128], [71.0589, 42.3601]]
        },
        "relation": "DISJOINT"
      }
    }
  }
}
```
{% include copy-curl.html %}

Linestring geoshape queries do not support the `WITHIN` relation.
{: .note}

#### Polygon

In GeoJSON format, you must list the vertices of the polygon in counterclockwise order and close the polygon so that the first vertex and the last vertex are the same.

Search for documents whose geoshape fields are within the provided polygon:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "polygon",
          "coordinates": [
            [
              [74.0060, 40.7128], 
              [73.7562, 42.6526], 
              [71.0589, 42.3601], 
              [74.0060, 40.7128]
            ]
          ]
        },
        "relation": "WITHIN"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Multipoint

Search for documents whose geoshape fields do not intersect with the provided points:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "multipoint",
          "coordinates" : [
            [74.0060, 40.7128], 
            [71.0589, 42.3601]
          ]
        },
        "relation": "DISJOINT"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Multilinestring

Search for documents whose geoshape fields do not intersect with the provided lines:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "multilinestring",
          "coordinates" : [
            [[74.0060, 40.7128], [71.0589, 42.3601]],
            [[73.7562, 42.6526], [72.6734, 41.7658]]
          ]
        },
        "relation": "disjoint"
      }
    }
  }
}
```
{% include copy-curl.html %}

Multilinestring geoshape queries do not support the `WITHIN` relation.
{: .note}

#### Multipolygon

Search for documents whose geoshape fields are within the provided multipolygon:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type" : "multipolygon",
          "coordinates" : [
          [
            [
              [74.0060, 40.7128], 
              [73.7562, 42.6526], 
              [71.0589, 42.3601], 
              [74.0060, 40.7128]
            ],
            [
              [73.0515, 41.5582], 
              [72.6506, 41.5623], 
              [72.6734, 41.7658], 
              [73.0515, 41.5582]
            ]
          ],
          [
            [
              [73.9146, 40.8252], 
              [73.8871, 41.0389], 
              [73.6853, 40.9747], 
              [73.9146, 40.8252]
            ]
          ]
        ]
        },
        "relation": "WITHIN"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Geometry collection

Search for documents whose geoshape fields are within the provided polygons:

```json
GET /testindex/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "geometrycollection",
          "geometries": [
            {
              "type": "polygon",
              "coordinates": [[
                [74.0060, 40.7128], 
                [73.7562, 42.6526], 
                [71.0589, 42.3601], 
                [74.0060, 40.7128]
              ]]
            },
            {
              "type": "polygon",
              "coordinates": [[
                [73.0515, 41.5582], 
                [72.6506, 41.5623], 
                [72.6734, 41.7658], 
                [73.0515, 41.5582]
              ]]
            }
          ]
        },
        "relation": "WITHIN"
      }
    }
  }
}
```
{% include copy-curl.html %}

Geoshape queries whose geometry collection contains a linestring or a multilinestring do not support the `WITHIN` relation.
{: .note}

## Using a pre-indexed shape definition

When constructing a geoshape query, you can also reference the name of a shape pre-indexed in another index. Using this method, you can define a geoshape at index time and refer to it by name at search time. 

You can define a pre-indexed geoshape in [GeoJSON](https://geojson.org/) or [Well-Known Text (WKT)](https://docs.opengeospatial.org/is/12-063r5/12-063r5.html) format. For more information about various geoshape formats, see [Geoshape field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-shape/). 

The `indexed_shape` object supports the following parameters.

Parameter | Required/Optional | Description
:--- | :--- | :---
`id` | Required | The document ID of the document containing the pre-indexed shape. 
`index` | Optional | The name of the index containing the pre-indexed shape. Default is `shapes`.
`path` | Optional | The field name of the field containing the pre-indexed shape as a path. Default is `shape`.
`routing` | Optional | The routing of the document containing the pre-indexed shape.

The following example illustrates how to reference the name of a shape pre-indexed in another index. In this example, the index `pre-indexed-shapes` contains the shape that defines the boundaries, and the index `testindex` contains the shapes that are checked against those boundaries.

First, create the `pre-indexed-shapes` index and map the `boundaries` field for this index as a `geo_shape`:

```json
PUT /pre-indexed-shapes
{
  "mappings": {
    "properties": {
      "boundaries": {
        "type": "geo_shape",
        "orientation" : "left"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about specifying a different vertex orientation for polygons, see [Polygon]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-shape/#polygon). 

Index a polygon specifying the search boundaries into the `pre-indexed-shapes` index. The polygon's ID is `search_triangle`. In this example, you'll index the polygon in WKT format:

```json
PUT /pre-indexed-shapes/_doc/search_triangle
{
  "boundaries": 
    "POLYGON ((74.0060 40.7128, 71.0589 42.3601, 73.7562 42.6526, 74.0060 40.7128))"
}
```
{% include copy-curl.html %}

If you haven't already done so, index one document containing a point and another document containing a polygon into the `testindex` index:

```json
PUT /testindex/_doc/1
{
  "location": {
    "type": "point",
    "coordinates": [ 73.0515, 41.5582 ]
  }
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/2
{
  "location": {
    "type": "polygon",
    "coordinates": [
      [
        [
          73.0515,
          41.5582
        ],
        [
          72.6506,
          41.5623
        ],
        [
          72.6734,
          41.7658
        ],
        [
          73.0515,
          41.5582
        ]
      ]
    ]
  }
}
```
{% include copy-curl.html %}

Search for documents whose geoshapes are within the `search_triangle`:

```json
GET /testindex/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_shape": {
          "location": {
            "indexed_shape": {
              "index": "pre-indexed-shapes",
              "id": "search_triangle",
              "path": "boundaries"
            },
            "relation": "WITHIN"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both documents:

```json
{
  "took": 11,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1,
        "_source": {
          "location": {
            "type": "point",
            "coordinates": [
              73.0515,
              41.5582
            ]
          }
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 1,
        "_source": {
          "location": {
            "type": "polygon",
            "coordinates": [
              [
                [
                  73.0515,
                  41.5582
                ],
                [
                  72.6506,
                  41.5623
                ],
                [
                  72.6734,
                  41.7658
                ],
                [
                  73.0515,
                  41.5582
                ]
              ]
            ]
          }
        }
      }
    ]
  }
}
```

## Querying geopoints

You can also use a geoshape query to search for documents containing geopoints. 

Geoshape queries on geopoint fields only support the default `INTERSECTS` spatial relation, so you don't need to provide the `relation` parameter.
{: .note}

{: .important }
> Geoshape queries on geopoint fields do not support the following geoshapes:
> 
> - Points
> - Linestrings
> - Multipoints
> - Multilinestrings
> - Geometry collections containing one of the preceding geoshape types

Create a mapping where `location` is a `geo_point`:

```json
PUT /testindex1
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

Index two points into the index. In this example, you'll provide the geopoint coordinates as strings:

```json
PUT /testindex1/_doc/1
{
  "location": "41.5623, 72.6506"
}
```
{% include copy-curl.html %}

```json
PUT /testindex1/_doc/2
{
  "location": "76.0254, 39.2467" 
}
```
{% include copy-curl.html %}

 For information about providing geopoint coordinates in various formats, see [Formats]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/#formats). 

Search for geopoints that intersect with the provided polygon:

```json
GET /testindex1/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "polygon",
          "coordinates": [
            [
              [74.0060, 40.7128], 
              [73.7562, 42.6526], 
              [71.0589, 42.3601], 
              [74.0060, 40.7128]
            ]
          ]
        }
      }
    }
  }
}

```
{% include copy-curl.html %}

The response returns document 1:

```json
{
  "took": 21,
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
    "max_score": 0,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 0,
        "_source": {
          "location": "41.5623, 72.6506"
        }
      }
    ]
  }
}
```

Note that when you indexed the geopoints, you specified their coordinates in `"latitude, longitude"` format. When you search for matching documents, the coordinate array is in `[longitude, latitude]` format. Thus, document 1 is returned in the results but document 2 is not.

## Parameters

Geoshape queries accept the following parameters.

Parameter | Data type | Description
:--- | :--- | :--- 
`ignore_unmapped` | Boolean | Specifies whether to ignore an unmapped field. If set to `true`, then the query does not return any documents that contain an unmapped field. If set to `false`, then an exception is thrown when the field is unmapped. Optional. Default is `false`.