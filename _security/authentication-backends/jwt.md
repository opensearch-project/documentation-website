---
layout: default
title: JSON Web Token
parent: Authentication backends
nav_order: 47
redirect_from:
---


# JSON Web Token

JSON Web Tokens (JWTs) are JSON-based access tokens that assert one or more claims. They are commonly used to implement single sign-on (SSO) solutions and fall in the category of token-based authentication systems. The basic information-transmission and identity-verification lifecycle for a JWT is described in the following steps:

1. A user logs in to an authentication server by providing credentials (for example, a username and password).
1. The authentication server validates the credentials.
1. The authentication server creates an access token and signs it.
1. The authentication server returns the token to the user.
1. The user stores the access token.
1. The user sends the access token alongside every request to the service that it wants to use.
1. The service verifies the token and grants or denies access.
1. With granted access, the user has access until the expiration time of the token. The expiration time is typically set by the issuer in the token's payload.

A JWT is self-contained in the sense that it carries within it all of the information necessary to verify a user. The tokens are base64-encoded, signed JSON objects.


## JWT elements

JWTs consist of three parts:

* Header
* Payload
* Signature


### Header

The header contains information about the signing mechanism being used, including the algorithm used for encoding the token. The following example shows typical properties and values for the header:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

In this case, the header states that the message was signed using the hashing algorithm HMAC-SHA256.


### Payload

The payload of a JWT contains the [JWT claims](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims). A claim is a piece of information about a user of the token that serves as a unique identifier. This allows the issuer of the token to verify identity. Claims are name-value pairs, and a payload typically includes multiple claims. While the options for adding claims are numerous, it is a good practice to avoid adding too many and making the payload excessively large, which would defeat the purpose of the JWT being compact.

There are three types of claims:

