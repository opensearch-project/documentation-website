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

If you're working with APIs that manage `Distinguished names` or `Certificates` that require super admin access, enable the REST API admin configuration in your `opensearch.yml` file as shown in the following setting example:

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

| **Permission**                 | **APIs granted**                   | **Description**                                                                                                                                    |
|:-------------------------------|:-----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| `restapi:admin/actiongroups`     | `/actiongroup` and `/actiongroups` | Permission to get, delete, create, and patch actions groups (including bulk updates).                                                              |
| `restapi:admin/allowlist `       | `/allowlist`                       | Permission to add any endpoints and HTTP requests to a list of allowed endpoints and requests.                                                     |
| `restapi:admin/internalusers`    | `/internaluser` and `/user`        | Permission to add, retrieve, modify, and delete any user in the cluster.                                                                           |
| `restapi:admin/nodesdn `         | `/nodesdn`                         | Permission to add, retrieve, update, or delete any distinguished names from an allow list and enable communication between clusters and/or nodes.  |
| `restapi:admin/roles`            | `/roles`                           | Permission to add, retrieve, modify, and delete any roles in the cluster.                                                                          |
| `restapi:admin/rolesmapping`     | `/rolesmapping`                    | Permission to add, retrieve, modify, and delete any roles-mapping.                                                                                 |
| `restapi:admin/ssl/certs/info`   | `/ssl/certs/info`                  | Permission to view current Transport and HTTP certificates.                                                                                        |
| `restapi:admin/ssl/certs/reload` | `/ssl/certs/reload`                | Permission to view reload Transport and HTTP certificates.                                                                                         |
| `restapi:admin/tenants`          | `/tenants`                         | Permission to get, delete, create, and patch tenants.                                                                                              |



Possible values for `endpoint` are:

- `ACTIONGROUPS`
- `ROLES`
- `ROLESMAPPING`
- `INTERNALUSERS`
- `CONFIG`
- `CACHE`
- `SYSTEMINFO`
- `NODESDN`
- `SSL`

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

You can mark users, role, role mappings, and action groups as reserved. Resources that have this flag set to true can't be changed using the REST API or OpenSearch Dashboards.

To mark a resource as reserved, add the following flag:

```yml
kibana_user:
  reserved: true
```
{% include copy.html %}

Likewise, you can mark users, role, role mappings, and action groups as hidden. Resources that have this flag set to true are not returned by the REST API and not visible in OpenSearch Dashboards:

```yml
kibana_user:
  hidden: true
```
{% include copy.html %}

Hidden resources are automatically reserved.

To add or remove these flags, modify `config/opensearch-security/internal_users.yml` and run `plugins/opensearch-security/tools/securityadmin.sh`.

## API reference

The following table lists the available Security APIs.

