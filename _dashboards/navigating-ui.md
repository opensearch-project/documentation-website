---
layout: default
title: Using OpenSearch Dashboards
nav_order: 15
has_children: false
---

# Using OpenSearch Dashboards


OpenSearch Dashboards is the web UI for [OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/intro/). You can use OpenSearch Dashboards to perform most tasks you can do with the OpenSearch APIs. Among other things, you can use OpenSearch Dashboards to:

- Create indexes and populate them with data.
- Connect data sources to OpenSearch.
- Use visual filter tools or one of four different query languages to explore data.
- Create and save data visualizations and dashboards.
- Send requests to the OpenSearch REST API directly without using cURL. See [Running queries in the Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/visualize/run-queries/).

The following instructions are not comprehensive. There is often more than one way to do something in the interface; to open an application, for example. In most such cases we document only one way to accomplish the task. In general, because the navigation panel is always available, we recommend using it to access applications and features in OpenSearch Dashboards.

## Navigating OpenSearch Dashboards

The following image shows the default landing page for OpenSearch Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/osd-homepage.png" alt="OpenSearch Dashboards"  width="100%">

- The _header bar_ (A) contains the following elements from left to right:
  - {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) The menu icon.
  - {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/home-icon.png" class="inline-icon" alt="home icon"/>{:/} (home) The home icon.
  - The breadcrumb display. It contains only one label, "Home", on the home page.
  - The menu area (B). This area, the right portion of the header bar, contains a context-sensitive _application menu_ when an application is active in the main panel.
  - {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/help-icon.png" class="inline-icon" alt="help icon"/>{:/} (help) The help icon.
- The navigation panel (C) is the primary means of navigating OpenSearch Dashboards. It contains collapsible menus grouped by function (**Recently viewed**, **OpenSearch Dashboards** apps, **Observability**, and so on). See [Using the navigation panel](#using-the-navigation-panel).
- The _panel_ or _main panel_ (D) contains the current application or UI page.


### The New Home Page interface

Introduced 2.18.0
{: .label .label-purple }

OpenSearch Dashboards offers an alternative to the default UI called the New Home Page interface. The functionality is roughly equivalent between the two UIs, with the following differences:

- The New Home Page interface centers on workflows that use the Workspace feature.
- The arrangement of menu trees and navigation is different in the two interfaces, including the organization of the navigation panel.
- The look and feel is different in the New Home Page interface.
- The New Home Page interface is reachable using an option flag. The flag is available in the OpenSearch Dashboards setup menu. See [Using the OpenSearch Dashboards setup menu](#using-the-opensearch-dashboards-setup-menu).

Where applicable, the following sections describe, in parallel, how to use both interfaces. The differences are mostly in the arrangement of the navigation panel.

## Using the navigation panel

Use the _navigation panel_ on the left side of the UI to select any application or settings page that you want to use.

The images below show the most-used features on both versions (default and New Home Page) of the navigation panel.

The default navigation panel | The New Home Page navigation panel
:--: | :--:
<img src="{{site.url}}{{site.baseurl}}/images/dashboards/os-nav-panel.png" alt="OpenSearch navigation panel"  width="60%"> | <img src="{{site.url}}{{site.baseurl}}/images/dashboards/os-new-nav-panel.png" alt="New OpenSearch navigation panel"  width="57%">

- The _menu icon_ (A) hides and reveals the navigation panel. To enlarge the application panel, you can [hide](#hiding-the-navigation-panel) and [unhide](#unhiding-the-navigation-panel) the navigation panel.
- **Discover** (B) opens the Discover application in the main panel. See [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
- **Dashboards** (C) opens the Dashboards application in the main panel. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
- **Visualize** (D) opens the Visualize application in the main panel. See [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- **Observability** (E) opens the Observability menu in the navigation panel. See [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/).

### Hiding the navigation panel

To hide the navigation panel, follow these steps:

1. | In the default navigation panel | In the New Home Page navigation panel |
   | :-- | :-- |
   | - Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-docked-icon.png" class="inline-icon" alt="docked icon"/>{:/} (dock) **Undock navigation** at the bottom of the navigation panel.<br/>- Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon or {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to the right of the menu. | - Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/nav-collapse-icon.png" class="navigation collapse icon" alt="docked icon"/>{:/} (collapse navigation) icon. |

### Unhiding the navigation panel

To unhide the navigation panel, follow these steps:

1. | In the default navigation panel | In the New Home Page navigation panel |
   | :-- | :-- |
   | - Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon.<br/>- Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-undocked-icon.png" class="inline-icon" alt="undocked icon"/>{:/} (undock) **Dock navigation** at the bottom of the navigation panel. | - Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon. |

## Using the OpenSearch Dashboards setup menu

OpenSearch Dashboards has many settings that control display, logging, search, and various UI behaviors. Some settings enable experimental functionality.

You can set these parameters by editing the `opensearch_dashboards.yml` file. See [Configuring OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-dashboards/).

You can use OpenSearch Dashboards to configure many of the same settings.

To configure a setting, do the following:

1. | In the default navigation panel | In the New Home Page navigation panel |
   | :-- | :-- |
   | - Select **Management** > **Dashboards Management**.<br/>- In the Dashboards Management panel, select **Advanced settings**. | Select **Settings and setup** > **Application settings**. |

   Some of these settings enable experimental features or can subvert expected behavior. We recommend not changing a setting unless you're sure of its effects.
   {: .warning}

1. (Optional) Select one or more setting categories from the Category drop-down to filter the settings list.

1. (Optional) Enter a search term in the Search text box to filter the settings list.

1. Select or enter the value for the setting you want to change.

   For example, to use the [New Home Page UI](#the-new-home-page-interface), select the **Try the new home page** toggle to enable it.

1. Select the **Save changes** button.
