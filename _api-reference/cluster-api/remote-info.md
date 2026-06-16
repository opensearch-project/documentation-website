---
layout: default
title: Remote cluster information
parent: Cluster APIs
nav_order: 67
redirect_from: 
 - /opensearch/rest-api/remote-info/
 - /api-reference/remote-info/
---

# Remote Cluster Information API
**Introduced 1.0**
{: .label .label-purple }

The Remote Cluster Information API retrieves connection details for all remote OpenSearch clusters configured on the local cluster. Use this API to verify connectivity status, inspect connection modes (`sniff` or `proxy`), and review timeout settings for cross-cluster search configurations.

The response provides more detail than a call to `_cluster/settings`, which only returns the cluster alias and seed node addresses. This API additionally reports the active connection count, connection mode, and whether unavailable clusters are skipped during cross-cluster searches.

<!-- spec_insert_start
api: cluster.remote_info
component: endpoints
-->
## Endpoints
```json
GET /_remote/info
```
<!-- spec_insert_end -->

## Example request

The following example retrieves information about all configured remote clusters:

<!-- spec_insert_start
component: example_code
rest: GET /_remote/info
-->
{% capture step1_rest %}
GET /_remote/info
{% endcapture %}

{% capture step1_python %}

response = client.cluster.remote_info()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

When no remote clusters are configured, the response is an empty object:

```json
{ }
```

When one or more remote clusters are configured in `sniff` mode, the response includes connection details keyed by the cluster alias:

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

When a remote cluster is configured in `proxy` mode, the response includes proxy-specific fields instead of seed node information:

```json
{
  "opensearch-cluster3": {
    "connected": true,
    "mode": "proxy",
    "proxy_address": "192.168.1.50:9443",
    "num_proxy_sockets_connected": 5,
    "max_proxy_socket_connections": 18,
    "initial_connect_timeout": "30s",
    "skip_unavailable": true
  }
}
```

## Response body fields

The response is a JSON object where each key is a remote cluster alias. The following table describes the fields within each cluster entry.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `connected` | Boolean | Indicates whether at least one active connection exists to the remote cluster. |
| `mode` | String | The connection mode configured for the remote cluster. Valid values are `sniff` (discovers nodes through seed addresses) and `proxy` (routes all requests through a single proxy address). |
| `initial_connect_timeout` | String | The timeout duration for establishing the initial connection to the remote cluster. |
| `skip_unavailable` | Boolean | Indicates whether the remote cluster is skipped when it is unreachable during a cross-cluster search request. When `true`, the search returns results from available clusters only. When `false`, the entire search request fails if this cluster is unavailable. |

The following fields appear only when `mode` is `sniff`.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `seeds` | Array of strings | The initial seed transport addresses used to discover nodes in the remote cluster. |
| `num_nodes_connected` | Integer | The number of nodes in the remote cluster to which the local cluster currently has open connections. |
| `max_connections_per_cluster` | Integer | The maximum number of connections the local cluster maintains to the remote cluster. |

The following fields appear only when `mode` is `proxy`.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `proxy_address` | String | The address (host and port) through which all connections to the remote cluster are routed. |
| `num_proxy_sockets_connected` | Integer | The number of socket connections currently open to the proxy address. |
| `max_proxy_socket_connections` | Integer | The maximum number of socket connections allowed to the proxy address. |
