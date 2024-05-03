---
layout: default
title: Authentication backends
nav_order: 45
has_children: true
has_toc: false
redirect_from:
  - /security/authentication-backends/
  - /security-plugin/configuration/concepts/
---

# Authentication backends

Authentication backend configurations determine the method or methods you use for authenticating users and the way users pass their credentials and sign in to OpenSearch. Having an understanding of the basic authentication flow before getting started can help with the configuration process for whichever backend you choose. Consider the high-level sequence of events in the description that follows, and then refer to the detailed steps for configuring the authentication type you choose to use with OpenSearch.

## Authentication flow

1. To identify a user who wants to access the cluster, the Security plugin needs the user's credentials.

   These credentials differ depending on how you've configured the plugin. For example, if you use basic authentication, the credentials are a username and password. If you use a JSON web token, the credentials (username and roles) are stored within the token itself. If you use TLS certificates, the credentials are the distinguished name (DN) of the certificate. No matter which backend you use, these credentials are included in the request for authentication. Note, the Security plugin does not distinguish between identity providers when handling standard role mappings. As a result, only backend roles will differ between two users with the same name coming from two different identity providers. 

2. The Security plugin authenticates a request against a backend configured for an authentication provider. Some examples of authentication providers used with OpenSearch include Basic Auth (which uses the internal user database), LDAP/Active Directory, JSON web tokens, SAML, or another authentication protocol.

   The plugin supports chaining backends in `config/opensearch-security/config.yml`. If more than one backend is present, the plugin tries to authenticate the user sequentially against each until one succeeds. A common use case is to combine the internal user database of the Security plugin with LDAP/Active Directory.

3. After a backend verifies the user's credentials, the plugin collects any [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/#concepts). The authentication provider determines the way these roles are retrieved. For example, LDAP extracts backend roles from its directory service based on their mappings to roles in OpenSearch, while SAML stores the roles as attributes. When basic authentication is used, the internal user database refers to role mappings configured in OpenSearch.

4. After the user is authenticated and any backend roles are retrieved, the Security plugin uses the role mapping to assign security roles to the user.

   If the role mapping doesn't include the user (or the user's backend roles), the user is successfully authenticated, but has no permissions.

5. The user can now perform actions as defined by the mapped security roles. For example, a user might map to the `kibana_user` role and thus have permissions to access OpenSearch Dashboards.
