---
layout: default
title: Dashboard sections
parent: Creating dashboards
nav_order: 35
has_children: false
---

# Dashboard sections
**Introduced 3.9**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Dashboard sections are collapsible containers that group visualization panels into named categories within a dashboard. Use sections to organize a dashboard that contains many panels and to reduce its initial load time by saving it with rarely used sections collapsed.

The following image shows a dashboard containing a section of visualizations.

![Dashboard with a section containing four visualization panels]({{site.url}}{{site.baseurl}}/images/dashboard-sections/dashboard-with-sections.png)

## Enabling dashboard sections

To enable dashboard sections, add the following settings to your `opensearch_dashboards.yml` file:

```yaml
uiSettings.overrides.home:useNewHomePage: true
dashboard.allowDashboardSections: true
```
{% include copy.html %}

Then restart OpenSearch Dashboards for the changes to take effect.

## Creating and managing sections

All section actions except collapsing and expanding require [edit mode]({{site.url}}{{site.baseurl}}/dashboards/dashboard/opening-a-dashboard/). In edit mode, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on a section header to open the section context menu, or the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on a panel to open the panel context menu.

Within a section, panels have their own grid layout, so you can drag and resize them as you would on a dashboard without sections. The section adjusts its height to fit its contents.

### Creating a section

When you create the first section on a dashboard, all existing panels are grouped into that section so that the current layout is preserved. Later sections start empty.

To create a section, follow these steps:

1. Open a dashboard in edit mode.
2. In the toolbar, select **Add**.
3. Select **Section**.

A section is added to the dashboard.

### Renaming a section

To rename a section, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on the section header.
2. Select **Rename**.
3. In the **Rename section** dialog, enter a name for the section.
4. Select **Save**.

Section names do not need to be unique, but distinct names make it easier to move panels between sections.
{: .tip}

### Collapsing and expanding sections

To collapse a section, select the arrow to the left of the section title. The section header remains visible, and the panels are hidden. To expand a collapsed section, select the arrow again.

### Reordering sections

To reorder sections, follow these steps:

1. Select and hold the section header, which acts as the drag handle.
2. Drag the section to a new position.
3. Release the section to drop it into place.

### Moving a panel to another section

You can move a panel from one section to another or from the **Ungrouped** area into a section.

To move a panel, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon in the panel's upper-right corner.
2. Select **Move to section**.
3. In the **Move to section** dialog, select the target section.
4. Select **Move**.

The panel is removed from its current section and added to the target section.

### Adding a new visualization to a section

To create a visualization and add it to a section, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on the section header.
2. Select **Create new visualization**.
3. Build the visualization in the visualization editor.
4. Select **Save and return**.

The visualization is added to the section as a panel.

### Adding a saved visualization to a section

To add an existing visualization from the library, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on the section header.
2. Select **Add from library**.
3. Search for and select a saved visualization.

The visualization is added to the section.

### Deleting a section

To delete a section, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on the section header.
2. Select **Delete section**.
3. In the confirmation dialog, confirm the deletion.

Deleting a section permanently removes all panels in it. You cannot undo this after you save the dashboard. To keep the panels, move them to another section first.
{: .warning}

### Removing all sections

You can return all panels to a single grid and remove the section structure from the dashboard.

To remove all sections, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on any section header.
2. Select **Ungroup all sections**.
3. In the confirmation dialog, confirm the action.

All panels are returned to a single grid, and the sections are removed.

## Ungrouped panels

Panels that are not assigned to a section appear in an **Ungrouped** area at the bottom of the dashboard. To move an ungrouped panel into a section, use **Move to section** in the panel context menu. You cannot move a panel back into the **Ungrouped** area.

## Collapsed sections and data loading

Collapsing a section hides its panels but does not remove them. A panel that has not yet been displayed requests no data while its section is collapsed; it fetches data when you expand the section and scroll the panel into view. A panel that has already been displayed continues to refresh with the rest of the dashboard even while the section is collapsed.

On a dashboard with many visualizations, saving the dashboard with rarely used sections already collapsed reduces both the initial page load time and the load on your OpenSearch cluster.
{: .tip}

## Example: Organizing a dashboard into sections

To follow along, go to the OpenSearch Dashboards home page, select **Add sample data**, and then select **Add data** for **Sample eCommerce orders**.

The following steps organize the sample e-commerce dashboard into two sections:

1. On the top menu, select **Dashboards**, and then select **[eCommerce] Revenue Dashboard**.
2. Select the **Edit** toggle in the toolbar to enter edit mode.
3. In the toolbar, select **Add** > **Section**. All existing panels are grouped into a section named **Section 1**.
4. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="vertical ellipsis icon"/>{:/} (vertical ellipsis) icon on the **Section 1** header, select **Rename**, enter `Revenue and trends`, and then select **Save**.
5. In the toolbar, select **Add** > **Section** again. An empty section appears below the first one, also named **Section 1** because the first section was renamed. Rename this section `Customer breakdown`.
6. On the **[eCommerce] Sales by Gender** panel, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon, and then select **Move to section**, as shown in the following image.
    ![Panel Options menu with the Move to section action highlighted]({{site.url}}{{site.baseurl}}/images/dashboard-sections/panel-context-menu.png)
7. In the **Move to section** dialog, select **Customer breakdown**, and then select **Move**.
8. Repeat the previous two steps for the **[eCommerce] Sales Count Map** and **[eCommerce] Top Selling Products** panels.
9. Select the arrow to the left of the **Customer breakdown** title to collapse the section.
10. Select **Save**.

The dashboard now contains two sections that you can collapse, expand, and reorder independently, and the collapsed **Customer breakdown** section loads no data until you expand it.

## Limitations

Dashboard sections have the following limitations:

- Dragging a panel from one section to another is not supported. To move a panel, use **Move to section** in the panel context menu.
- Section-scoped filters and variables are not supported. All filters apply to the entire dashboard.
- Adding, renaming, reordering, and deleting sections require edit mode. In view mode, you can only collapse and expand sections.

## Related documentation

- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/)
- [Customizing a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/customizing-a-dash/)
- [Adding a visualization to a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/adding-a-viz/)
