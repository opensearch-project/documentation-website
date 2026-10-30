---
layout: default
title: Get roles
parent: Role APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Roles API
**Introduced 1.0**
{: .label .label-purple }

Retrieves roles. Specify a role name to retrieve one role, or omit the role name to retrieve all roles.

<!-- spec_insert_start
api: security.get_roles
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/roles
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.get_role
component: endpoints
omit_header: true
-->
```json
GET /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `role` | String | No | The name of the role to retrieve. If omitted, all roles are returned. |

## Example request

The following request retrieves all roles:

```json
GET _plugins/_security/api/roles
```
{% include copy-curl.html security=true %}

The following request retrieves the `test-role` role:

```json
GET _plugins/_security/api/roles/test-role
```
{% include copy-curl.html security=true %}

## Example response

The response is abbreviated here:

```json
{
  "observability_read_access": {
    "cluster_permissions": [
      "cluster:admin/opensearch/observability/get"
    ],
    "hidden": false,
    "index_permissions": [],
    "reserved": true,
    "static": false,
    "tenant_permissions": []
  },
  ...
}
```

The response to a request for one role contains only that role:

```json
{
  "test-role": {
    "cluster_permissions": [
      "cluster_composite_ops",
      "indices_monitor"
    ],
    "hidden": false,
    "index_permissions": [
      {
        "allowed_actions": [
          "read"
        ],
        "dls": "",
        "fls": [],
        "index_patterns": [
          "movies*"
        ],
        "masked_fields": []
      }
    ],
    "reserved": false,
    "static": false,
    "tenant_permissions": [
      {
        "allowed_actions": [
          "kibana_all_read"
        ],
        "tenant_patterns": [
          "human_resources"
        ]
      }
    ]
  }
}
```
