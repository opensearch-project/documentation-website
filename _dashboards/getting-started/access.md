---
layout: default
title: Access OpenSearch Dashboards
parent: Getting started
nav_order: 15
---

# Access OpenSearch Dashboards

Once OpenSearch and OpenSearch Dashboards are running, open your browser and navigate to the following URL:

- `http://localhost:5601` or `https://localhost:5601` for a local installation.
- [https://playground.opensearch.org/app/home#/](https://playground.opensearch.org/app/home#/) for the OpenSearch Playground.

>- _OpenSearch Dashboards_ refers to the web UI for OpenSearch---the application you're looking at in your browser.
>- The **Dashboards** application is the tool within OpenSearch Dashboards for assembling visualizations into a single page.
>- A _dashboard_ (lowercase) is an individual page of visualizations created in the **Dashboards** application.
{: .note}

## Accessing applications used in this section

The Getting started tutorials use the Discover, Visualize, and Dashboards applications and the Dev Tools console. Use the _left navigation panel_ on the left side of the UI to select any application or settings page that you want to use. To open the navigation panel, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon in the header bar at the top of the page. For more information about the home page and the left navigation panel, see [Navigating OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/).

### Classic navigation

In installations in which workspaces are not enabled, the left navigation panel lists all applications directly. The following image highlights the applications used in the tutorials.

![OpenSearch Dashboards home page with classic navigation]({{site.url}}{{site.baseurl}}/images/dashboards/getting-started-classic-nav.png)

1. Prepare your data.
1. Explore the Discover application.
1. Explore the Dashboards application.
1. Explore the Visualize application.
1. Run queries in OpenSearch Dashboards.

The examples in this documentation use classic navigation. If you have workspaces enabled, the menu structure is different but the same applications are available within your workspace.

### Workspaces navigation

If workspaces are enabled, first create and select a workspace. For more information, see [Workspaces navigation]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#workspaces-navigation). The following image shows the left navigation within an example Analytics workspace, including the applications used in the tutorials.

![Left navigation within an Analytics workspace]({{site.url}}{{site.baseurl}}/images/dashboards/getting-started-workspace-interior-nav.png)

1. Prepare your data.
1. Explore the Discover application.
1. Explore the Dashboards application.
1. Explore the Visualize application.
1. Run queries in OpenSearch Dashboards.

## Next steps

- To learn what each application does, see [Learn about main applications]({{site.url}}{{site.baseurl}}/dashboards/getting-started/learn-dashboards/).
