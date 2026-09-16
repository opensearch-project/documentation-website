---
layout: default
title: Tenant APIs
parent: Security APIs
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /security/api/tenants/
---

# Tenant APIs

The tenant APIs create, retrieve, modify, and delete the tenants that isolate OpenSearch Dashboards resources between groups of users.

OpenSearch supports the following tenant APIs.

| API | Description |
| :--- | :--- |
| [Create or Update Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/create-tenant/) | Creates or replaces the specified tenant. |
| [Patch Tenants API]({{site.url}}{{site.baseurl}}/security/api/tenants/patch-tenants/) | Updates individual attributes of one tenant, or adds, deletes, or modifies multiple tenants in a single call. |
| [Get Tenants API]({{site.url}}{{site.baseurl}}/security/api/tenants/get-tenants/) | Retrieves one tenant or all tenants. |
| [Delete Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/delete-tenant/) | Deletes the specified tenant. |
