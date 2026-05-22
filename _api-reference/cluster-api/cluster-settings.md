---
layout: default
title: Cluster settings
nav_order: 50
parent: Cluster APIs
redirect_from:
  - /api-reference/cluster-settings/
  - /opensearch/rest-api/cluster-settings/
---

# Cluster Settings API
**Introduced 1.0**
{: .label .label-purple }

The Cluster Settings API retrieves or modifies cluster-wide settings that apply to all nodes in your OpenSearch cluster. Settings updated through this API take precedence over those defined in the `opensearch.yml` configuration file.

Use the Cluster Settings API for the following purposes:

- Retrieving current cluster configuration to understand how your cluster is configured without accessing individual node configuration files.
- Dynamically adjusting cluster behavior without requiring a cluster restart, such as modifying shard allocation settings or recovery speeds.
- Managing settings that need to be consistent across all nodes in the cluster, ensuring uniform behavior.
- Temporarily changing settings for testing or troubleshooting purposes using transient settings that don't persist across cluster restarts.

Using this API to manage cluster-wide settings is preferred over manually editing configuration files because it ensures consistency across all nodes and allows for dynamic updates without restarts.
{: .tip}

When updating cluster settings, you can specify whether changes should be persistent (persist after cluster restarts) or transient (cleared after restart). For more information about persistent and transient settings, setting precedence, and resetting settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Endpoints

