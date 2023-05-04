---
layout: default
title: Troubleshoot OpenID Connect
nav_order: 30
---

# OpenID Connect troubleshooting

This page includes troubleshooting steps for using OpenID Connect with the Security plugin.


---

#### Table of contents
- TOC
{:toc}


---

## Set log level to debug

To help troubleshoot OpenID Connect, set the log level to `debug` on OpenSearch. Add the following lines in `config/log4j2.properties` and restart the node:

```
logger.securityjwt.name = com.amazon.dlic.auth.http.jwt
logger.securityjwt.level = trace
```

This setting prints a lot of helpful information to your log file. If this information isn't sufficient, you can also set the log level to `trace`.


## "Failed when trying to obtain the endpoints from your IdP"

This error indicates that the Security plugin can't reach the metadata endpoint of your IdP. In `opensearch_dashboards.yml`, check the following setting:

```
plugins.security.openid.connect_url: "http://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration"
```

If this error occurs on OpenSearch, check the following setting in `config.yml`:

```yml
openid_auth_domain:
  enabled: true
  order: 1
  http_authenticator:
    type: "openid"
    ...
    config:
      openid_connect_url: http://keycloak.examplesss.com:8080/auth/realms/master/.well-known/openid-configuration
    ...
```

## "ValidationError: child 'opensearch_security' fails"

This indicates that one or more of the OpenSearch Dashboards configuration settings are missing.

Check `opensearch_dashboards.yml` and make sure you have set the following minimal configuration:

```yml
plugins.security.openid.connect_url: "..."
plugins.security.openid.client_id: "..."
plugins.security.openid.client_secret: "..."
```


## "Authentication failed. Please provide a new token."

This error has several potential root causes.


### Leftover cookies or cached credentials

Please delete all cached browser data, or try again in a private browser window.


### Wrong client secret

To trade the access token for an identity token, most IdPs require you to provide a client secret. Check if the client secret in `opensearch_dashboards.yml` matches the client secret of your IdP configuration:

```
plugins.security.openid.client_secret: "..."
```


### "Failed to get subject from JWT claims"

This error is logged on OpenSearch and means that the username could not be extracted from the ID token. Make sure the following setting matches the claims in the JWT your IdP issues:

```
openid_auth_domain:
  enabled: true
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
  enabled: true
  order: 1
  http_authenticator:
    type: "openid"
    ...
    config:
      roles_key: <roles key>
    ...
```
