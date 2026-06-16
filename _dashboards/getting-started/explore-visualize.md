---
layout: default
title: Explore the Visualize application
parent: Getting started
nav_order: 35
---

# Explore the Visualize application

The **Visualize** application lets you create charts, maps, tables, and other visual representations of your data using a point-and-click interface.

## Prerequisites

The example on this page uses the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset that is already installed in [OpenSearch Playground](https://playground.opensearch.org/app/home#/).

If you're using a local installation of OpenSearch Dashboards and haven't added sample data yet, see [Prepare your data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

## Try it: Create a line chart with sample data

Follow these steps to use the **Visualize** application to create a line chart that shows flight count over time:

1. In the left navigation menu, select **OpenSearch Dashboards** > **Visualize**.
2. Select **Create visualization**.
3. In the **New Visualization** dialog, select **Line**.
4. In the **Choose a source** dialog, select **opensearch_dashboards_sample_data_flights**.
5. Set the time filter to **Last 7 days**.
6. Under **Buckets**, select **Add** > **X-axis**.
7. Set **Aggregation** to **Date Histogram** and **Field** to **timestamp**.
8. Select **Update**. The chart displays flight count per time interval, as shown in the following image.

   ![Line chart showing flight count over time]({{site.url}}{{site.baseurl}}/images/dashboards/visualize-app-line-chart-example.png)

9. From the toolbar, select **Save** (the disk icon).

   Saving is not available in the OpenSearch Playground because it is read-only. 
   {: .note}
10. In the **Save visualization** dialog, enter `Flight count over time` as the title.
11. Select **Save**.


The visualization is saved and appears in the **Visualizations** list.

## Further reading

For the full Visualize reference, see [Creating visualizations in the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).

## Next steps

- Assemble visualizations into a dashboard using [Explore the Dashboards application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-dashboards/).