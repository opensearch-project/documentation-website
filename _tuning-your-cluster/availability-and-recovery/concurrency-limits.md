---
layout: default
title: Concurrency limits
nav_order: 65
has_children: false
parent: Availability and recovery
---

# Concurrency limits
**Introduced 3.9**
{: .label .label-purple }

Concurrency limits protect a node from overload by capping the number of requests that a given action can have in flight at the same time. Instead of a fixed threshold, each limit adapts continuously to observed latency: it grows while the node keeps up and shrinks when round-trip times rise or downstream components start rejecting work. When the limit is reached, additional requests are rejected with an HTTP `429 Too Many Requests` response.

You can apply a concurrency limit to any transport action, such as `indices:data/read/search` or `indices:data/write/bulk`, by configuring an alias through the `_cluster/settings` API. No code changes or restarts are required. Concurrency limits ship as a bundled module in every OpenSearch distribution, and every limiter is `disabled` until you configure it.

## How it works

Each configured alias owns one adaptive limiter. When a request for the alias's action arrives, the limiter tries to acquire a token:

- If a token is available, the request proceeds. When it completes, its outcome and latency are fed back to the algorithm. A successful completion is a positive sample. A downstream `rejected_execution_exception`, such as a thread pool rejection, is treated as a drop and causes the algorithm to reduce the limit. Any other failure is ignored by the algorithm.
- If no token is available and the limiter is in `enforced` mode, the request is rejected immediately.
- If no limiter is configured for the action, the request passes through unchanged.

After you configure or reconfigure an alias, the limiter enters a warm-up period (`warmup_duration`, default `5m`). During warm-up the limiter collects samples and calibrates but never rejects requests, even in `enforced` mode.

## Modes

Each alias runs in one of three modes, set by the `mode` setting:

- `disabled` (default): The limiter is inactive. Requests are not tracked or rejected.
- `monitor_only`: The limiter tracks requests and adapts its limit, and counts requests that would have been rejected in the `total_rejected` statistic, but never rejects them. Use this mode to observe how a limit would behave before enforcing it.
- `enforced`: The limiter rejects requests once the limit is reached and the warm-up period has elapsed.

