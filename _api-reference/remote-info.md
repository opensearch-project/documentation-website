---
layout: default
title: Remote cluster information
nav_order: 67
redirect_from: 
 - /opensearch/rest-api/remote-info/
---

# Remote cluster information
**Introduced 1.0**
{: .label .label-purple }

This operation provides connection information for any remote OpenSearch clusters that you've configured for the local cluster, such as the remote cluster alias, connection mode (`sniff` or `proxy`), IP addresses for seed nodes, and timeout settings.

The response is more comprehensive and useful than a call to `_cluster/settings`, which only includes the cluster alias and seed nodes.


## Path and HTTP methods

```
GET _remote/info
```
{% include copy-curl.html %}

## Response

```json
{
  "opensearch-cluster2": {
    "connected": true,
    "mode": "sniff",
    "seeds": [
      "172.28.0.2:9300"
    ],
    "num_nodes_connected": 1,
    "max_connections_per_cluster": 3,
    "initial_connect_timeout": "30s",
    "skip_unavailable": false
  }
}
```
