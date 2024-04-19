---
layout: default
title: Defining users and roles
parent: Access control
nav_order: 85
redirect_from:
 - /security/access-control/users-roles/
 - /security-plugin/access-control/users-roles/
---

# Defining users and roles

You define users in OpenSearch to control who has access to OpenSearch data. You can use the internal user database to store users, or you can store them in an external authentication system, such as [LDAP or Active Directory]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/).

You define roles to determine the scope of a permission or action group. You can create roles with specific privileges, for example, roles that contain any combination of cluster-wide permissions, index-specific permissions, document- and field-level security, and tenants.

You can map users to roles during user creation or after users and roles have been defined. This mapping determines the permissions and access levels for each user based on the roles they are assigned.

---

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Defining users

You can define users using OpenSearch Dashboards, `internal_users.yml`, or the REST API. When creating a user, you can map users to roles using `internal_users.yml` or the REST API. If you are using OpenSearch Dashboards to define users, follow the steps in the [Map users to roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#mapping-users-to-roles) tutorial.

Unless you are defining new [reserved or hidden users]({{site.url}}{{site.baseurl}}/security/access-control/api/#reserved-and-hidden-resources), using OpenSearch Dashboards or the REST API to create new users, roles, and role mappings is recommended. The `.yml` files are for initial setup, not ongoing use.
{: .warning }

### OpenSearch Dashboards

1. Choose **Security**, **Internal Users**, and **Create internal user**.
1. Provide a username and password. The Security plugin automatically hashes the password and stores it in the `.opendistro_security` index.
1. If desired, specify user attributes.

   Attributes are optional user properties that you can use for variable substitution in index permissions or document-level security.

1. Choose **Submit**.

### `internal_users.yml`

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#internal_usersyml).


### REST API

See [Create user]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-user).


## Defining roles

Similar to defining users, you can define roles using OpenSearch Dashboards, `roles.yml`, or the REST API. In addition, OpenSearch provides some predefined roles and a special read-only role, which you can read about later in this topic.

Unless you need to define new [reserved or hidden users]({{site.url}}{{site.baseurl}}/security/access-control/api/#reserved-and-hidden-resources), we strongly recommend using OpenSearch Dashboards or the REST API to create new users, roles, and role mappings. The `.yml` files are for initial setup, not ongoing use.
{: .warning }

### OpenSearch Dashboards

1. Choose **Security**, **Roles**, and **Create role**.
1. Provide a name for the role.
1. Add permissions as desired.

   For example, you might give a role no cluster permissions, `read` permissions to two indexes, `unlimited` permissions to a third index, and read permissions to the `analysts` tenant.

1. Choose **Submit**.


### `roles.yml`

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#rolesyml).


### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role).

## Editing roles

You can edit roles using one of the following methods.

### OpenSearch Dashboards

1. Choose **Security** > **Roles**. In the **Create role** section, select **Explore existing roles**. 
1. Select the role you want to edit. 
1. Choose **edit role**. Make any necessary updates to the role.
1. To save your changes, select **Update**.

### `roles.yml`

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#rolesyml).

### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role).

## Mapping users to roles

If you didn't specify roles when you created your user, you can map roles to it afterwards.

Just like users and roles, you create role mappings using OpenSearch Dashboards, `roles_mapping.yml`, or the REST API.

### OpenSearch Dashboards

1. Choose **Security**, **Roles**, and a role.
1. Choose the **Mapped users** tab and **Manage mapping**.
1. Specify users or external identities (also known as backend roles).
1. Choose **Map**.


### `roles_mapping.yml`

See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#roles_mappingyml).


### REST API

See [Create role mapping]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role-mapping).

## Defining read-only roles

A read-only role grants users the ability to read data from the OpenSearch cluster, but not to modify or delete any data. The read-only role is useful for scenarios where you want to provide access to data for reporting, analysis, or visualization purposes, without allowing modifications to the data or the cluster itself. This helps maintain data integrity and prevents accidental or unauthorized changes.

As with any role in OpenSearch, read-only roles can be configured using the following three methods: 
- Using OpenSearch Dashboards.
- Modifying the `yml` configuration files.
- Using the Cluster Settings API. 

The most user-friendly approach for anyone getting familiar with roles and role mappings is to use OpenSearch Dashboards, where it's easy to navigate the creation of roles and assign those roles to users. 
{ .tip}

### Defining a basic read-only role

To create a basic read-only role that allows users to access OpenSearch Dashboards, view existing dashboards and visualizations, and query different indexes, use the following permissions.

The following permissions give the user access to all tenants and indexes on the cluster.
{: .note}

#### Cluster permission

For the user that requires read-only access to cluster-wide resources, such as visualization or dashboards, add the `cluster_composite_ops_ro` permission to that user's role.

#### Index permission

If the user requires access to view visualizations, they will also require access to the index used to create the visualization. To give the user read-only access to all indexes, specify all (`*`) under the **Index** drop-down, and **Read** in **Index Permissions**.

#### Tenant permissions

If you use tenants to split work between different teams or projects, use the all (`*`) option followed by the **Read only** option.

![creating role]({{site.url}}{{site.baseurl}}/images/role_creation_read_only.png)

After all permission types are set and the role is defined, you can map the role directly to a user in the **Mapped users** tab in roles. Select **Map users** and select the user to map to this role. 

![mapping users]({{site.url}}{{site.baseurl}}/images/mapping-users.png)

### OpenSearch Dashboards `readonly_mode`

The OpenSearch Dashboards `readonly_mode` functionality is used to give the user access to the `Dashboards` UI only, removing all other UI elements from the view.
To configure this role, add the following line `opensearch_dashboards.yml` file:

```opensearch_security.readonly_mode.roles: [new_role]```

If the role mapped to the user has additional privileges or the user is mapped to other roles, giving them write access to indexes, this access will not be allowed using OpenSearch Dashboard. Direct data access to OpenSearch using curl or API is still allowed, as OpenSearch Dashboards is not involved in this communication. 

If the user is mapped to the `readonly_mode` role, all other elements of the UI will be removed, except for `Dashboards`. In the following comparison, the left view shows the screen from the perspective of a user mapped to a role in`readonly_mode`. On the right, the user is given a standard view.

![compare read only mode]({{site.url}}{{site.baseurl}}/images/compare_read_only_mode.png)

Mapping the user to only the `readonly_mode` role does not give them permissions to view relevant indexes or allow them to view the existing dashboards. Read access to indexes and dashboards require separate permissions.
{: .note }


If the user is also mapped to any roles listed under `plugins.security.restapi.roles_enabled` in `opensearch.yml`, for example `all_access` or `security_rest_api_access`, then `readonly_mode` is ignored, giving the user access to standard UI elements.


### Additional permissions

If the user requires access to additional permissions in addition to the `read_only` role,  such as alerting and anomaly detection tasks, you can use the existing predefined roles, such as `alerting_read_access` and `anomaly_read_access`.

## Predefined roles

The Security plugin includes several predefined roles that serve as useful defaults.

| **Role** | **Description** |
| :--- | :--- |
| `alerting_ack_alerts` | Grants permissions to view and acknowledge alerts, but not to modify destinations or monitors. |
| `alerting_full_access` | Grants full permissions to perform all alerting actions. |
| `alerting_read_access` | Grants permissions to view alerts, destinations, and monitors, but not to acknowledge alerts or modify destinations or monitors. |
| `all_access` | Grants full access to the cluster, including all cluster-wide operations, permissions to write to all cluster indexes, and permissions to write to all tenants. For more information about access using the REST API, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `anomaly_full_access` | Grants full permissions to perform all anomaly detection actions. |
| `anomaly_read_access` | Grants permissions to view detectors, but not to create, modify, or delete detectors. |
| `asynchronous_search_full_access` | Grants full permissions to perform all asynchronous search actions. |
| `asynchronous_search_read_access` | Grants permissions to view asynchronous searches but not to submit, modify, or delete them. |
| `cross_cluster_replication_follower_full_access` | Grants full access to perform cross-cluster replication actions on the follower cluster. |
| `cross_cluster_replication_leader_full_access`   | Grants full access to perform cross-cluster replication actions on the leader cluster. |
| `index_management_full_access` | Grants full permissions to perform all index management actions, including Index State Management (ISM), transforms, and rollups. |
| `index_management_read_access` | Same as `readall` but with added cluster permissions for monitoring. |
| `ml_full_access` | Grants full permissions to perform all machine learning (ML) features, including starting new ML tasks and reading or deleting models. |
| `ml_read_access` | Grants permissions to view ML features and results but not to modify them. |
| `notifications_full_access` | Grants full permissions to perform all notification actions. |
| `notifications_read_access` | Grants permissions to view notifications and their configurations but not to modify them. |
| `opensearch_dashboards_read_only` | Grants read-only access to OpenSearch Dashboards. |
| `opensearch_dashboards_user` | Grants basic user access to OpenSearch Dashboards. |
| `point_in_time_full_access`  | Grants full permissions to perform all Point in Time operations. |
| `readall` | Grants permissions for cluster-wide searches like `msearch` and search permissions for all indexes. |
| `reports_instances_read_access` | Grants permissions to generate on-demand reports and download existing reports but not to view or create report definitions. |
| `security_analytics_ack_alerts` | Grants permissions to view and acknowledge alerts. |
| `security_analytics_full_access` | Grants full permissions to use all Security Analytics functionality. |
| `security_analytics_read_access`  | Grants permissions to view Security Analytics components, such as detectors, alerts, and findings. Also includes permissions that allow users to search for detectors and rules. This role does not allow a user to perform actions such as modifying or deleting a detector. |
| `security_manager` | Grants permissions to manage security-related features and configurations.  |
| `snapshot_management_full_access` | Grants full permissions to perform all snapshot management actions.  |
| `snapshot_management_read_access`  | Grants permissions to view snapshot management actions and configurations but not to modify them. |


For more detailed summaries of the permissions for each role, reference their action groups against the descriptions in [Default action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/).


## Example 

The following example demonstrates how you can set up a bulk access role in OpenSearch Dashboards.

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
