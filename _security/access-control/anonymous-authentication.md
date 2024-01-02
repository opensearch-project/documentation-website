layout: default
title: Anonymous authentication
nav_order: 145
has_children:false
has_toc: false
redirect_from:
- /security/access-control/
- /security-plugin/configuration/concepts/
---

# Anonymous authentication

The Security plugin supports anonymous authentication where a user is able to access a cluster without providing credentials. This is useful in cases where you want lots of people to be able to access your cluster with a common set of privileges. 

## Configuration

To use anonymous authentication, you need to modify the `config.yml` file inside the `opensearch-security` configuration subdirectory of your cluster.

In the `config.yml` file, there is a `http` section which includes the following: 

```yml
http:
  anonymous_auth_enabled: <true|false>
  xff: 
    ...
```

The relevant used in this configuration are described in the following table. The `xff` setting is only shown to help when looking for the setting in the `config.yml` file. It is further explained in the [configuration](../configuration/configuration.md) file overview. 

| Setting | Description                                                                                                                                                                                                                                                                                                |
| :--- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `anonymous_auth_enabled` | Either enables or disables anonymous authentication. When you enable anonymous authentication, all defined [HTTP authenticators](#authentication) are non-challenging. Also see [The challenge setting]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/#the-challenge-setting). |

If you disable anonymous authentication, the Security plugin won't initialize if you have not provided at least one `authc`.
{: .important }

## Defining anonymous authentication privileges

When anonymous authentication is enabled, your defined HTTP authenticators still try to find user credentials inside your HTTP request.If credentials are found, the user is authenticated. If none are found, the user is authenticated as an "anonymous" user.

All anonymous users have the username "anonymous" and a single role named "anonymous_backendrole".

You can configure the privileges associated with the `opendistro_security_anonymous_backendrole` inside [roles.yml](./users-roles.md). 

It is recommended that your defined role have very limited privileges. Generally, an anonymous user should _never_ be able to write to your cluster.

Here is an example role definition for an `anonymous_users_role` which you can use as a reference for defining your own role inside `roles.yml`:

```agsl
anonymous_users_role:
  reserved: false
  hidden: false
  cluster_permissions:
  - "OPENDISTRO_SECURITY_CLUSTER_COMPOSITE_OPS"
  index_permissions:
  - index_patterns:
    - "public_index_*"
    allowed_actions:
    - "read"
```

Then inside `roles_mapping.yml` we define the appropriate mapping for this new role:

```agsl
anonymous_users_role:
  reserved: false
  hidden: false
  backend_roles: ["opendistro_security_anonymous_backendrole"]
  hosts: []
```

Notice that the role is mapped to `opendistro_security_anonymous_backendrole` meaning all users with the anonymous user backend role will have these privileges. 

You can also complete these steps using the REST API or OpenSearch Security Dashboards. 

