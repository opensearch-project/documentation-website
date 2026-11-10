---
layout: default
title: Get pipeline
nav_order: 12
redirect_from:
  - /opensearch/rest-api/ingest-apis/get-ingest/
  - /api-reference/ingest-apis/get-ingest/
---

# Get Pipeline API
**Introduced 1.0**
{: .label .label-purple }

The Get Pipeline API returns the definitions of one or more ingest pipelines.

## Endpoints

```json
GET /_ingest/pipeline
GET /_ingest/pipeline/{pipeline-id}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`pipeline-id` | String | A comma-separated list of IDs of the pipelines to retrieve. Supports wildcard expressions. If not specified, the API returns all pipelines in the cluster.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.

## Example request

The following request returns the definition of the `my-pipeline` pipeline:

```json
GET /_ingest/pipeline/my-pipeline
```
{% include copy-curl.html %}

The following request returns the definitions of all pipelines whose IDs start with `logs-` and of the `orders-pipeline` pipeline:

```json
GET /_ingest/pipeline/logs-*,orders-pipeline
```
{% include copy-curl.html %}

To retrieve only the version of a pipeline, filter the response using the `filter_path` query parameter. For more information, see [Pipeline versioning]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#pipeline-versioning).

```json
GET /_ingest/pipeline/my-pipeline?filter_path=*.version
```
{% include copy-curl.html %}

## Example response

The response contains the definition of each requested pipeline, keyed by pipeline ID:

```json
{
  "my-pipeline": {
    "description": "This pipeline processes student data",
    "processors": [
      {
        "set": {
          "description": "Sets the graduation year to 2023",
          "field": "grad_year",
          "value": 2023
        }
      },
      {
        "set": {
          "description": "Sets graduated to true",
          "field": "graduated",
          "value": true
        }
      },
      {
        "uppercase": {
          "field": "name"
        }
      }
    ]
  }
}
```

If no pipeline matches the specified ID, the API returns an empty object and a `404` status code.

## Response body fields

The response contains one object for each returned pipeline, named after the pipeline ID. Each pipeline object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`description` | String | The pipeline description. Returned only if the pipeline has a description.
`version` | Integer | The pipeline version. Returned only if the pipeline has a version.
`processors` | Array of objects | The processors in the pipeline, in the order in which they run.
`on_failure` | Array of objects | The processors that run if a processor in the pipeline fails. Returned only if the pipeline defines pipeline-level failure handling.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/ingest/pipeline/get`.
