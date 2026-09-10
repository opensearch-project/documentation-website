---
layout: default
title: Role Mapping APIs
parent: Security APIs
nav_order: 50
has_children: true
has_toc: false
redirect_from:
  - /security/api/role-mappings/
---

# Role Mapping APIs

The Role Mapping APIs map users, backend roles, and hosts to security roles.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/get-role-mapping/) | GET | `/_plugins/_security/api/rolesmapping/{role}` |
| [Get Role Mappings API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/get-role-mappings/) | GET | `/_plugins/_security/api/rolesmapping` |
| [Create Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/create-role-mapping/) | PUT | `/_plugins/_security/api/rolesmapping/{role}` |
| [Patch Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/patch-role-mapping/) | PATCH | `/_plugins/_security/api/rolesmapping/{role}` |
| [Patch Role Mappings API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/patch-role-mappings/) | PATCH | `/_plugins/_security/api/rolesmapping` |
| [Delete Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/delete-role-mapping/) | DELETE | `/_plugins/_security/api/rolesmapping/{role}` |
