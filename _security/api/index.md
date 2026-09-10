---
layout: default
title: Security APIs
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /security/api/
  - /api-reference/security/
  - /api-reference/security/index/
  - /api-reference/security-apis/
---

# Security APIs

The Security APIs configure and inspect the Security plugin over REST. Use them to manage users, roles, role mappings, action groups, and tenants; to read and replace the security configuration; and to inspect certificates, caches, and plugin health.

All Security APIs use the base path `_plugins/_security/` followed by the specific path for each operation. For example, the path for the Perform Upgrade API is `/_plugins/_security/api/_upgrade_perform`.

Most of these APIs read from and write to the security configuration index, so access to them is restricted. To call one, the requesting user must be mapped to a role listed in the `plugins.security.restapi.roles_enabled` setting in `opensearch.yml`. A user without such a role receives `403 Forbidden`, regardless of the cluster permissions granted to that user.

Four APIs are exempt because they expose only the requesting user's own information: the [account APIs]({{site.url}}{{site.baseurl}}/security/api/account/), the [Permissions Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/permissions-info/), the [Dashboards Info API]({{site.url}}{{site.baseurl}}/security/api/dashboards-info/), and the [Security Plugin Health API]({{site.url}}{{site.baseurl}}/security/api/health/). Any authenticated user can call them.

Three groups of APIs require more than a `plugins.security.restapi.roles_enabled` role. The [allow list APIs]({{site.url}}{{site.baseurl}}/security/api/allowlist/), [distinguished name APIs]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/), and [certificate APIs]({{site.url}}{{site.baseurl}}/security/api/certificates/) are restricted to a super admin, and each category page describes the additional cluster permission that lets a role reach them. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/).

Most Security API calls require HTTP basic authentication with admin credentials, as shown in the following example:

```bash
curl -k -XGET -u admin:<password> https://localhost:9200/_plugins/_security/api/roles/
```
{% include copy.html %}

The Security plugin ships with a demo configuration for testing purposes. Don't use the demo configuration in a production environment. For production deployments, generate secure credentials and certificates.
{: .warning}

## Supported APIs

The Security APIs are grouped by the resource that each one configures. The following table lists the available groups. Select a group to view the operations it provides.

| Group | Description |
| :--- | :--- |
| [Authentication APIs]({{site.url}}{{site.baseurl}}/security/api/authentication/) | The authentication APIs return information about the authenticated user, the permissions granted to that user, and the TLS connection used to make the request. |
| [Account APIs]({{site.url}}{{site.baseurl}}/security/api/account/) | The account APIs return and modify the details of the currently authenticated user's own account. |
| [Internal user APIs]({{site.url}}{{site.baseurl}}/security/api/users/) | The internal user APIs create, retrieve, modify, and delete users in the internal user database. |
| [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/) | The role APIs create, retrieve, modify, and delete the roles that define cluster, index, and document permissions. |
| [Role mapping APIs]({{site.url}}{{site.baseurl}}/security/api/role-mappings/) | The role mapping APIs map users, backend roles, and hosts to security roles. |
| [Action group APIs]({{site.url}}{{site.baseurl}}/security/api/action-groups/) | The action group APIs create, retrieve, modify, and delete action groups, which are reusable collections of permissions. |
| [API key APIs]({{site.url}}{{site.baseurl}}/security/api/api-keys/) | The API key APIs create, list, and revoke the API keys used to authenticate requests without a user name and password. |
| [Tenant APIs]({{site.url}}{{site.baseurl}}/security/api/tenants/) | The tenant APIs create, retrieve, modify, and delete the tenants that isolate OpenSearch Dashboards resources between groups of users. |
| [Multi-tenancy configuration APIs]({{site.url}}{{site.baseurl}}/security/api/tenancy/) | The multi-tenancy configuration APIs configure multi-tenancy for OpenSearch Dashboards and return information about the tenants available to the current user. |
| [Allow list APIs]({{site.url}}{{site.baseurl}}/security/api/allowlist/) | The allow list APIs control which APIs a user without administrator privileges can access. |
| [Configuration APIs]({{site.url}}{{site.baseurl}}/security/api/configuration/) | The configuration APIs retrieve, replace, patch, and upgrade the Security plugin configuration. |
| [Security configuration version APIs]({{site.url}}{{site.baseurl}}/security/api/configuration-versions/) | The security configuration version APIs track the history of the Security plugin configuration and restore a previous version of it. |
| [Audit log APIs]({{site.url}}{{site.baseurl}}/security/api/audit/) | The audit log APIs retrieve and modify the audit logging configuration. |
| [Distinguished name APIs]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/) | The distinguished name APIs manage the allow lists of node and client certificate distinguished names used for cross-cluster communication. |
| [Certificate APIs]({{site.url}}{{site.baseurl}}/security/api/certificates/) | The certificate APIs return the certificates in use on the cluster and reload them without restarting a node. |
| [Flush Cache API]({{site.url}}{{site.baseurl}}/security/api/flush-cache/) | The Flush Cache API flushes the Security plugin's user, authentication, and authorization caches. |
| [Dashboards Info API]({{site.url}}{{site.baseurl}}/security/api/dashboards-info/) | The Dashboards Info API returns the Security plugin settings that OpenSearch Dashboards needs in order to render its interface. |
| [Security Plugin Health API]({{site.url}}{{site.baseurl}}/security/api/health/) | The Security Plugin Health API reports whether the Security plugin is initialized and ready to authorize requests. |
