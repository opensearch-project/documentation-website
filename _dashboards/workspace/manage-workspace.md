---
layout: default
title: Manage workspaces
parent: Workspace
nav_order: 2
---

## Update your workspace

The workspace details page can display and update workspace detailed information which contains name, description, use case and icon color.

<img src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-details-page.png" alt="workspace details page" width="900" />

Click the `Edit` button to enter the editing mode. In this mode, click the `Save` button to update the workspace and click the `Discard changes` button to reset the modification.

<img src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-details-edit.png" alt="workspace details edit" width="900" />

Who can update the workspace？

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
1. `Delete button` (red trash icon)
    - Security plugins uninstalled: Anyone can click the button and delete the workspace.
    - Security plugins installed and `savedObjects.permission.enabled: false` (`config/opensearch_dashboards.yml`): Anyone can click the button and delete the workspace.
    - Security plugins installed and `savedObjects.permission.enabled: true` (`config/opensearch_dashboards.yml`): Only OSD admin can see the button and delete the workspace.

2. `Set as default workspace button`: Click the button to set the current workspace as the default workspace. Whenever you login the dashboard, you will be redirected to the overview page of that workspace by default.
3. `Workspace overview button`: Click the button will jump to the workspace overview page of a new tab.

## Start adding assets into your workspace

## Copy assets among your workspaces

The assets page supports copying assets among your workspace. There are three buttons that can copy assets:
1. (A) `Copy all assets to...`: Click the button to copy all assets in the table.
2. (B) `Copy to...`: Click the button to copy the assets selected in the table.
3. (C) `Copy to...`: Click the button to copy single asset in the table.

<img src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-copy.png" alt="workspace copy" width="900" />

After clicking any button, a modal will pop up. In the dropdown menu of the target workspace, you can choose which workspace to copy assets to. Checking `Copy related assets` will copy all assets related to the selected assets into the workspace together.

<img src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-copy-modal.png" alt="workspace copy modal" width="900" />

**Notice**: Unsupport copying data source and config.
{: .note}

Click the `Copy` button, and a flyout will pop up on the right to show the successful and failed assets.
<img src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-copy-success.png" alt="workspace copy success" width="900" />
 
Which workspace can assets be copied to?
1. Security plugins uninstalled: Any workspaces.
2. Security plugins installed and `savedObjects.permission.enabled: false` (`config/opensearch_dashboards.yml`): Any workspaces.
3. Security plugins installed and `savedObjects.permission.enabled: true` (`config/opensearch_dashboards.yml`): Any workspace with `Read and write`/`Admin` permission.


## Associate data sources

![Workspace data source management page]({{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-data-source-management.png)

You can associate data sources on data source management page in workspace. Data source management page in workspace lists all opensearch connections and direct query connections that are associated with the current workspace.

### Opensearch connection

![Remove association]({{site.url}}{{site.baseurl}}/images/workspace/management-workspace/remove-association.png)

Opensearch connections tab lists all opensearch connections that are associated with the current workspace. You could click the `Remove association` button to remove the association between the opensearch connection and the current workspace.

<img width="600" src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/opensearch-data-sources-button.png" alt="Opensearch data sources button">

You could click the `OpenSearch data sources` button to open a modal to associate more opensearch connections to current workspace.

<img width="600" src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/association-modal.png" alt="Association modal">

Association modal lists all opensearch connections that have not been associated with the current workspace. You could select the opensearch connections that you want to associate with the current workspace.

### Direct query connection

<img width="600" src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/direct-query-data-sources-button.png" alt="Direct query data sources button">

Direct query connections tab lists all direct query connections that are associated with the current workspace. You could click the `Direct query data sources` button to open a modal to associate more direct query connections to current workspace.

<img width="600" src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/direct-query-modal.png" alt="Direct query association modal">

Association modal lists all opensearch connections that contain direct query connections and have not been associated with the current workspace. If an opensearch connection is associated with the current workspace, all direct query connections in this opensearch connection will also be associated.

## Delete your workspace

Deleting a workspace will remove all assets(except data source) within it and the workspace itself. This operation cannot be undone, and all assets will be permanently deleted.

To delete a workspace, you must be a dashboard administrator. Otherwise, the delete icon will not be visible. See [how to configure dashboard administrators]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin) for more information.
{: .note}

There are two ways to delete a workspace:

1. On the workspace detail page:
 - Click the red trash icon in the top right corner to delete the current workspace.
<img width="700" src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/delete_workspace_detail.png" alt="
Delete workspace from detail page">

2. On the workspace list page:
 - Click the action menu (three dots) next to a workspace and select 'Delete'.
 - Or, select multiple workspaces and use the bulk delete option.
<img width="700" src="{{site.url}}{{site.baseurl}}/images/workspace/management-workspace/delete_workspace_list.png" alt="
Delete workspace from list page">

## Manage workspaces from workspaces list

![Workspaces list page]({{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-list-page.png)

Workspaces list page lists all workspaces that you have permission to access. You could search workspaces by name or filter workspaces by use case. It displays the name, use case, description, last update time and associated data sources of each workspace.

![Workspace list actions]({{site.url}}{{site.baseurl}}/images/workspace/management-workspace/workspace-list-actions.png)

Actions column displays four buttons for each workspace.

1. Copy ID button

   Click the button to copy the workspace ID.

2. Edit button

   Click the button to navigate to the workspace details page.

3. Set as my default button

   Click the button to set the current workspace as your default workspace.

4. Delete button

   Click the button to delete the workspace.
