---
layout: default
title: Generate on-behalf-of token
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 70
---

# Generate On-Behalf-Of Token API
**Introduced 2.12**
{: .label .label-purple }

Generates an On-Behalf-Of token for the current user.

On-Behalf-Of authentication must be configured before you call this API. Add an `on_behalf_of` section containing a `signing_key` to the `config.dynamic` section of the `config.yml` file and apply it with `securityadmin.sh`. For more information, see [On-Behalf-Of authentication]({{site.url}}{{site.baseurl}}/security/access-control/authentication-tokens/#on-behalf-of-authentication).

<!-- spec_insert_start
api: security.generate_obo_token
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/generateonbehalfoftoken
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.generate_obo_token
component: request_body_parameters
-->
## Request body fields

The request body is __required__. It is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `description` | **Required** | String | The description supplied by the user to describe the token. |
| `duration` | _Optional_ | String | A duration in seconds. |
| `service` | _Optional_ | String | The name of the service when generating a token for that service. |

<!-- spec_insert_end -->

## Example request

```json
POST _plugins/_security/api/generateonbehalfoftoken
{
  "description": "Reason for token",
  "service": "self-issued",
  "durationSeconds": "300"
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "user": "admin",
  "authenticationToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6InNlbGYtaXNzdWVkIiwibmJmIjoxNzg5MDUxOTQ1LCJpc3MiOiJvcGVuc2VhcmNoLWNsdXN0ZXIiLCJleHAiOjE3ODkwNTIyNDUsImlhdCI6MTc4OTA1MTk0NSwiZW5jcnlwdGVkX3JvbGVzIjoiZkE3blFnZW9hdmgrM1ZJWkZkRWNmUT09In0.1H6eSXlIsOfqZv7AeBPghgEC6tg4jrq5g-XiuNUYL3e705aP97c16xNXOnEUecOHsiqXskXqzH56Sw6ZLYSxSA",
  "durationSeconds": 300
}
```

<!-- spec_insert_start
api: security.generate_obo_token
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `authenticationToken` | String | The generated OBO token. | N/A |
| `durationSeconds` | String | The duration of the token. | `300s` |
| `user` | String | The name of the entity requesting token. | N/A |

<!-- spec_insert_end -->
