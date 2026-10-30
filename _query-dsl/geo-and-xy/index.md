---
layout: default
title: Geographic and xy queries
has_children: true
nav_order: 65
redirect_from:
   - /opensearch/query-dsl/geo-and-xy/index/
   - /query-dsl/query-dsl/geo-and-xy/
   - /query-dsl/query-dsl/geo-and-xy/index/
   - /query-dsl/geo-and-xy/
---

# Geographic and xy queries

Geographic and xy queries let you search fields that contain points and shapes on a map or coordinate plane. Geographic queries work on geospatial data, while xy queries work on two-dimensional coordinate data. Out of all geographic queries, the geoshape query is very similar to the xy query, but the former searches [geographic fields]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geographic/), while the latter searches [Cartesian fields]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy).

## xy queries

[xy queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-and-xy/xy) search for documents that contain geometries in a Cartesian coordinate system. These geometries can be specified in [`xy_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-point) fields, which support points, and [`xy_shape`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-shape) fields, which support points, lines, circles, and polygons. 

xy queries return documents that contain:
- xy shapes and xy points that have one of four spatial relations to the provided shape: `INTERSECTS`, `DISJOINT`, `WITHIN`, or `CONTAINS`.
- xy points that intersect the provided shape.

## Geographic queries

Geographic queries search for documents that contain geospatial geometries. These geometries can be specified in [`geo_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) fields, which support points on a map, and [`geo_shape`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) fields, which support points, lines, circles, and polygons. 

OpenSearch provides the following geographic query types:

| Query type | Description |
| :--- | :--- |
| [Geo-bounding box]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-and-xy/geo-bounding-box/) | Returns documents with geopoint field values that are within a bounding box. |
| [Geodistance]({{site.url}}{{site.baseurl}}/query-dsl/geo-and-xy/geodistance/) | Returns documents with geopoints that are within a specified distance from the provided geopoint. |
| [Geopolygon]({{site.url}}{{site.baseurl}}/query-dsl/geo-and-xy/geopolygon/) | Returns documents containing geopoints that are within a polygon. |
| [Geoshape]({{site.url}}{{site.baseurl}}/query-dsl/geo-and-xy/geoshape/) | Returns documents containing geoshapes and geopoints that have one of four spatial relations to the provided shape (`INTERSECTS`, `DISJOINT`, `WITHIN`, or `CONTAINS`) or geopoints that intersect the provided shape. |
