---
layout: default
title: Start Replication API
parent: Replication APIs
nav_order: 10
---

# Start Replication API
**Introduced 1.1**
{: .label .label-purple }

The Start Replication API initiates a replication connection between two indexes. This API designates one index as the leader and another as the follower, establishing a one-way replication where changes made to the leader index are automatically replicated to the follower index.

<!-- spec_insert_start
api: replication.start
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_replication/{index}/_start
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: replication.start
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the data stream, index, or index alias to perform bulk actions on. |

<!-- spec_insert_end -->

## Request body fields

The request body is **required**. It is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `leader_index` | **Required** | String | The name of the source index that will be replicated from. |
| `leader_alias` | Optional | String | The name of an index alias pointing to the leader index. Use this when the leader index name might change. |
| `use_roles` | Optional | Object | Defines custom roles for the replication connection. |

<details markdown="block">
  <summary>
    Request body fields: <code>use_roles</code>
  </summary>
  {: .text-delta}

`use_roles` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `leader_cluster_role` | String | The role used for the leader cluster during replication. This role must have appropriate read permissions on the leader index. |
| `follower_cluster_role` | String | The role used for the follower cluster during replication. This role must have appropriate write permissions on the follower index. |

</details>

## Example request

The following example starts replication from `leader-index` to `follower-index`:

```json
PUT /_plugins/_replication/follower-index/_start
{
  "leader_index": "leader-index"
}
```
{% include copy-curl.html %}

The following example uses custom roles for the replication connection:

```json
PUT /_plugins/_replication/<follower-index>/_start
{
   "leader_alias":"<connection-alias-name>",
   "leader_index":"<index-name>",
   "use_roles":{
      "leader_cluster_role":"<role-name>",
      "follower_cluster_role":"<role-name>"
   }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```


