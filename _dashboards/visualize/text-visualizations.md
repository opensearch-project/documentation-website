---
layout: default
title: Building text visualizations
parent: Building data visualizations
nav_order: 20
has_children: false
has_toc: false
---

# Building text visualizations

Text visualizations display data using words and numbers rather than graphical elements. These elements provide detail and can also help make key data stand out on a [dasboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/). Text visualizations include the following:

| **Metric** | **Tag cloud** | **Data table** |
| [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-metric-icon.png" width="90" height="90" alt=" icon">](#building-a-metric-visualization) | [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-tagcloud-icon.png" width="90" height="90" alt=" icon">](#building-a-tag-cloud) | [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-datatable-icon.png" width="90" height="90" alt=" icon">](#building-a-data-table) |
| Display a single data field. | Display a word cloud, attaching magnitudes to terms. | Display any type of data in a table. |

Instructions for each follow.


## Building a metric visualization

The  Metric visualization displays a single data field. The visualization can show a single value or multiple bucketed values.

Use the metric visualization to display a key indicator in a dashboard, especially if it updates frequently.

To create a metric visualization:

1. Open a new visualization of type metric. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, choose `opensearch_dashboards_sample_data_flights` in the **New Metric/Choose a source** dialog.

   The visualization pane displays a count of the documents in the index pattern. For the `opensearch_dashboards_sample_data_flights` data, this is `13059` if the date range contains all the documents.
   {: .note}

1. Select the **Data** tab.

1. In the **Metrics** box in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Metric count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For this tutorial, select `Average`.

1. In the **Field** box, select **Select a field** {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) to expand the **Field** list.

1. Choose the field you want to display.

   For this tutorial, select `DistanceKilometers`.

1. Select **Update** in the lower right of the visualization tool to view the metric in the display panel.

   The visualization panel displays `7092.142`, the average distance in kilometers for every document in the flight database.

   If your visualization displays a different value, make sure that your [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) window is large enough to encompass all the sample flight data.
   {: .note}

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Building a tag cloud

A tag cloud displays a group of text fields (bucket labels, called _tags_ in the visualization) from the data. The font size of each tag corresponds to the magnitude of the bucket in the data. For example, if the visualization specifies `Average`, the font size of the tag in the tag cloud is proportional to the bucketed field's average value.

Use tag clouds to provide a dramatic comparison of magnitudes of different text-labeled buckets.

You can think of a tag cloud as a kind of reverse display that maps bucketed values by displaying the values as the size of the bucket label rather than a graphed quantity such as the length of a bar.

To build a tag cloud visualization, do the following:

1. Open a new visualization of type tag cloud. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, choose `opensearch_dashboards_sample_data_flights` in the **New Tag cloud/Choose a source** dialog.

   Since the data is not bucketed, the visualization pane displays `all` in large letters. (By default the tag size is proportional to the document count, but there are no other terms to compare its size against.)
   {: .note}

1. Select the **Data** tab.

1. In the **Metrics** panel in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Tag size count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For this tutorial, select `Unique Count`.

1. In the **Field** box, select the field you want to display.

   For this tutorial, select `DestLocation`.

1. (Optional) In the Custom label box, enter a different name for this data.

   For this tutorial, enter `Destinations Served`.

1. Select **Update** in the lower right of the visualization tool to view the metric in the display panel.

   Notice that the visualization does not change. The tag cloud still has only one entry, `all`, because the data has not been bucketed.

1. In the **Buckets** panel, select **Add**.

1. In the **Add bucket** drop-down, select **Tags**.

1. In the Aggregation drop-down, select **Terms**.

1. In the **Field** drop-down, select **Carrier**.

1. Select **Update**.

   The visualization panel displays the carriers (airlines) as shown in the following image. The relative font size of each carrier represents the relative magnitude of the metric, in this case the number of unique destinations named in the data.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-tagcloud-carrier-destinations.png" width="60%"  alt="Aggregation-based area chart"/>

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Building a data table

A data table displays selected fields in row-column form. You can display one or more data fields as columns, bucketed by row. You can subdivide bucket data into separate tables in the same visualization.

Use a table visualization to view and compare key values in text form.

To create a table visualization:

1. Open a new visualization of type data table. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, choose `opensearch_dashboards_sample_data_flights` in the **New Data table/Choose a source** dialog.

   By default, the visualization pane selects `Count` as the only metric to display. Since the data is not bucketed, it displays the  total document count.

   For this dataset the count is `13,059` if none of the data has been filtered out. If your visualization displays a different value, make sure that your time filter window is large enough to encompass all the sample flight data. See [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).
   {: .note}

1. Select the **Data** tab.

1. In the **Metrics** box in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Metric Count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

For this tutorial, select `Average`.

1. In the **Field** box, choose the field you want to display.

   For this tutorial, select `FlightDelayMin`.

1. (Optional) To replace the raw field name in the visualization, enter an alternative name for the data field in the **Custom label** box.

   For this tutorial, enter `Flight delay in minutes`.

1. Select **Update** in the lower right of the visualization tool to view the metric in the display panel.

   The visualization panel still displays a single value for all the data, `47.335`. This is the average flight delay for every document in the flight database, including zero-minute delays.

1. To add rows to the table, bucket the data. In the **Buckets** pane, click **Add**.

1. In the **Add bucket** drop-down, select **Split rows** to separate the buckets by table row.

1. In the **Aggregation** drop-down, select an aggregation type for the rows.

   For this example, select **Terms**.

1. In the Field drop-down, select a field for the row buckets. For this example, select the boolean value **FligthDelay**.

1. Select **Update**.

   The table shows that undelayed flights averaged zero minutes of delay time, as you'd expect. Also, the nonzero flight delay bucket is considerably higher than the overall value because the zero delays are no longer part of that average.
   {: .note}

1. Change the row buckets by choosing a new aggregation from the **Buckets** > **Aggregation** drop-down.

   For this tutorial, choose **Range**.

1. Select a new field from the **Field** drop-down.

   For this tutorial, choose **DistanceMiles**.

1. Edit the range values to to the following. (Select **Add range** to add the third range line.)

   ≥    0 | < 4000
   ≥ 4000 | < 8000
   ≥ 8000 | < +∞

1. Add another column to the table by selecting **Add** in the **Metrics** pane.

   Be careful to select **Add** in the **Metrics** pane and not the **Buckets** pane.
   {: .tip}

1. In the Aggregation drop-down, choose *Count*.

1. Select **Update** to redraw the table.

   The table now shows the flight delay and the count for each row as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-table-flightdelay.png" width="100%"  alt="Data table visualization"/>

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).
