---
layout: default
title: Cache APIs
parent: Security APIs
nav_order: 140
has_children: true
has_toc: false
redirect_from:
  - /security/api/cache/
---

# Cache APIs

The Cache APIs flush the Security plugin's user, authentication, and authorization caches.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Flush Cache API]({{site.url}}{{site.baseurl}}/security/api/cache/flush-cache/) | DELETE | `/_plugins/_security/api/cache` |

## Unsupported methods

`GET`, `PUT`, and `POST` requests to `_plugins/_security/api/cache` are not supported and return a `405` error. `DELETE` is the only supported method.
