---
layout: default
title: Create or update role mappings
parent: Role mapping APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Role Mappings API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the mappings for one role or multiple roles. Each supplied mapping replaces the existing mapping for that role in full. For information about specifying multiple mappings, see [Creating or updating multiple role mappings](#creating-or-updating-multiple-role-mappings). To update individual attributes of a role mapping, use the [Patch Role Mappings API]({{site.url}}{{site.baseurl}}/security/api/role-mappings/patch-role-mappings/).

## Endpoints

```json
PUT /_plugins/_security/api/rolesmapping
PUT /_plugins/_security/api/rolesmapping/{role}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `role` | String | The name of the role whose mapping to create or replace. Optional. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Request body fields

The request body is required. When you specify a role name, the body is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `users` | Array of strings | The user names mapped to the role. Supports wildcard patterns. | No |
| `backend_roles` | Array of strings | The backend roles mapped to the role. A user with any of these backend roles receives the role. | No |
| `and_backend_roles` | Array of strings | The backend roles mapped to the role. A user must have all of these backend roles to receive the role. | No |
| `hosts` | Array of strings | The host names or IP addresses mapped to the role. Supports wildcard patterns. | No |
| `description` | String | A description of the role mapping. | No |
| `hidden` | Boolean | Whether the role mapping is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the role mapping is read-only and cannot be modified. Default is `false`. | No |

## Host-based role mapping

The `hosts` parameter maps requests originating from specific IP addresses or hostnames to the given role. CIDR blocks are not supported, but you can use wildcard patterns (globs), such as `192.168.*.*` or `*.example.com`. This is useful when you want to assign roles based on the client's source address:

* To match by IP address (for example, `"192.168.1.10"`), no additional configuration is needed.
* To match by hostname (for example, `"myserver.example.com"`), you must set the cluster-level configuration parameter:

  ```yaml
  opensearch_security.host_resolver_mode: ip-hostname
  ```

  This enables reverse DNS lookups to resolve hostnames. For more information, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

Using `"*"` in `hosts` matches all client IPs and hostnames, meaning this role will be applied to every request, regardless of user. Combined with `users: ["someuser"]`, this can grant broader access than you intend. Avoid setting `hosts: ["*"]` unless you're intentionally granting the role to all client IPs.
{: .warning}

## Example request: Create one role mapping

```json
PUT _plugins/_security/api/rolesmapping/test-role
{
  "backend_roles": [
    "starfleet",
    "captains"
  ],
  "hosts": [
    "*.starfleetintranet.com"
  ],
  "users": [
    "test-user"
  ]
}
```
{% include copy-curl.html security=true %}

## Example response

A successful request returns HTTP status `201` for a new mapping or `200` for a replaced one:

```json
{
  "status": "CREATED",
  "message": "'test-role' created."
}
```

If you set `wait_for_completion` to `false`, a successful submission returns HTTP status `200`, and the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result. For more information, see [Using wait_for_completion for configuration changes]({{site.url}}{{site.baseurl}}/security/api/index/#using-wait_for_completion-for-configuration-changes).

## Creating or updating multiple role mappings
**Introduced 3.10**
{: .label .label-purple }

To create or replace the mappings for multiple roles in one request, omit the role name from the path. The request body is a non-empty JSON object in which each key is the name of an existing role and each value is a mapping definition containing the fields in [Request body fields](#request-body-fields). Roles that are not included in the request keep their current mapping.

If a role does not exist, a mapping is invalid, or a change is not permitted, none of the mappings in the request are written. A request that names a role that does not exist fails with HTTP status `404`. Each mapping in the request is subject to the same permissions and restrictions as a single-mapping request, including restrictions on modifying reserved or hidden mappings and on mapping to roles that grant REST API admin permissions. For API access requirements, see [Security REST API permissions]({{site.url}}{{site.baseurl}}/security/access-control/api/).

The number of mappings in one request is limited by the `plugins.security.restapi.bulk_max_entries` cluster setting. Default is `1000`. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#rest-management-api-settings).

### Example request: Create multiple role mappings

The following request creates or replaces the mappings for two roles:

```json
PUT /_plugins/_security/api/rolesmapping
{
  "movies_reader": {
    "backend_roles": ["analysts"],
    "users": ["jdoe"]
  },
  "cluster_observer": {
    "backend_roles": ["ops"],
    "hosts": ["*.monitoring.example.com"]
  }
}
```
{% include copy-curl.html security=true %}

### Example response

A successful request returns HTTP status `200`, including when all supplied mappings are new:

```json
{
  "status": "OK",
  "message": "Resources updated."
}
```
