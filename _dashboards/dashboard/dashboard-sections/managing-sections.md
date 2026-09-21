---
layout: default
title: Managing dashboard sections
parent: Dashboard sections
grand_parent: Creating dashboards
nav_order: 20
---

# Managing dashboard sections
**Introduced 3.9**
{: .label .label-purple }

This page covers creating, editing, reordering, and deleting dashboard sections. For an overview of sections, see [Dashboard sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/).

All section operations except collapsing and expanding require [edit mode]({{site.url}}{{site.baseurl}}/dashboards/dashboard/opening-a-dashboard/). In edit mode, the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on each section header and the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on each panel are always visible.
{: .note}

## Creating a section

When you create the first section on a dashboard, all existing panels are automatically grouped into that section to preserve the current layout. Subsequent sections are added as empty containers.

To create a section, follow these steps:

1. Open a dashboard.
2. In the toolbar, select **Add** to open the **Add** popover.
3. Select **Section**. A new section is added to the dashboard.

The following image shows the **Add** popover with the **Section** option.

![Add section from toolbar]({{site.url}}{{site.baseurl}}/images/dashboard-sections/add-section.png)

## Renaming a section

To rename a section, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the right side of the section header.
2. Select **Rename**.
3. Enter a new name for the section and confirm.

Section names do not need to be unique. However, using descriptive, distinct names helps when moving panels between sections.
{: .tip}

## Collapsing and expanding sections

To collapse a section, select the arrow to the left of the section title. The section header remains visible, and the panels are hidden.

To expand a collapsed section, select the arrow again. The panels reappear and begin fetching data as they scroll into view.

## Reordering sections

To reorder sections on a dashboard, follow these steps:

1. Select and hold the section header. The header itself is the drag handle.
2. Drag the section to the desired position.
3. Release the section to drop it into place.

## Moving panels between sections

You can move a panel from one section to another, or from the ungrouped area into a section, using the panel context menu. Moving a panel back out into the ungrouped area is not supported.

To move a panel to a different section, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon in the upper-right corner of the panel.
2. Select **Move to section**.
3. In the dialog, select the target section.
4. Select **Move**.

The following image shows the panel context menu with the move action.

![Panel context menu]({{site.url}}{{site.baseurl}}/images/dashboard-sections/panel-context-menu.png)

The following image shows the dialog in which you select the target section.

![Move to section dialog]({{site.url}}{{site.baseurl}}/images/dashboard-sections/move-to-section-modal.png)

The panel is removed from its current location and added to the target section.

## Adding visualizations to a section

You can add new or existing visualizations directly to a specific section.

### Creating a new visualization in a section

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the section header.
2. Select **Create new visualization**.
3. Build your visualization in the visualization editor.
4. Select **Save and return**. The new visualization is automatically added to the section.

### Adding an existing visualization from the library

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the section header.
2. Select **Add from library**.
3. Search for and select a saved visualization.

The visualization is added to the section.

The following image shows the section context menu with the available actions.

![Section context menu]({{site.url}}{{site.baseurl}}/images/dashboard-sections/section-context-menu.png)

## Deleting a section

Deleting a section removes the section **and all panels within it** from the dashboard.

To delete a section, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the section header.
2. Select **Delete section**.
3. In the confirmation dialog, confirm the deletion.

Deleting a section permanently removes all panels within it from the dashboard. This action cannot be undone after saving. If you want to keep the panels, move them to another section before deleting.
{: .warning}

## Ungrouping all sections

You can flatten all sections back into a single flat dashboard layout. This removes the section structure and places all panels in a single grid.

To ungroup all sections, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on any section header.
2. Select **Ungroup all sections**.
3. In the confirmation dialog, confirm the action.

All panels are returned to a flat grid layout, and the section structure is removed.

## Related documentation

- [Dashboard sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/)
- [Tutorial: Organizing a dashboard with sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/tutorial/)
- [Customizing a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/customizing-a-dash/)
- [Adding a visualization to a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/adding-a-viz/)
