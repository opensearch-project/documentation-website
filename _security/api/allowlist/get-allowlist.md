---
layout: default
title: Get Allow List API
parent: Allow List APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Allow List API
**Introduced 2.1**
{: .label .label-purple }

Retrieves the current allow list configuration.

<!-- spec_insert_start
api: security.get_allowlist
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/allowlist
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/allowlist
```
{% include copy-curl.html %}

## Example response

```json
{
  "config" : {
    "enabled" : true,
    "requests" : {
      "/_cat/nodes" : [
        "GET"
      ],
      "/_cat/indices" : [
        "GET"
      ],
      "/_plugins/_security/whoami" : [
        "GET"
      ]
    }
  }
}
```
