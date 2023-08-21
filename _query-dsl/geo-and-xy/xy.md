---
layout: default
title: xy
parent: Geographic and xy queries
grand_parent: Query DSL
nav_order: 50

redirect_from: 
  - /opensearch/query-dsl/geo-and-xy/xy/
  - /query-dsl/query-dsl/geo-and-xy/xy/
---

# xy query

To search for documents that contain [xy point]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-point) and [xy shape]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-shape) fields, use an xy query. 

## Spatial relations

When you provide an xy shape to the xy query, the xy fields are matched using the following spatial relations to the provided shape.

Relation | Description | Supporting xy Field Type
:--- | :--- | :--- 
`INTERSECTS` | (Default) Matches documents whose xy point or xy shape intersects the shape provided in the query. | `xy_point`, `xy_shape`
`DISJOINT` | Matches documents whose xy shape does not intersect with the shape provided in the query. | `xy_shape`
`WITHIN` | Matches documents whose xy shape is completely within the shape provided in the query. | `xy_shape`
`CONTAINS` | Matches documents whose xy shape completely contains the shape provided in the query. | `xy_shape`

The following examples illustrate searching for documents that contain xy shapes. To learn how to search for documents that contain xy points, see the [Querying xy points](#querying-xy-points) section.

## Defining the shape in an xy query

You can define the shape in an xy query either by providing a new shape definition at query time or by referencing the name of a shape pre-indexed in another index.  

### Using a new shape definition

To provide a new shape to an xy query, define it in the `xy_shape` field.

The following example illustrates searching for documents with xy shapes that match an xy shape defined at query time.

First, create an index and map the `geometry` field as an `xy_shape`:

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "geometry": {
        "type": "xy_shape"
      }
    }
  }
}
```

Index a document with a point and a document with a polygon:

```json
PUT testindex/_doc/1
{
  "geometry": { 
    "type": "point",
    "coordinates": [0.5, 3.0]
  }
}

