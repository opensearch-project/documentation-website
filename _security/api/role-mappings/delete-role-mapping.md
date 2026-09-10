---
layout: default
title: Delete role mapping
parent: Role mapping APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete Role Mapping API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified role mapping.

<!-- spec_insert_start
api: security.delete_role_mapping
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/rolesmapping/test-role
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'test-role' deleted."
}
```
