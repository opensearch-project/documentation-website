---
layout: default
title: Get ingest pipeline
parent: Ingest APIs
grand_parent: REST API reference
nav_order: 10
---

## Get ingest pipeline

Returns all the information related to the specified ingest pipeline. 

## Example

```
GET _ingest/pipeline/{id}
```

## Path and HTTP methods

Return all ingest pipelines.

```
GET _ingest/pipeline
```


Returns a single ingest pipeline based on the pipeline's ID.

```
GET _ingest/pipeline/{id}
```

## URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node

## Response

```json
{
  "pipeline-id" : {
    "description" : "A description for your pipeline",
    "processors" : [
      {
        "set" : {
          "field" : "field-name",
          "value" : "value"
        }
      }
    ]
  }
}
```