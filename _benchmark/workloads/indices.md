---
layout: default
title: indexes
parent: Workload reference
nav_order: 65
---

# indexes

The `indices` element contains a list of all indexes used in the workload.

## Example

```json
"indices": [
    {
      "name": "geonames",
      "body": "geonames-index.json",
    }
]
```

## Configuration options

Use the following options with `indices`:

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the index template.
`body` | No | String | The file name corresponding to the index definition used in the body of the Create Index API.
