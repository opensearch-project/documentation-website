---
layout: default
title: Create or update distinguished name
parent: Distinguished name APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Distinguished Name API
**Introduced 1.0**
{: .label .label-purple }

Adds or updates the specified distinguished names in the cluster's or node's allow list.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

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
PUT _plugins/_security/api/nodesdn/cluster1
{
  "nodes_dn": [
    "CN=cluster1.example.com"
  ]
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "CREATED",
  "message": "'cluster1' created."
}
```
