---
layout: default
title: Workspace access control lists
parent: Workspace for OpenSearch Dashboards
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/dashboards/workspace/workspace-acl/
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

## Configuring workspace privacy

When permission control is enabled, workspace administrators can set one of the following three access levels:

* **Private to collaborators (Default):** Only workspace collaborators can access the workspace. 
* **Anyone can view:** Grants **Read only** permissions to all workspace users, allowing them to view workspace assets. 
* **Anyone can edit:** Grants **Read and write** permissions to all users, allowing them to view, create, and update workspace assets.

Collaborators are granted higher permissions when their individual access level differs from that set in the workspace settings. For example, if workspace privacy is set to "Anyone can edit", any collaborator with read-only access will also be able to edit workspace assets.
Users at the collaborator level are granted additional permissions even when their access level differs from that of the workspace.
You can set up workspace privacy on the **Create workspace** page as a **Dashboard admin**. You can also modify it on the **Collaborators** or **Workspace details** pages as a **Workspace admin** or **Dashboard admin**.

### Setting up workspace privacy during workspace creation

Use the following steps to change workspace privacy settings when creating a new workspace:

1. Choose the desired access level from the **Set up privacy** panel. 
2. _Optional_ Decide whether to add collaborators after workspace creation by selecting the **Add collaborators after workspace creation.** checkbox.
3. Select **Create workspace** to create the workspace.

### Modifying workspace privacy on the **Collaborators** page

Use the following steps to edit the workspace privacy settings on the **Collaborators** page:

1. Next to **Workspace privacy**, select **Edit**. 
2. Select the new access level from the dropdown menu.
3. Select **Save changes** to apply the modifications.

### Modifying workspace privacy on the **Workspace details** page

Use the following steps to edit the workspace privacy settings on the **Workspace details** page:

1. Select the **Edit** button in the upper-right corner of the **Details** panel. 
2. Select the new access level from the dropdown menu.
3. Select **Save** to apply the modifications.
