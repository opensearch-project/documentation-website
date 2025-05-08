---
layout: default
title: Update Security Configuration API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 30
---

# Update Security Configuration API
**Introduced 1.0**
{: .label .label-purple }

The Update Security Configuration API creates or updates the Security plugin's configuration directly through the REST API. This configuration manages core security settings including authentication methods, authorization rules, and access controls.

This operation can easily break your existing security configuration. We strongly recommend using the `securityadmin.sh` script instead, which includes validations and safeguards to prevent misconfiguration.
{: .warning}

<!-- spec_insert_start
api: security.update_configuration
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/securityconfig/config
```
<!-- spec_insert_end -->

## Request body fields

The request body is **required**. It is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `dynamic` | **Required** | Object | The main configuration object containing all security configuration settings. |

<details markdown="block">
  <summary>
    Request body fields: <code>dynamic</code>
  </summary>
  {: .text-delta}

`dynamic` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `auth_failure_listeners` | Object | Configuration for handling authentication failures, including thresholds and actions. |
| `authc` | Object | Authentication configuration domains, defining how users are authenticated. |
| `authz` | Object | Authorization configuration, defining how permissions are evaluated. |
| `disable_intertransport_auth` | Boolean | When `true`, disables authentication for internal node-to-node communication. |
| `disable_rest_auth` | Boolean | When `true`, disables authentication for REST API requests (dangerous). |
| `do_not_fail_on_forbidden` | Boolean | When `true`, returns empty results instead of forbidden error for unauthorized access. |
| `do_not_fail_on_forbidden_empty` | Boolean | Similar to `do_not_fail_on_forbidden` but with specific behavior for empty results. |
| `filtered_alias_mode` | String | Controls how document field filtering is applied on aliases. |
| `hosts_resolver_mode` | String | Determines how hostname resolution is performed for security operations. |
| `http` | Object | HTTP-specific security configurations. |
| `kibana` | Object | Legacy settings for Kibana integration (deprecated). |
| `multi_rolespan_enabled` | Boolean | When `true`, enables spanning permissions across multiple roles. |
| `on_behalf_of` | Object | Configuration for trusted users to impersonate other users (advanced). |
| `opensearch-dashboards` | Object | Configuration for OpenSearch Dashboards integration. |
| `respect_request_indices_options` | Boolean | When `true`, respects index options specified in requests. |

</details>

## Example request

The following example updates the security configuration to configure basic authentication and internal user database:

```json
PUT /_plugins/_security/api/securityconfig/config
PUT _plugins/_security/api/securityconfig/config
{
  "dynamic": {
    "filtered_alias_mode": "warn",
    "disable_rest_auth": false,
    "disable_intertransport_auth": false,
    "respect_request_indices_options": false,
    "opensearch-dashboards": {
      "multitenancy_enabled": true,
      "server_username": "kibanaserver",
      "index": ".opensearch-dashboards"
    },
    "http": {
      "anonymous_auth_enabled": false
    },
    "authc": {
      "basic_internal_auth_domain": {
        "http_enabled": true,
        "transport_enabled": true,
        "order": 0,
        "http_authenticator": {
          "challenge": true,
          "type": "basic",
          "config": {}
        },
        "authentication_backend": {
          "type": "intern",
          "config": {}
        },
        "description": "Authenticate via HTTP Basic against internal users database"
      }
    },
    "auth_failure_listeners": {},
    "do_not_fail_on_forbidden": false,
    "multi_rolespan_enabled": true,
    "hosts_resolver_mode": "ip-only",
    "do_not_fail_on_forbidden_empty": false
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "Configuration updated."
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | Status of the request. A successful request returns "OK". |
| `message` | String | A message describing the result of the operation. |

## Usage notes

The Update Configuration API provides direct access to modify the Security plugin's core configuration, but comes with significant risks:

- **Prefer `securityadmin.sh`**: In most cases, you should use the `securityadmin.sh` script instead, which includes validation and safeguards.
  
- **Backup configuration**: Always back up your current security configuration before making changes.
  
- **Access control**: Enable access to this API only for trusted administrators, as it can potentially disable security for your entire cluster.
  
- **Testing**: Test the security configuration changes in a development environment before applying to production.

- **Complete configuration**: You must provide a complete configuration when updating, as partial updates will replace the entire configuration.
  
- **Validation**: This API has minimal validation, so incorrect configurations might not be caught until they cause operational issues.

## Enabling this API

By default, this API is disabled for security reasons. To enable it, you need to:

1. Update the `config.yml` file of the Security plugin.
2. Add the setting `plugins.security.restapi.endpoints_disabled.securityconfig: "false"`.  
3. Restart your OpenSearch cluster.

Due to the potential security implications, enabling this API is generally not recommended for production environments.