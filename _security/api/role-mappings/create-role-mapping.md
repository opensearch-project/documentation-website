---
layout: default
title: Create Role Mapping API
parent: Role Mapping APIs
grand_parent: Security APIs
nav_order: 30
---

# Create Role Mapping API
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

## Example request

```json
PUT _plugins/_security/api/rolesmapping/{role}
{
  "backend_roles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
  "hosts" : [ "*.starfleetintranet.com" ],
  "users" : [ "worf" ]
}
```
{% include copy-curl.html %}

## Host-based role mapping

The `hosts` parameter maps requests originating from specific IP addresses or hostnames to the given role. CIDR blocks are not supported, but you can use wildcard patterns (globs), such as `192.168.*.*` or `*.example.com`. This is useful when you want to assign roles based on the client's source address:

* To match by IP address (for example, `"192.168.1.10"`), no additional configuration is needed.
* To match by hostname (for example, `"myserver.example.com"`), you must set the cluster-level configuration parameter:

  ```yaml
  opensearch_security.host_resolver_mode: ip-hostname
  ```

  This enables reverse DNS lookups to resolve hostnames. For more information, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

Using `"*"` in `hosts` matches all client IPs and hostnames, meaning this role will be applied to every request, regardless of user. This can unintentionally overgrant access if used alongside `users: ["someuser"]`. Avoid setting `hosts: ["*"]` unless you're intentionally granting the role to all client IPs.
{: .warning}

## Example response

```json
{
  "status": "CREATED",
  "message": "'my-role' created."
}
```
