---
layout: default
title: Geographic and shape queries
parent: Query DSL
nav_order: 70
---

# Geographic and shape queries

You can search multiple dimensions with the geographic and shape query types. You can create queries to search two-dimensional geometries that map out cartesian data such as `point` fields that support x and y pairs and `shape` fields that support points, lines, circles and polygon shapes.

## Geographic queries

You can use the following geographic queries to search documents that include `geo_point` field data:

- **Geo-bounding box** `geo_bounding_box` – Returns documents with `geo_point` field values that are within a bounding box.
- **Geo distance** `geo_distance` – Returns documents that contain the geographic points within a specified distance from a central point.
- **Geo polygon** `geo_polygon` – Returns documents that contain the specified geographic points within the specified polygon.
- **xy point queries** – Returns documents that contain two-dimensional coordinates in `xy_point` or `xy_shape` fields.  To learn more, see [xy queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/xy/).

## Pre-indexed shape query

You can use the pre-indexed shape query `indexed_shape` to specify a `shape` query for a shape that has been previously been indexed. You need to specify the following pre-indexed shape fields `id`, `index` `path` and `routing`. Use the `ignore_unmapped` option set to `true` to ignore any fields not mapped to the previous index specified in the `indexed_shape` query. By default, `ignore_unmapped` is set to `false` to throw an exception if the field is not mapped.

### Spacial relation operators

You can use the following spacial relation operators with pre-indexed shape queries:
- `intersects` – Returns all documents with intersecting values specified by the `shape` field.
 - `disjoin` – Returns all documents that do not match the `shape` field coordinates specified in the query.
- `within` – Returns all documents that match the specified geometry for the `shape` field.
- `contains` – Returns all documents with `shape` field values that match the geometry specified in the `shape` query.