---
layout: default
title: Health API
parent: Cluster Utility APIs
grand_parent: Security APIs
nav_order: 10
---

# Health API
**Introduced 1.0**
{: .label .label-purple }

Checks to see if the Security plugin is up and running. If you operate your cluster behind a load balancer, this operation is useful for determining node health and doesn't require a signed request.

<!-- spec_insert_start
api: security.health
component: endpoints
-->
## Endpoints
```json
GET  /_plugins/_security/health
POST /_plugins/_security/health
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/health
```
{% include copy-curl.html %}


## Example response

```json
{
  "message": null,
  "mode": "strict",
  "status": "UP"
}
```


---
