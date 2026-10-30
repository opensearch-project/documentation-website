---
layout: default
title: Delete role
parent: Role APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete Role API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified role.

<!-- spec_insert_start
api: security.delete_role
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/roles/test-role
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'test-role' deleted."
}
```
