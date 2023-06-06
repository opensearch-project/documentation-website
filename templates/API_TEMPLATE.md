---
layout: default
title: Example API 
parent: 
nav_order: 
---

# Example API 
Introduced 1.0
{: .label .label-purple }

The Example API ... (descriptive sentence about what this API does).

## Path and HTTP methods

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

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `query_parameter` | String | Example query parameter description. Default is ... |

## Request fields

The following table lists the available request fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `example_object` | Object | Example object description. |
| `example_object.required_request_field` | Type | Required request field description. Required. |
| `example_object.optional_request_field` | Type | Optional request field description. Optional. Default is ... |

#### Example request

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

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  }
}
```
</details>

## Response fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `response_field` | Type | Response field description. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:example/permission/name`.
