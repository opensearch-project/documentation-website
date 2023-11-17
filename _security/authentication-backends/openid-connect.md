---
layout: default
title: OpenID Connect
parent: Authentication backends
nav_order: 50
redirect_from:
  - /security-plugin/configuration/openid-connect/
---

# OpenID Connect

The Security plugin can integrate with identify providers that use the OpenID Connect standard. This feature enables the following:

* Automatic configuration

  Point the Security plugin to the metadata of your identity provider (IdP), and the Security plugin uses that data for configuration.

* Automatic key fetching

  The Security plugin automatically retrieves the public key for validating the JSON Web Tokens (JWTs) from the JSON Web Key Set (JWKS) endpoint of your IdP. You don't have to configure keys or shared secrets in `config.yml`.

* Key rollover

  You can change the keys used for signing the JWTs directly in your IdP. If the Security plugin detects an unknown key, it tries to retrieve it from the IdP. This rollover is transparent to the user.

* OpenSearch Dashboards as single sign-on or as one option among multiple authentication types in the Dashboards sign-in window.


## Configure OpenID Connect integration

To integrate with an OpenID IdP, set up an authentication domain and choose `openid` as the HTTP authentication type. JWTs already contain all of the information required to verify the request, so set `challenge` to `false` and `authentication_backend` to `noop`.

This is the minimal configuration:

```yml
openid_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: openid
    challenge: false
    config:
      subject_key: preferred_username
      roles_key: roles
      openid_connect_url: https://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration
  authentication_backend:
    type: noop
```

The following table shows the configuration parameters.

Name | Description
:--- | :---
`openid_connect_url` | The URL of your IdP where the Security plugin can find the OpenID Connect metadata/configuration settings. This URL differs between IdPs. Required when using OpenID Connect as your backend.
`jwt_header` | The HTTP header that stores the token. Typically the `Authorization` header with the `Bearer` schema: `Authorization: Bearer <token>`. Optional. Default is `Authorization`.
`jwt_url_parameter` | If the token is not transmitted in the HTTP header, but as an URL parameter, define the name of the parameter here. Optional.
`subject_key` | The key in the JSON payload that stores the user's name. If not defined, the [subject](https://tools.ietf.org/html/rfc7519#section-4.1.2) registered claim is used. Most IdP providers use the `preferred_username` claim. Optional.
`roles_key` | The key in the JSON payload that stores the user's roles. The value of this key must be a comma-separated list of roles. Required only if you want to use roles in the JWT.


## OpenID Connect URL

OpenID Connect specifies various endpoints for integration purposes. The most important endpoint is `well-known`, which lists endpoints and other configuration options for the Security plugin.

The URL differs between IdPs, but usually ends in `/.well-known/openid-configuration`.

Keycloak example:

```
http(s)://<server>:<port>/auth/realms/<realm>/.well-known/openid-configuration
```

The main information that the Security plugin needs is `jwks_uri`. This URI specifies where the IdP's public keys in JWKS format can be found. For example:

```
jwks_uri: "https://keycloak.example.com:8080/auth/realms/master/protocol/openid-connect/certs"
```

```
{
   keys:[
      {
         kid:"V-diposfUJIk5jDBFi_QRouiVinG5PowskcSWy5EuCo",
         kty:"RSA",
         alg:"RS256",
         use:"sig",
         n:"rI8aUrAcI_auAdF10KUopDOmEFa4qlUUaNoTER90XXWADtKne6VsYoD3ZnHGFXvPkRAQLM5d65ScBzWungcbLwZGWtWf5T2NzQj0wDyquMRwwIAsFDFtAZWkXRfXeXrFY0irYUS9rIJDafyMRvBbSz1FwWG7RTQkILkwiC4B8W1KdS5d9EZ8JPhrXvPMvW509g0GhLlkBSbPBeRSUlAS2Kk6nY5i3m6fi1H9CP3Y_X-TzOjOTsxQA_1pdP5uubXPUh5YfJihXcgewO9XXiqGDuQn6wZ3hrF6HTlhNWGcSyQPKh1gEcmXWQlRENZMvYET-BuJEE7eKyM5vRhjNoYR3w",
         e:"AQAB"
      }
   ]
}
```

For more information about IdP endpoints, see the following:

