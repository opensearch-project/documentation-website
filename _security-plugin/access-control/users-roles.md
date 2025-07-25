---
layout: default
title: Users and roles
parent: Access control
nav_order: 1
canonical_url: https://docs.opensearch.org/latest/security/access-control/users-roles/
---

# Users and roles

The security plugin includes an internal user database. Use this database in place of or in addition to an external authentication system such as LDAP or Active Directory.

Roles are the core way of controlling access to your cluster. Roles contain any combination of cluster-wide permissions, index-specific permissions, document- and field-level security, and tenants. Then you map users to these roles so that users gain those permissions.

Unless you need to create new [reserved or hidden users]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#reserved-and-hidden-resources), we **highly** recommend using OpenSearch Dashboards or the REST API to create new users, roles, and role mappings. The `.yml` files are for initial setup, not ongoing use.
{: .warning }

---

#### Table of contents
1. TOC
{:toc}


---

## Create users

You can create users using OpenSearch Dashboards, `internal_users.yml`, or the REST API. When creating a user, you can map users to roles using `internal_users.yml` or the REST API, but that feature is not currently available in OpenSearch Dashboards.

### OpenSearch Dashboards

1. Choose **Security**, **Internal Users**, and **Create internal user**.
1. Provide a username and password. The security plugin automatically hashes the password and stores it in the `.opendistro_security` index.
1. If desired, specify user attributes.

   Attributes are optional user properties that you can use for variable substitution in index permissions or document-level security.

1. Choose **Submit**.

### internal_users.yml

See [YAML files]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml#internal_usersyml).


### REST API

See [Create user]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-user).


## Create roles

Just like users, you can create roles using OpenSearch Dashboards, `roles.yml`, or the REST API.


### OpenSearch Dashboards

1. Choose **Security**, **Roles**, and **Create role**.
1. Provide a name for the role.
1. Add permissions as desired.

   For example, you might give a role no cluster permissions, `read` permissions to two indices, `unlimited` permissions to a third index, and read permissions to the `analysts` tenant.

1. Choose **Submit**.


### roles.yml

See [YAML files]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml#rolesyml).


### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-role).


## Map users to roles

If you didn't specify roles when you created your user, you can map roles to it afterwards.

Just like users and roles, you create role mappings using OpenSearch Dashboards, `roles_mapping.yml`, or the REST API.

### OpenSearch Dashboards

1. Choose **Security**, **Roles**, and a role.
1. Choose the **Mapped users** tab and **Manage mapping**.
1. Specify users or external identities (also known as backend roles).
1. Choose **Map**.


### roles_mapping.yml

See [YAML files]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml#roles_mappingyml).


### REST API

See [Create role mapping]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-role-mapping).


## Predefined roles

The security plugin includes several predefined roles that serve as useful defaults.

Role | Description
:--- | :---
`alerting_ack_alerts` | Grants permissions to view and acknowledge alerts, but not modify destinations or monitors.
`alerting_full_access` | Grants full permissions to all alerting actions.
`alerting_read_access` | Grants permissions to view alerts, destinations, and monitors, but not acknowledge alerts or modify destinations or monitors.
`anomaly_full_access` | Grants full permissions to all anomaly detection actions.
`anomaly_read_access` | Grants permissions to view detectors, but not create, modify, or delete detectors.
`all_access` | Grants full access to the cluster: all cluster-wide operations, write to all indices, write to all tenants.
`cross_cluster_replication_follower_full_access` | Grants full access to perform cross-cluster replication actions on the follower cluster.
`cross_cluster_replication_leader_full_access` | Grants full access to perform cross-cluster replication actions on the leader cluster.
`opensearch_dashboards_read_only` | A special role that prevents users from making changes to visualizations, dashboards, and other OpenSearch Dashboards objects. See `opensearch_security.readonly_mode.roles` in `opensearch_dashboards.yml`. Pair with the `opensearch_dashboards_user` role.
`opensearch_dashboards_user` | Grants permissions to use OpenSearch Dashboards: cluster-wide searches, index monitoring, and write to various OpenSearch Dashboards indices.
`logstash` | Grants permissions for Logstash to interact with the cluster: cluster-wide searches, cluster monitoring, and write to the various Logstash indices.
`manage_snapshots` | Grants permissions to manage snapshot repositories, take snapshots, and restore snapshots.
`readall` | Grants permissions for cluster-wide searches like `msearch` and search permissions for all indices.
`readall_and_monitor` | Same as `readall`, but with added cluster monitoring permissions.
`security_rest_api_access` | A special role that allows access to the REST API. See `plugins.security.restapi.roles_enabled` in `opensearch.yml` and [Access control for the API]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#access-control-for-the-api).
`reports_read_access` | Grants permissions to generate on-demand reports, download existing reports, and view report definitions, but not to create report definitions.
`reports_instances_read_access` | Grants permissions to generate on-demand reports and download existing reports, but not to view or create report definitions.
`reports_full_access` | Grants full permissions to reports.
`asynchronous_search_full_access` | Grants full permissions to all asynchronous search actions.
`asynchronous_search_read_access` | Grants permissions to view asynchronous searches, but not to submit, modify, or delete async searches.
`index_management_full_access` | Grants full permissions to all index management actions, including ISM, transforms, and rollups.


For more detailed summaries of the permissions for each role, reference their action groups against the descriptions in [Default action groups]({{site.url}}{{site.baseurl}}/security-plugin/access-control/default-action-groups/).


## Sample roles

The following examples show how you might set up a read-only and a bulk access role.


### Set up a read-only user in OpenSearch Dashboards

Create a new `read_only_index` role:

1. Open OpenSearch Dashboards.
1. Choose **Security**, **Roles**.
1. Create a new role named `read_only_index`.
1. For **Cluster permissions**, add the `cluster_composite_ops_ro` action group.
1. For **Index Permissions**, add an index pattern. For example, you might specify `my-index-*`.
1. For index permissions, add the `read` action group.
1. Choose **Create**.

Map three roles to the read-only user:

1. Choose the **Mapped users** tab and **Manage mapping**.
1. For **Internal users**, add your read-only user.
1. Choose **Map**.
1. Repeat these steps for the `opensearch_dashboards_user` and `opensearch_dashboards_read_only` roles.


### Set up a bulk access role in OpenSearch Dashboards

Create a new `bulk_access` role:

1. Open OpenSearch Dashboards.
1. Choose **Security**, **Roles**.
1. Create a new role named `bulk_access`.
1. For **Cluster permissions**, add the `cluster_composite_ops` action group.
1. For **Index Permissions**, add an index pattern. For example, you might specify `my-index-*`.
1. For index permissions, add the `write` action group.
1. Choose **Create**.

Map the role to your user:

1. Choose the **Mapped users** tab and **Manage mapping**.
1. For **Internal users**, add your bulk access user.
1. Choose **Map**.
