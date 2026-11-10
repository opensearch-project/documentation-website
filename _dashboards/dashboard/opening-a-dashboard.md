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
- [Clone an existing dashboard](#cloning-a-dashboard).
- [Edit an existing dashboard](#editing-an-existing-dashboard).


## Creating a new dashboard

To create a new dashboard, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-left-navigation-panel), select **OpenSearch Dashboards** > **Dashboards**.

1. From the **Dashboards** application panel, choose **Create**.

1. From the drop-down, select **Dashboard**.

   The Dashboards application opens an empty dashboard in edit mode, as shown in the following image.


## Cloning a dashboard

To clone a dashboard, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-left-navigation-panel), select **OpenSearch Dashboards** > **Dashboards**.

1. From the list in the **Dashboards** table, select a dashboard by choosing its title from the table.

1. From the menu in the toolbar, select **Clone**.

1. In the **Clone dashboard** dialog, enter a name for the cloned dashboard.

1. (Optional) To give the cloned dashboard its own copies of the panels, select **Copy panels**. For more information, see [Copying panels](#copying-panels).

1. Select **Confirm Clone**.

### Copying panels
**Introduced 3.11**
{: .label .label-purple }

By default, a cloned dashboard shares its panels with the original dashboard. The panels are saved visualizations and saved searches, so editing a panel in the clone also changes it in the original dashboard.

When you select **Copy panels**, OpenSearch Dashboards creates a copy of each visualization and saved search on the dashboard, and the new dashboard uses the copies. You can then edit the panels in the new dashboard without affecting the original. Only the panels are copied. Shared data, such as index patterns and data sources, stays shared.

The **Copy panels** option is available in the following places:

- In the **Clone dashboard** dialog.
- In the **Save dashboard** dialog, when you select **Save as new dashboard**. See [Saving an existing dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/managing-a-dash/#saving-an-existing-dashboard).

After you select **Copy panels**, you can set the title of the copied panels in the **Copied panel title** box. The title must include the {% raw %}`{{panelTitle}}`{% endraw %} token. You can use the following tokens.

Token | Replaced with
:--- | :---
{% raw %}`{{panelTitle}}`{% endraw %} | The title of the original panel.
{% raw %}`{{dashboardTitle}}`{% endraw %} | The title of the new dashboard.

The default title is {% raw %}`{{panelTitle}} (copy)`{% endraw %}. For example, a panel named `Errors by host` is copied as `Errors by host (copy)`.

If a panel can't be copied, for example, because its visualization was deleted, the new dashboard is still saved. That panel continues to use the original object, and a warning lists the panels that weren't copied.
{: .note}


## Editing an existing dashboard

To edit an existing dashboard, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-left-navigation-panel), select **OpenSearch Dashboards** > **Dashboards**.

1. From the list in the **Dashboards** table, select a dashboard by choosing its title from the table.

1. From the menu in the toolbar, select **Edit**.

