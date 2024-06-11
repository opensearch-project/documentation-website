---
layout: default
title: OpenSearch Dashboards plugin
parent: Trace Analytics
nav_order: 50
redirect_from:
  - /observability-plugin/trace/ta-dashboards/
  - /monitoring-plugins/trace/ta-dashboards/
---

# Trace Analytics OpenSearch Dashboards plugin

The Trace Analytics plugin offers at-a-glance visibility into application performance based on [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol data. OTel, an open-source observability framework, offers standardized instrumentation for collecting telemetry data from cloud-native software.

An [OTel demo](#otel-demo) is provided at the end of this documentation.

## Installing the plugin

Refer to [Standalone OpenSearch Dashboards plugin install]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/) for guidance about install the Trace Analytics plugin.

## Schema dependencies and assumptions

The plugin requires [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) to process and visualize OTel data effectively. It relies on the following Data Prepper pipelines for OTel correlations and service-map calculations:

- [Trace analytics pipeline]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/)
- [Service map pipeline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/service-map-stateful/)

### Standardized telemetry data

The plugin requires telemetry data to follow the OTel schema conventions, including the structure and naming of spans, traces, and metrics as specified by OTel and implemented using the [Simple Schema for Observability (SS4O)]({{site.url}}{{site.baseurl}}/observing-your-data/ss4o/).

### Service names and dependency map

For accurate service mapping and correlation analysis, adhere to the following guidelines:

- Service names must be unique and consistently used across application components.
- The `serviceName` is populated using the Data Prepper pipeline.
- Services must be ingested with predefined upstream and downstream dependencies to construct accurate service maps and understand service relationships.

### Trace and span IDs

Traces and spans must have consistently generated and maintained unique identifiers across distributed systems to enable end-to-end tracing and accurate performance insights.

### RED metrics adherence

The plugin expects metrics data to include rate, error, and duration (RED) indicators for each service, either pre-aggregated using Data-Prepper's pipeline or calculated on-the-fly based on spans. This allows for effective computation and display of key performance indicators.

### Correlation fields

Certain fields, such as `serviceName`, must be present for correlation analysis. These fields enable the plugin to link related telemetry data and provide a holistic view of service interactions and dependencies.

## Trace analytics using the interface
Introduced 2.15
{: .label .label-purple }

Trace analytics with OTel protocol analytics in OpenSearch Dashboards provides comprehensive insights into distributed systems. The interface enables you to correlate signals, identify relationships, and uncover root causes of issues. You can analyze and visualize the following:

- [Services](https://opentelemetry.io/docs/specs/semconv/resource/#service): Representing the different components of a distributed application. They are a significant logical term used to measure and monitor the application's building blocks to validate the system's health.
- [Traces](https://opentelemetry.io/docs/concepts/signals/traces/): Providing end-to-end visibility into requests' journeys across services, offering insights into latency and performance issues.
- [RED metrics](https://opentelemetry.io/docs/specs/otel/metrics/api/): Monitoring service health and performance by focusing on requests per second (rate), failed requests (errors), and request processing time (duration). 

### Trace analytics visualizations

Trace analytics provides multiple service visualizations (table and map) for logically analyzing service behavior and correctness. The following visualizations assist you in quickly identifying anomalies and errors:

- **Services table**
  - Each column shows one of the RED indicators, along with connected upstream/downstream services and other actions. An example is shown in the following image.

  ![Services Table]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-table.png)
    
  - Filtering is supported using a general-purpose filter selection for any field or filter composition. An example is shown in the following image.

  ![Services Filter selection]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-filter-selection.png)

  - The Service Throughput tooltip provides a quick glance at a service's incoming request trend over the past 24 hours. An example is shown in the following image.

  ![Services throughput tooltip ]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-throughput-tooltip.png)
  
  - The Service Correlation dialog displays an overview of the selected service, including its 24-hour throughput trend, and allows users to deep dive into correlated logs or traces using the serviceName field. An example is shown in the following image.
 
  ![Services service-correlation dialog ]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-correlation-dialog.png)

  - The Service RED Metrics dialog shows an overview of the selected service's RED metrics indicators, including 24-hour error, duration, and throughput rate. An example is shown in the following image.
 
  ![Service RED metrics]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-RED-metrics.png)

  - The Service's Span dialog allows further analysis of a specific trace down to its composing elements, including attributes and associated logs. An example is shown in the following image.

  ![Service's Spans dialog]({{site.url}}{{site.baseurl}}/images/trace-analytics/span-details-fly-out.png)

- **Services map**
  - Each node represents a service, and its color indicates the severity of the associated RED indicator, selectable using the buttons above. An example is shown in the following image.

  ![Services map tooltip]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-details-tooltip.png)
  
  - Selecting a node opens a detailed dialog for that service. This interactive map visualizes service interconnections, helping identify problems by service, unlike the dashboard which identifies issues by operation. Sort by error rate or latency to pinpoint potential problem areas in your application.

  - In the **Services Map** pop-up window, each node represents a connected downstream service that depends on the selected service. The node's color indicates the severity of the associated RED indicator for that service and its connected downstream dependencies. An example is shown in the following image.
  
  ![Services Map single flyout]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-fly-out.png)

