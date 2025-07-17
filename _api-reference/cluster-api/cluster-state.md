---
layout: default
title: Cluster state
nav_order: 55
parent: Cluster APIs
---

# Cluster state API

The `/_cluster/state` API retrieves the current state of the cluster, including metadata, routing table, nodes, and other components. This API is primarily used for monitoring, debugging, and internal purposes. It gives a snapshot of various parts of the cluster's state as maintained by the cluster manager node.

## Endpoints

```json
GET /_cluster/state
GET /_cluster/state/{metric}
GET /_cluster/state/{metric}/{target}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter   | Data type         | Description |
| ----------- | ----------------- | ----------- |
| `metric`    | String or list    | A comma-separated list of metrics to include in the response. See [metric options](#metric-options) for list of available options. Default is `_all`. |
| `target`     | String or list    | A comma-separated list of index names, data streams, and index aliases to limit the scope of the response. |

## Metric options

You can limit the information returned by the API using the `metric` path parameter. The following options are available:

- `_all` _(Default)_: Returns all metrics. 
- `blocks`: Includes information about index-level and global blocks.
- `metadata`: Returns cluster metadata, including settings, index mappings, and templates.
- `nodes`: Returns information about the nodes in the cluster.
- `routing_table`: Provides the routing information for all shards.
- `master_node`: Displays the ID of the currently elected cluster manager node.
- `version`: Displays the current cluster state version.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter        | Data type | Description |
| ---------------- | --------- | ----------- |
| `local`          | Boolean   | If `true`, retrieves the state from the local node instead of the cluster manager node. Default is `false`. |
| `cluster_manager_timeout` | Time      | The timeout duration for connecting to the cluster manager node. Default is `30s`. |
| `flat_settings`  | Boolean   | If `true`, returns settings in a flat format. Default is `false`. |
| `wait_for_metadata_version` | Integer | Waits until the metadata version is equal or greater than this value before responding. |
| `wait_for_timeout` | Time   | Specifies how long to wait when using `wait_for_metadata_version`. Default is `30s`. |
| `ignore_unavailable` | Boolean | Whether to ignore missing or closed indexes. Default is `false`. |
| `expand_wildcards` | String | Whether to expand wildcard expressions for index names. Options: `open` `closed`, `hidden`, `none`, `all`. Default is `open`. |
| `allow_no_indices` | Boolean | Whether to fail if a wildcard expression or index alias resolves to no indexes. Default is `true`. |



## Example

Retrieve the full cluster state:

```json
GET /_cluster/state
```
{% include copy-curl.html %}

Retrieve metadata and routing table for specific index:

```json
GET /_cluster/state/metadata,routing_table/my-index
```
{% include copy-curl.html %}

Retrieve only the currently elected cluster manager node:

```json
GET /_cluster/state/master_node
```
{% include copy-curl.html %}

## Response fields

The following table lists all response fields.

| Field                  | Data type | Description                                                                       |
| ---------------------- | --------- | --------------------------------------------------------------------------------- |
| `cluster_name`         | String    | The name of the cluster.                                                          |
| `cluster_uuid`         | String    | The unique identifier for the cluster.                                                |
| `version`              | Integer   | The current version of the cluster state.                                             |
| `state_uuid`           | String    | The unique identifier for this version of the state.                                  |
| `master_node`          | String    | Node ID of the cluster manager (master) node.                                     |
| `cluster_manager_node` | String    | The node ID of the elected cluster manager node. |
| `blocks`               | Object    | Index-level block settings.                                                       |
| `metadata`             | Object    | Index mappings, settings, and aliases.                                            |
| `nodes`                | Object    | Details of all nodes in the cluster.                                              |
| `routing_table`        | Object    | Shard-to-node allocation per index.                                               |
| `routing_nodes`        | Object    | Lists of shards assigned to each node.                                            |
| `indices`              | Object    | Index-specific state metadata.                                                    |
