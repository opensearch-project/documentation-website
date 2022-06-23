---
layout: default
title: Geo shape
nav_order: 57
has_children: false
parent: Geographic field types
grand_parent: Supported field types
---

# Geo shape field type

A geo shape field type is a geographic shape such as a polygon or a collection of geographic points.

## Example

Create a mapping with a geo shape field type:

```json
PUT /example
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