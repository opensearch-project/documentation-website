---
layout: default
title: CAT snapshots
parent: CAT API
nav_order: 65
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-snapshots/
---

# CAT snapshots
**Introduced 1.0**
{: .label .label-purple }

The CAT snapshots operation lists all snapshots for a repository.


<!-- spec_insert_start
api: cat.snapshots
component: endpoints
-->
## Endpoints

```json
GET /_cat/snapshots
GET /_cat/snapshots/{repository}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.snapshots
component: query_parameters
columns: Parameter,Type,Description,Default
include_deprecated: false
-->
## Query parameters


Parameter | Type | Description | Default
:--- | :--- | :--- | :---
`cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | 
`format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | 
`h` | List | A comma-separated list of column names to display. | 
`help` | Boolean | Returns help information. | `false`
`ignore_unavailable` | Boolean | When `true`, the response does not include information from unavailable snapshots. | `false`
`s` | List | A comma-separated list of column names or column aliases to sort by. | 
`time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units](https://opensearch.org/docs/latest/api-reference/units/). | 
`v` | Boolean | Enables verbose mode, which displays column headers. | `false`
<!-- spec_insert_end -->

## Example request

The following example request lists all snapshots:

```
GET _cat/snapshots?v
```
{% include copy-curl.html %}


## Example response

```json
index | shard | prirep | state   | docs | store | ip |       | node
plugins | 0   |   p    | STARTED |   0  |  208b | 172.18.0.4 | odfe-node1
plugins | 0   |   r    | STARTED |   0  |  208b | 172.18.0.3 |  odfe-node2          
```
