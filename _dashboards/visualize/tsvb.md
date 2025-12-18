---
layout: default
title: TSVB
parent: Building data visualizations
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/dashboards/visualize/tsvb/
---

# TSVB

The Time-Series Visual Builder (TSVB) is a powerful data visualization tool in OpenSearch Dashboards that allows you to create detailed time-series visualizations. One of its key features is the ability to add annotations or markers at specific time points based on index data. This feature is particularly useful for making connections between multiple indexes and building visualizations that display data over time, such as flight status, delays by type, and more. TSVB currently supports the following visualization types: Area, Line, Metric, Gauge, Markdown, and Data Table.

## Creating TSVB visualizations from multiple data sources
Introduced 2.14
{: .label .label-purple }

Before proceeding, ensure that the following configuration settings are enabled in the `config/opensearch_dasboards.yaml` file:

```yaml
data_source.enabled: true
vis_type_timeseries.enabled: true
```
{% include copy-curl.html %}

Once you have configured [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) in OpenSearch Dashboards, you can use Vega to query those data sources. The following GIF shows the process of creating TSVB visualizations in OpenSearch Dashboards.

![Process of creating TSVB visualizations in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/configure-tsvb.gif)

**Step 1: Set up and connect data sources**

Open OpenSearch Dashboards and follow these steps:

1. Select **Dashboards Management** from the main menu on the left.
2. Select **Data sources** and then select the **Create data source** button.
3. On the **Create data source** page, enter the connection details and endpoint URL.
4. On the **Home** page, select **Add sample data** and then select the **Add data** button for the **Sample web logs** dataset.

The following GIF shows the steps required to set up and connect a data source.

![Create data source]({{site.url}}{{site.baseurl}}/images/dashboards/create-datasource.gif)

**Step 2: Create the visualization**

Follow these steps to create the visualization:

1. From the menu on the left, select **Visualize**.
2. On the **Visualizations** page, select **Create Visualization** and then select **TSVB** in the pop-up window.

**Step 3: Specify data sources**

After creating a TSVB visualization, data may appear based on your default index pattern. To change the index pattern or configure additional settings, follow these steps:

1. In the **Create** window, select **Panel options**.
2. Under **Data source**, select the OpenSearch cluster from which to pull data. In this case, choose your newly created data source.
3. Under **Index name**, enter `opensearch_dashboards_sample_data_logs`.
4. Under **Time field**, select `@timestamp`. This setting specifies the time range for rendering the visualization.

**(Optional) Step 4: Add annotations**

Annotations are markers that can be added to time-series visualizations. Follow these steps to add annotations:

1. On the upper-left corner of the page, select **Time Series**.
2. Select the **Annotations** tab and then **Add data source**.
3. In the **Index** name field, specify the appropriate index. In this case, continue using the same index from the previous steps, that is, `opensearch_dashboards_sample_data_logs`.
4. From **Time** field, select `@timestamp`.
5. In the **Fields** field, enter `timestamp`.
6. In the **Row template** field, enter `timestamp`.

The visualization automatically updates to display your annotations, as shown in the following image.

  <img src="{{site.url}}{{site.baseurl}}/images/dashboards/tsvb-with-annotations.png" alt="TSVB visualization with annotations" width="700"/>
