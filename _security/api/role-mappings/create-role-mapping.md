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

Creates or replaces the specified role mapping.

<!-- spec_insert_start
api: security.create_role_mapping
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

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

## Example request

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

```json
{
  "status": "CREATED",
  "message": "'test-role' created."
}
```
