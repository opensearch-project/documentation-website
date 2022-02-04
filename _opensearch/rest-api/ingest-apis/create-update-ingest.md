---
layout: default
title: Create or update ingest pipeline
parent: Ingest APIs
grand_parent: REST API reference
nav_order: 11
---

# Create and update a pipeline

The create ingest pipeline API operation creates or updates an ingest pipeline. Each pipeline requires an ingest definition defining how each processor transforms your documents. 

## Example

```
PUT _ingest/pipeline/{id}
{
  "description" : "A description for your pipeline",
  "processors" : [
    {
      "set" : {
        "field": "field-name",
        "value": "value"
      }
    }
  ]
}
```

## Path and HTTP methods
```
PUT _ingest/pipeline/{id}
```

## Request body fields

Field | Type | Description
:--- | :--- | :---
`description` (optional) | string | Description of your ingest pipeline. 
`processors` | processor objects | A processor that transforms documents. Runs in the order specified. Appears in index once ran.

```json
{
  "description" : "A description for your pipeline",
  "processors" : [
    {
      "set" : {
        "field": "field-name",
        "value": "value"
      }
    }
  ]
}
```

## URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout

## Response

```json
{
  "acknowledged" : true
}
```






