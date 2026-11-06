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

## Prerequisites

Throttling applies only when all of the following conditions are met:

- The [Workload Management plugin]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#installing-workload-management) is installed.
- The [`wlm.workload_group.mode`]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#operating-modes) cluster setting is `enabled`. In the default `monitor_only` mode and in `disabled` mode, OpenSearch does not throttle requests or record throttling statistics.
- The request is assigned to a [workload group]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#using-the-workload-group-id) that configures throttling. OpenSearch does not throttle requests in `DEFAULT_WORKLOAD_GROUP`.
- If you throttle by user or role, the Security plugin is installed. For more information, see [Throttling by user or role](#throttling-by-user-or-role).

To enable workload management, send the following request:

```json
PUT _cluster/settings
{
  "persistent": {
    "wlm.workload_group.mode": "enabled"
  }
}
```
{% include copy-curl.html %}

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

To test limits before enforcing them, start in `monitor` mode. For more information, see [Resiliency modes](#resiliency-modes).
{: .tip}

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

OpenSearch selects an owner node for each bucket automatically from the nodes that can hold data, such as nodes with the `data`, `warm`, or `search` role. Dedicated cluster manager nodes and coordinating-only nodes can coordinate requests but cannot be owner nodes.

When you set both `node_limit` and `shared_limit`, each coordinating node first admits requests within its own `node_limit`. Only requests that exceed `node_limit` use the shared limit. The following table shows how the limits combine.

| Configuration | Behavior |
| :--- | :--- |
| `"node_limit": 5` | Each coordinating node runs up to 5 concurrent requests for the bucket. |
| `"shared_limit": 20` | The cluster runs up to 20 concurrent requests for the bucket. Every request requires a slot from the owner node. |
| `"node_limit": 5, "shared_limit": 20` | Each coordinating node runs up to 5 concurrent requests for the bucket without contacting the owner node. Additional requests use a cluster-wide pool of 20. With 3 coordinating nodes, up to 35 (5 × 3 + 20) requests can run concurrently. |

If you use `shared_limit`, we recommend also setting a `node_limit` that covers the typical load on each node. Requests within `node_limit` don't require a network round trip, so only requests during traffic spikes contact the owner node. Because `node_limit` adds to `shared_limit`, size the two limits so that `node_limit` multiplied by the number of coordinating nodes, plus `shared_limit`, equals the cluster-wide total that you want.
{: .tip}

#### Shared limit availability

The shared limit depends on the owner node being reachable:

- If a coordinating node does not receive a response from the owner node within 200 ms, or the owner node is disconnected, OpenSearch rejects the request instead of exceeding the limit. This does not affect requests within `node_limit`. In `monitor` mode, OpenSearch runs the request and counts it in `total_would_throttle`. The 200 ms timeout is not configurable.
- If the cluster has no node that can be an owner node (for example, because all data nodes are unavailable or none run version 3.10 or later), OpenSearch ignores `shared_limit`. In this case, only `node_limit` applies, and OpenSearch does not throttle a workload group that defines only `shared_limit`.
- When a node that can hold data joins or leaves the cluster, some buckets move to a new owner node. While the nodes apply the new cluster state, OpenSearch can briefly reject requests that need the shared limit for a moved bucket with the `cluster-wide throttle unavailable` message. Until requests that started under the previous owner node complete, the cluster can briefly run up to about twice the `shared_limit` for a moved bucket.

## Resiliency modes

The workload group's `resiliency_mode` determines what happens when a request exceeds a throttling limit. The following table describes the behavior in each mode.

| `resiliency_mode` | Behavior when a request exceeds the limit |
| :--- | :--- |
| `enforced` | OpenSearch rejects the request with a `429` status code and increments `total_throttled`. |
| `soft` | OpenSearch rejects the request with a `429` status code and increments `total_throttled`. |
| `monitor` | OpenSearch runs the request and increments `total_would_throttle`. |

For resource limits, `soft` mode rejects requests only when the node is in duress. For throttling, `soft` mode behaves the same as `enforced` mode and rejects any request that exceeds a limit, even if the node is not in duress.
{: .important}

To test limits before enforcing them, create the workload group in `monitor` mode, track `total_would_throttle` in the [Workload Management Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#workload-management-stats-api) response, and then change `resiliency_mode` to `enforced`. This test requires `wlm.workload_group.mode` to be `enabled`. Because `resiliency_mode` also controls resource limits, changing it to `enforced` also starts rejecting and canceling requests that exceed the workload group's `resource_limits`. Before you change the mode, set `resource_limits` to values that you are ready to enforce.

## Throttled requests

When OpenSearch throttles a request, it returns a `429` status code:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "rejected_execution_exception",
        "reason": "Request throttled: workload group [analytics] reached its per-node limit of 10 concurrent requests."
      }
    ],
    "type": "rejected_execution_exception",
    "reason": "Request throttled: workload group [analytics] reached its per-node limit of 10 concurrent requests."
  },
  "status": 429
}
```

The error message names the workload group and the limit that was reached. If the workload group sets `by`, the message also contains the username or role, for example, `workload group [analytics] for username [alice]`. The following table lists the possible messages.

| Message | Cause |
| :--- | :--- |
| `Request throttled: workload group [<name>] reached its per-node limit of <node_limit> concurrent requests.` | The coordinating node reached `node_limit`, and `shared_limit` is not set, is `0`, or is ignored because the cluster has no node that can be an owner node. |
| `Request throttled: workload group [<name>] reached its shared limit of <shared_limit> concurrent requests.` | `node_limit` is not set or is `0`, and the cluster reached `shared_limit`. |
| `Request throttled: workload group [<name>] reached its per-node limit of <node_limit> and shared limit of <shared_limit> concurrent requests.` | The coordinating node reached `node_limit`, and the cluster reached `shared_limit`. |
| `Request throttled: workload group [<name>] could not check its shared limit of <shared_limit> concurrent requests (cluster-wide throttle unavailable).` | `node_limit` is not set or is `0`, and the coordinating node could not receive an answer from the owner node. For example, the owner node did not respond within 200 ms, is disconnected, or the bucket was moving to a new owner node. See [Shared limit availability](#shared-limit-availability). |
| `Request throttled: workload group [<name>] reached its per-node limit of <node_limit> concurrent requests and could not check its shared limit of <shared_limit> concurrent requests (cluster-wide throttle unavailable).` | The coordinating node reached `node_limit` and could not receive an answer from the owner node. |

OpenSearch checks throttling limits before it resolves indexes and runs the search. If a workload group is at its limit, a request receives a `429` status code even if it would otherwise fail later, for example, because the target index does not exist. Requests that fail parsing, validation, or authorization still return their usual error. Clients should retry `429` responses with a backoff.
{: .note}

Throttling rejections are different from resource limit rejections, which can also return a `429` status code. A resource limit rejection message contains `WorkloadGroup <id> is already contended`, and OpenSearch counts these rejections in `total_rejections` instead of `total_throttled`.

## Requests that count toward the limit

Throttling applies to search requests on the coordinating node. Shard-level requests are not counted separately. The following requests use a slot:

- Search requests, including `_search`, `_count`, search template, and point in time (PIT) searches.
- Each scroll request (`_search/scroll`). A scroll uses a slot only while a request for the next page is running, not between pages.
- Each search in a multi-search (`_msearch` or `_msearch/template`) request. See [Multi-search requests](#multi-search-requests).
- Internal searches and scroll requests issued by the reindex, update by query, and delete by query operations. If OpenSearch throttles these requests, the operations retry them with a backoff and fail after they exhaust their retries.

The following requests do not use a slot and are never throttled:

- Requests to create a PIT. Searches that use the PIT count toward the limit.
- Explain, field capabilities, and validate query requests.

Some queries run additional searches while OpenSearch rewrites the query. For example, a `terms` query that uses a [terms lookup by query]({{site.url}}{{site.baseurl}}/query-dsl/term/terms/#terms-lookup-by-query) runs a search to collect the terms. These nested searches share the slot of the original request and do not use additional slots.

### Multi-search requests

Each search in a multi-search request uses its own slot while it runs. If more searches run concurrently than the limit allows, OpenSearch throttles the excess searches. The multi-search response still returns a `200` status code, and each throttled search appears in the `responses` array with a `429` status:

```json
{
  "took": 6331,
  "responses": [
    {
      "took": 6331,
      "timed_out": false,
      ...
      "status": 200
    },
    {
      "error": {
        "root_cause": [
          {
            "type": "rejected_execution_exception",
            "reason": "Request throttled: workload group [analytics] reached its per-node limit of 1 concurrent requests."
          }
        ],
        "type": "rejected_execution_exception",
        "reason": "Request throttled: workload group [analytics] reached its per-node limit of 1 concurrent requests."
      },
      "status": 429
    }
  ]
}
```

By default, a multi-search request can run many searches at the same time, depending on the number of data nodes and the search thread pool size. To prevent a multi-search request from throttling its own searches, set the `max_concurrent_searches` [query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/multi-search/#query-parameters-and-metadata-options) to no more than the number of slots available to its throttling bucket on the coordinating node. This is `node_limit`, plus `shared_limit` if it is set, minus other requests that run in the same bucket at the same time.

## Updating throttling

To update throttling, send the `throttling` object in a [workload group update request]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/#updating-a-workload-group). OpenSearch merges the `throttling` object in the request with the existing configuration. The following table describes the merge behavior.

| Request | Result |
| :--- | :--- |
| The request does not contain `throttling`. | The throttling configuration does not change. |
| `throttling` contains some parameters. | Only the specified parameters change. Other parameters keep their current values. |
| A parameter is set to `null`. | The parameter is removed. If you remove `by`, the whole workload group shares one bucket again, and the limits do not change. |
| `"throttling": null` or `"throttling": {}` | Throttling is turned off for the workload group. |

OpenSearch validates the merged configuration, so the same update can be valid for one workload group and invalid for another. For example, removing the only limit from a workload group that does not set `by` turns off throttling. If the workload group sets `by`, or if the remaining limit is `0`, the same request fails. To turn off throttling in these cases, set `throttling` to `null`.

To change only the per-node limit, send the following request:

```json
PUT _wlm/workload_group/analytics
{
  "throttling": {
    "node_limit": 20
  }
}
```
{% include copy-curl.html %}

To give each user its own bucket while keeping the existing limits, send the following request:

```json
PUT _wlm/workload_group/analytics
{
  "throttling": {
    "by": "username"
  }
}
```
{% include copy-curl.html %}

To remove the shared limit, set it to `null`:

```json
PUT _wlm/workload_group/analytics
{
  "throttling": {
    "shared_limit": null
  }
}
```
{% include copy-curl.html %}

To turn off throttling, set `throttling` to `null`:

```json
PUT _wlm/workload_group/analytics
{
  "throttling": null
}
```
{% include copy-curl.html %}

On an update request, `"throttling": {}` turns off throttling. To keep the current throttling configuration, omit `throttling` from the request.
{: .warning}

Limit changes apply to new requests. Lowering a limit does not cancel running requests. Instead, OpenSearch treats new requests as over the limit until the number of running requests falls below the new limit. Requests over a lowered `node_limit` still use `shared_limit` if it is set. When you change `by`, OpenSearch starts counting requests in new buckets. Until existing requests complete, the workload group can briefly run more requests than the new limits allow.

## Monitoring throttling

The [Workload Management Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/#workload-management-stats-api) returns the following throttling statistics for each workload group on each node:

- `total_throttled`: The number of requests that OpenSearch rejected because of a throttling limit.
- `total_would_throttle`: The number of requests in a `monitor` mode workload group that OpenSearch would have throttled but ran anyway.

An over-limit request increments only one of these statistics. OpenSearch does not count throttled requests in `total_rejections` or `total_completions`.

When interpreting these statistics, consider the following:

- OpenSearch records each statistic on the coordinating node that received the request, not on the owner node. To calculate the cluster-wide total, add the values from all nodes.
- The statistics cover the workload group as a whole and do not show which user or role OpenSearch throttled. The `429` error message contains this information.
- Both statistics also count requests whose shared limit OpenSearch could not check because the owner node did not respond. To distinguish them from requests that exceeded a limit, check the error message.
- OpenSearch stores the statistics in memory and resets them when the node restarts or when you delete the workload group.
- The error message identifies the workload group by name, but the Workload Management Stats API identifies it by ID. To find the ID of a workload group, use the [Workload Group API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/workload-groups/#retrieving-a-workload-group).

Throttled requests do not run, so they do not appear in the [search slow log]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/#search-request-slow-logs) or in data collected by the [Query Insights plugin]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/query-insights/index/). The [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) counts throttled search requests, including throttled searches in a multi-search request, under `status_counter.search_response_status.user_error`. Throttled scroll requests are not counted there.

OpenSearch does not log throttled requests. In `monitor` mode, OpenSearch writes a `DEBUG` log message for each request that exceeds a limit. To view these messages, set `logger.org.opensearch.wlm.WorkloadGroupService` to `debug`. Because OpenSearch writes one message for each request, enable this logger only temporarily.

## Upgrading to OpenSearch 3.10

During a rolling upgrade from a version earlier than 3.10, throttling is only partially available:

- Create and update requests that contain `throttling` fail if they reach a node running an earlier version (`throttling is not a valid object in WorkloadGroup`) or if the elected cluster manager node runs an earlier version (`cannot send workload group throttling to a node before version 3.10.0`).
- Nodes running earlier versions do not store the throttling configuration. Configure throttling after you upgrade all nodes.
- Nodes running earlier versions do not throttle the requests they coordinate, and these requests do not count toward `shared_limit`.
- Only nodes that can hold data and run version 3.10 or later can be owner nodes. Until at least one such node is in the cluster, OpenSearch ignores `shared_limit`.
- Nodes running earlier versions report `0` for `total_throttled` and `total_would_throttle`. If a node running an earlier version receives the stats request, the response does not contain these fields for any node.

Each time a data node leaves or rejoins the cluster during the upgrade, some buckets move to a different owner node. This includes a data node that rejoins after you upgrade it to 3.10, because it then becomes eligible to own buckets. As described in [Shared limit availability](#shared-limit-availability), while buckets move, OpenSearch can briefly reject requests that use the shared limit, or a bucket can briefly exceed `shared_limit`.

## Permissions

Throttling uses the existing workload management permissions. The following table lists the permissions that throttling tasks require.

| Task | Permission |
| :--- | :--- |
| Configure throttling when creating a workload group | `cluster:admin/opensearch/wlm/workload_group/_create` |
| Configure throttling when updating a workload group | `cluster:admin/opensearch/wlm/workload_group/_update` |
| View the throttling configuration or look up a workload group ID | `cluster:admin/opensearch/wlm/workload_group/_get` |
| View throttling statistics using `_wlm/stats` or `_list/wlm_stats` | `cluster:monitor/wlm/stats` |
