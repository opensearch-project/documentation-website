---
layout: default
title: Update Distinguished Name API
parent: Distinguished Name APIs
grand_parent: Security APIs
nav_order: 30
---

# Update Distinguished Name API
**Introduced 1.0**
{: .label .label-purple }

Adds or updates the specified distinguished names in the cluster's or node's allow list.

<!-- spec_insert_start
api: security.update_distinguished_name
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/nodesdn/{cluster_name}
```
<!-- spec_insert_end -->

## Example request

```json
PUT _plugins/_security/api/nodesdn/{cluster-name}
{
  "nodes_dn": [
    "CN=cluster3.example.com"
  ]
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "CREATED",
  "message": "'cluster3' created."
}
```
