---
layout: default
title: Delete a pipeline
parent: Ingest APIs
nav_order: 14
redirect_from:
  - /opensearch/rest-api/ingest-apis/delete-ingest/
---

# Delete a pipeline

If you no longer want to use an ingest pipeline, use the delete ingest pipeline API operation.

## Example

```
DELETE _ingest/pipeline/12345
```
{% include copy-curl.html %}

## Path and HTTP methods

Delete an ingest pipeline based on that pipeline's ID.

```
DELETE _ingest/pipeline/
```

## URL parameters

All URL parameters are optional.

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