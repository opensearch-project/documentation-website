---
layout: default
title: Delete distinguished name
parent: Distinguished name APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete Distinguished Name API
**Introduced 1.0**
{: .label .label-purple }

Deletes all distinguished names in the specified cluster's or node's allow list.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.delete_distinguished_name
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/nodesdn/{cluster_name}
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/nodesdn/cluster1
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'cluster1' deleted."
}
```
