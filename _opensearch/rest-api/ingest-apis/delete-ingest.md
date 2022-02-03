---
layout: default
title: Delete a pipeline
parent: Ingest APIs
grand_parent: REST API reference
nav_order: 14
---

# Delete a pipeline

Deletes an ingest pipeline. 

## Example

```curl
DELETE _ingest/pipeline/{id}
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