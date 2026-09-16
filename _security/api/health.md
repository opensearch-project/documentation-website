---
layout: default
title: Security plugin health
parent: Security APIs
nav_order: 170
---

# Security Plugin Health API
**Introduced 1.0**
{: .label .label-purple }

Checks whether the Security plugin is up and running. This operation does not require a signed request, so you can use it as the health check for a load balancer that fronts the cluster.

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
{% include copy-curl.html security=true %}

## Example response

```json
{
  "message": null,
  "mode": "strict",
  "status": "UP",
  "settings": {
    "plugins.security.cache.ttl_minutes": 60
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the Security plugin. `UP` indicates that the plugin is initialized and ready to authorize requests. |
| `mode` | String | The operating mode of the plugin. A cluster that enforces authentication and authorization returns `strict`. |
| `message` | String | Additional information about the status, or `null` when the plugin is running normally. |
| `settings` | Object | The Security plugin settings that are reported with the health check. |
