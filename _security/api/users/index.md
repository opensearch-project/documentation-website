---
layout: default
title: Internal User APIs
parent: Security APIs
nav_order: 30
has_children: true
has_toc: false
redirect_from:
  - /security/api/users/
---

# Internal User APIs

The Internal User APIs create, retrieve, modify, and delete users in the internal user database. If you use an external authentication backend, you probably don't need to worry about internal users.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get User API]({{site.url}}{{site.baseurl}}/security/api/users/get-user/) | GET | `/_plugins/_security/api/internalusers/{username}` |
| [Get Users API]({{site.url}}{{site.baseurl}}/security/api/users/get-users/) | GET | `/_plugins/_security/api/internalusers` |
| [Create User API]({{site.url}}{{site.baseurl}}/security/api/users/create-user/) | PUT | `/_plugins/_security/api/internalusers/{username}` |
| [Patch User API]({{site.url}}{{site.baseurl}}/security/api/users/patch-user/) | PATCH | `/_plugins/_security/api/internalusers/{username}` |
| [Patch Users API]({{site.url}}{{site.baseurl}}/security/api/users/patch-users/) | PATCH | `/_plugins/_security/api/internalusers` |
| [Delete User API]({{site.url}}{{site.baseurl}}/security/api/users/delete-user/) | DELETE | `/_plugins/_security/api/internalusers/{username}` |
| [Generate User Token API]({{site.url}}{{site.baseurl}}/security/api/users/generate-user-token/) | POST | `/_plugins/_security/api/internalusers/{username}/authtoken` |

## Legacy endpoints

The `_plugins/_security/api/user` endpoints are deprecated aliases of the `_plugins/_security/api/internalusers` endpoints documented in this section. Use the `internalusers` endpoints in new code.
