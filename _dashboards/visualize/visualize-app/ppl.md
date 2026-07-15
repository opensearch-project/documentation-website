---
layout: default
title: PPL visualizations
parent: Visualization types
grand_parent: Creating visualizations in the Visualize application
great_grand_parent: Building data visualizations
nav_order: 140
redirect_from:
  - /dashboards/visualize/ppl/
---

# PPL visualizations

Piped Processing Language (PPL) visualizations enable data processing and visualization using PPL queries. Selecting **PPL** from the **New Visualization** dialog opens the Observability Logs Explorer, where you write a PPL query and map the results to a chart.

## When to use PPL visualizations

Use PPL visualizations when you want to write queries directly using the PPL pipeline syntax rather than configuring aggregations through the point-and-click interface. For more information, see [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/) and [Exploring data]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/index/).

## Creating a PPL visualization

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a PPL visualization, follow these steps:

1. In the **New Visualization** dialog, select **PPL**. The Observability Logs Explorer opens.
2. In the PPL query bar, enter a query. For example:

   ```sql
   source = opensearch_dashboards_sample_data_flights | stats count() by Carrier
   ```
   {% include copy.html %}

3. Set the time filter to a range that contains data (for example, select **Last 7 days**).
4. Select **Run**.
5. Select the **Visualizations** tab to view the chart.
6. (Optional) Use the chart type selector on the right to change the chart type (for example, **Pie**).

The explorer automatically maps query result fields to the chart. The **Configuration** panel shows **Series** (the metric) and **Dimensions** (the grouping field), as shown in the following image.

![PPL visualization showing flight count by carrier as a pie chart]({{site.url}}{{site.baseurl}}/images/dashboards/ppl-example.png)


## Related documentation

- [Creating visualizations using queries]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/)

## Next steps

- To choose a different visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).