---
layout: default
title: Troubleshoot SAML
nav_order: 20
---

# SAML troubleshooting

This page includes troubleshooting steps for using SAML for OpenSearch Dashboards authentication.


---

#### Table of contents
- TOC
{:toc}


---

## Check sp.entity_id

Most identity providers (IdPs) allow you to configure multiple authentication methods for different applications. For example, in Okta, these clients are called "Applications." In Keycloak, they are called "Clients." Each one has its own entity ID. Make sure to configure `sp.entity_id` to match those settings:

```yml
saml:
  ...
  http_authenticator:
    type: 'saml'
    challenge: true
    config:
      ...
      sp:
        entity_id: opensearch-dashboards-saml
```


## Check the SAML assertion consumer service URL

After a successful login, your IdP sends a SAML response using HTTP POST to the OpenSearch Dashboards "assertion consumer service URL" (ACS).

The endpoint the OpenSearch Dashboards Security plugin provides is:

```
/_opendistro/_security/saml/acs
```

Make sure that you have configured this endpoint correctly in your IdP. Some IdPs also require you to add all endpoints to the allow list that they send requests to. Ensure that the ACS endpoint is listed.

OpenSearch Dashboards also requires you to add this endpoint to the allow list. Make sure you have the following entry in `opensearch_dashboards.yml`:

```
server.xsrf.allowlist: [/_opendistro/_security/saml/acs]
```


## Sign all documents

Some IdPs do not sign the SAML documents by default. Make sure the IdP signs all documents.


#### Keycloak

![Keycloak UI]({{site.url}}{{site.baseurl}}/images/saml-keycloak-sign-documents.png)


## Role settings

Including user roles in the SAML response is dependent on your IdP. For example, in Keycloak, this setting is in the **Mappers** section of your client. In Okta, you have to set group attribute statements. Make sure this is configured correctly and that the `roles_key` in the SAML configuration matches the role name in the SAML response:

```yml
saml:
  ...
  http_authenticator:
    type: 'saml'
    challenge: true
    config:
      ...
      roles_key: Role
```


## Inspect the SAML response

If you are not sure what the SAML response of your IdP contains and where it places the username and roles, you can enable debug mode in the `log4j2.properties`:

```
logger.token.name = com.amazon.dlic.auth.http.saml.Token
logger.token.level = debug
```

This setting prints the SAML response to the OpenSearch log file so that you can inspect and debug it. Setting this logger to `debug` generates many statements, so we don't recommend using it in production.

Another way of inspecting the SAML response is to monitor network traffic while logging in to OpenSearch Dashboards. The IdP uses HTTP POST requests to send Base64-encoded SAML responses to:

```
/_opendistro/_security/saml/acs
```

Inspect the payload of this POST request, and use a tool like [base64decode.org](https://www.base64decode.org/) to decode it.


## Check role mapping

The Security plugin uses a standard role mapping to map a user or backend role to one or more Security roles.

For username, the Security plugin uses the `NameID` attribute of the SAML response by default. For some IdPs, this attribute does not contain the expected username, but some internal user ID. Check the content of the SAML response to locate the element you want to use as username, and configure it by setting the `subject_key`:

```yml
saml:
  ...
  http_authenticator:
    type: 'saml'
    challenge: true
    config:
      ...
      subject_key: preferred_username
```

For checking that the correct backend roles are contained in the SAML response, inspect the contents, and set the correct attribute name:

```yml
saml:
  ...
  http_authenticator:
    type: 'saml'
    challenge: true
    config:
      ...
      roles_key: Role
```


## Inspect the JWT token

The Security plugin trades the SAML response for a more lightweight JSON web token. The username and backend roles in the JWT are ultimately mapped to roles in the Security plugin. If there is a problem with the mapping, you can enable the token debug mode using the same setting as [Inspect the SAML response](#inspect-the-saml-response).

This setting prints the JWT to the OpenSearch log file so that you can inspect and debug it using a tool like [JWT.io](https://jwt.io/).
