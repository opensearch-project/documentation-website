---
layout: default
title: Patch distinguished names
parent: Distinguished name APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Distinguished Names API
**Introduced 1.0**
{: .label .label-purple }

Updates the distinguished names in the allow list without replacing them. Specify a cluster name to update the distinguished names for one cluster, or omit the cluster name to make a bulk update.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.patch_distinguished_names
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/nodesdn
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.patch_distinguished_name
component: endpoints
omit_header: true
-->
```json
PATCH /_plugins/_security/api/nodesdn/{cluster_name}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `cluster_name` | String | No | The name of the cluster whose node distinguished names you want to update. If omitted, the request can modify multiple clusters. |

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify. When you specify a cluster name, the path is relative to that cluster, such as `/nodes_dn/0`. When you omit the cluster name, the path begins with the cluster name, such as `/cluster1/nodes_dn/0`. | Yes |
| `value` | Array | The new values used for the update. Required for the `add`, `replace`, and `test` operations. | No |

## Example request

The following request replaces the first distinguished name in the `cluster1` allow list:

```json
PATCH _plugins/_security/api/nodesdn/cluster1
[
   {
      "op":"replace",
      "path":"/nodes_dn/0",
      "value": ["CN=Karen Berge,CN=admin,DC=corp,DC=Fabrikam,DC=COM", "CN=George Wall,CN=admin,DC=corp,DC=Fabrikam,DC=COM"]
   }
]
```
{% include copy-curl.html security=true %}

The following request makes the same change as part of a bulk update:

```json
PATCH _plugins/_security/api/nodesdn
[
   {
      "op":"replace",
      "path":"/cluster1/nodes_dn/0",
      "value": ["CN=Karen Berge,CN=admin,DC=corp,DC=Fabrikam,DC=COM", "CN=George Wall,CN=admin,DC=corp,DC=Fabrikam,DC=COM"]
   }
]
```
{% include copy-curl.html security=true %}

## Example response

A request that updates the allow list for one cluster names it in the response:

```json
{
  "status": "OK",
  "message": "'cluster1' updated."
}
```

A bulk request does not name the clusters it changed:

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns `OK`. |
| `message` | String | A message describing the result of the operation. |
