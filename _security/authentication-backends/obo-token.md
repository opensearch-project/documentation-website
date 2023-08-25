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

Given that the OBO token is a JWT, it includes an expiration claim that determines how long the token remains valid. You can therefore configure the token so that it provides access to a service for a short, predertimed length of time.


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

As with all backends, the OBO token is configured in the `config.yml` file.

```yml
on_behalf_of:
    signing_key: xxxxxxxxxx
    encryption_key: xxxxxxxx
```
<!--- Will have to refer to JWT configruation to make sense of this abbreviated configuration. --->


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


