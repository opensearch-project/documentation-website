---
layout: default
title: Explore the Discover application
parent: Getting started
nav_order: 30
---

# Explore the Discover application

The **Discover** application lets you search, filter, and examine your data interactively. Use it to understand what fields are available, how data is distributed over time, and what patterns exist.

With **Discover**, you can:

- Choose data for analysis, set a time range for that data, search the data, and filter the results.
- Analyze your data: query and filter data, view results in a table, and examine documents.
- Create histograms to display the distribution of your data.

In the search bar of the Discover and Dashboards applications, you can write queries in [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/)---a simple text-based language for filtering data using field names and values. You can also switch to [query string (Lucene) syntax]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/).

## Prerequisites

The examples on this page use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset that is already installed in [OpenSearch Playground](https://playground.opensearch.org/app/home#/).

If you're using a local installation of OpenSearch Dashboards and haven't added sample data yet, see [Prepare your data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

## Try it: Search and filter flight data

Follow these steps to use the **Discover** application:

1. From the navigation panel, select **OpenSearch Dashboards** > **Discover**.

1. On the **Discover** page, select the index pattern `opensearch_dashboards_sample_data_flights` from the dropdown menu on the upper left.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) icon to change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from the default of **Last 15 minutes** to **Last 7 days**.

1. In the DQL search bar, enter the following query: 

    ```sql
    FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60
    ```
    {% include copy.html %}

1. Select **Update**.

    Results are shown for US-bound flights delayed by 60 minutes or more.

1. Filter data by selecting {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} (plus) **Add filter** from the DQL **search bar** and then selecting a **Field**, **Operator**, and **Value** from the dropdown lists in the **Edit Filter** popover. For example, select `FlightDelayType`, **is**, and **Weather Delay**.

1. Select **Save**.

    The resulting view is shown in the following image.

    ![Discover output showing filtered flight data]({{site.url}}{{site.baseurl}}/images/dashboards/opensearch-dashboards-discover.png){: width="700" }

## Further reading

- For the full Discover reference, see [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
- For a DQL reference, see [Dashboards Query Language]({{site.url}}{{site.baseurl}}/dashboards/dql/).

## Next steps

- Create a visualization from your data using [Explore the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-visualize/).