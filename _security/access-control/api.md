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

A role listed in this setting can call every Security API except the allow list, distinguished name, and certificate APIs, which are restricted to a super admin. A user without such a role receives `403 Forbidden`, no matter which cluster permissions that user holds.

To prevent a role from reaching certain APIs, disable individual endpoints for it:

```yml
plugins.security.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
```
{% include copy.html %}

To disable an endpoint for every role, including the roles listed in `plugins.security.restapi.roles_enabled`, use `global` in place of the role name:

```yml
plugins.security.restapi.endpoints_disabled.global.<endpoint>: ["<method>", ...]
```
{% include copy.html %}

### REST API admin permissions

The allow list, distinguished name, and certificate APIs are restricted to a super admin. To let a role call them without an admin certificate, enable REST API admin permissions in `opensearch.yml`:

```yml
plugins.security.restapi.admin.enabled: true
```
{% include copy.html %}

Then grant the role the cluster permission for the endpoint you want it to reach. Both conditions apply together: the permission unlocks the endpoint, but the role must still be listed in `plugins.security.restapi.roles_enabled` to reach the Security APIs at all.

A role that contains any `restapi:admin` permission cannot be created or modified through the [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/), even by a super admin. Define such a role in `roles.yml` and apply it with `securityadmin.sh`. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).
{: .note}

The following table lists the cluster permissions that correspond to the Security REST APIs. No built-in role includes them.

| Permission | APIs granted | Description |
| :--- | :--- | :--- |
| `restapi:admin/actiongroups` | `/actiongroup` and `/actiongroups` | Permission to retrieve, create, modify, and delete any action group, including bulk updates. |
| `restapi:admin/allowlist` | `/allowlist` | Permission to add endpoints and HTTP methods to the allow list. |
| `restapi:admin/config/update` | `PUT` and `PATCH` on `/securityconfig` | Permission to replace or patch the security configuration. |
| `restapi:admin/internalusers` | `/internaluser` and `/user` | Permission to add, retrieve, modify, and delete any user in the cluster. |
| `restapi:admin/nodesdn` | `/nodesdn` | Permission to add, retrieve, update, and delete the distinguished names in the allow list that enables communication between clusters and nodes. |
| `restapi:admin/ratelimiters` | `/authfailurelisteners` | Permission to retrieve and modify the authentication rate limiting configuration. |
| `restapi:admin/resource_sharing/migrate` | `/resources/migrate` | Permission to migrate plugin-defined resource sharing records. |
| `restapi:admin/roles` | `/roles` | Permission to add, retrieve, modify, and delete any role in the cluster. |
| `restapi:admin/rolesmapping` | `/rolesmapping` | Permission to add, retrieve, modify, and delete any role mapping. |
| `restapi:admin/rollback_version` | `/version/rollback` | Permission to restore a previous version of the security configuration. |
| `restapi:admin/ssl/certs/info` | `/certificates`, `/certificates/{node_id}`, and `/ssl/certs` | Permission to view the current transport and HTTP certificates. |
| `restapi:admin/ssl/certs/reload` | `/ssl/{cert_type}/reloadcerts` | Permission to reload the transport and HTTP certificates. |
| `restapi:admin/tenants` | `/tenants` | Permission to retrieve, create, modify, and delete any tenant. |
| `restapi:admin/view_version` | `/versions` and `/version/{version_id}` | Permission to list the security configuration versions and retrieve the contents of one version. |

The paths in the preceding table are relative to `_plugins/_security/api/`. To grant a role every one of these permissions at once, use `restapi:admin/*`.

The Security APIs that this table does not list have no `restapi:admin` permission of their own. A role listed in `plugins.security.restapi.roles_enabled` can already call them.

### Endpoint values

The following table lists the valid `endpoint` values and the APIs that each one covers.

| Value | APIs |
| :--- | :--- |
| `ACTIONGROUPS` | The action group APIs. |
| `ALLOWLIST` | The allow list APIs. |
| `APITOKENS` | The API key APIs. |
| `AUDIT` | The audit log APIs. |
| `AUTHTOKEN` | The Authorization Token API. |
| `CACHE` | The Flush Cache API. |
| `CONFIG` | The configuration APIs, including the upgrade check and upgrade operations. |
| `INTERNALUSERS` | The internal user APIs. |
| `NODESDN` | The distinguished name APIs. |
| `RATELIMITERS` | The APIs that configure authentication rate limiting. |
| `RESOURCE_SHARING` | The operation that migrates plugin-defined resource sharing records. |
| `ROLES` | The role APIs. |
| `ROLESMAPPING` | The role mapping APIs. |
| `ROLLBACK_VERSION` | The operation that restores a previous version of the security configuration. |
| `SSL` | The certificate APIs. |
| `TENANTS` | The tenant APIs and the multi-tenancy configuration APIs. |
| `VIEW_VERSION` | The operations that list security configuration versions and return the contents of one version. |

The account APIs, the Permissions Info API, the Dashboards Info API, and the Security Plugin Health API have no `endpoint` value because any authenticated user can call them.

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
