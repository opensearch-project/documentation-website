---
layout: default
title: Vega visualization
parent: Visualization types
grand_parent: Creating visualizations in the Visualize application
great_grand_parent: Building data visualizations
nav_order: 180
redirect_from:
  - /dashboards/visualize/vega/
---

# Vega visualization

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization tools that you can use to create custom data visualizations with your OpenSearch data and [Vega data](https://vega.github.io/vega/docs/data/). These tools are ideal for advanced users comfortable with writing OpenSearch queries directly. You define data sources inline within your Vega specification. 

## When to use Vega visualizations

Use Vega visualizations when you need visualization types or analytical capabilities not available in standard OpenSearch visualization types, including advanced statistical analysis, custom interactive behaviors, and specialized analytical techniques.

## Enabling Vega visualizations

Vega visualizations are enabled by default. Write your [Vega specifications](https://vega.github.io/vega/docs/specification/) in JSON or [Hjson](https://hjson.github.io/) format. You can specify one or more OpenSearch queries within a specification. 

To disable Vega visualizations, set `vis_type_vega.enabled` to `false` in your `opensearch_dashboards.yml` file. 

## Creating a Vega visualization

The examples on this page use the **Sample e-commerce data** dataset. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).
{: .note}

The following example creates a network graph that visualizes relationships between product manufacturers in the sample e-commerce dataset. It uses the [`adjacency_matrix` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/adjacency-matrix/) to determine how frequently products from different manufacturers appear together in the same orders.

To create a Vega visualization for this aggregation, follow these steps:

1. From the menu on the left, select **Visualize**.
2. Select **Create Visualization** and then select **Vega**.
3. Replace the default spec with the following and then select **Update**:

```json
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Network graph from adjacency matrix aggregation",
  "autosize": "none",
  "width": 500,
  "height": 400,
  "padding": 50,

  "data": [
    {
      "name": "raw",
      "url": {
        "index": "opensearch_dashboards_sample_data_ecommerce",
        "body": {
          "size": 0,
          "aggs": {
            "interactions": {
              "adjacency_matrix": {
                "filters": {
                  "Low Tide Media": {"match": {"manufacturer.keyword": "Low Tide Media"}},
                  "Elitelligence": {"match": {"manufacturer.keyword": "Elitelligence"}},
                  "Oceanavigations": {"match": {"manufacturer.keyword": "Oceanavigations"}}
                }
              }
            }
          }
        }
      },
      "format": {"property": "aggregations.interactions.buckets"}
    },
    {
      "name": "nodes",
      "source": "raw",
      "transform": [
        {"type": "filter", "expr": "indexof(datum.key, '&') === -1"},
        {"type": "window", "ops": ["row_number"], "as": ["index"]},
        {"type": "formula", "as": "x", "expr": "250 + 150 * cos(2 * PI * (datum.index - 1) / 3)"},
        {"type": "formula", "as": "y", "expr": "200 + 150 * sin(2 * PI * (datum.index - 1) / 3)"}
      ]
    },
    {
      "name": "edges",
      "source": "raw",
      "transform": [
        {"type": "filter", "expr": "indexof(datum.key, '&') !== -1"},
        {"type": "formula", "as": "source", "expr": "split(datum.key, '&')[0]"},
        {"type": "formula", "as": "target", "expr": "split(datum.key, '&')[1]"},
        {"type": "lookup", "from": "nodes", "key": "key", "fields": ["source"], "as": ["sourceNode"]},
        {"type": "lookup", "from": "nodes", "key": "key", "fields": ["target"], "as": ["targetNode"]}
      ]
    }
  ],

  "scales": [
    {
      "name": "nodeSize",
      "type": "linear",
      "domain": {"data": "nodes", "field": "doc_count"},
      "range": [400, 2000]
    },
    {
      "name": "linkWidth",
      "type": "linear",
      "domain": {"data": "edges", "field": "doc_count"},
      "range": [2, 8]
    }
  ],

  "marks": [
    {
      "type": "rule",
      "from": {"data": "edges"},
      "encode": {
        "enter": {
          "x": {"field": "sourceNode.x"},
          "y": {"field": "sourceNode.y"},
          "x2": {"field": "targetNode.x"},
          "y2": {"field": "targetNode.y"},
          "stroke": {"value": "#888"},
          "strokeWidth": {"scale": "linkWidth", "field": "doc_count"},
          "strokeOpacity": {"value": 0.6}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "edges"},
      "encode": {
        "enter": {
          "x": {"signal": "(datum.sourceNode.x + datum.targetNode.x) / 2"},
          "y": {"signal": "(datum.sourceNode.y + datum.targetNode.y) / 2"},
          "text": {"signal": "datum.doc_count"},
          "align": {"value": "center"},
          "baseline": {"value": "middle"},
          "fontSize": {"value": 11},
          "fill": {"value": "#555"}
        }
      }
    },
    {
      "type": "symbol",
      "from": {"data": "nodes"},
      "encode": {
        "enter": {
          "x": {"field": "x"},
          "y": {"field": "y"},
          "size": {"scale": "nodeSize", "field": "doc_count"},
          "fill": {"value": "#4C78A8"},
          "stroke": {"value": "#fff"},
          "strokeWidth": {"value": 2},
          "tooltip": {"signal": "datum.key + ': ' + datum.doc_count + ' docs'"}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "nodes"},
      "encode": {
        "enter": {
          "x": {"field": "x"},
          "y": {"field": "y"},
          "dy": {"value": -30},
          "text": {"field": "key"},
          "align": {"value": "center"},
          "fontSize": {"value": 12},
          "fontWeight": {"value": "bold"}
        }
      }
    }
  ]
}
```
{% include copy.html %}

The following image shows the resulting network graph. Node size represents the document count for each manufacturer, and edge thickness represents the number of orders containing products from both manufacturers.

![Adjacency matrix network graph visualization in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/adjacency-graph.png)

## Creating Vega visualizations from multiple data sources
Introduced 2.13
{: .label .label-purple }

Before proceeding, ensure that the following configuration settings are enabled in the `config/opensearch_dashboards.yaml` file. For configuration details, refer to the `vis_type_vega` [`README`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/vis_type_vega/README.md).

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
{% include copy.html %}

## Querying Prometheus data with PromQL
Introduced 3.10
{: .label .label-purple }

You can use a Vega or Vega-Lite specification to query a Prometheus data connection using [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/). The query is executed server-side and the results are injected into the visualization as inline `values`, so no external HTTP calls are made from the browser.

Before proceeding, ensure that you have configured a Prometheus data connection in OpenSearch Dashboards. For details, see [Connecting Prometheus to OpenSearch]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/).
{: .note}

