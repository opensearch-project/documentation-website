---
layout: default
title: Cluster voting configuration
nav_order: 55
parent: Cluster APIs
---

# Cluster voting configuration exclusions
**Introduced 1.0**
{: .label .label-purple }

The Cluster Voting Configuration Exclusions API adds or removes cluster-manager-eligible nodes from the list of excluded nodes in the voting configuration.

# Endpoints

The `POST` method excludes the specified nodes from the cluster voting configuration:

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: endpoints
omit_header: true
-->
```json
POST /_cluster/voting_config_exclusions
```
<!-- spec_insert_end -->

The `DELETE` method removes all exclusions from the voting configuration:

<!-- spec_insert_start
api: cluster.delete_voting_config_exclusions
component: endpoints
omit_header: true
-->
```json
DELETE /_cluster/voting_config_exclusions
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `node_ids` | List or String | A comma-separated list of node IDs to exclude from the voting configuration. When using this setting, you cannot also specify `node_names`. |
| `node_names` | List or String | A comma-separated list of node names to exclude from the voting configuration. When using this setting, you cannot also specify `node_ids`. |
| `timeout` | String | When adding a voting configuration exclusion, the API waits for the specified nodes to be excluded from the voting configuration before returning a response. If the timeout expires before the appropriate condition is satisfied, the request fails and returns an error. |

<!-- spec_insert_end -->

## Example request

```json
POST /_cluster/voting_config_exclusions?node_names=node-3,node-4&timeout=30s
```

## Example response

```json
{
  "acknowledged": true
}
```
