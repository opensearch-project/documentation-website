---
layout: default
title: Delete Role API
parent: Role APIs
grand_parent: Security APIs
nav_order: 60
---

# Delete Role API
**Introduced 1.0**
{: .label .label-purple }

## Example request

```json
DELETE _plugins/_security/api/roles/{role}
```
{% include copy-curl.html %}

<!-- spec_insert_start
api: security.delete_role
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Example response

```json
{
  "status":"OK",
  "message":"role test-role deleted."
}
```
