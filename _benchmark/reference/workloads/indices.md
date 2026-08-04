---
layout: default
title: indices
parent: Anatomy of a workload
nav_order: 10
redirect_from:
  - /benchmark/workloads/indices/
---

<!-- vale off -->
# indices
<!-- vale on -->

The `indices` element contains a list of all indexes used in the workload. 

## Example

To create an index, specify its name. To add definitions to your index, use the `body` option and point it to the JSON file containing the index definitions:

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
