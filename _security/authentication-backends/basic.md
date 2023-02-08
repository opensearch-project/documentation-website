---
layout: default
title: Basic authentication
parent: Authentication backends
nav_order: 47
---

# HTTP basic authentication

To set up HTTP basic authentication, you must enable it in the `http_authenticator` section of the configuration:

```yml
http_authenticator:
  type: basic
  challenge: true
```

In most cases, you set the `challenge` flag to `true`. The flag defines the behavior of the security plugin if the `Authorization` field in the HTTP header is not set.

If `challenge` is set to `true`, the security plugin sends a response with status `UNAUTHORIZED` (401) back to the client. If the client is accessing the cluster with a browser, this triggers the authentication dialog box, and the user is prompted to enter a user name and password.

If `challenge` is set to `false` and no `Authorization` header field is set, the security plugin does not send a `WWW-Authenticate` response back to the client, and authentication fails. You might want to use this setting if you have another challenge `http_authenticator` in your configured authentication domains. One such scenario is when you plan to use basic authentication and Kerberos together.
