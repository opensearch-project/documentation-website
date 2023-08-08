---
layout: default
title: Geographic and xy queries
has_children: true
nav_order: 50
redirect_from:
   - /opensearch/query-dsl/geo-and-xy/index/
   - /query-dsl/query-dsl/geo-and-xy/
   - /query-dsl/query-dsl/geo-and-xy/index/
---

# Geographic and xy queries

Geographic and xy queries let you search fields that contain points and shapes on a map or coordinate plane. Geographic queries work on geospatial data, while xy queries work on two-dimensional coordinate data. Out of all geographic queries, the geoshape query is very similar to the xy query, but the former searches [geographic fields]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geographic), while the latter searches [Cartesian fields]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy).

## xy queries

[xy queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-and-xy/xy) search for documents that contain geometries in a Cartesian coordinate system. These geometries can be specified in [`xy_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-point) fields, which support points, and [`xy_shape`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-shape) fields, which support points, lines, circles, and polygons. 

xy queries return documents that contain:
- xy shapes and xy points that have one of four spatial relations to the provided shape: `INTERSECTS`, `DISJOINT`, `WITHIN`, or `CONTAINS`.
- xy points that intersect the provided shape.

## Geographic queries

Geographic queries search for documents that contain geospatial geometries. These geometries can be specified in [`geo_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point) fields, which support points on a map, and [`geo_shape`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape) fields, which support points, lines, circles, and polygons. 

OpenSearch provides the following geographic query types:

- [**Geo-bounding box queries**]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-and-xy/geo-bounding-box/): Return documents with geopoint field values that are within a bounding box. 
- **Geodistance queries** return documents with geopoints that are within a specified distance from the provided geopoint.
- **Geopolygon queries** return documents with geopoints that are within a polygon.
- **Geoshape queries** return documents that contain:
    - geoshapes and geopoints that have one of four spatial relations to the provided shape: `INTERSECTS`, `DISJOINT`, `WITHIN`, or `CONTAINS`.
    - geopoints that intersect the provided shape.