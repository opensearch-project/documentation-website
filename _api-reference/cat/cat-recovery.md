---
layout: default
title: CAT recovery
parent: CAT APIs
nav_order: 50
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-recovery/
---

# CAT Recovery API
**Introduced 1.0**
{: .label .label-purple }

The CAT recovery operation lists all completed and ongoing index and shard recoveries.


<!-- spec_insert_start
api: cat.recovery
component: endpoints
-->
## Endpoints
```json
GET /_cat/recovery
GET /_cat/recovery/{index}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.recovery
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `active_only` | Boolean | If `true`, the response only includes ongoing shard recoveries. | `false` |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, and `p`. | N/A |
| `detailed` | Boolean | When `true`, includes detailed information about shard recoveries. | `false` |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `index` | List | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (`*`). To target all data streams and indexes, omit this parameter or use `*` or `_all`. | N/A |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/). <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, and `d`. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example requests

```json
GET _cat/recovery?v
```
{% include copy-curl.html %}

To see only the recoveries of a specific index, add the index name after your query.

```json
GET _cat/recovery/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```json
GET _cat/recovery/index1,index2,index3
```
{% include copy-curl.html %}

## Example response

```json
index | shard | time | type | stage | source_host | source_node | target_host | target_node | repository | snapshot | files | files_recovered | files_percent | files_total | bytes | bytes_recovered | bytes_percent | bytes_total | translog_ops | translog_ops_recovered | translog_ops_percent
movies | 0 | 117ms | empty_store | done | n/a | n/a | 172.18.0.4 | odfe-node1 | n/a | n/a | 0 | 0 | 0.0% | 0 | 0 | 0 | 0.0% | 0 | 0 | 0 | 100.0%
movies | 0 | 382ms | peer | done | 172.18.0.4 | odfe-node1 | 172.18.0.3 | odfe-node2 | n/a | n/a | 1 | 1 |  100.0% | 1 | 208 | 208 | 100.0% | 208 | 1 | 1 | 100.0%
```
