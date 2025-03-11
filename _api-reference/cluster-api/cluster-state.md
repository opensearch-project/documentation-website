---
layout: default
title: Cluster state
nav_order: 55
parent: Cluster APIs
---

# Cluster state
**Introduced 1.0**
{: .label .label-purple }

The Cluster State API returns comprehensive information about the state of the cluster.

<!-- spec_insert_start
api: cluster.state
component: endpoints
-->
## Endpoints
```json
GET /_cluster/state
GET /_cluster/state/{metric}
GET /_cluster/state/{metric}/{index}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.state
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List or String | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (`*`). To target all data streams and indexes, omit this parameter or use `*` or `_all`. |
| `metric` | List | Limits the information returned to only the specified metrics. |

<!-- spec_insert_end -->

### Supported metrics

If you want to isolate the cluster state response to a specific metric, use one or more of the following:

- `cluster_name`
- `cluster_uuid`
- `version`
- `state_uuid`
- `cluster_manager_node`
- `blocks`
- `nodes`
- `metadata`
  - `cluster_uuid`
  - `templates`
  - `indices`
  - `index-graveyard`
  - `cluster_coordination`
  - `ingest`
  - `repositories`
  - `component_template`
  - `index_template`
  - `data_stream`
  - `aliases`
- `routing_table`
  - `indices`
- `routing_nodes`
- `customs`
- `snapshots`
- `restore`
- `snapshot_deletions`

<!-- spec_insert_start
api: cluster.state
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `allow_no_indices` | Boolean | Whether to ignore a wildcard index expression that resolves into no concrete indexes. This includes the `_all` string or when no indexes have been specified. |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with open, closed, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. |
| `flat_settings` | Boolean | Returns settings in a flat format. _(Default: `false`)_ |
| `ignore_unavailable` | Boolean | Whether the specified concrete indexes should be ignored when unavailable (missing or closed). |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. _(Default: `false`)_ |
| `wait_for_metadata_version` | Integer | Wait for the metadata version to be equal or greater than the specified metadata version. |
| `wait_for_timeout` | String | The maximum time to wait for `wait_for_metadata_version` before timing out. |

<!-- spec_insert_end -->


## Example request

The following example request lists the full cluster state.

```json
GET /_cluster/state/
```
{% include copy-curl.html %}

## Example response

```json
{
  "cluster_name": "my_opensearch_cluster",
  "cluster_uuid": "abcdefghijklmnopqrstuvwxyz",
  "version": 42,
  "state_uuid": "0123456789abcdefghij",
  "cluster_manager_node": "node-1",
  "blocks": {},
  "metadata": {
    "cluster_uuid": "abcdefghijklmnopqrstuvwxyz",
    "cluster_coordination": {
      "term": 5,
      "last_committed_config": ["node-1", "node-2", "node-3"]
    },
    "templates": {},
    "indices": {
      "my_index": {
        "state": "open",
        "settings": {
          "index": {
            "number_of_shards": "5",
            "number_of_replicas": "1",
            "creation_date": "1623456789000"
          }
        },
        "mappings": {},
        "aliases": ["my_alias"]
      }
    }
  },
  "routing_table": {
    "indices": {
      "my_index": {
        "shards": {
          "0": [
            {
              "state": "STARTED",
              "primary": true,
              "node": "node-1",
              "relocating_node": null
            },
            {
              "state": "STARTED",
              "primary": false,
              "node": "node-2",
              "relocating_node": null
            }
          ],
          "1": [
            {
              "state": "STARTED",
              "primary": true,
              "node": "node-2",
              "relocating_node": null
            },
            {
              "state": "STARTED",
              "primary": false,
              "node": "node-3",
              "relocating_node": null
            }
          ]
        }
      }
    }
  }
}
```