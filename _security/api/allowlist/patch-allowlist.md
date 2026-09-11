---
layout: default
title: Patch allow list
parent: Allow list APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Allow List API
**Introduced 2.1**
{: .label .label-purple }

Updates an allow list configuration.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.patch_allowlist
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/allowlist
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify, such as `/config/enabled` or `/config/requests`. Because the path uses JSON Pointer syntax, escape any forward slash in a request path as `~1`. For example, the path to the `/_cat/shards` entry is `/config/requests/~1_cat~1shards`. | Yes |
| `value` | Object or array | The new value. Required for the `add`, `replace`, and `test` operations. | No |

## Example request

The following request adds the `/_cat/shards` endpoint to the allow list:

```json
PATCH _plugins/_security/api/allowlist
[
  {
    "op": "add",
    "path": "/config/requests/~1_cat~1shards",
    "value": [
      "GET"
    ]
  }
]
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```