We recommend starting in `monitor_only` mode, watching the `current_limit` and `total_rejected` values in the [stats API](#concurrency-limits-stats-api), and switching to `enforced` once the limit settles at a reasonable value.
{: .tip}

## Rejected requests

A rejected request fails with HTTP status `429` and a `rejected_execution_exception`. The response resembles the following:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "rejected_execution_exception",
        "reason": "request rejected: concurrency limit reached for action [indices:data/read/search]"
      }
    ],
    "type": "rejected_execution_exception",
    "reason": "request rejected: concurrency limit reached for action [indices:data/read/search]"
  },
  "status": 429
}
```

OpenSearch does not add a `Retry-After` header to these responses. Clients should retry with backoff.

## Algorithms

The `algorithm` setting selects how the limit adapts. All three algorithms are provided by the [Netflix concurrency-limits](https://github.com/Netflix/concurrency-limits) library. The limit always stays between `limit.initial` and `limit.max`.

### Vegas (default)

The `vegas` algorithm is based on TCP Vegas congestion control. It records the lowest round-trip time it has seen as a no-load baseline and compares each new sample against it. When latency stays close to the baseline, the limit grows; when latency rises, the limit shrinks. This is a good general-purpose choice and is the default.

The following settings tune the Vegas algorithm:

- `vegas.updrift_factor` makes the algorithm more willing to raise the limit for bursty workloads. The default value of `1` matches the standard Vegas behavior.
- `vegas.increase_barrier` and `vegas.decrease_barrier` require several consecutive samples in the same direction before the limit moves, which reduces oscillation.
- `vegas.baseline_reset_load_threshold` prevents latency measured under heavy load from replacing the no-load baseline. A probe only resets the baseline when the in-flight count is below this fraction of the current limit.

### Gradient2

The `gradient2` algorithm compares a short-term round-trip time average against a long-term average. When the short-term latency rises above the long-term latency by more than `gradient2.rtt_tolerance`, the limit is reduced. It reacts more smoothly than Vegas to gradual latency drift and suits workloads whose baseline latency changes over time.

### AIMD

The `aimd` algorithm uses additive increase and multiplicative decrease. The limit grows by one on each successful sample and is multiplied by `aimd.backoff_ratio` whenever a request is dropped. It is simple and predictable but reacts only to drops, not to rising latency, so it is best suited to actions whose downstream components reject work explicitly when they are saturated.

## Burst capacity

The `burst.capacity` setting adds a fixed amount of headroom on top of the adaptive limit so that short spikes are absorbed rather than rejected. The burst window starts open, which means the effective limit is the adaptive limit plus `burst.capacity`. The window closes after `burst.close_after` consecutive samples in which the in-flight count reached the adaptive limit, and reopens after `burst.open_after` consecutive samples in which it stayed below the adaptive limit. Setting `burst.capacity` to `0` (the default) disables burst handling.

## Partitions

You can divide an alias's limit into named sub-pools so that one class of traffic cannot starve another. List the pool names in `partitions` and give each a share of the total limit using `partition.<name>.percent`. The shares must sum to at most `1.0`; any remaining capacity, together with requests that do not match a named partition, is served from a shared unknown pool.

Partition shares are enforced only while the alias is at its overall limit. Below the overall limit, a partition can use spare capacity beyond its share. Once the overall limit is reached, each partition is held to its own share, so a partition with a `0.0` share rejects every request routed to it under load.

When `partitions` is set, you must also choose a `partition.resolver` that maps each request to a partition:

- `byHeader`: Reads the `X-Request-Tier` request header and routes the request to the partition whose name exactly matches the header value. The match is case sensitive. Requests without the header, or with an unrecognized value, go to the unknown pool. The header name is fixed.
- `fixed`: Routes every request to the single partition named in `partition.resolver.fixed.partition`.
- `bySearchType`: For search requests only, routes requests that contain aggregations to the partition named in `partition.resolver.bySearchType.aggregation` and all other searches to the partition named in `partition.resolver.bySearchType.filter`. Non-search requests go to the unknown pool.

Optionally, `partition.<name>.delay_ms` slows down callers that exceed a partition's share: the node pauses for the given number of milliseconds before returning the rejection. Only a bounded number of requests are delayed at once; beyond that, requests are rejected immediately.

### Example: Reserve capacity for premium traffic

The following request limits search requests and reserves 70% of the limit for requests that carry `X-Request-Tier: premium`, leaving 30% for requests that carry `X-Request-Tier: standard`:

```json
PUT /_cluster/settings
{
  "persistent": {
    "concurrency_limit.action.search.action_name": "indices:data/read/search",
    "concurrency_limit.action.search.mode": "enforced",
    "concurrency_limit.action.search.partitions": ["premium", "standard"],
    "concurrency_limit.action.search.partition.resolver": "byHeader",
    "concurrency_limit.action.search.partition.premium.percent": 0.7,
    "concurrency_limit.action.search.partition.standard.percent": 0.3
  }
}
```
{% include copy-curl.html %}

Clients then set the header on each search request:

```bash
curl -X GET "http://localhost:9200/my-index/_search" -H "X-Request-Tier: premium" -H "Content-Type: application/json" -d '{ "query": { "match_all": {} } }'
```
{% include copy.html %}

## Concurrency limit settings

All concurrency limit settings are dynamic and are namespaced by an alias that you choose, using the pattern `concurrency_limit.action.<alias>.<setting>`. The alias is only a label; the `action_name` setting determines which action is limited. You can configure any number of aliases.

To configure a limiter, send a PUT request to `/_cluster/settings`:

```json
PUT /_cluster/settings
{
  "persistent": {
    "concurrency_limit.action.search.action_name": "indices:data/read/search",
    "concurrency_limit.action.search.mode": "enforced",
    "concurrency_limit.action.search.algorithm": "vegas",
    "concurrency_limit.action.search.limit.initial": 20,
    "concurrency_limit.action.search.limit.max": 200,
    "concurrency_limit.action.search.vegas.baseline_reset_load_threshold": 0.5,
    "concurrency_limit.action.search.burst.capacity": 10,
    "concurrency_limit.action.search.burst.close_after": 5,
    "concurrency_limit.action.search.burst.open_after": 5
  }
}
```
{% include copy-curl.html %}

The following table lists the settings available for each alias. Replace `<alias>` with your alias name.

Setting | Default | Description
:--- | :--- | :---
`concurrency_limit.action.<alias>.action_name` | None | The name of the transport action to limit, for example, `indices:data/read/search` or `indices:data/write/bulk`. Required. Clearing this setting removes the limiter.
`concurrency_limit.action.<alias>.mode` | `disabled` | The [mode](#modes) of the limiter. Valid values are `disabled`, `monitor_only`, and `enforced`.
`concurrency_limit.action.<alias>.algorithm` | `vegas` | The [algorithm](#algorithms) used to adapt the limit. Valid values are `vegas`, `gradient2`, and `aimd`.
`concurrency_limit.action.<alias>.limit.initial` | `20` | The starting concurrency limit. Must be at least `1` and at most `limit.max`.
`concurrency_limit.action.<alias>.limit.max` | `200` | The maximum concurrency limit that the algorithm can reach. Must be at least `1` and at least `limit.initial`.
`concurrency_limit.action.<alias>.warmup_duration` | `5m` | The period after configuration during which the limiter calibrates without rejecting requests. Must be at least `0`.
`concurrency_limit.action.<alias>.vegas.updrift_factor` | `1` | Scales how aggressively the Vegas algorithm raises the limit. Must be at least `1`. A value of `1` matches standard Vegas behavior.
`concurrency_limit.action.<alias>.vegas.increase_barrier` | `1` | The number of consecutive qualifying samples required before the Vegas algorithm increases the limit. Must be at least `1`.
`concurrency_limit.action.<alias>.vegas.decrease_barrier` | `1` | The number of consecutive qualifying samples required before the Vegas algorithm decreases the limit. Must be at least `1`. Drops bypass this barrier and reduce the limit immediately.
`concurrency_limit.action.<alias>.vegas.baseline_reset_load_threshold` | `0.5` | The fraction of the current limit below which the in-flight count must be for a probe to reset the no-load latency baseline. The value range is [0, 1].
`concurrency_limit.action.<alias>.gradient2.rtt_tolerance` | `1.5` | How far the short-term round-trip time may exceed the long-term round-trip time before the Gradient2 algorithm reduces the limit. Must be at least `1.0`.
`concurrency_limit.action.<alias>.aimd.backoff_ratio` | `0.9` | The factor by which the AIMD algorithm multiplies the limit when a request is dropped. The value range is [0.5, 1.0).
`concurrency_limit.action.<alias>.burst.capacity` | `0` | The extra [burst capacity](#burst-capacity) added on top of the adaptive limit while the burst window is open. Must be at least `0`. A value of `0` disables burst handling.
`concurrency_limit.action.<alias>.burst.close_after` | `5` | The number of consecutive saturated samples after which the burst window closes. Must be at least `1`.
`concurrency_limit.action.<alias>.burst.open_after` | `5` | The number of consecutive unsaturated samples after which the burst window reopens. Must be at least `1`.
`concurrency_limit.action.<alias>.partitions` | `[]` | The list of [partition](#partitions) names. When this list is not empty, `partition.resolver` is required.
`concurrency_limit.action.<alias>.partition.<name>.percent` | `0.0` | The share of the total limit reserved for the partition `<name>`. The value range is [0, 1], and the shares of all partitions must sum to at most `1.0`.
`concurrency_limit.action.<alias>.partition.<name>.delay_ms` | `0` | The time, in milliseconds, to pause before rejecting a request that exceeds the share of the partition `<name>`. Must be at least `0`. A value of `0` rejects immediately.
`concurrency_limit.action.<alias>.partition.resolver` | None | The resolver that maps requests to partitions. Valid values are `byHeader`, `fixed`, and `bySearchType`.
`concurrency_limit.action.<alias>.partition.resolver.fixed.partition` | `default` | The partition that receives all requests when the resolver is `fixed`. Must be one of the names listed in `partitions`.
`concurrency_limit.action.<alias>.partition.resolver.bySearchType.aggregation` | `aggregation` | The partition that receives search requests containing aggregations when the resolver is `bySearchType`.
`concurrency_limit.action.<alias>.partition.resolver.bySearchType.filter` | `filter` | The partition that receives all other search requests when the resolver is `bySearchType`.

The settings API validates every value and rejects the update if a value is out of range, if the partition shares sum to more than `1.0`, or if `partitions` is set without a `partition.resolver`. To stop limiting an action, set its `mode` to `disabled` or remove the alias's `action_name` setting.
{: .note}

## Concurrency Limits Stats API
**Introduced 3.9**
{: .label .label-purple }

You can use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) to monitor every configured limiter on each node. Request the `concurrency_limiter` metric; the statistics appear in the response under the `concurrency_limiters` key.

#### Example request

```json
GET _nodes/stats/concurrency_limiter
```
{% include copy-curl.html %}

#### Example response

The response contains one object per configured alias:

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "opensearch-cluster",
  "nodes": {
    "T7aqO6zaQX-lt8XBWBYLsA": {
      "timestamp": 1755530400000,
      "name": "node-1",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes": {
        "shard_indexing_pressure_enabled": "true"
      },
      "concurrency_limiters": {
        "search": {
          "action_name": "indices:data/read/search",
          "mode": "enforced",
          "algorithm": "vegas",
          "current_limit": 42,
          "in_flight": 7,
          "total_rejected": 128,
          "last_rtt_millis": 12,
          "rtt_no_load_millis": 4
        }
      }
    }
  }
}
```

