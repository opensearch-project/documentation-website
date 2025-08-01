---
layout: default
title: Locks API
parent: Job Scheduler
nav_order: 1
redirect_from:
    - /monitoring-plugins/job-scheduler/api/
---

# Job Scheduler Locks API 
Introduced 3.2
{: .label .label-purple }

This API returns the locks on all the jobs within the Job Scheduler.

## Endpoints

```json
POST /_example/endpoint/
POST /_example/endpoint/<path_parameter>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `path_parameter` | Type | Example path parameter description. Default is ... |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `query_parameter` | String | Example query parameter description. Default is ... |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `example_object` | Object | Example object description. |
| `example_object.required_request_field` | Type | Required request field description. Required. |
| `example_object.optional_request_field` | Type | Optional request field description. Optional. Default is ... |

## Example request

```json
POST /_example/endpoint/
{
  "example_object": {
      "required_request_field": "example value",
      "optional_request_field": "example value"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `response_field` | Type | Response field description. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:example/permission/name`.