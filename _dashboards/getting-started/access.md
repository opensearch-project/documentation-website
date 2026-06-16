---
layout: default
title: Access OpenSearch Dashboards
parent: Getting started
nav_order: 15
---

# Access OpenSearch Dashboards

Once OpenSearch and OpenSearch Dashboards are running, open your browser and navigate to the following URL:

- `http://localhost:5601` (without the Security plugin) or `https://localhost:5601` (with the Security plugin) for a local installation.
- [https://playground.opensearch.org/app/home#/](https://playground.opensearch.org/app/home#/) for the OpenSearch Playground.

>- _OpenSearch Dashboards_ refers to the web UI for OpenSearch---the application you're looking at in your browser.
>- The **Dashboards** application is the tool within OpenSearch Dashboards for assembling visualizations into a single page.
>- A _dashboard_ (lowercase) is an individual page of visualizations created in the **Dashboards** application.
{: .note}

## The OpenSearch Dashboards home page

The home page provides access to all major applications, including **Discover** for exploring data, **Visualize** for building charts, **Dashboards** for assembling visualizations, and **Dev Tools** for running API queries.

### Classic navigation

In installations in which workspaces are not enabled, the left navigation panel lists all applications directly. The following image highlights the main applications described in this section.

![OpenSearch Dashboards home page with classic navigation]({{site.url}}{{site.baseurl}}/images/dashboards/getting-started-classic-nav.png)

1. Prepare your data.
1. Explore the Discover application.
1. Explore the Dashboards application.
1. Explore the Visualize application.
1. Run queries in OpenSearch Dashboards.

The examples in this documentation use classic navigation. If you have workspaces enabled, the menu structure is different but the same applications are available within your workspace.

### Workspaces navigation

Workspaces group applications into focused environments (for example, Analytics, Observability, or Security Analytics). To access OpenSearch Dashboards applications, first create a workspace and select it. Some features, such as [creating visualizations using queries]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/), are only available within workspaces. For more information, see [Workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/).

![OpenSearch Dashboards home page with workspaces enabled]({{site.url}}{{site.baseurl}}/images/dashboards/getting-started-workspaces-nav.png)

The following image shows the left navigation within an example Analytics workspace, including the main applications described in this section.

![Left navigation within an Analytics workspace]({{site.url}}{{site.baseurl}}/images/dashboards/getting-started-workspace-interior-nav.png)

1. Prepare your data.
1. Explore the Discover application.
1. Explore the Dashboards application.
1. Explore the Visualize application.
1. Run queries in OpenSearch Dashboards.

### Hiding the navigation panel

To enlarge the main page panel, you can undock and hide the navigation panel.

#### Undocking and hiding the navigation panel

To undock and hide the navigation panel, follow these steps:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-docked-icon.png" class="inline-icon" alt="docked icon"/>{:/} (dock) **Undock navigation** at the bottom of the navigation panel.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon or {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to the right of the menu.

#### Unhiding and docking the navigation panel

To unhide and dock the navigation panel, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-undocked-icon.png" class="inline-icon" alt="undocked icon"/>{:/} (undock) **Dock navigation** at the bottom of the navigation panel.

## Next steps

- To learn what each application does, see [Learn about main applications and query languages]({{site.url}}{{site.baseurl}}/dashboards/getting-started/learn-dashboards/).
