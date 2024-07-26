---
layout: default
title: Kerberos
parent: Authentication backends
nav_order: 75
redirect_from:
---

# Kerberos

Kerberos is a robust and secure method for user authentication that prevents passwords from being sent over the internet.
It enables users to authenticate once, issuing "tickets" for secure identity verification.

Due to the nature of Kerberos, you must define some settings in `opensearch.yml` and some in `config.yml`.

## OpenSearch node configuration

In `opensearch.yml`, define the following:

```yml
plugins.security.kerberos.krb5_filepath: '/etc/krb5.conf'
plugins.security.kerberos.acceptor_keytab_filepath: 'opensearch_keytab.tab'
plugins.security.kerberos.acceptor_principal: 'HTTP/localhost'
```

Name | Description
:--- | :---
`krb5_filepath` | the path to your Kerberos configuration file. This file contains various settings regarding your Kerberos installation, for example, the realm names, hostnames, and ports of the Kerberos key distribution center (KDC).
`acceptor_keytab_filepath` | the path to the keytab file, which contains the principal that the Security plugin uses to issue requests against Kerberos.
`acceptor_principal: 'HTTP/localhost'` | defines the principal that the Security plugin uses to issue requests against Kerberos. This value must be present in the keytab file.

Due to security restrictions, the keytab file must be placed in `config` or a subdirectory, and the path in `opensearch.yml` must be relative, not absolute.
{: .note }

## Cluster security configuration

A typical Kerberos authentication domain in `config.yml` looks like this:
```yml
kerberos_auth_domain:
  enabled: true
  order: 1
  http_authenticator:
    type: kerberos
    challenge: true
    config:
      krb_debug: false
      strip_realm_from_principal: true
  authentication_backend:
    type: noop
```

Authentication against Kerberos through a browser on an HTTP level is achieved using SPNEGO. Kerberos/SPNEGO implementations vary, depending on your browser and operating system. This is important when deciding if you need to set the `challenge` flag to `true` or `false`.
As with [HTTP Basic Authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/), this flag determines how the Security plugin should react when no `Authorization` header is found in the HTTP request or if this header does not equal `negotiate`.
If set to `true`, the Security plugin sends a response with status code 401 and a `WWW-Authenticate` header set to `negotiate`. This tells the client (browser) to resend the request with the `Authorization` header set. If set to `false`, the Security plugin cannot extract the credentials from the request, and authentication fails. Setting `challenge` to `false` thus makes sense only if the Kerberos credentials are sent in the initial request.

Name | Description
:--- | :---
`krb_debug` | As the name implies, setting it to `true` will output Kerberos-specific debugging messages to `stdout`. Use this setting if you encounter problems with your Kerberos integration.
`strip_realm_from_principal` | If you set it to `true`, the Security plugin strips the realm from the user name.

Because Kerberos/SPNEGO authenticates users on an HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.
