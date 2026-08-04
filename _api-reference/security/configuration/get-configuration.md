---
layout: default
title: Get Configuration API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/api-reference/security/configuration/get-configuration/
---

# Get Security Configuration API
**Introduced 1.0**
{: .label .label-purple }

The Get Security Configuration API retrieves the current security configuration. This configuration includes authentication domains and other security-related configurations.

<!-- spec_insert_start
api: security.get_configuration
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/securityconfig
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
component: example_code
rest: GET /_plugins/_security/api/securityconfig
-->
{% capture step1_rest %}
GET /_plugins/_security/api/securityconfig
{% endcapture %}

{% capture step1_python %}

response = client.security.get_configuration()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "config": {
    "dynamic": {
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
            "type": "internal",
            "config": {}
          }
        }
      },
      "authz": {
        "roles_from_myldap": {
          "http_enabled": true,
          "transport_enabled": true,
          "authorization_backend": {
            "type": "ldap",
            "config": {
              "roles_search_filter": "(uniqueMember={0})",
              "host": "ldap.example.com",
              "port": 389
            }
          }
        }
      },
      "multi_rolespan_enabled": true,
      "hosts_resolver_mode": "ip-only",
      "do_not_fail_on_forbidden": false
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `config` | Object | The root object containing the security configuration. |

<details markdown="block">
  <summary>
    Response body fields: <code>config</code>
  </summary>
  {: .text-delta}

`config` is a JSON object that contains the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `dynamic` | Object | The main configuration object containing all security configuration settings. Includes authentication domains (`authc`), authorization settings (`authz`), and various security behaviors. |

</details>

## Usage notes
