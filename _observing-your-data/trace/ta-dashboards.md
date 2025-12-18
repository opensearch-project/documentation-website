---
layout: default
title: Trace Analytics plugin for OpenSearch Dashboards
parent: Trace Analytics
nav_order: 50
redirect_from:
  - /observability-plugin/trace/ta-dashboards/
  - /monitoring-plugins/trace/ta-dashboards/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/trace/ta-dashboards/
---

# Trace Analytics plugin for OpenSearch Dashboards

The Trace Analytics plugin offers at-a-glance visibility into application performance based on [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol data that standardizes instrumentation for collecting telemetry data from cloud-native software.

## Installing the plugin

See [Standalone OpenSearch Dashboards plugin install]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/) for instructions on how to install the Trace Analytics plugin.

## Setting up the OpenTelemetry Demo

The [OpenTelemetry Demo with OpenSearch](https://github.com/opensearch-project/opentelemetry-demo) simulates a distributed application generating real-time telemetry data, providing you with a practical environment in which to explore features available with the Trace Analytics plugin before implementing it in your environment.

### Step 1: Set up the OpenTelemetry Demo

- Clone the [OpenTelemetry Demo with OpenSearch](https://github.com/opensearch-project/opentelemetry-demo) repository: `git clone https://github.com/opensearch-project/opentelemetry-demo`.
- Follow the [Getting Started](https://github.com/opensearch-project/opentelemetry-demo/tree/main?tab=readme-ov-file#running-this-demo) instructions to deploy the demo application using Docker, which runs multiple microservices generating telemetry data.

### Step 2: Ingest telemetry data

- Configure the OTel collectors to send telemetry data (traces, metrics, logs) to your OpenSearch cluster, using the [preexisting setup](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/otel-collector).
- Confirm that [Data Prepper](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/dataprepper) is set up to process the incoming data, handle trace analytics and service map pipelines, submit data to required indexes, and perform preaggregated calculations.

### Step 3: Explore Trace Analytics in OpenSearch Dashboards

The **Trace Analytics** application includes two options: **Services** and **Traces**:

- **Services** lists all services in the application and provides an interactive map that shows how the various services connect to each other. In contrast to the dashboard (which helps identify problems by operation), the **Service map** helps you identify problems by service based on error rates and latency. To access this option, go to **Trace Analytics** > **Services**.
- **Traces** groups traces together by HTTP method and path so that you can see the average latency, error rate, and trends associated with a particular operation. For a more focused view, try filtering by trace group name. To access this option, go to **Trace Analytics** > **Traces**. From the **Trace Groups** panel, you can review the traces in a trace group. From the **Traces** panel you can analyze individual traces to get a detailed summary.

### Step 4: Perform correlation analysis

Select **Services correlation** to display relationships between telemetry signals. This feature helps you navigate from the logical service level to associated metrics and logs for a specific service.

The Trace Analytics plugin supports correlating spans, traces, and services with their corresponding logs. This lets you move directly from a trace or span to relevant log entries, or from a service to its correlated logs, within the Trace Analytics interface. Correlation streamlines troubleshooting by offering a unified view of telemetry data, making it easier to identify root causes and understand application context.

Use the following options to perform correlation:

- **Trace-to-log correlation**: On the trace details page, select **View associated logs**.
- **Span-to-log correlation**: In the span details flyout (opened by selecting a span ID in the Gantt chart or span table), select **View associated logs**.
- **Service-to-log correlation**: On the services page, select the **Discover** icon next to the desired service.
- **Service-to-service correlation**: On the services page, use the **Focus on** option in the service map to view a service and its dependencies.

---

## Schema dependencies and assumptions

The plugin requires you to use [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) to process and visualize OTel data and relies on the following Data Prepper pipelines for OTel correlations and service map calculations:

- [Trace analytics pipeline]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/)
- [Service map pipeline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/service-map/)

### Standardized telemetry data

The plugin requires telemetry data to follow the OTel schema conventions, including the structure and naming of spans, traces, and metrics as specified by OTel, and to be implemented using the [Simple Schema for Observability]({{site.url}}{{site.baseurl}}/observing-your-data/ss4o/).

### Service names and dependency map

For accurate service mapping and correlation analysis, adhere to the following guidelines:

- Service names must be unique and used consistently across application components.
- The `serviceName` field must be populated using the Data Prepper pipeline.
- Services must be ingested with predefined upstream and downstream dependencies to construct accurate service maps and understand service relationships.

### Trace and span IDs

Traces and spans must have consistently generated and maintained unique identifiers across distributed systems to enable end-to-end tracing and accurate performance insights.

### RED metrics adherence

The plugin expects metric data to include rate, error, and duration (RED) indicators for each service, either preaggregated using the Data Prepper pipeline or calculated dynamically based on spans. This allows you to effectively compute and display key performance indicators.

### Correlation fields

Certain fields, such as `serviceName`, must be present to perform correlation analysis. These fields enable the plugin to link related telemetry data and provide a holistic view of service interactions and dependencies.

### Correlation indexes

Navigating from the service dialog to its corresponding traces or logs requires the existence of correlating fields and that the target indexes (for example, logs) follow the specified naming conventions, as described at [Simple Schema for Observability]({{site.url}}{{site.baseurl}}/observing-your-data/ss4o/).

---

## Trace analytics with OTel protocol analytics

Introduced 2.15
{: .label .label-purple }

Trace analytics with OTel protocol analytics provide comprehensive insights into distributed systems. You can visualize and analyze the following assets:

- [Service](https://opentelemetry.io/docs/specs/semconv/resource/#service): The components of a distributed application. These components are significant logical terms used to measure and monitor the application's building blocks in order to validate the system's health.
- [Traces](https://opentelemetry.io/docs/concepts/signals/traces/): A visual representation of a request's path across services into requests' journeys across services, offering insights into latency and performance issues.
- [RED metrics](https://opentelemetry.io/docs/specs/otel/metrics/api/): Metrics for service health and performance, measured as requests per second (rate), failed requests (errors), and request processing time (duration).

### Trace analytics visualizations

**Services** visualizations, such as a table or map, help you logically analyze service behavior and accuracy. The following visualizations can help you identify anomalies and errors:

- **Services table**

  - A RED indicator, along with connected upstream and downstream services and other actions, is indicated in each table column. An example **Services** table is shown in the following image.

  ![Services table]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-table.png)

  - General-purpose filter selection is used for field or filter composition. The following image shows this filter.

  ![Services filter selection]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-filter-selection.png)

  - The **Services** throughput tooltip provides an at-a-glance overview of a service's incoming request trend for the past 24 hours. The following image shows an example tooltip.

  ![Services throughput tooltip ]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-throughput-tooltip.png)

  - The **Services** correlation dialog window provides an at-a-glance overview of a service's details, including its 24-hour throughput trend. You can use these details to analyze correlated logs or traces by filtering based on the `serviceName` field. The following image shows this window.

  ![Services correlation dialog window]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-correlation-dialog.png)

  - The **Services** RED metrics dialog window provides an at-a-glance overview of a service's RED metrics indicators, including 24-hour error, duration, and throughput rate. The following image shows this window.

  ![Services RED metrics for duration]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-RED-metrics.png)

  - The **Span details** dialog window provides the details of a trace. You can use this information to further analyze a trace's elements, such as attributes and associated logs. The following image shows this window.

  ![Services Span details dialog window]({{site.url}}{{site.baseurl}}/images/trace-analytics/span-details-fly-out.png)

