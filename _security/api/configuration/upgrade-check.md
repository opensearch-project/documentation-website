---
layout: default
title: Check for upgrades
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 40
redirect_from:
  - /api-reference/security/configuration/upgrade-check/
---

# Check for Upgrades API
**Introduced 2.14**
{: .label .label-purple }

The Check for Upgrades API allows you to check whether your Security plugin configuration requires any upgrades. This is particularly useful after upgrading OpenSearch to a new version because it helps identify any security configuration components that need to be updated to maintain compatibility or take advantage of new features.

With each new OpenSearch version, the default security configuration changes. This API compares the configuration bundled with the host's Security plugin against the cluster's current configuration and responds with whether an upgrade can be performed and which resources it would update. Use it to determine whether the cluster is missing defaults or has stale definitions of defaults.

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

```json
GET /_plugins/_security/api/_upgrade_check
```
{% include copy-curl.html security=true %}

## Example response

When an upgrade is available, `upgradeActions` lists the objects that it would change:

```json
{
  "status": "OK",
  "upgradeAvailable": true,
  "upgradeActions": {
    "roles": {
      "add": [
        "flow_framework_full_access"
      ]
    }
  }
}
```

When the configuration is already current, `upgradeActions` is omitted:

```json
{
  "status": "OK",
  "upgradeAvailable": false
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `upgradeAvailable` | Boolean | Returns `true` when an upgrade to the security configuration is available. |
| `upgradeActions` | Object | The security objects that would be modified by upgrading the host's Security plugin, organized by configuration type, such as `roles`. Each configuration type maps to an object whose keys are the actions that would be applied, such as `add`, and whose values list the names of the affected objects. |

## Usage notes

When managing security configurations across OpenSearch upgrades, it's important to understand how to interpret and act upon the Check for Upgrades API results. The following notes provide guidance on how to use this API:

- Running this API does not make any changes to your configuration; it only checks for potential upgrades.
- After identifying necessary upgrades using this API, you can use the appropriate Configuration APIs to implement the required changes.
- We recommend running this check after every OpenSearch version upgrade.
- You may need administrator privileges to use this API.
