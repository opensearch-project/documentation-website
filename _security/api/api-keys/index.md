---
layout: default
title: API key APIs
parent: Security APIs
nav_order: 70
has_children: true
has_toc: false
redirect_from:
  - /api-reference/security/api-keys/
  - /api-reference/security/api-keys/index/
  - /security/api/api-keys/
---

# API key APIs
**Introduced 3.7**
{: .label .label-purple }

The API key APIs create, list, and revoke the API keys used to authenticate requests without a user name and password.

OpenSearch supports the following API key APIs.

| API | Description |
| :--- | :--- |
| [Create API Key API]({{site.url}}{{site.baseurl}}/security/api/api-keys/create/) | Creates an API key with the specified permissions and expiration. |
| [List API Keys API]({{site.url}}{{site.baseurl}}/security/api/api-keys/list/) | Returns all API keys, including active, expired, and revoked keys. |
| [Revoke API Key API]({{site.url}}{{site.baseurl}}/security/api/api-keys/revoke/) | Revokes an API key, making it immediately unusable for authentication. |

## Required permissions

To use the API key APIs, you must have the `cluster:admin/plugins/security/api_token` permission.
