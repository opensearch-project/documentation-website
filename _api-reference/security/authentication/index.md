---
layout: default
title: Authentication APIs
parent: Security APIs
has_children: true
nav_order: 10
redirect_from:
  - /api-reference/security/authentication/
canonical_url: https://docs.opensearch.org/latest/api-reference/security/authentication/index/
---

# Authentication APIs

Authentication is a fundamental aspect of security in OpenSearch, verifying the identity of users and services before granting access to protected resources. The Security plugin provides several APIs you can use to manage authentication, obtain user information, and handle credentials.

## Available APIs

The Authentication APIs include the following operations:

- [Authentication Information API]({{site.url}}{{site.baseurl}}/api-reference/security/authentication/auth-info/): Returns information about the currently authenticated user, including roles, backend roles, and tenant memberships. Useful for debugging authentication issues, verifying permissions, and retrieving user context for applications.

- [Change Password API]({{site.url}}{{site.baseurl}}/api-reference/security/authentication/change-password/): Lets users update their own passwords securely. Requires verification of the current password and does not require administrator involvement.

## Authentication workflows

These APIs support the following common authentication workflows:

- **User verification**: Confirm a user's identity and permissions before executing sensitive operations.
- **Self-service password management**: Allow users to change their passwords independently.
- **Multi-tenant access**: Determine a user's accessible tenants and associated permissions.

## Authentication methods

The Security plugin supports [multiple authentication methods]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/), including:

- Basic authentication (username and password).
- Token-based authentication.
- Certificate-based authentication.
- Single sign-on (SSO) methods, such as SAML and OpenID Connect.

The APIs in this section are compatible with all supported authentication methods and offer a consistent interface for managing authentication in OpenSearch.
