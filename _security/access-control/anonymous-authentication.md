---
layout: default
title: Anonymous authentication
parent: Access control
nav_order: 145
---

# Anonymous authentication

The Security plugin supports anonymous authentication where a user is able to access a cluster without providing credentials. This is useful in cases where you want lots of people to be able to access your cluster with a common set of privileges. 

## Configuration

To enable anonymous authentication, you need to modify the `config.yml` file inside the `opensearch-security` configuration subdirectory of your cluster.

In the `config.yml` file, there is an `http` section which includes the `anonymous_auth_enabled` setting: 

```yml
http:
  anonymous_auth_enabled: <true|false>
  ...
```

The following table describes the `anonymous_auth_enabled` setting. For more information, see the [configuration]({{site.url}}{{site.baseurl}}/security/configuration/configuration/) file overview. 

| Setting | Description |
| :--- | :--- |
| `anonymous_auth_enabled` | Either enables or disables anonymous authentication. When you enable anonymous authentication, all defined HTTP authenticators are non-challenging. See [The challenge setting]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/#the-challenge-setting). |

If you disable anonymous authentication, you must provide at least one `authc` in order for the Security plugin to initialize successfully.
{: .important }

## Defining anonymous authentication privileges

When anonymous authentication is enabled, your defined HTTP authenticators still try to find user credentials inside your HTTP request. If credentials are found, the user is authenticated. If none are found, the user is authenticated as an `anonymous` user.

All anonymous users have the username `anonymous` and a single role named `anonymous_backendrole`.

You can configure the privileges associated with the `opendistro_security_anonymous_backendrole` in the [roles.yml]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/) file. 

We recommend that your defined role have very limited privileges. Generally, an anonymous user should **never** be able to write to your cluster.
{: .important}

The following is an example role definition for an `anonymous_users_role`. You can use this example as a reference for defining your own role in the `roles.yml` file:

```yaml
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
{% include copy.html %}

Then, in the `roles_mapping.yml` file, you can define the appropriate mapping for this new role:

```yaml
anonymous_users_role:
  reserved: false
  hidden: false
  backend_roles: ["opendistro_security_anonymous_backendrole"]
  hosts: []
```
{% include copy.html %}

Notice that the role is mapped to `opendistro_security_anonymous_backendrole`, which means that all users with the anonymous user backend role will have these privileges. 

Alternatively, you can complete these steps using the REST API or OpenSearch Security Dashboards. 

