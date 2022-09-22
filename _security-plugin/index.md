---
layout: default
title: About the security plugin
nav_order: 1
has_children: false
has_toc: false
redirect_from:
  - /security-plugin/
---

# About Security for OpenSearch

Security for OpenSearch is built around four main features that work together to safeguard data and track activity within the cluster. Separately, these features are:

* Encryption
* Authentication
* Access control (authorization)
* Audit logging and compliance.

Used together they provide effective protection of sensitive information by putting it behind multiple layers of defense and granting or restricting access to information at different levels in the OpenSearch data structure. Most implementations use a combination of options for these features to meet unique and specific security needs.

## Features at a glance

### Encryption

Encryption protects both data at rest and in transit. At rest, encryption secures sensitive information that’s kept as stored data in the indexes <how is this accomplished in OpenSearch, config and other-KMS?>. Some examples of stored data include indexes, logs, swap files, automated snapshots, and all data in the application directory. 

Encryption in transit encrypts information moving to and from and within the cluster. OpenSearch uses the Transport Layer Security (TLS) protocol and covers both client-to-node and node-to-node encryption.

You can find out more about configuring TLS in the [Configure TLS certificates](https://opensearch.org/docs/latest/security-plugin/configuration/tls/) section.

### Authentication

Authentication is used to validate the identity of users and works by verifying an end user’s credentials against a backend configuration. Those credentials can be a simple name and password, a JSON web token, or a TLS certificate. Once the authentication domain extracts those credentials from a user’s request it can check their validity against the authentication backend.

OpenSearch provides an internal users database to accomplish this but supports a wide range of industry-standard single-point identification protocols such as LDAP, Active Directory, SAML, and OpenID Connect. A common practice is to chain together more than one authentication method to create a more robust defense against unauthorized access. This might involve, for example, HTTP basic authentication followed by a backend configuration that specifies the LDAP protocol. See the [Backend configuration](https://opensearch.org/docs/latest/security-plugin/configuration/configuration/) section to learn more about setting up the backend.

### Access control

Access control (or authorization) generally involves selectively assigning permissions to users that allow them to perform specific tasks, such as clearing the cache for a particular index or taking a snapshot of the cluster. However, rather than assign individual permissions directly to users, OpenSearch manages access control by instead assigning permissions to roles and then mapping these roles to users.
Roles, therefore, define the actions that users can perform, including the data they can read, the cluster settings they can modify, the indexes to which they can write, and so on. Roles are reusable across multiple users, and users can have multiple roles.

Another notable characteristic of access control in OpenSearch is the ability to assign access within the domain to users through levels of increasing granularity. Fine grained access control (FGAC) means that a role can control permissions for users at not only the cluster level, but the index level, the document level, and even the field level. For example, a role may provide a user access to certain cluster-level permissions but not to specified indexes. Likewise, that role may grant access to certain types of documents but not others, or even include access to specific fields within a document but exclude access to other roles. Field masking further extends the fine grained control of data access by providing options to mask certain types of data, such as a list of emails, which can still be aggregated but not made viewable to a role.

To learn more about this feature, see the [Access control](https://opensearch.org/docs/latest/security-plugin/access-control/index/) section of security documentation.

### Audit logging and compliance

Finally, audit logging and compliance refers to those mechanisms that allow for tracking and analysis of activity within the cluster. Audit logging enables you to oversee changes made anywhere in the cluster, such as alterations to a domain or the modification of parameters. It also allows you to monitor and analyze access behaviors and all types of requests, whether valid or invalid. It also gives you the ability to filter by users to reduce noise and pressure on the CPU.

Where and how logging is archived is configurable at many levels of detail, and this includes a number of options for storing the logs. Compliance features also ensure that all required data is available if and when compliance auditing is required. In this case, the logging can be automated to focus on data especially pertinent to compliance requirements.

See the [Audit logs](https://opensearch.org/docs/latest/security-plugin/audit-logs/index/) section of security documentation to read more about this feature.

## Thinking in layers and levels

Security for OpenSearch is designed around and works best alongside the idea of defending you sensitive information within multiple layers of protection. 






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
