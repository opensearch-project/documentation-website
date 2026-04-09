---
layout: default
title: Creating a new visualization
parent: Building data visualizations
nav_order: 10
---

# Creating a new visualization

To create a new visualization of any type:

1. On the main page, select **Visualize** to bring up the **Visualize** application.

   The application displays the **Visualizations** list, a table of saved visualizations.

1. In the **Visualize** application, select **Create visualization** from the upper right of the **Visualizations** list.

   The application displays the **New Visualization** dialog as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/new-viz-dialog.png" width="100%" alt=" icon">

1. In the **New Visualization** dialog, select the type of visualization by choosing its icon.

   All visualization types except the following require that you choose an index pattern from the **New (type)/Choose a source** dialog to serve as a data source (the dialog displays the visualization _(type)_ in the dialog title):

   Controls, Maps, Markdown, PPL, TSVB, Timeline, Vega, and VisBuilder. Choosing data sources for these visualizations is described elsewhere.

1. In the **New (type)/Choose a source** dialog, choose an index pattern from the list.

   The Visualize panel displays a default visualization of the selected type in the main application panel, with the visualization tools panel to the left. 
   
   The default visualization shows a single value, the document count, for the current data set.

   If the visualization shows no data, or a count different than expected, double-check that the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/), [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/), and especially the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) are not filtering out the missing documents.

## Next steps

See the instructions for the [visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/#understanding-the-visualization-types-in-opensearch-dashboards) you want to build.
