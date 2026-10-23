---
layout: default
title: Describe cluster settings
nav_order: 52
parent: Cluster APIs
---

# Describe Cluster Settings API
**Introduced 3.10**
{: .label .label-purple }

The `/_cluster/settings/_describe` API returns metadata about cluster setting definitions rather than their configured values. For each requested setting, the API reports whether the setting is dynamic (can be updated on a running cluster) or static (requires a node restart to change).

This API returns only definition metadata. It never returns a setting's configured value or default value, so it does not expose sensitive or filtered configuration.

Because the response contains static definition metadata that is identical on every node, any node can serve the request. The request is not required to be routed to the elected cluster manager node.

## Endpoints

```json
GET /_cluster/settings/_describe
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| --------- | --------- | ----------- |
| `settings` | String or List | A comma-separated list of exact setting names to describe. Wildcards (`*`, `?`) are not supported; each name must be an exact, valid setting key. At least one name is required. |
| `cluster_manager_timeout` | Time | The timeout duration for connecting to the cluster manager node. Default is `30s`. |

## Example request

Describe whether specific settings are dynamic:

```json
GET /_cluster/settings/_describe?settings=cluster.max_shards_per_node,cluster.blocks.read_only
```
{% include copy-curl.html %}

## Example response

```json
{
  "settings": {
    "cluster.blocks.read_only": {
      "dynamic": true
    },
    "cluster.max_shards_per_node": {
      "dynamic": true
    }
  }
}
```

## Response fields

The following table lists all response fields.

| Field | Data type | Description |
| ----- | --------- | ----------- |
| `settings` | Object | A map of setting names to their definition metadata. Setting names are returned in sorted order. |
| `settings.<setting_name>.dynamic` | Boolean | If `true`, the setting is dynamic and can be updated on a running cluster. If `false`, the setting is static and requires a node restart to change. |

A requested name is omitted from the response if it is unknown or if it is a filtered setting. An omitted name is intentionally indistinguishable from a filtered one, so the response does not reveal whether a filtered setting exists.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/settings/describe`.
