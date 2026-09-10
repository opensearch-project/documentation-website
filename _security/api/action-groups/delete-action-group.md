---
layout: default
title: Delete action group
parent: Action group APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete Action Group API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified action group.

<!-- spec_insert_start
api: security.delete_action_group
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/actiongroups/custom_action_group
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'custom_action_group' deleted."
}
```
