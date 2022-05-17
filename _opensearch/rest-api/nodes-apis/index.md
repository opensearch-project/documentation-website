---
layout: default
title: Nodes APIs
parent: REST API reference
has_children: true
nav_order: 5
---

# Nodes APIs

The nodes API makes it possible to retrieve information about individual cluster nodes.

---

Many nodes APIs support common parameters like `{timeout}`, and `{node-filters}`.

## Timeout

The `{timeout}` parameter can be used to change the default time limit for node response.

Parameter | Type      | Description
:--- |:----------| :---
`{timeout}` | TimeValue | Default value is `30s`.

## Node filters

The `{node-filters}` parameter can be used to filter target set of nodes that will be included in the response.

Parameter | Type   | Description
:--- |:-------| :---
<code><nobr>{node-filters} | String | A comma-separated list of resolution mechanisms that OpenSearch uses to identify cluster nodes.

Node filters support several node resolution mechanisms:

- pre-defined constants: `_local`, `_cluster_manager` (or deprecated `_master`) or `_all`
- exact match for `nodeID`
- a simple case-sensitive wildcard pattern matching for: `node-name`, `host-name` or `host-IP-address`
- node roles (where `<bool>` value is set either to `true` or `false`):
  - `cluster_manager:<bool>` (or deprecated `master:<bool>`)
  - `data:<bool>`
  - `ingest:<bool>`
  - `voting_only:<bool>`
  - `ml:<bool>`
  - `coordinating_only:<bool>`
- a simple case-sensitive wildcard pattern matching for node attributes: <br>`<node attribute*>:<attribute value*>` (the wildcard matching pattern can be used in both the key and value at the same time)

The resolution mechanisms are applied sequentially in the order specified by the client and each mechanism specification may either add or remove nodes.

### Example

Get statistics from elected cluster-manager node only:
```text
GET /_nodes/_cluster_manager/stats
```

Get statistics from nodes that are data-only nodes:
```text
GET /_nodes/data:true/stats
```
#### Order of resolution mechanisms matters

The order of resolution mechanisms is applied sequentially and each can add or remove nodes, this means that the following two examples yield different results.

Get statistics from all the nodes but the cluster-manager node:
```text
GET /_nodes/_all,cluster_namager:false/stats
```

However, if we switch the resolution mechanisms then the result will include all the cluster nodes including the cluster manager node. 
```text
GET /_nodes/cluster_namager:false,_all/stats
```