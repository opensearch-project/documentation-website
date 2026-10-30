---
layout: default
title: Explore the Dashboards application
parent: Getting started
nav_order: 40
---

# Explore the Dashboards application

The **Dashboards** application lets you combine multiple visualizations into a single page for monitoring and analysis.

With **Dashboards**, you can:

- Display multiple data visualizations in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

## Prerequisites

The examples on this page use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset that is already installed in [OpenSearch Playground](https://playground.opensearch.org/app/home#/).

If you're using a local installation of OpenSearch Dashboards and haven't added sample data yet, see [Prepare your data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

## Try it: Explore a prebuilt dashboard

1. From the navigation panel, select **OpenSearch Dashboards** > **Dashboards**. The panel displays a list of existing dashboards.

1. In the search toolbar, search for and select **[Flights] Global Flight Dashboard**.

    The panel displays a dashboard preloaded with visualizations, including charts, maps, and data tables.

1. To add other panels to the dashboard, select the **Edit** button and choose **Add** from the toolbar.

1. In the search toolbar in the **Add panels** window, enter `flights`.

1. From the narrowed list, select **[Flights] Delay Buckets**.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to exit the confirmation dialog.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to exit the **Add panels** window.

1. Scroll down to confirm that the newly added panel is now displayed as the last panel on the dashboard.

    The resulting view is shown in the following image.

    ![Add panel view]({{site.url}}{{site.baseurl}}/images/dashboards/add-dash-panel.png)

### Adding your own visualization

If you're using a local installation and saved the `Flight count over time` visualization in [Explore the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-visualize/), you can add it to this dashboard. Saving visualizations is not available in the OpenSearch Playground because it is read-only.

To add the visualization, follow these steps:

1. Select **Add** from the toolbar.
1. In the search toolbar, enter `Flight count over time`.
1. Select the visualization from the list.

    The visualization is added as the last panel on the dashboard, as shown in the following image.

    ![Flight count over time panel added to the end of the dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/add-flight-count-panel.png)

## Filtering data in the Dashboards application

You can interact with visualizations to filter data.

Using the **[Flights] Global Flight Dashboard** dashboard, follow these steps to filter the sample flight data:

1. On the **[Flights] Airline Carrier** panel, select the **Toggle legend** icon in the lower-left corner. Then select **OpenSearch-Air** and then select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} (plus) icon.

    The dashboard updates automatically, adding the filter `Carrier: OpenSearch-Air` to the upper-left filter bar, as shown in the following image.

    ![Dashboard filtered by the OpenSearch-Air carrier]({{site.url}}{{site.baseurl}}/images/dashboards/airline-carrier-filter.png)

1. Select **Save** to save the dashboard.

Alternatively, you can use the dashboard toolbar to apply filters:

1. If you've added a filter using the preceding instructions, first select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) in the `Carrier: OpenSearch-Air` filter in the filter bar to remove the filter.

1. In the dashboard toolbar, select **+ Add filter**.

1. From the **Field**, **Operator**, and **Value** dropdown lists, select **Carrier**, **is**, and **OpenSearch-Air**, respectively.

1. Select **Save**.

## Further reading

- For the full Dashboards reference, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).

## Next steps

- Learn how to run API queries in [Run queries in the Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-dev-tools/).
