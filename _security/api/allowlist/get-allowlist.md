---
layout: default
title: Get allow list
parent: Allow list APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Allow List API
**Introduced 2.1**
{: .label .label-purple }

Retrieves the current allow list configuration.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

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
{% include copy-curl.html security=true %}

## Example response

```json
{
  "config": {
    "enabled": true,
    "requests": {
      "/_cat/nodes": [
        "GET"
      ],
      "/_cat/indices": [
        "GET"
      ],
      "/_plugins/_security/whoami": [
        "GET"
      ]
    }
  }
}
```
