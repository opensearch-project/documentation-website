---
layout: default
title: Authentication APIs
parent: Security APIs
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /api-reference/security/authentication/
  - /security/api/authentication/
---

# Authentication APIs

The Authentication APIs return information about the authenticated user, the permissions granted to that user, and the TLS connection used to make the request.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Authentication Information API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-info/) | GET/POST | `/_plugins/_security/authinfo` |
| [Who Am I API]({{site.url}}{{site.baseurl}}/security/api/authentication/who-am-i/) | GET/POST | `/_plugins/_security/whoami` |
| [Who Am I Protected API]({{site.url}}{{site.baseurl}}/security/api/authentication/who-am-i-protected/) | GET | `/_plugins/_security/whoamiprotected` |
| [Permissions Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/permissions-info/) | GET | `/_plugins/_security/api/permissionsinfo` |
| [SSL Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/ssl-info/) | GET | `/_opendistro/_security/sslinfo` |
| [Auth Token API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-token/) | POST | `/_plugins/_security/api/authtoken` |
| [Generate On-Behalf-Of Token API]({{site.url}}{{site.baseurl}}/security/api/authentication/generate-obo-token/) | POST | `/_plugins/_security/api/generateonbehalfoftoken` |