* [Registered claims](https://www.iana.org/assignments/jwt/jwt.xhtml#claims) are defined by the JWT specification and comprise a set of standard claims with reserved names. Some examples of these claims include token issuer (iss), expiration time (exp), and subject (sub).
* Public claims, on the other hand, are defined at the will of the parties sharing the token. They can contain arbitrary information, such as the username and the roles of the user. As a precaution, the specification advises either registering the name or, at least, ensuring that the name is [collision resistant](https://www.rfc-editor.org/rfc/rfc7519#section-4.2) with other claims.
* Private claims provide another option for assigning custom information to the payload: for example, an email address. As such, they are also referred to as _custom_ claims. The two parties sharing the token must agree on their use because they are considered to be neither registered nor public claims. 

The following example shows these JSON properties as name-value pairs:

```json
{
  "iss": "example.com",
  "exp": 1300819380,
  "name": "John Doe",
  "roles": "admin, devops"
}
```

### Signature

The issuer of the token generates the token's signature by applying a cryptographic hash function to the base64-encoded header and payload. The client receiving the JWT decrypts and validates this signature in the final step of transmission.

These three parts---header, payload, and signature---are concatenated using periods to form a complete JWT:

```
encoded = base64UrlEncode(header) + "." + base64UrlEncode(payload)
signature = HMACSHA256(encoded, 'secretkey');
jwt = encoded + "." + base64UrlEncode(signature)
```

Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI
```


## Configuring JWTs

If you use a JWT as your only authentication method, disable the user cache by setting the `plugins.security.cache.ttl_minutes` property to `0`. For more information about this property, see [opensearch.yml]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#opensearchyml).
{: .important }

Set up an authentication domain and choose `jwt` as the HTTP authentication type. Because the tokens already contain all required information to verify the request, `challenge` must be set to `false` and `authentication_backend` to `noop`:

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
      jwt_clock_skew_tolerance_seconds: 20
  authentication_backend:
I    type: noop
```

The following table lists the configuration parameters.

Name | Description
:--- | :---
`signing_key` | The signing key to use when verifying the token. If you use a symmetric key algorithm, it is the base64-encoded shared secret. If you use an asymmetric algorithm, it contains the public key.
`jwt_header` | The HTTP header in which the token is transmitted. This is typically the `Authorization` header with the `Bearer` schema: `Authorization: Bearer <token>`. Default is `Authorization`.
`jwt_url_parameter` | If the token is not transmitted in the HTTP header but rather as an URL parameter, define the name of the parameter here.
`subject_key` | The key in the JSON payload that stores the username. If not set, the [subject](https://tools.ietf.org/html/rfc7519#section-4.1.2) registered claim is used.
`roles_key` | The key in the JSON payload that stores the user's roles. The value of this key must be a comma-separated list of roles.
`jwt_clock_skew_tolerance_seconds` | Sets a window of time, in seconds, to compensate for any disparity between the JWT authentication server and OpenSearch node clock times, thereby preventing authentication failures due to the misalignment. Security sets 30 seconds as the default. Use this setting to apply a custom value.

Because JWTs are self-contained and the user is authenticated at the HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.


### Symmetric key algorithms: HMAC

Hash-based message authentication codes (HMACs) are a group of algorithms that provide a way of signing messages by means of a shared key. The key is shared between the authentication server and the Security plugin. It must be configured as a base64-encoded value in the `signing_key` setting:

```yml
jwt_auth_domain:
  ...
    config:
      signing_key: "a3M5MjEwamRqOTAxOTJqZDE="
      ...
```


### Asymmetric key algorithms: RSA and ECDSA

RSA and ECDSA are asymmetric encryption and digital signature algorithms that use a public/private key pair to sign and verify tokens. This means that they use a private key for signing the token, while the Security plugin needs to know only the public key to verify it.

Because you cannot issue new tokens with the public key---and because you can make valid assumptions about the creator of the token---RSA and ECDSA are considered to be more secure than HMAC.

To use RS256, you need to configure only the (non-base64-encoded) public RSA key as the `signing_key` in the JWT configuration:

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

The Security plugin automatically detects the algorithm (RSA/ECDSA). If necessary, you can break the key into multiple lines.


### Bearer authentication for HTTP requests

The most common way of transmitting a JWT in an HTTP request is to add it as an HTTP header with the bearer authentication schema:

```
Authorization: Bearer <JWT>
```

The default name of the header is `Authorization`. If required by your authentication server or proxy, you can also use a different HTTP header name using the `jwt_header` configuration key.

As with HTTP basic authentication, you should use HTTPS instead of HTTP when transmitting JWTs in HTTP requests.


### URL parameters for HTTP requests

Although the most common way to transmit JWTs in HTTP requests is to use a header field, the Security plugin also supports parameters. Configure the name of the `GET` parameter using the following key:

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

The Security plugin supports digitally signed, compact JWTs with all standard algorithms:

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


## Using a JWKS endpoint to validate a JWT

Validating the signature of the signed JWT is the last step in granting user access. OpenSearch validates the signature when the client sends the JWT with a REST request. The signature is verified in every authentication request.

Rather than store the cryptographic key used for validation in the local `config.yml` file's `authc` section, you can specify a JSON Web Key Set (JWKS) endpoint to retrieve the key from its location on the issuer's server. This method of validating the JWT can help streamline management of public keys and certificates.

In OpenSearch, this method of validation makes use of the [OpenID Connect authentication domain configuration]({{site.url}}{{site.baseurl}}/security/authentication-backends/openid-connect/#configure-openid-connect-integration). To specify the JWKS endpoint, replace the `openid_connect_url` setting in the configuration with the `jwks_uri` setting and add the URL to the setting as its value. This is shown in the following example:

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
      jwks_uri: https://keycloak.example.com:8080/auth/realms/master/.well-known/jwks-keys.json
  authentication_backend:
    type: noop
```

The endpoint should be documented by the JWT issuer. You can use it to retrieve the keys needed to validate the signed JWT. For more information about the content and format of JSON Web Keys, see [JSON Web Key (JWK) format](https://datatracker.ietf.org/doc/html/rfc7517#section-4).


## Troubleshooting common issues

This section details how to troubleshoot common issues with your security configuration.


### Verify correct claims

Ensure that the JWT token contains the correct `iat` (issued at), `nbf` (not before), and `exp` (expiry) claims, all of which OpenSearch validates automatically.


### JWT URL parameter

When using the JWT URL parameter containing the default admin role `all_access` (for example, `curl http://localhost:9200?jwtToken=<jwt-token>`), the request fails and throws the following error:

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

To correct this, ensure that the role `all_access` is mapped directly to the internal user and not to a backend role. To do this, navigate to **Security > Roles > all_access** and select the **Mapped users** tab. Select **Manage mapping** and add "admin" to the **Users** section.

![image](https://user-images.githubusercontent.com/5849965/179158704-b2bd6d48-8816-4b03-a960-8c612465cf75.png)

The user should then appear on the **Mapped Users** tab.

![image](https://user-images.githubusercontent.com/5849965/179158750-1bb5e232-dd61-449a-a561-0613b71bfd68.png)


### OpenSearch Dashboards configuration

Even though JWT URL parameter authentication works when querying OpenSearch directly, it fails when used to access OpenSearch Dashboards. 

**Solution:** Ensure the following lines are present in the `opensearch_dashboards.yml` configuration file:

```yml
opensearch_security.auth.type: "jwt"
opensearch_security.jwt.url_param: <your-param-name-here>
```
