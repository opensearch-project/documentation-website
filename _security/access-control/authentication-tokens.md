---
layout: default
title: Authorization tokens
parent: Access control
nav_order: 125
redirect_from:
 - /security/access-control/authorization-tokens/
 - /security-plugin/access-control/authorization-tokens/
canonical_url: https://docs.opensearch.org/latest/security/access-control/authentication-tokens/
---

# Authorization tokens

The Security plugin allows you to configure two types of authentication tokens: On-Behalf-Of (OBO) tokens and Service Account tokens.

## On-Behalf-Of authentication

The following sections describe the use, configuration, structure, and endpoint for OBO tokens.

### Usage

On-Behalf-Of tokens are a special form of JSON Web Token (JWT) used for managing authentication requests between a user's client and an extension. These tokens operate "just-in-time," meaning that a token is issued immediately before it is required for authentication. A token will have a configurable window of validity (with a maximum duration of five minutes), after which it expires and cannot be used.

An extension can use an OBO token to interact with an OpenSearch cluster, using the same privileges as the user it represents. This is why these tokens are called "on-behalf-of." Since these tokens are not restricted, they enable services to function as though they are the original user until the token expires. This implies that the feature's applicability extends beyond only extension-related uses cases, allowing for a wider range of uses.

### Configuration

In the [security `config.yml` file]({{site.url}}{{site.baseurl}}/security/configuration/configuration/), the OBO configuration is located under the dynamic configuration section. It contains the signing key for the token signature and the encryption key for the token payload (role information) decryption:

```
config:
  dynamic:
    on_behalf_of:
      enabled: #'true'/non-specified will be consider as 'enabled'
      signing_key: #encoded signing key here
      encryption_key: #encoded encryption key here
...
```

The default encoding algorithm for signing the JWT is HMAC SHA512. Both the signing key and the encryption key are base64 encoded and stored on the OpenSearch node's file system. The keys should be the same on all hosts. Otherwise, encryption and decryption operations may fail. The keys' deployment is managed by the cluster operator.

### Token structure

The payload of an OBO token must include all standard configurations of a JWT, along with encrypted and decrypted roles. Depending on the Plugin Backward Compatibility Mode setting, backend roles should also be incorporated into role claims. The absence of any of these claims results in a malformed token and fails to meet the required standard for authentication.

The OBO token contains the following claims:
* Issuer (`iss`): OpenSearch cluster identifier
	* It is essential that the issuer is validated as a part of security control measures. This strategy is forward-thinking, particularly in the context of potential multi-tenant scenarios, such as OpenSearch Serverless, where differing cryptographic keys could be associated with each issuer. By checking the value of issuer, each OBO token is restricted to its associated issuer.
* Issue-at (`iat`): Current time for issuing this token
	* Used as the reference of the expiration.
* Not-before (`nbf`): The earliest point at which the token can be used
	* Given that the OBO token is designed for just-in-time usage, its `nbf` should align with the issued-at time (`iat`), indicating the moment when the token was created.
* Expiry (`exp`): Expiration time
	* Each OBO token incorporates an expiration mechanism, which is verified upon its receipt. Once a token is issued, it cannot be revoked. Instead, the token is only invalidated upon its expiration. Further, the generation of OBO tokens by extensions is subject to dynamic settings. This functionality safeguards the system by preventing the issuance of future tokens under certain conditions.
	* The default configuration establishes an expiration time of 300 seconds for OBO tokens. Recognizing that different scenarios may necessitate different token durations, OpenSearch has the capability for users to personalize this expiration time. The maximum duration that can be assigned to a token is 600 seconds.
	* In reference to the OBO token's current design, token revocation isn't a current concern, given its intended just-in-time use and brief lifespan. If, however, future adjustments necessitate an extended lifespan for this token, token revocation will be added. This strategy will be adopted to improve and solidify the security measures associated with OBO token use.
* Subject (`sub`): User identifier
	* Name of the user with which this OBO token is associated.
* Audience (`aud`): The extension’s unique identifier
	* For the extension use case, the `aud` field is a reference to the specific extension that represents the target service.
	* For the REST API use case, the API parameter service enables the specifying of the target service(s) using this token. The default value is set to `self-issued`.