- **Service map**

  - The **Service map** displays nodes, each representing a service. The node color indicates the RED indicator severity for that service and its dependencies. The following image shows a map.

  ![Services map tooltip]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-details-tooltip.png)

  - You can select a node to open a detailed dialog window for its associated service. This interactive map visualizes service interconnections, helping identify problems by service, unlike dashboards that identify issues by operation. You can sort by error rate or latency to pinpoint potential problem areas.

  - In the **Service map** dialog window, nodes represent connected downstream services dependent on the selected service. The node color indicates the RED indicator severity for that service and its downstream dependencies. The following image shows this dialog window.

  ![Service map dialog window]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-fly-out.png)

- **Trace groups**

  - Traces are grouped by their HTTP API name, allowing clustering based on their business functional unit. Traces are grouped by HTTP method and path, displaying the average latency, error rate, and trends associated with a particular operation. You can filter by trace group name. The following image shows the **Trace Groups** window.

  ![Trace Groups window]({{site.url}}{{site.baseurl}}/images/trace-analytics/trace-group-RED-metrics.png)

  - In the **Trace Groups** window, you can filter by group name and other filters. You can also analyze associated traces. To drill down on the traces that comprise a group, select the number of traces in the right-hand column and then choose an individual trace to see a detailed summary.

  ![Trace group dialog window]({{site.url}}{{site.baseurl}}/images/ta-dashboard.png)

  - The **Trace details** window displays a breakdown of a single trace, including its corresponding spans, associated service names, and a waterfall chart of the spans' time and duration interactions. The following image shows this view.

  ![Trace details window]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

