---
layout: default
title: Role APIs
parent: Security APIs
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /security/api/roles/
---

# Role APIs

The Role APIs create, retrieve, modify, and delete the roles that define cluster, index, and document permissions.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Role API]({{site.url}}{{site.baseurl}}/security/api/roles/get-role/) | GET | `/_plugins/_security/api/roles/{role}` |
| [Get Roles API]({{site.url}}{{site.baseurl}}/security/api/roles/get-roles/) | GET | `/_plugins/_security/api/roles` |
| [Create Role API]({{site.url}}{{site.baseurl}}/security/api/roles/create-role/) | PUT | `/_plugins/_security/api/roles/{role}` |
| [Patch Role API]({{site.url}}{{site.baseurl}}/security/api/roles/patch-role/) | PATCH | `/_plugins/_security/api/roles/{role}` |
| [Patch Roles API]({{site.url}}{{site.baseurl}}/security/api/roles/patch-roles/) | PATCH | `/_plugins/_security/api/roles` |
| [Delete Role API]({{site.url}}{{site.baseurl}}/security/api/roles/delete-role/) | DELETE | `/_plugins/_security/api/roles/{role}` |
