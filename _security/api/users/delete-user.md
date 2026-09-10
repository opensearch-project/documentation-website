---
layout: default
title: Delete User API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 60
---

# Delete User API
**Introduced 1.0**
{: .label .label-purple }

## Example request

```json
DELETE _plugins/_security/api/internalusers/{username}
```
{% include copy-curl.html %}

<!-- spec_insert_start
api: security.delete_user
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Example response

```json
{
  "status":"OK",
  "message":"user kirk deleted."
}
```
