---
layout: default
title: HTTP basic authentication
parent: Authentication backends
nav_order: 46
redirect_from:
---


# HTTP basic authentication

When Security is configured for HTTP basic authentication, it provides a simple challenge and response process for gaining access to OpenSearch and its resources, which prompts you to sign in with a username and password. To set up HTTP basic authentication, you must enable it in the `http_authenticator` section of the configuration by specifying `type` as `basic`, as shown in the following example:

```yml
authc:
  basic_internal_auth_domain:
    description: "Authenticate via HTTP basic against internal users database"
    http_enabled: true
    transport_enabled: true
    http_authenticator:
      type: basic
      challenge: true
    authentication_backend:
      type: internal
```

Additionally, you can specify the internal user database as the authentication backend by specifying `internal` as the type for `authentication_backend`. See [The internal user database](#the-internal-user-database) for information about this backend.

Once `basic` is specified for the type of HTTP authenticator and `internal` is specified for the type of authentication backend, no further configuration in `config.yml` is needed, unless you plan to use additional authentication backends with HTTP basic authentication. For considerations related to this type of setup, continue reading for more information about the `challenge` setting.


## The challenge setting

In most cases, it's appropriate to set `challenge` to `true` for basic authentication. This setting defines the behavior of the Security plugin when the `Authorization` field in the HTTP header is not specified. By default, the setting is `true`.

When `challenge` is set to `true`, the Security plugin sends a response with the status `UNAUTHORIZED` (401) back to the client. If the client is accessing the cluster with a browser, this triggers the authentication dialog box, and the user is prompted to enter a username and password.

When `challenge` is set to `false` and an `Authorization` header has not been specified in the request, the Security plugin does not send a `WWW-Authenticate` response back to the client, and authentication fails. Consider using this setting when you have more than one challenge `http_authenticator` setting included in your configured authentication domains. This might be the case, for example, when you plan to use basic authentication and OpenID Connect together.

When you define multiple HTTP authenticators, make sure to put non-challenging authenticators first---such as `proxy`, `clientcert`, and `jwt`---and challenging HTTP authenticators last. Because it's not possible to challenge a client with two different authentication methods (for example Kerberos and Basic) only one can have the challenge setting set to `true`. You can cope with this situation by using pre-authentication: in other words, by sending an HTTP basic authentication header in the request.
{: .note }


## The internal user database

When using HTTP basic authentication, the internal user database stores the internal users, their hashed passwords, and other user attributes such as roles and backend roles. Users and their settings are kept in the `internal_users.yml` configuration file. For more information about this file, see [internal_users.yml](/security/configuration/yaml/#internal_usersyml) in the security configuration documentation.

