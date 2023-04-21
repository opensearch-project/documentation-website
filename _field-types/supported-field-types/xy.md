---
layout: default
title: Cartesian field types
nav_order: 57
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/xy/
  - /field-types/xy/
---

# Cartesian field types

Cartesian field types facilitate indexing and searching of points and shapes in a two-dimensional Cartesian coordinate system. Cartesian field types are similar to [geographic]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geographic/) field types, except they represent points and shapes on the Cartesian plane, which is not based on the Earth-fixed terrestrial reference system. Calculating distances on a plane is more efficient than calculating distances on a sphere, so distance sorting is faster for Cartesian field types. 

Cartesian field types work well for spatial applications like virtual reality, computer-aided design (CAD), and amusement park and sporting venue mapping. 

The coordinates for the Cartesian field types are single-precision floating-point values. For information about the range and precision of floating-point values, see [Numeric field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/).

The following table lists all Cartesian field types that OpenSearch supports.

Field Data type | Description
:--- | :---  
[`xy_point`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-point/) | A point in a two-dimensional Cartesian coordinate system, specified by x and y coordinates. 
[`xy_shape`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy-shape/) | A shape, such as a polygon or a collection of xy points, in a two-dimensional Cartesian coordinate system. 

Currently, OpenSearch supports indexing and searching of Cartesian field types but not aggregations on Cartesian field types. If you'd like to see aggregations implemented, open a [GitHub issue](https://github.com/opensearch-project/geospatial).
{: .note}