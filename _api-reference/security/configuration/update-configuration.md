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

The Update Security Configuration API creates or updates the Security plugin's configuration directly through the REST API. This configuration manages core security settings, including authentication methods, authorization rules, and access controls.

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

The request body is **required**. It is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `dynamic` | **Required** | Object | The main configuration object containing all security configuration settings. |

<details markdown="block">
  <summary>
    Request body fields: <code>dynamic</code>
  </summary>
  {: .text-delta}

`dynamic` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `auth_failure_listeners` | Object | The configuration for handling authentication failures, including thresholds and actions. |
| `authc` | Object | The authentication configuration domains that define how users are authenticated. For more information, see [authc]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/index/#authc). |
| `authz` | Object | The authorization configuration that defines how to extract backend roles when using LDAP for authentication. For more information, see [authz]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/index/#authz). |
| `do_not_fail_on_forbidden` | Boolean | When `true`, returns empty results instead of a forbidden error. Instead, failures are stored in the application logs. |
| `do_not_fail_on_forbidden_empty` | Boolean | Similar to `do_not_fail_on_forbidden` but with specific behavior for empty results. |
| `filtered_alias_mode` | String | Controls how document field filtering is applied to aliases. |
| `hosts_resolver_mode` | String | Determines how hostname resolution is performed for security operations. |
| `http` | Object | The HTTP-specific security configurations. |
| `on_behalf_of` | Object | Configures a temporary access token for the duration of a user's session (advanced). |
| `kibana` | Object | The configuration for OpenSearch Dashboards integration. |
| `respect_request_indices_options` | Boolean | When `true`, respects index options specified in requests. |


</details>


## Example request

The following example updates the security configuration to configure basic authentication and an internal user database:

<!-- spec_insert_start
component: example_code
rest: PUT /_plugins/_security/api/securityconfig/config
body: |
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
-->
{% capture step1_rest %}
PUT /_plugins/_security/api/securityconfig/config
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
{% endcapture %}

{% capture step1_python %}


response = client.security.update_configuration(
  body =   {
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
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "status": "OK",
  "message": "Configuration updated."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `message` | String | A message describing the result of the operation. |

## Usage notes

The Update Configuration API allows you to directly modify the Security plugin's core configuration but comes with potential risks:

- **Prefer `securityadmin.sh`**: In most cases, you should use the `securityadmin.sh` script instead, which includes validations and safeguards to prevent misconfiguration.
  
- **Backup configuration**: Always back up your current security configuration before making changes.
  
- **Access control**: Enable access to this API only for trusted administrators, as it can potentially disable the security configuration for your entire cluster.
  
- **Testing**: Test the security configuration changes in a development environment before deploying them to production.

- **Complete configuration**: You must provide a complete configuration when updating, as partial updates will replace the entire configuration.
  
- **Validation**: This API has minimal validation, so incorrect configurations might not be identified until they cause operational issues.

## Enabling this API

By default, this API is disabled for security reasons. To enable it, you need to:
