---
layout: default
title: Workload group throttling
nav_order: 35
parent: Workload management
---

# Workload group throttling
**Introduced 3.10**
{: .label .label-purple }

Workload group [resource limits]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/#parameters) react to CPU and memory usage after it occurs. Throttling limits how many search requests a workload group can run at the same time, regardless of how much CPU or memory each request uses. When a workload group in `enforced` or `soft` mode reaches its limit, OpenSearch throttles additional search requests by rejecting them with an HTTP `429 Too Many Requests` status code until running requests complete. In `monitor` mode, OpenSearch runs these requests and counts them instead.

Throttling provides the following benefits:

- A single tenant cannot use all search capacity on a node or in the cluster by sending many concurrent requests.
- Concurrency limits are predictable because they don't depend on resource usage measurements.
- You can apply a limit to the whole workload group or give each user or role its own limit within the group.

## Configuring throttling

To configure throttling, add a `throttling` object when you [create or update a workload group]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/). The workload group must still define `resiliency_mode` and `resource_limits`.

The following request creates a workload group that allows each coordinating node to run up to 10 concurrent search requests for the group:

```json
PUT _wlm/workload_group
{
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  },
  "throttling": {
    "node_limit": 10
  }
}
```
{% include copy-curl.html %}

The response contains the throttling configuration:

```json
{
  "_id": "preXpc67RbKKeCyka72_Gw",
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  },
  "settings": {},
  "throttling": {
    "node_limit": 10
  },
  "updated_at": 1726270184642
}
```

If throttling is not configured for a workload group, the response does not contain the `throttling` object.

### Throttling parameters

A _throttling bucket_ is a group of requests that share a limit. By default, every request in the workload group belongs to the same bucket. When `by` is set, each user or role has its own bucket.

