---
layout: default
title: Manage workspaces
parent: Workspace
nav_order: 2
---

## Update your workspace

The workspace details page can display and update workspace detailed information which contains name, description, use case and icon color.  

<img src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-details-page.png" alt="workspace details page" width="900" />

Who can update the workspace
1. Security plugins uninstalled: Anyone can click the edit button and update the workspace.
2. Security plugins installed and `savedObjects.permission.enabled: false` (`config/opensearch_dashboards.yml`): Anyone can click the edit button and update the workspace.
3. Security plugins installed and `savedObjects.permission.enabled: true` (`config/opensearch_dashboards.yml`): Only workspace owner and opensearch dashboard admin (OSD admin) can click the edit button and update the workspace.


There are some special cases in updating the workspace use case.

Original use case | Target use case |
:---: | :---: 
Analytics  | Unable to update to other use cases
Search  | Analytics
Security analytics  | Analytics
Observability  | Analytics
Essentials  |    Analytics Search<br> Security analytics<br> Observability

There are three buttons in the upper right corner of the workspace details page.
1. Delete button (red trash icon)
    - Security plugins uninstalled: Anyone can click the button and delete the workspace.
    - Security plugins installed and `savedObjects.permission.enabled: false` (`config/opensearch_dashboards.yml`): Anyone can click the button and delete the workspace.
    - Security plugins installed and `savedObjects.permission.enabled: true` (`config/opensearch_dashboards.yml`): Only OSD admin can see the button and delete the workspace.

2. Set as default workspace button: Click the button to set the current workspace as the default workspace. Whenever you login the dashboard, you will be redirected to the overview page of that workspace by default.
3. Workspace overview button: Click the button will jump to the workspace overview page of a new tab.

## Start adding assets into your workspace

## Copy assets among your workspaces

## Associate data sources

### Opensearch connection

### Direct query connection

## Delete your workspace

## Manage workspaces from workspaces list