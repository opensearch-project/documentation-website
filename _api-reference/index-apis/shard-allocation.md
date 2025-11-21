---
layout: default
title: Shard allocation
parent: Index blocks and allocation
grand_parent: Index APIs
nav_order: 20
---

# Shard allocation filtering

Shard allocation filtering lets you constrain where shards for an index are placed by matching node attributes. You can use it to pin shards to certain nodes, avoid nodes, or require specific hardware or zones. Shards are only allocated to nodes that satisfy all active filters, including index-level shard allocation filtering and [cluster-level routing awareness]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-awareness/).

## Endpoints

```json
PUT /<index>/_settings
GET /<index>/_settings
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`<index>` | String | One or more comma-separated indexes from which to update or read settings. Use `_all` or `*` to target all indexes. |

## Built-in and custom attributes

You can filter on built‑in attributes or any custom node attribute you define. For example, custom attribute can be defined by adding `node.attr.zone: zone-a` in `opensearch.yml`. The following built‑in attributes are supported.

Attribute | Description
:--- | :---
`_name` | Match by node name.
`_host_ip` | Match by host IP address.
`_publish_ip` | Match by publish IP address.
`_ip` | Match either `_host_ip` or `_publish_ip`.
`_host` | Match by hostname.
`_id` | Match by node ID.
`_tier` | Match nodes by data tier role.

## Filter types

Use the following index settings.

Setting | Effect
:--- | :---
`index.routing.allocation.include.<attr>` | Allocate shards to nodes that match **any** of the provided values.
`index.routing.allocation.exclude.<attr>` | **Do not** allocate shards to nodes that match **any** of the provided values.
`index.routing.allocation.require.<attr>` | Allocate shards **only** to nodes that match **all** of the provided values.

## Example requests

The following examples demonstrate the different ways to use shard allocation filters.

### Allocate an index only to a specific zone

Use the following command to allocate an index to nodes in `zone-a`:

```json
PUT /test-index/_settings
{
  "index.routing.allocation.require.zone": "zone-a"
}
```
{% include copy-curl.html %}

### Allocate to a subset of nodes by IPs

```json
PUT /test-index/_settings
{
  "index.routing.allocation.include._ip": "10.0.0.12,10.0.0.13"
}
```
{% include copy-curl.html %}

### Exclude an index from the node

The following command excludes an index from node `data-node-3`:

```json
PUT /test-index/_settings
{
  "index.routing.allocation.exclude._name": "data-node-3"
}
```
{% include copy-curl.html %}

### Combine filters

The following command configures required rack but excludes node `data-node-7`:

```json
PUT /test-index/_settings
{
  "index": {
    "routing.allocation.require.rack": "r1",
    "routing.allocation.exclude._name": "data-node-7"
  }
}
```
{% include copy-curl.html %}

### Clear a filter

To clear a filter, set its value to `null` or an empty string `""`:

```json
PUT /test-index/settings
{
  "persistent": {
    "index.routing.allocation.exclude._host_ip": null
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```


