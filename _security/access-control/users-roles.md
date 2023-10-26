---
layout: default
title: Users and roles
parent: Access control
nav_order: 85
redirect_from:
 - /security/access-control/users-roles/
 - /security-plugin/access-control/users-roles/
---

# Users and roles

The Security plugin includes an internal user database. Use this database in place of or in addition to an external authentication system such as LDAP or Active Directory.

Roles are the core way of controlling access to your cluster. Roles contain any combination of cluster-wide permissions, index-specific permissions, document- and field-level security, and tenants. Then you map users to these roles so that users gain those permissions.

Unless you need to create new [reserved or hidden users]({{site.url}}{{site.baseurl}}/security/access-control/api/#reserved-and-hidden-resources), we **highly** recommend using OpenSearch Dashboards or the REST API to create new users, roles, and role mappings. The `.yml` files are for initial setup, not ongoing use.
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
1. Provide a username and password. The Security plugin automatically hashes the password and stores it in the `.opendistro_security` index.
1. If desired, specify user attributes.

   Attributes are optional user properties that you can use for variable substitution in index permissions or document-level security.

1. Choose **Submit**.

### internal_users.yml

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#internal_usersyml).


### REST API

See [Create user]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-user).


## Create roles

Just like users, you can create roles using OpenSearch Dashboards, `roles.yml`, or the REST API.


### OpenSearch Dashboards

1. Choose **Security**, **Roles**, and **Create role**.
1. Provide a name for the role.
1. Add permissions as desired.

   For example, you might give a role no cluster permissions, `read` permissions to two indexes, `unlimited` permissions to a third index, and read permissions to the `analysts` tenant.

1. Choose **Submit**.


### roles.yml

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#rolesyml).


### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role).


## Map users to roles

If you didn't specify roles when you created your user, you can map roles to it afterwards.

Just like users and roles, you create role mappings using OpenSearch Dashboards, `roles_mapping.yml`, or the REST API.

### OpenSearch Dashboards

1. Choose **Security**, **Roles**, and a role.
1. Choose the **Mapped users** tab and **Manage mapping**.
1. Specify users or external identities (also known as backend roles).
1. Choose **Map**.


### roles_mapping.yml

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#roles_mappingyml).


### REST API

See [Create role mapping]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role-mapping).


## Predefined roles

The Security plugin includes several predefined roles that serve as useful defaults.

| **Role** | **Description** |
| :--- | :--- |
| `alerting_ack_alerts` | Grants permissions to view and acknowledge alerts, but not to modify destinations or monitors. |
| `alerting_full_access` | Grants full permissions to all alerting actions. |
| `alerting_read_access` | Grants permissions to view alerts, destinations, and monitors, but not to acknowledge alerts or modify destinations or monitors. |
| `anomaly_full_access` | Grants full permissions to all anomaly detection actions. |
| `anomaly_read_access` | Grants permissions to view detectors, but not to create, modify, or delete detectors. |
| `all_access` | Grants full access to the cluster, including all cluster-wide operations, permission to write to all cluster indexes, and permission to write to all tenants. For more information on access using the REST API, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `cross_cluster_replication_follower_full_access` | Grants full access to perform cross-cluster replication actions on the follower cluster. |
| `cross_cluster_replication_leader_full_access` | Grants full access to perform cross-cluster replication actions on the leader cluster. |
| `observability_full_access` | Grants full access to perform actions on Observability objects such as visualizations, notebooks, and operational panels. |
| `observability_read_access` | Grants permission to view Observability objects such as visualizations, notebooks, and operational panels, but not to create, modify, or delete them. |
| `kibana_read_only` | A special role that prevents users from making changes to visualizations, dashboards, and other OpenSearch Dashboards objects. To enable read-only mode in Dashboards, add the `opensearch_security.readonly_mode.roles` setting to the `opensearch_dashboards.yml` file and include the role as a setting value. See the [example configuration]({{site.url}}{{site.baseurl}}/dashboards/branding/#sample-configuration) in Dashboards documentation. |
| `kibana_user` | Grants permissions to use OpenSearch Dashboards: cluster-wide searches, index monitoring, and write to various OpenSearch Dashboards indexes. |
| `logstash` | Grants permissions for Logstash to interact with the cluster: cluster-wide searches, cluster monitoring, and write to the various Logstash indexes. |
| `manage_snapshots` | Grants permissions to manage snapshot repositories, take snapshots, and restore snapshots. |
| `readall` | Grants permissions for cluster-wide searches like `msearch` and search permissions for all indexes. |
| `readall_and_monitor` | Same as `readall` but with added cluster permissions for monitoring. |
| `security_rest_api_access` | A special role that allows access to the REST API. See `plugins.security.restapi.roles_enabled` in `opensearch.yml` and [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `reports_read_access` | Grants permissions to generate on-demand reports, download existing reports, and view report definitions but not to create report definitions. |
| `reports_instances_read_access` | Grants permissions to generate on-demand reports and download existing reports but not to view or create report definitions. |
| `reports_full_access` | Grants full permissions to reports. |
| `asynchronous_search_full_access` | Grants full permissions to all asynchronous search actions. |
| `asynchronous_search_read_access` | Grants permissions to view asynchronous searches but not to submit, modify, or delete them. |
| `index_management_full_access` | Grants full permissions to all index management actions, including Index State Management (ISM), transforms, and rollups. |
| `snapshot_management_full_access` | Grants full permissions to all snapshot management actions. |
| `snapshot_management_read_access` | Grants permissions to view policies but not to create, modify, start, stop, or delete them. |
| `point_in_time_full_access` | Grants full permissions to all Point in Time operations. |
| `security_analytics_full_access` | Grants full permissions to all Security Analytics functionality. |
| `security_analytics_read_access` | Grants permissions to view the various components in Security Analytics, such as detectors, alerts, and findings. It also includes permissions that allow users to search for detectors and rules. This role does not allow a user to perform actions such as modifying or deleting a detector. |
| `security_analytics_ack_alerts` | Grants permissions to view and acknowledge alerts. |

For more detailed summaries of the permissions for each role, reference their action groups against the descriptions in [Default action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/).


## Sample roles

The following examples demonstrate how you might set up a read-only role and a bulk access role.

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
