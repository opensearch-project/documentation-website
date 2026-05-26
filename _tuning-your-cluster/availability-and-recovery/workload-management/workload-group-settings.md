---
layout: default
title: Workload group settings
nav_order: 25
parent: Workload management
grand_parent: Availability and recovery
---

# Workload group settings
Introduced 3.7
{: .label .label-purple }

Workload group settings let you attach group-specific configuration directly to a [workload group]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/). When a request is routed to a group, the group's settings are applied automatically.

## Why use workload group settings

OpenSearch behavior is normally controlled by cluster-wide defaults and per-request parameters. In a multi-tenant cluster, this leaves two unattractive options: lower the defaults for everyone (penalizing well-behaved tenants) or trust every client to send the correct request parameters (which is hard to enforce). Workload group settings solve this by letting you define guardrails per tenant:

- **Tenant-specific guardrails**: Apply stricter limits to noisy or untrusted tenants while keeping generous defaults for others, all without touching cluster settings.
- **No client cooperation required**: Limits travel with the workload group, so they apply to every request routed to the group regardless of which client sent it.
- **Optional override of request parameters**: A workload group can be configured to take precedence over lenient request-level values, protecting the cluster from runaway queries without rejecting them outright.
- **Centralized policy**: All guardrails for a tenant live in one place alongside the group's `resource_limits` and `resiliency_mode`.

## Supported settings

You configure settings in the `settings` object of a workload group. All settings are optional. Only the settings you explicitly define on a workload group are enforced; any setting you omit falls back to the corresponding request parameter or cluster default.

Each workload group setting accepts the same value range as the underlying request parameter or cluster setting it maps to. Values outside the supported range are rejected when you create or update the workload group.

| Setting | Type | Description | Equivalent request parameter | Equivalent cluster setting |
| :--- | :--- | :--- | :--- | :--- |
| `search.default_search_timeout` | Time | Per-shard limit on query execution. When a shard exceeds the limit, it stops collecting hits and returns its current results to the coordinating node, which may produce partial results. | [`timeout`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/) | [`search.default_search_timeout`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/) |
| `search.cancel_after_time_interval` | Time | Coordinating-node-level deadline for the entire search request. When the interval is reached, the request and all associated tasks are canceled and the client receives an error rather than partial results. | [`cancel_after_time_interval`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/) | [`search.cancel_after_time_interval`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/) |
| `search.max_concurrent_shard_requests` | Integer | Maximum number of concurrent shard-level requests a single search may issue per node. Limits search fan-out. | [`max_concurrent_shard_requests`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/) | -- |
| `search.batched_reduce_size` | Integer | Number of shard results combined into one batch on the coordinating node before the final reduce. Lower values reduce coordinator memory usage when a search spans many shards. | [`batched_reduce_size`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/) | -- |
| `search.max_buckets` | Integer | Maximum number of aggregation buckets allowed in a single response. Guards against excessive memory use from large aggregations. | -- | [`search.max_buckets`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/) |
| `override_request_values` | Boolean | Whether the workload group's settings take precedence over values supplied on the request. Default is `false`. See [Precedence](#precedence). | -- | -- |

### Precedence

When a setting is defined on a workload group, OpenSearch resolves the effective value at request time using the following precedence rules:

- **Workload group settings versus cluster settings**: A workload group setting always takes precedence over the corresponding cluster setting when both are defined.
- **Workload group settings versus request parameters**: By default, an explicit value supplied on a request takes precedence over the workload group's setting. You can reverse this behavior by setting `override_request_values` to `true`.

The following table summarizes how the effective value is resolved (left wins over right):

| `override_request_values` | Precedence (highest to lowest) |
| :--- | :--- |
| `false` (default) | Request parameter > Workload group setting > Cluster setting |
| `true` | Workload group setting > Request parameter > Cluster setting |

## Creating a workload group with settings

Add a `settings` object alongside the existing workload group fields:

```json
PUT _wlm/workload_group
{
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  },
  "settings": {
    "search.default_search_timeout": "30s",
    "search.cancel_after_time_interval": "1m",
    "search.max_concurrent_shard_requests": 5,
    "search.batched_reduce_size": 512,
    "search.max_buckets": 10000
  }
}
```
{% include copy-curl.html %}

The response echoes the configured settings:

```json
{
  "_id": "preXpc67RbKKeCyka72_Gw",
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  },
  "settings": {
    "search.default_search_timeout": "30s",
    "search.cancel_after_time_interval": "1m",
    "search.max_concurrent_shard_requests": "5",
    "search.batched_reduce_size": "512",
    "search.max_buckets": "10000"
  },
  "updated_at": 1775177784440
}
```

## Updating workload group settings

Updates to the `settings` object follow merge semantics, so you can change one key without resending the others.

For example, to change only the search timeout for the `analytics` workload group:

```json
PUT _wlm/workload_group/analytics
{
  "settings": {
    "search.default_search_timeout": "1m"
  }
}
```
{% include copy-curl.html %}

To remove a single setting without touching the others, set its value to `null`:

```json
PUT _wlm/workload_group/analytics
{
  "settings": {
    "search.batched_reduce_size": null
  }
}
```
{% include copy-curl.html %}

To make the workload group's settings override values supplied on requests, enable `override_request_values`:

```json
PUT _wlm/workload_group/analytics
{
  "settings": {
    "override_request_values": true
  }
}
```
{% include copy-curl.html %}

To clear all settings, send an empty `settings` object:

```json
PUT _wlm/workload_group/analytics
{
  "settings": {}
}
```
{% include copy-curl.html %}

## Retrieving workload group settings

Settings appear in the workload group object returned by the [Workload Group API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/#retrieving-a-workload-group):

```json
GET _wlm/workload_group/analytics
```
{% include copy-curl.html %}

## Deleting workload group settings

Settings are part of the workload group object and are removed when the workload group is deleted. To remove individual settings without deleting the group, see [Updating workload group settings](#updating-workload-group-settings).
