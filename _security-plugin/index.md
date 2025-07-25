---
layout: default
title: About the security plugin
nav_order: 1
has_children: false
has_toc: false
redirect_from:
  - /security-plugin/
canonical_url: https://docs.opensearch.org/latest/security/
---

# About the security plugin

OpenSearch has its own security plugin for authentication and access control. The plugin provides numerous features to help you secure your cluster.

The security plugin has several default users, roles, action groups, permissions, and settings for OpenSearch Dashboards that use `kibana` in their names. We will change these names in a future release.
{: .note }

Feature | Description
:--- | :---
Node-to-node encryption | Encrypts traffic between nodes in the OpenSearch cluster.
HTTP basic authentication | A simple authentication method that includes a user name and password as part of the HTTP request.
Support for Active Directory, LDAP, Kerberos, SAML, and OpenID Connect | Use existing, industry-standard infrastructure to authenticate users, or create new users in the internal user database.
Role-based access control | Roles define the actions that users can perform: the data they can read, the cluster settings they can modify, the indices to which they can write, and so on. Roles are reusable across users, and users can have multiple roles.
Index-level, document-level, and field-level security | Restrict access to entire indices, certain documents within an index, or certain fields within documents.
Audit logging | These logs let you track access to your OpenSearch cluster and are useful for compliance purposes or after unintended data exposure.
Cross-cluster search | Use a coordinating cluster to securely send search requests to remote clusters.
OpenSearch Dashboards multi-tenancy | Create shared (or private) spaces for visualizations and dashboards.