PUT testindex/_doc/2
{
  "geometry" : {
    "type" : "polygon",
    "coordinates" : [
      [[2.5, 6.0],
      [0.5, 4.5], 
      [1.5, 2.0], 
      [3.5, 3.5],
      [2.5, 6.0]]
    ]
  }
}
```

Define an [`envelope`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-shape#envelope)&mdash;a bounding rectangle in the `[[minX, maxY], [maxX, minY]]` format. Search for documents with xy points or shapes that intersect that envelope:

```json
GET testindex/_search
{
  "query": {
    "xy_shape": {
      "geometry": {
        "shape": {
          "type": "envelope",
          "coordinates": [ [ 0.0, 6.0], [ 4.0, 2.0] ]
        },
        "relation": "WITHIN"
      }
    }
  }
}
```

The following image depicts the example. Both the point and the polygon are within the bounding envelope.

<img src="{{site.url}}{{site.baseurl}}/images/xy_query.png" alt="xy shape query" width="250">


The response contains both documents:

```json
{
  "took" : 363,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "testindex",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "geometry" : {
            "type" : "point",
            "coordinates" : [
              0.5,
              3.0
            ]
          }
        }
      },
      {
        "_index" : "testindex",
        "_id" : "2",
        "_score" : 0.0,
        "_source" : {
          "geometry" : {
            "type" : "polygon",
            "coordinates" : [
              [
                [
                  2.5,
                  6.0
                ],
                [
                  0.5,
                  4.5
                ],
                [
                  1.5,
                  2.0
                ],
                [
                  3.5,
                  3.5
                ],
                [
                  2.5,
                  6.0
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

### Using a pre-indexed shape definition

When constructing an xy query, you can also reference the name of a shape pre-indexed in another index. Using this method, you can define an xy shape at index time and refer to it by name, providing the following parameters in the `indexed_shape` object.

Parameter | Description
:--- | :---
`index` | The name of the index that contains the pre-indexed shape.
`id` | The document ID of the document that contains the pre-indexed shape.
`path` | The field name of the field that contains the pre-indexed shape as a path.

The following example illustrates referencing the name of a shape pre-indexed in another index. In this example, the index `pre-indexed-shapes` contains the shape that defines the boundaries, and the index `testindex` contains the shapes whose locations are checked against those boundaries.

First, create an index `pre-indexed-shapes` and map the `geometry` field for this index as an `xy_shape`:

```json
PUT pre-indexed-shapes
{
  "mappings": {
    "properties": {
      "geometry": {
        "type": "xy_shape"
      }
    }
  }
}
```

Index an envelope that specifies the boundaries and name it `rectangle`:

```json
PUT pre-indexed-shapes/_doc/rectangle
{
  "geometry": {
    "type": "envelope",
    "coordinates" : [ [ 0.0, 6.0], [ 4.0, 2.0] ]
  }
}
```

Index a document with a point and a document with a polygon into the index `testindex`:

```json
PUT testindex/_doc/1
{
  "geometry": { 
    "type": "point",
    "coordinates": [0.5, 3.0]
  }
}

PUT testindex/_doc/2
{
  "geometry" : {
    "type" : "polygon",
    "coordinates" : [
      [[2.5, 6.0],
      [0.5, 4.5], 
      [1.5, 2.0], 
      [3.5, 3.5],
      [2.5, 6.0]]
    ]
  }
}
```

Search for documents with shapes that intersect `rectangle` in the index `testindex` using a filter:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "filter": {
        "xy_shape": {
          "geometry": {
            "indexed_shape": {
              "index": "pre-indexed-shapes",
              "id": "rectangle",
              "path": "geometry"
            }
          }
        }
      }
    }
  }
}
```

The preceding query uses the default spatial relation `INTERSECTS` and returns both the point and the polygon:

```json
{
  "took" : 26,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "testindex",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "geometry" : {
            "type" : "point",
            "coordinates" : [
              0.5,
              3.0
            ]
          }
        }
      },
      {
        "_index" : "testindex",
        "_id" : "2",
        "_score" : 0.0,
        "_source" : {
          "geometry" : {
            "type" : "polygon",
            "coordinates" : [
              [
                [
                  2.5,
                  6.0
                ],
                [
                  0.5,
                  4.5
                ],
                [
                  1.5,
                  2.0
                ],
                [
                  3.5,
                  3.5
                ],
                [
                  2.5,
                  6.0
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

## Querying xy points

You can also use an xy query to search for documents that contain xy points. 

Create a mapping with `point` as `xy_point`:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "point": {
        "type": "xy_point"
      }
    }
  }
}
```

Index three points:

```json
PUT testindex1/_doc/1
{
  "point": "1.0, 1.0" 
}

PUT testindex1/_doc/2
{
  "point": "2.0, 0.0" 
}

PUT testindex1/_doc/3
{
  "point": "-2.0, 2.0" 
}
```

Search for points that lie within the circle with the center at (0, 0) and a radius of 2:

```json
GET testindex1/_search
{
  "query": {
    "xy_shape": {
      "point": {
        "shape": {
          "type": "circle",
          "coordinates": [0.0, 0.0],
          "radius": 2
        }
      }
    }
  }
}
```

xy point only supports the default `INTERSECTS` spatial relation, so you don't need to provide the `relation` parameter.
{: .note}

The following image depicts the example. Points 1 and 2 are within the circle, and point 3 is outside the circle.

<img src="{{site.url}}{{site.baseurl}}/images/xy_query_point.png" alt="xy point query" width="300">

The response returns documents 1 and 2:

```json
{
  "took" : 575,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "testindex1",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "point" : "1.0, 1.0"
        }
      },
      {
        "_index" : "testindex1",
        "_id" : "2",
        "_score" : 0.0,
        "_source" : {
          "point" : "2.0, 0.0"
        }
      }
    ]
  }
}
```