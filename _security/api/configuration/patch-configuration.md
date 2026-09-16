---
layout: default
title: Patch configuration
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 20
redirect_from:
  - /api-reference/security/configuration/patch-configuration/
---

# Patch Configuration API
**Introduced 2.10**
{: .label .label-purple }

The Patch Configuration API allows you to update specific parts of the Security plugin configuration without replacing the entire configuration document. 

This operation can easily break your existing security configuration. We strongly recommend using the `securityadmin.sh` script instead, which includes validations and safeguards to prevent misconfiguration.
{: .warning}

<!-- spec_insert_start
api: security.patch_configuration
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/securityconfig
```
<!-- spec_insert_end -->

## Request body fields

The request body is **required**. It is an **array of JSON objects** (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `op` | **Required** | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. |
| `path` | **Required** | String | The JSON pointer path to the location in the configuration to modify. |
| `value` | Optional | Object | The value to use for the operation. Required for `add`, `replace`, and `test` operations. |

## Example request

```json
PATCH /_plugins/_security/api/securityconfig
[
  {
    "op": "replace",
    "path": "/config/dynamic/authc/basic_internal_auth_domain/description",
    "value": "Authenticate via HTTP Basic against the internal users database"
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

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `message` | String | A message describing the result of the operation. |

## Enabling this API

By default, this API is disabled for security reasons. To enable it, add the following line to `opensearch.yml`:

```yml
plugins.security.unsupported.restapi.allow_securityconfig_modification: true
```
{% include copy.html %}

For more information about granting access to the Security APIs, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
