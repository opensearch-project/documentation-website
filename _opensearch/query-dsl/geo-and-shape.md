---
layout: default
title: Geographic and shape queries
parent: Query DSL
nav_order: 40
---

# Geographic and shape queries

You can search multiple dimensions with the geographic and cartesian shape queries.

## Cartesian shape queries

You can create queries to search two-dimensional geometries that map out cartesian data such as the `xy_point` field that supports x and y pairs and the `xy_shape` field that supports points, lines, circles, and polygon shapes. These queries return documents that contain two-dimensional coordinates in `xy_point` or `xy_shape` fields. To learn more, see [xy queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/xy/).

### Pre-indexed shape query

You can search for an xy shape that was previously indexed by defining the shape with the `indexed_shape` object, and referencing the shape name in the `id` field. Specifying the `id` field is required, while  `index`, `path`, and `routing` fields are optional. Set the `ignore_unmapped` option to `true` to ignore any pre-indexed fields that were mapped in the shape to which you are referencing. By default, `ignore_unmapped` is set to `false`, which throws an exception if the field is not mapped. For more details, see [Pre-indexed shape definition]({{site.url}}{{site.baseurl}}(/opensearch/query-dsl/xy/#using-a-pre-indexed-shape-definition)).
## Geographic queries

You can use the following geographic queries to search documents that include geopoint field data:

- **Geo-bounding box** `geo_bounding_box` – Returns documents with `geo_point` field values that are within a bounding box. To learn more, see [Geo-bounding box queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-bounding-box/).
- **Geo distance** `geo_distance` – Returns documents that contain the geographic points within a specified distance from a central point.
- **Geo polygon** `geo_polygon` – Returns documents that contain the specified geographic points within the specified polygon.