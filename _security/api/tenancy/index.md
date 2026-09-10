---
layout: default
title: Tenancy Configuration APIs
parent: Security APIs
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /security/api/tenancy/
---

# Tenancy Configuration APIs

The Tenancy Configuration APIs manage multi-tenancy settings and return information about the tenants available to the current user.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Tenancy Configuration API]({{site.url}}{{site.baseurl}}/security/api/tenancy/get-tenancy-config/) | GET | `/_plugins/_security/api/tenancy/config` |
| [Update Tenancy Configuration API]({{site.url}}{{site.baseurl}}/security/api/tenancy/update-tenancy-config/) | PUT | `/_plugins/_security/api/tenancy/config` |
| [Tenant Info API]({{site.url}}{{site.baseurl}}/security/api/tenancy/tenant-info/) | GET/POST | `/_plugins/_security/tenantinfo` |
