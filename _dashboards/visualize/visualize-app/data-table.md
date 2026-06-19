---
layout: default
title: Data tables
parent: Visualization types
grand_parent: Creating visualizations in the Visualize application
great_grand_parent: Building data visualizations
nav_order: 60
redirect_from:
  - /dashboards/visualize/data-table/
---

# Data tables

A data table displays selected fields in row-column form. You can display one or more metrics as columns, bucketed into rows, and subdivide bucket data into separate tables.

## When to use data tables

Use data tables to examine individual documents, verify data quality, or investigate details behind aggregate visualizations. You can sort, filter, and examine correlations between fields that might not be apparent in more abstract visualizations. Use data tables as drill-down targets to move from high-level visual summaries to specific record-level details.

## Creating a data table

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a data table, follow these steps:

1. In the **New Visualization** dialog, select **Data Table**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).

   By default, the visualization selects `Count` as the only metric to display. Since the data is not bucketed, it displays the total document count.

   For this dataset the count is `13,059` if none of the data has been filtered out. If your visualization displays a different value, make sure that your time filter window is large enough to encompass all the sample flight data. See [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).
   {: .note}

2. Under **Metrics**, expand **Metric Count**.
3. Set **Aggregation** to **Average** and **Field** to **FlightDelayMin**.
4. (Optional) Enter a **Custom label**, for example `Flight delay in minutes`.
5. Select **Update**.

   The table displays a single value for all the data, `47.335`. This is the average flight delay for every document in the flight database, including zero-minute delays.

6. Under **Buckets**, select **Add** > **Split rows**.
7. Set **Aggregation** to **Terms** and **Field** to **FlightDelay**.
8. Select **Update**.

   The table shows that undelayed flights averaged zero minutes of delay time. The nonzero flight delay bucket is considerably higher than the overall value because the zero delays are no longer part of that average.
   {: .note}

9. Change the row buckets by choosing **Range** from the **Aggregation** dropdown and **DistanceMiles** from the **Field** dropdown.
10. Configure the following ranges (select **Add range** for the third row):

    | From | To |
    | :--- | :--- |
    | 0 | 4000 |
    | 4000 | 8000 |
    | 8000 | Infinity |

11. Under **Metrics**, select **Add** and set **Aggregation** to **Count**.

    Select **Add** in the **Metrics** pane, not the **Buckets** pane.
    {: .tip}

12. Select **Update**.

    The table shows the average flight delay and count for each distance range, as shown in the following image.

    ![Data table showing flight delay by distance range]({{site.url}}{{site.baseurl}}/images/dashboards/example-table-flightdelay.png)

## Configuring a data table

For information about general visualization configuration, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

## Next steps

- To choose a different visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
