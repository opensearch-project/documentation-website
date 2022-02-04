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

```
DELETE _ingest/pipeline/{id}
```


## URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | How long to wait for a connection to the master node.
timeout | time | How long to wait for the request to return.

## Response

```json
{
  "acknowledged" : true
}
```