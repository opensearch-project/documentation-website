---
layout: default
title: Flush Cache API
parent: Cache APIs
grand_parent: Security APIs
nav_order: 10
---

# Flush Cache API
**Introduced 1.0**
{: .label .label-purple }

Flushes the Security plugin user, authentication, and authorization cache.

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
{% include copy-curl.html %}


## Example response

```json
{
  "status": "OK",
  "message": "Cache flushed successfully."
}
```


---
