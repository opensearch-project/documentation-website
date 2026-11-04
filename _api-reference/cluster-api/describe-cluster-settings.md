---
layout: default
title: Describe cluster settings
nav_order: 52
parent: Cluster APIs
---

# Describe Cluster Settings API
**Introduced 3.10**
{: .label .label-purple }

Returns the definitions of the specified cluster settings. For each setting, the response states whether the setting is dynamic or static, its default value, and its value type and bounds. Dynamic settings can be updated on a running cluster. Static settings require a node restart to change. For more information, see [Static settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings) and [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

The API does not return configured values, so it does not expose values from `opensearch.yml`, the keystore, or the cluster state.

Because the response is derived from the setting definitions and is identical on every node, any node can serve the request. The request is not routed to the elected cluster manager node.

## Endpoints

```json
GET /_cluster/settings/_describe
```

## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `settings` | String | A comma-separated list of setting names to describe. Each entry is either an exact name, such as `cluster.max_shards_per_node`, or a prefix ending in `.*`, such as `cluster.routing.allocation.*`, which describes every registered setting under that prefix at any depth. Exact names and prefixes can be mixed in one request. A prefix expands only to settings with fixed names. It does not expand to secure (keystore) settings or to settings whose names contain a variable part, such as `cluster.remote.<alias>.seeds`. To describe these settings, request them by exact name, such as `cluster.remote.alpha.seeds`. Required. |

## Example request

The following request describes the `cluster.max_shards_per_node`, `cluster.blocks.read_only`, and `cluster.name` settings:

```json
GET /_cluster/settings/_describe?settings=cluster.max_shards_per_node,cluster.blocks.read_only,cluster.name
```
{% include copy-curl.html %}

## Example response

The `cluster.name` setting is static and declares no readable value type, so its response contains no `validation` object:

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
    },
    "cluster.name": {
      "dynamic": false,
      "default": "opensearch"
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `settings` | Object | A map of setting names to their definitions. Setting names are returned in sorted order. |

The response omits any requested setting that is unknown or filtered. Filtered settings, such as credentials, are hidden from the settings APIs. A request that contains both known and unknown names returns `200 OK` and describes only the known names.

Each object in `settings` contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `dynamic` | Boolean | If `true`, the setting can be updated on a running cluster using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). If `false`, the setting is static and can be set only in `opensearch.yml` before a node starts. This field describes the setting definition only. It does not indicate whether the calling user is permitted to update the setting. This field is always present. |
| `default` | String | The default value declared in the setting definition, in the string form that the Cluster Settings API accepts, such as `"30s"`, `"85%"`, or `"[]"` for an empty list. Omitted for secure (keystore) settings and for settings that declare an empty default. Some defaults are computed by the node that responds to the request. For example, `node.processors` defaults to that node's processor count. |
| `validation` | Object | The declared value type and bounds. Present only when the setting is defined using one of the types listed in the following table. Settings that use custom parsing, such as string, list, or enumerated settings, have no `validation` object. |
| `description` | String | The description declared in the setting definition. Omitted when the definition does not include a description. |

The `validation` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | The value type. Valid values are `boolean`, `integer`, `long`, `float`, `double`, `time`, `byte_size`, and `memory_size`. This field is always present in the `validation` object. |
| `min` | String | The smallest accepted value, in the same string form as `default`. Omitted when the definition places no lower bound on the value. |
| `max` | String | The largest accepted value, in the same string form as `default`. Omitted when the definition places no upper bound on the value. |

For a `memory_size` setting, `min` and `max` describe the percentage form of the value (0--100%). These settings also accept an absolute byte size, such as `10gb`, which these bounds do not constrain.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/settings/describe`.

## Related documentation

- [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/)
- [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/)
