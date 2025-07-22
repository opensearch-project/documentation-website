---
layout: default
title: CAT cluster manager
parent: CAT APIs
redirect_from:
 - /opensearch/rest-api/cat/cat-master/
nav_order: 30
has_children: false
---

# Cat Cluster_manager API
**Introduced 1.0**
{: .label .label-purple }

The CAT cluster manager operation lists information that helps identify the elected cluster manager node.


<!-- spec_insert_start
api: cat.cluster_manager
component: endpoints
-->
## Endpoints
```json
GET /_cat/cluster_manager
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.cluster_manager
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | A timeout for connection to the cluster manager node. | N/A |
| `format` | String | A short version of the HTTP `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->


## Example request

```
GET _cat/cluster_manager?v
```
{% include copy-curl.html %}

## Example response

```json
id                     |   host     |     ip     |   node
ZaIkkUd4TEiAihqJGkp5CA | 172.18.0.3 | 172.18.0.3 | opensearch-node2
```