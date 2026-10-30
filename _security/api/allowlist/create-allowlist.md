---
layout: default
title: Create or update allow list
parent: Allow list APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Allow List API
**Introduced 2.1**
{: .label .label-purple }

Creates or replaces the allow list configuration.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.create_allowlist
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/allowlist
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `enabled` | Boolean | Whether the allow list is enforced. When `true`, users without administrator privileges can call only the requests listed in `requests`. | Yes |
| `requests` | Object | The permitted requests. Each key is a path, such as `/_cat/nodes`, and each value is an array of the HTTP methods permitted for that path. | Yes |

## Example request

```json
PUT _plugins/_security/api/allowlist
{
  "enabled": true,
  "requests": {
    "/_cat/nodes": [
      "GET"
    ],
    "/_cat/indices": [
      "GET"
    ],
    "/_plugins/_security/whoami": [
      "GET"
    ]
  }
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'config' updated."
}
```
