---
layout: default
title: Geoshape
nav_order: 57
has_children: false
parent: Geographic field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/geo-shape/
  - /field-types/geo-shape/
---

# Geoshape field type

A geoshape field type contains a geographic shape, such as a polygon or a collection of geographic points. To index a geoshape, OpenSearch tesselates the shape into a triangular mesh and stores each triangle in a BKD tree. This provides a 10<sup>-7</sup>decimal degree of precision, which represents near-perfect spatial resolution. Performance of this process is mostly impacted by the number of vertices in a polygon you are indexing.

## Example

Create a mapping with a geoshape field type:

```json
PUT testindex
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

## Formats

Geoshapes can be indexed in the following formats:

- [GeoJSON](https://geojson.org/)
- [Well-Known Text (WKT)](https://docs.opengeospatial.org/is/12-063r5/12-063r5.html)

In both GeoJSON and WKT, the coordinates must be specified in the `longitude, latitude` order within coordinate arrays. Note that the longitude comes first in this format.
{: .note}

## Geoshape types

The following table describes the possible geoshape types and their relationship to the GeoJSON and WKT types.

OpenSearch type | GeoJSON type | WKT type | Description 
:--- | :--- | :--- | :--- 
[`point`](#point) | Point | POINT | A geographic point specified by latitude and longitude. OpenSearch uses World Geodetic System (WGS84) coordinates.
[`linestring`](#linestring) | LineString | LINESTRING | A line specified by two or more points. May be a straight line or a path of connected line segments.
[`polygon`](#polygon) | Polygon | POLYGON | A polygon specified by a list of vertices in coordinate form. The polygon must be closed, meaning the last point must be the same as the first point. Therefore, to create an n-gon, n+1 vertices are required. The minimum number of vertices is four, which creates a triangle.
[`multipoint`](#multipoint) | MultiPoint | MULTIPOINT | An array of discrete related points that are not connected.
[`multilinestring`](#multilinestring) | MultiLineString | MULTILINESTRING | An array of linestrings.
[`multipolygon`](#multipolygon) | MultiPolygon | MULTIPOLYGON | An array of polygons.
[`geometrycollection`](#geometry-collection) | GeometryCollection | GEOMETRYCOLLECTION | A collection of geoshapes that may be of different types.
[`envelope`](#envelope) | N/A | BBOX | A bounding rectangle specified by upper-left and lower-right vertices.

## Point

A point is a single pair of coordinates specified by latitude and longitude. 

Index a point in GeoJSON format:

```json
PUT testindex/_doc/1
{
  "location" : {
    "type" : "point",
    "coordinates" : [74.00, 40.71]
  }
}
```
{% include copy-curl.html %}

Index a point in WKT format:

```json
PUT testindex/_doc/1
{
  "location" : "POINT (74.0060 40.7128)"
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
    "coordinates" : [[74.0060, 40.7128], [71.0589, 42.3601]]
  }
}
```
{% include copy-curl.html %}

Index a linestring in WKT format:

```json
PUT testindex/_doc/2
{
  "location" : "LINESTRING (74.0060 40.7128, 71.0589 42.3601)"
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
      [[74.0060, 40.7128], 
      [71.0589, 42.3601], 
      [73.7562, 42.6526], 
      [74.0060, 40.7128]]
    ]
  }
}
```
{% include copy-curl.html %}

Index a polygon (triangle) in WKT format:

```json
PUT testindex/_doc/3
{
  "location" : "POLYGON ((74.0060 40.7128, 71.0589 42.3601, 73.7562 42.6526, 74.0060 40.7128))"
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
      [[74.0060, 40.7128], 
      [71.0589, 42.3601], 
      [73.7562, 42.6526], 
      [74.0060, 40.7128]],
      
      [[72.6734,41.7658], 
      [72.6506, 41.5623], 
      [73.0515, 41.5582], 
      [72.6734, 41.7658]]
    ]
  }
}
```
{% include copy-curl.html %}

Index a polygon (triangle) with a triangular hole in WKT format:

```json
PUT testindex/_doc/4
{
  "location" : "POLYGON ((40.7128 74.0060, 42.3601 71.0589, 42.6526 73.7562, 40.7128 74.0060), (41.7658 72.6734, 41.5623 72.6506, 41.5582 73.0515, 41.7658 72.6734))"
}
```
{% include copy-curl.html %}

In OpenSearch, you can specify a polygon by listing its vertices clockwise or counterclockwise. This works well for polygons that do not cross the date line (are narrower than 180&deg;). However, a polygon that crosses the date line (is wider than 180&deg;) might be ambiguous because  WKT does not impose a specific order on vertices. Thus, you must specify polygons that cross the date line by listing their vertices counterclockwise. 

You can define an [`orientation`](#parameters) parameter to specify the vertex traversal order at mapping time:

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_shape",
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
      [[74.0060, 40.7128], 
      [71.0589, 42.3601], 
      [73.7562, 42.6526], 
      [74.0060, 40.7128]]
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
      [74.0060, 40.7128], 
      [71.0589, 42.3601]
    ]
  }
}
```
{% include copy-curl.html %}

