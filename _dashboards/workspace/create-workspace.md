---
layout: default
title: Create a workspace
parent: Workspace for OpenSearch Dashboards
nav_order: 1
---

# Create a workspace
Introduced 2.18
{: .label .label-purple }

Before getting started with this tutorial, you must enable the workspace feature flag. See [Enabling the ACL feature]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/#enabling-the-workspace-feature) for more information.

When the saved objects permission is enabled, only users with admin status can create workspaces. See [Configuring the dashboard admin]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#configuring-dashboard-administrators) for more information. 

To create a workspace, follow these steps:

1. Open OpenSearch Dashboards.
2. From the main page, choose the appropriate card for your use case, for example, **Observability**, **Security Analytics**, **Search**, **Essentials**, or **Analytics**. Alternatively, you can select the **Create workspace** button and choose the appropriate use case from the dropdown menu.
3. Enter the required information in the **Workspace details** window.
  - **Workspace name** is required. Valid characters are `a-z`, `A-Z`, `0-9`, parentheses (`()`), brackets (`[]`), underscore (`_`), hyphen (`-`), and spaces. Choose a unique workspace name within the character limit (40 characters). The **Create workspace** button is disabled when the workspace name already exists or exceeds the character limit, and an error message appears.
  - **Use case and features** is required. Choose the use case that best fits your needs. If you are using Amazon OpenSearch Serverless and have enabled the [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/) feature, **Essentials** is automatically assigned. 
4. (Optional) Select the color picker to customize the color of your workspace icon.
5. (Optional) Add a workspace description of up to 200 characters. This option is disabled when the description exceeds the character limit.
6. Save your workspace.
  - The **Create workspace** button becomes active once you enter the information for all required fields. You become the workspace owner automatically. The system redirects you to either the collaborators page if the saved objects permission is enabled or the overview page if the saved objects permission is disabled. See [Configuring dashboard admin]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#configuring-dashboard-administrators) for more information about permissions.

To set up permissions, see [Workspace access control lists]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/) for more information.

## Associating data sources with a workspace

The **Associate data source** option is only visible when the multiple data sources feature is enabled. Before creating your workspace, you must connect it with at least one data source. If you have not set up your data sources, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/). Once your sources are connected, you can link them to your new workspace.
{: .warning}

### Associating OpenSearch data sources

To associate OpenSearch data sources, follow these steps: 

1. Select the **Associate OpenSearch Data Sources** button to open the selection modal.
2. View the available data sources in the modal:
  - Standard OpenSearch sources appear as single entries.
  - Sources with direct query connections show a +N indicator.
3. Select the appropriate data source name(s).
4. Select the **Associate data sources** button to complete the association.

### Associating direct query sources

To associate direct query sources, follow these steps: 

1. Select the **Associate direct query data sources** button to open the selection modal. The modal displays only sources with direct query connections.
2. Select a data source to automatically expand its direct query connections.
3. Select the **Associate data sources** button to complete the association.
