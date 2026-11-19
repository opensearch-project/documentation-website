---
layout: default
title: Opening a dashboard
parent: Creating dashboards
nav_order: 10
has_children: false
---

# Opening a dashboard

To open a dashboard for editing, you can do one of the following:

- [Create a new empty dashboard](#creating-a-new-dashboard).
- [Copy an existing dashboard](#copying-a-dashboard).
- [Edit an existing dashboard](#editing-an-existing-dashboard).


## Creating a new dashboard

To create a new dashboard, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-left-navigation-panel), select **OpenSearch Dashboards** > **Dashboards**.

1. From the **Dashboards** application panel, choose **Create**.

1. From the drop-down, select **Dashboard**.

   The Dashboards application opens an empty dashboard in edit mode, as shown in the following image.


## Copying a dashboard

To copy a dashboard, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-left-navigation-panel), select **OpenSearch Dashboards** > **Dashboards**.

1. From the list in the **Dashboards** table, select a dashboard by choosing its title from the table.

1. From the menu in the toolbar, select **Clone**.

1. In the **Clone dashboard** dialog, enter a name for the copied dashboard.

1. (Optional) To copy the panels from the original to the copied dashboard, select **Copy panels**. For more information, see [Copying panels](#copying-panels).

1. Select **Confirm Clone**.

### Copying panels
**Introduced 3.11**
{: .label .label-purple }

By default, a copied dashboard shares its panels with the original dashboard. Both dashboards reference the same saved visualizations and saved searches, so editing a panel in the copy also changes it in the original dashboard.

To copy the panels to the new dashboard, follow these steps:

1. Select **Copy panels** in the **Clone dashboard** or **Save dashboard** dialog.

1. (Optional) In the **Copied panel title** box, customize the title template for the copied panels. Because multiple panels are copied at once, each panel title is generated from the template when it is copied. The template must include {% raw %}`{{panelTitle}}`{% endraw %}, which is replaced with the original panel title. You can also include {% raw %}`{{dashboardTitle}}`{% endraw %}, which is replaced with the new dashboard title. For example, if you copy a panel named `Errors by host` from a dashboard named `Logs` to a new dashboard named `Logs archive` using the template {% raw %}`{{panelTitle}} ({{dashboardTitle}})`{% endraw %}, the panel is copied as `Errors by host (Logs archive)`.

Only the panels are copied. Shared data, such as index patterns and data sources, stays shared.

If a panel can't be copied, for example, because its visualization was deleted, the new dashboard is still saved. That panel continues to use the original object, and a warning lists the panels that weren't copied.
{: .note}


## Editing an existing dashboard

To edit an existing dashboard, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-left-navigation-panel), select **OpenSearch Dashboards** > **Dashboards**.

1. From the list in the **Dashboards** table, select a dashboard by choosing its title from the table.

1. From the menu in the toolbar, select **Edit**.

