---
layout: default
title: Configuring the Security backend
parent: Configuration
nav_order: 5
redirect_from:
 - /security-plugin/configuration/configuration/
---

# Configuring the Security backend

One of the first steps when setting up the Security plugin is deciding which authentication backend to use. The part that the backend plays in authentication is covered in [steps 2–3 of the authentication flow]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/#authentication-flow). The plugin has an internal user database, but many people prefer to use an existing authentication backend, such as an LDAP server, or some combination of the two.

The primary file used to configure an authentication and authorization backend is `config/opensearch-security/config.yml`. This file defines how the Security plugin retrieves user credentials, how it verifies these credentials, and how it fetches additional roles when the backend selected for authentication and authorization supports this feature. This topic provides a basic overview of the configuration file and its requirements for setting up security. For information about configuring a specific backend, see [Authentication backends]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/).

The `config.yml` file includes three main parts:

```yml
config:
  dynamic:
    http:
      ...
    authc:
      ...
    authz:
      ...
```

The sections that follow describe the main elements in each part of the `config.yml` file and provide basic examples for their configuration. For a more detailed example, see the [sample file on GitHub](https://github.com/opensearch-project/security/blob/main/config/config.yml).


## HTTP

The `http` section includes the following format:

```yml
http:
  anonymous_auth_enabled: <true|false>
  xff: # optional section
    enabled: <true|false>
    internalProxies: <string> # Regex pattern
    remoteIpHeader: <string> # Name of the header in which to look. Typically: x-forwarded-for
    proxiesHeader: <string>
    trustedProxies: <string> # Regex pattern
```

The settings used in this configuration are described in the following table.

| Setting | Description |
| :--- | :--- |
| `anonymous_auth_enabled` | Either enables or disables anonymous authentication. When `true`, HTTP authenticators try to find user credentials in the HTTP request. If credentials are found, the user gets regularly authenticated <!--- what does "regularly authenticated" mean? --->. If none are found, the user is authenticated as an "anonymous" user. This user then has the username "anonymous" and one role named "anonymous_backendrole". When you enable anonymous authentication, all HTTP authenticators do not challenge. |
| `xff` | Used to configure proxy-based authentication. For more information about this backend, see [Proxy-based authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/proxy/). |

If you disable anonymous authentication, the Security plugin won't initialize if you have not provided at least one `authc`.
{: .important }


## Authentication

The `authc` section has the following format:

```yml
authc:
  <domain_name>:
    http_enabled: <true|false>
    transport_enabled: <true|false>
    order: <integer>
    http_authenticator:
      ...
    authentication_backend:
      ...
```

An entry in the `authc` section is called an *authentication domain*. It specifies where to get the user credentials and against which backend they should be authenticated.

You can use more than one authentication domain. Each authentication domain has a name (for example, `basic_auth_internal`), `enabled` flags, and an `order`. The order makes it possible to chain authentication domains together. The Security plugin uses them in the order that you provide. If the user successfully authenticates with one domain, the Security plugin skips the remaining domains.

`http_authenticator` specifies which authentication method that you want to use on the HTTP layer.

The following example shows the syntax used for defining an authenticator on the HTTP layer:

```yml
http_authenticator:
  type: <type>
  challenge: <true|false>
  config:
    ...
```

The `type` setting for `http_authenticator` allows the following values.

| Value | Description |
| :--- | :--- |
| `basic` | HTTP basic authentication. No additional configuration is needed. |
| `jwt` | JSON Web Token (JWT) authentication. Additional configuration is needed. See [Configuring JWTs]({{site.url}}{{site.baseurl}}/security/authentication-backends/jwt/#configuring-jwts) for more information. |
| `clientcert` | Authentication through a client TLS certificate. This certificate must be trusted by one of the root CAs in the truststore of your nodes. |

After setting an HTTP authenticator, you must specify against which backend system you want to authenticate the user:

```yml
authentication_backend:
  type: <type>
  config:
    ...
```

The following table shows the possible values for the `type` setting under `authentication_backend`.

| Value | Description |
| :--- | :--- |
| `noop` | No further authentication against any backend system is performed. Use `noop` if the HTTP authenticator has already authenticated the user completely, as in the case of JWT or client certificate authentication. |
| `internal` | Use the users and roles defined in `internal_users.yml` for authentication. |
| `ldap` | Authenticate users against an LDAP server. This setting requires [additional, LDAP-specific configuration settings]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/). |


## Authorization

After the user has been authenticated, the Security plugin can optionally collect additional roles from backend systems. The authorization configuration has the following format:

```yml
authz:
  <name>:
    http_enabled: <true|false>
    transport_enabled: <true|false>
    authorization_backend:
      type: <type>
      config:
        ...
```

You can define multiple entries in this section the same way as you can for authentication entries. In this case, execution order is not relevant, so there is no `order` field.

The following table shows the possible values for the `type` setting under `authorization_backend`.

| Value | Description |
| :--- | :--- |
| `noop` | Skip this step altogether. |
| `ldap` | Fetch additional roles from an LDAP server. This setting requires [additional, LDAP-specific configuration settings]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/). |


