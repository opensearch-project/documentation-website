---
layout: default
title: Create or update role mapping
parent: Role mapping APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Role Mapping API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces role mappings. Specify a role name to create or replace the mapping for one role, or omit the role name to create or replace the mappings for multiple roles in a single call.

<!-- spec_insert_start
api: security.create_role_mapping
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->
```json
PUT /_plugins/_security/api/rolesmapping
```

The form without a role name was introduced in OpenSearch 3.10.
{: .note}

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `role` | String | The name of the role whose mapping to create or replace. Omit it to create or replace multiple mappings in one request. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Request body fields

The request body is required.

When you specify a role name, the body is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `users` | Array of strings | The user names mapped to the role. Supports wildcard patterns. | No |
| `backend_roles` | Array of strings | The backend roles mapped to the role. A user with any of these backend roles receives the role. | No |
| `and_backend_roles` | Array of strings | The backend roles mapped to the role. A user must have all of these backend roles to receive the role. | No |
| `hosts` | Array of strings | The host names or IP addresses mapped to the role. Supports wildcard patterns. | No |
| `description` | String | A description of the role mapping. | No |
| `hidden` | Boolean | Whether the role mapping is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the role mapping is read-only and cannot be modified. Default is `false`. | No |

When you omit the role name, the body is a non-empty JSON object in which each key is the name of an existing role and each value is a mapping definition with the fields above. Each supplied mapping replaces the existing mapping for that role in full; roles that are not included in the request keep their current mapping. The API validates every entry before writing any changes: if a role does not exist, a mapping is invalid, or a change is not permitted, none of the mappings in the request are written. Each mapping is subject to the same permissions and restrictions as a single-mapping request, including restrictions on modifying reserved or hidden mappings and on mapping to roles that grant REST API admin permissions. For API access requirements, see [Security REST API permissions]({{site.url}}{{site.baseurl}}/security/access-control/api/).

The number of mappings in one request is limited by the `plugins.security.restapi.bulk_max_entries` cluster setting. Default is `1000`. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).

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

## Example request

The following request creates or replaces the mapping for one role:

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

The following request creates or replaces the mappings for two roles in one call:

```json
PUT _plugins/_security/api/rolesmapping
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

## Example response

When you specify a role name, a successful request returns HTTP status `201` for a new mapping or `200` for a replaced one:

```json
{
  "status": "CREATED",
  "message": "'test-role' created."
}
```

When you omit the role name, a successful synchronous request returns HTTP status `200`, including when all supplied mappings are new:

```json
{
  "status": "OK",
  "message": "Resources updated."
}
```

If you set `wait_for_completion` to `false`, a successful submission also returns HTTP status `200`, but the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result.

If any role named in a multi-mapping request does not exist, the request fails with HTTP status `404` and no mappings are written. If the request contains more mappings than `plugins.security.restapi.bulk_max_entries` allows, it fails with HTTP status `400`:

```json
{
  "status": "BAD_REQUEST",
  "message": "Request contains 1200 resources; the maximum is 1000."
}
```
