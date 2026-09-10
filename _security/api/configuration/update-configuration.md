---
layout: default
title: Create or update configuration
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 10
redirect_from:
  - /api-reference/security/configuration/update-configuration/
---

# Create or Update Configuration API
**Introduced 2.10**
{: .label .label-purple }

The Create or Update Configuration API creates or updates the Security plugin's configuration directly through the REST API. This configuration manages core security settings, including authentication methods, authorization rules, and access controls.

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
| `authc` | Object | The authentication configuration domains that define how users are authenticated. For more information, see [`authc`]({{site.url}}{{site.baseurl}}/security/api/configuration/index/#authc). |
| `authz` | Object | The authorization configuration that defines how to extract backend roles when using LDAP for authentication. For more information, see [`authz`]({{site.url}}{{site.baseurl}}/security/api/configuration/index/#authz). |
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

```json
PUT /_plugins/_security/api/securityconfig/config
{
  "dynamic": {
    "api_tokens": {
      "enabled": false,
      "max_duration_seconds": 7776000,
      "max_tokens": 100
    },
    "auth_failure_listeners": {},
    "authc": {
      "jwt_auth_domain": {
        "authentication_backend": {
          "config": {},
          "type": "noop"
        },
        "description": "Authenticate via Json Web Token",
        "http_authenticator": {
          "challenge": false,
          "config": {
            "jwks_uri": "https://your-jwks-endpoint.com/.well-known/jwks.json",
            "signing_key": "base64 encoded HMAC key or public RSA/ECDSA pem key",
            "jwt_header": "Authorization",
            "jwt_clock_skew_tolerance_seconds": 30
          },
          "type": "jwt"
        },
        "http_enabled": false,
        "order": 0
      },
      "ldap": {
        "authentication_backend": {
          "config": {
            "enable_ssl": false,
            "enable_start_tls": false,
            "enable_ssl_client_auth": false,
            "verify_hostnames": true,
            "hosts": [
              "localhost:8389"
            ],
            "userbase": "ou=people,dc=example,dc=com",
            "usersearch": "(sAMAccountName={0})"
          },
          "type": "ldap"
        },
        "description": "Authenticate via LDAP or Active Directory",
        "http_authenticator": {
          "challenge": false,
          "config": {},
          "type": "basic"
        },
        "http_enabled": false,
        "order": 5
      },
      "basic_internal_auth_domain": {
        "authentication_backend": {
          "config": {},
          "type": "intern"
        },
        "description": "Authenticate via HTTP Basic against internal users database",
        "http_authenticator": {
          "challenge": true,
          "config": {},
          "type": "basic"
        },
        "http_enabled": true,
        "order": 4
      },
      "proxy_auth_domain": {
        "authentication_backend": {
          "config": {},
          "type": "noop"
        },
        "description": "Authenticate via proxy",
        "http_authenticator": {
          "challenge": false,
          "config": {
            "user_header": "x-proxy-user",
            "roles_header": "x-proxy-roles"
          },
          "type": "proxy"
        },
        "http_enabled": false,
        "order": 3
      },
      "clientcert_auth_domain": {
        "authentication_backend": {
          "config": {},
          "type": "noop"
        },
        "description": "Authenticate via SSL client certificates",
        "http_authenticator": {
          "challenge": false,
          "config": {
            "username_attribute": "cn"
          },
          "type": "clientcert"
        },
        "http_enabled": false,
        "order": 2
      },
      "kerberos_auth_domain": {
        "authentication_backend": {
          "config": {},
          "type": "noop"
        },
        "http_authenticator": {
          "challenge": true,
          "config": {
            "krb_debug": false,
            "strip_realm_from_principal": true
          },
          "type": "kerberos"
        },
        "http_enabled": false,
        "order": 6
      }
    },
    "authz": {
      "roles_from_another_ldap": {
        "authorization_backend": {
          "config": {},
          "type": "ldap"
        },
        "description": "Authorize via another Active Directory",
        "http_enabled": false
      },
      "roles_from_myldap": {
        "authorization_backend": {
          "config": {
            "enable_ssl": false,
            "enable_start_tls": false,
            "enable_ssl_client_auth": false,
            "verify_hostnames": true,
            "hosts": [
              "localhost:8389"
            ],
            "rolebase": "ou=groups,dc=example,dc=com",
            "rolesearch": "(member={0})",
            "userrolename": "disabled",
            "rolename": "cn",
            "resolve_nested_roles": true,
            "userbase": "ou=people,dc=example,dc=com",
            "usersearch": "(uid={0})"
          },
          "type": "ldap"
        },
        "description": "Authorize via LDAP or Active Directory",
        "http_enabled": false
      }
    },
    "disable_intertransport_auth": false,
    "disable_rest_auth": false,
    "do_not_fail_on_forbidden": false,
    "do_not_fail_on_forbidden_empty": false,
    "filtered_alias_mode": "warn",
    "hosts_resolver_mode": "ip-only",
    "http": {
      "anonymous_auth_enabled": false,
      "xff": {
        "enabled": false,
        "internalProxies": "192\\.168\\.0\\.10|192\\.168\\.0\\.11",
        "remoteIpHeader": "X-Forwarded-For"
      }
    },
    "kibana": {
      "default_tenant": "Global",
      "index": ".kibana",
      "multitenancy_enabled": true,
      "preferred_tenants": [],
      "private_tenant_enabled": true,
      "server_username": "kibanaserver"
    },
    "multi_rolespan_enabled": true,
    "on_behalf_of": {
      "enabled": true,
      "encryption_key": "mT9vgsqzrg9K52mtqDONUtnLufJw8eo0fjw2kvBdn3k=",
      "signing_key": "dCjVPWyFp5SEIWLOKC5DK5/8F5n/8/QoUWr+5b+yozIsISR9U3pqaA6F23HtDqF768GQA7r9RRtIh1R6ihot3A=="
    },
    "privileges_evaluation_ignore_unauthorized_indices": true,
    "respect_request_indices_options": false
  }
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'config' updated."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `message` | String | A message describing the result of the operation. |

## Usage notes

This API modifies the Security plugin's core configuration directly, so it carries the following risks:

- In most cases, use the `securityadmin.sh` script, which includes validations and safeguards that prevent misconfiguration.
- Back up your current security configuration before making changes.
- Grant access to this API only to trusted administrators. A request can disable the security configuration for your entire cluster.
- Test security configuration changes in a development environment before deploying them to production.
- Provide a complete configuration. A partial update replaces the entire configuration.
- This API performs minimal validation, so an incorrect configuration might not be identified until it causes operational issues.

## Enabling this API

By default, this API is disabled for security reasons. To enable it, add the following line to `opensearch.yml`:

```yml
plugins.security.unsupported.restapi.allow_securityconfig_modification: true
```
{% include copy.html %}

For more information about granting access to the Security APIs, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
