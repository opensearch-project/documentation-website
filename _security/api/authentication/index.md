---
layout: default
title: Authentication APIs
parent: Security APIs
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /api-reference/security/authentication/
  - /api-reference/security/authentication/index/
  - /security/api/authentication/
---

# Authentication APIs

The authentication APIs return information about the authenticated user, the permissions granted to that user, and the TLS connection used to make the request.

OpenSearch supports the following authentication APIs.

| API | Description |
| :--- | :--- |
| [Authentication Information API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-info/) | Returns the name, roles, backend roles, custom attributes, and tenant memberships of the currently authenticated user. |
| [Who Am I API]({{site.url}}{{site.baseurl}}/security/api/authentication/who-am-i/) | Returns the identity information of the currently authenticated user. |
| [Who Am I Protected API]({{site.url}}{{site.baseurl}}/security/api/authentication/who-am-i-protected/) | Returns the identity information of the currently authenticated user and enforces REST layer authorization. |
| [Permissions Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/permissions-info/) | Returns the evaluated REST API permissions of the currently authenticated user. |
| [SSL Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/ssl-info/) | Returns information about the TLS connection and the certificates used for the request. |
| [Authorization Token API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-token/) | Returns an `OK` status with an empty message. This endpoint does not issue a token. |
| [Generate On-Behalf-Of Token API]({{site.url}}{{site.baseurl}}/security/api/authentication/generate-obo-token/) | Generates an On-Behalf-Of token that allows a service to act for the currently authenticated user. |
