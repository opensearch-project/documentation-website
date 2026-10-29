---
layout: default
title: Describe cluster settings
nav_order: 52
parent: Cluster APIs
---

# Describe Cluster Settings API
**Introduced 3.10**
{: .label .label-purple }

The `/_cluster/settings/_describe` API returns metadata about how cluster settings are defined, rather than their configured values. For each requested setting, the API reports whether the setting is dynamic (can be updated on a running cluster) or static (requires a node restart to change), the declared default, and any declared value type and bounds.

This API describes the setting definitions compiled into the node. It never returns a setting's configured value, so it does not expose values from `opensearch.yml`, the keystore, or the cluster state.

Because the response is derived from the setting definitions and is identical on every node, any node can serve the request. The request is not routed to the elected cluster manager node.

## Endpoints

```json
GET /_cluster/settings/_describe
```

## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description |
| --------- | --------- | ----------- |
| `settings` | String or List | Required. A comma-separated list of exact setting names to describe. Wildcards (`*`, `?`) are not supported; each name must be an exact setting key. A request with no names, or with a wildcard, returns `400 Bad Request`. |

## Example request

Describe two cluster settings:

```json
GET /_cluster/settings/_describe?settings=cluster.max_shards_per_node,cluster.blocks.read_only
```
{% include copy-curl.html %}

## Example response

```json
{
  "settings": {
    "cluster.blocks.read_only": {
      "dynamic": true,
      "default": "false",
      "validation": {
        "type": "boolean"
      }
    },
    "cluster.max_shards_per_node": {
      "dynamic": true,
      "default": "1000",
      "validation": {
        "type": "integer",
        "min": "1"
      }
    }
  }
}
```

The following example describes settings whose definitions carry less metadata. `cluster.name` declares a default but no readable value type, so it has no `validation` object. `indices.recovery.max_bytes_per_sec` declares a type but no bounds, so `validation` contains only `type`:

```json
GET /_cluster/settings/_describe?settings=cluster.name,indices.recovery.max_bytes_per_sec,cluster.info.update.interval
```
{% include copy-curl.html %}

```json
{
  "settings": {
    "cluster.info.update.interval": {
      "dynamic": true,
      "default": "30s",
      "validation": {
        "type": "time",
        "min": "10s"
      }
    },
    "cluster.name": {
      "dynamic": false,
      "default": "opensearch"
    },
    "indices.recovery.max_bytes_per_sec": {
      "dynamic": true,
      "default": "41943040b",
      "validation": {
        "type": "byte_size"
      }
    }
  }
}
```

## Response fields

The following table lists all response fields.

| Field | Data type | Description |
| ----- | --------- | ----------- |
| `settings` | Object | A map of setting names to their definition metadata. Setting names are returned in sorted order. |
| `settings.<setting_name>.dynamic` | Boolean | Always present. If `true`, the setting can be updated on a running cluster using the Cluster Settings API. If `false`, the setting is static and can only be set in `opensearch.yml` before a node starts. This field describes the setting definition only; it does not indicate whether the calling user is permitted to update the setting. |
| `settings.<setting_name>.default` | String | The default value declared in the setting definition, in the same string form accepted by the Cluster Settings API (for example, `"30s"`, `"85%"`, `"[]"` for an empty list). Omitted for secure (keystore) settings and for settings that declare an empty default. Some defaults are computed from the node that answers the request; for example, `node.processors` defaults to that node's processor count. |
| `settings.<setting_name>.validation` | Object | The declared value type and bounds. Present only when the setting is defined with one of the types listed below. Settings that use custom parsing, such as string, list, or enumerated settings, have no `validation` object. |
| `settings.<setting_name>.validation.type` | String | Always present within `validation`. One of `boolean`, `integer`, `long`, `float`, `double`, `time`, `byte_size`, or `memory_size`. |
| `settings.<setting_name>.validation.min` | String | The smallest accepted value, in the same string form as `default`. Omitted when the definition places no lower bound on the value. |
| `settings.<setting_name>.validation.max` | String | The largest accepted value, in the same string form as `default`. Omitted when the definition places no upper bound on the value. |

For a `memory_size` setting, `min` and `max` describe the percentage form of the value (`0%` to `100%`). Such settings also accept an absolute byte size (for example, `10gb`), which these bounds do not constrain.

A requested name is omitted from the response if it is unknown or if it is a filtered setting. An unknown name is intentionally indistinguishable from a filtered one, so the response does not reveal whether a filtered setting exists. Requesting a mix of known and unknown names returns `200 OK` with only the known names described.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/settings/describe`.

Having this permission does not grant the ability to update any setting. Whether a setting is reported as `dynamic` is independent of whether the caller holds `cluster:admin/settings/update`.
