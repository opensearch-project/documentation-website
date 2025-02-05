---
layout: default
title: CAT shards
parent: CAT API
nav_order: 60
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-shards/
---

# CAT shards
**Introduced 1.0**
{: .label .label-purple }

The CAT shards operation lists the state of all primary and replica shards and how they are distributed.


<!-- spec_insert_start
api: cat.shards
component: endpoints
-->
## Endpoints
```json
GET /_cat/shards
GET /_cat/shards/{index}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.shards
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, `p` | N/A |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/). <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, `d` | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example requests

The following example requests returns information about shards:

```
GET _cat/shards?v
```
{% include copy-curl.html %}

To see only the information about shards of a specific index, add the index name after your query.

```
GET _cat/shards/<index>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index, separate the indexes with commas:

```
GET _cat/shards/index1,index2,index3
```
{% include copy-curl.html %}

## Example response

```json
index | shard | prirep | state   | docs | store | ip |       | node
plugins | 0   |   p    | STARTED |   0  |  208b | 172.18.0.4 | odfe-node1
plugins | 0   |   r    | STARTED |   0  |  208b | 172.18.0.3 |  odfe-node2          
```

## Limiting the response size

To limit the number of shards returned, configure the `cat.shards.response.limit.number_of_shards` setting. For more information, see [Cluster-level CAT response limit settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-cat-response-limit-settings).