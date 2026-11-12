---
layout: default
title: Workload group throttling
nav_order: 35
parent: Workload management
---

# Workload group throttling
**Introduced 3.10**
{: .label .label-purple }

Workload group [resource limits]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/#parameters) take effect only after CPU or memory usage exceeds a threshold. Throttling limits the number of search requests that a workload group can run concurrently, regardless of the CPU or memory that each request uses. This prevents a single user or application from using all search capacity by sending many concurrent requests.

The workload group's `resiliency_mode` determines what happens when a request exceeds a throttling limit:

- `enforced` or `soft`: OpenSearch rejects the request with an HTTP `429 Too Many Requests` status code. For resource limits, `soft` mode rejects requests only when the node is in duress. For throttling limits, `soft` mode rejects every request that exceeds a limit.
- `monitor`: OpenSearch runs the request and records it in the `total_would_throttle` statistic.

Clients should retry `429` responses using exponential backoff.

## Configuring throttling

To configure throttling, add a `throttling` object when you [create or update a workload group]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/). The workload group must also define `resiliency_mode` and `resource_limits`.

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

### Throttling parameters

A _throttling bucket_ is a group of requests that share a limit. By default, all requests in the workload group belong to one bucket. If you set the `by` parameter, OpenSearch groups requests into buckets by user or role.

The `throttling` object supports the following parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `node_limit` | Integer | The maximum number of concurrent search requests for each throttling bucket on each coordinating node. Required if `shared_limit` is not specified. Must be `0` or greater. The sum of `node_limit` and `shared_limit` must be at least `1`. |
| `shared_limit` | Integer | The maximum number of concurrent search requests for each throttling bucket across the cluster, in addition to `node_limit`. Required if `node_limit` is not specified. Must be `0` or greater. The sum of `node_limit` and `shared_limit` must be at least `1`. For more information, see [Choosing limits](#choosing-limits). |
| `by` | String | The attribute by which to group requests into throttling buckets. Valid values are `username` and `role` (case sensitive). If you omit `by`, the whole workload group uses one bucket. For more information, see [Throttling by user or role](#throttling-by-user-or-role). |

## Throttling by user or role

To apply limits to each user or role separately, set `by` to `username` or `role`. The full `node_limit` and `shared_limit` apply to each user or role, and the workload group as a whole has no combined limit. For example, 10 users can run up to 10 times the per-user limit.

The following rules apply when throttling by user or role:

- The Security plugin provides the username and roles. If the Security plugin is not installed, OpenSearch rejects create and update requests that set `by`.
- When `by` is set to `role`, OpenSearch uses the Security plugin roles mapped to the user. Backend roles do not determine the bucket.
- If a user has multiple roles, OpenSearch counts each request toward only one role: the first role name in case-sensitive alphabetical order. For example, requests from a user mapped to the `analyst` and `all_access` roles count toward the `all_access` bucket, so the `analyst` limit does not apply to this user.
- OpenSearch does not throttle requests that have no username or role, such as requests authenticated using the admin certificate or internal requests without a user context.

## Choosing limits

Each limit counts the number of concurrent requests. A request counts toward a limit from the time OpenSearch accepts it until it completes, fails, or is canceled.

Each coordinating node enforces `node_limit` independently, so the cluster-wide total depends on the number of nodes that receive search requests. For example, if clients send requests to three nodes and `node_limit` is `10`, the workload group can run up to 30 concurrent requests across the cluster.

OpenSearch enforces `shared_limit` across the cluster, so the total does not depend on the number of nodes. Requests that count toward `shared_limit` take longer to start because the coordinating node must first verify the cluster-wide count. These requests might also fail briefly when nodes join or leave the cluster.

When you set both limits, each coordinating node first accepts requests up to its `node_limit`. Only requests that exceed `node_limit` count toward `shared_limit`. For example, if clients send requests to three nodes, `node_limit` is `5`, and `shared_limit` is `20`, the workload group can run up to 35 (5 × 3 + 20) concurrent requests for each bucket.

Use `node_limit` alone unless you need a strict cluster-wide limit. If you use `shared_limit`, also set a `node_limit` that accommodates the typical load on each node so that only requests exceeding that load incur the additional latency.
{: .tip}

## Updating throttling

To update throttling, send the `throttling` object in a [workload group update request]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/#updating-a-workload-group). OpenSearch merges it with the existing configuration, so only the parameters that you specify change. To remove a parameter, set it to `null`. To disable throttling, set `throttling` to `null`. For example, the following request changes only `node_limit`:

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

The [Workload Management Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#workload-management-stats-api) reports `total_throttled`, the number of requests rejected because of a throttling limit, and `total_would_throttle`, the number of requests that a `monitor` mode workload group would have rejected. Each node reports only the requests it coordinated, so add the values from all nodes to calculate the cluster total.
