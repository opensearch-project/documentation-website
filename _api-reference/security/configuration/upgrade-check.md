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

The Upgrade Check API allows you to check whether your Security plugin configuration requires any upgrades. This is particularly useful after upgrading OpenSearch to a new version because it helps identify any security configuration components that need to be updated to maintain compatibility or take advantage of new features.

<!-- spec_insert_start
api: security.config_upgrade_check
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/_upgrade_check
```
<!-- spec_insert_end -->


## Example request

```bash
GET /_plugins/_security/api/_upgrade_check
```
{% include copy-curl.html %}

## Example response

The following example response shows that upgrades are available for some components:

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

If no upgrades are available, the response will appear similar to the following:

```json
{
  "status": "OK",
  "upgradeAvailable": false,
  "upgradeActions": {}
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `upgradeAvailable` | Boolean | Indicates whether any configuration components need to be upgraded. |
| `upgradeActions` | Object | A detailed breakdown of which configuration components need to be upgraded. The object contains arrays for each component type (`roles`, `rolesmapping`, `actiongroups`, `config`, `internalusers`, `tenants`) with upgrade status indicators. |

## Usage notes

When managing security configurations across OpenSearch upgrades, it's important to understand how to interpret and act upon the Upgrade Check API results. The following notes provide guidance on how to use this API:

- Running this API does not make any changes to your configuration; it only checks for potential upgrades.
- After identifying necessary upgrades using this API, you can use the appropriate Configuration APIs to implement the required changes.
- We recommend running this check after every OpenSearch version upgrade.
- You may need administrator privileges to use this API.
