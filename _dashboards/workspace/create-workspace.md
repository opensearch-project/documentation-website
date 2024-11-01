---
layout: default
title: Create workspace
parent: Workspace
nav_order: 1
---

# Start Building Your First Workspace
Before proceeding, ensure you have enabled the workspace feature flag by following the [workspace documentation]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/#enabling-workspace).


## Create Workspace Entry Points

The create workspace entry points require the logged-in user to be a dashboards admin when the saved objects permission is enabled. To configure the dashboards admin, see [the workspace ACL documentation]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin). There are two major entry points for creating a workspace.

### Create Workspace from the Home Page
The easiest way is to create a workspace from the home page. You will be automatically redirected to this page if you visit the root OpenSearch Dashboards directly. The UI will look like the screenshot below.
![Create workspace from homepage]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/create-workspace-from-homepage.png)
There are two types of buttons for workspace creation. The first type is the top-right "Create workspace" button, which displays a use case popover when clicked. Clicking the use case name (e.g., "Observability") in the popover will redirect you to the create workspace page and populate it with the selected use case. The second type is the "Create workspace" button inside the use case card. Clicking this button will redirect you to the create workspace page and populate it with the use case from the card.

### Create Workspace from the Left Navigation
The left navigation is hidden on the home page. To see the left navigation, you may need to navigate away from the home page. For example, click "View all workspaces" on the home page. It will redirect you to the workspace list page, as shown in the screenshot below.
![Create workspace from left navigation]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/create-workspace-from-left-navigation-in-workspace-list.png)
There is a "Create workspace" button in the top-right corner of the workspace list page. Clicking this button will redirect you to the workspace create page. On other pages, you can click the second icon at the bottom of the left navigation. It will show a workspace popover. Clicking "Create workspace" in this popover will also redirect you to the create workspace page.

## Fill the Workspace Form
After clicking one of the create workspace buttons, you will be redirected to the workspace create page, as shown in the screenshot below. You need to fill out all the required fields and then click the "Create workspace" button to submit the entire workspace creation form.
![Create workspace page overview]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/create-workspace-form-overview.png)
### Input Workspace Name

The workspace name is a required field in the workspace creation form. You need to provide a valid workspace name. For the workspace name, valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen), and (space). If the provided workspace name is invalid or empty after clicking the "Create workspace" button, a form error will be shown. The maximum length of characters for the workspace name is 40. The "Create workspace" button will be disabled if the name exceeds the maximum character limit. The workspace name should be unique across the entire OpenSearch Dashboards. If the provided workspace name is duplicated with an existing workspace, an error toast will be shown, prompting you to use a different workspace name.

### Customize Workspace Color (Optional Step)

This is an optional step during workspace creation. You can click the Color input next to the workspace name to customize the color. After clicking the color input, you can choose another color from the color popover. This color will be applied to the workspace icon.

### Add Workspace Description (Optional Step)

The description is an optional field in the workspace creation form. You can set a description by entering text in the description input on the workspace creation page. The maximum length of characters for the description is 200. The "Create workspace" button will be disabled if the description exceeds the maximum character limit.

### Customize Workspace Use Case (Optional Step)

The use case is a required field in the workspace creation form. One workspace should have one use case. The related use case will be pre-populated if you visit the workspace creation page from the home page with use case information. If no pre-selected use case is provided on the workspace creation page, the first use case will be selected by default. You can change to other use cases by clicking the radio button on the left.

![Create workspace only have serverless data sources]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/create-workspace-from-overview-aoss-only.png)
When the multi-data source option is enabled and you only have Amazon OpenSearch Serverless data sources, only the "Essentials" use case can be used for this case, as shown in the screenshot above. The "Essentials" use case will be selected and disabled, and the pre-selected use case from the home page will be overridden by the "Essentials" use case.

### Associate Data Source When Multi Data Source is Enabled

The "Associate data source" section will be hidden if multi data source is not enabled. To enable multi data source, refer to the [multi data source documentation]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/#step-1-modify-the-yaml-file-settings). When multi data source is enabled, you need to associate at least one data source with the workspace in the workspace creation page. To add data sources, refer to the [multi data source documentation]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources.md#step-2-create-a-new-data-source-connection). Once data sources are created in the data source management page, you can assign them to the workspace.

![Associate OpenSearch Data Sources in workspace creation page]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/associate-opensearch-data-sources-in-workspace-creation-page.png)
The "Associate OpenSearch data sources" modal will be displayed after clicking the "Associate OpenSearch data sources" button. In the example above, there are two data sources in the modal. The "data source 1" is an OpenSearch data source, and the "data source 2" includes 4 direct query connections, which will display the "+ 4 related" label on the right. A data source will become selected after clicking its name. The selected data sources will be associated with the workspace after clicking the "Associate data sources" button.

![Associate direct query data sources in workspace creation page]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/associate-direc-query-data-sources-in-workspace-creation-page.png)
The "Associate direct query data sources" modal will be displayed after clicking the "Associate direct query data sources" button. In the example above, there is only one data source in the modal. The "data source 1" will be hidden because it does not have any direct query connections. The "data source 2" will be displayed, and the direct query connections will be expanded after the data source is selected. The selected data sources will be associated with the workspace after clicking the "Associate data sources" button.

## Save Workspace
The "Create workspace" button will become enabled after all required form fields are provided. There will be a toast message like the screenshot below to indicate that the workspace was created successfully after clicking the "Create workspace" button.
![Associate direct query data sources in workspace creation page]({{site.url}}{{site.baseurl}}/images/workspace/create-workspace/create-workspace-succeed-toasts.png)
The logged-in user will become the workspace owner and will be redirected to the workspace collaborators page if the saved objects permission control is enabled. To configure saved objects permission, see [the workspace ACL documentation]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin). If saved objects permission is not enabled, you will be redirected to the workspace overview page.
