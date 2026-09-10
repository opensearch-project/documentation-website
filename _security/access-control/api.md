---
layout: default
title: API permissions
parent: Access control
nav_order: 120
redirect_from:
 - /security-plugin/access-control/api/
---

# API permissions

The Security plugin REST API lets you programmatically create and manage users, roles, role mappings, action groups, and tenants. This page describes how to grant and restrict access to that API and how reserved and hidden resources affect it. For the endpoint reference, see [Security APIs]({{site.url}}{{site.baseurl}}/security/api/).

## Access control for the API

Just like OpenSearch permissions, you control access to the Security plugin REST API using roles. Specify roles in `opensearch.yml`:

```yml
plugins.security.restapi.roles_enabled: ["<role>", ...]
```
{% include copy.html %}

The distinguished name and certificate APIs require superadmin access. To let a role call them, enable the REST API admin configuration in `opensearch.yml`:

```yml
plugins.security.restapi.admin.enabled: true
```
{% include copy.html %}

These roles can now access all APIs. To prevent access to certain APIs:

```yml
plugins.security.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
```
{% include copy.html %}

Roles also allow you to control access to specific REST APIs. You can add individual or multiple cluster permissions to a role and grant users access to associated APIs when they are mapped to the role. The following list of cluster permissions includes the endpoints that correspond to the Security REST APIs:

| Permission | APIs granted | Description |
| :--- | :--- | :--- |
| `restapi:admin/actiongroups` | `/actiongroup` and `/actiongroups` | Permission to retrieve, create, modify, and delete any action group, including bulk updates. |
| `restapi:admin/allowlist` | `/allowlist` | Permission to add endpoints and HTTP methods to the allow list. |
| `restapi:admin/internalusers` | `/internaluser` and `/user` | Permission to add, retrieve, modify, and delete any user in the cluster. |
| `restapi:admin/nodesdn` | `/nodesdn` | Permission to add, retrieve, update, and delete the distinguished names in the allow list that enables communication between clusters and nodes. |
| `restapi:admin/roles` | `/roles` | Permission to add, retrieve, modify, and delete any role in the cluster. |
| `restapi:admin/rolesmapping` | `/rolesmapping` | Permission to add, retrieve, modify, and delete any role mapping. |
| `restapi:admin/ssl/certs/info` | `/ssl/certs/info` | Permission to view the current transport and HTTP certificates. |
| `restapi:admin/ssl/certs/reload` | `/ssl/certs/reload` | Permission to reload the transport and HTTP certificates. |
| `restapi:admin/tenants` | `/tenants` | Permission to retrieve, create, modify, and delete any tenant. |

The following table lists the valid `endpoint` values and the APIs that each one covers.

| Value | APIs |
| :--- | :--- |
| `ACCOUNT` | The account APIs, which return and modify the details of the calling user's own account. |
| `ACTIONGROUPS` | The action group APIs. |
| `ALLOWLIST` | The allow list APIs. |
| `APITOKENS` | The API key APIs. |
| `AUDIT` | The audit log APIs. |
| `AUTHTOKEN` | The Authorization Token API. |
| `CACHE` | The Flush Cache API. |
| `CONFIG` | The configuration APIs, including the upgrade check and upgrade operations. |
| `INTERNALUSERS` | The internal user APIs. |
| `NODESDN` | The distinguished name APIs. |
| `PERMISSIONSINFO` | The Permissions Info API. |
| `RATELIMITERS` | The APIs that configure authentication rate limiting. |
| `RESOURCE_SHARING` | The resource sharing APIs. |
| `ROLES` | The role APIs. |
| `ROLESMAPPING` | The role mapping APIs. |
| `ROLLBACK_VERSION` | The operation that restores a previous version of the security configuration. |
| `SSL` | The certificate APIs. |
| `TENANTS` | The tenant APIs and the multi-tenancy configuration APIs. |
| `VIEW_VERSION` | The operations that list security configuration versions and return the contents of one version. |

Possible values for `method` are:

- `GET`
- `PUT`
- `POST`
- `DELETE`
- `PATCH`

For example, the following configuration grants three roles access to the REST API, but then prevents `test-role` from making `PUT`, `POST`, `DELETE`, or `PATCH` requests to `_plugins/_security/api/roles` or `_plugins/_security/api/internalusers`:

```yml
plugins.security.restapi.roles_enabled: ["all_access", "security_rest_api_access", "test-role"]
plugins.security.restapi.endpoints_disabled.test-role.ROLES: ["PUT", "POST", "DELETE", "PATCH"]
plugins.security.restapi.endpoints_disabled.test-role.INTERNALUSERS: ["PUT", "POST", "DELETE", "PATCH"]
```
{% include copy.html %}

To use the `PUT` and `PATCH` methods for the [Configuration APIs]({{site.url}}{{site.baseurl}}/security/api/configuration/), add the following line to `opensearch.yml`:

```yml
plugins.security.unsupported.restapi.allow_securityconfig_modification: true
```
{% include copy.html %}

## Reserved and hidden resources

You can mark users, roles, role mappings, and action groups as reserved. Resources that have this flag set to true can't be changed using the REST API or OpenSearch Dashboards.

To mark a resource as reserved, add the following flag:

```yml
kibana_user:
  reserved: true
```
{% include copy.html %}

Likewise, you can mark users, roles, role mappings, and action groups as hidden. Resources that have this flag set to true are not returned by the REST API and not visible in OpenSearch Dashboards:

```yml
kibana_user:
  hidden: true
```
{% include copy.html %}

Hidden resources are automatically reserved.

To add or remove these flags, modify `config/opensearch-security/internal_users.yml` and run `plugins/opensearch-security/tools/securityadmin.sh`.

## Resource sharing
**Introduced 3.3**
{: .label .label-purple }

For managing resource-level access control and sharing plugin-defined resources such as ML models and anomaly detectors, see [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/).
