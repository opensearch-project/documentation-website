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
You can define collaborators for specific workspaces on the collaborators page, as shown in the screenshot below, when permission control is enabled. The collaborators page will be hidden when permission control is disabled. To enable permission control, refer to the "[Enabling Permission Control](#enabling-permission-control)" section.

![Workspace collaborators page]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspaces-collaborators-page.png)

The collaborators page offers three different access levels:

Access Level | Description
:---: | :---:
Read only | Allows viewing the workspace and assets inside the workspace.
Read and write | Allows viewing and editing assets inside the workspace.
Admin | Allows viewing and editing assets inside the workspace, as well as updating workspace metadata like name, description, data sources, and collaborators.

Only dashboard admins and workspace admins can update collaborators for a specific workspace. You can search for collaborator IDs and filter by type and access level in the collaborators table.

### Adding Collaborators
The workspace creator automatically becomes a workspace collaborator with the "Admin" access level after creating the workspace. The dropdown appears after clicking the "Add collaborators" button. Click "Add Users" or "Add Groups" to display the respective modal for adding collaborators.

#### Adding Users
The "Add Users" modal appears after clicking the "Add Users" button. By default, it contains one empty User ID input field. Click "Read only," "Read and write," or "Admin" to set the desired access level for the new user(s).

![Workspace collaborators add users modal]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspaces-collaborators-add-users-modal.png)

Click "Add another User" to add more user form rows in the modal. The new User ID cannot be the same as an existing collaborator or duplicate another pending user. An error message will appear under the User ID input field, as shown in the screenshot above, after clicking the "Add collaborators" button. Resolve all errors and click "Add collaborators" again to add the new users. The new users will appear in the collaborators table once added successfully.

#### Adding Groups
The "Add Groups" modal appears after clicking the "Add Groups" button. By default, it contains one empty Group ID input field. Click "Read only," "Read and write," or "Admin" to set the desired access level for the new group(s).

![Workspace collaborators add users modal]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspaces-collaborators-add-groups-modal.png)

Click "Add another Group" to add more group form rows in the modal. The new Group ID cannot be the same as an existing collaborator or duplicate another pending group. An error message will appear under the Group ID input field, as shown in the screenshot above, after clicking the "Add collaborators" button. Resolve all errors and click "Add collaborators" again to add the new groups. The new groups will appear in the collaborators table once added successfully.

### Modifying Access Levels
You can modify the access levels of collaborators after adding them to the collaborators table, provided you have the necessary permissions. A collaborator can be updated to any access level. If all "Admin" collaborators are updated to other access levels, the workspace collaborators can only be configured by dashboard admins. In such a case, a confirmation modal will appear, as shown in the screenshot below.

![Workspace collaborators no admin when modify access level]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-no-admin-when-modify-access-level.png)

#### Modifying a Single Access Level
An action dropdown will appear after clicking the action icon on the right side of the table row, as shown in the screenshot below.

![Workspace collaborators modify single access level]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-modify-single-access-level.png)

The dropdown will display a list of access levels after clicking "Change access level." A confirmation modal will appear, as shown in the screenshot below, after selecting the desired access level.

![Workspace collaborators modify single access level confirmation modal]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-modify-single-access-level-confirmation-modal.png)

Click "Confirm" to update the collaborator's access level in the collaborators table.

#### Modifying Access Levels in Batch
After selecting rows in the collaborators table, the "Actions" button will appear. Clicking the "Actions" button will display a dropdown with the "Change access level" option, as shown in the screenshot below.

![Workspace collaborators modify batch access level]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-modify-batch-access-level.png)

The dropdown will display a list of access levels after clicking "Change access level." A confirmation modal will appear, as shown in the screenshot below, after selecting the desired access level.

![Workspace collaborators modify batch access level confirmation modal]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-modify-batch-access-level-confirmation-modal.png)

Click "Confirm" to update the access levels of the selected collaborators in the collaborators table.

### Deleting Collaborators
You can delete collaborators after adding them to the collaborators table. If all "Admin" collaborators are deleted, the workspace collaborators can only be configured by dashboard admins. In such a case, a confirmation modal will appear, as shown in the screenshot below.

![Workspace collaborators no admin when delete]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-no-admin-when-delete.png)

#### Deleting a Single Collaborator
An action dropdown will appear after clicking the action icon on the right side of the table row, as shown in the screenshot below.

![Workspace collaborators delete single collaborator]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-delete-single-collaborator.png)

A confirmation modal will appear after clicking "Delete collaborator," as shown in the screenshot below.

![Workspace collaborators delete single collaborator confirmation modal]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-delete-single-collaborator-confirmation-modal.png)

Click "Confirm" to remove the collaborator from the collaborators table.

#### Deleting Collaborators in Batch
After selecting collaborator rows in the collaborators table, the "Delete x collaborators" button will appear, as shown in the screenshot below.

![Workspace collaborators batch delete collaborators]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-batch-delete-collaborators.png)

A confirmation modal will appear after clicking "Delete x collaborators," as shown in the screenshot below.

![Workspace collaborators batch delete collaborators confirmation modal]({{site.url}}{{site.baseurl}}/images/workspace/workspace-acl/workspace-collaborators-batch-delete-collaborators-confirmation-modal.png)

Click "Confirm" to remove the selected collaborators from the collaborators table.