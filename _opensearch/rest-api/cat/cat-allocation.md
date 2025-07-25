---
layout: default
title: cat allocation
parent: CAT
grand_parent: REST API reference
nav_order: 5
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-allocation/
---

# cat allocation
Introduced 1.0
{: .label .label-purple }

The cat allocation operation lists the allocation of disk space for indices and the number of shards on each node.

## Example

```json
GET _cat/allocation?v
```

To limit the information to a specific node, add the node name after your query:

```json
GET _cat/allocation/<node_name>
```

If you want to get information for more than one node, separate the node names with commas:

```json
GET _cat/aliases/node_name_1,node_name_2,node_name_3
```

## Path and HTTP methods

```
GET _cat/allocation?v
GET _cat/allocation/<node_name>
```

## URL parameters

All cat allocation URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.



## Response

The following response shows that 8 shards are allocated to each the two nodes available:

```json
shards | disk.indices | disk.used | disk.avail | disk.total | disk.percent host | ip          | node
  8    |   989.4kb    |   25.9gb  |   32.4gb   |   58.4gb   |   44 172.18.0.4   | 172.18.0.4  | odfe-node1
  8    |   962.4kb    |   25.9gb  |   32.4gb   |   58.4gb   |   44 172.18.0.3   | 172.18.0.3  | odfe-node2
```
