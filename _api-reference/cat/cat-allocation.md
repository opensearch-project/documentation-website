---
layout: default
title: CAT allocation
parent: CAT API
redirect_from:
- /opensearch/rest-api/cat/cat-allocation/
nav_order: 5
has_children: false
---

# CAT allocation
**Introduced 1.0**
{: .label .label-purple }

The CAT allocation operation lists the allocation of disk space for indexes and the number of shards on each node.



## Endpoints

```json
GET /_cat/allocation
GET /_cat/allocation/{node_id}
```

## Query parameters
Parameter | Type | Description
:--- | :--- | :---
`bytes` | String | The unit used to display byte values.
`cluster_manager_timeout` | String | Operation timeout for connection to cluster-manager node.
`format` | String | A short version of the Accept header (for example, `json`, `yaml`).
`h` | List | Comma-separated list of column names to display.
`help` | Boolean | Return help information.
`local` | Boolean | Return local information, do not retrieve the state from cluster-manager node.
`s` | List | Comma-separated list of column names or column aliases to sort by.
`v` | Boolean | Verbose mode. Display column headers.
`master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Operation timeout for connection to cluster-manager node.
<!-- spec_insert_end -->

## Example requests

```json
GET _cat/allocation?v
```
{% include copy-curl.html %}

To limit the information to a specific node, add the node name after your query:

```json
GET _cat/allocation/<node_name>
```
{% include copy-curl.html %}

If you want to get information for more than one node, separate the node names with commas:

```json
GET _cat/allocation/node_name_1,node_name_2,node_name_3
```
{% include copy-curl.html %}

## Example response

The following response shows that eight shards are allocated to each of the two nodes available:

```json
shards | disk.indices | disk.used | disk.avail | disk.total | disk.percent host | ip          | node
  8    |   989.4kb    |   25.9gb  |   32.4gb   |   58.4gb   |   44 172.18.0.4   | 172.18.0.4  | odfe-node1
  8    |   962.4kb    |   25.9gb  |   32.4gb   |   58.4gb   |   44 172.18.0.3   | 172.18.0.3  | odfe-node2
```
