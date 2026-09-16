---
layout: default
title: Multi-tenancy configuration APIs
parent: Security APIs
nav_order: 90
has_children: true
has_toc: false
redirect_from:
  - /security/api/tenancy/
---

# Multi-tenancy configuration APIs

The multi-tenancy configuration APIs configure multi-tenancy for OpenSearch Dashboards and return information about the tenants available to the current user.

OpenSearch supports the following multi-tenancy configuration APIs.

| API | Description |
| :--- | :--- |
| [Create or Update Multi-Tenancy Configuration API]({{site.url}}{{site.baseurl}}/security/api/tenancy/update-tenancy-config/) | Creates or replaces the multi-tenancy configuration. |
| [Get Multi-Tenancy Configuration API]({{site.url}}{{site.baseurl}}/security/api/tenancy/get-tenancy-config/) | Retrieves the multi-tenancy configuration. |
| [Tenant Info API]({{site.url}}{{site.baseurl}}/security/api/tenancy/tenant-info/) | Returns the index names that back the current tenants. |