- [Okta](https://developer.okta.com/docs/api/resources/oidc#well-knownopenid-configuration)
- [Keycloak](https://www.keycloak.org/docs/latest/securing_apps/index.html#other-openid-connect-libraries)
- [Auth0](https://auth0.com/docs/protocols/oidc/openid-connect-discovery)
- [Connect2ID](https://connect2id.com/products/server/docs/api/discovery)
- [Salesforce](https://help.salesforce.com/articleView?id=remoteaccess_using_openid_discovery_endpoint.htm&type=5)
- [IBM OpenID Connect](https://www.ibm.com/support/knowledgecenter/en/SSEQTP_8.5.5/com.ibm.websphere.wlp.doc/ae/rwlp_oidc_endpoint_urls.html)


## Time disparity compensation for JWT validation

Occasionally you may find that the clock times between the authentication server and the OpenSearch node are not perfectly synchronized. When this is the case, even by a few seconds, the system that either issues or receives a JWT may try to validate `nbf` (not before) and `exp` (expiration) claims and fail to authenticate the user due to the time disparity.

By default, Security allows for a window of 30 seconds to compensate for possible misalignment between server clock times. To set a custom value for this feature and override the default, you can add the `jwt_clock_skew_tolerance_seconds` setting to the `config.yml`:

```yml
http_authenticator:
  type: openid
  challenge: false
  config:
    subject_key: preferred_username
    roles_key: roles
    openid_connect_url: https://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration
    jwt_clock_skew_tolerance_seconds: 20
```


## Fetching public keys

When an IdP generates and signs a JWT, it must add the ID of the key to the JWT header. For example:

```
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "V-diposfUJIk5jDBFi_QRouiVinG5PowskcSWy5EuCo"
}
```

As per the [OpenID Connect specification](https://openid.net/specs/openid-connect-messages-1_0-20.html), the `kid` (key ID) is mandatory. Token verification does not work if an IdP fails to add the `kid` field to the JWT.

If the Security plugin receives a JWT with an unknown `kid`, it visits the IdP's `jwks_uri` and retrieves all available, valid keys. These keys are used and cached until a refresh is triggered by retrieving another unknown key ID.


## Key rollover and multiple public keys

The Security plugin can maintain multiple valid public keys at once. The OpenID specification does not allow for a validity period of public keys, so a key is valid until it has been removed from the list of valid keys in your IdP and the list of valid keys has been refreshed.

If you want to roll over a key in your IdP, follow these best practices:

- Create a new key pair in your IdP, and give the new key a higher priority than the currently used key.

  Your IdP uses this new key over the old key.

- Upon first appearance of the new `kid` in a JWT, the Security plugin refreshes the key list.

  At this point, both the old key and the new key are valid. Tokens signed with the old key are also still valid.

- The old key can be removed from your IdP when the last JWT signed with this key has timed out.

If you have to immediately change your public key, you can also delete the old key first and then create a new one. In this case, all JWTs signed with the old key become invalid immediately.


## TLS settings

To prevent man-in-the-middle attacks, you should secure the connection between the Security plugin and your IdP with TLS.


### Enabling TLS

Use the following parameters to enable TLS for connecting to your IdP:

```yml
config:
  openid_connect_idp:
    enable_ssl: <true|false>
    verify_hostnames: <true|false>
```

Name | Description
:--- | :---
`enable_ssl` | Whether to use TLS. Default is false.
`verify_hostnames` | Whether to verify the hostnames of the IdP's TLS certificate. Default is true.


### Certificate validation

To validate the TLS certificate of your IdP, configure either the path to the IdP's root CA or the root certificate's content:

```yml
config:
  openid_connect_idp:
    enable_ssl: true
    pemtrustedcas_filepath: /full/path/to/trusted_cas.pem
```

```yml
config:
  openid_connect_idp:
    enable_ssl: true
    pemtrustedcas_content: |-
      MIID/jCCAuagAwIBAgIBATANBgkqhkiG9w0BAQUFADCBjzETMBEGCgmSJomT8ixk
      ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
      bGUgQ29tIEluYy4xITAfBgNVBAsMGEV4YW1wbGUgQ29tIEluYy4gUm9vdCBDQTEh
      ...
```


| Name | Description |
| :--- | :--- |
| `pemtrustedcas_filepath` | Absolute path to the PEM file containing the root CAs of your IdP. |
| `pemtrustedcas_content` | The root CA content of your IdP. Cannot be used if `pemtrustedcas_filepath` is set. |


### TLS client authentication

To use TLS client authentication, configure the PEM certificate and private key the Security plugin should send for TLS client authentication (or its content):

```yml
config:
  openid_connect_idp:
    enable_ssl: true
    pemkey_filepath: /full/path/to/private.key.pem
    pemkey_password: private_key_password
    pemcert_filepath: /full/path/to/certificate.pem
```

```yml
config:
  openid_connect_idp:
    enable_ssl: true
    pemkey_content: |-
      MIID2jCCAsKgAwIBAgIBBTANBgkqhkiG9w0BAQUFADCBlTETMBEGCgmSJomT8ixk
      ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
      bGUgQ29tIEluYy4xJDAiBgNVBAsMG0V4YW1wbGUgQ29tIEluYy4gU2lnbmluZyBD
    ...
    pemkey_password: private_key_password
    pemcert_content: |-
      MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHRZwzwGlP2FvL
      oEzNeDu2XnOF+ram7rWPT6fxI+JJr3SDz1mSzixTeHq82P5A7RLdMULfQFMfQPfr
      WXgB4qfisuDSt+CPocZRfUqqhGlMG2l8LgJMr58tn0AHvauvNTeiGlyXy0ShxHbD
    ...
```

Name | Description
:--- | :---
`enable_ssl_client_auth` | Whether to send the client certificate to the IdP server. Default is false.
`pemcert_filepath` | Absolute path to the client certificate.
`pemcert_content` | The content of the client certificate. Cannot be used when `pemcert_filepath` is set.
`pemkey_filepath` | Absolute path to the file containing the private key of the client certificate.
`pemkey_content` | The content of the private key of your client certificate. Cannot be used when `pemkey_filepath` is set.
`pemkey_password` | The password of your private key, if any.


### Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols by using the following keys.

Name | Description
:--- | :---
`enabled_ssl_ciphers` | Array. Enabled TLS cipher suites. Only Java format is supported.
`enabled_ssl_protocols` | Array. Enabled TLS protocols. Only Java format is supported.


## (Advanced) DoS protection

To help protect against denial-of-service (DoS) attacks, the Security plugin only allows a maximum number of new key IDs in a certain span of time. If the number of new key IDs exceeds this threshold, the Security plugin returns HTTP status code 503 (Service Unavailable) and refuses to query the IdP. By default, the Security plugin does not allow for more than 10 unknown key IDs within 10 seconds. The following table shows how to modify these settings.

Name | Description
:--- | :---
`refresh_rate_limit_count` | The maximum number of unknown key IDs in the time frame. Default is 10.
`refresh_rate_limit_time_window_ms` | The time frame to use when checking the maximum number of unknown key IDs, in milliseconds. Default is 10000 (10 seconds).


## OpenSearch Dashboards single sign-on

Activate OpenID Connect by adding the following to `opensearch_dashboards.yml`:

```
opensearch_security.auth.type: "openid"
```


### Configuration

OpenID Connect providers usually publish their configuration in JSON format under the *metadata url*. Therefore, most settings can be pulled in automatically, so the OpenSearch Dashboards configuration becomes minimal. The most important settings are the following:

- [Connect URL](#openid-connect-url)
- Client ID

  Every IdP can host multiple clients (sometimes called applications) with different settings and authentication protocols. When enabling OpenID Connect, you should create a new client for OpenSearch Dashboards in your IdP. The client ID uniquely identifies OpenSearch Dashboards.

- Client secret

  Beyond the ID, each client also has a client secret assigned. The client secret is usually generated when the client is created. Applications can obtain an identity token only when they provide a client secret. You can find this secret in the settings of the client on your IdP.


### Configuration settings

Name | Description
:--- | :---
`opensearch_security.openid.connect_url` | The URL where the IdP publishes the OpenID metadata. Required.
`opensearch_security.openid.client_id` | The ID of the OpenID Connect client configured in your IdP. Required.
`opensearch_security.openid.client_secret` | The client secret of the OpenID Connect client configured in your IdP. Required.
`opensearch_security.openid.scope` | The [scope of the identity token](https://openid.net/specs/openid-connect-messages-1_0-20.html#scopes) issued by the IdP. Optional. Default is `openid profile email address phone`.
`opensearch_security.openid.header` | HTTP header name of the JWT token. Optional. Default is `Authorization`.
`opensearch_security.openid.logout_url` | The logout URL of your IdP. Optional. Only necessary if your IdP does not publish the logout URL in its metadata.
`opensearch_security.openid.base_redirect_url` | The base of the redirect URL that will be sent to your IdP. Optional. Only necessary when OpenSearch Dashboards is behind a reverse proxy, in which case it should be different than `server.host` and `server.port` in `opensearch_dashboards.yml`.
`opensearch_security.openid.trust_dynamic_headers` | Compute `base_redirect_url` from the reverse proxy HTTP headers (`X-Forwarded-Host` / `X-Forwarded-Proto`). Optional. Default is `false`.


### Configuration example

```yml
# Enable OpenID authentication
opensearch_security.auth.type: "openid"

# The IdP metadata endpoint
opensearch_security.openid.connect_url: "http://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration"

# The ID of the OpenID Connect client in your IdP
opensearch_security.openid.client_id: "opensearch-dashboards-sso"

# The client secret of the OpenID Connect client
opensearch_security.openid.client_secret: "a59c51f5-f052-4740-a3b0-e14ba355b520"

# Use HTTPS instead of HTTP
opensearch.url: "https://<hostname>.com:<http port>"

# Configure the OpenSearch Dashboards internal server user
opensearch.username: "kibanaserver"
opensearch.password: "kibanaserver"

# Disable SSL verification when using self-signed demo certificates
opensearch.ssl.verificationMode: none

# allowlist basic headers and multi-tenancy header
opensearch.requestHeadersAllowlist: ["Authorization", "security_tenant"]
```

To include OpenID Connect with other authentication types in the Dashboards sign-in window, see [Configuring sign-in options]({{site.url}}{{site.baseurl}}/security/configuration/multi-auth/).
{: .note } 

### Additional parameters

Some identity providers require custom parameters to complete the authentication process. You can add custom parameters `opensearch_dashboards.yml` configuration file  under the `opensearch_security.openid.additional_parameters` namespace. You can find these additional parameters by making a GET request to your identity provider. This feature allows for greater flexibility and customization when communicating with various identity providers.

In the following example, two custom parameters, `foo` and `acr_values`, and their values, `bar` and `1`, were found using a GET request to OpenID provider:

```yml
opensearch_security.openid.additional_parameters.foo: "bar"
opensearch_security.openid.additional_parameters.acr_values: "1"
```
{% include copy.html %}



#### Session management with additional cookies

To improve session management---especially for users who have multiple roles assigned to them---Dashboards provides an option to split cookie payloads into multiple cookies and then recombine the payloads when receiving them. This can help prevent larger OpenID Connect assertions from exceeding size limits for each cookie. The two settings in the following example allow you to set a prefix name for additional cookies and specify the number of them. They are added to the `opensearch_dashboards.yml` file. The default number of additional cookies is three:

```yml
opensearch_security.openid.extra_storage.cookie_prefix: security_authentication_oidc
opensearch_security.openid.extra_storage.additional_cookies: 3
```

Note that reducing the number of additional cookies can cause some of the cookies that were in use before the change to stop working. We recommend establishing a fixed number of additional cookies and not changing the configuration after that.

If the ID token from the IdP is especially large, OpenSearch may throw a server log authentication error indicating that the HTTP header is too large. In this case, you can increase the value for the `http.max_header_size` setting in the `opensearch.yml` file.
{: .tip }


### OpenSearch security configuration

Because OpenSearch Dashboards requires that the internal OpenSearch Dashboards server user can authenticate through HTTP basic authentication, you must configure two authentication domains. For OpenID Connect, the HTTP basic domain has to be placed first in the chain. Make sure you set the challenge flag to `false`.

Modify and apply the following example settings in `config.yml`:

```yml
basic_internal_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: basic
    challenge: false
  authentication_backend:
    type: internal
openid_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 1
  http_authenticator:
    type: openid
    challenge: false
    config:
      subject_key: preferred_username
      roles_key: roles
      openid_connect_url: https://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration
  authentication_backend:
    type: noop
```