## Backend configuration examples

The default `config/opensearch-security/config.yml` file included in your OpenSearch distribution contains many configuration examples. Use these examples as a starting point and customize them to your needs. 


## Next steps

To learn about configuring supported authentication backends, see the relevant topic for each type in the [Authentication backends]({{site.url}}{{site.baseurl}}/security/authentication-backends/) documentation.

<!--- Remvoving Kerberos documentation until issue #907 is resolved.
### Kerberos

Kerberos authentication does not work with OpenSearch Dashboards. To track OpenSearch's progress in adding support for Kerberos in OpenSearch Dashboards, see [issue #907](https://github.com/opensearch-project/security-dashboards-plugin/issues/907) in the Dashboard's Security plugin repository. 
{: .warning }

Due to the nature of Kerberos, you must define some settings in `opensearch.yml` and some in `config.yml`.

In `opensearch.yml`, define the following:

```yml
plugins.security.kerberos.krb5_filepath: '/etc/krb5.conf'
plugins.security.kerberos.acceptor_keytab_filepath: 'eskeytab.tab'
```

- `plugins.security.kerberos.krb5_filepath` defines the path to your Kerberos configuration file. This file contains various settings regarding your Kerberos installation, for example, the realm names, hostnames, and ports of the Kerberos key distribution center (KDC).

- `plugins.security.kerberos.acceptor_keytab_filepath` defines the path to the keytab file, which contains the principal that the Security plugin uses to issue requests against Kerberos.

- `plugins.security.kerberos.acceptor_principal: 'HTTP/localhost'` defines the principal that the Security plugin uses to issue requests against Kerberos. This value must be present in the keytab file.

Due to security restrictions, the keytab file must be placed in `config` or a subdirectory, and the path in `opensearch.yml` must be relative, not absolute.
{: .note }


#### Dynamic configuration

A typical Kerberos authentication domain in `config.yml` looks like this:

```yml
    authc:
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

As with [HTTP Basic Authentication](#http-basic), this flag determines how the Security plugin should react when no `Authorization` header is found in the HTTP request or if this header does not equal `negotiate`.

If set to `true`, the Security plugin sends a response with status code 401 and a `WWW-Authenticate` header set to `negotiate`. This tells the client (browser) to resend the request with the `Authorization` header set. If set to `false`, the Security plugin cannot extract the credentials from the request, and authentication fails. Setting `challenge` to `false` thus makes sense only if the Kerberos credentials are sent in the initial request.

As the name implies, setting `krb_debug` to `true` will output Kerberos-specific debugging messages to `stdout`. Use this setting if you encounter problems with your Kerberos integration.

If you set `strip_realm_from_principal` to `true`, the Security plugin strips the realm from the user name.


#### Authentication backend

Because Kerberos/SPNEGO authenticates users on an HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.
--->

