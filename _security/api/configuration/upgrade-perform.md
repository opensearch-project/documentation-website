---
layout: default
title: Perform upgrade
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 50
redirect_from:
  - /api-reference/security/configuration/upgrade-perform/
---

# Perform Upgrade API
**Introduced 2.14**
{: .label .label-purple }

The Perform Upgrade API allows you to upgrade your Security plugin configuration components. This API is typically used after identifying necessary upgrades with the [Check for Upgrades API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-check/). It updates your configuration components to ensure compatibility with the current version of the Security plugin.

This API adds and updates resources on the cluster's existing security configuration from the configuration bundled with the installed version of the Security plugin. The bundled configuration files are located in the `<OPENSEARCH_HOME>/security/config` directory. Default configuration files are updated when OpenSearch is upgraded, whereas the cluster configuration is only updated by cluster operators, so this API lets an operator upgrade missing defaults and stale default definitions.

<!-- spec_insert_start
api: security.config_upgrade_perform
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/_upgrade_perform
```
<!-- spec_insert_end -->

## Request body fields

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `config` | Array of Strings | A list of specific configuration components to upgrade. If omitted, all components requiring upgrades will be processed. Valid values include `roles`, `rolesmapping`, `actiongroups`, `config`, `internalusers`, and `tenants`. |

## Example request

```json
POST /_plugins/_security/api/_upgrade_perform
{
  "configs": [
    "roles"
  ]
}
```
{% include copy-curl.html security=true %}

## Example response

The `upgrades` object lists the changes that were applied:

```json
{
  "status": "OK",
  "upgrades": {
    "roles": {
      "add": [
        "flow_framework_full_access"
      ]
    }
  }
}
```

If the named configuration is already current, the request fails with `400 Bad Request`:

```json
{
  "status": "BAD_REQUEST",
  "message": "Unable to upgrade, no differences found in 'roles' config"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns `OK`. |
| `upgrades` | Object | A container for the upgrade results, organized by configuration type, such as `roles`. Each changed configuration type is represented as a key in this object. |

<details markdown="block">
  <summary>
    Response body fields: <code>upgrades</code>
  </summary>
  {: .text-delta}

Each configuration type in `upgrades` maps to an object whose keys are the actions applied to that type, such as `add` or `modify`. Each action maps to a list of the names of the objects modified by the upgrade.

</details>
