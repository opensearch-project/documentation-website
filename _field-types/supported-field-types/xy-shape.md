---
layout: default
title: xy shape
nav_order: 59
has_children: false
parent: Cartesian field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/xy-shape/
  - /field-types/xy-shape/
---

# xy shape field type

An xy shape field type contains a shape, such as a polygon or a collection of xy points. It is based on the Lucene [XYShape](https://lucene.apache.org/core/9_3_0/core/org/apache/lucene/document/XYShape.html) field type. To index an xy shape, OpenSearch tessellates the shape into a triangular mesh and stores each triangle in a BKD tree (a set of balanced k-dimensional trees). This provides a 10<sup>-7</sup>decimal degree of precision, which represents near-perfect spatial resolution.

The xy shape field type is similar to the [geoshape]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) field type, but it represents shapes on the Cartesian plane, which is not based on the Earth-fixed terrestrial reference system. The coordinates of an xy shape are single-precision floating-point values. For information about the range and precision of floating-point values, see [Numeric field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/).

## Example

Create a mapping with an xy shape field type:

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "location": {
        "type": "xy_shape"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Formats

xy shapes can be indexed in the following formats:

- [GeoJSON](https://geojson.org/)
- [Well-known text (WKT)](https://docs.opengeospatial.org/is/12-063r5/12-063r5.html)

In both GeoJSON and WKT, the coordinates must be specified in the `x, y` order within coordinate arrays.
{: .note}

## xy shape types

The following table describes the possible xy shape types and their relationship to the GeoJSON and WKT types.

OpenSearch type | GeoJSON type | WKT type | Description 
:--- | :--- | :--- | :--- 
[`point`](#point) | Point | POINT | A geographic point specified by the x and y coordinates. 
[`linestring`](#linestring) | LineString | LINESTRING | A line specified by two or more points. May be a straight line or a path of connected line segments.
[`polygon`](#polygon) | Polygon | POLYGON | A polygon specified by a list of vertices in coordinate form. The polygon must be closed, meaning the last point must be the same as the first point. Therefore, to create an n-gon, n+1 vertices are required. The minimum number of vertices is four, which creates a triangle.
[`multipoint`](#multipoint) | MultiPoint | MULTIPOINT | An array of discrete related points that are not connected.
[`multilinestring`](#multilinestring) | MultiLineString | MULTILINESTRING | An array of linestrings.
[`multipolygon`](#multipolygon) | MultiPolygon | MULTIPOLYGON | An array of polygons.
[`geometrycollection`](#geometry-collection) | GeometryCollection | GEOMETRYCOLLECTION | A collection of xy shapes that may be of different types.
[`envelope`](#envelope) | N/A | BBOX | A bounding rectangle specified by upper-left and lower-right vertices.

## Point

A point is specified by a single pair of coordinates. 

Index a point in GeoJSON format:

```json
PUT testindex/_doc/1
{
  "location" : {
    "type" : "point",
    "coordinates" : [0.5, 4.5]        
  }
}
```
{% include copy-curl.html %}

Index a point in WKT format:

```json
PUT testindex/_doc/1
{
  "location" : "POINT (0.5 4.5)"        
}
```
{% include copy-curl.html %}

## Linestring

A linestring is a line specified by two or more points. If the points are collinear, the linestring is a straight line. Otherwise, the linestring represents a path made of line segments.

Index a linestring in GeoJSON format:

```json
PUT testindex/_doc/2
{
  "location" : {
    "type" : "linestring",
    "coordinates" : [[0.5, 4.5], [-1.5, 2.3]]
  }
}
```
{% include copy-curl.html %}

Index a linestring in WKT format:

```json
PUT testindex/_doc/2
{
  "location" : "LINESTRING (0.5 4.5, -1.5 2.3)"
}
```
{% include copy-curl.html %}

## Polygon

A polygon is specified by a list of vertices in coordinate form. The polygon must be closed, meaning the last point must be the same as the first point. In the following example, a triangle is created using four points. 

GeoJSON requires that you list the vertices of the polygon counterclockwise. WKT does not impose a specific order on vertices.
{: .note}

Index a polygon (triangle) in GeoJSON format:

```json
PUT testindex/_doc/3
{
  "location" : {
    "type" : "polygon",
    "coordinates" : [
      [[0.5, 4.5], 
      [2.5, 6.0], 
      [1.5, 2.0], 
      [0.5, 4.5]]
    ]
  }
}
```
{% include copy-curl.html %}

Index a polygon (triangle) in WKT format:

```json
PUT testindex/_doc/3
{
  "location" : "POLYGON ((0.5 4.5, 2.5 6.0, 1.5 2.0, 0.5 4.5))"
}
```
{% include copy-curl.html %}

The polygon may have holes inside. In this case, the `coordinates` field will contain multiple arrays. The first array represents the outer polygon, and each subsequent array represents a hole. Holes are represented as polygons and specified as arrays of coordinates.

GeoJSON requires that you list the vertices of the polygon counterclockwise and the vertices of the hole clockwise. WKT does not impose a specific order on vertices.
{: .note}

Index a polygon (triangle) with a triangular hole in GeoJSON format:

```json
PUT testindex/_doc/4
{
  "location" : {
    "type" : "polygon",
    "coordinates" : [
      [[0.5, 4.5], 
      [2.5, 6.0], 
      [1.5, 2.0], 
      [0.5, 4.5]],
      
      [[1.0, 4.5], 
      [1.5, 4.5], 
      [1.5, 4.0], 
      [1.0, 4.5]]
    ]
  }
}
```
{% include copy-curl.html %}

Index a polygon (triangle) with a triangular hole in WKT format:

```json
PUT testindex/_doc/4
{
  "location" : "POLYGON ((0.5 4.5, 2.5 6.0, 1.5 2.0, 0.5 4.5), (1.0 4.5, 1.5 4.5, 1.5 4.0, 1.0 4.5))"
}
```
{% include copy-curl.html %}

By default, the vertices of the polygon are traversed in a counterclockwise order. You can define an [`orientation`](#parameters) parameter to specify the vertex traversal order at mapping time:

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "location": {
        "type": "xy_shape",
        "orientation" : "left"
      }
    }
  }
}
```
{% include copy-curl.html %}

Subsequently indexed documents can override the `orientation` setting:

```json
PUT testindex/_doc/3
{
  "location" : {
    "type" : "polygon",
    "orientation" : "cw",
    "coordinates" : [
      [[0.5, 4.5], 
      [2.5, 6.0], 
      [1.5, 2.0], 
      [0.5, 4.5]]
    ]
  }
}
```
{% include copy-curl.html %}

## Multipoint

A multipoint is an array of discrete related points that are not connected. 

Index a multipoint in GeoJSON format:

```json
PUT testindex/_doc/6
{
  "location" : {
    "type" : "multipoint",
    "coordinates" : [
      [0.5, 4.5], 
      [2.5, 6.0]
    ]
  }
}
```
{% include copy-curl.html %}

Index a multipoint in WKT format:

```json
PUT testindex/_doc/6
{
  "location" : "MULTIPOINT (0.5 4.5, 2.5 6.0)"
}
```
{% include copy-curl.html %}

## Multilinestring

A multilinestring is an array of linestrings.

Index a multilinestring in GeoJSON format:

```json
PUT testindex/_doc/2
{
  "location" : {
    "type" : "multilinestring",
    "coordinates" : [
      [[0.5, 4.5], [2.5, 6.0]],
      [[1.5, 2.0], [3.5, 3.5]]
      ]
  }
}
```
{% include copy-curl.html %}

Index a linestring in WKT format:

```json
PUT testindex/_doc/2
{
  "location" : "MULTILINESTRING ((0.5 4.5, 2.5 6.0), (1.5 2.0, 3.5 3.5))"
}
```
{% include copy-curl.html %}

## Multipolygon

A multipolygon is an array of polygons. In this example, the first polygon contains a hole, and the second does not. 

Index a multipolygon in GeoJSON format:

```json
PUT testindex/_doc/4
{
  "location" : {
    "type" : "multipolygon",
    "coordinates" : [
    [
      [[0.5, 4.5], 
      [2.5, 6.0], 
      [1.5, 2.0], 
      [0.5, 4.5]],
      
      [[1.0, 4.5], 
      [1.5, 4.5], 
      [1.5, 4.0], 
      [1.0, 4.5]]
    ],
    [
      [[2.0, 0.0], 
      [1.0, 2.0], 
      [3.0, 1.0], 
      [2.0, 0.0]]
      ]
    ]
  }
}
```
{% include copy-curl.html %}

Index a multipolygon in WKT format:

```json
PUT testindex/_doc/4
{
  "location" : "MULTIPOLYGON (((0.5 4.5, 2.5 6.0, 1.5 2.0, 0.5 4.5), (1.0 4.5, 1.5 4.5, 1.5 4.0, 1.0 4.5)), ((2.0 0.0, 1.0 2.0, 3.0 1.0, 2.0 0.0)))"
}
```
{% include copy-curl.html %}

## Geometry collection

A geometry collection is a collection of xy shapes that may be of different types.

Index a geometry collection in GeoJSON format:

```json
PUT testindex/_doc/7
{
  "location" : {
    "type": "geometrycollection",
    "geometries": [
      {
        "type": "point",
        "coordinates": [0.5, 4.5]
      },
      {
        "type": "linestring",
        "coordinates": [[2.5, 6.0], [1.5, 2.0]]
      }
    ]
  }
}
```
{% include copy-curl.html %}

Index a geometry collection in WKT format:

```json
PUT testindex/_doc/7
{
  "location" : "GEOMETRYCOLLECTION (POINT (0.5 4.5), LINESTRING(2.5 6.0, 1.5 2.0))"
}
```
{% include copy-curl.html %}

## Envelope

An envelope is a bounding rectangle specified by upper-left and lower-right vertices. The GeoJSON format is `[[minX, maxY], [maxX, minY]]`.

Index an envelope in GeoJSON format:

```json
PUT testindex/_doc/2
{
  "location" : {
    "type" : "envelope",
    "coordinates" : [[3.0, 2.0], [6.0, 0.0]]
  }
}
```
{% include copy-curl.html %}

In WKT format, use `BBOX (minX, maxY, maxX, minY)`.

Index an envelope in WKT BBOX format:

```json
PUT testindex/_doc/8
{
  "location" : "BBOX (3.0, 2.0, 6.0, 0.0)"
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by xy shape field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`coerce` | A Boolean value that specifies whether to automatically close unclosed linear rings. Default is `false`.
`ignore_malformed` | A Boolean value that specifies to ignore malformed GeoJSON or WKT xy shapes and not to throw an exception. Default is `false` (throw an exception when xy shapes are malformed).
`ignore_z_value` | Specific to points with three coordinates. If `ignore_z_value` is `true`, the third coordinate is not indexed but is still stored in the _source field. If `ignore_z_value` is `false`, an exception is thrown. Default is `true`.
`orientation` | Specifies the traversal order of the vertices in the xy shape's list of coordinates. `orientation` takes the following values: <br> 1. RIGHT: counterclockwise. Specify RIGHT orientation by using one of the following strings (uppercase or lowercase): `right`, `counterclockwise`, `ccw`. <br> 2. LEFT: clockwise. Specify LEFT orientation by using one of the following strings (uppercase or lowercase): `left`, `clockwise`, `cw`.  This value can be overridden by individual documents.<br> Default is `RIGHT`.