Index a multipoint in WKT format:

```json
PUT testindex/_doc/6
{
  "location" : "MULTIPOINT (74.0060 40.7128, 71.0589 42.3601)"
}
```
{% include copy-curl.html %}

## Multilinestring

A multilinestring is an array of linestrings.

Index a linestring in GeoJSON format:

```json
PUT testindex/_doc/2
{
  "location" : {
    "type" : "multilinestring",
    "coordinates" : [
      [[74.0060, 40.7128], [71.0589, 42.3601]],
      [[73.7562, 42.6526], [72.6734, 41.7658]]
      ]
  }
}
```
{% include copy-curl.html %}

Index a linestring in WKT format:

```json
PUT testindex/_doc/2
{
  "location" : "MULTILINESTRING ((74.0060 40.7128, 71.0589 42.3601), (73.7562 42.6526, 72.6734 41.7658))"
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
      [[74.0060, 40.7128], 
      [71.0589, 42.3601], 
      [73.7562, 42.6526], 
      [74.0060, 40.7128]],
      
      [[72.6734,41.7658], 
      [72.6506, 41.5623], 
      [73.0515, 41.5582], 
      [72.6734, 41.7658]]
    ],
    [
      [[73.9776, 40.7614], 
      [73.9554, 40.7827], 
      [73.9631, 40.7812], 
      [73.9776, 40.7614]]
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
  "location" : "MULTIPOLYGON (((40.7128 74.0060, 42.3601 71.0589, 42.6526 73.7562, 40.7128 74.0060), (41.7658 72.6734, 41.5623 72.6506, 41.5582 73.0515, 41.7658 72.6734)), ((73.9776 40.7614, 73.9554 40.7827, 73.9631 40.7812, 73.9776 40.7614)))"
}
```
{% include copy-curl.html %}

## Geometry collection

A geometry collection is a collection of geoshapes that may be of different types.

Index a geometry collection in GeoJSON format:

```json
PUT testindex/_doc/7
{
  "location" : {
    "type": "geometrycollection",
    "geometries": [
      {
        "type": "point",
        "coordinates": [74.0060, 40.7128]
      },
      {
        "type": "linestring",
        "coordinates": [[73.7562, 42.6526], [72.6734, 41.7658]]
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
  "location" : "GEOMETRYCOLLECTION (POINT (74.0060 40.7128), LINESTRING(73.7562 42.6526, 72.6734 41.7658))"
}
```
{% include copy-curl.html %}

## Envelope

An envelope is a bounding rectangle specified by upper-left and lower-right vertices. The GeoJSON format is `[[minLon, maxLat], [maxLon, minLat]]`.

Index an envelope in GeoJSON format:

```json
PUT testindex/_doc/2
{
  "location" : {
    "type" : "envelope",
    "coordinates" : [[71.0589, 42.3601], [74.0060, 40.7128]]
  }
}
```
{% include copy-curl.html %}

In WKT format, use `BBOX (minLon, maxLon, maxLat, minLat)`.

Index an envelope in WKT BBOX format:

```json
PUT testindex/_doc/8
{
  "location" : "BBOX (71.0589, 74.0060, 42.3601, 40.7128)"
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by geoshape field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`coerce` | A Boolean value that specifies whether to automatically close unclosed linear rings. Default is `false`.
`ignore_malformed` | A Boolean value that specifies to ignore malformed GeoJSON or WKT geoshapes and not to throw an exception. Default is `false` (throw an exception when geoshapes are malformed).
`ignore_z_value` | Specific to points with three coordinates. If `ignore_z_value` is `true`, the third coordinate is not indexed but is still stored in the _source field. If `ignore_z_value` is `false`, an exception is thrown. Default is `true`.
`orientation` | Specifies the traversal order of the vertices in the geoshape's list of coordinates. `orientation` takes the following values: <br> 1. RIGHT: counterclockwise. Specify RIGHT orientation by using one of the following strings (uppercase or lowercase): `right`, `counterclockwise`, `ccw`. <br> 2. LEFT: clockwise. Specify LEFT orientation by using one of the following strings (uppercase or lowercase): `left`, `clockwise`, `cw`.  This value can be overridden by individual documents.<br> Default is `RIGHT`.
