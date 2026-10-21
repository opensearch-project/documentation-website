---
layout: default
title: Delete pipeline
nav_order: 13
redirect_from:
  - /opensearch/rest-api/ingest-apis/delete-ingest/
  - /api-reference/ingest-apis/delete-ingest/
---

# Delete Pipeline API
**Introduced 1.0**
{: .label .label-purple }

The Delete Pipeline API deletes one or more ingest pipelines. If an index uses a deleted pipeline as its default or final pipeline, indexing requests to that index fail until you update the index settings.

## Endpoints

```json
DELETE /_ingest/pipeline/{pipeline-id}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Required | Data type | Description
:--- | :--- | :--- | :---
`pipeline-id` | Required | String | The ID of the pipeline to delete. Supports wildcard expressions, for example, `logs-*`. To delete all pipelines in the cluster, use `*`.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response. Default is `30s`.

## Example request

The following request deletes the `my-pipeline` pipeline:

```json
DELETE /_ingest/pipeline/my-pipeline
```
{% include copy-curl.html %}

The following request deletes all pipelines whose IDs start with `logs-`:

```json
DELETE /_ingest/pipeline/logs-*
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```

If no pipeline matches the specified ID, the API returns a `404` error.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/ingest/pipeline/delete`.
