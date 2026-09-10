---
layout: default
title: Get Action Group API
parent: Action Group APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Action Group API
**Introduced 1.0**
{: .label .label-purple }

Retrieves one action group.

```json
GET _plugins/_security/api/actiongroups/{action-group}
```
{% include copy-curl.html %}

<!-- spec_insert_start
api: security.get_action_group
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/actiongroups/custom_action_group
```
{% include copy-curl.html %}

## Example response

```json
{
  "custom_action_group": {
    "reserved": false,
    "hidden": false,
    "allowed_actions": [
      "kibana_all_read",
      "indices:admin/aliases/get",
      "indices:admin/aliases/exists"
    ],
    "description": "My custom action group",
    "static": false
  }
}
```