* Roles: Security privilege evaluation
	* The Role Security Mode [[source code](https://github.com/opensearch-project/security/blob/main/src/main/java/org/opensearch/security/authtoken/jwt/JwtVendor.java#L151)]: The configuration determines the roles claim encryption.
		* Role Security Mode On (default value): Roles claim will be encrypted.
			* Encrypted mapped roles (`er`)
		* Role Security Mode Off: Roles claims is in plain-text. Both the mapped roles and backend roles are included in the claim [[related discussion](https://github.com/opensearch-project/security/issues/2865)].
			* Decrypted mapped roles in plain text (`dr`)
			* Decrypted backend roles (`br`)

The OpenSearch Security plugin handles the encryption and decryption processes. This approach ensures the protection of user information, even when traversing the trust boundary between OpenSearch and any third-party services.

### API endpoint

You can access the `POST /_plugins/_security/api/generateonbehalfoftoken` API endpoint on the Security plugin in order to create a short-lived, self-issued OBO token to perform certain actions on the user's behalf.

To access this API endpoint, the request body should contain three API parameters:

* `description`: This parameter allows the user to articulate the purpose for requesting this token, providing clarity and transparency.
* `service` (optional): This parameter is directed to the audience claim of the OBO token. It offers users the opportunity to designate the target service for which they intend to use the token. Although this is an optional parameter, if not specified, the default value is set to `self-issued`.
* `durationSeconds` (optional): This parameter allows users to customize the token's expiration time according to its anticipated usage. The maximum duration is capped at 600 seconds to maintain security. If not specified, the default duration is set to 300 seconds.
The following is an example of requesting an OBO token with a lifespan of 3 mins for the user “admin” for testing purposes:

```json
POST /_plugins/_security/api/generateonbehalfoftoken
{ 
   "description":"Testing",
   "service":"Testing Service",
   "durationSeconds":"180"
}
```
{% include copy-curl.html %}

### Additional authorization restriction 

While the conversation about the usage of OBO tokens continues, it is critical to manage certain edge cases. Even though an OBO token can act as a valid Bearer authorization header for any API access, certain limitations are needed. For instance, using an OBO token to access the API endpoint to issue another OBO token should be forbidden. Similarly, using an OBO token to access the reset password API in order to modify a user's authentication information should be disallowed. These preventive measures are necessary to uphold the system's integrity and security.

For more information, see the [related discussion](https://github.com/opensearch-project/security/issues/2891).

## Service Accounts

Service Accounts tokens are the second form of authentication token supported by the Security plugin. 

### Introduction

Service Accounts are a new authC/authZ path where extensions can run requests without assuming the role(s) of the active user. Service Accounts are a special type of principal associated with each extension and have a set of permissions. The permissions assigned to Service Accounts grant the associated extension the authorization to run any of the mapped operations without needing to assume the roles of the active user or stash the user’s role(s) in the ephemeral user context. 

Currently, Service Accounts only permit operations on system indices associated with the mapped extension.
{: .important}

### Background

Before the introduction of Service Accounts, it was not possible for an extension to service a request without assuming the roles of the active user. Instead, when a request is processed, an ephemeral “Plugin User” was created. The Plugin User then assumed all the permissions of the currently authenticated operator (human user). The result was a Plugin User that acted on the extension’s behalf but had all of the privileges of the operator. In this way, the previous model can be said to have had extensions “impersonate” the operator. This impersonation approach lead to two main issues:
* Impersonation compromises referential integrity, meaning it is difficult for auditors to identify which requests were run by an extension or by an operator. A system with referential integrity maintains a transactional record in its audit log. The record provides a clear history of actions taken by various subjects at specific times. When extensions impersonate users for both requests they make on behalf of the operator and requests they send on their own, the audit log lacks referential integrity.
* Impersonation also makes it impossible to restrict an extension’s permissions beyond those of the user it impersonates. When an extension assumes the roles of the active subject, it copies all of the roles. This includes even those permissions which are uneccessary for completing its intended actions. This practice not only deviates from the principal of least-privileges, but also increases the threat surface area. With each additional permission granted to the Plugin User, the potential impact a misconfigured or malicious extension may have grows.

### Benefits

Service Accounts address the issues described in the Background section by defining a separate state in which autonomously operating extensions run. Service Accounts maintain referential integrity by introducing a distinct state in which extensions run when sending requests on their own behalf. 
Audit logging can then record when an extension runs on its own—it makes authC/authZ calls against the Service Accounts—or whether it is running an action on behalf of the operator and therefore making use of the OBO tokens.

Similarly, Service Accounts address threat exposure concerns by separating the roles an extension assumes from those of the operator or a generic hard-coded user (such as those in the `internal_users.yml` file). 
Service Accounts will not assume the roles of the operator but instead have their own privileges listed in the Service Accounts. The roles associated with Service Accounts can therefore be as a restrictive as possible in alignment with the principle of least-privileges. To avoid providing extensions with overly permissive service accounts, extension authors should have a strong understanding of what types of operations their extensions hope to run.

### API Endpoint

As suggested by the name, the Boolean flag `service` denotes whether a given internal user account is a Service Accounts. If an account is not a Service Accounts, then any attempts to generate an associated authorization token for the account will fail. Similarly, the `enabled` field determines when a Service Accounts can be used by an extension to perform operations. If a Service Accounts is not `enabled`, attempts to fetch its authorization token will be blocked and the Service Accounts will be unable to run requests on its own behalf using a previously issued auth token.
The following is an example of creating a Service Accounts with `ALL PERMISSIONS` for your service or extension.
```json
PUT /_plugins/_security/api/internalusers/admin_service
{
 "opendistro_security_roles": ["all_access"],
 "backend_roles": [],
 "attributes": {
  "enabled": "true",
  "service": "true"
 }
 ```

{% include copy-curl.html %}
 
## Handling OBO and Service Accounts requests
While both OBO token handling and Service Accounts can be viewed as independent features, the most significant benefits are realized when coupled. Specifically, OpenSearch exposes a client that is used to connect to the OpenSearch cluster and provides the plugins with the capability to run requests. 
With OBO tokens and Service Accounts, the client now is able to be used to handle requests that use both of these features. When the client makes a request that requires an extension to use an OBO token, the first step for handling the request is forwarding the request to the Security plugin. In the Security plugin, the request is authenticated and authorized against the active user. If the active user is permitted, the request returns to OpenSearch’s core code base, where a request to create an OBO token for the target extension using the active user’s identity is created. This request to generate the OBO token is then handled by the _`IdentityPlugin`_ implementation. In the standard scenario this is the Security plugin, so the request is returned to the Security plugin’s implementation of the `TokenManager` interface, which generates a new OBO token for the request. 
After generating the token, the Security plugin forwards the request with the OBO token to the extension. At that point, the extension can call OpenSearch’s REST methods with the token. The permissions associated with the token will then be evaluated for the authorization of the request. If the token conveys the permissions required for the operation, the action will be performed, and the response will be sent back to the extension. After processing OpenSearch’s response, the extension will forward its own handling of the response to the client. If the OBO token does not entail the permissions required for initiating the target action, a forbidden response is returned to the extension.

Extensions acting on their own behalf also use the client that is exposed by OpenSearch. When an extension is first initialized in OpenSearch, the `IdentityPlugin` is triggered to create a new Service Accounts for it and to provide the associated Service Accounts token. In the default configuration, the Security plugin is the `IdentityPlugin` and handles these processes. 
After OpenSearch receives the Service Accounts token, it forwards that token to the associated extension. After the extension has received its token, requests by the client to make use of the Service Accounts associated with the extension are operable. In these scenarios, the extension receives the requests from the client and then forwards the request along with the Service Accounts token to OpenSearch. OpenSearch further transfers the packages to the Security plugin, where the token is parsed and the request is treated as a traditional request using "Basic Authentication" in the `InternalAuthenticationBackend`.

In both OBO and Service Accounts token request flows, the `TokenManager` interface for the `IdentityPlugin` is used by the `IdentityPlugin` to handle the tokens' distribution and processing. This interface is implemented by the Security plugin as an `IdentityPlugin` and contains logic for issuing a token that is either an OBO or Service Accounts token.


