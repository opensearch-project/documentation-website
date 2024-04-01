---
layout: default
title: Read only roles
parent: Access control
nav_order: 150
---

# Read only roles

As with any roles in OpenSearch, read only roles can be configured using three methods: `yml` configuration files, API and OpenSearch Dashboards. The most user friendly approach for anyone getting familiar with Roles and role mappings is to use OpenSearch Dashboards, as it is easy to navigate the creation of roles and assignment to users. The basic steps of creating roles/mappings/users are outlined here (https://opensearch.org/docs/latest/security/access-control/users-roles/)

## Basic read only role

If you are looking to create a role to access OpenSearch Dashboards, view existing dashboards/visualizations and query different indexes, assuming you want the user to have read access to all indexes and tenants, you can add cluster permission group of `cluster_composite_ops_ro`, `read` access to all indexes (`*`) and `read` access to all tenants

![creating role]({{site.url}}{{site.baseurl}}/images/role_creation_read_only.png)

Once the role is created, you can directly map the role to a user by going to "Mapped users" tab in roles, select "Map users" and select the user to map to this role. 

![mapping users]({{site.url}}{{site.baseurl}}/images/mapping-users.png)

## OpenSearch Dashboards readonly_mode

OpenSearch Dashboards comes with functionality to only give access to `Dashboards` UI by using readonly_mode.
You need to configure this in `opensearch_dashboards.yml` file by adding following line:
`opensearch_security.readonly_mode.roles: [new_role]`

If the role mapped to user has additional privileges or user is mapped to other roles, giving them write access to indexes, this access will not be allowed using OpenSearch Dashboard. Direct data access to OpenSearch using curl or API is still allowed, as OpenSearch Dashboards is not involved in this communication. 

If the user is mapped to this `readonly_mode` role, all other elements of the UI will be removed, except for `Dashboards`. See following comparison, on the left is user mapped to role which is configured as readonly_mode, on the right is the standard view.

![compare read only mode]({{site.url}}{{site.baseurl}}/images/compare_read_only_mode.png)

Don't forget that mapping the user to only readonly_mode role, that doesn't give permissions to view relevant indexes, will not allow the user to view the existing dashboards, as user still needs read access to view data behind the dashboards.
{: .note }

The only exception is "admin" backend role, if this backend role is also provided to the same user, the readonly_mode is ignored, giving the user access to standard UI elements, as well as full access to the cluster.

## Additional permissions

If you need access to additional permissions while using read_only role, for example for alerting and anomaly detection modules, check out the existing roles, for example "alerting_read_access" and "anomaly_read_access"