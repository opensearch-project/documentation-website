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

## Creating and editing OpenSearch roles

You can update OpenSearch by using one of the following methods.

### Using the API

You can send HTTP requests to OpenSearch-provided endpoints to update security roles, permissions, and associated settings. This method offers granular control and automation capabilities for managing roles.

### Using the UI (OpenSearch Dashboards)

OpenSearch Dashboards provides a user-friendly interface for managing roles. Roles, permissions, and document-level security settings are configured in the Security section within OpenSearch Dashboards. When updating roles through the UI, OpenSearch Dashboards calls the API in the background to implement the changes.

### Editing the `roles.yml` file

If you want more granular control of your security configuration, you can edit roles and their associated permissions in the `roles.yml` file. This method provides direct access to the underlying configuration and can be version controlled for use in collaborative development environments.
For more information about creating roles, see the [Create roles](https://opensearch.org/docs/latest/security/access-control/users-roles/#create-roles) documentation.

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

## Edit roles

You can edit roles using one of the following methods.

### OpenSearch Dashboards

1. Choose **Security** > **Roles**. In the **Create role** section, select **Explore existing roles**. 
1. Select the role you want to edit. 
1. Choose **edit role**. Make any necessary updates to the role.
1. To save your changes, select **Update**.

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

| **Role** | **Description**  |
| :--- | :--- |
| `alerting_ack_alerts`  | Grants permissions to view and acknowledge alerts, but not to modify destinations or monitors. |
| `alerting_full_access` | Grants full permissions to perorm all alerting actions. |
| `alerting_read_access` | Grants permissions to view alerts, destinations, and monitors, but not to acknowledge alerts or modify destinations or monitors. |
| `anomaly_full_access`  | Grants full permissions to perform all anomaly detection actions. |
| `anomaly_read_access`  | Grants permissions to view detectors but not to create, modify, or delete detectors. |
| `all_access` | Grants full access to the cluster, including all cluster-wide operations, permission to write to all cluster indexes, and permission to write to all tenants. For more information about access using the REST API, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `asynchronous_search_full_access` | Grants full permissions to perform asynchronous search actions. |
| `asynchronous_search_read_access` | Grants permissions to view asynchronous searches but not to submit, modify, or delete them. |
| `cross_cluster_replication_follower_full_access` | Grants full access to perform cross-cluster replication actions on the follower cluster. |
| `cross_cluster_replication_leader_full_access` | Grants full access to perform cross-cluster replication actions on the leader cluster. |
| `readall` | Grants permissions for cluster-wide searches like `msearch` and grants search permissions for all indexes in the cluster. |
| `reports_instances_read_access` | Grants permissions to generate on-demand reports and download existing reports but not to view or create report definitions. |
| `index_management_full_access`  | Grants full permissions to all index management actions, including Index State Management (ISM), transforms, and rollups. |
| `index_management_read_access`  | Same as `readall` but adds cluster permissions for monitoring actions. |
| `ml_full_access` | Grants full permissions to all Machine Learning actions. |
| `ml_read_access` | Grants permissions to view Machine Learning features and results, but not to modify them. |
| `notifications_full_access`                      | Grants full permissions to all Notification actions.                                                                                                                                                                                                                                                                                        |
| `notifications_read_access`                      | Grants permissions to view notifications and their configurations, but not to modify them.                                                                                                                                                                                                                                                  |
| `opensearch_dashboards_read_only`                | Grants read-only access to OpenSearch Dashboards.                                                                                                                                                                                                                                                                                           |
| `opensearch_dashboards_user`                     | Grants basic user access to OpenSearch Dashboards.                                                                                                                                                                                                                                                                                          |
| `security_manager`                               | Grants permissions to manage security-related features and configurations.                                                                                                                                                                                                                                                                  |
| `snapshot_management_full_access`                | Grants full permissions to all snapshot management actions.                                                                                                                                                                                                                                                                                 |
| `snapshot_management_read_access`                | Grants permissions to view snapshot management actions and configurations, but not to modify them.                                                                                                                                                                                                                                          |
| `point_in_time_full_access`                      | Grants full permissions to all Point in Time operations.                                                                                                                                                                                                                                                                                    |
| `security_analytics_full_access`                 | Grants full permissions to all Security Analytics functionality.                                                                                                                                                                                                                                                                            |
| `security_analytics_read_access`                 | Grants permissions to view the various components in Security Analytics, such as detectors, alerts, and findings. It also includes permissions that allow users to search for detectors and rules. This role does not allow a user to perform actions such as modifying or deleting a detector.                                             |
| `security_analytics_ack_alerts`                  | Grants permissions to view and acknowledge alerts.                                                                                                                                                                                                                                                                                          |


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
