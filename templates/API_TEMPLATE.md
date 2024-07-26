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

## Example request(s)

**TIP:** If multiple examples exist for the request, seperate those examples using an `h3` header underneath this section.

### Request with an example object

The following example shows an API request with an example object: 

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

## Request without an example object

The following example shows an API request without an example object:

```json
POST /_example/endpoint/
```
{% include copy-curl.html %}


## Example response

**TIP:** If multiple response examples exist for the request, seperate those examples using an `h3` header underneath this section, similar to the [Example requests](#example-requests).

The following example shows an API response:

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

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `response_field` | Type | Response field description. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:example/permission/name`.


