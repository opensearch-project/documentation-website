---
layout: default
title: Vega
parent: Building data visualizations
nav_order: 45
---

# TSVB

The Time-Series Visual Builder (TSVB) is a powerful data visualization tool in OpenSearch Dashboards that allows you to create detailed time-series visualizations. One of its key features is the ability to add annotations or markers at specific time points based on index data. This feature is particularly useful for making connections between multiple indexes and building visualizations that display data over time, such as flight status, delays by type, and more. TSVB currently supports the following visualization types: Area, Line, Metric, Gauge, Markdown, and Data Table.

## Visualizing data from multiple data sources
Introduced 2.14
{: .label .label-purple }

Before proceeding, ensure that the following configurations are enabled. These can be found in `config/opensearch_dasboards.yaml`:

```yaml
data_source.enabled: true
vis_type_timeseries.enabled: true
```
{% include copy-curl.html %}

**Step 1: Connecting data sources**

Once you have configured your YAML file, open OpenSearch Dashboards and follow these steps:

1. From the **Home** page, select **Add sample data** and then select the **Add data** button for the **Sample web logs** dataset, as shown in the following GIF.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/tsvb.png" alt="TSVB pop-up screen" width="700"/>

2. Select **Dashboards Management** from the main menu.
3. Select **Data sources** from the left-side menu and then select the **Create data source** button.
4. From the **Create data source** page, enter the connection details and endpoint URL, as shown in the following GIF.





**Step 2: Specifying data sources**

TSVB uses your default index pattern to initialize the visualization. To change the index pattern or configure settings, follow these steps:

1. From the **Create** window, select **Panel options**.
2. Select the OpenSearch cluster from which to pull data from the **Data source** dropdown menu. In this case, choose `Source A`.
3. Enter `opensearch_dashboards_sample_data_logs` in the **Index name** field.
4. Select `@timestamp` from the **Time field** dropdown menu. This setting specifies the time range for rendering the visualization.

The following GIF shows these steps. 

![Specifying data sources demo]({{site.url}}{{site.baseurl}}/images/dashboards/make_tsvb.gif)

The following image shows the TSVB visualization.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/tsvb-viz.png" alt="TSVB visualization" width="700"/>

**(Optional) Step 3: Add annotations**

Annotations are markers that can be added to time-series visualizations. Follow these steps to add annotations:

1. 

