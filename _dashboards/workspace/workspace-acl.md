---
layout: default
title: Workspace ACL - Safeguard your workspace assets
parent: Workspace
nav_order: 3
---

# Workspace ACL - Safeguard your workspace assets
In order for the workspace ACL to take effect, the security plugin must be installed.

## Enabling permission control

## Config opensearch dashboard admin
OpenSearch Dashboard (OSD) admin is a new user that has the access to all the workspaces and objects inside OpenSearch Dashboards. To enable OSD admin in OpenSearch Dashboards, locate your copy of the `opensearch_dashboards.yml` file and set the following option. Whoever has the backend roles or exactly match the user ids defined in this config will be regard as OSD admin.

```yaml
opensearchDashboards.dashboardAdmin.users: ["UserID"]
opensearchDashboards.dashboardAdmin.groups: ["BackRole"]
savedObjects.permission.enabled: true
```
{% include copy-curl.html %}

**Notice**: The default value is `[]`, and no one is OSD admin.
{: .note}

**Notice**: If security plugin is not installed and `savedObjects.permission.enabled: false`, any user will be OSD admin.
{: .note}

### Config all users as OSD admin
All users can be configured as OSD admin with the wildcard `*`.
```yaml
opensearchDashboards.dashboardAdmin.users: ["*"]
```
{% include copy-curl.html %}

### Config user as OSD admin
Config the user with id `admin-user-id` as OSD admin.
```yaml
opensearchDashboards.dashboardAdmin.users: ["admin-user-id"]
```
{% include copy-curl.html %}

### Config backend role as OSD admin
Config the user with back role `admin-role` as OSD admin.
```yaml
opensearchDashboards.dashboardAdmin.groups: ["admin-role"]
```
{% include copy-curl.html %}

### OSD admin specific permissions

 - Only OSD admin can create workspace.
 - ONly OSD admin can delete workspace.
 - Only OSD admin can associate data sources to workspace.
 - Only OSD admin can unassociate data sources to workspace.

## Define Collaborators for your workspaces