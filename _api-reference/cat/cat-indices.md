---
layout: default
title: CAT indices
parent: CAT API
nav_order: 25
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-indices/
---

# CAT indices
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
columns: Parameter,Type,Description,Default
include_deprecated: false
-->
## Query parameters



Parameter | Type | Description | Default
:--- | :--- | :--- | :---
`bytes` | String | The units used to display byte values. | 
`cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | 
`expand_wildcards` | List or String | The type of index that wildcard patterns can match. | 
`format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | 
`h` | List | A comma-separated list of column names to display. | 
`health` | String | Limits indexes based on their health status. Supported values are `green`, `yellow`, and `red`. | 
`help` | Boolean | Return help information. | `false`
`include_unloaded_segments` | Boolean | Whether to include information from segments not loaded into memory. | `false`
`local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false`
`pri` | Boolean | When `true`, returns information only from the primary shards. | `false`
`s` | List | A comma-separated list of column names or column aliases to sort by. | 
`time` | String | Specifies the time units. | 
`v` | Boolean | Enables verbose mode, which displays column headers. | `false`
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