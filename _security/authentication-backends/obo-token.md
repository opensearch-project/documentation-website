---
layout: default
title: On-behalf-of tokens
parent: Authentication backends
nav_order: 75
---


# On-behalf-of tokens

On-behalf-of (OBO) tokens enable services to run on OpenSearch by allowing a user's security privileges to authorize access on behalf of the service. These tokens can be used for any generic service that you want to run on OpenSearch. However, their initial application with OpenSearch involves supporting the use of extensions.


## Description

The OBO token is a JSON Web Token (JWT) used for managing authentication requests between a user's client and an extension or other service. For the initial extensions design, these tokens allow the extension to interact with the OpenSearch cluster using the same privileges as the initiating user; hence the name, “on-behalf-of”. Because these tokens don’t have any real restrictions, they can be used to permit access to any generic service for a set window of time.

The OBO token provides just-in-time access for extension services and other resources. This means that the token is issued immediately before it is needed rather than at the beginning of a session with the expectation that access persists over the course of the session. This approach is often considered a more secure method of authentication due to the fixed and relatively short length of time it remains valid and the focused access it applies to a select service.

Given that the OBO token is a JWT, it includes an expiration claim that determines how long the token remains valid. You can therefore configure the token so that it provides access to a service for a short, predetermined length of time.


### Token payload

The payload for an OBO token includes the following claims. To read more about JWT claims, see [JSON Web Token Claims](https://www.iana.org/assignments/jwt/jwt.xhtml#claims).

| Claim | Claim description |
| :--- | :--- |
| `iss` | Issuer. The OpenSearch cluster identifier. |
| `iat` | Issued at. Time at which the token was issued. |
| `exp` | Expiration time.  |
| `sub` | Subject. User ID |
| `aud` | Audience. The extension's, or the service's, unique identifier. |
| `roles` | Roles. Security privilege evaluation. <!--- not sure what this means ---> |



## Configuring the token

As with all backends, the OBO token is configured in the `authc` section of the `config.yml` file. Set up an authentication domain and choose `on_behalf_of` as the `http_authenticator`. Because the tokens already contain all required information to verify the request, set `challenge` to `false` and `authentication_backend` to `noop`:

```yml
on_behalf_of:
    signing_key: xxxxxxxxxx
    encryption_key: xxxxxxxx
```
<!--- Aside from http authenticator type, signing_key, and encryption_key, are any of these other settings important to OBO configuration? Do any of the JWT configuration settings apply to OBO also?
```yml
on_behalf_of_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: on_behalf_of
    challenge: false
    config:
      signing_key: "base64 encoded key"
      encryption_key: xxxxxxxx
      jwt_header: "Authorization"
      jwt_url_parameter: null
      subject_key: null
      roles_key: null
      jwt_clock_skew_tolerance_seconds: 20
  authentication_backend:
    type: noop
```
--->

The following table lists the most important configuration parameters.

Name | Description
:--- | :---
`signing_key` | The signing key to use when verifying the token. If you use a symmetric key algorithm, it is the base64-encoded shared secret. If you use an asymmetric algorithm, it contains the public key.
`encryption_key` | <!--- need more on this --->


## Enabling backend roles

To make backend roles backward compatible for plugins, the following configuration is necessary in the `extensions/extensions.yml` file:

```yml
BWC Mode OFF (default):
Encrypted roles (er)
BWC Mode ON:
Decrypted roles in plain-text (dr)
Decrypted backend roles in plain-text (dbr)
```
<!--- not sure what this configuration is all about. Is this the new setting: jwtTokenIncludesBackendRoles? basing this on comments in https://github.com/opensearch-project/security/pull/3180 --->


