---
layout: default
title: Get Role API
parent: Role APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Role API
**Introduced 1.0**
{: .label .label-purple }

Retrieves one role.

<!-- spec_insert_start
api: security.get_role
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/roles/{role}
```
{% include copy-curl.html %}

## Example response

```json
{
  "test-role": {
    "reserved": false,
    "hidden": false,
    "cluster_permissions": [
      "cluster_composite_ops",
      "indices_monitor"
    ],
    "index_permissions": [{
      "index_patterns": [
        "movies*"
      ],
      "dls": "",
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "read"
      ]
    }],
    "tenant_permissions": [{
      "tenant_patterns": [
        "human_resources"
      ],
      "allowed_actions": [
        "kibana_all_read"
      ]
    }],
    "static": false
  }
}
```
