---
layout: default
title: Vega
parent: Building data visualizations
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/dashboards/visualize/vega/
---

# Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization tools that you can use to create custom data visualizations with your OpenSearch data and [Vega data](https://vega.github.io/vega/docs/data/). These tools are ideal for advanced users comfortable with writing OpenSearch queries directly. Enable the `vis_type_vega` plugin in your `opensearch_dashboards.yml` file to write your [Vega specifications](https://vega.github.io/vega/docs/specification/) in either JSON or [HJSON](https://hjson.github.io/) format or to specify one or more OpenSearch queries in your Vega specification. By default, the plugin is set to `true`. 

## Creating Vega visualizations from multiple data sources
Introduced 2.13
{: .label .label-purple }

Before proceeding, ensure that the following configuration settings are enabled in the `config/opensearch_dasboards.yaml` file. For configuration details, refer to the `vis_type_vega` [README](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/vis_type_vega/README.md).

```
data_source.enabled: true
vis_type_vega.enabled: true
```

After you have configured [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) in OpenSearch Dashboards, you can use Vega to query those data sources. The following GIF shows the process of creating Vega visualizations in OpenSearch Dashboards.

![Process of creating Vega visualizations in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/configure-vega.gif)

### Step 1: Set up and connect data sources

Open OpenSearch Dashboards and follow these steps:

1. Select **Dashboards Management** from the menu on the left.
2. Select **Data sources** and then select the **Create data source** button.
3. On the **Create data source** page, enter the connection details and endpoint URL, as shown in the following GIF.
4. On the **Home page**, select **Add sample data**. Under **Data source**, select your newly created data source, and then select the **Add data button** for the **Sample web logs** dataset.

The following GIF shows the steps required for setting up and connecting a data source.

![Setting up and connecting data sources with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/Add_datasource.gif)

### Step 2: Create the visualization

1. From the menu on the left, select **Visualize**.
2. On the **Visualizations** page, select **Create Visualization** and then select **Vega** in the pop-up window.

### Step 3: Add the Vega specification

By default, queries use data from the local cluster. You can assign individual `data_source_name` values to each OpenSearch query in your Vega specification. This allows you to query multiple indexes across different data sources in a single visualization.

1. Verify that the data source you created is specified under `data_source_name`. Alternatively, in your Vega specification, add the `data_source_name` field under the `url` property to target a specific data source by name.
2. Copy the following Vega specification and then select the **Update** button in the lower-right corner. The visualization should appear. 

```json
{
  $schema: https://vega.github.io/schema/vega-lite/v5.json
  data: {
    url: {
      %context%: true
      %timefield%: @timestamp
      index: opensearch_dashboards_sample_data_logs
      data_source_name: YOUR_DATA_SOURCE_TITLE
      body: {
        aggs: {
          1: {
            date_histogram: {
              field: @timestamp
              fixed_interval: 3h
              time_zone: America/Los_Angeles
              min_doc_count: 1
            }
            aggs: {
              2: {
                avg: {
                  field: bytes
                }
              }
            }
          }
        }
        size: 0
      }
    }
    format: {
      property: aggregations.1.buckets
    }
  }
  transform: [
    {
      calculate: datum.key
      as: timestamp
    }
    {
      calculate: datum[2].value
      as: bytes
    }
  ]
  layer: [
    {
      mark: {
        type: line
      }
    }
    {
      mark: {
        type: circle
        tooltip: true
      }
    }
  ]
  encoding: {
    x: {
      field: timestamp
      type: temporal
      axis: {
        title: @timestamp
      }
    }
    y: {
      field: bytes
      type: quantitative
      axis: {
        title: Average bytes
      }
    }
    color: {
      datum: Average bytes
      type: nominal
    }
  }
}
```
{% include copy-curl.html %}

## Additional resources

The following resources provide additional information about Vega visualizations in OpenSearch Dashboards:

- [Improving ease of use in OpenSearch Dashboards with Vega visualizations](https://opensearch.org/blog/Improving-Dashboards-usability-with-Vega/)
