---
layout: default
title: Navigating OpenSearch Dashboards
nav_order: 20
has_children: false
---

# Navigating OpenSearch Dashboards

You can navigate OpenSearch Dashboards from the [home page](#the-opensearch-dashboards-home-page) and the [left navigation panel](#the-left-navigation-panel), which provides access to all OpenSearch Dashboards applications.

## The OpenSearch Dashboards home page

The OpenSearch Dashboards home page has two variants: the classic home page and the workspaces home page.

### The classic home page

The following image shows the home page in classic navigation, with the navigation panel open.

![OpenSearch Dashboards home page]({{site.url}}{{site.baseurl}}/images/dashboards/osd-homepage.png)

- The _header bar_ (A) contains the following elements from left to right:
  - {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) The menu icon.
  - {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/home-icon.png" class="inline-icon" alt="home icon"/>{:/} (home) The home icon.
  - The breadcrumb display. It contains only one label, "Home", on the home page.
  - The menu area (B). This area, the right portion of the header bar, contains a context-sensitive _application menu_ when an application is active in the main panel.
  - {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/help-icon.png" class="inline-icon" alt="help icon"/>{:/} (help) The help icon.
- The navigation panel (C) is the primary means of navigating OpenSearch Dashboards. It contains collapsible menus grouped by function (**Recently viewed**, **OpenSearch Dashboards** apps, **Observability**, and so on). See [The left navigation panel](#the-left-navigation-panel).
- The _panel_ or _main panel_ (D) contains the current application or UI page.

### Workspaces navigation
**Introduced 2.18.0**
{: .label .label-purple }

OpenSearch Dashboards offers an alternative navigation mode called workspaces navigation. Workspaces group applications into focused environments, for example, Analytics, Observability, or Security Analytics. In workspaces navigation, the home page lists your workspaces, as shown in the following image, and you must first select a workspace to access applications.

![OpenSearch Dashboards home page with workspaces enabled]({{site.url}}{{site.baseurl}}/images/dashboards/getting-started-workspaces-nav.png)

After you select a workspace, the left navigation panel provides access to the applications for that workspace, similarly to classic navigation, as shown in the following image. Some features, such as [creating visualizations using queries]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/), are only available within workspaces.

![Overview page and left navigation panel within a workspace]({{site.url}}{{site.baseurl}}/images/dashboards/workspace-overview-nav.png)

Workspaces are enabled by an OpenSearch Dashboards administrator. For more information, see [Workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/).

## The left navigation panel

Use the _left navigation panel_ on the left side of the UI to select any application or settings page that you want to use. To open the navigation panel, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon at the top of the page.

The following images show the most-used features in classic and workspaces navigation.

Classic navigation panel | Workspaces navigation panel
:--: | :--:
![Classic navigation panel]({{site.url}}{{site.baseurl}}/images/dashboards/os-nav-panel.png){: width="60%" } | ![Workspaces navigation panel]({{site.url}}{{site.baseurl}}/images/dashboards/os-new-nav-panel.png){: width="57%" }

- The _menu icon_ (A) opens and closes the navigation panel.
- **Discover** (B) opens the Discover application in the main panel. See [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
- **Dashboards** (C) opens the Dashboards application in the main panel. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
- **Visualize** (D) opens the Visualize application in the main panel. See [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).
- **Observability** (E) opens the Observability menu in the navigation panel. See [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/).

## Related documentation

- [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/getting-started/access/)