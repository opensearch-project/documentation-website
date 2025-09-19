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

You can define users by using OpenSearch Dashboards, `internal_users.yml`, or the REST API. When creating users, you can map users to roles by using `internal_users.yml` or the REST API. If you are using OpenSearch Dashboards to define users, follow the steps in the [Map users to roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#mapping-users-to-roles) tutorial.

Unless you are defining new [reserved or hidden users]({{site.url}}{{site.baseurl}}/security/access-control/api/#reserved-and-hidden-resources), using OpenSearch Dashboards or the REST API to create new users, roles, and role mappings is recommended. The `.yml` files are for initial setup and are not for ongoing use.
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

Similarly to defining users, you can define roles using OpenSearch Dashboards, `roles.yml`, or the REST API. OpenSearch provides predefined roles and a special read-only role.

Unless you are defining new [reserved or hidden users]({{site.url}}{{site.baseurl}}/security/access-control/api/#reserved-and-hidden-resources), using OpenSearch Dashboards or the REST API to create new users, roles, and role mappings is recommended. The `.yml` files are for initial setup and are not for ongoing use.
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

See [Patch role]({{site.url}}{{site.baseurl}}/security/access-control/api/#patch-role).

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

A read-only role grants a user the ability to read data from the OpenSearch cluster but not to modify or delete any data. The read-only role is useful when you want to provide access to data for reporting, analysis, or visualization purposes without allowing modifications to the data or the cluster itself. This maintains data integrity and prevents accidental or unauthorized changes.

As with any role in OpenSearch, a read-only role can be configured using the following methods:
 
- Using OpenSearch Dashboards
- Modifying the `yml` configuration files
- Using the Cluster Settings API 

The simplest way to get familiar with roles and role mappings is to use OpenSearch Dashboards. The interface simplifies creating roles and assigning those roles to users, with an easy-to-navigate workflow. 
{: .tip}

### Defining a basic read-only role

To create a basic read-only role that allows a user to access OpenSearch Dashboards, view existing dashboards and visualizations, and query different indexes, use the following permissions. These permissions give the user access to all tenants and indexes on the cluster.


#### Cluster permissions

For a user requiring read-only access to cluster-wide resources, such as visualizations or dashboards, add the `cluster_composite_ops_ro` permission to that user's role.

#### Index permissions

A user requiring access to view visualizations will also require access to the index used to create the visualization. To give a user read-only access to all indexes, specify all (`*`) under the **Index** dropdown and **Read** in **Index Permissions**.

#### Tenant permissions

If you use tenants to split work between teams or projects, use the all (`*`) option followed by the **Read only** option, as shown in the following image.

![creating role]({{site.url}}{{site.baseurl}}/images/role_creation_read_only.png)

After setting all permission types and defining the role, you can map the role directly to a user on the role's **Mapped users** tab. Select **Map users** and then choose a user to map to the role, as shown in the following image.

![mapping users]({{site.url}}{{site.baseurl}}/images/mapping-users.png)

### OpenSearch Dashboards `readonly_mode`

The OpenSearch Dashboards `readonly_mode` functionality is used to give a user access to the `Dashboards` interface only, removing all other UI elements from view.

To configure this role, add the following line to your `opensearch_dashboards.yml` file:

```opensearch_security.readonly_mode.roles: [new_role]```

Even if the assigned role grants additional privileges or a user is mapped to other roles with write access to indexes, OpenSearch Dashboards restricts this access. Direct access to OpenSearch data using CURL or API is still allowed. OpenSearch Dashboards is not involved in this communication. 

If a user is mapped to the `readonly_mode` role, all other elements of the UI will be removed, except for `Dashboards`. In the following image, the view on the left shows the screen from the perspective of a user mapped to a `readonly_mode` role. The view on the right shows a user's standard view.

![compare read only mode]({{site.url}}{{site.baseurl}}/images/compare_read_only_mode.png)

Mapping a user to only the `readonly_mode` role does not allow them to view relevant indexes or existing dashboards. Read access to indexes and dashboards requires separate permissions.
{: .note }


If a user is also mapped to any role listed under `plugins.security.restapi.roles_enabled` in `opensearch.yml`, for example, `all_access` or `security_rest_api_access`, then `readonly_mode` is ignored, giving them access to the standard UI elements.

### Additional permissions

If a user requires permissions in addition to those included in the `read_only` role, such as for alerting or anomaly detection tasks, you can assign predefined roles, such as `alerting_read_access` or `anomaly_read_access`.

## Predefined roles

The Security plugin includes several predefined roles that serve as useful defaults.

### Built-in roles

The following table lists built-in roles that are always provided:

| **Role** | **Description** |
| :--- | :--- |
| `all_access`| Superuser-style role, full cluster access, all cluster operations, write to all indexes, and all tenants. |
| `kibana_server` | Role used by the OpenSearch Dashboards server user to read/write its internal saved objects and system indexes. Don’t assign to human users. |
| `kibana_user` | Lets a user sign in and use Dashboards. This includes cluster read and search, index monitoring, and writes to OpenSearch Dashboards indexes. Pair with read permissions to your data. |
| `logstash`| Grants Logstash the permissions it needs to interact with OpenSearch |
| `manage_snapshots`| Manage snapshot repositories and run snapshot/restore operations. |
| `own_index` | Per-user index role which gives a user full access to an index named for the user. Useful for personal workspaces or multi-tenant setups. |
| `readall` | Cluster-wide read/search across all indexes, for example `_search`, `_msearch`. |
| `readall_and_monitor` | Same as `readall`, plus cluster monitoring privileges, such as health and stats. |                                                                                           |

### Demo roles

The following table lists the demo roles that are created by default if the `roles.yml` file is not provided when initializing Security plugin.

| **Role** | **Description** |
| :--- | :--- |
| `alerting_ack_alerts`| Grants permissions to view and acknowledge alerts, but not to modify destinations or monitors. |
| `alerting_full_access` | Grants full permissions to perform all alerting actions. |
| `alerting_read_access` | Grants permissions to view alerts, destinations, and monitors, but not to acknowledge alerts or modify destinations or monitors. |
| `anomaly_full_access`| Grants full permissions to perform all anomaly detection actions. |
| `anomaly_read_access`| Grants permissions to view detectors, but not to create, modify, or delete detectors. |
| `asynchronous_search_full_access`| Grants full permissions to perform all asynchronous search actions. |
| `asynchronous_search_read_access`| Grants permissions to view asynchronous searches but not to submit, modify, or delete them. |
| `cross_cluster_replication_follower_full_access` | Grants full access to perform cross-cluster replication actions on the follower cluster. |
| `cross_cluster_replication_leader_full_access` | Grants full access to perform cross-cluster replication actions on the leader cluster. |
| `index_management_full_access` | Grants full permissions to perform all index management actions, including ISM, transforms, and rollups. |
| `ml_full_access` | Grants full permissions to use all machine learning (ML) features, including starting tasks and managing models. |
| `ml_read_access` | Grants permissions to view ML configuration, stats, models, and tasks without modifying them. |
| `notifications_full_access`| Grants full permissions to perform all Notifications actions. |
| `notifications_read_access`| Grants permissions to view Notifications configuration/channels and features but not modify them. |
| `point_in_time_full_access`| Grants full permissions to perform all Point-in-Time operations.|
| `reports_instances_read_access`| Grants permissions to generate on-demand reports and download existing report instances, but not to view/create report definitions. |
| `security_analytics_ack_alerts`| Grants permissions to view and acknowledge Security Analytics alerts. |
| `security_analytics_full_access` | Grants full permissions to use all Security Analytics functionality. |
| `security_analytics_read_access` | Grants permissions to view Security Analytics detectors, alerts, findings, mappings, and rules. |
| `snapshot_management_full_access`| Grants full permissions to perform all snapshot management actions (including repositories and snapshots).|
| `snapshot_management_read_access`| Grants permissions to view snapshot management policies, repositories, and snapshots without modifying them. |

### Detailed permissions breakdown

The following is a detailed list of permissions assigned to each demo role:

```json
# Restrict users so they can only view visualization and dashboard on OpenSearchDashboards
kibana_read_only:
  reserved: true

# The security REST API access role is used to assign specific users access to change the security settings through the REST API.
security_rest_api_access:
  reserved: true

security_rest_api_full_access:
  reserved: true
  cluster_permissions:
    - 'restapi:admin/actiongroups'
    - 'restapi:admin/allowlist'
    - 'restapi:admin/config/update'
    - 'restapi:admin/internalusers'
    - 'restapi:admin/nodesdn'
    - 'restapi:admin/roles'
    - 'restapi:admin/rolesmapping'
    - 'restapi:admin/ssl/certs/info'
    - 'restapi:admin/ssl/certs/reload'
    - 'restapi:admin/tenants'

# Allows users to view monitors, destinations and alerts
alerting_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/alerting/alerts/get'
    - 'cluster:admin/opendistro/alerting/destination/get'
    - 'cluster:admin/opendistro/alerting/monitor/get'
    - 'cluster:admin/opendistro/alerting/monitor/search'
    - 'cluster:admin/opensearch/alerting/comments/search'
    - 'cluster:admin/opensearch/alerting/findings/get'
    - 'cluster:admin/opensearch/alerting/remote/indexes/get'
    - 'cluster:admin/opensearch/alerting/workflow/get'
    - 'cluster:admin/opensearch/alerting/workflow_alerts/get'

# Allows users to view and acknowledge alerts
alerting_ack_alerts:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/alerting/alerts/*'
    - 'cluster:admin/opendistro/alerting/chained_alerts/*'
    - 'cluster:admin/opendistro/alerting/workflow_alerts/*'
    - 'cluster:admin/opensearch/alerting/comments/*'

# Allows users to use all alerting functionality
alerting_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/alerting/*'
    - 'cluster:admin/opensearch/alerting/*'
    - 'cluster:admin/opensearch/notifications/feature/publish'
    - 'cluster_monitor'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/aliases/get'
        - 'indices:admin/mappings/get'
        - 'indices_monitor'

# Allow users to read Anomaly Detection detectors and results
anomaly_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/ad/detector/info'
    - 'cluster:admin/opendistro/ad/detector/search'
    - 'cluster:admin/opendistro/ad/detector/validate'
    - 'cluster:admin/opendistro/ad/detectors/get'
    - 'cluster:admin/opendistro/ad/result/search'
    - 'cluster:admin/opendistro/ad/result/topAnomalies'
    - 'cluster:admin/opendistro/ad/tasks/search'

# Allows users to use all Anomaly Detection functionality
anomaly_full_access:
  reserved: true
  cluster_permissions:
    - "cluster:admin/ingest/pipeline/delete"
    - "cluster:admin/ingest/pipeline/put"
    - 'cluster:admin/opendistro/ad/*'
    - 'cluster_monitor'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/aliases/get'
        - 'indices:admin/mappings/fields/get'
        - 'indices:admin/mappings/fields/get*'
        - 'indices:admin/mappings/get'
        - 'indices:admin/resolve/index'
        - 'indices:admin/setting/put'
        - 'indices:data/read/field_caps*'
        - 'indices:data/read/search'
        - 'indices_monitor'

# Allow users to execute read only k-NN actions
knn_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/knn_get_model_action'
    - 'cluster:admin/knn_search_model_action'
    - 'cluster:admin/knn_stats_action'

# Allow users to use all k-NN functionality
knn_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/knn_delete_model_action'
    - 'cluster:admin/knn_get_model_action'
    - 'cluster:admin/knn_remove_model_from_cache_action'
    - 'cluster:admin/knn_search_model_action'
    - 'cluster:admin/knn_stats_action'
    - 'cluster:admin/knn_training_job_route_decision_info_action'
    - 'cluster:admin/knn_training_job_router_action'
    - 'cluster:admin/knn_training_model_action'
    - 'cluster:admin/knn_update_model_graveyard_action'
    - 'cluster:admin/knn_warmup_action'

# Allow users to execute read only ip2geo datasource action
ip2geo_datasource_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/geospatial/datasource/get'

# Allow users to use all ip2geo datasource action
ip2geo_datasource_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/geospatial/datasource/*'

# Allows users to read Notebooks
notebooks_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/notebooks/get'
    - 'cluster:admin/opendistro/notebooks/list'

# Allows users to all Notebooks functionality
notebooks_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/notebooks/create'
    - 'cluster:admin/opendistro/notebooks/delete'
    - 'cluster:admin/opendistro/notebooks/get'
    - 'cluster:admin/opendistro/notebooks/list'
    - 'cluster:admin/opendistro/notebooks/update'

# Allows users to read observability objects
observability_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/observability/get'

# Allows users to all Observability functionality
observability_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/observability/create'
    - 'cluster:admin/opensearch/observability/delete'
    - 'cluster:admin/opensearch/observability/get'
    - 'cluster:admin/opensearch/observability/update'

# Allows users to all PPL functionality
ppl_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/ppl'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/mappings/get'
        - 'indices:data/read/search*'
        - 'indices:monitor/settings/get'

# Allows users to read and download Reports
reports_instances_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/reports/instance/get'
    - 'cluster:admin/opendistro/reports/instance/list'
    - 'cluster:admin/opendistro/reports/menu/download'

# Allows users to read and download Reports and Report-definitions
reports_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/reports/definition/get'
    - 'cluster:admin/opendistro/reports/definition/list'
    - 'cluster:admin/opendistro/reports/instance/get'
    - 'cluster:admin/opendistro/reports/instance/list'
    - 'cluster:admin/opendistro/reports/menu/download'

# Allows users to all Reports functionality
reports_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/reports/definition/create'
    - 'cluster:admin/opendistro/reports/definition/delete'
    - 'cluster:admin/opendistro/reports/definition/get'
    - 'cluster:admin/opendistro/reports/definition/list'
    - 'cluster:admin/opendistro/reports/definition/on_demand'
    - 'cluster:admin/opendistro/reports/definition/update'
    - 'cluster:admin/opendistro/reports/instance/get'
    - 'cluster:admin/opendistro/reports/instance/list'
    - 'cluster:admin/opendistro/reports/menu/download'

# Allows users to use all asynchronous-search functionality
asynchronous_search_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/asynchronous_search/*'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:data/read/search*'

# Allows users to read stored asynchronous-search results
asynchronous_search_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/asynchronous_search/get'

# Allows user to use all index_management actions - ism policies, rollups, transforms
index_management_full_access:
  reserved: true
  cluster_permissions:
    - "cluster:admin/opendistro/ism/*"
    - "cluster:admin/opendistro/rollup/*"
    - "cluster:admin/opendistro/transform/*"
    - "cluster:admin/opensearch/controlcenter/lron/*"
    - "cluster:admin/opensearch/notifications/channels/get"
    - "cluster:admin/opensearch/notifications/feature/publish"
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/opensearch/ism/*'
        - 'indices:internal/plugins/replication/index/stop'

# Allows users to use all cross cluster replication functionality at leader cluster
cross_cluster_replication_leader_full_access:
  reserved: true
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - "indices:admin/plugins/replication/index/setup/validate"
        - "indices:data/read/plugins/replication/changes"
        - "indices:data/read/plugins/replication/file_chunk"

# Allows users to use all cross cluster replication functionality at follower cluster
cross_cluster_replication_follower_full_access:
  reserved: true
  cluster_permissions:
    - "cluster:admin/plugins/replication/autofollow/update"
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - "indices:admin/plugins/replication/index/pause"
        - "indices:admin/plugins/replication/index/resume"
        - "indices:admin/plugins/replication/index/setup/validate"
        - "indices:admin/plugins/replication/index/start"
        - "indices:admin/plugins/replication/index/status_check"
        - "indices:admin/plugins/replication/index/stop"
        - "indices:admin/plugins/replication/index/update"
        - "indices:data/write/plugins/replication/changes"

# Allows users to use all cross cluster search functionality at remote cluster
cross_cluster_search_remote_full_access:
  reserved: true
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/shards/search_shards'
        - 'indices:data/read/search'

# Allow users to operate query assistant
query_assistant_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/ml/config/get'
    - 'cluster:admin/opensearch/ml/execute'
    - 'cluster:admin/opensearch/ml/predict'
    - 'cluster:admin/opensearch/ppl'

# Allow users to read ML stats/models/tasks
ml_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/ml/config/get'
    - 'cluster:admin/opensearch/ml/connectors/get'
    - 'cluster:admin/opensearch/ml/connectors/search'
    - 'cluster:admin/opensearch/ml/controllers/get'
    - 'cluster:admin/opensearch/ml/memory/conversation/get'
    - 'cluster:admin/opensearch/ml/memory/conversation/interaction/search'
    - 'cluster:admin/opensearch/ml/memory/conversation/list'
    - 'cluster:admin/opensearch/ml/memory/conversation/search'
    - 'cluster:admin/opensearch/ml/memory/interaction/get'
    - 'cluster:admin/opensearch/ml/memory/interaction/list'
    - 'cluster:admin/opensearch/ml/memory/trace/get'
    - 'cluster:admin/opensearch/ml/model_groups/get'
    - 'cluster:admin/opensearch/ml/model_groups/search'
    - 'cluster:admin/opensearch/ml/models/get'
    - 'cluster:admin/opensearch/ml/models/search'
    - 'cluster:admin/opensearch/ml/profile/nodes'
    - 'cluster:admin/opensearch/ml/stats/nodes'
    - 'cluster:admin/opensearch/ml/tasks/get'
    - 'cluster:admin/opensearch/ml/tasks/search'
    - 'cluster:admin/opensearch/ml/tools/get'
    - 'cluster:admin/opensearch/ml/tools/list'

# Allows users to use all ML functionality
ml_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/ml/*'
    - 'cluster_monitor'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices_monitor'

# Allows users to use all Notifications functionality
notifications_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/notifications/*'

# Allows users to read Notifications config/channels
notifications_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/notifications/channels/get'
    - 'cluster:admin/opensearch/notifications/configs/get'
    - 'cluster:admin/opensearch/notifications/features'

# Allows users to use all snapshot management functionality
snapshot_management_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/notifications/feature/publish'
    - 'cluster:admin/opensearch/snapshot_management/*'
    - 'cluster:admin/repository/*'
    - 'cluster:admin/snapshot/*'

# Allows users to see snapshots, repositories, and snapshot management policies
snapshot_management_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/snapshot_management/policy/explain'
    - 'cluster:admin/opensearch/snapshot_management/policy/get'
    - 'cluster:admin/opensearch/snapshot_management/policy/search'
    - 'cluster:admin/repository/get'
    - 'cluster:admin/snapshot/get'

# Allows user to use point in time functionality
point_in_time_full_access:
  reserved: true
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'manage_point_in_time'

# Allows users to see security analytics detectors and others
security_analytics_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/securityanalytics/alerts/get'
    - 'cluster:admin/opensearch/securityanalytics/correlationAlerts/get'
    - 'cluster:admin/opensearch/securityanalytics/correlations/findings'
    - 'cluster:admin/opensearch/securityanalytics/correlations/list'
    - 'cluster:admin/opensearch/securityanalytics/detector/get'
    - 'cluster:admin/opensearch/securityanalytics/detector/search'
    - 'cluster:admin/opensearch/securityanalytics/findings/get'
    - 'cluster:admin/opensearch/securityanalytics/logtype/search'
    - 'cluster:admin/opensearch/securityanalytics/mapping/get'
    - 'cluster:admin/opensearch/securityanalytics/mapping/view/get'
    - 'cluster:admin/opensearch/securityanalytics/rule/get'
    - 'cluster:admin/opensearch/securityanalytics/rule/search'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/alerts/get'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/iocs/findings/get'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/iocs/list'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/monitors/search'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/sources/get'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/sources/search'

# Allows users to use all security analytics functionality
security_analytics_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/securityanalytics/alerts/*'
    - 'cluster:admin/opensearch/securityanalytics/connections/*'
    - 'cluster:admin/opensearch/securityanalytics/correlationAlerts/*'
    - 'cluster:admin/opensearch/securityanalytics/correlations/*'
    - 'cluster:admin/opensearch/securityanalytics/detector/*'
    - 'cluster:admin/opensearch/securityanalytics/findings/*'
    - 'cluster:admin/opensearch/securityanalytics/logtype/*'
    - 'cluster:admin/opensearch/securityanalytics/mapping/*'
    - 'cluster:admin/opensearch/securityanalytics/rule/*'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/*'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/mapping/put'
        - 'indices:admin/mappings/get'

# Allows users to view and acknowledge alerts
security_analytics_ack_alerts:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/securityanalytics/alerts/*'
    - 'cluster:admin/opensearch/securityanalytics/correlationAlerts/*'
    - 'cluster:admin/opensearch/securityanalytics/threatintel/alerts/*'

# Allows users to use all Flow Framework functionality
flow_framework_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/flow_framework/*'
    - 'cluster_monitor'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/aliases/get'
        - 'indices:admin/mappings/get'
        - 'indices_monitor'

# Allow users to read flow framework's workflows and their state
flow_framework_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/flow_framework/workflow/get'
    - 'cluster:admin/opensearch/flow_framework/workflow/search'
    - 'cluster:admin/opensearch/flow_framework/workflow_state/get'
    - 'cluster:admin/opensearch/flow_framework/workflow_state/search'
    - 'cluster:admin/opensearch/flow_framework/workflow_step/get'

# Allows users to use all query insights APIs
query_insights_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/insights/live_queries/*'
    - 'cluster:admin/opensearch/insights/top_queries/*'
  index_permissions:
    - index_patterns:
        - 'top_queries-*'
      allowed_actions:
        - "indices_all"

# Allow users to execute read only LTR actions
ltr_read_access:
  reserved: true
  cluster_permissions:
    - cluster:admin/ltr/caches/stats
    - cluster:admin/ltr/featurestore/list
    - cluster:admin/ltr/stats

# Allow users to execute all LTR actions
ltr_full_access:
  reserved: true
  cluster_permissions:
    - cluster:admin/ltr/*

# Allow users to use all Search Relevance functionalities
search_relevance_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/search_relevance/*'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/mappings/get'
        - 'indices:data/read/search*'

# Allow users to read Search Relevance resources
search_relevance_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/search_relevance/experiment/get'
    - 'cluster:admin/opensearch/search_relevance/judgment/get'
    - 'cluster:admin/opensearch/search_relevance/queryset/get'
    - 'cluster:admin/opensearch/search_relevance/search_configuration/get'

# Allow users to read Forecast resources
forecast_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/plugin/forecast/forecaster/info'
    - 'cluster:admin/plugin/forecast/forecaster/stats'
    - 'cluster:admin/plugin/forecast/forecaster/suggest'
    - 'cluster:admin/plugin/forecast/forecaster/validate'
    - 'cluster:admin/plugin/forecast/forecasters/get'
    - 'cluster:admin/plugin/forecast/forecasters/info'
    - 'cluster:admin/plugin/forecast/forecasters/search'
    - 'cluster:admin/plugin/forecast/result/topForecasts'
    - 'cluster:admin/plugin/forecast/tasks/search'
  index_permissions:
    - index_patterns:
        - 'opensearch-forecast-result*'
      allowed_actions:
        - 'indices:admin/mappings/fields/get*'
        - 'indices:admin/resolve/index'
        - 'indices:data/read*'

# Allows users to use all Forecasting functionality
forecast_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/plugin/forecast/*'
    - 'cluster:admin/settings/update'
    - 'cluster_monitor'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/aliases/get'
        - 'indices:admin/mapping/get'
        - 'indices:admin/mapping/put'
        - 'indices:admin/mappings/fields/get*'
        - 'indices:admin/mappings/get'
        - 'indices:admin/resolve/index'
        - 'indices:data/read*'
        - 'indices:data/read/field_caps*'
        - 'indices:data/read/search'
        - 'indices:data/write*'
        - 'indices_monitor'
```

## Example 

The following tutorial describes the steps for creating a bulk access role in OpenSearch Dashboards.

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

## Admin and super admin roles

OpenSearch user roles are essential for controlling access to cluster resources. Users can be categorized as regular users, admin users, or super admin users based on their access rights and responsibilities.

For more information about defining users, see [Defining users]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#defining-users). For more information about defining roles, see [Defining roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#defining-roles).


### Regular users
Regular users have basic access permissions that allow them to interact with the OpenSearch cluster, such as querying data and using dashboards, but they do not have administrative privileges.

### Admin users
Admin users have elevated permissions that allow them to perform various administrative tasks within the cluster. They have broader access compared to regular users, including permissions to:
- Manage users and roles.
- Configure permissions.
- Adjust backend settings.

Admin users can perform these tasks by configuring settings in the `opensearch.yml` file, using OpenSearch Dashboards, or interacting with the REST API. For more information about configuring users and roles, see [predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#predefined-roles).

### Super admin users
Super admin users have the highest level of administrative authority within the OpenSearch environment. This role is typically reserved for select users and should be managed carefully.

Super admin users have unrestricted access to all settings and data within the cluster, including permissions to:
- Modify Security plugin configurations.
- Access and manage the security index `.opendistro_security`.
- Override any security limitations.

#### Authentication of the super admin role

Super admin users are authenticated through certificates, not passwords. The necessary certificates are defined in the `admin_dn` section of the `opensearch.yml` file and must be signed with the same root certificate authority (CA), as shown in the following example:
```
YAML
plugins.security.authcz.admin_dn:
- CN=kirk,OU=client,O=client,L=test, C=de
``` 

If the super admin certificate is signed by a different CA, then the admin CA must be concatenated with the node's CA in the file defined in `plugins.security.ssl.http.pemtrustedcas_filepath` in `opensearch.yml`. 

For more information, see [Configuring super admin certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).
