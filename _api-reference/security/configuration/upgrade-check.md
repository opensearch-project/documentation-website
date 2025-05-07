---
layout: default
title: Upgrade Check API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 10
---

# Upgrade Check API
**Introduced 1.0**
{: .label .label-purple }

The Upgrade Check API allows you to check if your Security plugin configuration requires any upgrades. This is particularly useful after upgrading OpenSearch to a new version, as it helps identify if any security configuration components need to be updated to maintain compatibility or take advantage of new features.

<!-- spec_insert_start
api: security.config_upgrade_perform
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/_upgrade_perform
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.config_upgrade_perform
component: request_body_parameters
-->
## Request body fields

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `config` | Array of Strings | A list of configurations to upgrade. |


## Example request

```bash
GET /_plugins/_security/api/_upgrade_check
```
{% include copy-curl.html %}

## Example response

The following example shows a response where upgrades are available for some components:

```json
{
  "status": "OK",
  "upgradeAvailable": true,
  "upgradeActions": {
    "roles": ["update_required"],
    "rolesmapping": [],
    "actiongroups": ["no_update_required"],
    "config": ["update_required"],
    "internalusers": ["no_update_required"],
    "tenants": []
  }
}
```

If no upgrades are available, the response will look similar to the following:

```json
{
  "status": "OK",
  "upgradeAvailable": false,
  "upgradeActions": {}
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `upgradeAvailable` | Boolean | Indicates whether any configuration components need to be upgraded. |
| `upgradeActions` | Object | A detailed breakdown of which configuration components need to be updated. The object contains arrays for each component type (roles, rolesmapping, actiongroups, config, internalusers, tenants) with upgrade status indicators. |

## Usage notes

When managing security configurations across OpenSearch upgrades, it's important to understand how to interpret and act upon the Upgrade Check API results. The following notes provide guidance on how to use this API:

- Running this API does not make any changes to your configuration; it only checks for potential upgrades.
- After identifying necessary upgrades with this API, you can use the appropriate configuration APIs to implement the required changes.
- It's recommended to run this check after every OpenSearch version upgrade.
- You may need administrator privileges to use this API.