The `throttling` object supports the following parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `node_limit` | Integer | The maximum number of concurrent search requests for each throttling bucket on each coordinating node. Must be `0` or greater. See [Per-node limit](#per-node-limit). |
| `shared_limit` | Integer | The size of a cluster-wide pool of concurrent search requests for each throttling bucket. When `node_limit` is also set, only requests that exceed `node_limit` on their coordinating node use this pool, so the cluster can run more than `shared_limit` requests in total. Requests that use this pool incur additional latency. Must be `0` or greater. See [Shared limit](#shared-limit). |
| `by` | String | How to divide the limits into throttling buckets. Valid values are `username` and `role`. If you omit `by`, the whole workload group shares one bucket. The values are case sensitive. See [Throttling by user or role](#throttling-by-user-or-role). |

You must specify at least one of `node_limit` and `shared_limit`, and their sum must be at least `1`. For example, `"node_limit": 0` is not valid on its own but is valid together with `"shared_limit": 5`. To turn off throttling, set `throttling` to `null` instead of setting the limits to `0`. For more information, see [Updating throttling](#updating-throttling).

## Throttling by user or role

To give each user or role its own limit, set `by` to `username` or `role`. Each user or role receives the full `node_limit` and `shared_limit`. OpenSearch does not divide the limits among users or roles, and the workload group as a whole has no combined limit. For example, 10 users can together run up to 10 times the per-user limit.

The following request gives each user in the `analytics` workload group up to 5 concurrent requests on each coordinating node, plus up to 20 more requests from a cluster-wide pool:

```json
PUT _wlm/workload_group
{
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  },
  "throttling": {
    "by": "username",
    "node_limit": 5,
    "shared_limit": 20
  }
}
```
{% include copy-curl.html %}

Throttling by user or role works as follows:

- The Security plugin provides the username and roles. If the Security plugin is not installed, OpenSearch rejects create and update requests that set `by`.
- With `"by": "role"`, OpenSearch uses the user's mapped Security plugin roles, not backend roles.
- If a user has multiple roles, OpenSearch counts each request against only one role, the role whose name sorts first in case-sensitive lexicographic order. For example, OpenSearch counts requests from a user mapped to the `analyst` and `all_access` roles in the `all_access` bucket. These requests do not count toward the `analyst` bucket, so the `analyst` limit does not apply to this user.
- A workload group that sets `by` does not throttle requests that have no username or role, for example, requests authenticated with the admin certificate or internal requests without a user context.

## Choosing limits

Each limit counts concurrent requests, not requests per second. A request uses one slot from the time OpenSearch admits it until it completes, fails, or is canceled.

### Per-node limit

`node_limit` applies separately on each node that coordinates search requests. A node does not communicate with other nodes to enforce `node_limit`, so this limit adds no network overhead.

The cluster-wide total therefore depends on how many nodes receive search requests. For example, if clients send requests to 3 nodes and `node_limit` is `10`, the workload group can run up to 30 concurrent requests across the cluster. Base `node_limit` on the capacity of a single node.

### Shared limit

`shared_limit` adds latency to every request that uses it, and requests that use it can be rejected when the owner node does not respond. Use `shared_limit` only when you need a strict cluster-wide limit. Otherwise, use `node_limit`.
{: .warning}

`shared_limit` is counted in one place for the whole cluster. One node, called the bucket's _owner node_, holds the count for each throttling bucket. Before a request can use the shared limit, its coordinating node requests a slot from the owner node. This adds one network round trip to the request before the search starts. If the coordinating node is the owner node, the request does not need a network round trip.

OpenSearch selects an owner node for each bucket automatically from the nodes that can hold data. Dedicated cluster manager nodes and coordinating-only nodes can coordinate requests but cannot be owner nodes.

When you set both `node_limit` and `shared_limit`, each coordinating node first admits requests within its own `node_limit`. Only requests that exceed `node_limit` use the shared limit. The following table shows how the limits combine.

| Configuration | Behavior |
| :--- | :--- |
| `"node_limit": 5` | Each coordinating node runs up to 5 concurrent requests for the bucket. |
| `"shared_limit": 20` | The cluster runs up to 20 concurrent requests for the bucket. Every request requires a slot from the owner node. |
| `"node_limit": 5, "shared_limit": 20` | Each coordinating node runs up to 5 concurrent requests for the bucket without contacting the owner node. Additional requests use a cluster-wide pool of 20. With 3 coordinating nodes, up to 35 (5 × 3 + 20) requests can run concurrently. |

If you use `shared_limit`, we recommend also setting a `node_limit` that covers the typical load on each node. Requests within `node_limit` don't require a network round trip, so only requests during traffic spikes contact the owner node. Because `node_limit` adds to `shared_limit`, size the two limits so that `node_limit` multiplied by the number of coordinating nodes, plus `shared_limit`, equals the cluster-wide total that you want.
{: .tip}

#### Shared limit availability

When nodes join or leave the cluster, some buckets move to a new owner node. Requests that use the shared limit can see a momentary disruption while the buckets remap.

## Resiliency modes

The workload group's `resiliency_mode` determines what happens when a request exceeds a throttling limit. The following table describes the behavior in each mode.

| `resiliency_mode` | Behavior when a request exceeds the limit |
| :--- | :--- |
| `enforced` | OpenSearch rejects the request with a `429` status code and increments `total_throttled`. |
| `soft` | OpenSearch rejects the request with a `429` status code and increments `total_throttled`. |
| `monitor` | OpenSearch runs the request and increments `total_would_throttle`. |

For resource limits, `soft` mode rejects requests only when the node is in duress. For throttling, `soft` mode behaves the same as `enforced` mode and rejects any request that exceeds a limit, even if the node is not in duress.
{: .important}

## Throttled requests

When a request exceeds a limit, OpenSearch rejects it with a `429` status code. The error message names the workload group and the limit that was reached:

```json
{
  "error": {
    "type": "rejected_execution_exception",
    "reason": "Request throttled: workload group [analytics] reached its per-node limit of 10 concurrent requests."
  },
  "status": 429
}
```

Clients should retry `429` responses with a backoff.

## Updating throttling

To update throttling, send the `throttling` object in a [workload group update request]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/#updating-a-workload-group). OpenSearch merges it with the existing configuration, so only the parameters you specify change. To remove a parameter, set it to `null`. To turn off throttling, set `throttling` to `null`. For example, the following request changes only the per-node limit:

```json
PUT _wlm/workload_group/analytics
{
  "throttling": {
    "node_limit": 20
  }
}
```
{% include copy-curl.html %}

Limit changes apply to new requests and do not cancel running requests.

## Monitoring throttling

The [Workload Management Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#workload-management-stats-api) reports `total_throttled`, the number of requests rejected because of a throttling limit, and `total_would_throttle`, the number of requests a `monitor` mode workload group would have throttled. OpenSearch records both on the coordinating node, so add the values from all nodes to get the cluster total.
