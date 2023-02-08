---
layout: default
title: JSON web token authentication
parent: Authentication backends
nav_order: 62
---

# JSON web token authentication



## JSON web token

JSON web tokens (JWTs) are JSON-based access tokens that assert one or more claims. They are commonly used to implement single sign-on (SSO) solutions and fall in the category of token-based authentication systems:

1. A user logs in to an authentication server by providing credentials (for example, a user name and password).
1. The authentication server validates the credentials.
1. The authentication server creates an access token and signs it.
1. The authentication server returns the token to the user.
1. The user stores the access token.
1. The user sends the access token alongside every request to the service that it wants to use.
1. The service verifies the token and grants or denies access.

A JSON web token is self-contained in the sense that it carries all necessary information to verify a user within itself. The tokens are base64-encoded, signed JSON objects.

JSON web tokens consist of three parts:

1. Header
1. Payload
1. Signature


### Header

The header contains information about the used signing mechanism, as shown in the following example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

In this case, the header states that the message was signed using HMAC-SHA256.


### Payload

The payload of a JSON web token contains the so-called [JWT Claims](https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#RegisteredClaimName). A claim can be any piece of information about the user that the application that created the token has verified.

The specification defines a set of standard claims with reserved names ("registered claims"). These include, for example, the token issuer, the expiration date, or the creation date.

Public claims, on the other hand, can be created freely by the token issuer. They can contain arbitrary information, such as the user name and the roles of the user.


```json
{
  "iss": "example.com",
  "exp": 1300819380,
  "name": "John Doe",
  "roles": "admin, devops"
}
```


### Signature

The issuer of the token calculates the signature of the token by applying a cryptographic hash function on the base64-encoded header and payload. These three parts are then concatenated using periods to form a complete JSON web token:

```
encoded = base64UrlEncode(header) + "." + base64UrlEncode(payload)
signature = HMACSHA256(encoded, 'secretkey');
jwt = encoded + "." + base64UrlEncode(signature)
```

Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI
```


## Configuring JSON web tokens

If you use JSON web token as your only authentication method, disable the user cache by setting `plugins.security.cache.ttl_minutes: 0`.
{: .warning }

Set up an authentication domain and choose `jwt` as the HTTP authentication type. Because the tokens already contain all required information to verify the request, `challenge` must be set to `false` and `authentication_backend` to `noop`.

```yml
jwt_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: jwt
    challenge: false
    config:
      signing_key: "base64 encoded key"
      jwt_header: "Authorization"
      jwt_url_parameter: null
      subject_key: null
      roles_key: null
  authentication_backend:
I    type: noop
```

The following table shows the configuration parameters.

Name | Description
:--- | :---
`signing_key` | The signing key to use when verifying the token. If you use a symmetric key algorithm, it is the base64-encoded shared secret. If you use an asymmetric algorithm, it contains the public key.
`jwt_header` | The HTTP header in which the token is transmitted. This typically is the `Authorization` header with the `Bearer` schema: `Authorization: Bearer <token>`. Default is `Authorization`.
`jwt_url_parameter` | If the token is not transmitted in the HTTP header, but as an URL parameter, define the name of this parameter here.
`subject_key` | The key in the JSON payload that stores the user name. If not set, the [subject](https://tools.ietf.org/html/rfc7519#section-4.1.2) registered claim is used.
`roles_key` | The key in the JSON payload that stores the user's roles. The value of this key must be a comma-separated list of roles.

Because JSON web tokens are self-contained and the user is authenticated on the HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.


### Symmetric key algorithms: HMAC

Hash-based message authentication codes (HMACs) are a group of algorithms that provide a way of signing messages by means of a shared key. The key is shared between the authentication server and the security plugin. It must be configured as a base64-encoded value in the `signing_key` setting:

```yml
jwt_auth_domain:
  ...
    config:
      signing_key: "a3M5MjEwamRqOTAxOTJqZDE="
      ...
```


### Asymmetric key algorithms: RSA and ECDSA

RSA and ECDSA are asymmetric encryption and digital signature algorithms and use a public/private key pair to sign and verify tokens. This means that they use a private key for signing the token, while the security plugin needs to know only the public key to verify it.

Because you cannot issue new tokens with the public key---and because you can make valid assumptions about the creator of the token---RSA and ECDSA are considered more secure than using HMAC.

To use RS256, you need to configure only the (non-base64-encoded) public RSA key as `signing_key` in the JWT configuration:

```yml
jwt_auth_domain:
  ...
    config:
      signing_key: |-
        -----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQK...
        -----END PUBLIC KEY-----
      ...
```

The security plugin automatically detects the algorithm (RSA/ECDSA), and if necessary you can break the key into multiple lines.


### Bearer authentication for HTTP requests

The most common way of transmitting a JSON web token in an HTTP request is to add it as an HTTP header with the bearer authentication schema:

```
Authorization: Bearer <JWT>
```

The default name of the header is `Authorization`. If required by your authentication server or proxy, you can also use a different HTTP header name using the `jwt_header` configuration key.

As with HTTP basic authentication, you should use HTTPS instead of HTTP when transmitting JSON web tokens in HTTP requests.


### URL parameters for HTTP requests

Although the most common way to transmit JWTs in HTTP requests is to use a header field, the security plugin also supports parameters. Configure the name of the `GET` parameter using the following key:

```yml
    config:
      signing_key: ...
      jwt_url_parameter: "parameter_name"
      subject_key: ...
      roles_key: ...
```

As with HTTP basic authentication, you should use HTTPS instead of HTTP.


### Validated registered claims

The following registered claims are validated automatically:

* "iat" (Issued At) Claim
* "nbf" (Not Before) Claim
* "exp" (Expiration Time) Claim


### Supported formats and algorithms

The security plugin supports digitally signed, compact JSON web tokens with all standard algorithms:

```
HS256: HMAC using SHA-256
HS384: HMAC using SHA-384
HS512: HMAC using SHA-512
RS256: RSASSA-PKCS-v1_5 using SHA-256
RS384: RSASSA-PKCS-v1_5 using SHA-384
RS512: RSASSA-PKCS-v1_5 using SHA-512
PS256: RSASSA-PSS using SHA-256 and MGF1 with SHA-256
PS384: RSASSA-PSS using SHA-384 and MGF1 with SHA-384
PS512: RSASSA-PSS using SHA-512 and MGF1 with SHA-512
ES256: ECDSA using P-256 and SHA-256
ES384: ECDSA using P-384 and SHA-384
ES512: ECDSA using P-521 and SHA-512
```

## Troubleshooting common issues

This section details how to troubleshoot common issues with your JWT authentication configuration.


#### Correct iat 

Ensure that the JWT token contains the correct `iat` (issued at), `nbf` (not before), and `exp` (expiry) claims, all of which are validated automatically by OpenSearch.

#### JWT URL parameter

When using  the JWT URL parameter containing the default admin role `all_access` against OpenSearch (for example, `curl http://localhost:9200?jwtToken=<jwt-token>`) the request fails with:

```json
{
   "error":{
      "root_cause":[
         {
            "type":"security_exception",
            "reason":"no permissions for [cluster:monitor/main] and User [name=admin, backend_roles=[all_access], requestedTenant=null]"
         }
      ],
      "type":"security_exception",
      "reason":"no permissions for [cluster:monitor/main] and User [name=admin, backend_roles=[all_access], requestedTenant=null]"
   },
   "status":403
}
```

To solve this, ensure that the role `all_access` is mapped directly to the internal user and not a backend role. To do this, navigate to **Security > Roles > all_access** and switch to the tab to **Mapped Users**. Select **Manage mapping** and add "admin" to the **Users** section.

![image](https://user-images.githubusercontent.com/5849965/179158704-b2bd6d48-8816-4b03-a960-8c612465cf75.png)

The user should appear in the **Mapped Users** tab.

![image](https://user-images.githubusercontent.com/5849965/179158750-1bb5e232-dd61-449a-a561-0613b71bfd68.png)
