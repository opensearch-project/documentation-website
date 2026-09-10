---
layout: default
title: Patch Allow List API
parent: Allow List APIs
grand_parent: Security APIs
nav_order: 30
---

# Patch Allow List API
**Introduced 2.1**
{: .label .label-purple }

Updates an allow list configuration.

<!-- spec_insert_start
api: security.patch_allowlist
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/allowlist
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/allowlist
[
  {
    "op": "add",
    "path": "/config/requests",
    "value": {
      "/_cat/nodes": ["POST"]
    }
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status":"OK",
  "message":"Resource updated."
}
```

---