## Support for custom index names and cross-cluster indexes

Introduced 3.1  
{: .label .label-purple }

Trace Analytics in OpenSearch 3.1 includes expanded support for custom index names and cross-cluster indexes, offering greater flexibility and scalability for distributed environments. The following enhancements are now available:

- You can configure custom index names for Observability span, service, and log indexes. This allows you to align index naming with your organization's conventions and manage data across multiple environments more effectively. You can also configure correlated log indexes and map their corresponding fields for `timestamp`, `serviceName`, `spanId`, and `traceId`. This feature is particularly useful if your logs do not follow the OpenTelemetry (OTel) format and require custom field mappings. Custom span indexes must follow Data Prepper span index mappings.

  The following image shows the custom index name configuration interface in the Observability settings panel.

  ![Custom index name configuration UI]({{site.url}}{{site.baseurl}}/images/ta-index-settings.png)

- The **Trace details** page now includes an associated logs panel, which helps you analyze logs correlated with specific traces to improve troubleshooting and root cause analysis. The following image shows the logs panel.

  ![Trace detail page with associated logs panel]({{site.url}}{{site.baseurl}}/images/ta-trace-logs-correlation.png)

- A new dropdown menu lets you view all spans, root spans, service entry spans, or traces. The custom data grid provides advanced sorting and display options, including a full-screen mode for easier data exploration, as shown in the following image.

  ![Drop-down menu and custom data grid in Trace Analytics]({{site.url}}{{site.baseurl}}/images/ta-span-kind.png)

- The service map now appears below the traces table on the **Trace Analytics** page, providing immediate visual context for service relationships and dependencies as you analyze trace data.

  ![Service map displayed below traces table]({{site.url}}{{site.baseurl}}/images/ta-traces-page.png)

- The **Trace details** page features a new tree view that displays a hierarchical breakdown of spans. The layout has been updated to position the pie chart next to the overview panel for a more intuitive summary of trace metrics, as shown in the following image.

  ![Gantt chart with tree view and pie chart layout]({{site.url}}{{site.baseurl}}/images/ta-hierarchial-view.png)

- The Gantt chart now includes a selectable mini-map above it, allowing you to quickly navigate to and focus on specific sections of the trace timeline, as shown in the following image.

  ![Gantt chart with selectable mini-map]({{site.url}}{{site.baseurl}}/images/ta-gantt-mini-map.png)

- The service map has been redesigned to better support large node groups, making it easier to visualize complex service topologies. You can now focus on a specific service to view its dependencies and reset the map as needed, as shown in the following image.

  ![Redesigned service map with large node groups]({{site.url}}{{site.baseurl}}/images/ta-service-map-dependencies.png)

- The service view table now includes more quick-select icons, allowing you to view correlated traces and logs in their corresponding views with the correct context passed and to view service details in context without leaving the page, as shown in the following image.

  ![Service table quick select icons]({{site.url}}{{site.baseurl}}/images/ta-service-table-icons.png)

## Configurable service map limits
Introduced 3.2  
{: .label .label-purple }

OpenSearch provides default limits for service map rendering. You can increase these limits to render large topologies more completely or lower them to improve client-side performance when focusing on smaller views. This is especially important in environments with many services or dense interconnections, for which the default limits may result in incomplete maps.


### Service map configuration settings

Two **Advanced Settings** control the size and complexity of service maps generated by service map queries:

- `observability:traceAnalyticsServiceMapMaxNodes`: The maximum number of service nodes displayed. Default is 500. 
- `observability:traceAnalyticsServiceMapMaxEdges`: The maximum number of edges (service-to-service connections) displayed. Default is 1,000.

To configure these settings in OpenSearch Dashboards, follow these steps:
1. From the main menu, select **Management** > **Dashboard Management** > **Advanced Settings**.
1. In the search box, search for `Observability`. In the **Observability** section, locate the **Trace analytics service map maximum edges** and *Trace analytics service map maximum nodes** settings. Adjust the values according to your environment and performance requirements, then save your changes. Higher values can increase browser memory and CPU usage.


