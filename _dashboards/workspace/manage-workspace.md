---
layout: default
title: Manage workspaces
parent: Workspace
nav_order: 2
---

# Manage workspaces
Introduced 2.18
{: .label .label-purple }

You can access and modify the workspace details, including name, description, use case, and icon color, on the **Workspace details** page. 

To access and modify your workspace details, follow these steps: 

1. Open OpenSearch Dashboards and navigate to **Workspaces**.
2. Choose the **Edit** button to make changes, and then choose the **Save** button to confirm changes or the **Discard changes** button to cancel modifications.

## Workspace update permissions

The following permissions apply when changing workspaces:

1. **Without the Security plugin:** All users can edit and update the workspace.
2. **With security plugins installed and `savedObjects.permission.enabled: false` in the `config/opensearch_dashboards.yml` file:** All users can edit and update workspaces.
3. **With the Security plugin and `savedObjects.permission.enabled: true` in the `config/opensearch_dashboards.yml`:** Only the [workspace owner]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#define-collaborators-for-your-workspaces) and the [OpenSearch Dashboards admin]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin) can edit and update workspaces.

## Workspace update restrictions 

When updating workspace use cases, the following rules apply.

Original use case | Target use case |
:---: | :---:
Analytics  | Cannot be changed to any other use case
Search  | Analytics
Security analytics  | Analytics
Observability  | Analytics
Essentials  |    Analytics Search<br> Security Analytics<br> Observability

## Workspace control panel

The workspace details page features the following buttons in the upper-right corner:

1. **Delete** (trash icon)
    - **Without the Security plugin installed:** All users can delete the workspace.
    - **With the Security plugins installed and `savedObjects.permission.enabled: false` in the `config/opensearch_dashboards.yml` file:** All users can delete the workspace.
    - **With security plugins installed and `savedObjects.permission.enabled: true` in the `config/opensearch_dashboards.yml` file:** Only the OpenSearch Dashboards admin can delete the workspace.
2. **Set as default workspace:** Sets the current workspace as the default login destination.
3. **Workspace overview:** Opens the workspace overview page in a new tab.

## Adding assets to the workspace

Access the **Sample data** in the navigation menu on the left. Select the appropriate dataset to install it in your cluster and OpenSearch Dashboards.

## Copying assets between workspaces

Data sources and configuration copying are not supported.
{: .warning}

The assets page provides the following methods for copying assets across workspaces:

1. **Copy all assets to...:** Copies all assets in the table.
2. **Copy to...:** Moves selected assets from the table.
3. **Copy to...:** Copies a single asset from the table.

After selecting a copy option, choose the target workspace from the dropdown menu. The **Copy related assets** checkbox allows you to transfer associated assets.

{: .note}

Upon selecting the **Copy** button, a side panel appears showing successful and failed asset transfers. Asset copy destinations depend on the following security configurations:
 
1. **Without security plugins:** All workspaces accessible
2. **With security plugins and `savedObjects.permission.enabled: false` in the `config/opensearch_dashboards.yml` file:** All workspaces accessible
3. **With security plugins and `savedObjects.permission.enabled: true` in the `config/opensearch_dashboards.yml` file:** Only workspaces where user has `Read and write` or `Admin` permission.

## Associating data sources

Through the data source management page, you can access a comprehensive list of associated OpenSearch connections, monitor direct query connections relevant to your current workspace, and establish new data source associations as needed.

### Managing OpenSearch connections

The Opensearch connections tab displays all associated connections for the current workspace. Follow these steps to manage your connections:

1. Access a comprehensive list of associated OpenSearch connections in the connections tab.
2. Use the **Remove association** button to unlink connections as needed.
3. Add new data sources by selecting the **OpenSearch data sources** button and subsequent modal.
4. Browse and select from unassociated OpenSearch connections to expand your workspace's capabilities.

### Adding direct query connections

The **Direct query connections** tab displays a list of all direct query connections associated with your current workspace. To add more direct query connections to your workspace, select the **Direct query data sources** button. A modal window opens.

The association modal displays a list of OpenSearch connections that contain direct query connections and have not yet been associated with your current workspace. When you associate an OpenSearch connection with your current workspace, all direct query connections within that OpenSearch connetion is automatically associated as well.

## Deleting your workspace

Workspace deletion is restricted to dashboard administrators. If you cannot see delete icon, check your permissions. Learn about [Configuring dashboard administrators]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin).
{: .warning}

Deleting a workspace permanately erases all its assets (except data sources) and the workspace itself. This action cannot be reversed.

To delete a workspace, follow these steps:

1. From the workspace detail page, select the delete icon in the top-right corner to delete the current workspace.
2. Alternatively, from the workspace list page, select the ellipsis icon and select **Delete**. Optionally, select multiple workspaces for bulk deletion.

## Navigating the workspaces list

The workspaces list page serves as your central hub for workspace management, displaying all workspaces you have permissions to access. Key features include the following: 

- Search: Quickly find workspace by name
- Filter: Sort workspaces based on use case
- At-a-glance: View each workspace's name, use case, description, last update time, and associated data sources.

Each workspace entry includes an **Actions** column with four functional buttons. These tools streamline your workspace management, allowing for efficient organization and customization of your OpenSearch Dashboards environment:

1. Copy ID: One-click copying of the workspace identifier
2. Edit: Direct access to the workspace's detailed configuration page
3. Set as default: Easily set any workspace as your default workspace
4. Delete: Remove workspaces as needed (may require administrator privileges)
