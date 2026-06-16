---
layout: default
title: Adding a visualization to a dashboard
parent: Creating dashboards
nav_order: 20
has_children: false
---

# Adding a visualization to a dashboard

You can add an existing panel to a dashboard or create a new visualization directly in a dashboard.

## Prerequisites

You can add a visualization to a dashboard only when you have the dashboard open for editing. See [Opening a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/opening-a-dashboard/).


## Creating a new visualization in a dashboard

You can create a new visualization, but not a new search, in a dashboard.

To add a search to a dashboard, you must create it in the Discover application, then add it. See [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
{: .note}

To create a new visualization in a dashboard, follow these steps:

1. From the application toolbar, choose **Create new**.

1. From the **New Visualization** window, choose a visualization type.

1. In the **New _\<type\>_/Choose a source** dialog, select an index pattern.

   Rather than a source selection dialog at this point, advanced visualization tools like Maps and VisBuilder have source selection built into the tool.
   {: .note}

1. The Dashboards application opens the Visualize editor and displays the default (count) visualization.

<!-- Edit the visualization as described in [Building visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/#building-visualizations). -->
   
1. Save the visualization.

<!-- See [Saving a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/#saving-a-new-visualization). -->

   Make sure the **Add to dashboard after saving** toggle in the **Save visualization** dialog is selected.
   
   When you add a visualization by creating it in a dashboard, the **Save** button in the **Save visualization** dialog says **Save and return**.
   {: .note}

## Adding a panel to a dashboard

To add a visualization or search to a dashboard, follow these steps:

1. In the application menu, select **Add**.

   The application displays the **Add panels** dialog.

1. (Optional) In the **Search** box, enter a term to filter the list of panels.

   Search is _not_ case-sensitive. Special characters are not allowed, even though they are allowed in a panel name.

1. (Optional) In the Sort drop-down, choose Ascending or Descending to select alphabetical or reverse alphabetical sorting.

   Sorting _is_ case-sensitive. Special characters are included in the sort. For example, searching on `ecommerce` would include all of these visualizations in the filtered list: `[eCommerce] Markdown`, `[Ecommerce] Order Count`, and `eCommerce Orders`.

1. (Optional) In the **Types** drop-down, select one or more panel types. The drop-down includes visualizations, searches, and special visualization types such as **Maps** and **VisBuilder** panels. If no items are selected, the filter includes all types by default.

1. (Optional) In the Rows per page drop-down, select the number of panels to list per dialog page. Default is 10.

1. (Optional) Select a page number to jump to from the page number list, or scroll through the pages with the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="right icon"/>{:/} (right) and {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-left-icon.png" class="inline-icon" alt="left icon"/>{:/} (left) icons.

1. Select one or more panels from the list.

   The dialog remains active so that you can choose more than one panel to add to the dashboard.
   {: .note}

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) icon to close the dialog.