| Group | APIs |
| :--- | :--- |
| [Authentication APIs]({{site.url}}{{site.baseurl}}/security/api/authentication/) | [Authentication Information API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-info/), [Who Am I API]({{site.url}}{{site.baseurl}}/security/api/authentication/who-am-i/), [Who Am I Protected API]({{site.url}}{{site.baseurl}}/security/api/authentication/who-am-i-protected/), [Permissions Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/permissions-info/), [SSL Info API]({{site.url}}{{site.baseurl}}/security/api/authentication/ssl-info/), [Auth Token API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-token/), [Generate On-Behalf-Of Token API]({{site.url}}{{site.baseurl}}/security/api/authentication/generate-obo-token/) |
| [Account APIs]({{site.url}}{{site.baseurl}}/security/api/account/) | [Get Account Details API]({{site.url}}{{site.baseurl}}/security/api/account/get-account-details/), [Change Password API]({{site.url}}{{site.baseurl}}/security/api/account/change-password/) |
| [Internal User APIs]({{site.url}}{{site.baseurl}}/security/api/users/) | [Get User API]({{site.url}}{{site.baseurl}}/security/api/users/get-user/), [Get Users API]({{site.url}}{{site.baseurl}}/security/api/users/get-users/), [Create User API]({{site.url}}{{site.baseurl}}/security/api/users/create-user/), [Patch User API]({{site.url}}{{site.baseurl}}/security/api/users/patch-user/), [Patch Users API]({{site.url}}{{site.baseurl}}/security/api/users/patch-users/), [Delete User API]({{site.url}}{{site.baseurl}}/security/api/users/delete-user/), [Generate User Token API]({{site.url}}{{site.baseurl}}/security/api/users/generate-user-token/) |
| [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/) | [Get Role API]({{site.url}}{{site.baseurl}}/security/api/roles/get-role/), [Get Roles API]({{site.url}}{{site.baseurl}}/security/api/roles/get-roles/), [Create Role API]({{site.url}}{{site.baseurl}}/security/api/roles/create-role/), [Patch Role API]({{site.url}}{{site.baseurl}}/security/api/roles/patch-role/), [Patch Roles API]({{site.url}}{{site.baseurl}}/security/api/roles/patch-roles/), [Delete Role API]({{site.url}}{{site.baseurl}}/security/api/roles/delete-role/) |
| [Role Mapping APIs]({{site.url}}{{site.baseurl}}/security/api/role-mappings/) | [Get Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/get-role-mapping/), [Get Role Mappings API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/get-role-mappings/), [Create Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/create-role-mapping/), [Patch Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/patch-role-mapping/), [Patch Role Mappings API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/patch-role-mappings/), [Delete Role Mapping API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/delete-role-mapping/) |
| [Action Group APIs]({{site.url}}{{site.baseurl}}/security/api/action-groups/) | [Get Action Group API]({{site.url}}{{site.baseurl}}/security/api/action-groups/get-action-group/), [Get Action Groups API]({{site.url}}{{site.baseurl}}/security/api/action-groups/get-action-groups/), [Create Action Group API]({{site.url}}{{site.baseurl}}/security/api/action-groups/create-action-group/), [Patch Action Group API]({{site.url}}{{site.baseurl}}/security/api/action-groups/patch-action-group/), [Patch Action Groups API]({{site.url}}{{site.baseurl}}/security/api/action-groups/patch-action-groups/), [Delete Action Group API]({{site.url}}{{site.baseurl}}/security/api/action-groups/delete-action-group/) |
| [Tenant APIs]({{site.url}}{{site.baseurl}}/security/api/tenants/) | [Get Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/get-tenant/), [Get Tenants API]({{site.url}}{{site.baseurl}}/security/api/tenants/get-tenants/), [Create Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/create-tenant/), [Patch Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/patch-tenant/), [Patch Tenants API]({{site.url}}{{site.baseurl}}/security/api/tenants/patch-tenants/), [Delete Tenant API]({{site.url}}{{site.baseurl}}/security/api/tenants/delete-tenant/) |
| [Tenancy Configuration APIs]({{site.url}}{{site.baseurl}}/security/api/tenancy/) | [Get Tenancy Configuration API]({{site.url}}{{site.baseurl}}/security/api/tenancy/get-tenancy-config/), [Update Tenancy Configuration API]({{site.url}}{{site.baseurl}}/security/api/tenancy/update-tenancy-config/), [Tenant Info API]({{site.url}}{{site.baseurl}}/security/api/tenancy/tenant-info/) |
| [Allow List APIs]({{site.url}}{{site.baseurl}}/security/api/allowlist/) | [Get Allow List API]({{site.url}}{{site.baseurl}}/security/api/allowlist/get-allowlist/), [Create Allow List API]({{site.url}}{{site.baseurl}}/security/api/allowlist/create-allowlist/), [Patch Allow List API]({{site.url}}{{site.baseurl}}/security/api/allowlist/patch-allowlist/) |
| [Configuration APIs]({{site.url}}{{site.baseurl}}/security/api/configuration/) | [Get Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/get-configuration/), [Update Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/update-configuration/), [Patch Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/patch-configuration/), [Upgrade Check API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-check/), [Upgrade Perform API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-perform/) |
| [Distinguished Name APIs]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/) | [Get Distinguished Names API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/get-distinguished-names/), [Get Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/get-distinguished-name/), [Update Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/update-distinguished-name/), [Patch Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/patch-distinguished-name/), [Patch Distinguished Names API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/patch-distinguished-names/), [Delete Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/delete-distinguished-name/) |
| [Certificate APIs]({{site.url}}{{site.baseurl}}/security/api/certificates/) | [Get Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-certificates/), [Get All Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-all-certificates/), [Get Node Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-node-certificates/), [Reload Transport Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/reload-transport-certificates/), [Reload HTTP Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/reload-http-certificates/) |
| [Audit Log APIs]({{site.url}}{{site.baseurl}}/security/api/audit/) | [Get Audit Configuration API]({{site.url}}{{site.baseurl}}/security/api/audit/get-audit-configuration/), [Update Audit Configuration API]({{site.url}}{{site.baseurl}}/security/api/audit/update-audit-configuration/), [Patch Audit Configuration API]({{site.url}}{{site.baseurl}}/security/api/audit/patch-audit-configuration/) |
| [Cache APIs]({{site.url}}{{site.baseurl}}/security/api/cache/) | [Flush Cache API]({{site.url}}{{site.baseurl}}/security/api/cache/flush-cache/) |
| [API Key APIs]({{site.url}}{{site.baseurl}}/security/api/api-keys/) | [Create an API Key]({{site.url}}{{site.baseurl}}/security/api/api-keys/create/), [List API Keys]({{site.url}}{{site.baseurl}}/security/api/api-keys/list/), [Revoke an API Key]({{site.url}}{{site.baseurl}}/security/api/api-keys/revoke/) |
| [Dashboards Info APIs]({{site.url}}{{site.baseurl}}/security/api/dashboards-info/) | [Get Dashboards Info API]({{site.url}}{{site.baseurl}}/security/api/dashboards-info/get-dashboards-info/), [Post Dashboards Info API]({{site.url}}{{site.baseurl}}/security/api/dashboards-info/post-dashboards-info/) |
| [Cluster Utility APIs]({{site.url}}{{site.baseurl}}/security/api/cluster/) | [Health API]({{site.url}}{{site.baseurl}}/security/api/cluster/health/), [Validate API]({{site.url}}{{site.baseurl}}/security/api/cluster/validate/), [Migrate API]({{site.url}}{{site.baseurl}}/security/api/cluster/migrate/) |

## Resource sharing
**Introduced 3.3**
{: .label .label-purple }

For managing resource-level access control and sharing plugin-defined resources such as ML models and anomaly detectors, see [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/).
