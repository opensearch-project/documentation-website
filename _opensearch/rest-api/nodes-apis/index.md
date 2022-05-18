---
layout: default
title: Nodes APIs
parent: REST API reference
has_children: true
nav_order: 5
---

# Nodes APIs

The nodes API makes it possible to retrieve information about individual nodes within your cluster. It supports standard parameters such `{timeout}` and `{node-filters}`.

## Timeout

The `{timeout}` parameter can be used to change the default time limit for node response.

Parameter | Type      | Description
:--- |:----------| :---
`{timeout}` | TimeValue | Default value is `30s`.

## Node filters

Use the `{node-filters}` parameter to filter the target set of nodes in the API response.

Parameter | Type   | Description
:--- |:-------| :---
{node-filters} | String | A comma-separated list of resolution mechanisms that OpenSearch uses to identify cluster nodes.

Node filters support several node resolution mechanisms:

- Pre-defined constants: `_local`, `_cluster_manager`, or `_all`
- Exact match for `nodeID`
- A simple case-sensitive wildcard pattern matching for `node-name`, `host-name`, or `host-IP-address`
- Node roles where the `<bool>` value is set either to `true` or `false`):
  - `cluster_manager:<bool>` 
  - `data:<bool>`
  - `ingest:<bool>`
  - `voting_only:<bool>`
  - `ml:<bool>`
  - `coordinating_only:<bool>`
- A simple case-sensitive wildcard pattern matching for node attributes: `<node attribute*>:<attribute value*>`. The wildcard matching pattern can be used in both the key and value at the same time.

Resolution mechanisms are applied sequentially in the order specified by the client. Each mechanism specification can either add or remove nodes.

If you want to get statistics from the elected cluster-manager node only, use:

```bash
GET /_nodes/_cluster_manager/stats
```

If you want to get statistics from nodes that are data-only nodes, use:

```bash
GET /_nodes/data:true/stats
```

### Order of resolution mechanisms

The order of resolution mechanisms is applied sequentially, and each can add or remove nodes. The following examples means yield different results:

If you want to get statistics from all the nodes but the cluster-manager node, use:

```bash
GET /_nodes/_all,cluster_namager:false/stats
```

However, if we switch the resolution mechanisms, then the result will include all the cluster nodes including the cluster manager node. 

```bash
GET /_nodes/cluster_namager:false,_all/stats
```