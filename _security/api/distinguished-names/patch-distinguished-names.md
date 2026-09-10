---
layout: default
title: Patch Distinguished Names API
parent: Distinguished Name APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Distinguished Names API
**Introduced 1.0**
{: .label .label-purple }

Makes a bulk update for the list of distinguished names.

<!-- spec_insert_start
api: security.patch_distinguished_names
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/nodesdn
```
<!-- spec_insert_end -->

## Request body fields

| Field           | Data type  | Description                                                                                                       | Required |
|:----------------|:-----------|:------------------------------------------------------------------------------------------------------------------|:---------|
| `op`              | string     | The operation to perform on the action group. Possible values: `remove`,`add`, `replace`, `move`, `copy`, `test`. | Yes      |
| `path`            | string     | The path to the resource.                                                                                         | Yes      |
| `value`           | Array      | The new values used for the update.                                                                               | Yes      |


### Example request

```
PATCH _plugins/_security/api/nodesdn
[
   {
      "op":"replace",
      "path":"/cluster1/nodes_dn/0",
      "value": ["CN=Karen Berge,CN=admin,DC=corp,DC=Fabrikam,DC=COM", "CN=George Wall,CN=admin,DC=corp,DC=Fabrikam,DC=COM"]
   }
]
```
{% include copy-curl.html %}

### Example response

```json
{
  "status":"OK",
  "message":"Resources updated."
}
```

## Response body fields

| Field   | Data type | Description          |
|:--------|:----------|:---------------------|
| status  | string    | The response status. |
| message | string    | Response message.    |
