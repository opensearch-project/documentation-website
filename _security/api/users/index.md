---
layout: default
title: Internal user APIs
parent: Security APIs
nav_order: 30
has_children: true
has_toc: false
redirect_from:
  - /security/api/users/
---

# Internal user APIs

The internal user APIs create, retrieve, modify, and delete users in the internal user database. If you use an external authentication backend, you probably don't need to worry about internal users.

OpenSearch supports the following internal user APIs.

| API | Description |
| :--- | :--- |
| [Create or Update User API]({{site.url}}{{site.baseurl}}/security/api/users/create-user/) | Creates or replaces the specified internal user. |
| [Patch Users API]({{site.url}}{{site.baseurl}}/security/api/users/patch-users/) | Updates individual attributes of one internal user, or creates, updates, or deletes multiple internal users in a single call. |
| [Get Users API]({{site.url}}{{site.baseurl}}/security/api/users/get-users/) | Retrieves one internal user or all internal users. |
| [Delete User API]({{site.url}}{{site.baseurl}}/security/api/users/delete-user/) | Deletes the specified internal user. |
| [Generate User Token API]({{site.url}}{{site.baseurl}}/security/api/users/generate-user-token/) | Generates an authorization token for the specified internal user. |

## Legacy endpoints

The `_plugins/_security/api/user` endpoints are deprecated aliases of the `_plugins/_security/api/internalusers` endpoints documented in this section. Use the `internalusers` endpoints in new code.
