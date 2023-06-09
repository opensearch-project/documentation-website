---
layout: default
title: Delete a pipeline
parent: Ingest APIs
nav_order: 25
redirect_from:
  - /opensearch/rest-api/ingest-apis/delete-ingest/
---

# Delete a pipeline

The delete ingest pipeline API deletes a pipeline. 

#### Request

```json
DELETE _ingest/pipeline/<pipeline>
```
{% include copy-curl.html %}

## Path parameters

Path parameters are required.

Parameter | Type | Description
:--- | :--- | :---
`pipeline` | String | Pipeline ID or wildcard expression of pipeline IDs used to limit the request. 

To delete all ingest pipelines in a cluster, use a value of *.

## Query parameters

Query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | Period to wait for a connection to the cluster manager node. Defaults to 30s.
`timeout` | Time | Period to wait for a response. Defaults to #s.

## Examples

The following are delete pipeline examples.

### Delete a specific pipeline

```json
DELETE /_ingest/pipeline/pipeline-specific
```

### Delete pipelines using a wildcard expression

```json
DELETE /_ingest/pipeline/pipeline-*
```

### Delete all pipelines

```json
DELETE /_ingest/pipeline/*
```