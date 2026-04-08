---
layout: default
title: Configuration APIs
parent: Security APIs
has_children: true
nav_order: 20
redirect_from:
  - /api-reference/security/configuration/
canonical_url: https://docs.opensearch.org/latest/api-reference/security/configuration/index/
---

# Configuration APIs
**Introduced 1.0**
{: .label .label-purple }

The Configuration APIs provide programmatic access for managing, validating, and upgrading Security plugin configuration components. These APIs help ensure that your security settings remain compatible and effective as your OpenSearch cluster evolves.

Security configurations may require updates in the following scenarios:

- Upgrading to a new version of OpenSearch or the Security plugin
- Enabling new features that require updated settings
- Migrating configurations between environments
- Troubleshooting security issues

## When to use

Use the Configuration APIs to perform the following actions:

- Identify outdated or incompatible configuration components.
- Perform automatic upgrades to maintain compatibility.
- Validate the structure and integrity of your security configuration.
- Manage versioning of security settings.

## Available APIs

- [Upgrade Check API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/upgrade-check/): Checks your current configuration for compatibility with your OpenSearch version and identifies components that need to be upgraded.

- [Upgrade Perform API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/upgrade-perform/): Applies updates to the security configuration, based on the results of the Upgrade Check API.

- [Update Security Configuration API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/update-configuration/): Creates or updates the security configuration.

- [Patch Security Configuration API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/patch-configuration/): Updates specific fields of the security configuration without replacing the entire configuration document. 

- [Get Security Configuration API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/get-configuration/): Retrieves the current security configuration.

## `authc`

When configuring authentication domains (`authc`), you define how OpenSearch extracts user information and backend roles from the authentication response. This is especially important when integrating with external systems such as SAML, OIDC, or custom authentication backends.

To support role mapping, use the following configuration keys:

- `subject_key`: Specifies where to find the user identifier in the authentication response
- `roles_key`: Indicates where to find the backend roles in the authentication response

OpenSearch uses the extracted backend roles in role mappings to assign roles to users.

The following example shows how to configure an authentication domain to extract the username from `"preferred_username"` and backend roles from `"groups"` in a JWT token:

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

The `authz` section handles authorization by retrieving backend roles from external sources such as LDAP. This allows OpenSearch to authenticate users through one method (for example, basic authentication or SAML) and authorize them based on role information stored in a separate directory.

A typical `authz` configuration includes the following elements:

- `roles_search_filter`: The LDAP search filter used to find roles for a user
- `rolebase`: The Distinguished Name (DN) to search for roles
- `rolesearch`: The search pattern to use when looking for roles
- `rolename`: The attribute that contains the role name

This setup is useful in enterprise environments where identities are managed in one system and roles in another.

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


The following example shows how to map an LDAP group to an OpenSearch role. If a user belongs to the LDAP group `cn=analysts,ou=groups,dc=example,dc=com`, the backend role `analysts` is extracted and mapped to the `data_access_role`:

```json
{
  "role_mappings": {
    "data_access_role": {
      "backend_roles": ["analysts", "researchers"]
    }
  }
}
```

## Configuration components

These APIs manage the following configuration components:

- **Roles**: Permissions for actions users can perform
- **Role mappings**: Mappings for users or backend roles with specific roles
- **Action groups**: Collections of permissions used to simplify role definitions
- **Internal users**: User credentials stored directly in OpenSearch
- **Tenants**: Isolated workspaces that support multi-tenancy
- **Security configuration**: Global security settings

## Best practices

When using the Configuration APIs, remember the following best practices:

- Always back up your security configuration before making changes.
- Run the Upgrade Check API before using the Upgrade Perform API.
- Test changes in a non-production environment before deploying to production.
- Integrate these APIs into your regular upgrade and maintenance workflows.
- Validate functionality after applying configuration changes.