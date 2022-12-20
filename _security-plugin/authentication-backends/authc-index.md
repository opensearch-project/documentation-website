---
layout: default
title: Authentication backends
nav_order: 45
has_children: true
has_toc: false
redirect_from:
  - /security-plugin/authentication-backends/
---

# Authentication backends

Authentication backend configurations determine the method or methods you use for authenticating users and the way users pass their credentials and sign in to OpenSearch. Having an understanding of the basic authentication flow before getting started can help with the configuration process for whichever backend you choose. Consider the high-level sequence of events in the description that follows, and then refer to the detailed steps for configuring the authentication type you choose to use with OpenSearch.

## Authentication flow

1. To identify a user who wants to access the cluster, the Security plugin needs the user's credentials.

   These credentials differ depending on how you've configured the plugin. For example, if you use basic authentication, the credentials are a user name and password. If you use a JSON web token, the credentials are stored within the token itself. If you use TLS certificates, the credentials are the distinguished name (DN) of the certificate.

2. The Security plugin authenticates the user's credentials against a backend: the internal user database (basic authentictation), Lightweight Directory Access Protocol (LDAP)/Active Directory, JSON web tokens, SAML, or another authentication protocol.

   The plugin supports chaining backends in `config/opensearch-security/config.yml`. If more than one backend is present, the plugin tries to authenticate the user sequentially against each until one succeeds. A common use case is to combine the internal user database of the security plugin with LDAP/Active Directory.

3. After a backend verifies the user's credentials, the plugin collects any backend roles. These roles can be arbitrary strings in the internal user database, roles retrieved from the LDAP/Active Directory server, or roles that are kept as attributes with the SAML protocol.

4. After the user is authenticated and any backend roles are retrieved, the security plugin uses the role mapping to assign security roles to the user.

   If the role mapping doesn't include the user (or the user's backend roles), the user is successfully authenticated, but has no permissions.

5. The user can now perform actions as defined by the mapped security roles. For example, a user might map to the `kibana_user` role and thus have permissions to access OpenSearch Dashboards.
