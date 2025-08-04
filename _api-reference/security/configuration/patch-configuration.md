---
layout: default
title: Patch Configuration API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Configuration API
**Introduced 1.0**
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

The following example adds a new authentication domain and modifies an existing setting:

```json
PATCH /_plugins/_security/api/securityconfig
[
  {
    "op": "add",
    "path": "/config/dynamic/authc/saml_auth_domain",
    "value": {
      "http_enabled": true,
      "transport_enabled": false,
      "order": 1,
      "http_authenticator": {
        "type": "saml",
        "challenge": false,
        "config": {
          "idp": {
            "metadata_url": "https://idp.example.com/saml/metadata"
          },
          "sp": {
            "entity_id": "opensearch"
          }
        }
      },
      "authentication_backend": {
        "type": "noop",
        "config": {}
      }
    }
  },
  {
    "op": "replace",
    "path": "/config/dynamic/multi_rolespan_enabled",
    "value": true
  },
  {
    "op": "remove",
    "path": "/config/dynamic/authc/legacy_auth_domain"
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "Configuration updated."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `message` | String | A message describing the result of the operation. |

## JSON patch operations

The API supports the following JSON patch operations:

- **add**: Adds a value to an object or inserts it into an array. For existing properties, the value is replaced.
- **remove**: Removes a value from an object or array.
- **replace**: Replaces a value. 
- **move**: Moves a value from one location to another.
- **copy**: Copies a value from one location to another.
- **test**: Tests that a value at the target location is equal to the specified value.

## Usage notes

The Patch Configuration API provides more granular control over configuration updates than the Update Configuration API but still comes with potential risks:

- **Path format**: Paths start with `/config` followed by the JSON pointer path to the specific configuration element you want to modify.

- **Validation**: Limited validation is performed on the patched configuration, which may lead to security vulnerabilities if misconfigured.

- **Backup configuration**: Always back up your current security configuration before making changes.

- **Testing**: Test configuration changes in a development environment before deploying them to production.

## Enabling this API

By default, this API is disabled for security reasons. To enable it, perform the following steps:

1. Update the `opensearch.yml` file with the following:

   ```
   plugins.security.unsupported.restapi.allow_securityconfig_modification: true
   ```
   {% include copy.html %}

2. Update the Security plugin's `config.yml` file with the following:

   ```
   plugins.security.restapi.endpoints_disabled.securityconfig: "false"
   ```
   {% include copy.html %}

3. Restart your OpenSearch cluster.

Due to the potential security implications, enabling this API is generally not recommended for production environments.