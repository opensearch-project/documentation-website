---
layout: default
title: Patch Configuration API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/api-reference/security/configuration/patch-configuration/
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

<!-- spec_insert_start
component: example_code
rest: PATCH /_plugins/_security/api/securityconfig
body: |
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
-->
{% capture step1_rest %}
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
{% endcapture %}

{% capture step1_python %}


response = client.security.patch_configuration(
  body =   [
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
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

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
