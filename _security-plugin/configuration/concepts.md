---
layout: default
title: Authentication flow
parent: Configuration
nav_order: 1
canonical_url: https://docs.opensearch.org/latest/security/authentication-backends/authc-index/
---

# Authentication flow

Understanding the authentication flow is a great way to get started with configuring the security plugin.

1. To identify a user who wants to access the cluster, the security plugin needs the user's credentials.

   These credentials differ depending on how you've configured the plugin. For example, if you use basic authentication, the credentials are a user name and password. If you use a JSON web token, the credentials are stored within the token itself. If you use TLS certificates, the credentials are the distinguished name (DN) of the certificate.

2. The security plugin authenticates the user's credentials against a backend: the internal user database, Lightweight Directory Access Protocol (LDAP), Active Directory, Kerberos, or JSON web tokens.

   The plugin supports chaining backends in `securityconfig/config.yml`. If more than one backend is present, the plugin tries to authenticate the user sequentially against each until one succeeds. A common use case is to combine the internal user database of the security plugin with LDAP/Active Directory.

3. After a backend verifies the user's credentials, the plugin collects any backend roles. These roles can be arbitrary strings in the internal user database, but in most cases, these backend roles come from LDAP/Active Directory.

4. After the user is authenticated and any backend roles are retrieved, the security plugin uses the role mapping to assign security roles to the user.

   If the role mapping doesn't include the user (or the user's backend roles), the user is successfully authenticated, but has no permissions.

5. The user can now perform actions as defined by the mapped security roles. For example, a user might map to the `kibana_user` role and thus have permissions to access OpenSearch Dashboards.
