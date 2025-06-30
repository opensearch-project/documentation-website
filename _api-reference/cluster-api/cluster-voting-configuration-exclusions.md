---
layout: default
title: Voting configuration exclusions
parent: Cluster APIs
nav_order: 75
---

# Adding voting configuration exclusions

The `_cluster/voting_config_exclusions` API allows you to exclude one or more nodes from the voting configuration. This is useful when you want to safely remove cluster manager eligible nodes from the cluster or to change the current cluster manager.

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: endpoints
-->
## Endpoints
```json
POST /_cluster/voting_config_exclusions
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: query_parameters
include_global: false
include_deprecated: false
columns: Parameter, Data type, Description
pretty: true
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter    | Data type      | Description                                                                                                                                                                                                                                                                 |
|:-------------|:---------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `node_ids`   | List or String | A comma-separated list of node IDs to exclude from the voting configuration. When using this setting, you cannot also specify `node_names`. Either `node_ids` or `node_names` are required to receive a valid response.                                                     |
| `node_names` | List or String | A comma-separated list of node names to exclude from the voting configuration. When using this setting, you cannot also specify `node_ids`. Either `node_ids` or `node_names` are required to receive a valid response.                                                     |
| `timeout`    | String         | When adding a voting configuration exclusion, the API waits for the specified nodes to be excluded from the voting configuration before returning a response. If the timeout expires before the appropriate condition is satisfied, the request fails and returns an error. |

<!-- spec_insert_end -->

## Example

Exclude a node named `opensearch-node1` from the voting configuration:

```json
POST /_cluster/voting_config_exclusions?node_names=opensearch-node1
```
{% include copy-curl.html %}

You can also specify node IDs instead:

```json
POST /_cluster/voting_config_exclusions?node_ids=UfVnWzDoT4mYtjb6CZsGvw
```
{% include copy-curl.html %}

# Removing voting configuration exclusions

Use the `_cluster/voting_config_exclusions` DELETE API to clear the list of nodes that were previously excluded from the voting configuration. This is typically used after excluded nodes have been safely removed or replaced. You can optionally wait for the nodes to be removed from the cluster before clearing the exclusions.

<!-- spec_insert_start
api: cluster.delete_voting_config_exclusions
component: endpoints
-->
## Endpoints
```json
DELETE /_cluster/voting_config_exclusions
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.delete_voting_config_exclusions
component: query_parameters
include_global: false
include_deprecated: false
columns: Parameter, Data type, Description
pretty: true
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter          | Data type | Description                                                                                                                                                                                                                                                                                                                                                                          |
|:-------------------|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `wait_for_removal` | Boolean   | Specifies whether to wait for all excluded nodes to be removed from the cluster before clearing the voting configuration exclusions list. When `true`, all excluded nodes are removed from the cluster before this API takes any action. When `false`, the voting configuration exclusions list is cleared even if some excluded nodes are still in the cluster. _(Default: `true`)_ |

<!-- spec_insert_end -->

## Example

Use the following command to remove all voting configuration exclusions without waiting for nodes to be removed:

```json
DELETE /_cluster/voting_config_exclusions?wait_for_removal=false
```
{% include copy-curl.html %}

