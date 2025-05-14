---
layout: default
title: Create Replication Rule API
parent: Replication APIs
nav_order: 55
---

# Create Replication Rule API
Introduced 1.0
{: .label .label-purple }

The Create Replication Rule API establishes automatic replication patterns (auto-follow rules) that monitor for new indexes matching specified patterns and automatically configure them for replication. This allows for automated replication management without requiring manual setup for each new index.

<!-- spec_insert_start
api: replication.create_replication_rule
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_replication/_autofollow
```
<!-- spec_insert_end -->

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `leader_alias` | String | The name of an index alias to use when referring to the leader index. |
| `name` | String | The name of the replication rule. Required. |
| `pattern` | String | The pattern used to match indexes for automatic replication. Required. |
| `use_roles` | Object | Object containing custom roles for the replication connection. |

<details markdown="block">
  <summary>
    Request body fields: <code>use_roles</code>
  </summary>
  {: .text-delta}

`use_roles` is a JSON object with the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `follower_cluster_role` | String | The role used for the follower cluster during replication. |
| `leader_cluster_role` | String | The role used for the leader cluster during replication. |
</details>

## Example request

The following example creates a replication rule named "logs-rule" that automatically replicates any index matching the "logs-*" pattern:

```json
POST /_plugins/_replication/_autofollow
{
  "name": "logs-rule",
  "pattern": "logs-*",
  "leader_alias": "logs-primary"
}
```
{% include copy-curl.html %}

The following example creates a replication rule with custom roles:

```json
POST /_plugins/_replication/_autofollow
{
  "name": "metrics-rule",
  "pattern": "metrics-*",
  "leader_alias": "metrics-primary",
  "use_roles": {
    "leader_cluster_role": "replication_leader_role",
    "follower_cluster_role": "replication_follower_role"
  }
}
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "acknowledged": true
}
```
