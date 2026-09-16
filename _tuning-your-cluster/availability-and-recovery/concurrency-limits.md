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

Concurrency limits restrict the number of requests that a given action can process at the same time, so that a node does not accept more requests than it can complete. Each limit adapts continuously to observed latency: it increases while the node maintains throughput and decreases when round-trip times rise or downstream components start rejecting requests. When the limit is reached, additional requests are rejected with an HTTP `429 Too Many Requests` response.

By default, concurrency limits are disabled. [Configure a concurrency limit](#concurrency-limit-settings) for any transport action, such as `indices:data/read/search` or `indices:data/write/bulk`. Each limit that you configure creates a _limiter_: the component that tracks the action's requests, adjusts the limit, and rejects requests that exceed it. No code changes or restarts are required. For the first five minutes after you configure or change a limit, the limiter calibrates without rejecting requests; adjust this period using `warmup_duration`.

## Concurrency limit settings

All concurrency limit settings are dynamic. For information about updating dynamic settings, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

The settings follow the pattern `concurrency_limit.action.<limiter_name>.<setting>`, in which `<limiter_name>` is a name that you choose. The name groups the settings that belong to one limiter and has no meaning of its own; the `action_name` setting specifies the action that is limited. You can configure any number of limiters.

Each limiter supports the following settings:

- `concurrency_limit.action.<limiter_name>.action_name` (Dynamic, string): The name of the transport action to limit, for example, `indices:data/read/search` or `indices:data/write/bulk`. Required. Clearing this setting removes the limiter.

- `concurrency_limit.action.<limiter_name>.mode` (Dynamic, string): The [mode](#modes) of the limiter. Valid values are `disabled`, `monitor_only`, and `enforced`. Default is `disabled`.

- `concurrency_limit.action.<limiter_name>.algorithm` (Dynamic, string): The [algorithm](#algorithms) used to adapt the limit. Valid values are `vegas`, `gradient2`, and `aimd`. Default is `vegas`.

- `concurrency_limit.action.<limiter_name>.limit.initial` (Dynamic, integer): The starting concurrency limit. Must be at least `1` and at most `limit.max`. Default is `20`.

- `concurrency_limit.action.<limiter_name>.limit.max` (Dynamic, integer): The maximum concurrency limit that the algorithm can reach. Must be at least `1` and at least `limit.initial`. Default is `200`.

- `concurrency_limit.action.<limiter_name>.warmup_duration` (Dynamic, time unit): The period after configuration during which the limiter calibrates without rejecting requests. Must be at least `0`. Default is `5m`.

- `concurrency_limit.action.<limiter_name>.vegas.updrift_factor` (Dynamic, integer): Multiplies the amount by which the Vegas algorithm raises the limit. Must be at least `1`. Default is `1`, which matches standard Vegas behavior.

- `concurrency_limit.action.<limiter_name>.vegas.increase_barrier` (Dynamic, integer): The number of consecutive qualifying samples required before the Vegas algorithm increases the limit. Must be at least `1`. Default is `1`.

- `concurrency_limit.action.<limiter_name>.vegas.decrease_barrier` (Dynamic, integer): The number of consecutive qualifying samples required before the Vegas algorithm decreases the limit. Must be at least `1`. Drops bypass this barrier and reduce the limit immediately. Default is `1`.

- `concurrency_limit.action.<limiter_name>.vegas.baseline_reset_load_threshold` (Dynamic, double): The maximum number of active requests, as a fraction of the current limit, that allows a probe to reset the no-load latency baseline. The value range is [0, 1]. Default is `0.5`.

- `concurrency_limit.action.<limiter_name>.gradient2.rtt_tolerance` (Dynamic, double): How far the short-term round-trip time may exceed the long-term round-trip time before the Gradient2 algorithm reduces the limit. Must be at least `1.0`. Default is `1.5`.

- `concurrency_limit.action.<limiter_name>.aimd.backoff_ratio` (Dynamic, double): The factor by which the AIMD algorithm multiplies the limit when a request is dropped. Must be at least `0.5` and less than `1.0`. Default is `0.9`.

- `concurrency_limit.action.<limiter_name>.burst.capacity` (Dynamic, integer): The extra [burst capacity](#burst-capacity) added on top of the adaptive limit while the burst window is open. Must be at least `0`. Default is `0`, which disables bursting.

- `concurrency_limit.action.<limiter_name>.burst.close_after` (Dynamic, integer): The number of consecutive saturated samples after which the burst window closes. Must be at least `1`. Default is `5`.

- `concurrency_limit.action.<limiter_name>.burst.open_after` (Dynamic, integer): The number of consecutive unsaturated samples after which the burst window reopens. Must be at least `1`. Default is `5`.

- `concurrency_limit.action.<limiter_name>.partitions` (Dynamic, list): The list of [partition](#partitions) names. When this list is not empty, `partition.resolver` is required. Default is an empty list.

- `concurrency_limit.action.<limiter_name>.partition.<name>.percent` (Dynamic, double): The share of the total limit reserved for the partition `<name>`. The value range is [0, 1], and the shares of all partitions must sum to at most `1.0`. Default is `0.0`.

- `concurrency_limit.action.<limiter_name>.partition.<name>.delay_ms` (Dynamic, integer): The time, in milliseconds, to pause before rejecting a request that exceeds the share of the partition `<name>`. The request is rejected either way; the pause holds the calling thread in order to slow the rate at which the client sends requests. A maximum of 100 requests per limiter are paused at the same time. Additional requests are rejected without a pause. Must be at least `0`. Default is `0`, which rejects immediately.

- `concurrency_limit.action.<limiter_name>.partition.resolver` (Dynamic, string): The resolver that maps requests to partitions. Valid values are `byHeader`, `fixed`, and `bySearchType`. Required when `partitions` is not empty.

- `concurrency_limit.action.<limiter_name>.partition.resolver.fixed.partition` (Dynamic, string): The partition that receives all requests when the resolver is `fixed`. Must be one of the names listed in `partitions`. Default is `default`.

- `concurrency_limit.action.<limiter_name>.partition.resolver.bySearchType.aggregation` (Dynamic, string): The partition that receives search requests containing aggregations when the resolver is `bySearchType`. Default is `aggregation`.

- `concurrency_limit.action.<limiter_name>.partition.resolver.bySearchType.filter` (Dynamic, string): The partition that receives all other search requests when the resolver is `bySearchType`. Default is `filter`.

The [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) validates every value and rejects the update if a value is out of range, if the partition shares sum to more than `1.0`, or if `partitions` is set without a `partition.resolver`. To stop limiting an action, set its `mode` to `disabled` or remove the limiter's `action_name` setting.
{: .note}

## Modes

Each limiter runs in one of three modes, set using the `mode` setting:

- `disabled` (default): The limiter is inactive. Requests are not tracked or rejected.
- `monitor_only`: The limiter tracks requests and adapts its limit but never rejects them. Requests that would have been rejected are counted in the `total_rejected` statistic. Use this mode to observe a limit before enforcing it.
- `enforced`: The limiter rejects requests once the limit is reached and the warm-up period has elapsed.

We recommend starting in `monitor_only` mode, [monitoring](#monitoring-concurrency-limits) the `current_limit` and `total_rejected` statistics, and switching to `enforced` once the limit settles at a reasonable value.
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

OpenSearch does not add a `Retry-After` header to these responses. Configure clients to retry using exponential backoff.

## Algorithms

The `algorithm` setting selects how the limit adapts. All three algorithms are provided by the [Netflix concurrency-limits](https://github.com/Netflix/concurrency-limits) library. The limit always stays between `limit.initial` and `limit.max`.

Each completed request produces one _sample_, consisting of the request's round-trip time and whether the request succeeded. The algorithms adjust the limit based on these samples: a successful completion allows the limit to increase, and a downstream `rejected_execution_exception`, such as a thread pool rejection, counts as a drop and reduces the limit. Other failures do not affect the limit.

### Vegas

The default `vegas` algorithm is based on TCP Vegas congestion control. It records the lowest observed round-trip time as a no-load baseline and compares each new sample against it. When latency stays close to the baseline, the limit increases; when latency rises, the limit decreases. Vegas suits most workloads and is the default.

The following table lists the settings that configure the Vegas algorithm.

Setting | Description
:--- | :---
`vegas.updrift_factor` | Multiplies the amount by which the algorithm raises the limit, which suits workloads with short traffic spikes. The default value of `1` matches the standard Vegas behavior.
`vegas.increase_barrier` | Requires several consecutive qualifying samples before the limit increases, which reduces oscillation.
`vegas.decrease_barrier` | Requires several consecutive qualifying samples before the limit decreases, which reduces oscillation. Drops bypass this barrier and reduce the limit immediately.
`vegas.baseline_reset_load_threshold` | Prevents latency measured under heavy load from replacing the no-load baseline. A probe only resets the baseline when the number of active requests is below this fraction of the current limit.

### Gradient2

The `gradient2` algorithm compares a short-term round-trip time average against a long-term average. When the short-term latency rises above the long-term latency by more than `gradient2.rtt_tolerance`, the limiter reduces the limit. It reacts more smoothly than Vegas to gradual latency drift and suits workloads whose baseline latency changes over time.

### AIMD

The `aimd` algorithm uses additive increase and multiplicative decrease. The limit increases by one on each successful sample and is multiplied by `aimd.backoff_ratio` whenever a request is dropped. It is simple and predictable but reacts only to drops, not to rising latency, so it is best suited to actions whose downstream components reject requests explicitly when they are saturated.

## Burst capacity

The `burst.capacity` setting adds a fixed amount of headroom on top of the adaptive limit so that short spikes are absorbed rather than rejected. The burst window starts open, so the effective limit is the adaptive limit plus `burst.capacity`. The window closes after `burst.close_after` consecutive samples in which the number of active requests reached the adaptive limit, and reopens after `burst.open_after` consecutive samples in which it stayed below the adaptive limit. Setting `burst.capacity` to `0` (the default) disables bursting.

## Partitions

Divide the concurrency limit into named sub-pools so that one class of traffic cannot exhaust the capacity available to another. List the pool names in `partitions` and give each a share of the total limit using `partition.<name>.percent`. The shares must sum to at most `1.0`. Requests that do not match a named partition are routed to a built-in unknown pool, which admits only one request at a time once the overall limit is reached. Any share that you leave unallocated is not available to any partition under load, so in most cases the shares should sum to `1.0`.

Partition shares are enforced only while the limiter is at its overall limit. Below the overall limit, a partition can use spare capacity beyond its share. Once the overall limit is reached, each partition is held to its own share. Every partition, including one with a `0.0` share, is guaranteed at least one concurrent request, so a `0.0` share allows one request at a time under load rather than none.

When `partitions` is set, you must also choose a `partition.resolver` that maps each request to a partition. The following table lists the available resolvers.

Resolver | Description
:--- | :---
`byHeader` | Reads the `X-Request-Tier` request header and routes the request to the partition whose name exactly matches the header value. The match is case sensitive. Requests without the header, or with an unrecognized value, go to the unknown pool. You cannot change the header name.
`fixed` | Routes every request to the single partition named in `partition.resolver.fixed.partition`.
`bySearchType` | Routes search requests that contain aggregations to the partition named in `partition.resolver.bySearchType.aggregation` and all other searches to the partition named in `partition.resolver.bySearchType.filter`. Non-search requests go to the unknown pool.

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
curl -X GET "http://localhost:9200/my-index/_search" \
  -H "X-Request-Tier: premium" \
  -H "Content-Type: application/json" \
  -d '{ "query": { "match_all": {} } }'
```
{% include copy.html %}

## Monitoring concurrency limits

To monitor every configured limiter on each node, request the `concurrency_limiter` metric from the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/):

```json
GET _nodes/stats/concurrency_limiter
```
{% include copy-curl.html %}

The statistics appear in the response under the `concurrency_limiters` key. For a description of each statistic, see [`concurrency_limiters`]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/#concurrency_limiters):

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

The Cluster Stats API does not include concurrency limiter statistics.
{: .note}

## Metrics

The [metrics framework]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/metrics/getting-started/) is an experimental feature that exports OpenSearch telemetry to an external monitoring backend. When it is enabled, each active limiter publishes the following gauges, which report the same values as the corresponding statistics.

Gauge | Corresponding statistic
:--- | :---
`concurrency_limit.current_limit` | `current_limit`
`concurrency_limit.in_flight` | `in_flight`
`concurrency_limit.total_rejected` | `total_rejected`
`concurrency_limit.last_rtt` | `last_rtt_millis`
`concurrency_limit.rtt_noload` | `rtt_no_load_millis`

Every gauge carries the `action_name`, `mode`, and `algorithm` attributes, along with an `alias` attribute containing the limiter name.
