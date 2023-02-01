---
layout: default
title: Geographic and shape queries
parent: Query DSL
nav_order: 45
---

# Geographic and shape queries

You can search for documents that contain points and shapes in a Cartesian coordinate system using xy shape queries. You can use geographic queries to search for documents that contain geographic points and shapes.

## Cartesian shape queries

You can create queries to search two-dimensional geometries that map out cartesian data, such as the `xy_point` field, which supports x and y pairs, and the `xy_shape` field, which supports points, lines, circles, and polygon shapes. These queries return documents that contain two-dimensional coordinates in `xy_point` or `xy_shape` fields. To learn more, see [xy queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/xy/).

You can define the shape in an xy query either by providing a new shape definition at the query time or by referencing the name of a shape that was pre-indexed in a different index. For more details, see [Pre-indexed shape definition]({{site.url}}{{site.baseurl}}(/opensearch/query-dsl/xy/#using-a-pre-indexed-shape-definition)).
## Geographic queries

You can use the following geographic queries to search documents that include geopoint field data:

- **Geo-bounding box** `geo_bounding_box` – Returns documents with `geo_point` field values that are within a bounding box. To learn more, see [Geo-bounding box queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-bounding-box/).
- **Geo distance** `geo_distance` – Returns documents that contain the geographic points within a specified distance from a geopoint.
- **Geo polygon** `geo_polygon` – Returns documents that contain the specified geographic points within the specified polygon.