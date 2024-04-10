---
layout: default
title: Read-only roles
parent: Access control
nav_order: 150
---

# Read-only roles

As with any role in OpenSearch, read-only roles can be configured using the following three methods: 
- Modifying the`yml` configuration files.
- Using the Cluster Settings API. 
- Using OpenSearch Dashboards. 

The most user friendly approach for anyone getting familiar with Roles and role mappings is to use OpenSearch Dashboards, as it is easy to navigate the creation of roles and assign those roles to users. The basic steps of creating roles, mapping, and users can be found in the [User and roles documentation](https://opensearch.org/docs/latest/security/access-control/users-roles/).

## Creating a basic read-only role


To create a basic read-only role which allows access to OpenSearch Dashboards, view existing dashboards and visualizations, and query different indexes,  use one the following permissions. 

These permissions will give the user access to all tenants and indexes on the cluster.
{: .note}

### Cluster permission

For a user who needs read-only access to cluster-wide resources, such as visualization or dashboards, add the `cluster_composite_ops_ro` permission to that user's role.

### Index permission

If a user needs access to view visualizations, they will also need access to the index used to create the visualization. To give the user read-only access to all indexes, specify all (`*`) under the **Index** drop-down, and **Read** in **Index Permissions**.
### Tenant permissions

If you use tenants to split work between different teams or projects, use the all (`*`) option followed by the **Read only** option.

![creating role]({{site.url}}{{site.baseurl}}/images/role_creation_read_only.png)

After all permission types are set and the role is created, you can directly map the role to a user by going to **Mapped users** tab in roles. Select **Map users** and select the user to map to this role. 

![mapping users]({{site.url}}{{site.baseurl}}/images/mapping-users.png)

## OpenSearch Dashboards readonly_mode

OpenSearch Dashboards `readonly_mode` functionality is used to give a user access to only the `Dashboards` UI, removing the rest of the UI elements from the user.
To add the functionality, add the following line `opensearch_dashboards.yml` file:
`opensearch_security.readonly_mode.roles: [new_role]`

If the role mapped to the user has additional privileges or the user is mapped to other roles, giving them write access to indexes, this access will not be allowed using OpenSearch Dashboard. Direct data access to OpenSearch using curl or API is still allowed, as OpenSearch Dashboards is not involved in this communication. 

If the user is mapped to the `readonly_mode` role, all other elements of the UI will be removed, except for `Dashboards`. In the following comparison, the left view shows the screen from the perspective of a user mapped to a role in`readonly_mode`. On the right, the user is given a standard view.

![compare read only mode]({{site.url}}{{site.baseurl}}/images/compare_read_only_mode.png)

Mapping the user to only `readonly_mode` role does not give permissions to view relevant indexes or allow the user to view the existing dashboards. Read access to indexes and dashboards require separate permissions.
{: .note }


If the user is also mapped to any roles listed under `plugins.security.restapi.roles_enabled` in `opensearch.yml`, for example `all_access` or `security_rest_api_access`, then `readonly_mode` is ignored, giving the user access to standard UI elements.


## Additional permissions

If you need access to additional permissions while using the `read_only` role,  such as alerting and anomaly detection modules, check out the existing roles, such as `alerting_read_access` and `anomaly_read_access`.