### Response body fields

The response contains the following fields.

Field name | Data type | Description
:--- | :--- | :---
`concurrency_limiters` | Object | One entry per configured alias, keyed by the alias name.
`concurrency_limiters.<alias>.action_name` | String | The transport action that the limiter applies to.
`concurrency_limiters.<alias>.mode` | String | The current [mode](#modes) of the limiter.
`concurrency_limiters.<alias>.algorithm` | String | The [algorithm](#algorithms) in use.
`concurrency_limiters.<alias>.current_limit` | Integer | The current adaptive concurrency limit, not including burst capacity.
`concurrency_limiters.<alias>.in_flight` | Integer | The number of requests currently holding a token.
`concurrency_limiters.<alias>.total_rejected` | Integer | The cumulative number of rejected requests. In `monitor_only` mode, this counts requests that would have been rejected.
`concurrency_limiters.<alias>.last_rtt_millis` | Integer | The most recently observed round-trip time, in milliseconds. Omitted until the limiter has recorded a sample.
`concurrency_limiters.<alias>.rtt_no_load_millis` | Integer | The round-trip time measured under no load, in milliseconds, used as the latency baseline. Omitted until the limiter has recorded a sample.

The Cluster Stats API does not include concurrency limiter statistics.
{: .note}

## Metrics

When the [metrics framework]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/metrics/getting-started/) is enabled, each active alias also publishes the same values as gauges: `concurrency_limit.current_limit`, `concurrency_limit.in_flight`, `concurrency_limit.total_rejected`, `concurrency_limit.last_rtt`, and `concurrency_limit.rtt_noload`. Every gauge carries the `alias`, `action_name`, `mode`, and `algorithm` attributes.
