---
layout: default
title: Basic authentication
parent: Authentication backends
nav_order: 46
redirect_from:
---


# HTTP basic authentication

When Security is configured for HTTP basic authentication, it provides a simple challenge and response process for gaining acccess to OpenSearch and its resources, which prompts you to sign in with a username and password. To set up HTTP basic authentication, you must enable it in the `http_authenticator` section of the configuration by specifying `type` as `basic`, as shown in the following example:
<!--- provide more description about what basic gives you and describe the function of the internal database --->

```yml
http_authenticator:
  type: basic
  challenge: true
```

In most cases, it's appropriate to set `challenge` to `true`. This setting defines the behavior of the Security plugin when the `Authorization` field in the HTTP header is not specified.

If `challenge` is set to `true`, the Security plugin sends a response with status `UNAUTHORIZED` (401) back to the client. If the client is accessing the cluster with a browser, this triggers the authentication dialog box, and the user is prompted to enter a username and password.

When `challenge` is set to `false` and no `Authorization` header field is set, the Security plugin does not send a `WWW-Authenticate` response back to the client, and authentication fails. Consider using this setting if you have more than one challenge `http_authenticator` keys in your configured authentication domains. This might be the case, for example, when you plan to use basic authentication and OpenID Connect together.

When the Authorization header is specified, ...

## The internal user database

