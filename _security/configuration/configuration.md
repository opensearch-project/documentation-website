---
layout: default
title: Configuring the security backend
parent: Configuration
nav_order: 20
redirect_from:
 - /security-plugin/configuration/configuration/
---

# Configuring the security backend

One of the first steps when setting up the Security plugin is deciding which authentication backend to use. The role played by the backend in authentication is covered in [steps 2 and 3 of the authentication flow]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/#authentication-flow). The plugin has an internal user database, but many people prefer to use an existing authentication backend, such as an LDAP server, or some combination of the two.

The primary file used to configure the authentication and authorization backend is `config.yml` in the `opensearch-security` directory of your OpenSearch configuration directory. For example, the file is located at `/usr/share/opensearch/config/opensearch-security/config.yml` in the Docker image and at `/etc/opensearch/opensearch-security/config.yml` in RPM and Debian installations. This file defines how the Security plugin retrieves user credentials, how the plugin verifies the credentials, and how the plugin fetches additional roles when the backend selected for authentication and authorization supports this feature. For information about configuring a specific backend, see [Authentication backends]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/).

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

The sections that follow describe the main elements in each part of the `config.yml` file and provide basic examples of their configuration. For a more detailed example, see the [sample file on GitHub](https://github.com/opensearch-project/security/blob/{{site.opensearch_version}}.0/config/config.yml).


## HTTP

The `http` section includes the following format:

```yml
http:
  anonymous_auth_enabled: <true|false>
  xff: # optional section
    enabled: <true|false>
    internalProxies: <string> # Regex pattern
    remoteIpHeader: <string> # Name of the header in which to look. Default is X-Forwarded-For
```

The settings used in this configuration are described in the following table.

| Setting | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :--- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `anonymous_auth_enabled` | Either enables or disables anonymous authentication. When `true`, HTTP authenticators try to find user credentials in the HTTP request. If credentials are found, the user is authenticated. If a request contains no `Authorization` header, the user is authenticated as an _anonymous_ user. This user has the username `opendistro_security_anonymous` and one backend role named `opendistro_security_anonymous_backendrole`. Requests without an `Authorization` header do not receive an authentication challenge unless they include the `auth_type` query parameter set to a value other than `anonymous`. For more information, see [The challenge setting]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/#the-challenge-setting). |
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

The `type` setting for `http_authenticator` accepts the following values.

| Value | Description |
| :--- | :--- |
| `basic` | HTTP basic authentication. For more information, see [HTTP basic authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/). |
| `kerberos` | Kerberos authentication. For more information, see [Kerberos authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/kerberos/). |
| `jwt` | JSON Web Token (JWT) authentication. For more information, see [JSON Web Token]({{site.url}}{{site.baseurl}}/security/authentication-backends/jwt/). |
| `openid` | OpenID Connect authentication. For more information, see [OpenID Connect]({{site.url}}{{site.baseurl}}/security/authentication-backends/openid-connect/). |
| `saml` | SAML authentication. For more information, see [SAML]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/). |
| `proxy`, `extended-proxy` | Proxy-based authentication. The `extended-proxy` type authenticator allows you to pass additional user attributes for use with document-level security. For more information, see [Proxy-based authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/proxy/). |
| `clientcert` | Authentication through a client TLS certificate. This certificate must be trusted by one of the root certificate authorities (CAs) in the truststore of your nodes. For more information, see [Client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/). |

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
| `internal` | Fetches backend roles from the users defined in `internal_users.yml`. |
| `ldap` | Fetches additional roles from an LDAP server. This setting requires [additional LDAP-specific configuration settings]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/). |


## Backend configuration examples

The following `config.yml` file chains two authentication domains and adds an authorization domain. The Security plugin first tries to authenticate the user against the internal user database. If that fails, it tries the LDAP server. For users authenticated by LDAP, the plugin fetches the user's LDAP groups and assigns them as backend roles:

```yml
_meta:
  type: "config"
  config_version: 2

config:
  dynamic:
    http:
      anonymous_auth_enabled: false
    authc:
      basic_internal_auth_domain:
        http_enabled: true
        order: 0
        http_authenticator:
          type: basic
          challenge: false
        authentication_backend:
          type: internal
      ldap_auth_domain:
        http_enabled: true
        order: 1
        http_authenticator:
          type: basic
          challenge: true
        authentication_backend:
          type: ldap
          config:
            hosts:
              - ldap.example.com:389
            bind_dn: cn=readonly,dc=example,dc=com
            password: <bind-password>
            userbase: ou=People,dc=example,dc=com
            usersearch: (cn={0})
            username_attribute: cn
    authz:
      ldap_roles:
        http_enabled: true
        authorization_backend:
          type: ldap
          config:
            hosts:
              - ldap.example.com:389
            bind_dn: cn=readonly,dc=example,dc=com
            password: <bind-password>
            userbase: ou=People,dc=example,dc=com
            usersearch: (cn={0})
            username_attribute: cn
            skip_users:
              - admin
              - kibanaserver
            rolebase: ou=Groups,dc=example,dc=com
            rolesearch: (uniqueMember={0})
            userrolename: disabled
            rolename: cn
```
{% include copy.html %}

In this example, only the last authentication domain sets `challenge` to `true`, so a request without credentials receives a single HTTP basic authentication challenge. The `skip_users` setting prevents the plugin from looking up LDAP groups for internal users. This example connects to the LDAP server without TLS. In production, enable TLS for LDAP connections. For more information, see [Active Directory and LDAP]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/).

After you modify `config.yml`, apply the changes using [`securityadmin.sh`]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/). The default `config.yml` file included in your OpenSearch distribution contains additional configuration examples.


## Authentication and authorization over gRPC
**Introduced 3.5**
{: .label .label-purple }

When the Security plugin is enabled and not running in SSL-only mode, requests over gRPC are subject to authentication and authorization. The gRPC transport shares all authentication backends with the HTTP layer and respects the `http_enabled` setting in authentication domains. Only JWT authentication is supported over gRPC. For more information, see [Using JWT authentication with gRPC]({{site.url}}{{site.baseurl}}/security/authentication-backends/jwt/#using-jwt-authentication-with-grpc).

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

## Troubleshooting

For solutions to common configuration issues, see the following pages:

* [Troubleshooting OpenID Connect]({{site.url}}{{site.baseurl}}/security/authentication-backends/troubleshoot-openid-connect/)
* [Troubleshooting SAML]({{site.url}}{{site.baseurl}}/security/authentication-backends/troubleshoot-saml/)
* [Troubleshooting TLS]({{site.url}}{{site.baseurl}}/security/configuration/troubleshoot-tls/)
* [Troubleshooting securityadmin.sh]({{site.url}}{{site.baseurl}}/security/configuration/troubleshoot-security-admin/)
