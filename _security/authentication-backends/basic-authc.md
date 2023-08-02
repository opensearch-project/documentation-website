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
http_authenticator:
  type: basic
  challenge: true
```

Once `basic` is specified for the type of HTTP authenticator, no further configuration is needed, unless you plan to use additional authentication backends with HTTP basic authentication. For considerations related to this type of setup, continue reading for more information about the `challenge` setting.

## The challenge setting

In most cases, it's appropriate to set `challenge` to `true` for basic authentication. This setting defines the behavior of the Security plugin when the `Authorization` field in the HTTP header is not specified. By default, the setting is `true`.

When `challenge` is set to `true`, the Security plugin sends a response with the status `UNAUTHORIZED` (401) back to the client. If the client is accessing the cluster with a browser, this triggers the authentication dialog box, and the user is prompted to enter a username and password.

When `challenge` is set to `false` and an `Authorization` header has not been specified in the request, the Security plugin does not send a `WWW-Authenticate` response back to the client, and authentication fails. Consider using this setting when you have more than one challenge `http_authenticator` setting included in your configured authentication domains. This might be the case, for example, when you plan to use basic authentication and OpenID Connect together.


## The internal user database