```json
GET /_cluster/settings
PUT /_cluster/settings
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). _(Default: `30s`)_ |
| `flat_settings` | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of `"cluster": { "max_shards_per_node": 500 }` is `"cluster.max_shards_per_node": "500"`. _(Default: `false`)_ |
| `include_defaults` | Boolean | **`GET` only.** When `true`, returns default cluster settings from the local node. _(Default: `false`)_ |
| `timeout` | String | **`PUT` only.** A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. _(Default: `30s`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

## Request body fields

The `GET` operation has no request body. The following table lists the request body fields for the `PUT` operation.

Field | Data type | Description
:--- | :--- | :---
`persistent` | Object | Settings that persist across full cluster restarts. These settings are written to the cluster state and remain until explicitly changed.
`transient` | Object | Settings that apply only until the next full cluster restart. Useful for temporary configuration changes during testing or troubleshooting.

Within the `persistent` or `transient` objects, specify the settings you want to update as key-value pairs. For example:

```json
{
  "persistent": {
    "cluster.max_shards_per_node": 500
  }
}
```

Not all cluster settings can be updated dynamically using the Cluster Settings API. When attempting to configure a static setting through the API, you will receive the error message `"setting [cluster.some.setting], not dynamically updateable"`. Static settings must be configured in the `opensearch.yml` file and require a node restart.
{: .note }

For a comprehensive list of all available cluster settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).


## Example: Retrieving current cluster settings

To view the current cluster settings without defaults, send a GET request:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/settings
-->
{% capture step1_rest %}
GET /_cluster/settings
{% endcapture %}

{% capture step1_python %}

response = client.cluster.get_settings()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The response shows any persistent and transient settings that have been explicitly configured. Empty objects indicate no settings of that type have been set:

```json
{
  "persistent": {
    "cluster": {
      "routing": {
        "allocation": {
          "load_awareness": {
            "flat_skew": "2"
          }
        }
      },
      "max_voting_config_exclusions": "10",
      "metadata": {
        "key": "10s"
      },
      "auto_shrink_voting_configuration": "true",
      "blocks": {
        "create_index": "false",
        "create_index.auto_release": "true"
      },
      "thread_pool": {
        "generic": {
          "max": "5"
        }
      },
      "max_shards_per_node": "500",
      "remote": {
        "my_remote_cluster": {
          "seeds": [
            "127.0.0.1:9300"
          ]
        },
        "opensearch-cluster": {
          "mode": "proxy"
        }
      },
      "no_cluster_manager_block": "write"
    },
    "indices": {
      "mapping": {
        "max_in_flight_updates": "10"
      }
    },
    "plugins": {
      "ml_commons": {
        "only_run_on_ml_node": "false",
        "mcp_server_enabled": "true",
        "native_memory_threshold": "99"
      }
    },
    "search_backpressure": {
      "mode": "monitor_only"
    },
    "action": {
      "auto_create_index": "true"
    },
    "wlm": {
      "workload_group": {
        "mode": "disabled",
        "duress_streak": "10"
      }
    },
    "admission_control": {
      "cluster": {
        "admin": {
          "cpu_usage": {
            "limit": "4"
          }
        }
      }
    },
    "script": {
      "context": {
        "field": {
          "max_compilations_rate": "75/5m",
          "cache_expire": "0ms",
          "cache_max_size": "100"
        },
        "search": {
          "max_compilations_rate": "75/5m",
          "cache_expire": "0ms",
          "cache_max_size": "100"
        },
        "ingest": {
          "max_compilations_rate": "75/5m",
          "cache_expire": "0ms",
          "cache_max_size": "100"
        }
      }
    }
  },
  "transient": {
    "cluster": {
      "max_shards_per_node": "1000"
    }
  }
}
```

## Example: Including default settings

To retrieve all cluster settings, including defaults, use the `include_defaults` parameter:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/settings?include_defaults=true
-->
{% capture step1_rest %}
GET /_cluster/settings?include_defaults=true
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_settings(
  params = { "include_defaults": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The response includes a `defaults` object containing all default cluster settings (truncated for brevity). This is useful for identifying setting names and their default values before making changes:

```json
{
  "persistent" : { },
  "transient" : { },
  "defaults" : {
    "task_resource_tracking" : {
      "enabled" : "true"
    },
    "cluster" : {
      "metadata" : {
        "perf_analyzer" : {
          "collectors" : {
            "mode" : "0"
          },
          "state" : "0",
          "config" : {
            "overrides" : ""
          },
          "pa_node_stats_setting" : "1"
        }
      },
      "no_master_block" : "metadata_write",
      "persistent_tasks" : {
        "allocation" : {
          "enable" : "all",
          "recheck_interval" : "30s"
        }
      },
      "initial_cluster_manager_nodes" : [
        "opensearch-node1"
      ]
    }
  }
}
```

## Example: Using flat settings format

To return settings in a flat format, which improves readability for nested settings, use the `flat_settings` parameter:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/settings?flat_settings=true
-->
{% capture step1_rest %}
GET /_cluster/settings?flat_settings=true
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_settings(
  params = { "flat_settings": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

```json
{
  "persistent": {
    "action.auto_create_index": "true",
    "admission_control.cluster.admin.cpu_usage.limit": "4",
    "cluster.auto_shrink_voting_configuration": "true",
    "cluster.blocks.create_index": "false",
    "cluster.blocks.create_index.auto_release": "true",
    "cluster.max_shards_per_node": "500",
    "cluster.max_voting_config_exclusions": "10",
    "cluster.metadata.key": "10s",
    "cluster.no_cluster_manager_block": "write",
    "cluster.remote.my_remote_cluster.seeds": [
      "127.0.0.1:9300"
    ],
    "cluster.remote.opensearch-cluster.mode": "proxy",
    "cluster.routing.allocation.load_awareness.flat_skew": "2",
    "cluster.thread_pool.generic.max": "5",
    "indices.mapping.max_in_flight_updates": "10",
    "plugins.ml_commons.mcp_server_enabled": "true",
    "plugins.ml_commons.native_memory_threshold": "99",
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "script.context.field.cache_expire": "0ms",
    "script.context.field.cache_max_size": "100",
    "script.context.field.max_compilations_rate": "75/5m",
    "script.context.ingest.cache_expire": "0ms",
    "script.context.ingest.cache_max_size": "100",
    "script.context.ingest.max_compilations_rate": "75/5m",
    "script.context.search.cache_expire": "0ms",
    "script.context.search.cache_max_size": "100",
    "script.context.search.max_compilations_rate": "75/5m",
    "search_backpressure.mode": "monitor_only",
    "wlm.workload_group.duress_streak": "10",
    "wlm.workload_group.mode": "disabled"
  },
  "transient": {
    "cluster.max_shards_per_node": "1000"
  }
}
```

## Example: Updating persistent settings

To update a setting that persists across cluster restarts, include it in the `persistent` object:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/settings
body: |
{
  "persistent": {
    "cluster.max_shards_per_node": 500
  }
}
-->
{% capture step1_rest %}
PUT /_cluster/settings
{
  "persistent": {
    "cluster.max_shards_per_node": 500
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_settings(
  body =   {
    "persistent": {
      "cluster.max_shards_per_node": 500
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The `acknowledged` field indicates that the setting was successfully updated. The response includes the updated setting:

```json
{
  "acknowledged" : true,
  "persistent" : {
    "cluster" : {
      "max_shards_per_node" : "500"
    }
  },
  "transient" : { }
}
```

## Example: Updating transient settings

To update a setting temporarily (until the next full cluster restart), include it in the `transient` object:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/settings
body: |
{
  "transient": {
    "indices.recovery.max_bytes_per_sec": "20mb"
  }
}
-->
{% capture step1_rest %}
PUT /_cluster/settings
{
  "transient": {
    "indices.recovery.max_bytes_per_sec": "20mb"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_settings(
  body =   {
    "transient": {
      "indices.recovery.max_bytes_per_sec": "20mb"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The `acknowledged` field indicates that the setting was successfully updated. The response includes the updated setting:

```json
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : {
    "indices" : {
      "recovery" : {
        "max_bytes_per_sec" : "20mb"
      }
    }
  }
}
```

## Example: Resetting a setting

To reset a setting to its default value, assign it `null`:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/settings
body: |
{
  "transient": {
    "indices.recovery.max_bytes_per_sec": null
  }
}
-->
{% capture step1_rest %}
PUT /_cluster/settings
{
  "transient": {
    "indices.recovery.max_bytes_per_sec": null
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_settings(
  body =   {
    "transient": {
      "indices.recovery.max_bytes_per_sec": null
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Resetting multiple settings with wildcards

To reset multiple related settings at once, use wildcard patterns:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/settings
body: |
{
  "persistent": {
    "indices.recovery.*": null
  }
}
-->
{% capture step1_rest %}
PUT /_cluster/settings
{
  "persistent": {
    "indices.recovery.*": null
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_settings(
  body =   {
    "persistent": {
      "indices.recovery.*": null
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


#### Example response

When a setting is reset, it no longer appears in the response. The setting now uses the next value in the precedence order:

```json
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : { }
}
```


## Response fields

The following table lists the response fields.

Field | Data type | Description
:--- | :--- | :---
`acknowledged` | Boolean | Indicates whether the settings update was successfully applied to the cluster. Only present in PUT responses.
`persistent` | Object | Contains all persistent cluster settings that have been explicitly configured. Settings in this object persist across full cluster restarts.
`transient` | Object | Contains all transient cluster settings that have been explicitly configured. Settings in this object are cleared after a full cluster restart.
`defaults` | Object | Contains all default cluster settings with their default values. Only present when the `include_defaults` parameter is set to `true` in `GET` requests.

## Related documentation

- For more information about transient settings, persistent settings, and setting precedence, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/).
