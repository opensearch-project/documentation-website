---
layout: default
title: Authorization token
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 60
---

# Authorization Token API
**Introduced 1.0**
{: .label .label-purple }

Returns an `OK` status with an empty `message` field. This endpoint accepts a `POST` request but does not issue a token.

To generate an authorization token for a service account, use the [Generate User Token API]({{site.url}}{{site.baseurl}}/security/api/users/generate-user-token/).

<!-- spec_insert_start
api: security.authtoken
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/authtoken
```
<!-- spec_insert_end -->

## Example request

```json
POST _plugins/_security/api/authtoken
{}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": ""
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. Always `OK`. |
| `message` | String | Always an empty string. |
