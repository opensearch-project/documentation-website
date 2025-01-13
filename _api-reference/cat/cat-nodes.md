---
layout: default
title: CAT nodes
parent: CAT API
nav_order: 40
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-nodes/
---

# CAT nodes
**Introduced 1.0**
{: .label .label-purple }

The CAT nodes operation lists node-level information, including node roles and load metrics.

A few important node metrics are `pid`, `name`, `cluster_manager`, `ip`, `port`, `version`, `build`, `jdk`, along with `disk`, `heap`, `ram`, and `file_desc`.


<!-- spec_insert_start
api: cat.nodes
component: endpoints
-->
## Endpoints

```json
GET /_cat/nodes
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.nodes
component: query_parameters
columns: Parameter,Type,Description,Default
include_deprecated: false
-->
## Query parameters


Parameter | Type | Description | Default
:--- | :--- | :--- | :---
`bytes` | String | The units used to display byte values. | 
`cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | 
`format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | 
`full_id` | Boolean or String | When `true`, returns the full node ID. When `false`, returns the shortened node ID. | `false`
`h` | List | A comma-separated list of column names to display. | 
`help` | Boolean | Returns help information. | `false`
`s` | List | A comma-separated list of column names or column aliases to sort by. | 
`time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units](https://opensearch.org/docs/latest/api-reference/units/). | 
`v` | Boolean | Enables verbose mode, which displays column headers. | `false`
<!-- spec_insert_end -->

## Example request

The following example request lists node level information:

```json
GET _cat/nodes?v
```
{% include copy-curl.html %}


## Example response

```json
ip       |   heap.percent | ram.percent | cpu load_1m | load_5m | load_15m | node.role | node.roles |     cluster_manager |  name
10.11.1.225  |         31   |    32  | 0  |  0.00  |  0.00   | di  | data,ingest,ml  | - |  data-e5b89ad7
```
