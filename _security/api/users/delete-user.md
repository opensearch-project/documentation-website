---
layout: default
title: Delete user
parent: Internal user APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete User API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified internal user.

<!-- spec_insert_start
api: security.delete_user
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/internalusers/kirk
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'kirk' deleted."
}
```
