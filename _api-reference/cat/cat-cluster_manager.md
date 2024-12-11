---
layout: default
title: CAT cluster manager
parent: CAT API
redirect_from:
 - /opensearch/rest-api/cat/cat-master/
nav_order: 30
has_children: false
---

# CAT cluster_manager
**Introduced 1.0**
{: .label .label-purple }

The CAT cluster manager operation lists information that helps identify the elected cluster manager node.


<!-- spec_insert_start
api: cat.cluster_manager
component: paths_and_http_methods
-->
## Paths and HTTP methods
```json
GET /_cat/cluster_manager
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cat.cluster_manager
component: query_parameters
-->
## Query parameters
Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | String | Operation timeout for connection to cluster-manager node.
`format` | String | A short version of the Accept header (for example, `json`, `yaml`).
`h` | List | Comma-separated list of column names to display.
`help` | Boolean | Return help information.
`local` | Boolean | Return local information, do not retrieve the state from cluster-manager node.
`s` | List | Comma-separated list of column names or column aliases to sort by.
`v` | Boolean | Verbose mode. Display column headers.
`master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Operation timeout for connection to cluster-manager node.
<!-- spec_insert_end -->

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.

## Example requests

```
GET _cat/cluster_manager?v
```
{% include copy-curl.html %}

## Example response

```json
id                     |   host     |     ip     |   node
ZaIkkUd4TEiAihqJGkp5CA | 172.18.0.3 | 172.18.0.3 | opensearch-node2
```
