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
* Audit logging and compliance

Used together they provide effective protection of sensitive information by putting the information behind multiple layers of defense and granting or restricting access to information at different levels in the OpenSearch data structure. Most implementations use a combination of options for these features to meet unique and specific security needs.

## Features at a glance

The following topics provide a general description of the features that define security in OpenSearch.

### Encryption

Encryption protects both data at rest and in transit. At rest, encryption secures sensitive information that’s kept as stored data. Some examples of stored data include indexes, logs, swap files, automated snapshots, and all data in the application directory. 

Encryption in transit encrypts information moving to, from, and within the cluster. OpenSearch uses the Transport Layer Security (TLS) protocol, which covers both client-to-node encryption (the REST layer) and node-to-node encryption (the transport layer). This combination of in-transit encryption guarantees that both requests to OpenSearch and the movement of information among different nodes is safe from tampering.

You can find out more about configuring TLS in the [Configure TLS certificates](https://opensearch.org/docs/latest/security-plugin/configuration/tls/) section.

### Authentication

Authentication is used to validate the identity of users and works by verifying an end user’s credentials against a backend configuration. These credentials can be a simple name and password, a JSON web token, or a TLS certificate. Once the authentication domain extracts those credentials from a user’s request it can check their validity against the authentication backend.

The backend used for validation can be OpenSearch's built-in internal user database – used for storing user and roles configurations and hashed passwords – or one of a wide range of industry-standard identification protocols such as LDAP, Active Directory, SAML, and OpenID Connect. A common practice is to chain together more than one authentication method to create a more robust defense against unauthorized access. This might involve, for example, HTTP basic authentication followed by a backend configuration that specifies the LDAP protocol. See the [Backend configuration](https://opensearch.org/docs/latest/security-plugin/configuration/configuration/) section to learn more about setting up the backend.

### Access control

Access control (or authorization) generally involves selectively assigning permissions to users that allow them to perform specific tasks, such as clearing the cache for a particular index or taking a snapshot of the cluster. However, rather than assign individual permissions directly to users, OpenSearch manages access control by instead assigning permissions to roles and then mapping these roles to users. For more on setting up these relationships, see [Users and roles](https://opensearch.org/docs/latest/security-plugin/access-control/users-roles/). Roles, therefore, define the actions that users can perform, including the data they can read, the cluster settings they can modify, the indexes to which they can write, and so on. Roles are reusable across multiple users, and users can have multiple roles.

Another notable characteristic of access control in OpenSearch is the ability to assign user access within the domain through levels of increasing granularity. Fine grained access control (FGAC) means that a role can control permissions for users at not only the cluster level, but the index level, the document level, and even the field level. For example, a role may provide a user access to certain cluster-level permissions but at the same time prevent the user from accessing a given group of indexes. Likewise, that role may grant access to certain types of documents but not others, or even include access to specific fields within a document but exclude access to other sensitive fields. Field masking further extends the fine grained control of data access by providing options to mask certain types of data, such as a list of emails, which can still be aggregated but not made viewable to a role.

To learn more about this feature, see the [Access control](https://opensearch.org/docs/latest/security-plugin/access-control/index/) section of security documentation.

### Audit logging and compliance

Finally, audit logging and compliance refer to mechanisms that allow for tracking and analysis of activity within the cluster. This becomes particulalry important after events where the cluster suffers unintended data exposure. These logging features enable you to oversee changes made anywhere in the cluster – such as alterations to a domain or the modification of parameters – and monitor access patterns and requests of all types, whether valid or invalid.

How OpenSearch archives logging is configurable at many levels of detail, and there are a numbner of options for where those logs are stored. Compliance features also ensure that all data is available if and when compliance auditing is required. In this case, the logging can be automated to focus on data especially pertinent to those compliance requirements.

See the [Audit logs](https://opensearch.org/docs/latest/security-plugin/audit-logs/index/) section of security documentation to read more about this feature.

## Other features and functionality

Security includes other features that make working in OpenSearch easier.

One such feature is OpenSearch Dashboards multi-tenancy. Tenants are work spaces that include visualizations, index patterns, and other Dashboards objects, which can be shared with other Dashboards users. OpenSearch leverages roles to manage accesss to tenants and safely make them available to other Dashboards users.
For more information on creating tenants, see [OpenSearch Dashboards multi-tenancy](https://opensearch.org/docs/latest/security-plugin/access-control/multi-tenancy/).

Another notable feature of Security is cross-cluster search. This feature provides a user with the ability to perform searches from one node in a cluster across other clusters that have been set up to coordinate this type of search. As with other features, cross-cluster search is supported by the OpenSearch access control infrastructure, which defines the permissions users have for working with this feature.
To learn more, see [Cross-cluster search](https://opensearch.org/docs/latest/security-plugin/access-control/cross-cluster-search/).

## Next steps

To get started with Security, see the configuration overview in the [Security configuration](https://opensearch.org/docs/latest/security-plugin/configuration/index/) section, which provides the basic steps for setting up Security in your OpenSearch implementation, including links to information about customizing security for your business needs.

