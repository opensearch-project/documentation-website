---
layout: default
title: Generate user token
parent: Internal user APIs
grand_parent: Security APIs
nav_order: 50
---

# Generate User Token API
**Introduced 2.7**
{: .label .label-purple }

Generates an authorization token for the specified user.

A token can only be generated for a service account: an internal user created with the `service` and `enabled` attributes set to `true`. A request for any other user fails. For more information, see [Service accounts]({{site.url}}{{site.baseurl}}/security/access-control/authentication-tokens/#service-accounts).

<!-- spec_insert_start
api: security.generate_user_token
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/internalusers/{username}/authtoken
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.generate_user_token
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `username` | **Required** | String | The name of the user for whom to issue an authorization token. |

<!-- spec_insert_end -->

## Example request

The following request generates a token for the `svc-account` service account:

```json
POST _plugins/_security/api/internalusers/svc-account/authtoken
```
{% include copy-curl.html security=true %}

## Example response

The generated token is returned in the `message` field:

```json
{
  "status": "OK",
  "message": "'svc-account' authtoken generated Basic auth token with user=svc-account, password=4Yz0kQJsliaQ35"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. `OK` indicates that OpenSearch generated a token. |
| `message` | String | The generated credentials, in the form `'<username>' authtoken generated Basic auth token with user=<username>, password=<password>`. |
