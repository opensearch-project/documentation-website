---
layout: default
title: Delete Role Mapping API
parent: Role Mapping APIs
grand_parent: Security APIs
nav_order: 60
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
DELETE _plugins/_security/api/rolesmapping/{role}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "'my-role' deleted."
}
```
