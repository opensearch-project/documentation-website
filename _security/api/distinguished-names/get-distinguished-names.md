---
layout: default
title: Get Distinguished Names API
parent: Distinguished Name APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Distinguished Names API
**Introduced 1.0**
{: .label .label-purple }

Retrieves all distinguished names in the allow list.

<!-- spec_insert_start
api: security.get_distinguished_names
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/nodesdn
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/nodesdn
```
{% include copy-curl.html %}

## Example response

```json
{
  "cluster1": {
    "nodes_dn": [
      "CN=cluster1.example.com"
    ]
  }
}
```

To get the distinguished names from a specific cluster's or node's allow list, include the cluster's name in the request path.

## Example request

```json
GET _plugins/_security/api/nodesdn/{cluster-name}
```
{% include copy-curl.html %}

## Example response

```json
{
  "cluster3": {
    "nodes_dn": [
      "CN=cluster3.example.com"
    ]
  }
}
```
