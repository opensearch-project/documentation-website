---
layout: default
title: Kerberos
parent: Authentication backends
nav_order: 75
---

# Kerberos

Kerberos is a robust and secure method for user authentication that prevents passwords from being sent over the internet by issuing "tickets" for secure identity verification.

In order to use Kerberos authentication, you must set the following settings in `opensearch.yml` and `config.yml`.

## OpenSearch node configuration

In `opensearch.yml`, define the following settings:

```yml
plugins.security.kerberos.krb5_filepath: 'krb5.conf'
plugins.security.kerberos.acceptor_keytab_filepath: 'opensearch_keytab.tab'
plugins.security.kerberos.acceptor_principal: 'HTTP/localhost'
```

Name | Description
:--- | :---
`krb5_filepath` | The path to your Kerberos configuration file. This file contains various settings regarding your Kerberos installation, for example, the `realm` names, `hostnames`, and ports of the Kerberos key distribution center (KDC).
`acceptor_keytab_filepath` | The path to the `keytab` file, which contains the principal that the Security plugin uses to issue requests through Kerberos.
`acceptor_principal` | The principal that the Security plugin uses to issue requests through Kerberos. This value must be present in the `keytab` file.

Because of security restrictions, the `keytab` and `krb5.conf` files must be placed in the `config` directory or its subdirectory, and their paths in `opensearch.yml` must be relative, not absolute.
{: .note }

## Cluster security configuration

The following example shows a typical Kerberos authentication domain in `config.yml`:

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

Authentication through Kerberos when using a browser on an HTTP level is achieved using SPNEGO. Kerberos/SPNEGO implementations vary, depending on your browser and operating system. This is important when deciding if you need to set the `challenge` flag to `true` or `false`.

As with [HTTP Basic Authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/), this flag determines how the Security plugin should react when no `Authorization` header is found in the HTTP request or if this header does not equal `negotiate`.

If set to `true`, the Security plugin sends a response with status code 401 and a `WWW-Authenticate` header set to `negotiate`. This tells the client (browser) to resend the request with the `Authorization` header set. If set to `false`, the Security plugin cannot extract the credentials from the request, and authentication fails. Setting `challenge` to `false` thus makes sense only if the Kerberos credentials are sent in the initial request.

Name | Description
:--- | :---
`krb_debug` | As the name implies, setting it to `true` outputs Kerberos-specific debugging messages to `stdout`. Use this setting if you encounter problems with your Kerberos integration. Default is `false`.
`strip_realm_from_principal` | When set it to `true`, the Security plugin strips the realm from the user name. Default: `true`.

Because Kerberos/SPNEGO authenticates users on an HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.
