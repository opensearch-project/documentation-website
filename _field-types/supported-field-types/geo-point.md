---
layout: default
title: Geopoint
nav_order: 56
has_children: false
parent: Geographic field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/geo-point/
  - /field-types/geo-point/
---

# Geopoint field type

A geopoint field type contains a geographic point specified by latitude and longitude. 

## Example

Create a mapping with a geopoint field type:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "point": {
        "type": "geo_point"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Formats

Geopoints can be indexed in the following formats:

- An object with a latitude and longitude

```json
PUT testindex1/_doc/1
{
  "point": { 
    "lat": 40.71,
    "lon": 74.00
  }
}
```
{% include copy-curl.html %}

- A string in the "`latitude`,`longitude`" format

```json
PUT testindex1/_doc/2
{
  "point": "40.71,74.00" 
}
```
{% include copy-curl.html %}

- A geohash

```json
PUT testindex1/_doc/3
{
  "point": "txhxegj0uyp3"
}
```
{% include copy-curl.html %}

- An array in the [`longitude`, `latitude`] format

```json
PUT testindex1/_doc/4
{
  "point": [74.00, 40.71] 
}
```
{% include copy-curl.html %}

- A [Well-Known Text](https://docs.opengeospatial.org/is/12-063r5/12-063r5.html) POINT in the "POINT(`longitude` `latitude`)" format

```json
PUT testindex1/_doc/5
{
  "point": "POINT (74.00 40.71)"
}
```
{% include copy-curl.html %}

- GeoJSON format, where the `coordinates` are in the [`longitude`, `latitude`] format

```json
PUT testindex1/_doc/6
{
  "point": {
    "type": "Point",
    "coordinates": [74.00, 40.71]
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by geopoint field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`ignore_malformed` | A Boolean value that specifies to ignore malformed values and not to throw an exception. Valid values for latitude are [-90, 90]. Valid values for longitude are [-180, 180]. Default is `false`.
`ignore_z_value` | Specific to points with three coordinates. If `ignore_z_value` is `true`, the third coordinate is not indexed but is still stored in the _source field. If `ignore_z_value` is `false`, an exception is thrown.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.