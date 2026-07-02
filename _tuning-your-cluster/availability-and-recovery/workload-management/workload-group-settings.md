---
layout: default
title: Workload group settings
nav_order: 30
parent: Workload management
grand_parent: Availability and recovery
---

# Workload group settings
**Introduced 3.7**
{: .label .label-purple }

OpenSearch operation is normally controlled by cluster-wide defaults and per-request parameters. In a multi-tenant cluster, you may need to apply different limits to different tenants.

Workload group settings address this need by letting you attach group-specific configuration directly to a [workload group]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/). When a request is routed to a group, the group's settings are applied automatically. This approach provides the following benefits:

- You can apply stricter limits to resource-intensive or unverified tenants while keeping generous defaults for others, all without modifying cluster settings.
- Limits are bound to the workload group, so they apply to every request routed to the group regardless of which client sent it. No client-side configuration is required.
- A workload group can optionally take precedence over lenient request-level values, protecting the cluster from uncontrolled queries without rejecting them entirely.
- All guardrails for a tenant are located in one place alongside the group's `resource_limits` and `resiliency_mode`.

## Supported settings

You can configure settings in the `settings` object of a workload group. All settings are optional. Only the settings you explicitly define on a workload group are enforced; any setting you omit defaults to the corresponding request parameter or cluster default. Each workload group setting accepts the same value range as the underlying request parameter or cluster setting it maps to.

The following table lists the supported workload group settings.

| Setting | Type | Description |
| :--- | :--- | :--- |
| `search.default_search_timeout` | Time unit | The maximum amount of time a shard can spend on query execution. When a shard exceeds this timeout, it stops collecting hits and returns its current results to the coordinating node, which may produce partial results. <br>**Equivalent request parameter:** [`timeout`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#query-parameters) <br>**Equivalent cluster setting:** [`search.default_search_timeout`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/) |
| `search.cancel_after_time_interval` | Time unit | The maximum amount of time the entire search request can run at the coordinating node level. When the interval is reached, the request and all associated tasks are canceled and the client receives an error rather than partial results. <br>**Equivalent request parameter:** [`cancel_after_time_interval`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#query-parameters) <br>**Equivalent cluster setting:** [`search.cancel_after_time_interval`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/) |
| `search.max_concurrent_shard_requests` | Integer | The maximum number of concurrent shard-level requests a single search may issue per node. Limits search fan-out. <br>**Equivalent request parameter:** [`max_concurrent_shard_requests`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#query-parameters) <br>**Equivalent cluster setting:** None |
| `search.batched_reduce_size` | Integer | The number of shard results combined into one batch on the coordinating node before the final reduction step. Lower values reduce coordinator memory usage when a search spans many shards. <br>**Equivalent request parameter:** [`batched_reduce_size`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#query-parameters) <br>**Equivalent cluster setting:** None |
| `search.max_buckets` | Integer | The maximum number of aggregation buckets allowed in a single response. Guards against excessive memory use from large aggregations. <br>**Equivalent request parameter:** None <br>**Equivalent cluster setting:** [`search.max_buckets`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/) |
| `override_request_values` | Boolean | Whether the workload group's settings take precedence over values supplied on the request. Default is `false`. See [Setting precedence](#setting-precedence). <br>**Equivalent request parameter:** None <br>**Equivalent cluster setting:** None |

## Setting precedence

When a setting is defined on a workload group, OpenSearch resolves the effective value at request time using the following precedence rules:

- A workload group setting always takes precedence over the corresponding cluster setting when both are defined.
- By default, an explicit value supplied on a request takes precedence over the workload group's setting. You can reverse this behavior by setting `override_request_values` to `true`.

The following table summarizes how the effective value is resolved.

| `override_request_values` value | Precedence (highest to lowest) |
| :--- | :--- |
| `false` (Default) | Request parameter > Workload group setting > Cluster setting |
| `true` | Workload group setting > Request parameter > Cluster setting |

## Creating a workload group containing settings

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

## Updating workload group settings

You can update individual settings without affecting the other settings.

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

To remove a single setting, set its value to `null`:

```json
PUT _wlm/workload_group/analytics
{
  "settings": {
    "search.batched_reduce_size": null
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

To retrieve workload group settings, use the [Workload Group API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/#retrieving-a-workload-group):

```json
GET _wlm/workload_group/analytics
```
{% include copy-curl.html %}

## Deleting workload group settings

Settings are removed when the workload group is deleted. To remove individual settings without deleting the group, see [Updating workload group settings](#updating-workload-group-settings).
