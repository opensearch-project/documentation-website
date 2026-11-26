---
layout: default
title: Flush cache
parent: Security APIs
nav_order: 150
redirect_from:
  - /security/api/cache/
  - /security/api/cache/flush-cache/
---

# Flush Cache API
**Introduced 1.0**
{: .label .label-purple }

Flushes the Security plugin user, authentication, and authorization cache.

`DELETE` is the only supported method. `GET`, `PUT`, and `POST` requests to `_plugins/_security/api/cache` return a `405` error that names `DELETE` as the allowed method.

<!-- spec_insert_start
api: security.flush_cache
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/cache
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/cache
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "Cache flushed successfully."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. `OK` indicates that OpenSearch flushed the cache. |
| `message` | String | A message confirming that OpenSearch flushed the cache. |
