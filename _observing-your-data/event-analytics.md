---
layout: default
title: Event analytics
nav_order: 20
redirect_from:
  - /observability-plugin/event-analytics/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/event-analytics/
---

# Event analytics

Event analytics in OpenSearch Observability allow you to create data visualizations using [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) (PPL) queries.

## Getting started with event analytics

To get started, choose **Observability** in OpenSearch Dashboards and then choose **Logs**. If you want to start exploring without adding your own data, choose **Add samples**. Dashboards adds sample visualizations you can interact with. You can also try out preconfigured analytics in [OpenSearch Playground](https://playground.opensearch.org/app/observability-logs#/).

## Building a query

To generate custom visualizations, you must first specify a PPL query. OpenSearch Dashboards then automatically creates a visualization based on your query results.

For example, the following PPL query returns a count of how many host addresses are currently in your data.

```
source = opensearch_dashboards_sample_data_logs | fields host | stats count()
```

By default, Dashboards shows results from the last 15 minutes of your data. To see data from a different time frame, use the date and time selector to choose the desired settings.

For more information about building PPL queries, see [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/).

### OpenSearch Dashboards Query Assistant

Note that machine learning models are probabilistic and that some may perform better than others, so the OpenSearch Assistant may occasionally produce inaccurate information. We recommend evaluating outputs for accuracy as appropriate to your use case, including reviewing the output or combining it with other verification factors.
{: .important}

To simplify query building, the **OpenSearch Assistant** toolkit offers an assistant that converts natural language queries into PPL. A screenshot is shown in the following image. 

![Sample OpenSearch Query Assist screen view]({{site.url}}{{site.baseurl}}/images/log-explorer-query-assist.png)

#### Enabling Query Assistant

By default, **Query Assistant** is enabled in OpenSearch Dashboards. To enable summarization of responses, locate your copy of the `opensearch_dashboards.yml` file and set the following option:

```yaml
observability.summarize.enabled: true
observability.summarize.response_summary_agent_name: "Response summary agent"
observability.summarize.error_summary_agent_name: "Error summary agent"
```

To disable Query Assistant, add `observability.query_assist.enabled: false` to your `opensearch_dashboards.yml`. 

#### Setting up Query Assistant

To set up **Query Assistant**, follow the steps in the [Getting started guide](https://github.com/opensearch-project/dashboards-assistant/blob/main/GETTING_STARTED_GUIDE.md) on GitHub. This guide provides step-by-step setup instructions for **OpenSearch Assistant** and **Query Assistant**. To set up **Query Assistant** only, use the `query-assist-agent` template included in the guide.

## Saving a visualization

After Dashboards generates a visualization, save it if you want to revisit it or include it in an [operational panel]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels/). To save a visualization, expand the **Save** dropdown menu in the upper-right corner, enter a name for the visualization, and then select the **Save** button. You can reopen saved visualizations on the event analytics page.

## Creating event analytics visualizations and adding them to dashboards

This feature is available in OpenSearch Dashboards 2.7 and later. It works with new visualizations that use PPL to query data from OpenSearch or federated data sources such as Prometheus.
{: .note}

To create a PPL visualization, follow these steps:

1. On the main menu, choose **Visualize** > **PPL**.
2. From the **Observability** > **Logs** > **Explorer** window, enter the index source in the **PPL query** field, for example, `source = opensearch_dashboards_sample_data_flights | stats count() by DestCountry`. You must enter the query using PPL syntax. 
3. Set the time filter, for example, **This week**, and then select **Refresh**.
4. Choose the visualization type, for example, **Pie**, from the sidebar dropdown menu to the right.  
5. Select **Save** and enter a name for the visualization.

You've now created a new visualization that can be added to a new or existing dashboard. To add a PPL query to a dashboard, follow these steps:  

1. Select **Dashboards** from the main menu.
2. In the **Dashboards** window, select **Create** > **Dashboard**.
3. In the **Editing New Dashboard** window, choose **Add an existing**.
4. In the **Add panels** window, choose **PPL** from the **Types** dropdown menu, and then select the visualization. It is now displayed on your dashboard.
5. Select **Save** and enter a name for the dashboard.
6. To add more visualizations to the dashboard, choose **Select existing visualization** and follow steps 1--5. Alternatively, choose **Create new** and then select **PPL** in the **New Visualization** window. You'll return to the event analytics page and follow steps 1--5 in the preceding instructions.

The following demo provides an overview of creating event analytics visualizations and adding them to a dashboard.

![Demo of creating event analytics visualizations and adding them to a dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/event-analytics-dashboard.gif)

### Limitations of event analytics visualizations

Event analytics visualizations currently do not support [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) or [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/), and they do not use index patterns. Note the following limitations: 

- Event analytics visualizations only use filters created using the dropdown interface. If you have DQL query or DSL filters in a dashboard, the visualizations do not use them.
- The **Dashboard** filter dropdown interface only shows fields from the default index pattern or index patterns used by other visualizations in the same dashboard.

## Viewing logs

The following are methods you can use to view logs.

### Correlating logs and traces

If you regularly track events across applications, you can correlate logs and traces. To view correlations, you must index the traces according to OpenTelemetry standards, similarly to [trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/). Once you add a `TraceId` field to your logs, you can view the correlated trace information in the event explorer log details. This method correlates logs and traces that correspond to the same execution context. The following demo shows this feature in action.

![Trace Log Correlation]({{site.url}}{{site.baseurl}}/images/trace_log_correlation.gif)

### Viewing surrounding events

If you need more information about a log event, you can select **View surrounding events** to gain a more comprehensive understanding of the context around the time of interest. The following demo shows this feature in action. 

![Surrounding Events]({{site.url}}{{site.baseurl}}/images/surrounding_events.gif)

### Livestreaming logs

If you prefer real-time monitoring, you can set up an interval at which event analytics content will be automatically refreshed. With Live Tail, you can stream logs directly to OpenSearch Observability event analytics using the specified PPL query while leveraging robust features like filters. This can enhance your debugging process and enables seamless real-time monitoring of logs without the need to manually refresh content.

With Live Tail, you can select intervals and seamlessly switch between them to control the frequency of live log streaming. This functionality is similar to the `tail -f` CLI command, as it retrieves only the most recent live logs, potentially eliminating a significant portion of live logs. Live Tail displays the total number of live logs received by OpenSearch during the live stream, offering insight into incoming traffic patterns. The following demo shows this feature in action. 

![Live Tail]({{site.url}}{{site.baseurl}}/images/live_tail.gif)

## Related documentation

- [Demonstrating the OpenSearch Assistant toolkit](https://www.youtube.com/watch?v=VTiJtGI2Sr4&t=152s)
- [Getting started guide for OpenSearch Assistant in OpenSearch Dashboards](https://github.com/opensearch-project/dashboards-assistant/blob/main/GETTING_STARTED_GUIDE.md)
- OpenSearch Assistant configuration through the REST API
