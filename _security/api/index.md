---
layout: default
title: Security APIs
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /security/api/
  - /api-reference/security/
  - /api-reference/security-apis/
---

# Security APIs

The Security APIs configure and inspect the Security plugin over REST. Use them to manage users, roles, role mappings, action groups, and tenants; to read and replace the security configuration; and to inspect certificates, caches, and plugin health.

Most of these APIs read from and write to the security configuration index, so access to them is restricted. For information about who can call them and how to authenticate as an administrator, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/).

## API groups

| Group | Description |
| :--- | :--- |
| [Authentication APIs]({{site.url}}{{site.baseurl}}/security/api/authentication/) | The Authentication APIs return information about the authenticated user, the permissions granted to that user, and the TLS connection used to make the request. |
| [Account APIs]({{site.url}}{{site.baseurl}}/security/api/account/) | The Account APIs return and modify the details of the currently authenticated user's own account. |
| [Internal User APIs]({{site.url}}{{site.baseurl}}/security/api/users/) | The Internal User APIs create, retrieve, modify, and delete users in the internal user database. |
| [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/) | The Role APIs create, retrieve, modify, and delete the roles that define cluster, index, and document permissions. |
| [Role Mapping APIs]({{site.url}}{{site.baseurl}}/security/api/role-mappings/) | The Role Mapping APIs map users, backend roles, and hosts to security roles. |
| [Action Group APIs]({{site.url}}{{site.baseurl}}/security/api/action-groups/) | The Action Group APIs create, retrieve, modify, and delete action groups, which are reusable collections of permissions. |
| [Tenant APIs]({{site.url}}{{site.baseurl}}/security/api/tenants/) | The Tenant APIs create, retrieve, modify, and delete the tenants that isolate OpenSearch Dashboards resources between groups of users. |
| [Tenancy Configuration APIs]({{site.url}}{{site.baseurl}}/security/api/tenancy/) | The Tenancy Configuration APIs manage multi-tenancy settings and return information about the tenants available to the current user. |
| [Allow List APIs]({{site.url}}{{site.baseurl}}/security/api/allowlist/) | The Allow List APIs control which APIs a user without administrator privileges can access. |
| [Configuration APIs]({{site.url}}{{site.baseurl}}/security/api/configuration/) | The Configuration APIs retrieve, replace, patch, and upgrade the Security plugin configuration. |
| [Distinguished Name APIs]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/) | The Distinguished Name APIs manage the allow lists of node and client certificate distinguished names used for cross-cluster communication. |
| [Certificate APIs]({{site.url}}{{site.baseurl}}/security/api/certificates/) | The Certificate APIs return the certificates in use on the cluster and reload them without restarting a node. |
| [Audit Log APIs]({{site.url}}{{site.baseurl}}/security/api/audit/) | The Audit Log APIs retrieve and modify the audit logging configuration. |
| [Cache APIs]({{site.url}}{{site.baseurl}}/security/api/cache/) | The Cache APIs flush the Security plugin's user, authentication, and authorization caches. |
| [API Key APIs]({{site.url}}{{site.baseurl}}/security/api/api-keys/) | The API Key APIs create, list, and revoke the API keys used to authenticate requests without a user name and password. |
| [Dashboards Info APIs]({{site.url}}{{site.baseurl}}/security/api/dashboards-info/) | The Dashboards Info APIs return the Security plugin settings that OpenSearch Dashboards needs in order to render its interface. |
| [Cluster Utility APIs]({{site.url}}{{site.baseurl}}/security/api/cluster/) | The cluster utility APIs report Security plugin health and validate or migrate the security configuration index. |
