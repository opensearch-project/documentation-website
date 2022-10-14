---
layout: default
title: xy queries
parent: Query DSL
nav_order: 65
---

# xy queries

To search for documents that contain xy point and xy shape fields, use an xy query. 

## Spatial relations

When you provide an xy shape to the xy query, the xy fields are matched using following spatial relationships to the provided shape:

Relation | Description | Supporting xy Field Type
:--- | :--- | :--- | :--- 
`INTERSECTS` | (Default) Matches documents whose xy point or xy shape intersects the shape provided in the query. | `xy_point`, `xy_shape`
`DISJOINT` | Matches documents whose xy shape does not intersect with the shape provided in the query. | `xy_shape`
`WITHIN` | Matches documents whose xy shape is completely within the shape provided in the query. | `xy_shape`
`CONTAINS` | Matches documents whose xy shape completely contains the shape provided in the query. | `xy_shape`

## Defining the shape in an xy query

You can define the shape in an xy query either by providing a new shape definition at query time, or by referencing the name of a shape pre-indexed in another index.  

### Using a new shape definition

To provide a new shape to an xy query, define it in the `xy_shape` field.

The following example illustrates searching for documents that match an xy shape defined at query time.

First, create an index and map the `point` field as an `xy_point` and the `rectangle` field as an `xy_shape`:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "point": {
        "type": "xy_point"
      },
      "rectangle": {
        "type": "xy_shape"
      }
    }
  }
}
```

Index a document with an xy point and a document with an xy shape:

```json
PUT testindex1/_doc/1
{
  "point": { 
    "x": 0.5,
    "y": 4.5
  }
}

PUT testindex1/_doc/2
{
  "location" : {
    "type" : "polygon",
    "coordinates" : [
      [[2.5, 6.0], 
      [1.5, 2.0], 
      [3.5, 3.5],
      [0.5, 4.5]]
    ]
  }
}
```

Define an [`envelope`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-shape#envelope)&mdash;a bounding rectangle in the `[[minX, maxY], [maxX, minY]]` format. Search for documents with xy points or shapes that intersect that envelope:

```json
GET testindex1/_search
{
  "query": {
    "xy_shape": {
      "geometry": {
        "query_shape": {
          "type": "envelope",
          "coordinates": [ [ 0.0, 6.0], [ 4.0, 2.0] ]
        },
        "relation": "intersect"
      }
    }
  }
}

The response contains both documents:

```json
```

### Using a pre-indexed shape definition

When constructing an xy query, you can also reference the name of a shape pre-indexed in another index. Using this method, you can define an xy shape at index time and refer to it by name, providing the following parameters in the `indexed_shape` object:

Parameter | Description
:--- | :---
index | The name of the index that contains the pre-indexed shape.
id | The document ID of the document that contains the pre-indexed shape.
path | The field name of the field that contains the pre-indexed shape as a path.

The following example illustrates referencing the name of a shape pre-indexed in another index.

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

Index an envelope and name it `rectangle`:

```json
PUT testindex1/_doc/rectangle
{
  "geometry": {
    "type": "envelope",
    "coordinates" : [ [ 0.0, 6.0], [ 4.0, 2.0] ]
  }
}
```

Index a document with an xy point and a document with an xy shape into the index `testindex1`:

```json
PUT testindex1/_doc/1
{
  "point": { 
    "x": 0.5,
    "y": 4.5
  }
}

PUT testindex1/_doc/2
{
  "location" : {
    "type" : "polygon",
    "coordinates" : [
      [[2.5, 6.0], 
      [1.5, 2.0], 
      [3.5, 3.5],
      [0.5, 4.5]]
    ]
  }
}
```

Search for documents with shapes that intersect `rectangle` in the index `testindex1` using a filter:

```json
GET testindex1/_search
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