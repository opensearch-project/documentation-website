---
layout: default
title: Tenant APIs
parent: Security APIs
nav_order: 70
has_children: true
has_toc: false
redirect_from:
  - /security/api/tenants/
---

# Tenant APIs

The Tenant APIs create, retrieve, modify, and delete the tenants that isolate OpenSearch Dashboards resources between groups of users.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/get-tenant/) | GET | `/_plugins/_security/api/tenants/{tenant}` |
| [Get Tenants API]({{site.url}}{{site.baseurl}}/security/api/tenants/get-tenants/) | GET | `/_plugins/_security/api/tenants` |
| [Create Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/create-tenant/) | PUT | `/_plugins/_security/api/tenants/{tenant}` |
| [Patch Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/patch-tenant/) | PATCH | `/_plugins/_security/api/tenants/{tenant}` |
| [Patch Tenants API]({{site.url}}{{site.baseurl}}/security/api/tenants/patch-tenants/) | PATCH | `/_plugins/_security/api/tenants` |
| [Delete Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/delete-tenant/) | DELETE | `/_plugins/_security/api/tenants/{tenant}` |