### Spec syntax

Add a `data.url` object with `"%type%": "prometheus"` to identify the data source type. The following fields are supported:

| Field | Required | Description |
|-------|----------|-------------|
| `"%type%"` | Yes | Must be set to `"prometheus"`. |
| `"%datasource%"` | Yes | The name of the Prometheus data connection as configured in OpenSearch Dashboards. |
| `"%context%"` | Yes | Must be set to `true`. Forwards the dashboard time range picker into the PromQL query. |
| `body.query` | Yes | The PromQL expression to evaluate, for example, `"rate(http_requests_total[5m])"`. To run multiple expressions in one request, separate them with a semicolon (`;`). |
| `"%maxdatapoints%"` | No | An upper bound on the number of data points per series. The server derives an appropriate step interval to stay within this limit. Useful for keeping charts responsive over long time ranges. |
| `"%step%"` | No | An explicit step interval in seconds, for example, `60`. Takes precedence over `%maxdatapoints%` when both are provided. |

### Response fields

The server returns one record per data point. Each record contains the following fields, which you can reference in Vega encodings:

| Field | Type | Description |
|-------|------|-------------|
| `Time` | Number | The timestamp of the data point, in milliseconds since the Unix epoch. |
| `Series` | String | The full label set of the time series, formatted as a Prometheus metric string, for example, `up{job="node"}`. |
| `Labels` | Object | The individual labels of the series as key-value pairs, for example, `{"job": "node", "instance": "localhost:9100"}`. |
| `Value` | Number | The sample value at this timestamp. |

### Example

The following Vega-Lite specification creates a line chart that plots the per-second rate of HTTP requests over the dashboard time range:

```json
{
  $schema: https://vega.github.io/schema/vega-lite/v5.json
  data: {
    url: {
      "%type%": prometheus
      "%datasource%": my_prometheus_connection
      "%context%": true
      "%maxdatapoints%": 500
      body: {
        query: "rate(http_requests_total[5m])"
      }
    }
  }
  mark: line
  encoding: {
    x: {
      field: Time
      type: temporal
      axis: { title: Time }
    }
    y: {
      field: Value
      type: quantitative
      axis: { title: "Requests / second" }
    }
    color: {
      field: Series
      type: nominal
    }
    tooltip: [
      { field: Time, type: temporal }
      { field: Series, type: nominal }
      { field: Value, type: quantitative }
    ]
  }
}
```
{% include copy.html %}

Replace `my_prometheus_connection` with the name of your configured Prometheus data connection.
{: .note}

### Limitations

- Prometheus data connections reach the local OpenSearch cluster's direct-query Prometheus endpoint. Remote multi-data-source (MDS) connections are not supported.
- If a query exceeds the server-side series limit, OpenSearch Dashboards displays a warning and truncates the result. Narrow the PromQL query to reduce the number of series returned.
- OpenSearch Dashboards limits a PromQL result to 30,000 data points and truncates it at a series boundary. If a result exceeds this client-side limit, OpenSearch Dashboards displays a warning. Use `%maxdatapoints%` or `%step%` to reduce the number of data points returned.

## Additional resources

The following resources provide additional information about Vega visualizations in OpenSearch Dashboards:

- [Improving ease of use in OpenSearch Dashboards with Vega visualizations](https://opensearch.org/blog/Improving-Dashboards-usability-with-Vega/)

## Next steps

- To choose a different visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
