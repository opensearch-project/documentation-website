---
layout: default
title: Dashboard sections
has_children: true
has_toc: false
nav_order: 35
parent: Creating dashboards
redirect_from:
  - /dashboards/dashboard/dashboard-sections/
---

# Dashboard sections
**Introduced 3.9**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Dashboard sections are collapsible containers that group visualization panels into named, reorderable categories within a dashboard. Use sections to organize complex dashboards with many panels into logical groups, making them easier to navigate and reducing visual clutter.

To use dashboard sections, you must enable them in the OpenSearch Dashboards configuration. For more information, see [Enabling dashboard sections](#enabling-dashboard-sections).
{: .note}

Use dashboard sections to:

- Organize related visualizations into named collapsible groups.
- Collapse sections to hide panels you are not actively viewing, reducing page clutter.
- Reduce initial load time by deferring data fetching for panels in sections that are collapsed when the dashboard opens.
- Reorder sections by dragging them to change the visual layout of a dashboard.
- Move panels between sections without recreating them.

The following image shows a dashboard with a section containing visualizations.

![Dashboard with sections]({{site.url}}{{site.baseurl}}/images/dashboard-sections/dashboard-with-sections.png)

## How sections work

Each section contains a header bar with a collapse/expand toggle and a title. In edit mode, the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the section header opens a context menu with management actions such as renaming, adding visualizations, and deleting.

![Section context menu]({{site.url}}{{site.baseurl}}/images/dashboard-sections/section-context-menu.png)

Panels within a section are arranged in their own independent grid layout. You can drag and resize panels freely within a section, just as you would on a standard flat dashboard. The section automatically adjusts its height to fit its contents.

When you collapse a section, its panels are hidden but remain mounted. A panel that has not yet been displayed requests no data while the section is collapsed; it fetches when you expand the section and scroll the panel into view. A panel that has already been displayed stays active, so it continues to refresh with the rest of the dashboard even while the section is collapsed.

![Collapsed section]({{site.url}}{{site.baseurl}}/images/dashboard-sections/collapse-expand.png)

On dashboards with many visualizations, saving the dashboard with the sections you rarely use already collapsed can noticeably reduce the initial page load time and OpenSearch cluster load.
{: .tip}

### Ungrouped panels

When sections are enabled on a dashboard, any panels not assigned to a section appear in a trailing **Ungrouped** area at the bottom of the dashboard. You can move ungrouped panels into a section using the panel context menu. The **Ungrouped** area is not a section you can move panels back into.

The following image shows the **Ungrouped** area below the collapsed section.

![Ungrouped area]({{site.url}}{{site.baseurl}}/images/dashboard-sections/ungrouped-area.png)

## Enabling dashboard sections

Dashboard sections require the new home page to be enabled. Add the following settings to your `opensearch_dashboards.yml` file:

```yaml
uiSettings.overrides.home:useNewHomePage: true
dashboard.allowDashboardSections: true
```
{% include copy.html %}

Optionally, enable workspaces for a better organizational experience:

```yaml
workspace.enabled: true
```
{% include copy.html %}

Restart OpenSearch Dashboards for the changes to take effect.

## Section actions summary

The following table summarizes the available section management actions. For a guided walkthrough, see [Tutorial: Organizing a dashboard with sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/tutorial/). For step-by-step instructions, see [Managing dashboard sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/managing-sections/).

Action | Access | Description
:--- | :--- | :---
**Create section** | Toolbar **Add** > **Section** | Adds a new section. The first section auto-claims all existing panels.
**Rename** | Section context menu | Changes the section display name.
**Reorder** | Drag section header | Changes the vertical order of sections.
**Create new visualization** | Section context menu | Opens the visualization editor. The new panel is auto-added to this section.
**Add from library** | Section context menu | Adds an existing saved visualization to this section.
**Delete section** | Section context menu | Removes the section and all its panels.
**Ungroup all sections** | Section context menu | Flattens all sections back to a single grid.
**Move to section** | Panel context menu | Moves a panel into a different section.

## Limitations

Dashboard sections have the following limitations:

- Drag-and-drop of panels between sections is not supported. Use the **Move to section** context menu action to move panels.
- Section-scoped filters and variables are not currently supported. All filters apply to the entire dashboard.
- Reordering sections requires edit mode. In view mode, you can only collapse and expand sections.

## Related documentation

- [Tutorial: Organizing a dashboard with sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/tutorial/)
- [Managing dashboard sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/managing-sections/)
- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/)
- [Customizing a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/customizing-a-dash/)
