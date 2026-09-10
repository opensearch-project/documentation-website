---
layout: default
title: Patch Roles API
parent: Role APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Roles API
**Introduced 1.0**
{: .label .label-purple }

Creates, updates, or deletes multiple roles in a single call.

<!-- spec_insert_start
api: security.patch_roles
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/roles
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/roles
[
  {
    "op": "replace", "path": "/role1/index_permissions/0/fls", "value": ["myfield*", "~myfield1"]
  },
  {
    "op": "remove", "path": "/role1/index_permissions/0/dls"
  },
  {
    "op": "add", "path": "/role2/cluster_permissions/-", "value": {
      "index_patterns": ["test_index"],
      "allowed_actions": ["indices:data/read/scroll/clear"]
    }
  }
]
```
{% include copy-curl.html %}

You can use `-` to insert a new permission to the end of the array of permissions.
{: .note}

## Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---
