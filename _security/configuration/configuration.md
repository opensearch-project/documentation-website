---
layout: default
title: Configuring the Security backend
parent: Configuration
nav_order: 5
redirect_from:
 - /security-plugin/configuration/configuration/
canonical_url: https://docs.opensearch.org/docs/latest/security/configuration/configuration/
---

# Configuring the Security backend

One of the first steps when setting up the Security plugin is deciding which authentication backend to use. The role played by the backend in authentication is covered in [steps 2 and 3 of the authentication flow]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/#authentication-flow). The plugin has an internal user database, but many people prefer to use an existing authentication backend, such as an LDAP server, or some combination of the two.

The primary file used to configure the authentication and authorization backend is `/usr/share/opensearch/config/opensearch-security/config.yml`. This file defines how the Security plugin retrieves user credentials, how the plugin verifies the credentials, and how the plugin fetches additional roles when the backend selected for authentication and authorization supports this feature. This topic provides a basic overview of the configuration file and its requirements for setting up security. For information about configuring a specific backend, see [Authentication backends]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/).

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

The sections that follow describe the main elements in each part of the `config.yml` file and provide basic examples of their configuration. For a more detailed example, see the [sample file on GitHub](https://github.com/opensearch-project/security/blob/main/config/config.yml).


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

| Setting | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :--- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `anonymous_auth_enabled` | Either enables or disables anonymous authentication. When `true`, HTTP authenticators try to find user credentials in the HTTP request. If credentials are found, the user is authenticated. If none are found, the user is authenticated as an _anonymous_ user. This user then has the username `anonymous` and one role named `anonymous_backendrole`. When you enable anonymous authentication, all defined HTTP authenticators are non-challenging. For more information, see [The challenge setting]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/#the-challenge-setting). |
| `xff` | Used to configure proxy-based authentication. For more information about this backend, see [Proxy-based authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/proxy/).                                                                                                                                                                                                                                                                                                                                                                                                                           |

For instructions on how to configure anonymous authentication, see [Anonymous authentication]({{site.url}}{{site.baseurl}}/security/access-control/anonymous-authentication/).  
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

You can use more than one authentication domain. Each authentication domain has a name (for example, `basic_auth_internal`), settings for enabling the domain on the REST and transport layers, and an `order`. The order makes it possible to chain authentication domains together. The Security plugin uses them in the order that you provide. If the user successfully authenticates with one domain, the Security plugin skips the remaining domains.

Settings that are typically found in this part of the configuration are included in the following table.

| Setting | Description |
| :--- | :--- |
| `http_enabled` | Enables or disables authentication on the REST layer. Default is `true` (enabled). |
| `transport_enabled` | Enables or disables authentication on the transport layer. Default is `true` (enabled). |
| `order` | Determines the order in which an authentication domain is queried with an authentication request when multiple backends are configured in combination. Once authentication succeeds, any remaining domains do not need to be queried. Its value is an integer. |

The `http_authenticator` definition specifies the authentication method for the HTTP layer. The following example shows the syntax used for defining an HTTP authenticator:

```yml
http_authenticator:
  type: <type>
  challenge: <true|false>
  config:
    ...
```

The `type` setting for `http_authenticator` accepts the following values. For more information about each of the authentication options, see the links to authentication backends in [Next steps](#next-steps).

| Value | Description |
| :--- | :--- |
| `basic` | HTTP basic authentication. For more information about using basic authentication, see the HTTP basic authentication documentation. |
| `kerberos` | Kerberos authentication. See the Kerberos documentation for additional configuration information. |
| `jwt` | JSON Web Token (JWT) authentication. See the JSON Web Token documentation for additional configuration information. |
| `openid` | OpenID Connect authentication. See the OpenID Connect documentation for additional configuration information. |
| `saml` | SAML authentication. See the SAML documentation for additional configuration information. |
| `proxy`, `extended-proxy` | Proxy-based authentication. The `extended-proxy` type authenticator allows you to pass additional user attributes for use with document-level security. See the Proxy-based authentication documentation for additional configuration information. |
| `clientcert` | Authentication through a client TLS certificate. This certificate must be trusted by one of the root certificate authorities (CAs) in the truststore of your nodes. See the Client certificate authentication documentation for additional configuration information. |

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
| `ldap` | Authenticate users against an LDAP server. This setting requires [additional LDAP-specific configuration settings]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/). |


## Authorization

The `authz` configuration is used to extract backend roles from an LDAP implementation. After the user has been authenticated, the Security plugin can optionally collect additional roles from the backend system. The authorization configuration has the following format:

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

You can define multiple entries in this section, as with authentication entries. In this case, however, the execution order is not relevant and the `order` setting is not used.

The following table shows the possible values for the `type` setting under `authorization_backend`.

| Value | Description |
| :--- | :--- |
| `noop` | Skips the authorization configuration step altogether. |
| `ldap` | Fetches additional roles from an LDAP server. This setting requires [additional LDAP-specific configuration settings]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/). |


## Backend configuration examples

The default `config/opensearch-security/config.yml` file included in your OpenSearch distribution contains many configuration examples. Use these examples as a starting point and customize them to your needs. 


## Next steps

To learn about configuring the authentication backends, see the [Authentication backends]({{site.url}}{{site.baseurl}}/security/authentication-backends/) documentation. Alternatively, you can view documentation for a specific backend by using the links in the following list of topics:

* [HTTP basic authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/)
* [JSON Web Token]({{site.url}}{{site.baseurl}}/security/authentication-backends/jwt/)
* [OpenID Connect]({{site.url}}{{site.baseurl}}/security/authentication-backends/openid-connect/)
* [SAML]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/)
* [Active Directory and LDAP]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/)
* [Proxy-based authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/proxy/)
* [Client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/)
* [Kerberos authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/kerberos/)
