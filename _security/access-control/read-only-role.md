---
layout: default
title: Read only roles
parent: Access control
nav_order: 150
---

# Read only roles

As with any roles in OpenSearch, read only roles can be configured using three methods: `yml` configuration files, API and OpenSearch Dashboards. The most user friendly approach for anyone getting familiar with Roles and role mappings is to use OpenSearch Dashboards, as it is easy to navigate the creation of roles and assignment to users. The basic steps of creating roles/mappings/users are outlined here (https://opensearch.org/docs/latest/security/access-control/users-roles/)

## Basic read only role

If you are looking to create a role to access OpenSearch Dashboards, view existing dashboards/visualizations and query different indexes, assuming you want the user to have read access to all indexes and tenants, you can use the following permissions.
### Cluster permission
Cluster permission is needed to access cluster wide resources like visualizations and dashboards. For read only user you add already created `cluster_composite_ops_ro` permission.
### Indexes permission
In order to view visualizations, user needs to have access to the index that was used to create it, In this can you can add `read` permission to all (`*`) indexes. 
### Tenant permissions
If you are using tenants to separate work area between different teams/projects, visualizations and dashboards are saved in specific tenant. To be able to view these the user needs `read` access to the correct tenant. To keep things more straightforward we are giving user access to all (`*`) tenants.

![creating role]({{site.url}}{{site.baseurl}}/images/role_creation_read_only.png)

Once the role is created, you can directly map the role to a user by going to "Mapped users" tab in roles, select "Map users" and select the user to map to this role. 

![mapping users]({{site.url}}{{site.baseurl}}/images/mapping-users.png)

## OpenSearch Dashboards readonly_mode

OpenSearch Dashboards `readonly_mode` functionality is used to give user access to only `Dashboards` UI, removing the rest of the UI elements from the user.
You need to configure this in `opensearch_dashboards.yml` file by adding following line:
`opensearch_security.readonly_mode.roles: [new_role]`

If the role mapped to user has additional privileges or user is mapped to other roles, giving them write access to indexes, this access will not be allowed using OpenSearch Dashboard. Direct data access to OpenSearch using curl or API is still allowed, as OpenSearch Dashboards is not involved in this communication. 

If the user is mapped to this `readonly_mode` role, all other elements of the UI will be removed, except for `Dashboards`. In the following comparison, the left view shows the screen from the perspective of a user mapped to a role which is configured as readonly_mode. On the right, the user is given the standard view.

![compare read only mode]({{site.url}}{{site.baseurl}}/images/compare_read_only_mode.png)

Don't forget that mapping the user to only readonly_mode role, that doesn't give permissions to view relevant indexes, will not allow the user to view the existing dashboards, as read access is still required to view data behind the dashboards.
{: .note }


If the user is also mapped to any roles listed under `plugins.security.restapi.roles_enabled` in `opensearch.yml`, for example `all_access` or `security_rest_api_access`, then `readonly_mode` is ignored, giving the user access to standard UI elements.


## Additional permissions

If you need access to additional permissions while using read_only role, for example for alerting and anomaly detection modules, check out the existing roles, for example "alerting_read_access" and "anomaly_read_access"