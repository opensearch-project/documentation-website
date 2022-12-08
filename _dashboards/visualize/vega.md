---
layout: default
title: Vega and Vega-Lite
parent: Visualize
nav_order: 90
---
# Vega and Vega-Lite

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization grammars for creating, sharing, and saving interactive data visualizations.You can use Vega or its simpler form, Vega-Lite (Dashboards supports both) to control what data is loaded, how that data is transformed, and what visual elements to use in your visualization. Vega-Lite is a good starting point for use who are new to declarative data visualizations, as it’s a simplified version of Vega higher level  for quick visualization authoring.

Vega visualizations in OpenSearch give you control in designing your data visualization from scratch in a JSON format, giving you flexibility to visualize multidimensional data using a layered approach to build and manipulate visualizations in a structured manner. Simply put, you provide the specifications (data, graphical marks, encoding channels, etc.) of what you want the visualization to include, and the rest of the details are handled automatically.

This tutorial shows how to implement Vega visualizations included in OpenSearch Dashboards using an OpenSearch data sample. Vega visualizations are an integrated scripting mechanism of Dashboards to perform on-the-fly computations on raw data to generate [D3.js](https://d3js.org/) visualizations. 

# Creating Vega and Vega-Lite visualizations in OpenSearch Dashboards

Learn how to connect Vega and Vega-Lite with Dashboards filters and OpenSearch data, then learn how to create more Dashboards interaction using Vega and Vega-Lite. As you edit the Vega specifications (specs), work in steps and frequently save your work. Note that you can use common keyboard shortcuts, including undo (Command-Z or Ctrl+Z) and redo (Command-Shift-Z or Ctrl+Y), in the Vega editor.  

The Vega visualization pane is where the data is plotted and visualized. The pane includes options, such as date range, that you can configure to control the data that is displayed. The following image shows how to configure the different options:

<img src="{{site.url}}{{site.baseurl}}/images/vega-1.png" alt="Vega user interface in OpenSearch Dashboards" width="100%" height="100%">

| **Name**           | **Description**                                                                                                                                                                                                                                                                      |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Visualization pane | Use this section to view the plotted and visualized data.                                                                                                                                                                                                                            |
| Vega specification (Vega spec) | Use this section to define the visualization design in JSON format. By default, the editor contains a sample spec that shows aggregated document counts in all indices over time                                                                                                     |
| Show date          | Use this option to specify a date or date range.                                                                                                                                                                                                                                     |
| Search             | Use this option to                                                                                                                                                                                                                                                                   |
| Refresh            | Use this option to retrieve more data or refresh already-available contents on the screen.                                                                                                                                                                                           |
| Update             | Use this option to update the visualization to show any changes made in the spec. By default, auto-update is off, so any changes you make in the spec either can be discarded (to get back to the current visualization spec) or applied to the visualization by selecting "Update." |
| Discard            | Use this option to cancel any visualization changes.                                                                                                                                                                                                                                 |

# Getting started with Vega

This tutorial is a starting point; it’s meant to only cover the basics of creating a Vega visualization in Dashboards. For a more comprehensive introduction to Vega and Vega-Lite, see [Vega Tutorials](https://vega.github.io/vega/tutorials/) and [Introduction to Vega-Lite](https://vega.github.io/vega-lite/tutorials/getting_started.html).
{: .note}

The [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/) is used for this tutorial. Sample datasets come with sample visualizations, dashboards, and more to help you explore Vega visualizations in Dashboards without adding your own data.

1. Access the OpenSearch Dashboards playground at [playground.opensearch.org](https://playground.opensearch.org/). 
2. From the menu, select **Dashboard**.
3. In the **Dashboards** window, select **Create dashboard**.
4. Select **Add an existing**. and then
5. From the **Add panels** window, select **[eCommerce] Sales Count Map** and then select **Create new > Visualization**.
6. In the **New Visualization** window, select **Vega**. You'll see a pre-populated line chart that shows the document count in all indexes in the default time range (15 min).

<img src="{{site.url}}{{site.baseurl}}/images/vega-2.png" alt="Vega pre-populated line chart example" width="100%" height="100%">

# Querying an OpenSearch index using a Vega visualization

Continuing from the preceding steps, you'll learn how to query Dashboards using the Vega spec and JSON format. You'll also learn how to visualize the results in a stacked area chart.

1. In the Vega spec, replace `index: _all` with `index: opensearch_dashboards_sample_data_ecommerce`.
2. Select **Update**. A flat line appears with zero results.
3. To add the data fields from the `opensearch_dashboards_sample_data_ecommerce` index, replace the `timefield` and `field` properties as follows:
* `%timefield%: @timestamp` with `%timefield%: order_date` 
* `field: @timestamp` with `field: order_date`
1. Select **Update**.

<img src="{{site.url}}{{site.baseurl}}/images/" alt="GIF showing steps on how to query Dashboards using the Vega spec and JSON format" width="100%" height="100%">

# Adding aggregations

To create the stacked area chart, you'll need to add another set of aggregations. To check your work, open and use the OpenSearch Dashboards console on a separate browser tab.

1. Open OpenSearch Dashboards on a new tab.
2. Open the main menu window and then select **Dev Tools**.
3. On the **Console** editor, enter the aggregation and then select **Click to send request**.

```bash
POST opensearch_dashboards_sample_data_ecommerce/_search
{
  "query": {
    "range": {
      "order_date": {
        "gte": "now-7d"
      }
    }
  },
  "aggs": {
    "time_buckets": {
      "date_histogram": {
        "field": "order_date",
        "fixed_interval": "1d",
        "extended_bounds": {
          "min": "now-7d"
        },
        "min_doc_count": 0
      }
    }
  },
  "size": 0
}
```

Add the [terms aggregation](https://opensearch.org/docs/2.0/opensearch/aggregations/) and then select **Click to send request**.
   
   ```bash
POST opensearch_dashboards_sample_data_ecommerce/_search
{
  "query": {
    "range": {
      "order_date": {
        "gte": "now-7d"
      }
    }
  },
  "aggs": {
    "categories": {
      "terms": { "field": "category.keyword" },
      "aggs": {
        "time_buckets": {
          "date_histogram": {
            "field": "order_date",
            "fixed_interval": "1d",
            "extended_bounds": {
              "min": "now-7d"
            },
            "min_doc_count": 0
          }
        }
      }
    }
  },
  "size": 0
}
```

You’ll see a response that looks different from the first aggregation query.

```bash
 "aggregations" : {
    "categories" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "Men's Clothing",
          "doc_count" : 337,
          "time_buckets" : {
            "buckets" : [
              {
                "key_as_string" : "2022-11-29T00:00:00.000Z",
                "key" : 1669680000000,
                "doc_count" : 66
              },
              {
                "key_as_string" : "2022-11-30T00:00:00.000Z",
                "key" : 1669766400000,
                "doc_count" : 66
              },
              {
                "key_as_string" : "2022-12-01T00:00:00.000Z",
                "key" : 1669852800000,
                "doc_count" : 69
              },
              {
                "key_as_string" : "2022-12-02T00:00:00.000Z",
                "key" : 1669939200000,
                "doc_count" : 65
              },
              {
                "key_as_string" : "2022-12-03T00:00:00.000Z",
                "key" : 1670025600000,
                "doc_count" : 71

```

Now it’s time to convert from an isolated OpenSearch query into a query with OpenSearch Dashboards. Copy the body of your query into the body field of the Vega-Lite spec.

```bash
      body: {
         "range": {
      "order_date": {
        "gte": "now-7d"
      }
    }
  },
  "aggs": {
    "categories": {
      "terms": { "field": "category.keyword" },
      "aggs": {
        "time_buckets": {
          "date_histogram": {
            "field": "order_date",
            "fixed_interval": "1d",
            "extended_bounds": {
              "min": "now-7d"
            },
            "min_doc_count": 0
          }
        }
      }
    }
  },
  "size": 0
      }
    }
```

Select **Update**. You'll see the error `url.%context% and url.%timefield% must not be used when url.body.query is set`. When forming the query in the console, you must manually include the `timerange` (and other) filters. To keep the data linked to the UI search controls, use the `%context%` and `%timefield%` parameters, and remove the query field from the body.

Similarly, change `extended_bounds` of the `date_histogram` to match the `%timefilter%`.

```bash

```

Because you've added a new aggregation, you need to change the `property` aggregation, which is nested one level deeper. Change `format: {property: "aggregations.time_buckets.buckets"}` to `format: {property: "aggregations.categories.buckets"}`.
 
This more deeply nested result also needs to be flattened so that the data has a single row for each `time_buckets` aggregation. To do this, add the following `transform` aggregation before `mark:`.

```bash
transform: [
    {
      flatten: ["time_buckets.buckets"],
      as: ["time_buckets"]
    }
  ]
  ```

Continue with the following steps: 

1. Change `mark: line` to `mark: area`.
1. Change the encoding x `field: key` to `field: time_buckets.key`.
1. Change the encoding y `field: doc_count` to `field: time_buckets.doc_count`.
1. Add a new `color` encoding with `field: key`.
2. Select **Update**. You will see the stacked area chart.

# Refine your visualization 

Now that your data is visualized, let's refine it to create maximum impact.

1. Change the visualization title from `title: Event counts from all indexes` to `title: Daily orders by category`.
2. Add titles to each encoding and remove axis formatting.
3. Update the `encoding.x` axis tick formatting to match the date histogram interval by setting `axis: { tickCount: "day", grid: false }`.
4. Add a tooltip to `mark` to display the hovercard.

And that’s it! You’ve created a Vega visualization with OpenSearch Dashboards.

# Related links

* [Vega, A Visualization Grammar](https://vega.github.io/vega/)
* [Vega-Lite, A Grammar of Interactive Graphics](https://vega.github.io/vega/)
