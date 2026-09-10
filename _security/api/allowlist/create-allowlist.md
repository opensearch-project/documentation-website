---
layout: default
title: Create Allow List API
parent: Allow List APIs
grand_parent: Security APIs
nav_order: 20
---

# Create Allow List API
**Introduced 2.1**
{: .label .label-purple }

Creates an allow list configuration.

<!-- spec_insert_start
api: security.create_allowlist
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/allowlist
```
<!-- spec_insert_end -->

## Example request

```json
PUT _plugins/_security/api/allowlist
{
  "enabled": true,
  "requests": {
    "/_cat/nodes": ["GET"],
    "/_cat/indices": ["GET"],
    "/_plugins/_security/whoami": ["GET"]
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status":"OK",
  "message":"'config' updated."
}
```
