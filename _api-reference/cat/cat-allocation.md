---
layout: default
title: CAT allocation
parent: CAT API
redirect_from:
- /opensearch/rest-api/cat/cat-allocation/
nav_order: 5
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-allocation/
---

# CAT allocation
**Introduced 1.0**
{: .label .label-purple }

The CAT allocation operation lists the allocation of disk space for indexes and the number of shards on each node.


## Path and HTTP methods

```json
GET _cat/allocation?v
GET _cat/allocation/<node_name>
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.

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
