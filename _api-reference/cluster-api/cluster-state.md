---
layout: default
title: Cluster state
nav_order: 55
parent: Cluster APIs
---

# Cluster State API

The `/_cluster/state` API retrieves the current state of the cluster, including metadata, routing tables, nodes, and other components. This API is primarily used for monitoring, debugging, and internal purposes. It provides a snapshot of various parts of the cluster's state as maintained by the cluster manager node.

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
| `metric`    | String or list    | A comma-separated list of metrics to include in the response. See [Metric options](#metric-options) for a list of available options. Default is `_all`. |
| `target`     | String or list    | A comma-separated list of index names, data streams, and index aliases used to limit the scope of the response. |

## Metric options

You can limit the information returned by the API using the `metric` path parameter. The following options are available:

- `_all` _(Default)_: Returns all metrics. 
- `blocks`: Includes information about index-level and global blocks.
- `metadata`: Returns cluster metadata, including settings, index mappings, and templates.
- `nodes`: Returns information about the nodes in the cluster.
- `routing_table`: Provides the routing information for all shards.
- `cluster_manager_node`: Displays the ID of the currently elected cluster manager node.
- `version`: Displays the current cluster state version.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter        | Data type | Description |
| ---------------- | --------- | ----------- |
| `local`          | Boolean   | If `true`, retrieves the state from the local node instead of the cluster manager node. Default is `false`. |
| `cluster_manager_timeout` | Time      | The timeout duration for connecting to the cluster manager node. Default is `30s`. |
| `flat_settings`  | Boolean   | If `true`, returns settings in a flat format. Default is `false`. |
| `wait_for_metadata_version` | Integer | Waits until the metadata version is equal to or greater than this value before responding. |
| `wait_for_timeout` | Time   | Specifies how long to wait when using `wait_for_metadata_version`. Default is `30s`. |
| `ignore_unavailable` | Boolean | Whether to ignore missing or closed indexes. Default is `false`. |
| `expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. <br> Default is `open`. |
| `allow_no_indices` | Boolean | Whether to fail if a wildcard expression or index alias resolves to no indexes. Default is `true`. |



## Example Requests

Retrieve the full cluster state:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/state
-->
{% capture step1_rest %}
GET /_cluster/state
{% endcapture %}

{% capture step1_python %}

response = client.cluster.state()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Retrieve metadata and the routing table for a specific index:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/state/metadata,routing_table/my-index
-->
{% capture step1_rest %}
GET /_cluster/state/metadata,routing_table/my-index
{% endcapture %}

{% capture step1_python %}


response = client.cluster.state(
  metric = "metadata,routing_table",
  index = "my-index"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Retrieve only the currently elected cluster manager node:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/state/cluster_manager_node
-->
{% capture step1_rest %}
GET /_cluster/state/cluster_manager_node
{% endcapture %}

{% capture step1_python %}


response = client.cluster.state(
  metric = "cluster_manager_node"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Response fields

The following table lists all response fields.

| Field                  | Data type | Description                                                                       |
| ---------------------- | --------- | --------------------------------------------------------------------------------- |
| `cluster_name`         | String    | The name of the cluster.                                                          |
| `cluster_uuid`         | String    | The unique identifier for the cluster.                                                |
| `version`              | Integer   | The current version of the cluster state.                                             |
| `state_uuid`           | String    | The unique identifier for this version of the state.                                  |
| `master_node`          | String    | As with `cluster_manager_node`, this is maintained for backward compatibility.                                    |
| `cluster_manager_node` | String    | The node ID of the elected cluster manager node. |
| `blocks`               | Object    | Index-level block settings.                                                       |
| `metadata`             | Object    | Index mappings, settings, and aliases.                                            |
| `nodes`                | Object    | Details of all nodes in the cluster.                                              |
| `routing_table`        | Object    | Shard-to-node allocation per index.                                               |
| `routing_nodes`        | Object    | Lists of shards assigned to each node.                                            |
| `indices`              | Object    | Index-specific state metadata.                                                    |
