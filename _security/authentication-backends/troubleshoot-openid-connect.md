---
layout: default
title: Troubleshooting OpenID Connect
parent: OpenID Connect
grand_parent: Authentication backends
nav_order: 10
redirect_from:
  - /troubleshoot/openid-connect/
---

# Troubleshooting OpenID Connect

Use the following troubleshooting steps to resolve issues with using OpenID Connect for OpenSearch authentication with the Security plugin.


---

#### Table of contents
- TOC
{:toc}


---

## Set log level to debug

To help troubleshoot OpenID Connect, set the log level to `debug` on OpenSearch. Add the following lines in `config/log4j2.properties` and restart the node:

```
logger.securityjwt.name = org.opensearch.security.auth.http.jwt
logger.securityjwt.level = debug
```

This setting prints a lot of helpful information to your log file. If this information isn't sufficient, you can also set the log level to `trace`.

At the `trace` level, the `org.opensearch.security.auth.http.jwt` logger can write tokens to the log file. Anyone who can read the log can use a token that has not expired to authenticate as its user. Restore the previous log level when you finish troubleshooting, and restrict access to log files that contain tokens.
{: .warning}

## Inspect the claims in the ID token

To check the user name and backend roles that OpenSearch extracts from an ID token, send the token to the [Authentication Information API]({{site.url}}{{site.baseurl}}/security/api/authentication/auth-info/) in the `Authorization` header:

```bash
curl -X GET "https://localhost:9200/_plugins/_security/authinfo?pretty" \
  -H "Authorization: Bearer <id_token>"
```
{% include copy.html %}

The `user_name` field contains the value of the claim configured in `subject_key`, and the `backend_roles` field contains the values of the claim configured in `roles_key`. The `custom_attribute_names` field lists the name of each claim in the token, prefixed with `attr.jwt.`. Claims nested in objects appear as dotted paths, such as `attr.jwt.realm_access.roles`. The response does not include the claim values.

The following example response is for a token that contains six claims:

```json
{
  "user" : "User [name=jdoe, backend_roles=[analyst, viewer], requestedTenant=null]",
  "user_name" : "jdoe",
  "user_requested_tenant" : null,
  "remote_address" : "203.0.113.10:58918",
  "backend_roles" : [
    "analyst",
    "viewer"
  ],
  "custom_attribute_names" : [
    "attr.jwt.preferred_username",
    "attr.jwt.roles",
    "attr.jwt.sub",
    "attr.jwt.exp",
    "attr.jwt.iat",
    "attr.jwt.email"
  ],
  "roles" : [ ],
  "tenants" : {
    "jdoe" : true
  },
  "principal" : null,
  "peer_certificates" : "0",
  "sso_logout_url" : null
}
```

If the API returns a `401 Unauthorized` status code or the response shows a different user, OpenSearch did not accept the token. To find the reason, check the OpenSearch log.

To view the claim values, decode the token payload on your local machine. An ID token is a JSON Web Token (JWT) that consists of three Base64URL-encoded parts separated by periods. The second part contains the claims.

Don't paste tokens into third-party websites, such as online JWT decoders. Anyone who has a token that has not expired can use it to access your cluster.
{: .warning}


## "Failed when trying to obtain the endpoints from your IdP"

This error indicates that the Security plugin can't reach the metadata endpoint of your IdP. In `opensearch_dashboards.yml`, check the following setting:

```
opensearch_security.openid.connect_url: "http://keycloak.example.com:8080/realms/master/.well-known/openid-configuration"
```

If this error occurs on OpenSearch, check the following setting in `config.yml`:

```yml
openid_auth_domain:
  http_enabled: true
  order: 1
  http_authenticator:
    type: "openid"
    ...
    config:
      openid_connect_url: http://keycloak.example.com:8080/realms/master/.well-known/openid-configuration
    ...
```

<!-- vale off -->
## "ValidationError: child 'opensearch_security' fails"
<!-- vale on -->

This indicates that one or more of the OpenSearch Dashboards configuration settings are missing.

Check `opensearch_dashboards.yml` and make sure you have set the following minimal configuration:

```yml
opensearch_security.openid.connect_url: "..."
opensearch_security.openid.client_id: "..."
opensearch_security.openid.client_secret: "..."
```


<!-- vale off -->
## "Authentication failed. Please provide a new token."
<!-- vale on -->

This error has several potential root causes.


### Leftover cookies or cached credentials

Delete all cached browser data, or try again in a private browser window.


### Wrong client secret

To trade the access token for an identity token, most IdPs require you to provide a client secret. Check if the client secret in `opensearch_dashboards.yml` matches the client secret of your IdP configuration:

```
opensearch_security.openid.client_secret: "..."
```


### "Failed to get subject from JWT claims"

This error is logged on OpenSearch and means that the username could not be extracted from the ID token. Make sure the following setting matches the claims in the JWT your IdP issues:

```
openid_auth_domain:
  http_enabled: true
  order: 1
  http_authenticator:
    type: "openid"
    ...
    config:
      subject_key: <subject key>
    ...
```

### "Failed to get roles from JWT claims with roles_key"

This error indicates that the roles key you configured in `config.yml` does not exist in the JWT issued by your IdP. Make sure the following setting matches the claims in the JWT your IdP issues:

```
openid_auth_domain:
  http_enabled: true
  order: 1
  http_authenticator:
    type: "openid"
    ...
    config:
      roles_key: <roles key>
    ...
```