- **Trace group dialog**
  - Traces are grouped according to their HTTP API name, allowing the clustering of different traces based on their business functional unit. This view groups traces together by HTTP method and path, enabling you to see the average latency, error rate, and trends associated with a particular operation. For a more focused view, you can filter by trace group name. An example is shown in the following image.

  ![Services Map pop-up window]({{site.url}}{{site.baseurl}}/images/trace-analytics/trace-group-RED-metrics.png)

  - Trace group dialog allows filtering by the group's name and additional filters. It also enables you to dive into the traces table associated with that group. To drill down on the traces that make up a trace group, choose the number of traces in the right column, and then select an individual trace for a detailed summary. An example is shown in the following image.
  
  ![Trace group dialog window]({{site.url}}{{site.baseurl}}/images/ta-dashboard.png)

  - **Trace Details View** shows a breakdown of a single trace in terms of its composing spans and their associated service names. It also provides a waterfall chart of the spans' time and duration interactions. An example is shown in the following image.
    
  ![Detailed trace view]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

---

### OTel demo

To get started with the OpenSearch Dashboards Trace Analytics plugin, use the [ OpenSearch OpenTelemetry Demo](https://github.com/opensearch-project/opentelemetry-demo). This comprehensive, open-source example simulates a distributed web astronomy shop application, generating real-time telemetry data, providing an ideal environment to explore the features of the Trace Analytics plugin.

**Step 1: Set up OpenTelemetry Demo**
  
  - Clone the [OpenTelemetry Demo](https://github.com/opensearch-project/opentelemetry-demo) repository: `git clone https://github.com/opensearch-project/opentelemetry-demo`.
  - Follow the [Getting Started](https://github.com/opensearch-project/opentelemetry-demo/blob/main/tutorial/GettingStarted.md) instructions to deploy the demo application using Docker, which runs multiple microservices generating telemetry data.

**Step 2: Ingest telemetry data**

  - Configure the OpenTelemetry collectors to send telemetry data (traces, metrics, logs) to your OpenSearch cluster, using the [pre-existing setup](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/otelcollector).
  - Ensure [Data Prepper](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/dataprepper) is set up to process the incoming data, handling trace analytics and service map pipelines, submitting data to required indices, and performing pre-aggregated calculations.

**Step 3: Explore trace analytics features**

  - **Services Table**: Go to **Services Table** to view a list of the services in your application. Use the filters to narrow your focus on specific services and analyze their performance using RED metrics.
  - **Services Map**: Examine the **Services Map** to understand the relationships between different services. This visual representation helps identify potential problem areas based on error rates and latency.
  - **Trace Group Dialog**: Use the **Trace Group Dialog** to group traces by HTTP method, allowing to analyze performance trends and error rates for specific operations.
  - **Trace Details View**: Identify a trace with an extended duration and choose it to examine its composition in the **Trace Details View**. This view offers an in-depth breakdown of each span, encompassing their attributes and related log entries.

**Step 4: Perform correlation analysis**
  - Use **Service Correlation** to uncover relationships between various telemetry signals. This feature enables you to navigate from the logical service layer to the actual metrics and logs associated with that service.
