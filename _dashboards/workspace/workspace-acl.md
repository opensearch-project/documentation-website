---
layout: default
title: Workspace access control lists
parent: Workspace for OpenSearch Dashboards
nav_order: 3
---

# Workspace access control lists
Introduced 2.18
{: .label .label-purple }

Workspace access control lists (ACLs) manage authorization for saved objects `AuthZ(Authorization)` while enabling [Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/) for `AuthN(Authentication)`.

## Personas

**Workspace** use cases involve the following key personas:

* **Dashboard admin:** Has full access to all OpenSearch Dashboards functions and data.
* **Workspace administrator (also called _owner_):** Has full control over a specific workspace, including its configuration and saved objects. When a workspace is created, its creator is automatically assigned the role of workspace owner.
* **Workspace content producer:** Can view, create, and update saved objects within the workspace.
* **Workspace viewer:** Has read-only access to saved objects in the workspace.

 Roles are workspace specific, allowing users to assume different roles across workspaces.
 {: .note}

## Enabling permission control

See [Enabling the ACL feature]({{site.url}}{{site.baseurl}}/dashboards/management/acl#enabling-the-acl-feature) for instructions. 

## Configuring dashboard administrators

To grant full access to all workspaces and objects in OpenSearch Dashboards, configure the admin permissions. Edit the `opensearch_dashboards.yml` file to define the admin by user ID and backend role, as shown in the following configuration:

```yaml
opensearchDashboards.dashboardAdmin.users: ["UserID"]
opensearchDashboards.dashboardAdmin.groups: ["BackendRole"]
savedObjects.permission.enabled: true
```
{% include copy.html %}

By default, the configuration is set to `[]`, meaning that no users are designated as admins. If the Security plugin is not installed and `savedObjects.permission.enabled: false`, all users are granted admin permissions.

### Configuring global admin access

Set all users as admins with this wildcard setting:

```yaml
opensearchDashboards.dashboardAdmin.users: ["*"]
```
{% include copy-curl.html %}

### Configuring admin access for a single user

Configure a user with the `admin-user-id` setting:

```yaml
opensearchDashboards.dashboardAdmin.users: ["admin-user-id"]
```
{% include copy-curl.html %}

### Configuring admin access by backend role

Configure a user with the `admin-role` setting:

```yaml
opensearchDashboards.dashboardAdmin.groups: ["admin-role"]
```
{% include copy-curl.html %}

### Admin-restricted operations

Admin-restricted operations include the following:

- Workspace creation
- Workspace deletion
- Data source connections
- Disconnecting data sources from workspaces

## Defining workspace collaborators

Access to collaborator management is limited to admins. The **Collaborators** feature is only available when permission control is enabled. For instructions on activating permission control, see [Enabling permission control](#enabling-permission-control). The access levels include the following:

- **Read only:** Grants permission to view the workspace and its assets.
- **Read and write:** Allows viewing and editing of assets within the workspace.
- **Admin:** Provides full access, including viewing and editing of assets within the workspace and updating workspace metadata, such as name, description, data sources, and collaborators.

From the **Collaborators** page, you can by collaborator ID and filter results by collaborator type and access level.

### Adding collaborators

Workspace creators are granted the **Admin** access level as a collaborator. To add more collaborators, select the **Add collaborators** button, which displays a dropdown menu. Choose **Add Users** or **Add Groups** to access the corresponding modal for adding new collaborators.

#### Adding users

To add users, follow these steps: 

1. Select the **Add Users** button to open the modal. The modal displays one empty `User ID` field by default.
2. Choose an access level: **Read only**, **Read and write**, or **Admin**.
3. Choose **Add another User** to add multiple users. Do not use duplicate or existing `User ID` fields to avoid errors.
4. Resolve any errors before finalizing. Successfully added users appear in the collaborators table.

#### Adding groups

To add groups, follow these steps:

1. Select the **Add Groups** button to open the modal. The modal displays one empty `Group ID` field by default.
2. Choose an access level: **Read only**, **Read and write**, or **Admin**.
3. Use **Add another group** to add multiple groups. Do not use duplicate or existing `Group ID` fields to avoid errors.
4. Resolve any errors before finalizing. Successfully added users appear in the collaborators table.

### Modifying access levels

You can modify collaborators access levels after adding them to the collaborators table if you have the required permissions. Collaborators can be assigned any access level. However, if all **Admin** collaborators are changed to lower access levels, then only admins can manage workspace collaboration.

#### Modifying individual access levels

To modify a single collaborator's access level, follow these steps:

1. Select the action icon on the right of the table row.
2. Select **Change access level** from the dropdown menu.
3. Choose the desired access level from the list. 
4. Confirm the change in the modal that appears and select **Confirm**. The collaborator's access level is updated in the table upon confirmation.

#### Modifying access levels in batch

To change access levels for several collaborators simultaneously, follow these steps:

1. Select the desired collaborator rows in the table. 
2. Select the **Actions** button that appears.
3. Select **Change access level** from the dropdown menu.
4. Select the new access level from the list provided. 
5. Review and confirm the changes in the modal that appears. The access levels for all selected collaborators are updated in the table upon confirmation.

### Deleting collaborators

After adding collaborators to the table, you have the option to delete them. Be cautious when removing admin collaborators because deleting all of them restricts workspace collaborator management to admins only. A confirmation modal is displayed before finalizing this action.

#### Deleting individual collaborators

To delete an individual collaborator, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/} icon on the right of the table row to display a dropdown menu.
2. Select **Delete collaborator** from the dropdown menu. A confirmation modal appears to verify your action.
3. Select **Confirm** in the modal to remove the collaborator from the table.

#### Deleting collaborators in batch

To remove several collaborators simultaneously, follow these steps:

1. Select the rows containing the collaborators you want to remove from the table. A "Delete x collaborators" button appears.
2. Select the **Delete x collaborators** button.
3. Review the confirmation modal that appears.
4. Select **Confirm** to remove all selected collaborators from the table.

## Workspace privacy

**Workspace Privacy** allows quick configuration of access permissions for all users. Only **workspace administrators** can set workspace privacy. As with the collaborators feature, **Workspace Privacy** is only available when permission control is enabled. Workspace privacy can be configured with the following three access levels:

* **Private to collaborators (default access level):** Only collaborators can access the workspace. 
* **Anyone can view:** Anyone can view workspace assets. (Grants **Read only** permission to all users.)
* **Anyone can edit:** Anyone can view, create, and update workspace assets. (Grants **Read and write** permission to all users.)

A collaborator will be granted the higher permissions when their individual access level differs from the workspace privacy. For example, if workspace privacy is set to "Anyone can edit", any collaborator with read-only access level will also be able to edit the workspace assets.

### Configuring workspace privacy

You can set up workspace privacy on the **Create Workspace** page as a **Dashboard admin**. You can also modify it on the **Collaborators** and **Workspace details** pages as a **Workspace admin** or **Dashboard admin**.

#### Setting up workspace privacy during workspace creation

1. Complete entering the workspace name, selecting use case, and associating data sources. See [Create a workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/) for instructions.
2. Choose the desired access level from the cards at the **Set up privacy** panel. (**Private to collaborators** is set as the default selection.)
3. Decide whether to continue configuring collaborators after workspace creation by selecting the **Go to configure the collaborators right after creating the workspace.** checkbox at the bottom of the panel.
4. Select **Create workspace** to finish the workspace creation.

#### Modifying workspace privacy on the Collaborators page

1. Select the **Edit** next to **Workspace privacy**. 
2. Click the selector which displays the current workspace privacy access level.
3. Select the new access level from the dropdown list. 
4. Select **Save changes** to apply the modifications.

#### Modifying workspace privacy on the Workspace details page

1. Select the **Edit** button at the upper-right corner of the **Details** panel. 
2. Click the selector which displays the current workspace privacy access level at the bottom of the panel.
3. Select the new access level from the dropdown list. 
4. Select **Save** to apply the modifications.
