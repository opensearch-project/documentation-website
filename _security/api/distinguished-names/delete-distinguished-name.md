---
layout: default
title: Delete Distinguished Name API
parent: Distinguished Name APIs
grand_parent: Security APIs
nav_order: 60
---

# Delete Distinguished Name API
**Introduced 1.0**
{: .label .label-purple }

Deletes all distinguished names in the specified cluster's or node's allow list.

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
DELETE _plugins/_security/api/nodesdn/{cluster-name}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "'cluster3' deleted."
}
```


---
