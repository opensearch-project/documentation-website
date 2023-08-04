---
layout: default
title: indices
parent: Workload reference
nav_order: 65
---

The `indices` element contains a list of all indices used in the workload. 

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
| `name` | Yes | String | The name of the index template. |
| `body` | No | String | The file name corresponding to the index definition that will be used in the body of the create index API. |
