---
layout: default
title: Get distinguished names
parent: Distinguished name APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Distinguished Names API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the distinguished names in the allow list. Specify a cluster name to retrieve the distinguished names for one cluster or node, or omit the cluster name to retrieve them for all clusters and nodes.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.get_distinguished_names
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/nodesdn
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.get_distinguished_name
component: endpoints
omit_header: true
-->
```json
GET /_plugins/_security/api/nodesdn/{cluster_name}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `cluster_name` | String | No | The name of the cluster whose node distinguished names you want to retrieve. If omitted, the distinguished names for all clusters and nodes are returned. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `show_all` | Boolean | Whether to include the statically configured node distinguished names in the response. |

## Example request

The following request retrieves the distinguished names for all clusters and nodes:

```json
GET _plugins/_security/api/nodesdn
```
{% include copy-curl.html security=true %}

The following request retrieves the distinguished names for the `cluster3` cluster:

```json
GET _plugins/_security/api/nodesdn/cluster3
```
{% include copy-curl.html security=true %}

## Example response

The response to a request for all clusters and nodes contains one entry per cluster:

```json
{
  "cluster1": {
    "nodes_dn": [
      "CN=cluster1.example.com"
    ]
  }
}
```

When you retrieve the distinguished names for one cluster, the response contains only that cluster:

```json
{
  "cluster3": {
    "nodes_dn": [
      "CN=cluster3.example.com"
    ]
  }
}
```
