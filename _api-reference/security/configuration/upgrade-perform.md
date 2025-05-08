---
layout: default
title: Upgrade Perform API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 20
---

# Upgrade Perform API
**Introduced 1.0**
{: .label .label-purple }

The Upgrade Perform API allows you to upgrade your Security plugin configuration components. This API is typically used after identifying necessary upgrades with the [Upgrade Check API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/upgrade-check/). It updates your configuration components to ensure compatibility with the current version of the Security plugin.

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

The following example request performs upgrades on only the `roles` and `config` components:

```json
POST /_plugins/_security/api/_upgrade_perform
{
  "config": ["roles", "config"]
}
```
{% include copy-curl.html %}

To upgrade all components requiring it, you can omit the request body.

## Example response

The response includes information about which components were upgraded and the specific changes that were made:

```json
{
  "status": "OK",
  "upgrades": {
    "roles": [
      "Added permissions for dashboard features to admin role",
      "Updated cluster monitor permissions"
    ],
    "config": [
      "Updated authentication configuration",
      "Added new security settings"
    ]
  }
}
```

If no components require upgrades, you'll receive a response similar to the following:

```json
{
  "status": "OK",
  "upgrades": {}
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the upgrade operation. A successful operation returns "OK". |
| `upgrades` | Object | A detailed breakdown of the upgrades performed. Each key represents a configuration component that was upgraded, with an array of string descriptions detailing the specific changes made. |

## Usage notes

Consider the following important points when using this API:

- Before performing upgrades, we recommend first running the Upgrade Check API to identify which components need to be upgraded.
- Always back up your security configuration before performing upgrades.
- You must have administrator privileges to use this API.
- This API makes actual changes to your configuration, unlike the Upgrade Check API, which only identifies required changes.
- For clusters in production environments, consider first testing the upgrade process in a staging environment.
- After performing upgrades, verify that your security settings still work as expected.