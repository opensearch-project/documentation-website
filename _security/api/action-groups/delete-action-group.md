---
layout: default
title: Delete Action Group API
parent: Action Group APIs
grand_parent: Security APIs
nav_order: 60
---

# Delete Action Group API
**Introduced 1.0**
{: .label .label-purple }

## Example request

```json
DELETE _plugins/_security/api/actiongroups/{action-group}
```
{% include copy-curl.html %}

<!-- spec_insert_start
api: security.delete_action_group
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Example response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```
