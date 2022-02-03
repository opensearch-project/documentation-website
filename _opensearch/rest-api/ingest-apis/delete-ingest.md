---
layout: default
title: Delete a pipeline
parent: Ingest APIs
grand_parent: REST API reference
nav_order: 14
---

# Delete a pipeline

If you no longer want to use an ingest pipeline, use the delete ingest pipeline API operation.

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