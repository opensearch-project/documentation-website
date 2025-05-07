---
layout: default
title: Authentication Token API
grand_parent: Security APIs
parent: Authentication APIs
nav_order: 20
---

# Authentication Token API

The **Authentication Token API** generates authentication tokens for OpenSearch users. Tokens allow clients—such as applications or scripts—to authenticate without repeatedly sending username and password credentials. This approach improves security by reducing the need to store or transmit plain-text credentials.


<!-- spec_insert_start
api: security.authtoken
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/authtoken
```
<!-- spec_insert_end -->

## Request body fields

The following table lists the required fields for the request body:

| Field | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | Yes | The username for which to generate a token. |
| `password` | String | Yes | The password for the specified user. |

## Example request

```json
POST /_plugins/_security/api/authtoken
{
  "username": "admin",
  "password": "your-secure-password"
}
```
{% include copy-curl.html %}

## Example response

A successful response returns a JSON object containing the authentication token:

```json
{
  "status": "OK",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

If authentication fails, the API returns an error:

```json
{
  "status": "UNAUTHORIZED",
  "message": "Invalid credentials"
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `token` | String | The generated authentication token (returned only on success). |
| `expires_in` | Integer | The number of seconds until the token expires (returned only on success). |
| `message` | String | A message describing the result, typically provided when there's an error. |

## Using the token

To authenticate with a token, include it in the `Authorization` header of your request, similar to the following syntax:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The following example shows how to authenticate with the `Authorization` header:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." https://localhost:9200/_plugins/_security/api/roles/
```

## Token expiration

Authentication tokens have a limited lifespan, indicated by the `expires_in` field in the response. You'll need to request a new token once the current one expires.