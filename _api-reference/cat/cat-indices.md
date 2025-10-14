---
layout: default
title: CAT indices
parent: CAT APIs
nav_order: 25
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-indices/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-indices/
---

# CAT Indices API
**Introduced 1.0**
{: .label .label-purple }

The CAT indices operation lists information related to indexes, that is, how much disk space they are using, how many shards they have, their health status, and so on.


<!-- spec_insert_start
api: cat.indices
component: endpoints
-->
## Endpoints
```json
GET /_cat/indices
GET /_cat/indices/{index}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.indices
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, and `p`. | N/A |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `health` | String | Limits indexes based on their health status. Supported values are `green`, `yellow`, and `red`. <br> Valid values are: `green`, `GREEN`, `yellow`, `YELLOW`, `red`, and `RED`. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `include_unloaded_segments` | Boolean | Whether to include information from segments not loaded into memory. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `pri` | Boolean | When `true`, returns information only from the primary shards. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | Specifies the time units. <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, and `d`. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example requests

```json
GET _cat/indices?v
```
{% include copy-curl.html %}

To limit the information to a specific index, add the index name after your query.

```json
GET _cat/indices/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```json
GET _cat/indices/index1,index2,index3
```
{% include copy-curl.html %}


## Example response

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green  | open | movies | UZbpfERBQ1-3GSH2bnM3sg | 1 | 1 | 1 | 0 | 7.7kb | 3.8kb
```

## Limiting the response size

To limit the number of indexes returned, configure the `cat.indices.response.limit.number_of_indices` setting. For more information, see [Cluster-level CAT response limit settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-cat-response-limit-settings).