---
layout: default
title: Cluster reroute
nav_order: 45
parent: Cluster APIs
redirect_from:
  - /api-reference/cluster-reroute/
  - /opensearch/rest-api/cluster-reroute/
---

# Cluster reroute
**Introduced 1.0**
{: .label .label-purple }

The cluster reroute operation lets you manually initiate a rerouting within the cluster.
> Note: The cluster will perform a rebalancing within the cluster based on it's `cluster.routing.rebalance` settings after completion.

## Endpoints

```json
POST _cluster/reroute
```

## Path parameters

All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
| `dry_run` | Boolean | When `true`, will simulate the state of the cluster after applying the command. Default is `false`. |
| `explain` | Boolean | When `true`, will explain why the action can or cannot be performed. Default: `false`|
| `metric` | Array of strings | Allows you to limit the output provided to the given metric type, such as `routing_table`. |
| `retry_failed` | Boolean | This let's you initiate a manual retry to fix a a failed allocation due to too many allocation failures. |

## Example requests

The following example requests show how to use the cluster reroute API.

### Dry-run reroute command

A manual reroute command with dry-run enabled to see what the impact would be.

```json
POST _cluster/reroute?dry_run=true&metric=routing_table
```

{% include copy-curl.html %}

### Initiate a retry of failed shard

This command will do a one-time retry of a failed shard.

```json
POST _cluster/reroute?retry_failed=true
```

{% include copy-curl.html %}

A common follow-up will be to check the allocation command to see the status.

```json
GET _cluster/allocation/explain
```