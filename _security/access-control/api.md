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

Access to the Security plugin REST API has two layers:

- General access controls the roles that can send requests to the Security APIs and the endpoints and HTTP methods that those roles can call.
- REST API admin permissions allow users without an admin certificate to call the APIs that are otherwise restricted to a super admin.

The two layers are independent grants. A request is allowed if either one permits it.

### Enable general API access

To grant a role general access to the Security APIs, add the role to `plugins.security.restapi.roles_enabled` in `opensearch.yml`:

```yml
plugins.security.restapi.roles_enabled: ["<role>", ...]
```
{% include copy.html %}

Restart the cluster after changing this static setting.

A role listed in this setting can call every Security API except the allow list, distinguished name, and certificate APIs, which are restricted to a super admin. A user who is neither mapped to such a role nor granted a [REST API admin permission](#rest-api-admin-permissions) receives `403 Forbidden`, no matter which other cluster permissions that user holds.

To prevent a role from reaching certain APIs, disable individual endpoints for it:

```yml
plugins.security.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
```
{% include copy.html %}

If a user is mapped to more than one role, an endpoint or method is disabled only when it is disabled for every one of that user's roles that has an `endpoints_disabled` entry. For example, if one role disables `DELETE` on `ROLES` but another of the user's roles does not, that user can still send `DELETE` requests to the role APIs. A per-role entry also restricts general access only: a user granted a matching [REST API admin permission](#rest-api-admin-permissions) still reaches the endpoint.

To disable an endpoint for every role, including the roles listed in `plugins.security.restapi.roles_enabled`, use `global` in place of the role name:

```yml
plugins.security.restapi.endpoints_disabled.global.<endpoint>: ["<method>", ...]
```
{% include copy.html %}

Unlike a per-role entry, a `global` entry also overrides REST API admin permissions.

### REST API admin permissions

The `restapi:admin` cluster permissions grant access that a `plugins.security.restapi.roles_enabled` role does not provide: the allow list, distinguished name, and certificate APIs, which are otherwise restricted to a super admin; several operations on the security configuration itself; and admin-level access to hidden and reserved resources. To use them, enable REST API admin permissions in `opensearch.yml`:

```yml
plugins.security.restapi.admin.enabled: true
```
{% include copy.html %}

Then grant the role the cluster permission for the endpoint you want it to reach. The role does not also need to be listed in `plugins.security.restapi.roles_enabled`. When `plugins.security.restapi.admin.enabled` is `false`, OpenSearch ignores these permissions and the APIs remain reachable only with an admin certificate.

You must assign these permissions explicitly. Broad cluster permissions such as `*` and `cluster:*` do not grant them, and you cannot grant them through an action group.

A role that contains any `restapi:admin` permission cannot be created or modified through the [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/), even by a super admin. Define such a role in `roles.yml` and apply it with `securityadmin.sh`. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).
{: .note}

The following table lists the cluster permissions that correspond to the Security APIs. The reserved `security_rest_api_full_access` role contains all of them except `restapi:admin/ratelimiters`, `restapi:admin/rollback_version`, and `restapi:admin/view_version`. Because the role permits security-sensitive cluster changes, map it only to trusted administrators.

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

The paths in the preceding table are relative to `_plugins/_security/api/`. To grant a role every one of these permissions at once, assign `restapi:admin/*` directly to the role.

The Security APIs that this table does not list have no `restapi:admin` permission of their own. A role listed in `plugins.security.restapi.roles_enabled` can already call them.

General access already covers action group, internal user, role, role mapping, and tenant resources that are neither hidden nor reserved. The matching permission from the preceding table extends that access to [reserved and hidden resources](#reserved-and-hidden-resources).

For example, the following role grants admin-level access to the internal user APIs. Define the role in `roles.yml`:

```yml
manage_internal_users:
  reserved: true
  cluster_permissions:
    - "restapi:admin/internalusers"
```
{% include copy.html %}

Map users or backend roles to the role in `roles_mapping.yml`:

```yml
manage_internal_users:
  reserved: true
  backend_roles:
    - "internal-user-api-operators"
  hosts: []
  users: []
  and_backend_roles: []
```
{% include copy.html %}

Apply both files using [`securityadmin.sh`]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/). This configuration reaches the internal user APIs without granting access to any other Security API. To give the role general access as well, also list it in `plugins.security.restapi.roles_enabled`.

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
