---
layout: default
title: Getting started with workspaces
parent: Workspace
nav_order: 0
---

# Getting started with workspaces
Introduced 2.18
{: .label .label-purple }

OpenSearch Dashboards 2.18 introduces an enhanced home page that provides a comprehensive view of all your workspaces.

The new home page includes the following features: 

1. A **Create workspace** button for [OpenSearch Dashboard admins]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin) to navigate to the [create workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace) page.
2. Workspace access time information and a link to the workspace overview page.
3. A use case information icon that displays information about the workspace's purpose.
4. A **View all workspaces** button that navigates to the [workspace management]({{site.url}}{{site.baseurl}}/dashboards/workspace/manage-workspace/#manage-workspaces-from-workspaces-list) page.
5. Links to the latest OpenSearch documentation through the **Learn more from documentation** button and to OpenSearch Playground through the **Explore live demo environment at playground.opensearch.org** button.

The navigation logic ensures a seamless user experience by directing you to the appropriate page based on your workspace access level:

- If a you have a default workspace configured, you are taken to the workspace overview page.
- If a you have only one workspace, you are directed to the overview page of that workspace.
- If a you have multiple workspaces, you are taken to the new home page.
- If a you have no workspaces, you are directed to the new home page.
