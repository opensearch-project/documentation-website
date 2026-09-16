---
layout: default
title: Configuration APIs
parent: Security APIs
nav_order: 110
has_children: true
has_toc: false
redirect_from:
  - /api-reference/security/configuration/
  - /api-reference/security/configuration/index/
  - /security/api/configuration/
---

# Configuration APIs

The configuration APIs retrieve, replace, patch, and upgrade the Security plugin configuration.

OpenSearch supports the following configuration APIs.

| API | Description |
| :--- | :--- |
| [Create or Update Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/update-configuration/) | Creates or replaces the Security plugin configuration. |
| [Patch Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/patch-configuration/) | Updates individual parts of the Security plugin configuration without replacing the entire configuration document. |
| [Get Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/get-configuration/) | Retrieves the current Security plugin configuration, including its authentication and authorization domains. |
| [Check for Upgrades API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-check/) | Checks whether any configuration components require an upgrade and lists the upgrades that are available. |
| [Perform Upgrade API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-perform/) | Applies the upgrades that the Check for Upgrades API identifies. |

These APIs manage the following configuration components:

- Roles, which define the actions that users can perform
- Role mappings, which map users or backend roles to specific roles
- Action groups, which are collections of permissions used to simplify role definitions
- Internal users, whose credentials are stored directly in OpenSearch
- Tenants, which are isolated workspaces that support multi-tenancy
- The security configuration, which contains global security settings

## `authc`

Authentication domains (`authc`) define how OpenSearch extracts user information and backend roles from the authentication response. This is especially important when integrating with external systems such as SAML, OpenID Connect (OIDC), or custom authentication backends.

To support role mapping, use the following configuration keys:

- `subject_key`: Specifies where to find the user identifier in the authentication response.
- `roles_key`: Indicates where to find the backend roles in the authentication response.

OpenSearch uses the extracted backend roles in role mappings to assign roles to users.

The following example configures an authentication domain to extract the user name from `preferred_username` and backend roles from `groups` in a JSON Web Token (JWT):

```json
{
  "authc": {
    "oidc_auth_domain": {
      "http_enabled": true,
      "transport_enabled": false,
      "order": 1,
      "http_authenticator": {
        "type": "openid",
        "challenge": false,
        "config": {
          "subject_key": "preferred_username",
          "roles_key": "groups",
          "openid_connect_url": "https://identity.example.com/.well-known/openid-configuration"
        }
      },
      "authentication_backend": {
        "type": "noop",
        "config": {}
      }
    }
  }
}
```
{% include copy.html %}

You can then use the extracted backend roles in role mappings. The following configuration assigns the `analyst_role` to users whose authentication response includes either `analyst_group` or `data_scientist_group`:

```json
{
  "role_mappings": {
    "analyst_role": {
      "backend_roles": ["analyst_group", "data_scientist_group"]
    }
  }
}
```
{% include copy.html %}

## `authz`

The `authz` section handles authorization by retrieving backend roles from external sources such as LDAP. This allows OpenSearch to authenticate users through one method, such as basic authentication or SAML, and authorize them based on role information stored in a separate directory. This setup is useful in enterprise environments in which identities are managed in one system and roles in another.

A typical `authz` configuration includes the following elements:

- `roles_search_filter`: The LDAP search filter used to find roles for a user.
- `rolebase`: The distinguished name (DN) to search for roles.
- `rolesearch`: The search pattern to use when looking for roles.
- `rolename`: The attribute that contains the role name.

The following example connects to an LDAP directory, uses the `rolesearch` filter to find user groups, and extracts each group as a backend role using the `rolename` attribute:

```json
{
  "authz": {
    "ldap_role_authz": {
      "http_enabled": true,
      "transport_enabled": true,
      "authorization_backend": {
        "type": "ldap",
        "config": {
          "rolebase": "ou=groups,dc=example,dc=com",
          "rolesearch": "(uniqueMember={0})",
          "rolename": "cn",
          "userbase": "ou=people,dc=example,dc=com",
          "usersearch": "(uid={0})",
          "username_attribute": "uid"
        }
      }
    }
  }
}
```
{% include copy.html %}

The following example maps an LDAP group to an OpenSearch role. If a user belongs to the LDAP group `cn=analysts,ou=groups,dc=example,dc=com`, then the backend role `analysts` is extracted and mapped to the `data_access_role`:

```json
{
  "role_mappings": {
    "data_access_role": {
      "backend_roles": ["analysts", "researchers"]
    }
  }
}
```
{% include copy.html %}

## Best practices

When using the configuration APIs, follow these best practices:

- Always back up your security configuration before making changes.
- Run the Check for Upgrades API before using the Perform Upgrade API.
- Test changes in a non-production environment before deploying to production.
- Integrate these APIs into your regular upgrade and maintenance workflows.
- Validate functionality after applying configuration changes.
