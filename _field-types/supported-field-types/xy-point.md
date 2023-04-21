---
layout: default
title: xy point
nav_order: 58
has_children: false
parent: Cartesian field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/xy-point/
  - /field-types/xy-point/
---

# xy point field type

An xy point field type contains a point in a two-dimensional Cartesian coordinate system, specified by x and y coordinates. It is based on the Lucene [XYPoint](https://lucene.apache.org/core/9_3_0/core/org/apache/lucene/geo/XYPoint.html) field type. The xy point field type is similar to the [geopoint]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/) field type, but does not have the range limitations of geopoint. The coordinates of an xy point are single-precision floating-point values. For information about the range and precision of floating-point values, see [Numeric field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/).

## Example

Create a mapping with an xy point field type:

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
{% include copy-curl.html %}

## Formats

xy points can be indexed in the following formats:

- An object with x and y coordinates

```json
PUT testindex1/_doc/1
{
  "point": { 
    "x": 0.5,
    "y": 4.5
  }
}
```
{% include copy-curl.html %}

- A string in the "`x`, `y`" format

```json
PUT testindex1/_doc/2
{
  "point": "0.5, 4.5" 
}
```
{% include copy-curl.html %}

- An array in the [`x`, `y`] format

```json
PUT testindex1/_doc/3
{
  "point": [0.5, 4.5] 
}
```
{% include copy-curl.html %}

- A [well-known text (WKT)](https://docs.opengeospatial.org/is/12-063r5/12-063r5.html) POINT in the "POINT(`x` `y`)" format

```json
PUT testindex1/_doc/4
{
  "point": "POINT (0.5 4.5)"
}
```
{% include copy-curl.html %}

- GeoJSON format

```json
PUT testindex1/_doc/5
{
  "point" : {
    "type" : "Point",
    "coordinates" : [0.5, 4.5]        
  }
}
```
{% include copy-curl.html %}

In all xy point formats, the coordinates must be specified in the `x, y` order. 
{: .note}

## Parameters

The following table lists the parameters accepted by xy point field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`ignore_malformed` | A Boolean value that specifies to ignore malformed values and not to throw an exception. Default is `false`.
`ignore_z_value` | Specific to points with three coordinates. If `ignore_z_value` is `true`, the third coordinate is not indexed but is still stored in the _source field. If `ignore_z_value` is `false`, an exception is thrown.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. The value must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.