---
layout: default
title: Basic authentication
parent: Authentication backends
nav_order: 46
redirect_from:
---


# Basic authentication

## HTTP basic authentication

To set up HTTP basic authentication, you must enable it in the `http_authenticator` section of the configuration:
<!--- provide more description about what basic gives you and describe the function of the internal database --->

```yml
http_authenticator:
  type: basic
  challenge: true
```

In most cases, you set the `challenge` flag to `true`. The flag defines the behavior of the Security plugin if the `Authorization` field in the HTTP header is not set.

If `challenge` is set to `true`, the Security plugin sends a response with status `UNAUTHORIZED` (401) back to the client. If the client is accessing the cluster with a browser, this triggers the authentication dialog box, and the user is prompted to enter a user name and password.

If `challenge` is set to `false` and no `Authorization` header field is set, the Security plugin does not send a `WWW-Authenticate` response back to the client, and authentication fails. Consider using this setting if you have more than one challenge `http_authenticator` keys in your configured authentication domains. This might be the case, for example, when you plan to use basic authentication and OpenID Connect together.

